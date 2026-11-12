---
title: "FiSpeak: Engineering a Local-First Meeting Translator"
description: "An engineering case study of FiSpeak's desktop audio pipeline, model inference, privacy boundaries, latency trade-offs, and implementation gaps."
cover: /images/lab/Fispeak.png
publishedAt: 2026-11-03
author: Adyfas
category: AI Engineering
gradient: sunset
---

## Abstract
![Fispeak Icon](/images/lab/image/FISPEAK.png)
![Fispeak Intro](/images/lab/video/fispeak.mp4)
FiSpeak is a desktop application that captures meeting audio and presents translated speech in an always-on-top interface. This case study examines how the system connects native audio capture, audio normalization, voice activity detection (VAD), speech-to-text (STT), machine translation (MT), rendering, and local persistence.

The local inference path uses faster-whisper for STT and NLLB-200 for MT. Electron owns the desktop lifecycle, capture coordination, IPC, and SQLite database. A Python sidecar owns the audio inference pipeline. A Swift helper captures macOS system audio.

The engineering problem is a balance among latency, translation quality, privacy, memory use, operating-system permissions, and failure recovery. This document distinguishes implemented behavior from measurements and planned work. It is a system case study, not a controlled benchmark or a claim that every target platform is production-ready.

## Research Question and Method
The central question is:

> How can a desktop meeting translator show useful translated speech with low interaction overhead while keeping
> audio processing local by default?

The analysis follows one audio window through the implemented components and records:

- Process boundaries and ownership of data.
- The audio framing and WebSocket contracts.
- VAD, STT, MT, and UI publication behavior.
- Session persistence, model downloads, and recovery paths.
- Measured or estimated latency and memory requirements.
- Known gaps that limit reliability, portability, or deployment.

Performance figures below come from project logs and recorded development measurements. They were not collected under one standardized hardware and audio benchmark. Results will vary with hardware, speech cadence, language pair, model state, and provider.

## System Scope
FiSpeak has two translation modes:

| Mode | Audio source | Translation direction | Output |
|---|---|---|---|
| `LISTEN` | macOS system audio | Remote speaker to `my_lang` | Source text and translation |
| `SPEAK` | User microphone | User to `remote_lang` | Translation and optional speech |

`LISTEN` is intended for understanding a remote meeting participant. `SPEAK` translates the user's microphone input into a concrete target language. The macOS `say` command can read the translated result aloud.

Additional desktop features—notes, checklists, a pomodoro timer, clock, tray, and global shortcuts—use separate UI and data paths. They are included in the application but are not part of the audio inference pipeline.

## Requirements and Engineering Constraints
The design is shaped by constraints that interact rather than exist independently:

1. **Latency:** speech must be segmented before inference; VAD, STT, and MT all contribute to end-to-end delay.
2. **Privacy:** local inference avoids sending audio or text to a provider, but requires model downloads and device memory.
3. **Desktop integration:** an always-on-top window must remain readable without stealing keyboard focus.
4. **Audio compatibility:** sample formats, system-audio APIs, permissions, and device behavior vary by operating system.
5. **Lifecycle correctness:** stop, mode changes, and sidecar failure must not publish stale audio or results.
6. **Resource limits:** Whisper and NLLB run on CPU and together require substantial memory and disk space.
7. **Honest capability reporting:** missing models, unsupported capture, and provider failures must be visible to the UI.

These constraints lead to a local-first design with explicit process ownership and bounded queues. The trade-off is more coordination between Electron, Python, the renderer, and the native helper.

## Process Architecture
| Component | Primary responsibilities | Explicit boundary |
|---|---|---|
| Electron main | Window lifecycle, tray, shortcuts, SQLite, model downloads, audio coordination, resampling, WebSocket, TTS, secrets | Does not run the audio inference models |
| Renderer | Island and panel UI, local UI state, interaction | Does not access Node, the filesystem, API keys, or the sidecar socket |
| Preload | Narrow `window.fispeak` API through `contextBridge` | Does not expose raw `ipcRenderer` |
| Python sidecar | VAD, STT, MT, language mapping, audio events | Does not own the database, windows, or API-key storage |
| Swift helper | macOS system-audio capture and framed stdout | Does not implement UI or persistence |

