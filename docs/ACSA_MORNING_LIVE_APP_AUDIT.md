# ACSA Morning Live App Audit

## One-line status

The public ACSA SDF demo is live, visually polished, demo-safe and ready for a client walkthrough; the Power Apps Tier 3 package is a valid app foundation, with remaining workflow/security/reporting work still to build.

## Live public demo

- URL: `https://lokerh83.github.io/wsp-training-acsa/`
- Current assets: `20260707-journey-polish`
- Smoke-tested views: Overview, Load Workbook, Manage Training, People Profiles, Reports
- Report filters tested: filter reduced rows, Reset Filters restored the full matrix
- Stale labels removed: no `Review Items and reporting gaps`, `Items To Confirm` or old journey-strip wording
- Browser check: no console errors, no clipped cards/buttons, no horizontal overflow at the main demo viewport

## Current demo baseline

- Employees: 36
- Requested / Suggested: 34
- Planned WSP: 28
- Achieved ATR: 21
- Requested not planned: 8
- Planned not achieved: 9
- Achieved not planned: 2
- Reporting gaps: 19
- Review items: 0

## Power Apps / Tier 3 package status

- Verified app baseline: `exports/WSPTrainingManagementSystem_complete_solution.zip`
- Latest sandbox-validation candidate: `exports/WSPTrainingManagementSystem_with_entities_20260707075243.zip`
- Base app includes the model-driven app, app navigation, core Dataverse entities, forms/views and app metadata.
- Entity-merge candidate adds draft Evidence, Review Item and Booking entity artifacts for validation.

## What is ready to show

- Public static demo as the main sales walkthrough.
- Power Apps live app as the governed future-state example.
- Three-tier proposal: recommend Tier 2 reporting first, then Tier 3 workflow build once data and reporting logic are confirmed.

## What can still be achieved this morning

- Clean and commit the Tier 3 source-control artifacts if we want the repo to hold the unpacked Power Apps solution.
- Sandbox-import the latest `with_entities` package and record whether Evidence, Review Item and Booking import cleanly.
- Add a short client demo script slide/one-pager from the current journey: workbook data, employee validation, management outputs.
- Make the Power Apps live app view match the static demo language: evidence, review items, booking, reports.
- Prepare a Power BI mock/report page using the same requested vs planned vs achieved metrics.

## Do not overclaim

- The public static demo is sales-ready.
- The Power Apps app is not yet production-live ready.
- Production still needs security roles, approval/evidence workflows, Power BI reporting and pilot testing.
