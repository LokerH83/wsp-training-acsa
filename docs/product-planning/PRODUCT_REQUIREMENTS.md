# Product Requirements

## Product Summary

The SkillSet SDF / WSP / ATR app helps an SDF stage workbook-based training data, review WSP planning activity, compare ATR achievements, identify reporting gaps and export filtered management views.

## Target Users

- SDF Admin
- Training Coordinator
- HR / Learning Manager
- Regional or Department Manager
- Executive or Report Viewer
- IT / Power Platform Admin

## User Problems

- Training records are stored in workbooks that are difficult to reconcile.
- Management needs filtered WSP / ATR views without manually rebuilding reports.
- Date coverage and missing periods are not always obvious.
- Employee, provider and course matching can be inconsistent.
- A full workflow app may be too large to start without first proving the reporting model.

## Core User Stories

- As an SDF, I want to load a workbook so that I can stage training records for review.
- As an SDF, I want to see the date range covered by the workbook so that I know which months are included.
- As an SDF, I want to filter by region, department, provider, course, race, gender, age band and disability so that I can produce targeted management reports.
- As an SDF, I want to export the filtered report to Excel so that I can share it with management.
- As a manager, I want to see requested, planned and achieved training so that I can understand reporting gaps.
- As a training coordinator, I want to book training against planned interventions so that operational follow-up is visible.
- As a training coordinator, I want to capture preferred training window, training date, delivery mode, booking status and evidence requirement so that booking readiness is visible before ATR reporting.

## Functional Requirements

- [Done] Load sample workbook data in the demo.
- [Done] Stage uploaded demo-safe CSV records.
- [Done] Apply staged records to demo data.
- [Done] Search providers and courses.
- [Done] Add a training intervention to the WSP plan.
- [Done] Book training against a plan record.
- [Done] Capture demo booking details for planning visibility.
- [Done] Search people profiles.
- [Done] Filter report rows by management criteria.
- [Done] Copy a filtered management table.
- [Done] Export a filtered management table as CSV.
- [Partial] Show report date or period coverage.
- [Partial] Show missing months when exact date coverage is available.

## Non-Functional Requirements

- [Done] Static GitHub Pages demo.
- [Done] No private client data in the public demo.
- [Done] No server-side code in public demo.
- [Done] Relative paths for GitHub Pages.
- [Future Phase] Production security role model.
- [Future Phase] Audit trail for production updates.
- [Future Phase] Backup and restore plan.

## Out Of Scope For MVP

- Official SETA submission automation.
- Official B-BBEE outcome determination.
- Direct Microsoft Graph integration.
- Outlook automation.
- Dataverse production deployment.
- Authentication inside the public GitHub Pages demo.

## MVP Definition

The MVP proves the reporting workflow: workbook load, review, filter, coverage, export and management summary. It does not replace the client's approved compliance process.

## Future Phase Ideas

- Power BI report pack.
- Dataverse-backed production app.
- Evidence upload and review.
- Approvals.
- Automated reminders.
- Role-based reporting dashboards.
- Client-specific workbook templates.
