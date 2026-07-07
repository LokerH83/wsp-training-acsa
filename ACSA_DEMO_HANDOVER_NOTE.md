# ACSA Demo Handover Note

Final QA pass completed on the demo-safe ACSA SDF dashboard, including Overview polish, workbook staging, provider/course search, booking workflow, people profiles, reports filters, reset and executive summary copy.

## Files changed

- `index.html`, `app.js`, `styles.css`
- `data/demo-snapshot.js`
- `sample-workbooks/ACSA_SDF_Demo_Workbook.csv`
- `README.md`
- `docs/CLIENT_DEMO_INSTRUCTIONS.md`
- `docs/DEMO_DATA_POLICY.md`
- `docs/DEPLOYMENT_NOTES.md`

## What now works

- Polished Overview with process strip, executive KPIs, grant exposure estimate, visual bars, training operations KPIs and compact actions.
- Sample workbook staging.
- Manage Training entry for request, WSP plan and ATR actual records.
- Book Training workflow and Training Bookings table.
- Booking actions can mark completed, mark missed or prefill ATR capture.
- Provider and course search.
- People profile drill-down, including Training Bookings.
- Reports page filtering and drill-down by demographics, training dimensions and booking status.
- Reset restores the synthetic baseline, including 8 bookings.
- Executive summary copy includes requested, planned, achieved, reporting gaps, review items and next action.

## QA fixes

- Fixed confirmation item binding so the dashboard and Reports show non-zero review items.
- Added Reports Reset Filters action.
- Fixed Reports Reset Filters so selected filter options return to All and the full matrix is restored.
- Added missing profile demographics: Region / Cluster, Division, Department and Age.
- Tightened executive summary wording for client-ready demo language.

## Baseline counts

- Employees: 36
- Providers: 8
- Courses: 28
- Requested/Suggested: 34
- Planned WSP: 28
- Achieved ATR: 21
- Bookings: 8
- Reporting gaps: 19
- Review items: 0

## Demo scope

- Client-facing demo uses synthetic data.
- Production security, Dataverse integration and official submission rules are implementation-phase items.
- Booking is a demo-only simulation and does not call Outlook, Microsoft Graph or Dataverse.

## Ready to show Alwyn?

Yes, for a demo-safe walkthrough using synthetic data only.
