# Data Dictionary

## Important Data Rules

- ID number must be stored as text.
- Race must not be derived from ID number.
- Sex/Gender may be derived from ID number only if missing and legally/ethically appropriate for the client process.
- Age can be derived from ID number or date of birth if available.
- Course matching must not rely only on course name.
- Production matching should use Employee Number, Course ID, Provider ID, Plan ID and date/quarter where available.
- Report exports must not include hidden technical fields unless required.

## EmployeeProfiles

| Field Name | Description | Data Type | Required | Source | Notes |
|---|---|---:|---|---|---|
| EmployeeNumber | Employee identifier | Text | Yes | HR workbook | Primary matching field |
| FullName | Employee display name | Text | Yes | HR workbook | Use client-approved naming format |
| IDNumber | South African ID or alternate identifier | Text | No | HR workbook | Store as text and mask in demo |
| RegionCluster | Region or cluster | Text | No | HR workbook | Used for filtering |
| Division | Division | Text | No | HR workbook | Used for filtering |
| Department | Department | Text | No | HR workbook | Used for filtering |
| SexGender | Sex/Gender | Text | No | HR workbook | Do not infer unless client approves |
| Race | Race category | Text | No | HR workbook | Must not be derived from ID |
| AgeBand | Age band | Text | No | Derived/client workbook | Derived from age/date of birth if available |
| Disability | Disability status | Text | No | HR workbook | Sensitive field; restrict in production |

## Providers

| Field Name | Description | Data Type | Required | Source | Notes |
|---|---|---:|---|---|---|
| ProviderID | Provider identifier | Text | Yes | Provider register | Required for production matching |
| ProviderName | Provider display name | Text | Yes | Provider register | Avoid name-only matching |
| AccreditationStatus | Accreditation or approval status | Text | No | Provider register | Client-defined |
| ContactName | Provider contact | Text | No | Provider register | Optional |
| Category | Training category | Text | No | Provider register | Used for search |

## Courses

| Field Name | Description | Data Type | Required | Source | Notes |
|---|---|---:|---|---|---|
| CourseID | Course identifier | Text | Yes | Course catalogue | Required for production matching |
| CourseName | Course/intervention name | Text | Yes | Course catalogue | Not enough for matching alone |
| ProviderID | Linked provider | Text | Yes | Provider register | Use provider key |
| Category | Course category | Text | No | Course catalogue | Used for filtering |
| EstimatedCost | Estimated planned cost | Currency | No | Course catalogue | Planning estimate only |
| EvidenceRequired | Evidence requirement | Text | No | Course catalogue | Used by evidence checklist |

## RequestedTraining

| Field Name | Description | Data Type | Required | Source | Notes |
|---|---|---:|---|---|---|
| RequestID | Request record key | Text | Yes | Workbook/import | Technical field, hidden from exports |
| EmployeeNumber | Employee link | Text | Yes | Workbook | Match to EmployeeProfiles |
| CourseID | Course link | Text | Preferred | Workbook/catalogue | Use CourseName if ID unavailable |
| ProviderID | Provider link | Text | Preferred | Workbook/catalogue | Use ProviderName if ID unavailable |
| RequestedDate | Request date | Date | No | Workbook | Supports coverage |
| PeriodQuarter | Quarter/period | Text | No | Workbook | Used when exact date missing |
| ReviewStatus | Review status | Text | No | Import rules | Drives review items |

## WSPPlans

| Field Name | Description | Data Type | Required | Source | Notes |
|---|---|---:|---|---|---|
| PlanID | WSP plan record key | Text | Yes | Planning workbook/app | Technical field |
| EmployeeNumber | Employee link | Text | Yes | Workbook/app | Match to EmployeeProfiles |
| CourseID | Course link | Text | Preferred | Catalogue | Avoid name-only matching |
| ProviderID | Provider link | Text | Preferred | Catalogue | Avoid name-only matching |
| PlannedDate | Planned date | Date | No | Workbook/app | Supports coverage |
| PeriodQuarter | Quarter/period | Text | No | Workbook/app | Used when exact date missing |
| PlannedCost | Planned cost | Currency | No | Workbook/app | Estimate only |

