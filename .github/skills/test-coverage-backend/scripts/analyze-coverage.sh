#!/usr/bin/env bash
set -euo pipefail

workspace_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)
summary_path="$workspace_root/backend/coverage/coverage-summary.json"
analyzer_path="$workspace_root/backend/scripts/analyze-coverage.mjs"

if [[ ! -f "$summary_path" ]]; then
    printf 'Coverage summary not found at %s\n' "$summary_path" >&2
    printf 'Run "npm test -w backend -- --coverage" from the workspace root first.\n' >&2
    exit 1
fi

node "$analyzer_path"
