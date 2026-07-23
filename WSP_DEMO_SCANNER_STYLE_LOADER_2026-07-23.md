# WSP Demo Scanner-Style Workbook Loader Update

Date: 2026-07-23

## Why this was changed

The Reporting Rescue Scanner felt stronger because the workbook upload is the main experience: the user sees a large drop zone, chooses a workbook, and immediately gets meaningful findings.

The WSP / ATR demo had workbook loading, but it felt secondary because the upload control was presented as a small row inside a dashboard-style page. That made the demo feel less natural than the scanner.

## What changed

- Reworked the WSP demo workbook area into a scanner-style loader.
- Added a large drag-and-drop workbook zone with an Excel-style icon.
- Changed the language from developer wording such as "Apply To Staging" to user-facing wording: "Apply scanned workbook to demo".
- Added drag-over visual feedback.
- Added dynamic loader messaging after a workbook is scanned.
- Kept workbook processing local in the browser.
- Preserved the existing sample workbook and dashboard workflow.

## Current user journey

1. Open the demo.
2. Go to **Load Workbook**.
3. Drop or choose an `.xlsx`, `.xlsm` or `.csv` file.
4. Review instant WSP / ATR / evidence findings.
5. Apply the scanned workbook to refresh the demo dashboard.
6. Continue into bookings, ATR capture, reporting, export and reset.

## Validation completed

- `node --check app.js`
- `node --check client-config.js`
- `node scripts/static-smoke.mjs`
- `node scripts/functional-demo-test.mjs`

All completed successfully before publishing.

## Remaining boundary

This is still a static sales demo. The workbook scanner now feels much closer to the SkillSet SA scanner experience, but a production pilot should still write to SharePoint / Dataverse and report through Power BI.
