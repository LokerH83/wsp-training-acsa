# App Module Specification

| Module | Purpose | Main Fields | User Actions | Validations | Reports Affected | MVP Status | Future Phase Ideas |
|---|---|---|---|---|---|---|---|
| Employee Profiles | Hold people dimensions used for WSP / ATR reporting | Employee Number, Name, Region, Division, Department, Race, Sex/Gender, Age Band, Disability | Search, view profile, review training history | Employee Number required; sensitive fields controlled | All reports | [Done] | Role-based field security |
| Provider Catalogue | Maintain provider list | Provider ID, Name, Category, Accreditation Status | Search, select provider | Provider must be active for planning | Provider analysis | [Done] | Provider approvals |
| Course Catalogue | Maintain training interventions | Course ID, Course Name, Provider, Category, Duration, Cost | Search, use in plan | Course should link to provider | Course analysis | [Done] | Skills framework mapping |
| Requested Training | Track requested/suggested demand | Employee, Course, Provider, Period, Review Status | Load from workbook, review | Employee/course/provider matching | Demand, requested not planned | [Done] | Approval workflow |
| WSP Planning | Track planned interventions | Employee, Course, Provider, Period, Planned Cost | Add plan, use course, review | Duplicate and match checks | Planned WSP, planned not achieved | [Done] | Budget approvals |
| ATR Actuals | Track completed training | Employee, Course, Provider, Completion Date, Evidence Status | Record achievement | Evidence required when completed | Achieved ATR, achieved not planned | [Done] | Evidence upload |
| Bookings | Manage operational bookings | Plan, Employee, Course, Provider, Preferred Window, Training Date, Time, Delivery Mode, Venue/Link, Booking Status, Reminder Status, Evidence Required, Notes | Book training, update status, record planning visibility | Employee, provider and course required; training date optional when preferred window is supplied | Training operations and booking status reporting | [Done] | Calendar and reminder integration |
| Evidence | Track proof documents | Actual, Evidence Type, Evidence Status, Uploaded By | Review evidence | Evidence must link to actual | Evidence gaps | [Partial] | Document storage |
| Review Items | Track records needing attention | Source Record, Reason, Owner, Status | Review, assign, resolve | Reason and source required | Review items, reporting gaps | [Partial] | Task workflow |
| Reports | Filter and export management matrix | Filter criteria, coverage, matrix rows | Filter, copy summary, copy table, export CSV | No empty export | All management reporting | [Done] | Power BI drill-through |
| Admin Settings | Manage setup and defaults | Fiscal year, categories, roles, import rules | Configure system | Owner-only access | All reports | [Not Started] | Managed solution configuration |
