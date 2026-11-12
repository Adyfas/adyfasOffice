---
title: "Antt: Engineering a Governed Multi-Agent Harness"
description: "A technical case study of a desktop harness that plans parallel AI-agent work, isolates changes in Git worktrees, and gates verification and integration."
cover: /images/lab/labAnt.jpg
publishedAt: 2025-12-21
author: Adyfas
category: AI Engineering
gradient: violet
---

## Abstract

Antt is a proposed desktop harness for coordinating AI coding agents across parallel software tasks.
It is not a new foundation model.
Its purpose is to organize how agents receive work, isolate changes, verify results, and request approval before
integration.

The design responds to a common failure mode in multi-agent development: parallel execution increases throughput,
but also increases the chance of conflicting edits, inconsistent assumptions, unverified claims of completion, and
unclear accountability.
Antt therefore treats task boundaries, Git worktrees, checks, audit events, and human approval as first-class
engineering components.

The source material describes a product architecture and proposed behavior.
It does not establish that the full system is implemented or production-ready.

## Research Question

> How can multiple AI coding agents work on independent tasks in parallel without losing change isolation,
> verifiability, or human control?

The proposal assumes a parent agent communicates with the user and drafts a plan.
Antt then validates and schedules that plan, provisions isolated workspaces, routes tasks to worker agents, and
checks returned changes before integration.

The design goal is not to maximize the number of agents.
It is to make delegated work bounded, observable, testable, and subject to approval.

## Why Multiple Chat Sessions Are Not Enough

Simply opening multiple AI chats does not define:

- Which files each agent is allowed to change.
- Which tasks depend on the result of other tasks.
- Whether two agents are editing overlapping code.
- What evidence is required before a task is called complete.
- How a failed check or merge conflict is handled.
- Who approved a plan or the final integration.
- How context, budget, provider limits, and secrets are managed.

Antt proposes explicit task records and a scheduler to make these concerns part of the workflow rather than informal
instructions passed between chats.

## Roles and Trust Boundaries

### Parent Agent

The Parent agent interacts with the user, interprets the request, and proposes tasks and a team structure.
It recommends a plan; it should not silently gain permission to execute arbitrary terminal commands or bypass
approval.

### Antt Orchestrator

Antt validates task structure, checks ownership and dependencies, prepares workspaces, schedules ready work, records
events, and coordinates verification and integration.
The orchestrator acts as the policy-enforcing layer between planning and execution.

### Worker Agents

Worker agents receive bounded tasks with relevant context and work in separate Git worktrees.
Their output is a set of file changes and verification results; a worker's claim that it is done is not itself proof
that acceptance criteria have passed.

### Human Operator

The user approves the plan before execution and approves the destination branch before integration.
Human approval remains a required gate rather than a status message inferred from an agent response.

## Proposed Workflow

The intended workflow is:

1. Translate the user request into tasks with acceptance criteria.
2. Validate ownership, dependencies, workload, assumptions, and budget.
3. Present the plan and risks for user approval.
4. Create an isolated Git worktree for each task.
5. Send each ready task a bounded context bundle.
6. Run independent tasks concurrently within capacity and ownership constraints.
7. Check changed paths, run agreed commands, and review results.
8. Integrate verified work into a local integration branch.
9. Run post-integration checks.
10. Ask the user to approve the target branch before merging.

The user can request a plan revision or cancel before execution.
The design specifies local integration in its initial scope; pushing to a remote or opening a pull request remains a
manual action.

The workflow diagram below is preserved in its original form.

```flowchart
start: mulai | Mulai
process: tujuan | Jelaskan tujuan ke Parent
process: rencana | Parent mengusulkan tugas dan tim
decision: setuju | Pengguna menyetujui rencana?
process: kerjakan | Antt menyiapkan ruang kerja terpisah
process: periksa | Agent bekerja, lalu hasil diverifikasi
decision: lolos | Pemeriksaan dan review lolos?
end: selesai | Pengguna menyetujui penggabungan
end: rencanaperlu | Rencana dikembalikan untuk diperbaiki
end: perbaikan | Tugas perlu diperbaiki sebelum digabungkan

mulai -> tujuan
tujuan -> rencana
rencana -> setuju
setuju -- Tidak --> rencanaperlu
setuju -- Ya --> kerjakan
kerjakan -> periksa
periksa -> lolos
lolos -- Tidak --> perbaikan
lolos -- Ya --> selesai
```

In the diagram, task planning precedes workspace creation, and verification precedes integration approval.
The labels are intentionally left unchanged to preserve the original flowchart.

## Task Model and Dependency Graph

Each task is proposed to contain:

