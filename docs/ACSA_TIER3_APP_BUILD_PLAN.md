# ACSA Tier 3 App Build Plan

## Purpose

This document defines the Tier 3 app build for ACSA: a Microsoft Power Apps + Dataverse solution that manages SDF training planning, ATR recording, evidence tracking, review workflows, and reporting.

## Objectives

- Replace manual Excel workflows with a controlled app experience
- Maintain training planning, booking, actuals, evidence and review management
- Integrate with Power BI for management reporting
- Support role-based access and governance in the Microsoft stack
- Preserve Excel import capability for existing data

## Tier 3 Scope

### Core App Modules

1. Employee Profiles
   - Personal and demographic details
   - Cluster / Region, Division / Department, Race, Sex, Age, Disability
   - Job role and reporting structure

2. Training Plans
   - Requested training entries
   - Planned training entries
   - Provider/course selection
   - Target dates and training categories
   - Status tracking (planned, approved, booked)

3. ATR Actuals
   - Actual training completed records
   - Attendance and completion status
   - Outcome / result capture
   - Evidence attachments or evidence links

4. Provider / Course Catalogue
   - Provider details
   - Course catalogue and categories
   - Training cost and delivery mode
   - Certification or qualification mapping

5. Bookings & Workflow
   - Create training bookings from plans
   - Approval and booking status updates
   - Attendance and ATR capture workflow
   - Review item creation from ATR or evidence gaps

6. Evidence Capture
   - Evidence record types
   - Evidence readiness statuses
   - Link evidence to training actuals
   - Evidence review and validation notes

7. Review & Audit
   - Review item register
   - Review owner, status, due date
   - Escalation or follow-up tracking
   - Audit trail of changes

8. Reporting
   - Power BI dashboard connection
   - Training requested vs planned vs achieved
   - Provider / course analytics
   - Evidence readiness view
   - Review item status reporting
   - Executive summary page

## Dataverse Data Model

### Suggested Tables

- Employee
- Training Plan
- Training Actual (ATR)
- Provider
- Course
- Evidence
- Review Item
- Booking
- Training Category
- Training Status

### Key Relationships

- Employee -> Training Plan
- Employee -> Training Actual
- Training Plan -> Provider
- Training Plan -> Course
- Training Actual -> Provider
- Training Actual -> Course
- Training Actual -> Evidence
- Evidence -> Training Actual
- Review Item -> Employee
- Review Item -> Training Actual
- Booking -> Training Plan
- Booking -> Employee

## Power Apps Architecture

### App Design

- Model-driven app for core operational workflows
- Canvas app for user-friendly training request and booking forms
- Role-based forms and dashboards for SDF, manager and HR users

### Suggested App Areas

- Home / dashboard
- Employee search and profile
- Training plan entry and management
- ATR capture and evidence upload
- Provider / course catalogue
- Booking and approval workflow
- Review item management
- Reports / Power BI integration page

## Excel Integration

- Import existing workbook data into Dataverse
- Keep Excel as a legacy data source during transition
- Provide an Excel import pipeline for:
  - Employee master
  - WSP planning
  - ATR actuals
  - Provider/course catalogue
  - Evidence register
- Maintain a validation step before import

## Deployment Plan

1. Set up Dataverse environment and security roles
2. Build core tables and relationships
3. Create Power Apps forms and views
4. Implement business rules and workflows
5. Build Power BI dataset and dashboards
6. Validate with sample data and user testing
7. Deploy to pilot users
8. Capture feedback and refine

## Roles & Access

- SDF / training manager: full access to plans, actuals, evidence, review items
- Manager or line manager: visibility to employee training and approvals
- HR / reporting user: access for reporting and data maintenance
- System admin: environment and security administration

## Phase 1 / Phase 2 Breakdown

### Phase 1: Minimum Viable App

- Employee profile data model
- Training plan entry and approval
- ATR actual capture
- Provider/course catalogue
- Basic booking workflow
- Power BI dashboard for requested/planned/achieved
- Excel import pipeline
- App deployment and training

### Phase 2: Extended Capability

- Evidence capture workflows
- Review item register and escalation
- Audit and governance features
- Enhanced reporting and dashboards
- More advanced role-specific UX

## Handover & Training

- Document app use cases and data model
- Provide user guides for Power Apps and Power BI
- Run training sessions for SDF and key users
- Define support model and change request process

## Next Steps

- Use `exports/WSPTrainingManagementSystem_complete_solution.zip` as the verified app baseline.
- Build the missing workflow entities for evidence, review items and booking/approval.
- Add business rules or cloud flows for status changes and handoffs.
- Add security roles and validate access for SDF, HR/reporting, managers and admins.
- Connect Power BI reporting for requested vs planned vs achieved, evidence readiness and review status.
- Agree pilot scope and phase planning.
