# ACSA Tier 3 Current App Model

## Summary

This document captures the verified complete Power Apps solution package contents and maps them to the Tier 3 app build plan.

The completed export package is:

`exports/WSPTrainingManagementSystem_complete_solution.zip`

The package now includes the model-driven app definition, site map/navigation, app search/MCP metadata, forms, views, relationships and the Dataverse entity model for the following tables:

- Training Provider (`ssa_dataprovider`)
- Employee Profile (`ssa_employeerecord`)
- Training Actual (`ssa_employeetrainingrecord`)
- Training Plan (`ssa_employeetrainingrecord1`)
- Course Catalogue (`ssa_trainingcourse`)

Verified app package folders include:

- `AppModules`
- `AppModuleSiteMaps`
- `dvtablesearchs`
- `dvtablesearchentities`
- `mcpservers`
- `Entities`
- `Other`

## Current Entities

### Training Provider (`ssa_dataprovider`)

- Display name: Training Provider
- Attributes: 20
- Key custom fields:
  - `ssa_providername` — Provider Name
  - `ssa_providercode` — Provider Code
  - `ssa_plannedrecordcount` — Planned Record Count

### Employee Profile (`ssa_employeerecord`)

- Display name: Employee Profile
- Attributes: 44
- Key custom fields:
  - `ssa_fullname` — Full Name
  - `ssa_employeenumber` — Employee Number
  - `ssa_idnumber` — ID Number
  - `ssa_division` — Division
  - `ssa_department` / `ssa_businessunit` / `ssa_location`
  - `ssa_gender` — Gender
  - `ssa_racegender` — Race Gender
  - `ssa_age` — Age
  - `ssa_disabilitystatus` — Disability Status
  - `ssa_jobtitle` / `ssa_jobname`
  - `ssa_grade` / `ssa_gradename`
  - `ssa_employeestatus` — Employee Status

### Training Actual (`ssa_employeetrainingrecord`)

- Display name: Training Actual
- Attributes: 48
- Key custom fields:
  - `ssa_employeename` — Employee Name
  - `ssa_employeenumber` — Employee Number
  - `ssa_EmployeeProfile` — Employee Profile lookup
  - `ssa_CourseCatalogue` — Course Catalogue lookup
  - `ssa_coursename` — Course Name
  - `ssa_actualcost` — Actual Cost
  - `ssa_atryear` — ATR Year
  - `ssa_cluster` — Cluster
  - `ssa_department` / `ssa_division`
  - `ssa_disabilitystatus` — Disability
  - `ssa_gender` — Gender
  - `ssa_gradelevel` — Grade
  - `ssa_bbbeecategory` — BBBEE Category
  - `ssa_trainingcategory` — Training Category
  - `ssa_developmenttype` — Development Type
  - `ssa_actionorrollout` — Action / Rollout

### Training Plan (`ssa_employeetrainingrecord1`)

- Display name: Training Plan
- Attributes: 44
- Key custom fields:
  - `ssa_employeename` — Employee Name
  - `ssa_employeenumber` — Employee Number
  - `ssa_EmployeeProfile` — Employee Profile lookup
  - `ssa_CourseCatalogue` — Course Catalogue lookup
  - `ssa_coursename` — Course Name
  - `ssa_provider` — Provider
  - `ssa_plannedcost` — Planned Cost
  - `ssa_plannedquarter` — Planned Quarter
  - `ssa_position` — Position
  - `ssa_priority` — Priority
  - `ssa_comments` — Comments
  - `ssa_division` — Division
  - `ssa_disabilitystatus` — Disability Status

### Course Catalogue (`ssa_trainingcourse`)

- Display name: Course Catalogue
- Attributes: 25
- Key custom fields:
  - `ssa_coursename` — Course Name
  - `ssa_coursecode` — Course Code
  - `ssa_trainingcategory` — Training Category
  - `ssa_defaultplannedcost` — Default Planned Cost
  - `ssa_plannedrecordcount` — Planned Record Count

## What is present today

- Model-driven app: `The About WSP Training Management System`.
- App unique name: `cr075_TheAboutWSPTrainingManagementSyste`.
- App navigation includes Employee Profiles, Training Plans, Training Actuals, Course Catalogue and Training Providers.
- Core training data model is in place for employee profiles, providers, courses, planned training and actual ATR records.
- Each included entity has forms and saved views in the complete export.
- Employee demographic and reporting fields exist for business unit, division, gender, race, age, disability and course/training details.
- Relationships exist from Training Plan and Training Actual to Employee Profile and Course Catalogue, and from Training Plan to Training Provider.
- The model supports requested/planned/achieved reporting once reporting datasets and business rules are completed.

## What is missing for the finished Tier 3 app

- No evidence capture entity or evidence tracking table is included.
- No review item or audit workflow entity is included.
- No explicit booking entity or workflow entity is included.
- No business process flows or workflows are included in the export.
- No security role definitions are included, although the app module references role IDs.
- No Power BI dashboard or embedded reporting component is included.
- No formal approval flow is included for booking, evidence sign-off or ATR confirmation.

## Recommended next actions

1. Confirm whether evidence, review, booking and approval entities exist elsewhere in the environment.
2. Add missing workflow entities if they do not already exist:
   - Evidence capture
   - Review items
   - Booking workflow
   - Role-based forms and dashboards
3. Add business rules or cloud flows for status transitions across planning, booking, ATR, evidence and review.
4. Add security roles and validate user access for SDF, HR/reporting, manager and admin users.
5. Connect Power BI reporting for requested vs planned vs achieved, evidence and review status and review status.
6. Pilot the model-driven app with demo-safe or approved sample data before production rollout.

## Notes

The current export is now a complete app package for the existing model-driven app foundation. It is not yet production-intended because the workflow layer, evidence/review/booking entities, security model and reporting layer still need to be completed.
