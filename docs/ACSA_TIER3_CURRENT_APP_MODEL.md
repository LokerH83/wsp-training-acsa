# ACSA Tier 3 Current App Model

## Summary

This document captures the current exported Power Apps solution package contents and maps them to the Tier 3 app build plan.

The current export package in `exports/WSPTrainingManagementSystem_after_successful_import.zip` contains the Dataverse entity model for the following tables:

- Training Provider (`ssa_dataprovider`)
- Employee Profile (`ssa_employeerecord`)
- Training Actual (`ssa_employeetrainingrecord`)
- Training Plan (`ssa_employeetrainingrecord1`)
- Course Catalogue (`ssa_trainingcourse`)

The package does not include app UI components such as a Canvas App or Model-driven App definition, and it appears to be a data model-only solution export.

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

- Core training data model is in place for employee profiles, providers, courses, planned training, and actual ATR records.
- Employee demographic and reporting fields exist for geography, division, gender, age, disability, and course details.
- The core data model supports requested/planned/achieved reporting if the app UI and relationships are completed.

## What is missing for the finished Tier 3 app

- No app component export found in the current package.
  - There is no Canvas App or Model-driven App definition present.
- No evidence capture entity or evidence tracking table is included.
- No review item or audit workflow entity is included.
- No explicit booking entity or workflow entity is included.
- No app forms, views, or relationship metadata appears in the extracted package.

## Recommended next actions

1. Export the full solution containing the app itself.
   - If the app is in a solution, export that solution.
   - If the app is not in a solution, add the app and its dependencies to a new solution and export it.
2. Confirm whether evidence and review entities exist in the environment but were not part of this export.
3. Capture the app screen config and form/view definitions for:
   - Employee search/profile
   - Training plan entry
   - ATR capture
   - Provider/course catalogue
   - Dashboard or reporting pages
4. Use this current entity model as the base for the Tier 3 app build, then add missing tables and UI:
   - Evidence capture
   - Review items
   - Booking workflow
   - Role-based forms and dashboards
5. If needed, align the actual entity fields with the Tier 3 plan and fill gaps in the missing app workflow.

## Notes

The current export is a strong starting point because it already defines the key business records. The next step is to bring the UI layer and missing workflow entities into the exported solution so the app can be completed.