## ATRActuals

| Field Name | Description | Data Type | Required | Source | Notes |
|---|---|---:|---|---|---|
| ActualID | ATR actual record key | Text | Yes | Workbook/app | Technical field |
| EmployeeNumber | Employee link | Text | Yes | Workbook/app | Match to EmployeeProfiles |
| CourseID | Course link | Text | Preferred | Catalogue | Avoid name-only matching |
| ProviderID | Provider link | Text | Preferred | Catalogue | Avoid name-only matching |
| CompletionDate | Training completion date | Date | No | Workbook/app | Supports coverage |
| ActualCost | Actual cost | Currency | No | Workbook/app | Estimate until confirmed |
| EvidenceStatus | Evidence status | Text | No | Evidence register | Drives review items |

## TrainingBookings

| Field Name | Description | Data Type | Required | Source | Notes |
|---|---|---:|---|---|---|
| BookingID | Booking key | Text | Yes | App | Technical field |
| PlanID | Linked WSP plan | Text | Preferred | App | Supports plan-to-booking trace |
| EmployeeNumber | Employee link | Text | Yes | App | Used in profile history |
| BookingDate | Session date | Date | No | App | Supports coverage |
| PreferredWindow | Preferred timing where exact date is not confirmed | Text | No | App | Date to be confirmed, this month, next month or quarter |
| StartTime | Training start time | Time | No | App | Demo default 09:00 |
| EndTime | Training end time | Time | No | App | Demo default 12:00 |
| DeliveryMode | Delivery mode | Text | No | App | Classroom, Online, Blended, Workshop or Simulation |
| VenueLink | Venue or meeting link | Text | No | App | Demo planning visibility only |
| BookingStatus | Booking status | Text | Yes | App | Not booked, Proposed, Booked, Completed, Missed / Needs Justification, Cancelled |
| ReminderStatus | Reminder status | Text | No | App | Future automation |
| EvidenceRequired | Evidence expected for ATR review | Text | No | App/course catalogue | Attendance register, certificate, assessment result or similar |
| BookingNotes | Booking notes or constraints | Text | No | App | Follow-up notes |

## EvidenceRegister

| Field Name | Description | Data Type | Required | Source | Notes |
|---|---|---:|---|---|---|
| EvidenceID | Evidence key | Text | Yes | App/storage | Technical field |
| ActualID | Linked ATR actual | Text | Preferred | App | Links evidence to achievement |
| EvidenceType | Evidence category | Text | No | Client process | Attendance register, certificate, invoice |
| EvidenceStatus | Review status | Text | Yes | App | Pending, Ready, Rejected |
| UploadedBy | Uploader | Text | No | Production auth | Do not use in public demo |

## ReviewItems

| Field Name | Description | Data Type | Required | Source | Notes |
|---|---|---:|---|---|---|
| ReviewItemID | Review item key | Text | Yes | App/rules | Technical field |
| RelatedRecordType | Source table | Text | Yes | App/rules | Request, Plan, Actual, Booking |
| RelatedRecordID | Source record key | Text | Yes | App/rules | Technical field |
| ReviewReason | Reason for review | Text | Yes | App/rules | Missing evidence, mismatch, confirmation required |
| Owner | Assigned owner | Text | No | Production auth | Future workflow |
| Status | Review status | Text | Yes | App | Open, In Review, Resolved |

## DateTable

| Field Name | Description | Data Type | Required | Source | Notes |
|---|---|---:|---|---|---|
| Date | Calendar date | Date | Yes | Generated | Required for Power BI |
| Month | Month label | Text | Yes | Generated | Jan, Feb, etc. |
| MonthNumber | Month number | Number | Yes | Generated | Sorting |
| Quarter | Quarter label | Text | Yes | Generated | Q1-Q4 |
| Year | Year | Number | Yes | Generated | Filtering |
| FiscalPeriod | Client fiscal period | Text | No | Client rules | Confirm fiscal calendar |
