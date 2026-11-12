---
title: "Technovate News Bot: Engineering a Hybrid News Pipeline"
description: "A case study of an automated technology-news pipeline combining RSS aggregation, deterministic ranking, AI analysis, and Telegram delivery."
cover: /images/lab/blackhole.png
publishedAt: 2026-10-30
author: Adyfas
category: Research
gradient: sunset
---

## Abstract

This project explores an automated way to discover technology news without manually monitoring dozens of publications.
The system collects RSS items, groups duplicate coverage, ranks candidate stories, uses AI for contextual analysis,
and delivers a curated digest through a Telegram bot.

The central engineering finding is that an LLM should not perform every stage of the pipeline.
Deterministic algorithms are better suited to inexpensive filtering, deduplication, and ranking.
An LLM can then focus on explaining why selected stories matter.
This hybrid design reduced one recorded cycle to approximately 17 seconds, compared with about 80 seconds for a
single-batch AI approach and an estimated 3,600 seconds for manual review.

These figures are project observations, not controlled benchmark results.

## Problem and Research Goal

Creating technology content requires finding relevant developments before writing or analysis can begin.
Manually scanning many news sites is time-consuming and makes it difficult to compare coverage across sources.

The project asks:

> Can an automated news digest reduce collection time while retaining enough context to explain why a story is relevant?

The initial design used an AI provider to search for and summarize news in one step.
The early OpenRouter configuration encountered a reported quota of roughly 50 requests per day.
It also mixed discovery, filtering, and analysis into one expensive and slow operation.

Google News RSS provided a more predictable collection mechanism, but raw feed items introduced new problems:

- Long, inconsistent article text.
- Duplicate coverage of the same event.
- No reliable distinction between broadly covered stories and minor updates.
- Unclear reasoning behind why a story was selected.

The system was therefore redesigned as a staged pipeline.

## Design Evolution

| Experiment | Observation | Resulting design decision |
|---|---|---|
| One AI provider handled search and summaries | Request limits constrained volume | Use RSS feeds as the collection layer |
| Raw Google News RSS items | Long text and repeated stories | Normalize, group, and rank before AI analysis |
| One large AI request for all candidates | About 80 seconds per cycle in one recorded run | Keep deterministic work outside the LLM |
| Hybrid deterministic + AI processing | About 17 seconds in one recorded run | Use AI for selected-story analysis and explanation |

The architecture separates two kinds of work:

1. **Deterministic operations:** fetching, normalization, duplicate grouping, freshness, and ranking.
2. **Contextual analysis:** explaining the relevance and potential angle of selected stories.

This separation reduces token use and avoids spending model requests on stories that can be filtered algorithmically.

## Pipeline Architecture

The service is implemented in Node.js and runs in a serverless environment.
An externally scheduled trigger starts each digest cycle.
RSS sources are fetched concurrently, followed by normalization and ranking.
Candidate article URLs are resolved before selected items are sent to an AI model.
The final digest is delivered to Telegram.

### 1. RSS Collection

The collector fetches dozens of local and international technology RSS feeds in parallel.
The project reports that 34 feeds can be fetched in roughly two seconds in the recorded pipeline.
Feed collection is the input stage; it does not itself determine whether an item is important.

### 2. Normalization and Duplicate Grouping

A major event may appear in many feeds with slightly different headlines.
The system tokenizes titles and applies Token-Jaccard similarity to group likely duplicate coverage.

For token sets \(A\) and \(B\), Jaccard similarity is:

`J(A, B) = |A ∩ B| / |A ∪ B|`

The score estimates headline overlap.
It is a practical grouping heuristic, not proof that two articles describe the same event.
Threshold choice and title normalization affect false merges and missed duplicates.

### 3. Deterministic Candidate Ranking

The pipeline computes a hotness score using three signals:

- **Coverage frequency:** how many sources cover the event.
- **Freshness:** how recently the items were published.
- **Topic relevance:** how closely the items match the technology-news focus.

Candidate selection happens before AI analysis.
This avoids asking a model to rank the full unfiltered feed and makes the selection inputs more inspectable.

### 4. Google News URL Resolution

Google News feed links may be encoded or redirected.
The project found that decoding many links in one batch could disturb their original order.
The implemented approach resolves links individually but concurrently, preserving the relationship between each result
and its input item.

The recorded URL-resolution stage, including preview-image retrieval, takes about one second.

### 5. AI Analysis

Selected candidates are sent to an AI provider to assess why each story may be significant and to propose a useful
editorial angle.
The model is not responsible for deciding whether every feed item should be fetched or deduplicated.

The initial provider was OpenRouter.
The later design uses an OVH-hosted model and a fallback chain across providers/models to handle contention or failure.
Provider rate limits still constrain concurrency, so parallelism must be bounded by each provider's capacity.

