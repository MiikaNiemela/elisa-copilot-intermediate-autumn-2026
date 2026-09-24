---
# Run this workflow manually from the GitHub Actions page.
on: workflow_dispatch

# The agent can read repository issues.
permissions:
  contents: read
  issues: read
  copilot-requests: write

# Give the agent access to GitHub issue tools.
tools:
  github:
    toolsets: [issues]

# Allow the agent to create one new issue.
safe-outputs:
  create-issue:
    max: 1
---

# Simple repository check

Review the open issues in this repository.

Create a new GitHub issue titled **Repository check summary**.

In the issue, include:

- A short summary of the open issues.
- The three issues that need attention first.
- One simple next step for the maintainer.

Keep the response short, clear, and beginner-friendly.