The Electron main process is the authority for application state and persistence. The sidecar is isolated so an inference failure does not have to terminate the desktop UI. The renderer communicates through a constrained preload API and IPC.

### Why Split the Runtime?
Python provides the model ecosystem and runtime used by faster-whisper and CTranslate2. Electron provides the windowing, tray, global shortcuts, operating-system credential storage, and a web-based UI. Combining them into one runtime would increase integration risk and make desktop lifecycle ownership less clear.

The split introduces a local service boundary, so FiSpeak must manage:

- Sidecar process startup, health checks, ports, exclusive locks, and shutdown.
- WebSocket framing and reconnect behavior.
- Configuration and API-key transfer from main to sidecar.
- Stale job invalidation when stopping or switching engines.
- Error propagation across process and UI boundaries.

### Ownership Rules
- One Electron main process owns SQLite writes.
- One WebSocket connection per Electron runtime owns sidecar communication.
- The renderer sends commands through preload and receives main-process broadcasts.
- The sidecar runs inference but does not persist conversation history.
- The capture helper emits audio; Electron main normalizes and forwards it.

These rules avoid multiple database writers, duplicate sidecar connections, and competing sources of session state.

## End-to-End Data Flow
1. The user starts `LISTEN` or `SPEAK` from the island.
2. Renderer sends a start request through `window.fispeak` and IPC.
3. Electron ensures the sidecar is healthy, opens the WebSocket, creates a SQLite session, sends runtime configuration, and requests model warmup.
4. Capture starts for exactly one source: system audio in `LISTEN` or microphone in `SPEAK`.
5. Electron converts captured audio to mono, applies gain, resamples to 16 kHz, and assembles complete frames.
6. Each frame is tagged as `you` or `remote` and sent to the sidecar as binary WebSocket data.
7. `AudioRouter` maintains a separate rolling buffer for each tag.
8. VAD groups frames into speech windows and enqueues them for STT.
9. STT emits filtered transcript segments to Electron and the renderer.
10. MT translates eligible segments and emits translation events.
11. Renderer updates the matching subtitle row; Electron persists a turn when a translation event arrives.
12. On stop, capture stops, queues are invalidated, stale results are discarded, and the session is closed.

The renderer may show a transcript before its translation arrives. The database stores only completed source/translation pairs, so the visible transcript and saved turn count can differ.

## Audio Acquisition and Wire Contracts
### Microphone Capture
Browser `getUserMedia` is initialized from a hidden renderer window rather than the visible island. The hidden page uses an AudioWorklet to capture microphone samples and transfers buffers to Electron main.

The configured microphone input is 48 kHz mono with echo cancellation, noise suppression, and automatic gain control. The worklet does not resample or play audio. Electron main applies the shared resampler and frame assembler so there is one conversion implementation.

Microphone permission is requested by the operating system. If permission is denied, capture reports an explicit blocked/error state and waits for user action rather than retrying silently.

### macOS System-Audio Capture
The Swift helper supports two capture paths:

| Source | Availability | Permission | Engineering limitation |
|---|---|---|---|
| Core Audio process tap | Default on macOS 14.2+ | No Screen Recording permission | Captures post-volume system mix; mute or zero output volume yields silence |
| ScreenCaptureKit (SCK) | Fallback on supported macOS versions | Screen Recording | Captures the selected display; audio on another display may be missed |

With `--source auto`, the helper selects the tap when available. `FISPEAK_AUDIO_SOURCE=sck` can force ScreenCaptureKit. The helper writes framed data to stdout; Electron parses it and sends PCM into the shared audio pipeline. The helper does not play audio.

### Sidecar Audio Frame
The WebSocket binary contract is fixed:

| Field | Value |
|---|---|
| Tag byte `0x01` | `you` (microphone) |
| Tag byte `0x02` | `remote` (system audio) |
| Sample format | Float32 little-endian |
| Sample rate | 16,000 Hz |
| Channels | One (mono) |
| Samples per frame | 3,200 |
| Duration per frame | 200 ms |
| PCM payload | 12,800 bytes |
| Complete tagged frame | 12,801 bytes |

