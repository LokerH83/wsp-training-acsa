import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const liveBase = process.argv[2]?.replace(/\/$/, "");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function pass(condition, actual) {
  return { ok: Boolean(condition), actual };
}

function hasAll(text, markers) {
  const missing = markers.filter(marker => !text.includes(marker));
  return pass(missing.length === 0, missing.length ? `Missing: ${missing.join(", ")}` : "All required controls and handlers are present.");
}

function loadDemoData() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read("data/demo-snapshot.js"), context);
  return context.window.SKILLSET_WSP_DEMO_DATA;
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: "follow" });
  const text = await response.text();
  return { status: response.status, url: response.url, text };
}

function row(feature, expected, result, fixMade = "None") {
  return {
    feature,
    expected,
    actual: result.actual,
    status: result.ok ? "Pass" : "Fail",
    fixMade
  };
}

const index = read("index.html");
const app = read("app.js");
const config = read("client-config.js");
const data = loadDemoData();

const results = [];

results.push(row(
  "Load data",
  "Demo has usable synthetic employees, providers, courses, WSP plans, ATR actuals and booking data.",
  pass(
    data.employees?.length > 0 &&
    data.providers?.length > 0 &&
    data.courses?.length > 0 &&
    data.plans?.length > 0 &&
    data.actuals?.length > 0 &&
    Array.isArray(data.bookings),
    `Employees: ${data.employees?.length || 0}; providers: ${data.providers?.length || 0}; courses: ${data.courses?.length || 0}; plans: ${data.plans?.length || 0}; actuals: ${data.actuals?.length || 0}; bookings: ${data.bookings?.length || 0}.`
  )
));

results.push(row(
  "Select employee",
  "Training form and booking form allow an employee to be selected and profile context to update.",
  hasAll(index + app, [
    'name="employeeNumber"',
    'id="inheritedFields"',
    "selectedEmployeeNumber",
    "renderPeople",
    "updateBookingFields"
  ])
));

results.push(row(
  "Choose course/provider",
  "Provider search, provider filter, course search, category filter and Select action are present and wired.",
  hasAll(index + app, [
    'id="providerSearch"',
    'id="providerFilter"',
    'id="courseSearch"',
    'id="categoryFilter"',
    "data-use-course",
    "renderCourseResults"
  ])
));

results.push(row(
  "Book training",
  "Booking form captures employee/group, provider, course, preferred window, date, evidence and status.",
  hasAll(index + app, [
    'id="bookingForm"',
    'name="preferredWindow"',
    'name="trainingDate"',
    'name="bookingStatus"',
    'name="evidenceRequired"',
    "state.bookings.push",
    "Booking saved for"
  ])
));

results.push(row(
  "Record ATR",
  "Completed training can be recorded as achieved ATR activity with evidence context.",
  hasAll(index + app, [
    "Record Achieved ATR Activity",
    'value="actual"',
    "Record Completed Training",
    "data-booking-atr",
    "ATR activity saved"
  ])
));

results.push(row(
  "View reports",
  "Reports page renders filter controls, coverage, KPIs and requested/planned/achieved matrix.",
  hasAll(index + app, [
    'id="reports"',
    'id="reportFilters"',
    'id="reportCoverage"',
    'id="reportKpis"',
    'id="reportRows"',
    "renderReports",
    "buildRequestedPlannedAchievedReport"
  ])
));

results.push(row(
  "Export",
  "Filtered report and submission action register use neutral product filenames.",
  pass(
    app.includes("exportFilteredReport") &&
    app.includes("exportSubmissionActionRegister") &&
    app.includes("wsp-atr-report-"),
    "Filtered report and submission register export as neutral WSP/ATR files."
  ),
  "None"
));

results.push(row(
  "Reset demo",
  "Top and overview reset buttons restore baseline data and filters.",
  hasAll(index + app, [
    'id="resetDemoTop"',
    'id="resetDemoOverview"',
    "function resetDemo",
    "resetReportFiltersState",
    "localStorage.removeItem",
    "initialiseState(cloneData())"
  ])
));

results.push(row(
  "White-label configuration",
  "Branding remains isolated in client-config.js rather than hardcoded into app logic.",
  pass(
    config.includes("window.WSP_CLIENT_CONFIG") &&
    app.includes("activeClientConfig") &&
    app.includes("applyClientBranding"),
    "client-config.js is loaded and app.js applies configuration at startup."
  )
));

if (liveBase) {
  const liveIndex = await fetchText(`${liveBase}/`);
  const liveApp = await fetchText(`${liveBase}/app.js`);
  const liveConfig = await fetchText(`${liveBase}/client-config.js`);
  const liveData = await fetchText(`${liveBase}/data/demo-snapshot.js`);

  results.push(row(
    "Live GitHub Pages availability",
    "Live demo URL returns published index, app, config and data assets.",
    pass(
      liveIndex.status === 200 &&
      liveApp.status === 200 &&
      liveConfig.status === 200 &&
      liveData.status === 200,
      `index ${liveIndex.status}; app.js ${liveApp.status}; client-config.js ${liveConfig.status}; data ${liveData.status}.`
    )
  ));

  results.push(row(
    "Live GitHub Pages feature markers",
    "Live demo contains the core journey markers, not only local files.",
    hasAll(liveIndex.text + liveApp.text + liveConfig.text + liveData.text, [
      "Load Workbook",
      "Book / Schedule Training",
      "Record Achieved ATR Activity",
      "Reports",
      "exportFilteredReport",
      "resetDemo",
      "client-config.js"
    ])
  ));

  results.push(row(
    "Live product export filename",
    "Live app uses the neutral WSP/ATR export filename.",
    pass(
      liveApp.text.includes("wsp-atr-report-"),
      "Live app has the neutral export filename."
    ),
    "None"
  ));
}

const markdownRows = results.map(item =>
  `| ${item.feature} | ${item.expected.replaceAll("|", "\\|")} | ${item.actual.replaceAll("|", "\\|")} | ${item.status} | ${item.fixMade.replaceAll("|", "\\|")} |`
);

const output = [
  "# Functional Demo Test Log",
  "",
  `Tested: ${new Date().toISOString()}`,
  liveBase ? `Live URL: ${liveBase}` : "Live URL: not supplied",
  "",
  "| Feature | Expected result | Actual result | Pass/Fail | Fix made |",
  "|---|---|---|---|---|",
  ...markdownRows,
  "",
  "## Release note",
  "",
  "This is a static, synthetic-data sales demo. It proves the workflow concept: load workbook data, select an employee, choose a provider/course, capture booking/ATR activity, view management reports, export records and reset the demo. Production work must move to a governed Microsoft 365 backend instead of adding more static demo features.",
  "",
  "## Evidence boundary",
  "",
  "These checks verify source wiring, data availability and live asset availability. A final human visual click-through should still be done before a client meeting because this environment did not have a browser automation package available."
].join("\n");

const specificLog = liveBase ? "FUNCTIONAL_DEMO_TEST_LOG_LIVE.md" : "FUNCTIONAL_DEMO_TEST_LOG_LOCAL.md";
fs.writeFileSync(path.join(root, specificLog), `${output}\n`, "utf8");
fs.writeFileSync(path.join(root, "FUNCTIONAL_DEMO_TEST_LOG.md"), `${output}\n`, "utf8");

const failed = results.filter(item => item.status === "Fail");
console.log(output);
if (failed.length) process.exitCode = 1;
