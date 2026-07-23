# Demo Release Freeze

## Purpose

This repository is now treated as a static sales demo for a white-label WSP / ATR training reporting system.

The demo exists to help a potential client understand the workflow:

1. Load workbook-style data.
2. Select an employee.
3. Choose a course and provider.
4. Book or schedule training.
5. Record achieved ATR activity.
6. Review requested vs planned vs achieved reporting.
7. Export evidence and management outputs.
8. Reset the demo safely for the next conversation.

## Freeze rule

Do not keep adding production-style features to this static GitHub Pages demo.

Allowed changes:

- Fix broken links, typos, layout bugs or white-label leaks.
- Improve screenshots, demo wording or sales positioning.
- Keep the demo aligned with the latest client-safe script.

Avoid:

- Pretending localStorage is a production database.
- Adding payment, user login, unattended workflows or client data capture to the static demo.
- Building complex workflow logic here that belongs in Microsoft 365.

## Next build

The next proper build should be a Microsoft 365 pilot backend, using an approved data store such as SharePoint Lists, Dataverse or another controlled Microsoft 365 source.

Priority production capabilities:

- Central saved bookings, ATR records, actions and approvals.
- Controlled master tables for employees, courses, providers and reporting periods.
- Evidence attachments.
- User roles, permissions and audit history.
- Duplicate prevention and mandatory validation rules.
- Power BI reporting over the governed backend.
- Development, Test and Production environments.

## Current release-candidate checks

Run:

```powershell
node --check app.js
node --check client-config.js
node scripts/static-smoke.mjs
node scripts/functional-demo-test.mjs https://lokerh83.github.io/wsp-training-acsa
```

The generated test log is:

```text
FUNCTIONAL_DEMO_TEST_LOG.md
```

## Commercial use

Use this demo to secure a pilot client.

The sales message should be:

> This static demo shows the reporting workflow. The paid pilot replaces the browser-local demo data with a governed Microsoft 365 backend.