The sidecar rejects malformed frame sizes. The tag preserves the translation direction without requiring a second audio connection.

### Resampling and Framing
Electron main downmixes channels, applies gain `0.9`, resamples to 16 kHz, and emits only complete frames. For 48 kHz input, each 200 ms output frame requires 9,600 input samples. The frame assembler carries partial samples across capture callbacks instead of dropping them.

The resampler uses a box filter for integer ratios such as 48 kHz to 16 kHz and linear interpolation otherwise. RMS is calculated per frame for the audio meter. Resampling in both the worklet and main would risk inconsistent timing and sample counts, so it remains centralized.

### Exclusive Capture Modes
| Mode | Microphone | System audio |
|---|---:|---:|
| `LISTEN` | Off | On |
| `SPEAK` | On | Off |

Enabling both sources would mix the user's voice into the remote stream and may create echo or duplicate transcription. Mode changes therefore stop the inactive source before starting the selected one.

## Sidecar Lifecycle and Protocol
The sidecar exposes a narrow REST surface for health/language discovery and a WebSocket for configuration and streaming. The documented endpoints are `/health`, `/languages`, `/ws`, and `/shutdown`. Model downloads and session persistence remain in Electron rather than being added to the Python service.

Startup and connection sequence:

1. Bind to `127.0.0.1:8765`; if unavailable, scan ports `8766` through `8770`.
2. Acquire an exclusive lock to prevent a second sidecar instance.
3. Write the active port to `userData/sidecar.port`.
4. Report readiness and answer a health check.
5. Electron connects and sends configuration and heartbeat messages.

The application heartbeat is used instead of the server framework's independent WebSocket heartbeat. The bridge distinguishes binary audio from JSON text events. It queues a bounded number of control frames before socket-open and reconnects with a staged delay.

On application shutdown, Electron requests sidecar shutdown, waits for exit, and terminates the process if the timeout expires. Cleanup is idempotent and includes microphone tracks, the native helper, windows, tray, shortcuts, and database handles.

## VAD and Speech Segmentation
FiSpeak's outer VAD is a deterministic rolling-energy gate, not a neural speech classifier. Its purpose is to decide when to submit a window to Whisper; Whisper also uses its own Silero VAD filter.

The outer VAD:

- Calculates RMS for each 200 ms frame.
- Uses a dynamic threshold: `max(0.004, 0.25 × p95(last 50 RMS frames))`.
- Retains two frames (400 ms) of pre-roll to reduce clipped initial syllables.
- Opens a window when frame energy crosses the threshold.
- Closes after the configured consecutive-silence interval.
- Rejects speech shorter than the minimum duration.
- Forces a submission when the maximum window is reached.
- Carries an 800 ms overlap into the next window to reduce boundary word loss.
- Calculates timestamps from absolute frame indices, not wall-clock callbacks.

Quality presets balance segmentation delay and sentence completeness:

| Preset | Beam size | Maximum window | Silence threshold | Minimum speech |
|---|---:|---:|---:|---:|
| `fast` | 1 | 6 s | 900 ms | 1,000 ms |
| `balanced` | 3 | 10 s | 1,200 ms | 1,000 ms |
| `quality` | 5 | 14 s | 1,400 ms | 1,000 ms |

A long window can preserve more sentence context but delays submission. Continuous speech is still flushed at the maximum window to prevent unbounded waiting.

## Speech-to-Text
The local STT adapter uses faster-whisper with the small model in CPU `int8` mode. It is lazy-loaded and uses one model instance with two workers. CPU threads are configured as approximately half the available CPU count.

Key decoding behavior:

- `beam_size` comes from the selected quality preset.
- `condition_on_previous_text=False` avoids carrying hallucinated or repeated context across windows.
- Whisper's internal VAD filter is enabled with a 450 ms silence threshold.
- Language can be detected per window or supplied from configuration.
- A language becomes sticky after five consecutive detections with confidence at least `0.45`.
- Falling confidence releases the sticky language so detection can resume.
- Segment confidence is derived from `exp(avg_logprob)` and clamped to `[0, 1]`.