| Field | Purpose |
|---|---|
| Task ID | Stable identity for state and event references |
| Description | Bounded statement of work |
| Acceptance criteria | Observable conditions for completion |
| `ownedPaths` | Files the worker is allowed to modify |
| `dependencies` | Prerequisite task IDs |
| Assignee | The single worker agent responsible for the task |
| Complexity weight | Input for workload balancing |

Dependencies form a directed acyclic graph (DAG).
The scheduler can run tasks whose prerequisites are complete while holding dependent tasks until their inputs are
available.
Cycles must be rejected because no task in a cycle can become ready.

The design targets a workload between 0.7 and 1.4 times the team average, using task complexity rather than raw task
count.
This is a balancing heuristic, not a measure of delivery quality.
The user should review assignments when the plan is ambiguous or has high-risk ownership overlap.

## Plan Approval Gate

Before any worker starts, Antt presents:

- The proposed task graph and task owners.
- Acceptance criteria and file ownership.
- Assumptions and warnings.
- Estimated context and cost.
- Potential file conflicts or missing prerequisites.

This is the first approval gate.
The user can approve, request revisions, or cancel.
The gate prevents an underspecified request from being expanded into parallel modifications without review.

The proposal does not define a universal cost model.
Provider pricing and token estimates can change, so the estimate should be treated as an input to approval rather
than a guaranteed maximum unless enforced by provider-side limits.

## Git Worktree Isolation

Each worker is assigned a separate Git worktree so concurrent edits do not directly overwrite another worker's
working directory.
Worktrees share repository history while keeping checked-out files and branch state separate.

Before dispatch, Antt is designed to compare task `ownedPaths` and identify potential overlap.
After a worker completes, the orchestrator compares the actual changed paths with the task's ownership list.
Out-of-scope changes are rejected or escalated for review.

This mechanism has important limits:

- A worktree is change isolation, **not an operating-system sandbox**.
- It does not prevent an agent from using its own terminal or tools.
- Git state and a usable base commit are prerequisites for reliable worktree creation.
- File ownership checks do not prove that a change is semantically correct.
- Shared APIs may require a separate contract/interface task before parallel implementation.

If the repository is not in a state where safe worktrees can be created, the orchestrator should stop or request a
decision rather than silently weakening isolation.

## Scheduler and Context Bundles

The scheduler periodically checks which tasks are ready and dispatches work up to the configured agent capacity.
The proposed polling target is approximately 250 ms.
Independent tasks can run concurrently if their file ownership and resource constraints do not conflict.

Each task receives a context bundle containing:

- The task description and acceptance criteria.
- Relevant project instructions.
- Files or symbols needed for the assigned work.
- Summaries of completed prerequisite tasks.
- The owned-path boundary and verification commands.

The proposed context-bundle budget is 8,000 tokens.
If essential information cannot fit after summarization, the task should be split, revised, or blocked with an
explicit reason rather than dispatched with incomplete requirements.

Context selection is a quality boundary: excessive context wastes budget, while missing project constraints can
produce incorrect changes.
The proposal should record what context was delivered so results can be reproduced and reviewed.

## Verification and Integration Gates

Worker completion is treated as a candidate result, not a merge decision.
The proposed verification pipeline is:

1. Check that changed files are within the task's `ownedPaths`.
2. Run the task's agreed type checks, tests, or other validation commands.
3. Review the diff against acceptance criteria.
4. Reject or return changes that fail checks.
5. Integrate passing work into a local integration branch.
6. Run post-integration checks to detect cross-task regressions.
7. Request the user's approval of the destination branch.

This is the second approval gate.
Merge conflicts or failed post-integration checks should produce explicit repair work rather than being hidden by a
successful status from an individual worker.

The first version is intended to integrate locally.
Remote pushes and pull-request creation remain manual, preserving an explicit boundary around publication.

## Proposed Technical Architecture

Antt is described as an Electron desktop application with a React interface and a framework-independent core:

| Layer | Responsibility |
|---|---|
| React renderer | Conversation, plans, agents, task state, questions, checks, and results |
| Electron main | Desktop lifecycle and controlled access to OS capabilities |
| `@ant/core` | Planning validation, scheduling, state transitions, and orchestration rules |
| Zod schemas | Runtime validation of structured messages and persisted records |
| IPC | Typed communication between renderer and Electron main |
| MCP | Standardized tools exposed to compatible agents |
| ACP or structured API | Preferred task dispatch path for compatible agents |
| JSONL journal | Append-only record of run and task events |
| Git worktrees | Isolated workspaces for concurrent tasks |

