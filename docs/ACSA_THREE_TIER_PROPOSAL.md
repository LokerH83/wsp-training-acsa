# ACSA SDF / WSP / ATR Proposal Options

## Recommendation Summary

Recommended starting point:
Tier 2 — Excel + Power BI Reporting.

Reason:
It gives ACSA a practical management reporting layer quickly, while keeping Excel as the familiar input layer. Once the data model and reporting logic are trusted, the full app build becomes lower risk.

## Tier 1: Excel Control Pack

Purpose:
Stay in Excel, but make the workbook structure cleaner, controlled and report-ready.

Includes:

- Standardised Excel templates
- Named tables
- Employee master table
- WSP planning table
- ATR actuals table
- Provider/course table
- Evidence register
- Review items table
- Basic Power Query checks
- SDF handover session

Best for:
A low-risk first step where ACSA wants to clean up the spreadsheet process before moving to dashboards or apps.

Indicative investment:
R45,000 – R75,000 once-off

## Tier 2: Excel + Power BI Reporting

Purpose:
Keep Excel as the input layer and add a Power BI reporting layer for management insight.

Includes:

- Everything in Tier 1
- Power BI dashboard
- Requested vs Planned vs Achieved reporting
- Cluster / Region filters
- Division / Department filters
- Race / Sex / Age / Disability filters
- Provider / Course analysis
- Evidence readiness view
- Review items
- Executive summary page
- SDF training session

Best for:
A practical reporting solution that gives management visibility without immediately committing to a full application build.

Indicative investment:
R95,000 – R180,000 once-off

Recommended:
Yes. This is the recommended starting point.

## Tier 3: Full Microsoft App Build

Purpose:
Build the operational system for SDF workflow, training planning, booking, ATR, evidence and reporting.

Includes:

- Power Apps / Dataverse structure
- Employee profiles
- Training plans
- Training actuals
- Provider/course catalogue
- Booking workflow
- Evidence capture
- Role-based access design
- Power BI dashboard
- Excel import pipeline
- Audit and review workflow
- Production deployment plan

Best for:
A governed Microsoft-based system where users capture, review, approve, book and report training activity in a controlled environment.

Indicative investment:
Phase 1: R250,000 – R350,000
Phase 2: R350,000 – R600,000+

## Optional Monthly Support

Light reporting support:
R3,500 – R7,500/month

Managed reporting support:
R8,000 – R15,000/month

App support / change requests:
R15,000 – R35,000+/month

## Suggested Next Step

Run a short discovery and data review session to confirm:

- current workbook structure
- available employee fields
- provider/course data
- WSP planning requirements
- ATR reporting requirements
- evidence requirements
- management reporting expectations

A current Tier 3 review is available in `docs/ACSA_TIER3_CURRENT_APP_MODEL.md` and the live action plan is in `docs/ACSA_TIER3_LIVE_ACTION_PLAN.md`.

To complete the Tier 3 solution, export the full Power Apps solution containing the app component(s) and follow `docs/ACSA_TIER3_APP_EXPORT_INSTRUCTIONS.md`.

Then move into the Tier 2 delivery plan in `docs/ACSA_TIER2_IMPLEMENTATION_PLAN.md`.

This includes:

- standardised Excel workbook templates
- Power Query validation checks
- Power BI data model and dashboard build
- executive summary and filter-driven reporting
- handover and SDF training