### Hallucination and Duplicate Filtering
The pipeline filters:

- Text shorter than three characters.
- Segments with `no_speech_prob > 0.6`.
- Segments with `avg_logprob < -1.0`.
- Known silence hallucinations and repeated text within a short interval.
- Overlap words repeated at the start of the next VAD window.

The sidecar compares up to six trailing words with the next window and removes matching leading words when at least two words overlap. The renderer applies a second exact-text deduplication check over a four-second interval. These safeguards address different forms of duplication and should remain covered by regression tests.

## Machine Translation and Language Routing
The local MT implementation is NLLB-200 distilled 600M using CTranslate2 `int8` on CPU. It lazy-loads the model, batches segments by source language, and caches up to 2,000 translations in an LRU cache. Sentences above 480 tokens are split. If source and target languages match, translation is skipped.

Direction is determined by the stream tag:

| Stream | Target |
|---|---|
| `remote` | `my_lang` |
| `you` | `remote_lang` |

Language mappings are centralized in the sidecar and exposed through `/languages`. The mapping connects UI codes, Whisper codes, and NLLB/FLORES codes for 17 languages. The frontend does not maintain a second language-code registry.

When `remote_lang=auto`, the `remote` stream can be detected, but the `you` stream has no concrete translation target. SPEAK therefore requires an explicit target language.

If translation output equals the source after normalization, it is marked with a warning quality state. The sidecar emits one translation event per eligible segment.

## Provider and Data Boundaries
| Provider | STT | MT | Data sent outside the device |
|---|---|---|---|
| Local | faster-whisper | NLLB-200 | None during inference |
| OpenRouter | Remote Whisper by default; local STT is optional | Remote model | Audio if remote STT is selected; text for remote MT |
| Ollama | Local Whisper | Local Ollama endpoint | None when endpoint is on the user's machine |
| Custom | Configurable OpenAI-compatible endpoint | Configurable endpoint | Depends on endpoint and selected STT/MT paths |

Remote STT sends audio; remote MT sends transcript text. With `localStt` enabled, audio remains local while translated text may leave the device. Provider errors are surfaced to the UI; there is no silent fallback from a selected remote provider to local inference.

API keys are owned by Electron main and stored through Electron `safeStorage`. The renderer can query whether a provider key exists but does not receive its plaintext value. The main process passes a key to the sidecar only when needed for a remote request.

## Session Persistence
SQLite is stored below Electron's `userData` directory. It contains settings, notes, sessions, and turns; WAL mode allows reads while writes are active. Foreign keys are enabled so deleting a session cascades to its turns.

| Entity | Important fields and behavior |
|---|---|
| Session | UUID, start/end timestamps, language/model metadata, turn count |
| Turn | Chunk ID, session ID, stream tag, time range, source/target language and text, confidence, quality |
| Notes | Text or checklist items; oldest notes are removed above the 50-note limit |
| Settings | JSON values stored by key; defaults are merged for newly introduced settings |

Turns are persisted only after a `translation` event, because only then is the source/target pair complete. Transcript-only segments, raw audio, audio-level events, and notices are not persisted as turns. The History view loads up to 30 sessions. Sessions and turns have no automatic retention policy at present.

The turn ID uses the sidecar chunk ID, and `INSERT OR REPLACE` avoids duplicate rows on repeated delivery. `turn_count` is incremented per record operation, so a rare repeated chunk may make the count exceed the number of rows.

## Model Registry and Downloads
The current registry contains two model artifacts:

| Model | Approximate size | Runtime |
|---|---:|---|
| faster-whisper small | 486 MB | CPU `int8` |
| NLLB-200 distilled 600M | 661 MB | CTranslate2 CPU `int8` |

The total download is approximately 1.15 GB. Models are downloaded on demand and are not bundled into the application installer. This keeps the installer smaller and allows model files to be updated separately.

The downloader supports HTTP Range resume and cancellation. Files are written to partial paths and renamed after download. Current verification checks file sizes; it does not verify SHA-256 hashes or pin model revisions. Correct file size alone cannot prove artifact integrity.

