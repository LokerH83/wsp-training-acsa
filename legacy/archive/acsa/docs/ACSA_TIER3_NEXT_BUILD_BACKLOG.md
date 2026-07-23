# ACSA Tier 3 Next Build Backlog

## Purpose

This backlog turns the completed app export review into the next practical build steps for moving the ACSA Power Apps solution toward live preparation.

## Verified baseline

- Complete solution package: `exports/WSPTrainingManagementSystem_complete_solution.zip`
- Model-driven app included: `The About WSP Training Management System`
- Core tables included:
  - Employee Profile
  - Training Plan
  - Training Actual
  - Course Catalogue
  - Training Provider

## Build next

### 1. Evidence capture

Create an Evidence table linked to Training Actual.

Suggested fields:

- Evidence Type
- Evidence Status
- Evidence Link or Attachment Reference
- Evidence Date
- Verified By
- Verification Date
- Evidence Notes

Suggested statuses:

- Required
- Uploaded
- Verified
- Rejected
- Not Required

### 2. Review item management

Create a Review Item table linked to Employee Profile, Training Plan and/or Training Actual.

Suggested fields:

- Review Type
- Review Reason
- Owner
- Due Date
- Priority
- Status
- Resolution Notes

Suggested statuses:

- Open
- In Progress
- Waiting for Evidence
- Resolved
- Closed

### 3. Booking and approval workflow

Create a Booking table linked to Training Plan, Employee Profile, Course Catalogue and Training Provider.

Suggested fields:

- Booking Status
- Session Date
- Start Time
- End Time
- Location
- Delivery Mode
- Attendance Status
- Reminder Status
- Approval Status

Suggested statuses:

- Requested
- Approved
- Booked
- Completed
- Missed
- Cancelled

### 4. Business rules and flows

Add automation for:

- Training Plan approved -> booking can be created
- Booking completed -> ATR actual can be captured
- ATR actual captured -> evidence is required or marked not required
- Evidence rejected -> review item is created
- Review item closed -> review status updates

### 5. Security roles

Define and test access for:

- SDF / Training Manager
- HR / Reporting User
- Line Manager
- Read-only Executive Viewer
- System Administrator

### 6. Power BI reporting layer

Create reporting over:

- Requested / planned / achieved training
- Training spend by provider and course
- Evidence and review status
- Review item status
- Booking and attendance status
- Demographic and business unit filters

## Pilot preparation checklist

- [ ] Confirm required fields for each workflow table
- [ ] Confirm status values and transitions
- [ ] Build missing tables and relationships
- [ ] Add forms and views for missing workflow tables
- [ ] Add business rules or cloud flows
- [ ] Add security roles
- [ ] Build Power BI reporting layer
- [ ] Test with approved sample data
- [ ] Run pilot with SDF/HR users
- [ ] Document handover and support process

## Recommended next meeting outcome

Agree whether ACSA wants to proceed with:

- Tier 2 reporting layer first, or
- Tier 3 app workflow build using the verified model-driven app as the baseline.