### 6. Telegram Delivery and Graceful Degradation

The curated result is sent to Telegram at the end of the scheduled cycle.
If AI providers are unavailable or exceed their timeout, the system can fall back to the deterministically ranked
original headlines instead of failing the entire digest.

This degraded output is less explanatory but keeps the core collection and delivery path useful.
The fallback should be labeled clearly so users can distinguish AI-analyzed results from score-ranked headlines.

## Performance Observations

The chart compares recorded or estimated cycle times for gathering and analyzing 20 technology stories.
The manual-review value is an estimate, while the two automated values come from project experiments.
They should be interpreted as workflow observations rather than a controlled comparison.

```chart
type: line
title: News pipeline latency (seconds)
labels: Manual research | Single AI batch | Hybrid pipeline
values: 3600, 80, 17
```

The single-batch AI approach took about 80 seconds in one recorded run, exceeding the external scheduler's reported
30-second execution window.
The hybrid pipeline completed in about 17 seconds in the same project context.

The request-capacity chart records the project's reported daily limits for different provider configurations.
Provider quotas can change and should be verified before relying on them operationally.

```chart
type: bar
title: Reported daily request capacity
labels: OpenRouter initial | OVH single model | Multi-provider chain
values: 50, 120, 1170
```

The breakdown below reports approximate stage durations for a 17-second digest cycle.
The numbers are operational observations and may vary with feed availability and provider response time.

```chart
type: bar
title: Pipeline stage time (seconds)
labels: Fetch 34 RSS feeds | Resolve URLs | AI curation | Telegram delivery
values: 2, 1, 11, 3
```

AI analysis is the largest reported stage at approximately 11 seconds.
Fetching 34 RSS feeds in parallel takes about two seconds, while URL resolution and Telegram delivery take about one
and three seconds respectively.

## Reliability and Failure Boundaries

The system is designed to degrade gracefully:

- RSS collection can still produce candidate headlines if AI analysis fails.
- A ranked headline digest can be sent when all configured models are unavailable.
- A fallback chain can select another provider/model when the primary is busy or errors.
- Deterministic ranking keeps basic selection independent of the model's availability.

Important operational risks include:

- Feed timeouts or malformed feed items.
- Duplicate-grouping thresholds that merge unrelated stories or leave duplicates.
- Provider rate limits and connection concurrency limits.
- URL-resolution failures and broken preview images.
- AI output that is incomplete, unsupported, or overly confident.
- Serverless execution timeouts if concurrency or provider latency changes.

Provider fallback improves availability but does not guarantee equivalent output quality.
Fallback results should retain provider/model metadata so failures can be diagnosed and analysis provenance can be
understood.

## Research Web Application

After the bot workflow became stable, the project expanded into a web dashboard.
The dashboard archives curated stories in a database and groups them by publication time.
It also provides a place to draft content and interact with an AI assistant connected to the Technovate data.

This changes the system from a transient message-delivery tool into a persistent research workspace.
It also introduces additional engineering concerns:

- Database schema and story identity across repeated feed updates.
- Retention and deduplication of archived items.
- Access control for the dashboard and its data.
- Clear separation between source material and AI-generated analysis.

The website is currently access-restricted; access requires developer approval or allowlisting.

## Limitations and Evaluation Plan

The current timing figures do not establish editorial accuracy or the quality of the hotness score.
A fuller evaluation should measure:

1. Duplicate precision and recall using manually labeled story pairs.
2. Ranking agreement with human editors over a fixed time window.
3. Feed coverage and failure rate by source.
4. End-to-end latency distributions over repeated scheduled runs.
5. Provider failure rate, timeout rate, and fallback frequency.
6. Factuality and usefulness of AI analysis against source articles.
7. Cost and request consumption per digest.

The Token-Jaccard threshold, freshness decay, topic weighting, concurrency limits, and fallback ordering should be
versioned and tested rather than treated as fixed constants.
The current project notes do not provide a controlled evaluation for these dimensions.

## Conclusion

The main engineering contribution is the separation of collection, deterministic selection, AI reasoning, and delivery.
RSS provides the input stream; Token-Jaccard groups similar headlines; a hotness score prioritizes candidates; AI adds
context; and Telegram delivers the result.

This hybrid architecture reduced the reported cycle from about 80 seconds to about 17 seconds and avoided making
every feed item an AI request.
The result is a more bounded pipeline, but it does not by itself prove that selected stories are accurate, important,
or editorially complete.
Future evaluation should measure both operational performance and the quality of the stories surfaced.



## Video
![Dashboard Technovate](/images/lab/video/BotTechnovateDashboard.mp4)


## Links

[Open the Technovate dashboard](https://technovate-id.web.app/)

Dashboard access is restricted and may require developer approval.

[Follow Technovate on Instagram](https://www.instagram.com/technovateid/)