Model states include `missing`, `partial`, `installed`, `downloading`, and `error`. If a model is missing, the sidecar reports a structured readiness error and the UI can direct the user to Downloads. Inference model loading is lazy, so launching the desktop UI does not itself require model availability.

### Model-Selection Gap
The settings expose `base`, `small`, and `medium`, but the registry currently contains only small. The STT loader always points to the small-model directory. Consequently, a `medium` value in configuration is not evidence that a medium model was loaded. Actual multi-model support requires registry entries, model-specific paths, per-model download status, and UI disclosure of each model's memory/latency trade-off.

## Dynamic Island and UI State
The island is a transparent always-on-top window whose visible card is smaller than the window bounds. A 28 px gutter protects its CSS shadow from clipping. The main process owns window sizing and placement; the renderer reports the card rectangle for hit testing.

| State | Visible behavior |
|---|---|
| `IDLE` | Compact clock and status |
| `EXPANDED_TOOL` | Dashboard with clock, focus timer, notes, and actions |
| `TRANSLATE_ON` | Full translation card |
| `TRANSLATE_MINI` | Compact stop/status control during translation |
| `ERROR_PILL` | Short error state |
| `HIDDEN` | Island window hidden |

Important interaction constraints:

- The island does not call `focus()`; `showInactive()` is used where appropriate.
- Click-through is calculated against the card rectangle rather than the full transparent window.
- Cursor polling runs in main at roughly 60 ms intervals.
- Expansion resizes before animation; contraction waits until the visual transition is complete.
- Border radius remains fixed to avoid a visible shape pop.
- Drag is supported only in floating placement.

The UI includes an audio meter, mode switch, language controls, transcript list, quality indicator, and Stop action. The renderer retains at most 60 transcript rows. The panel provides Settings, Downloads, History, and a Summary tab that is currently an empty state.

## Latency and Resource Evaluation
Reported quality-preset values measure different stages and should not be added as if they were one benchmark:

| Measurement | Recorded value | Context |
|---|---:|---|
| First subtitle | About 7–10 s | From speech start, including segmentation and warmup |
| STT for a 14 s window | 2.3–4.0 s | Whisper small, CPU |
| MT for a batch of 2–3 sentences | 0.96–4.5 s | NLLB `int8`, CPU |
| STT for 30 s of audio | About 9.7 s | Recorded benchmark |
| `fast` end-to-end | 2.9 / 4.6 / 7.5 s | Minimum / median / maximum in earlier measurements |

The first output depends on speech cadence. The VAD maximum window is a bound, not a fixed wait: a natural silence may close a shorter window sooner. Warmup moves model-loading cost to session start but does not remove segmentation or inference time.

### Relative Latency Summary
The chart uses the upper end of recorded ranges for individual stages. The first-subtitle value is an end-to-end observation and overlaps the component measurements. Values are not additive or directly comparable workloads.

```chart
type: bar
title: Recorded latency upper bounds (seconds)
labels: STT 14-s window | MT per batch | First subtitle
values: 4, 4.5, 10
```

### Model Download Footprint
Model download size is not the same as resident memory during inference. The chart represents the approximate disk footprint of the two local models.

```chart
type: bar
title: Approximate model download size (MB)
labels: Whisper small | NLLB-200
values: 486, 661
```

Estimated active memory use is 1.5–2 GB, including the two models and desktop runtime. Recorded model memory is approximately 500 MB for Whisper small and 700 MB for NLLB. Electron and renderer processes add an estimated 200–400 MB. These are approximate development observations, not memory guarantees.

CPU thread scaling is not linear. In one recorded 30-second STT test, two threads took 17.9 seconds, four took 9.7 seconds, and eight took 20.9 seconds. This illustrates why thread counts and hardware should be measured rather than assumed.

### Measurement Limitations
- Values are from development logs and project notes, not a controlled multi-device benchmark.
- Network latency for remote providers has not been systematically measured.
- GPU inference is not implemented or profiled.
- Results have not been standardized across Intel Mac, Windows, and Linux.
- Word error rate, translation adequacy, and human-rated quality have not been reported here.

