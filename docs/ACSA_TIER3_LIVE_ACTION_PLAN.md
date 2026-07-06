# ACSA Tier 3 Live Action Plan

## Goal

Take the ACSA Tier 3 solution from current app export to a production-ready Power Apps + Dataverse deployment with reporting and handover.

## Current state

- A fresh unmanaged export was created on 2026-07-06:
  - `exports/WSPTrainingManagementSystem_full_app_solution_unmanaged.zip`
- Unpack verification confirms the package still does not include the model-driven app definition.
- A second export was created after adding the app site map component:
  - `exports/WSPTrainingManagementSystem_full_app_solution_with_app_nav_unmanaged.zip`
- This second package includes the app navigation/site map folder, but not the complete model-driven app definition folder.
- The exported package contains the core Dataverse tables for:
  - Training Provider (`ssa_dataprovider`)
  - Employee Profile (`ssa_employeerecord`)
  - Training Actual (`ssa_employeetrainingrecord`)
  - Training Plan (`ssa_employeetrainingrecord1`)
  - Course Catalogue (`ssa_trainingcourse`)
- The current export does not include a Canvas App or Model-driven App definition.
- The current export also does not include evidence, review item, or booking workflow entities.
- This means the current package is a strong data model foundation, but not the finished app.

## Live action summary

### Step 1: Capture the full app solution

- Export the complete Power Apps solution containing the app itself.
- If the app is not in a solution, add the app and its dependent tables/components to a new solution, then export.
- Confirm the export contains:
  - app definition(s)
  - entity forms and views
  - workflows/business rules
  - security roles if used
  - Dashboards / embedded Power BI if part of the solution

### Step 2: Validate the current data model

- Review the current entities and custom fields in the export.
- Confirm the key relationships between:
  - Employee Profile and Training Plan
  - Employee Profile and Training Actual
  - Training Plan and Course Catalogue
  - Training Plan and Training Provider
  - Training Actual and Course Catalogue
  - Training Actual and evidence (if present)
- Identify gaps in the data model for:
  - evidence capture
  - review item management
  - booking workflows
  - audit/history tracking

### Step 3: Build the missing app components

- Add or complete the missing entities and workflows for:
  - Evidence records and evidence readiness
  - Review items and follow-up actions
  - Booking/approval workflow
  - Role-based form experiences
- Create the app UI for:
  - Employee profile lookup
  - Training plan creation and approval
  - ATR actuals capture
  - Provider/course selection
  - Evidence upload or evidence link tracking
  - Review item management
- Ensure the app UX is consistent for SDF, managers, HR, and support users.

### Step 4: Complete reporting and deployment

- Create or connect Power BI dashboards for:
  - Requested vs Planned vs Achieved reporting
  - Provider / Course analysis
  - Evidence readiness and review status
  - Executive summary and management view
- Confirm workbook import/refresh process if Excel remains a source.
- Validate the app and dashboards with sample data and pilot users.
- Prepare the go-live deployment package.

### Step 5: Launch & support

- Define the production environment and deployment process.
- Set up security roles and user access.
- Provide training materials and handover documentation.
- Plan a support model for post-launch changes.

## Phase plan

### Phase 0: Export and analysis

- Export the full app solution
- Review current entity model and fields
- Confirm what is already built and what is missing

### Phase 1: Core app delivery

- Build or complete:
  - Employee Profile
  - Training Plan
  - Training Actual (ATR)
  - Course / Provider catalogue
- Add UI forms, views, and basic workflows
- Connect Power BI reporting

### Phase 2: Workflow and governance

- Add evidence capture and readiness tracking
- Add review item workflow
- Add booking / approval logic
- Add audit and governance controls
- Refine role-based experience

### Phase 3: Production readiness

- Validate data and app performance
- Confirm reporting and refresh process
- Deploy to pilot and collect feedback
- Finalize handover and support model

## Immediate action items

- [x] Export the current Power Apps solution package
- [x] Add the app navigation/site map component and export again
- [ ] Add the full model-driven app component to the solution in Power Apps Maker and export again
- [ ] Confirm whether evidence, review, and booking entities exist
- [ ] Review current field mappings and missing relationships
- [ ] Build the app UI and workflow gaps
- [ ] Deploy to a pilot environment and validate

## Risk & dependencies

- The current export is missing the app definition, so the immediate dependency is the full solution export.
- If the app is not yet solution-aware, adding it to a solution is required before the next build step.
- Evidence and review workflows may require additional entity design beyond the current export.

## What I can do next

- Review the full solution export once it is available
- Map the app UI and form design to the Tier 3 model
- Define the missing Dataverse entities and relationships
- Provide a production deployment checklist for Power Apps + Dataverse
- Help write the user acceptance and pilot testing criteria
