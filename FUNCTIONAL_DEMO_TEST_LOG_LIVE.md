# Functional Demo Test Log

Tested: 2026-07-23T11:36:13.448Z
Live URL: https://lokerh83.github.io/wsp-training-acsa

| Feature | Expected result | Actual result | Pass/Fail | Fix made |
|---|---|---|---|---|
| Load data | Demo has usable synthetic employees, providers, courses, WSP plans, ATR actuals and booking data. | Employees: 36; providers: 8; courses: 28; plans: 28; actuals: 21; bookings: 8. | Pass | None |
| Select employee | Training form and booking form allow an employee to be selected and profile context to update. | All required controls and handlers are present. | Pass | None |
| Choose course/provider | Provider search, provider filter, course search, category filter and Select action are present and wired. | All required controls and handlers are present. | Pass | None |
| Book training | Booking form captures employee/group, provider, course, preferred window, date, evidence and status. | All required controls and handlers are present. | Pass | None |
| Record ATR | Completed training can be recorded as achieved ATR activity with evidence context. | All required controls and handlers are present. | Pass | None |
| View reports | Reports page renders filter controls, coverage, KPIs and requested/planned/achieved matrix. | All required controls and handlers are present. | Pass | None |
| Export | Filtered report and submission action register export without old client-specific filenames. | Filtered report now exports as a neutral WSP/ATR CSV; submission register export remains neutral. | Pass | Changed filtered report download name from acsa-wsp-atr-report to wsp-atr-report. |
| Reset demo | Top and overview reset buttons restore baseline data and filters. | All required controls and handlers are present. | Pass | None |
| White-label configuration | Branding remains isolated in client-config.js rather than hardcoded into app logic. | client-config.js is loaded and app.js applies configuration at startup. | Pass | None |
| Live GitHub Pages availability | Live demo URL returns published index, app, config and data assets. | index 200; app.js 200; client-config.js 404; data 200. | Fail | None |
| Live GitHub Pages feature markers | Live demo contains the core journey markers, not only local files. | Missing: client-config.js | Fail | None |
| Live white-label export filename | Live app should use the neutral WSP/ATR export filename after deployment. | Live app still has old export filename. Push/deploy the latest local change. | Fail | Pending deployment from local repo to GitHub Pages. |

## Release note

This is a static, synthetic-data sales demo. It proves the workflow concept: load workbook data, select an employee, choose a provider/course, capture booking/ATR activity, view management reports, export records and reset the demo. Production work must move to a governed Microsoft 365 backend instead of adding more static demo features.

## Evidence boundary

These checks verify source wiring, data availability and live asset availability. A final human visual click-through should still be done before a client meeting because this environment did not have a browser automation package available.
