# ACSA Tier 3 Completion Checklist

## Purpose

This checklist supports the final steps needed to move the Tier 3 app toward production-ready delivery.

## Completion criteria

- [x] Current Power Apps solution export is available in `exports/`
- [ ] App definition(s) are included in the exported solution
- [ ] All required Dataverse tables are present
- [ ] Core entity relationships are defined and validated
- [ ] Forms and views exist for employee profile, training plan, ATR actuals, provider/course and review workflows
- [ ] Evidence capture workflow is defined or planned
- [ ] Review item workflow is defined or planned
- [ ] Booking/approval workflow is defined or planned
- [ ] Power BI reporting integration is defined
- [ ] Excel import and validation process is documented, if required
- [ ] Role-based access and security are defined
- [ ] Pilot users and acceptance criteria are identified
- [ ] Deployment and go-live steps are defined
- [ ] Handover and training materials are prepared

## Checklist

### 1. Solution export and review

- [x] Export the current Power Apps solution package
- [ ] Add the model-driven app component to the solution in Power Apps Maker
- [ ] Export the full Power Apps solution containing the app component(s)
- [ ] Confirm the solution includes:
  - Canvas or model-driven app definition
  - Tables/entities
  - Forms/views
  - Business rules/workflows
  - Security roles/components
  - Dashboards or embedded reports
- [x] Add the current exported package to `exports/`
- [ ] Review the solution metadata for required entities and missing app components

### 2. Data model validation

- [ ] Confirm entity names and logical purpose:
  - Employee Profile
  - Training Plan
  - Training Actual (ATR)
  - Course Catalogue
  - Training Provider
  - Evidence
  - Review Item
  - Booking/Approval
- [ ] Confirm key lookup relationships
- [ ] Confirm required demographic fields are present
- [ ] Confirm training plan/ATR status and cost fields exist
- [ ] Confirm provider/category fields exist

### 3. App UX and workflow

- [ ] Confirm app screens or forms for:
  - Employee search/profile
  - Training plan entry
  - ATR actual capture
  - Course/provider selection
  - Evidence upload or linkage
  - Review item tracking
  - Booking/approval workflow
- [ ] Confirm the app supports role-specific experiences
- [ ] Confirm validation rules and business logic for data entry
- [ ] Confirm status transitions for plan, booking, ATR and evidence

### 4. Reporting and dashboard readiness

- [ ] Confirm Power BI dataset or embedded dashboards are defined
- [ ] Confirm requested vs planned vs achieved reporting metrics
- [ ] Confirm evidence readiness and review item reporting
- [ ] Confirm filter requirements for geography, department, demographics, provider/course
- [ ] Confirm executive summary page requirements

### 5. Deployment readiness

- [ ] Confirm target environment for production deployment
- [ ] Confirm solution import process and dependencies
- [ ] Confirm security roles and access model
- [ ] Confirm data migration approach from Excel if required
- [ ] Confirm refresh process for Power BI

### 6. Pilot and handover

- [ ] Identify pilot users and pilot scope
- [ ] Define acceptance criteria for the pilot
- [ ] Prepare user training materials and quick reference guide
- [ ] Document handover steps for support and change requests
- [ ] Plan ongoing support and maintenance model

## Notes

Use this checklist in combination with:

- `docs/ACSA_TIER3_CURRENT_APP_MODEL.md`
- `docs/ACSA_TIER3_LIVE_ACTION_PLAN.md`
- `docs/ACSA_TIER3_APP_EXPORT_INSTRUCTIONS.md`
