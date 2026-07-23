# SkillSet WSP Demo Repair — 2026-07-23

## Why this repair was needed

The WSP / ATR demo was functionally useful, but it did not yet feel as strong as the Reporting Rescue Scanner. The scanner already handled real workbook loading in a more convincing way and had a much stronger SkillSet SA visual identity.

The demo also had visual confusion: it was meant to be a white-label training reporting pilot, but some areas still felt like an older ACSA-style demo or a generic blue application shell.

## What changed

### 1. Workbook loading improved

The demo now accepts:

- `.xlsx`
- `.xlsm`
- `.csv`

The workbook import process maps flexible spreadsheet headings into the demo structure, including employee, course, provider, requested/planned/achieved status, dates, costs, evidence and review fields.

Imported workbook rows now also update missing master data in the browser session, so new employees, courses and providers from the uploaded file can appear in the workflow instead of only relying on the original synthetic sample data.

### 2. Excel parsing made explicit

The SheetJS workbook parser is loaded before the application script so the workbook loader is available when the user chooses a file.

If the parser has not finished loading, the app now gives a clear message rather than failing silently.

### 3. Visual shell upgraded

The demo now uses a stronger SkillSet-style visual shell:

- dark green and gold palette
- top navigation instead of the old left-side blue demo menu
- DM Sans typography
- lighter, more professional headline weight
- card layout closer to the SkillSet website and scanner
- gold active navigation indicators
- clearer workbook upload area
- more commercial executive-demo feel

### 4. Branding cleaned up

The default demo branding now says:

- SkillSet SA
- Reporting · Analytics · Insight
- Workbook import · controlled WSP / ATR workflow · Microsoft 365 pilot pattern

This avoids the awkward situation where a public SkillSet sales demo looks like a half-ACSA/half-SkillSet hybrid.

The white-label pattern remains intact: future client branding should still be controlled through `client-config.js`, not scattered through application logic.

## What was validated

The following checks were run after the repair:

- JavaScript syntax check on `app.js`
- JavaScript syntax check on `client-config.js`
- Static smoke test
- Functional demo source-wiring test

Results:

- Static smoke checks passed: 8 controls, 95 unique IDs.
- Functional demo test passed the core demo journey checks:
  - load data
  - select employee
  - choose course/provider
  - book training
  - record ATR
  - view reports
  - export
  - reset demo
  - confirm branding remains configuration-driven

## Manual visual check still recommended

Before using this in a live sales meeting, open the GitHub Pages version and do one human click-through:

1. Open the demo.
2. Go to **Load Workbook**.
3. Load a real `.xlsx`, `.xlsm` or `.csv`.
4. Apply it to the demo.
5. Check dashboard numbers.
6. Book a training intervention.
7. Record achieved ATR activity.
8. Check reports and export.
9. Reset the demo.

## Important boundary

This is still a static sales demo. It processes workbook data locally in the browser and does not save production records to a governed backend.

The production version should still move into a Microsoft 365 backend such as SharePoint Lists, Dataverse, Power Automate and Power BI.

