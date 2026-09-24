---
name: Verify Exercises
description: "Audit the exercises directory and classify each exercise as done, not done, or unverified from workspace evidence. Use when checking exercise completion or workshop progress."
argument-hint: "Optional exercise or topic to focus on"
agent: "agent"
---

Audit the exercises in `exercises/*.md` using only verifiable workspace evidence. Do not modify files.

## Procedure

1. Read every exercise Markdown file, or limit the audit to the optional focus supplied by the user.
2. Turn each numbered exercise into its required persistent artifacts, configuration, or observable outcomes.
3. Inspect the relevant workspace files, Git status/history, test results, and configuration. Run a narrow validation command only when it can prove a stated requirement.
4. Do not infer completion from related files. Confirm the exact requested artifact, configuration, or outcome.
5. Classify each exercise:
   - **Done**: all requirements that can be checked from workspace evidence are satisfied, with no required interactive or external proof left.
   - **Not done**: a required, checkable artifact or configuration is absent, contradictory, or fails validation.
   - **Unverified**: completion depends on a chat interaction, UI observation, running MCP server, browser action, remote GitHub state, or other evidence unavailable in the workspace.
6. Do not treat missing evidence for an inherently interactive or external step as a failure. Mark it **Unverified** and state what proof is needed.

## Output

Start with a short summary in this form:

`Done: <count> | Not done: <count> | Unverified: <count>`

Then provide one row per numbered exercise:

| Exercise | Status | Evidence | Remaining requirement or proof needed |
| --- | --- | --- | --- |

Use repository-relative Markdown links for file evidence. Keep evidence specific and concise. End with the smallest next action for each **Not done** or **Unverified** item.
