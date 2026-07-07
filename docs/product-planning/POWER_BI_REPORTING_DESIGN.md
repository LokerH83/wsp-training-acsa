# Power BI Reporting Design

## Report Purpose

Provide management with repeatable WSP / ATR reporting views from a controlled workbook or app-backed dataset.

## Dataset Design

- EmployeeProfiles
- Providers
- Courses
- RequestedTraining
- WSPPlans
- ATRActuals
- TrainingBookings
- EvidenceRegister
- ReviewItems
- DateTable

## Relationships

- EmployeeProfiles[EmployeeNumber] to requested, planned, actuals and bookings.
- Providers[ProviderID] to courses, plans and actuals.
- Courses[CourseID] to requested, planned and actuals.
- DateTable[Date] to requested date, planned date, completion date and booking date where available.

## Pages

1. Executive Overview
2. WSP Demand
3. ATR Achievement
4. Reporting Gaps
5. Provider / Course Analysis
6. Demographic Review
7. Evidence Review
8. Export Matrix

## Core Measures

- Requested Training Count
- Planned WSP Count
- Achieved ATR Count
- Requested Not Planned
- Planned Not Achieved
- Achieved Not Planned
- Completion %
- Review Item Count
- Evidence Pending Count
- Estimated Budget

## Required Slicers

- Date range
- Month
- Quarter
- Year
- Region / Cluster
- Division
- Department
- Provider
- Course / Intervention
- Sex / Gender
- Race
- Age Band
- Disability
- Status
- Booking Status
- Evidence Status

## Export Matrix

The export page should match the static demo Management Matrix columns so Excel exports reconcile with what users see.

## Design Notes

- Use clear demo/planning labels where outputs are not official compliance outputs.
- Keep demographics controlled through production security roles.
- Add a coverage card showing period, included months and missing months.