The renderer should display state rather than execute Git or control agents directly.
Keeping `@ant/core` independent of Electron and React makes it possible to test scheduling and policy without launching
the desktop UI.

Agent terminal sessions are not intended to be the primary dispatch interface.
An agent protocol or structured API provides a clearer boundary for sending task data and receiving results.

## Event Journal and Recovery

The proposed journal is append-only JSONL.
Events may include plan approval, task start, verification failure, task completion, and integration decisions.
The current UI state can be reconstructed by replaying the event sequence.

This approach supports:

- Auditing who or what changed task state.
- Reconstructing a run after an application restart.
- Diagnosing why a task was blocked or retried.
- Separating immutable history from derived UI state.

JSONL avoids a separate database in the first version and keeps records inspectable.
However, journal growth, rotation, atomic writes, schema versioning, and recovery from a partially written final line
need explicit policies.

## Security and Threat Boundaries

Worktrees reduce accidental file collisions; they do not contain agent execution.
An agent may still have terminal capabilities granted by its own runtime.
The orchestration layer must not describe worktree isolation as a sandbox or as proof that an agent is safe.

Additional proposed controls include:

- Task-scoped file ownership and post-run changed-path checks.
- Explicit plan and integration approval gates.
- Real test and type-check evidence rather than self-reported completion.
- An auditable event journal.
- Secret handling that keeps API keys out of prompts and logs.
- Review of generated commands and provider capabilities.

Residual risks remain:

- Post-run ownership checks detect some violations only after execution.
- A Parent reviewing its own plan can have confirmation bias.
- Conflict detection depends on the accuracy of file ownership and task decomposition.
- Provider quotas or agent-protocol changes can interrupt work.
- Users must still apply their repository's security policy and review sensitive changes.

The architecture needs adversarial testing before use with sensitive repositories or credentials.

## Data Persistence

The first-version proposal uses Git, Markdown, and JSONL rather than a separate database.
This makes project records portable and inspectable.
It also shifts responsibility to file-level schema evolution, journal retention, concurrent writes, and backup policy.

API keys should be managed by the host agent/provider integration and must not be copied into task context or journal
events.
Sensitive output should be redacted before persistence.

## Evaluation Criteria

The proposed architecture should be evaluated on more than the number of agents running simultaneously.
Useful measurements include:

1. **Isolation violations:** changes outside `ownedPaths` per task.
2. **Conflict rate:** overlapping edits and merge conflicts per run.
3. **Verification yield:** failures caught before integration.
4. **Regression rate:** post-integration failures not caught by task-level checks.
5. **Plan quality:** tasks requiring reassignment, splitting, or user clarification.
6. **Recovery:** successful replay after a forced application interruption.
7. **Context efficiency:** acceptance-criteria coverage per token delivered.
8. **Operational cost:** provider usage, retries, and elapsed time per completed task.
9. **Human oversight:** approval points completed and rejected changes traceable to evidence.

The design notes provide targets and architecture choices, but not a controlled benchmark for these measures.
They should be treated as evaluation criteria, not established product results.

## Limitations

- A Git worktree cannot prevent malicious or unsafe actions from an agent runtime.
- File ownership cannot model every semantic dependency between code changes.
- Automated tests may not cover the user-visible behavior affected by a change.
- A parent agent can misinterpret requirements or bias review toward its own plan.
- The 8,000-token bundle and 250 ms scheduler interval are design targets, not proven optimal values.
- Provider rate limits and agent protocol behavior may change over time.
- JSONL requires explicit retention and crash-recovery behavior.
- User approval adds latency but remains necessary for meaningful human control.

## Conclusion

Antt's proposed contribution is a governed execution layer around multi-agent coding.
It turns a request into bounded tasks, checks prerequisites and ownership, isolates work in Git worktrees, dispatches
ready tasks, collects verification evidence, and requires approval before integration.

The central trade-off is straightforward: more gates and checks add workflow time, but make parallel changes more
observable and reviewable.
The design is promising as an orchestration architecture, but its guarantees must not be overstated.
Worktree isolation is not a sandbox, an agent's completion claim is not test evidence, and a proposed feature is not
an implemented capability.

The next engineering step is a working prototype that validates the event model, task ownership, worktree lifecycle,
verification pipeline, and recovery behavior under injected failures.
Only measured results can establish whether the design reduces conflicts and regressions without adding
unacceptable coordination overhead.

## Project Status

The source material describes Antt as an architecture and product proposal with incomplete implementation.
Performance values and scheduler/context limits are targets or estimates unless verified in a running build.
The downloadable long-form technical document remains available at:

[Read the extended Antt technical notes](/downloads/lab/penjelasan.md)
