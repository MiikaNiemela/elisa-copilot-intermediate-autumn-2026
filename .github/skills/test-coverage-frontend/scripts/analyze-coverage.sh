#!/usr/bin/env bash
set -euo pipefail

workspace_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)
frontend_root="$workspace_root/frontend"
summary_path="$frontend_root/coverage/coverage-summary.json"
final_path="$frontend_root/coverage/coverage-final.json"

if [[ ! -f "$summary_path" ]]; then
    printf 'Coverage summary not found at %s\n' "$summary_path" >&2
    printf 'Run "npm test -w frontend -- --coverage" from the workspace root first.\n' >&2
    exit 1
fi

WORKSPACE_ROOT="$workspace_root" FRONTEND_ROOT="$frontend_root" SUMMARY_PATH="$summary_path" FINAL_PATH="$final_path" node --input-type=module <<'NODE'
import { existsSync, readFileSync } from 'node:fs';
import { relative, sep } from 'node:path';

const frontendRoot = process.env.FRONTEND_ROOT;
const summaryPath = process.env.SUMMARY_PATH;
const finalPath = process.env.FINAL_PATH;

const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
const final = existsSync(finalPath) ? JSON.parse(readFileSync(finalPath, 'utf8')) : null;

const PRIORITY_PATTERNS = [
    { pattern: /src\/routes\//, boost: 15, label: 'route' },
    { pattern: /src\/api\/client\.ts$/, boost: 10, label: 'api' },
    { pattern: /src\/components\//, boost: 5, label: 'component' },
    { pattern: /src\/App\.tsx$/, boost: 5, label: 'app' },
];

function priorityFor(relPath) {
    return PRIORITY_PATTERNS.find(({ pattern }) => pattern.test(relPath)) ?? { boost: 0, label: '' };
}

function categorize(score) {
    if (score === 0) return 'untested';
    if (score < 50) return 'critical';
    if (score < 80) return 'weak';
    return 'ok';
}

function uncoveredRangesFor(absPath) {
    const fileData = final?.[absPath];
    if (!fileData) return [];

    const lines = new Set();
    for (const [id, hits] of Object.entries(fileData.s ?? {})) {
        const location = fileData.statementMap?.[id];
        if (hits === 0 && location) {
            for (let line = location.start.line; line <= location.end.line; line += 1) lines.add(line);
        }
    }

    const ranges = [];
    let start;
    let previous;
    for (const line of [...lines].sort((a, b) => a - b)) {
        if (start === undefined || previous === undefined) {
            start = line;
        } else if (line !== previous + 1) {
            ranges.push(start === previous ? `${start}` : `${start}-${previous}`);
            start = line;
        }
        previous = line;
    }
    if (start !== undefined && previous !== undefined) {
        ranges.push(start === previous ? `${start}` : `${start}-${previous}`);
    }
    return ranges;
}

const rows = Object.entries(summary)
    .filter(([absPath]) => absPath !== 'total')
    .map(([absPath, metrics]) => {
        const relPath = relative(frontendRoot, absPath).split(sep).join('/');
        const lines = metrics.lines?.pct ?? 0;
        const branches = metrics.branches?.pct ?? 0;
        const functions = metrics.functions?.pct ?? 0;
        const score = lines * 0.5 + branches * 0.3 + functions * 0.2;
        const { boost, label } = priorityFor(relPath);
        return {
            absPath,
            relPath,
            lines,
            branches,
            functions,
            score,
            priorityScore: 100 - score + boost,
            label,
            category: categorize(score),
        };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore || a.score - b.score);

const total = summary.total ?? {};
const buckets = { untested: [], critical: [], weak: [], ok: [] };
for (const row of rows) buckets[row.category].push(row);

const output = [
    '# Frontend Test Coverage Recommendations',
    '',
    `**Totals** - lines: ${(total.lines?.pct ?? 0).toFixed(1)}% | branches: ${(total.branches?.pct ?? 0).toFixed(1)}% | functions: ${(total.functions?.pct ?? 0).toFixed(1)}%`,
    '',
    'Files are ranked by need for tests. Routes, API calls, interactive components, and application setup receive a priority boost.',
    '',
];

for (const [title, items] of Object.entries(buckets)) {
    if (!items.length) continue;
    output.push(`## ${title[0].toUpperCase()}${title.slice(1)} (${items.length})`, '');
    output.push('| Priority | File | Lines % | Branches % | Functions % | Tag | Uncovered lines |');
    output.push('| --- | --- | --- | --- | --- | --- | --- |');
    for (const row of items) {
        const ranges = uncoveredRangesFor(row.absPath);
        const shown = ranges.slice(0, 6).join(', ');
        const more = ranges.length > 6 ? ` (+${ranges.length - 6} more)` : '';
        output.push(`| ${row.priorityScore.toFixed(1)} | \`${row.relPath}\` | ${row.lines.toFixed(0)} | ${row.branches.toFixed(0)} | ${row.functions.toFixed(0)} | ${row.label || '-'} | ${shown || '-'}${more} |`);
    }
    output.push('');
}

const top = rows.slice(0, 3);
if (top.length) {
    output.push('## Top recommendations', '');
    for (const row of top) {
        output.push(`- **\`${row.relPath}\`** - ${row.category}, score ${row.score.toFixed(1)}/100${row.label ? ` (${row.label})` : ''}. Add tests for exported behavior and uncovered branches.`);
    }
    output.push('');
}

process.stdout.write(output.join('\n'));
NODE
