# WSP Demo Product Command Pass — 2026-07-23

## Objective

Raise the SkillSet SA WSP / ATR demo closer to the visual and commercial standard set by the SkillSet SA website and the Reporting Rescue Scanner.

The previous version worked, but it still felt too much like a dashboard wrapped in a green theme. This pass pushes it toward a stronger sales-demo experience: workbook first, management-risk focused, and visually closer to the premium SkillSet command-centre style.

## What changed

- Rebuilt the overview hero into a larger product command surface.
- Added a direct workbook-first action: **Scan a workbook**.
- Added a secondary action: **View reporting control**.
- Replaced the old simple “Start with the workbook” card with a richer diagnostic card.
- Added red / amber / green triage language:
  - Red: gaps that need management attention.
  - Amber: records needing review.
  - Green: clean demand, planned activity and ATR proof alignment.
- Added a Microsoft 365 pilot path preview:
  - Excel intake
  - SharePoint control
  - Power BI view
- Improved the hero scale, spacing, grid texture, gold accents, and responsive behaviour.
- Updated static asset cache-busting in `index.html`.

## Why this matters

The demo now better explains the business value immediately:

1. Load the workbook.
2. Identify planning and evidence gaps.
3. Control training bookings and ATR proof.
4. Export reporting-ready views.
5. Show how a production pilot would connect to SharePoint, Dataverse and Power BI.

That makes it a stronger sales asset for WSP / ATR reporting conversations.

## Validation completed

The following checks were run after the changes:

- JavaScript syntax check for `app.js`.
- JavaScript syntax check for `client-config.js`.
- Static smoke test.
- Functional demo journey test.

Functional journey covered:

- Load data
- Select employee
- Choose course and provider
- Book training
- Record ATR
- View reports
- Export
- Reset demo
- Confirm white-label configuration

All checks passed.

## Current boundary

This remains a static GitHub Pages sales demo using browser-side data and synthetic records.

It is suitable for:

- Client walkthroughs
- Pilot conversations
- Demonstrating the WSP / ATR operating model
- Showing the future Microsoft 365 architecture

It is not yet a production SaaS system.

## Remaining 9.5/10 improvements

- Add a final polished SkillSet SA logo asset into the repository, instead of relying on the current text/CSS/fallback styling.
- Add scanner-level workbook intelligence to the WSP load workflow if the product direction requires real workbook diagnostics inside the WSP app itself.
- Build the production Microsoft 365 pilot backend using SharePoint Lists, Dataverse or another controlled data source.
- Connect final reporting outputs to Power BI.
- Record the 3–5 minute walkthrough video using the existing demo script.

## Commercial note

The strongest position is now:

> The static demo sells the workflow. The Microsoft 365 pilot proves it with a real client.