## Reliability and Failure Handling
| Failure condition | Expected response |
|---|---|
| Sidecar missing or health timeout | Report an error; keep unrelated UI features available |
| Port conflict | Scan configured fallback ports; fail visibly if all are occupied |
| Duplicate sidecar | Exclusive lock rejects the second process |
| Model unavailable | Emit readiness error and direct the user to model download |
| Microphone denied | Report a blocked state and expose the relevant settings action |
| System audio unavailable | Report unsupported/unavailable capture |
| Helper exits unexpectedly | Stop that capture path and publish an error |
| WebSocket unhealthy | Reconnect with staged delay; restart sidecar after failed health checks |
| Queue full | Drop the oldest stale window to prevent unbounded latency |
| Remote provider error | Show an explicit error; do not silently change providers |
| TTS unavailable | Keep the translated text visible and report that speech output is unavailable |

Backpressure is bounded:

- STT queue maximum: three windows.
- MT queue maximum: three batches.
- If overloaded, the oldest work item is dropped rather than allowing subtitles to become increasingly stale.
- If the WebSocket buffer exceeds 5 MB, remote audio frames may be dropped while preserving the `you` stream.

## Stop Semantics and Concurrency
Stopping is a coordinated invalidation operation, not merely a UI state change:

1. Mark capture inactive.
2. Stop microphone tracks and AudioWorklet.
3. Stop the native helper; escalate from `SIGTERM` to `SIGKILL` after its timeout.
4. Reset the resampler and frame assembler.
5. Send the sidecar a `translate_off` state.
6. Increment the sidecar generation counter and clear queued STT/MT work.
7. Ignore in-flight model results whose generation no longer matches.
8. Clear the active session ID and reject late events in Electron main.
9. Clear the renderer transcript for the next session.

Whisper inference is not guaranteed to be cancellable mid-call. Generation IDs prevent its late result from becoming a visible or persisted result after stop or engine switch. The same mechanism avoids publishing results produced under an obsolete provider configuration.

## Privacy and Security Boundaries
### Local Data
- Audio is streamed through memory and is not written to disk by the capture pipeline.
- Transcripts and translations are stored locally in SQLite.
- SQLite is not application-encrypted; at-rest protection relies on OS account controls and disk encryption.
- No analytics or crash-reporting telemetry is described in the current implementation.
- Default logs contain operational metadata rather than transcript text.
- Debug logging may include the first 80 characters of a segment dropped by the hallucination filter.

### Renderer and Secrets
Electron windows use `contextIsolation`, disable `nodeIntegration`, and enable sandboxing. Window-opening requests are denied. The preload exposes a small API rather than raw IPC access. API keys are encrypted with `safeStorage`; the renderer does not receive plaintext keys.

### Remote Provider Disclosure
Selecting a remote STT provider sends audio outside the device. Selecting remote MT sends transcript text outside the device. Keeping STT local does not imply that MT is local. The UI and documentation should make the selected data path clear before a session starts.

### Model Supply Chain
Models are fetched from a model hub and currently verified by size only. SHA-256 verification and pinned revisions are not implemented. A production downloader should pin revisions, verify each file hash, and reject mismatches.

### Platform Permissions
| Capture path | Permission requirement |
|---|---|
| Microphone | OS microphone permission |
| Core Audio process tap | No Screen Recording permission on macOS 14.2+ |
| ScreenCaptureKit fallback | Screen Recording permission |
| Accessibility / Input Monitoring | Not required by the current flow |

## Licensing and Distribution Constraints
| Component | License recorded in project notes | Engineering implication |
|---|---|---|
| faster-whisper / Whisper | MIT | Review dependencies and model terms separately |
| NLLB-200 | CC-BY-NC 4.0 | Current local MT model is not suitable for assumed commercial use |
| Kokoro (planned) | Apache 2.0 | Planned TTS path; verify actual weights and dependencies |
| Electron / React | MIT | Include notices for distributed dependencies |

The `TranslationEngine` interface provides a seam for replacing NLLB. An alternative model still requires license review, language coverage evaluation, quality testing, and performance measurement; replacing the implementation does not automatically make the product commercially compliant.

Models are downloaded separately rather than bundled. This reduces installer size but makes first-run download, integrity verification, and offline setup part of the product engineering problem.

