# ACSA Tier 2 Implementation Plan

## Purpose

This plan describes the recommended Tier 2 delivery for ACSA: keep Excel as the data input layer, then build a Power BI reporting layer that delivers management visibility into training planning, ATR progress, and evidence and review status.

## Scope

Tier 2 includes:

- Excel workbook clean-up and control pack
- Standardised workbook tables and data model
- Power Query checks for workbook validation
- Power BI dataset and dashboard
- Requested vs Planned vs Achieved reporting
- Filters for Cluster / Region, Division / Department, Race, Sex, Age, Disability
- Provider / Course analytics
- Evidence and review status and review item views
- Executive summary page
- SDF training session for the solution

## Recommended Approach

1. Discovery & Data Review
   - Review current workbook structure and sample data
   - Confirm employee details and required fields
   - Identify provider/course catalogue attributes
   - Capture WSP planning and ATR reporting rules
   - Understand evidence requirements and review workflows
   - Define key management questions for dashboards

2. Workbook Control Pack
   - Standardise templates for:
     - Employee master
     - WSP planning
     - ATR actuals
     - Provider/course register
     - Evidence register
     - Review items
   - Create named Excel tables and consistent column definitions
   - Apply Power Query validation for completeness and data quality
   - Ensure workbook is ready for Power BI import

3. Power BI Design
   - Build a central data model from the standardised workbook tables
   - Create relationships for people, training plans, actuals, providers, evidence and review items
   - Develop key measures for requested, planned and achieved training
   - Add filters for geography, department, demographics, provider and evidence and review status
   - Build an executive summary page with top-level metrics

4. Reporting & Review
   - Deliver interactive dashboards for management and operational use
   - Include drill-through or detail views for provider/course analysis
   - Provide evidence and review status and outstanding review item visibility
   - Validate dashboards with sample workbook data and stakeholder feedback

5. Handover & Training
   - Document workbook loading and refresh steps
   - Provide Power BI usage guidance for SDF and managers
   - Run an SDF training session on the Excel/Power BI process
   - Capture next-phase recommendations for Tier 3 if desired

## Deliverables

- Standardised Excel workbook templates
- Workbook data validation checks
- Power BI dataset and dashboard file
- Implementation handover notes
- Training session materials and summary

## Estimated Investment

- Implementation: R95,000 – R180,000 once-off
- Optional ongoing support: R3,500 – R15,000/month depending on support level

## Suggested Next Meeting Agenda

1. Review current workbook and sample data
2. Confirm the list of required fields and reporting filters
3. Agree the key dashboard pages and metrics
4. Identify integration or import requirements
5. Set delivery milestones and roles

## Notes

This plan is built around the recommendation from `docs/ACSA_THREE_TIER_PROPOSAL.md`: start with Tier 2 so ACSA gains management insight quickly while preserving Excel as the familiar input layer.
