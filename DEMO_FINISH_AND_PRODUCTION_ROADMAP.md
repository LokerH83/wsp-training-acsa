# Demo finish and production roadmap

Date: 2026-07-23

## Current position

The WSP / ATR concept app is already a strong demonstration product. It has the main screens needed to explain the workflow:

- dashboard overview,
- workbook staging / safe CSV import,
- training management,
- provider and course search,
- people profiles,
- WSP / ATR reporting,
- data-quality centre,
- submission readiness workspace,
- action tracking,
- exportable CSV outputs,
- reset-demo controls,
- white-label configuration through `client-config.js`.

The remaining work is split into two different tracks:

1. Finish the demo properly.
2. Convert the browser-local concept into a governed Microsoft 365 / Power Platform system.

These should not be confused. The first is sales/demo readiness. The second is production delivery.

## Track 1 — Immediate demo hardening

### Completed in this pass

- Confirmed the active app now uses the white-label SkillSet SA configuration rather than requiring application-logic edits for each client.
- Added reusable client config presets:
  - `config-presets/skillset-default.client-config.js`
  - `config-presets/acsa-demo.client-config.js`
  - `config-presets/generic-client-template.client-config.js`
- Added `WHITE_LABEL_README.md` to explain how a client-specific version should be created.
- Ran JavaScript syntax checks against:
  - `app.js`
  - `client-config.js`
  - all files in `config-presets/*.js`
- Ran the static smoke script:
  - `scripts/static-smoke.mjs`
  - Result: `Static smoke checks passed: 8 controls, 94 unique IDs.`

### Still to manually verify before a client demo

Run the complete journey in a browser:

1. Load the app.
2. Confirm the client name, app title, colours, logo or initials fallback, subtitle and privacy text display correctly.
3. Stage the sample workbook.
4. Search providers and courses.
5. Create or edit a training booking.
6. Capture ATR / achieved training status.
7. Open people profiles and test search.
8. Use report filters.
9. Export filtered CSV.
10. Open the data-quality centre.
11. Open a submission workspace item.
12. Assign owner, due date, status, evidence note and management sign-off.
13. Export the action register.
14. Download or print the readiness pack.
15. Reset demo state.
16. Refresh the browser and confirm the reset state remains clean.

### Demo polish checklist

Before showing the app to a client:

- Remove or hide any wording that sounds like internal development notes.
- Confirm all visible data is synthetic.
- Confirm the client preset does not claim official SETA, B-BBEE or compliance output.
- Confirm every button either performs a visible action or is clearly labelled as a demo-only control.
- Keep a backup screenshot deck in case internet, GitHub Pages or browser storage fails.
- Keep a short spoken demo script ready.

## Track 2 — Convert the demo into a real governed system

The biggest remaining gap is not another screen. It is replacing browser-local synthetic data with governed data, workflow, security and reporting infrastructure.

### Data architecture

Required production work:

- Replace synthetic browser data with a central data store.
- Choose the production backend:
  - Dataverse for a full Power Platform solution, or
  - SharePoint Lists for a lightweight Microsoft 365 implementation.
- Create master tables/lists for:
  - Employees,
  - Courses,
  - Providers,
  - Training Requests,
  - WSP Plans,
  - ATR Actuals,
  - Bookings,
  - Evidence,
  - Submission Actions,
  - Reporting Periods.
- Build controlled imports for:
  - headcount,
  - WSP plan data,
  - ATR actuals,
  - provider and course catalogues.
- Add validation rules for mandatory fields, duplicates, date windows and reporting-period consistency.

### Operational workflow

Required production work:

- Save bookings, ATR records, quality actions and approvals centrally.
- Add evidence attachment storage.
- Add user roles and permissions.
- Add audit history for changes and approvals.
- Add duplicate prevention.
- Add management sign-off.
- Add reminder workflows through Power Automate.

### Reporting

Required production work:

- Build or complete the Power BI model.
- Connect Power BI to the production data store.
- Build requested-versus-planned-versus-achieved reporting.
- Add drill-down by:
  - cluster,
  - division,
  - department,
  - region,
  - gender,
  - race,
  - age group,
  - disability,
  - provider,
  - course,
  - funding category,
  - reporting period.
- Add reporting-period validation.
- Add management exports.
- Add refresh monitoring.

### Deployment

Required production work:

- Create Development, Test and Production environments.
- Configure Power Platform authentication.
- Configure GitHub secrets if CI/CD deployment is used.
- Run technical testing.
- Run security and permission testing.
- Run client UAT.
- Produce:
  - admin guide,
  - client handover pack,
  - support guide,
  - backup and restore notes,
  - release notes.

## Recommended production path

For commercial delivery, do not jump straight from static demo to full SaaS.

Recommended path:

1. Use the current static app as a sales/demo asset.
2. Sell a paid discovery or reporting review.
3. Build a client-specific Microsoft 365 pilot using SharePoint Lists first.
4. Add Power Automate reminders and controlled approvals.
5. Connect Power BI.
6. Move larger clients to Dataverse when permissions, audit, volume and lifecycle requirements justify it.
7. Only then consider a repeatable SaaS-style product.

## Commercial message

The honest positioning is:

> This demo shows the reporting workflow and control model. A production version should run inside the client's Microsoft 365 environment, with controlled data, permissions, evidence, approvals and reporting.

Avoid saying:

- fully automated,
- official SETA submission system,
- production-ready SaaS,
- guaranteed compliance,
- connected to client data already.

Use instead:

- demo-safe concept,
- white-label pilot,
- Microsoft 365 reporting workflow,
- controlled implementation path,
- practical WSP / ATR reporting foundation.

## Validation evidence from this pass

Command summary:

```powershell
$node='C:\Users\ThinkPad P1\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node --check .\app.js
& $node --check .\client-config.js
Get-ChildItem .\config-presets\*.js | ForEach-Object { & $node --check $_.FullName }
& $node .\scripts\static-smoke.mjs
```

Result:

```text
Static smoke checks passed: 8 controls, 94 unique IDs.
```

Note: `git status` could not be run in this shell because `git` is not currently available on PATH.