## Current Implementation Status
### Implemented
- Electron island, state machine, tray, global shortcuts, notes, checklist, and pomodoro.
- Settings and local session/turn persistence in SQLite.
- Hidden-window microphone capture with AudioWorklet.
- macOS system audio via Core Audio process tap, with ScreenCaptureKit fallback.
- One WebSocket audio path to a Python FastAPI sidecar.
- Rolling-energy VAD, faster-whisper small, and NLLB-200 CT2 `int8`.
- LISTEN/SPEAK mode separation, translation events, and stale-result invalidation.
- On-demand model downloading with Range resume and cancellation.
- Local, OpenRouter, Ollama, and custom OpenAI-compatible provider options.
- macOS `say` speech output for the translated SPEAK result.

### Not Implemented or Incomplete
- AI meeting summaries and transcript export.
- Kokoro TTS and TTS volume control.
- Windows WASAPI and Linux Pulse system-audio capture.
- A functional `base`/`medium` Whisper model selection.
- Model hash verification and pinned model revisions.
- Speaker diarization and virtual microphone output.
- PyInstaller sidecar packaging, tested installers, and full release signing/notarization.
- Automated retention for sessions, turns, and daily logs.
- System-audio device selection and robust device-loss recovery.

## Engineering Priorities
Before release, the highest-priority work is to package the sidecar, validate a clean-machine install, pin and hash model artifacts, and make the Whisper selection match the model actually loaded. End-to-end latency and translation quality also need repeatable benchmarks on documented hardware and language pairs.

Reliability work includes device-loss recovery, input selection, first-run permission guidance, data/log retention, overload testing, and multi-display SCK validation. Provider configuration should clearly disclose whether audio or transcript text leaves the device.

The remaining roadmap includes summary/export, Kokoro TTS and volume control, Windows/Linux system-audio capture, speaker diarization, virtual microphone output, automatic updates, and a commercially licensed translation engine. Commercial distribution also requires resolving the current NLLB license constraint.

## Operational Verification
The project notes report 49 Vitest tests and 52 pytest tests, covering island geometry, audio conversion and framing, sidecar lifecycle, language mapping, VAD, STT filtering, provider switching, WebSocket behavior, and remote errors. These counts do not establish end-to-end coverage across all platforms.

A release smoke test should verify LISTEN and SPEAK, stop-with-no-late-events, History persistence, model/permission failures, provider errors, sidecar restart, and clean helper/sidecar shutdown.

## Findings
The most important architectural property is explicit ownership: Electron owns application lifecycle and persistence; the sidecar owns inference; the renderer owns presentation; the helper owns system-audio capture. This keeps each subsystem replaceable, but makes cross-process contracts and failure states central to correctness.

The main performance bottleneck is not only model inference. VAD windowing introduces a deliberate wait before STT begins, and the translation stage adds another sequential dependency for each segment. Batching and parallel STT/MT queues improve throughput, while bounded queues and drop-oldest behavior prioritize freshness over completeness when the device falls behind.

Local-first operation changes the resource and distribution profile rather than eliminating costs. It requires roughly 1.15 GB of model storage, around 1.5–2 GB of active memory, and CPU capacity sufficient for continuous inference. Remote providers trade local resource use for network dependency and a wider data boundary.

The largest release risks are unsupported system-audio platforms, incomplete packaging, unverified model integrity, the mismatch between the Whisper setting and the actual loaded model, and the NLLB non-commercial license. These are implementation constraints, not cosmetic documentation issues.

## Conclusion
FiSpeak is an end-to-end desktop audio pipeline, not a single translation model. Its reliability depends on maintaining the contracts between capture, resampling, framing, VAD, inference, event delivery, UI state, and SQLite persistence.

The current design offers a local inference path and a clear separation of process responsibilities. However, observed latency is conditional, target-platform support is incomplete, and model, packaging, and licensing gaps remain. An engineering evaluation should therefore distinguish implemented behavior, measured behavior, and planned behavior before drawing conclusions about production readiness.

## Github Opensource

[Fispeak](https://github.com/Adyfas/Fispeak.git)

