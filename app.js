const DEMO_DATA = window.ACSA_DEMO_DATA || { employees: [], providers: [], courses: [], requests: [], plans: [], actuals: [], bookings: [] };
const CLIENT_CONFIG = window.WSP_CLIENT_CONFIG || {};
const STORAGE_KEY = CLIENT_CONFIG.storageKey || "skillset-wsp-training-hub-v1";
let state = loadState();
let stagedRows = [];
let selectedEmployeeNumber = state.employees[0]?.employeeNumber || "";
let reportFilterState = {};
let overviewFilterState = { quarter: "All", provider: "All" };
let submissionFilterState = { category: "All", severity: "All", status: "Open actions" };
let workbookStageState = "empty";
let workbookMeta = null;

const currency = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });
const requiredColumns = ["Employee Number","Employee Name","ID Number","Region / Cluster","Division","Department","Sex / Gender","Race","Age","Age Band","Disability","Course / Intervention","Requested / Suggested","Planned WSP","Achieved ATR","Provider","Quarter / Date","Planned Cost","Actual Cost","Evidence Status","Review Status"];
const filterDefs = [
  ["period", "Quarter / Period"],
  ["regionCluster", "Region / Cluster"], ["division", "Division"], ["department", "Department"], ["provider", "Provider"],
  ["course", "Course / Intervention"], ["sexGender", "Sex / Gender"], ["race", "Race"], ["ageBand", "Age Band"],
  ["disability", "Disability"], ["status", "Status"], ["bookingStatus", "Booking Status"]
];
const reportColumns = [
  ["regionCluster", "Region / Cluster"], ["division", "Division"], ["department", "Department"], ["provider", "Provider"],
  ["course", "Course / Intervention"], ["sexGender", "Sex / Gender"], ["race", "Race"], ["ageBand", "Age Band"],
  ["disability", "Disability"], ["requested", "Requested / Suggested"], ["planned", "Planned WSP"], ["achieved", "Achieved ATR"],
  ["requestedNotPlanned", "Requested Not Planned"], ["plannedNotAchieved", "Planned Not Achieved"], ["achievedNotPlanned", "Achieved Not Planned"],
  ["completion", "Completion %"], ["reviewItems", "Review Items"], ["status", "Status"], ["bookingStatus", "Booking Status"]
];
const qualityCategoryDefinitions = [
  { label: "Employee master data", note: "profiles with missing or unconfirmed reporting fields", view: "people" },
  { label: "Duplicate employee numbers", note: "duplicate identifiers detected", view: "people" },
  { label: "Incomplete interventions", note: "records missing employee, course, provider or period", view: "training" },
  { label: "Invalid costs", note: "planned or actual costs needing correction", view: "reports" },
  { label: "Evidence gaps", note: "achieved records without confirmed evidence", view: "training" },
  { label: "WSP / ATR reconciliation", note: "records outside the requested to planned to achieved chain", view: "reports" }
];

function cloneData() {
  return JSON.parse(JSON.stringify(DEMO_DATA));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved?.employees?.length >= 30 && saved?.requests?.length) {
      const baseline = cloneData();
      saved.bookings = saved.bookings?.length ? saved.bookings : baseline.bookings || [];
      return initialiseState(saved);
    }
  } catch {}
  return initialiseState(cloneData());
}

function initialiseState(data) {
  const next = {
    employees: data.employees || [],
    providers: data.providers || [],
    courses: data.courses || [],
    requests: data.requests || [],
    plans: data.plans || [],
    actuals: data.actuals || [],
    bookings: [],
    reportRows: [],
    reviewActions: data.reviewActions || {},
    submissionSignoff: data.submissionSignoff || { decision: "Not reviewed", approver: "", decisionDate: "", notes: "" }
  };
  next.bookings = (data.bookings || []).map(booking => normalizeBookingRecord(booking, next.courses));
  next.reportRows = buildRequestedPlannedAchievedReport(next);
  return next;
}

function saveState() {
  state.reportRows = buildRequestedPlannedAchievedReport(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetDemo() {
  localStorage.removeItem(STORAGE_KEY);
  state = initialiseState(cloneData());
  stagedRows = [];
  workbookStageState = "empty";
  workbookMeta = null;
  selectedEmployeeNumber = state.employees[0]?.employeeNumber || "";
  overviewFilterState = { quarter: "All", provider: "All" };
  resetReportFiltersState();
  setView("overview");
  renderAll();
}

function employee(number) {
  return state.employees.find(e => e.employeeNumber === number) || {};
}

function mask(value) {
  const text = String(value || "");
  return text.length <= 4 ? text : `${"*".repeat(text.length - 4)}${text.slice(-4)}`;
}

function friendly(value, placeholder = "Not specified") {
  return value === undefined || value === null || value === "" || Number.isNaN(value) ? placeholder : value;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function applyClientBranding() {
  const config = activeClientConfig();
  document.documentElement.style.setProperty("--navy", config.primaryColor);
  document.documentElement.style.setProperty("--blue", config.secondaryColor);
  document.documentElement.style.setProperty("--accent", config.accentColor);
  document.title = `${config.clientName} ${config.appName}`;
  const text = {
    clientPreparedFor: config.preparedFor, clientTagline: config.tagline,
    appTitle: `${config.clientName} ${config.appName}`,
    appSubtitle: config.subtitle,
    environmentLabel: config.environmentLabel, privacyNotice: config.privacyNotice,
    heroEyebrow: config.heroEyebrow,
    heroTitle: config.heroTitle,
    heroIntro: config.heroIntro,
    heroFootnote: config.heroFootnote,
    sidebarFooterTitle: config.sidebarFooterTitle,
    sidebarFooterText: config.sidebarFooterText,
    budgetEstimateNote: config.budgetEstimateNote,
    workbookIntro: config.workbookIntro
  };
  Object.entries(text).forEach(([id, value]) => { const node = document.getElementById(id); if (node) node.textContent = value; });
  const logo = document.getElementById("clientLogo");
  const logoFallback = document.getElementById("clientLogoFallback");
  if (logo && config.logo) {
    logo.src = config.logo;
    logo.alt = config.logoAlt;
    logo.hidden = false;
    if (logoFallback) logoFallback.hidden = true;
  } else if (logo) {
    logo.hidden = true;
    if (logoFallback) {
      logoFallback.hidden = false;
      logoFallback.textContent = config.logoInitials || initialsFrom(config.clientName);
    }
  }
}

function activeClientConfig() {
  return {
    clientName: "Client",
    appName: "Training Reporting Hub",
    preparedFor: "White-label WSP / ATR pilot",
    tagline: "Training bookings · WSP · ATR reporting",
    logo: "",
    logoAlt: "Client logo",
    logoInitials: "",
    primaryColor: "#063c25",
    secondaryColor: "#0e7a45",
    accentColor: "#ffcc00",
    financialYear: "Current cycle", environmentLabel: "Demo data only",
    privacyNotice: "Synthetic records only. A production client version should run inside the client's Microsoft 365 environment.",
    subtitle: "White-label training reporting workspace · Synthetic data only · Not official SETA or B-BBEE output.",
    heroEyebrow: "White-label reporting system",
    heroTitle: "Turn training records into a controlled reporting workflow.",
    heroIntro: "A configurable WSP / ATR reporting hub for organisations that still depend on spreadsheets, manual bookings and scattered evidence.",
    heroFootnote: "Use this public demo for walkthroughs only. Production data belongs in a client-controlled Microsoft 365 tenant.",
    sidebarFooterTitle: "White-label ready",
    sidebarFooterText: "Client-specific branding and wording",
    budgetEstimateNote: "Demo planning estimate only. Final financial, SETA or compliance values must be confirmed through the client's approved process.",
    workbookIntro: "Stage the sample workbook or upload a safe CSV export. Do not upload private or client-identifiable records into this public demo.",
    ...CLIENT_CONFIG
  };
}

function initialsFrom(value) {
  return String(value || "Client")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join("") || "C";
}

function issueId(...parts) {
  let hash = 2166136261;
  for (const character of parts.join("|").toLowerCase()) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `issue-${(hash >>> 0).toString(36)}`;
}

function dataQualityIssues(source = state) {
  const issues = [];
  const add = (category, severity, title, location, detail, recommendation, view) => issues.push({
    id: issueId(category, title, location), category, severity, title, location, detail, recommendation, view
  });
  const profileFields = ["employeeNumber", "employeeName", "division", "department", "sexGender", "race", "ageBand", "disability"];
  source.employees.forEach((person, index) => {
    const missing = profileFields.filter(field => !person[field] || String(person[field]).includes("Confirmation Required"));
    if (missing.length) add("Employee master data", missing.includes("employeeNumber") ? "High" : "Medium", "Complete employee reporting fields", `Employee ${person.employeeNumber || index + 1}: ${person.employeeName || "Unnamed profile"}`, `Missing or unconfirmed: ${missing.join(", ")}.`, "Confirm the source value and update the employee master before reporting.", "people");
  });
  const employeeGroups = new Map();
  source.employees.forEach((person, index) => {
    const key = String(person.employeeNumber || "").trim().toLowerCase();
    if (!key) return;
    if (!employeeGroups.has(key)) employeeGroups.set(key, []);
    employeeGroups.get(key).push({ person, index });
  });
  employeeGroups.forEach((matches, key) => {
    if (matches.length > 1) add("Duplicate employee numbers", "High", "Resolve duplicate employee identifier", `Employee number ${key}`, `${matches.length} profiles use the same employee number.`, "Confirm the authoritative profile, merge valid history and retire the duplicate identifier.", "people");
  });
  [["Request", source.requests], ["Plan", source.plans], ["Actual", source.actuals]].forEach(([type, rows]) => rows.forEach((row, index) => {
    const missing = ["employeeNumber", "course", "provider", "period"].filter(field => !row[field] || (field === "period" && /confirm/i.test(String(row[field]))));
    if (missing.length) add("Incomplete interventions", "High", `Complete ${type.toLowerCase()} intervention`, `${type} ${row.id || index + 1}: ${row.employeeNumber || "No employee"} / ${row.course || "No course"}`, `Missing or unconfirmed: ${missing.join(", ")}.`, "Return to the intervention owner and complete the required planning fields.", "training");
  }));
  [["Plan", source.plans], ["Actual", source.actuals]].forEach(([type, rows]) => rows.forEach((row, index) => {
    if (!Number.isFinite(Number(row.cost)) || Number(row.cost) < 0) add("Invalid costs", "High", `Correct ${type.toLowerCase()} cost`, `${type} ${row.id || index + 1}: ${row.employeeNumber || "No employee"} / ${row.course || "No course"}`, `The stored cost '${row.cost}' is not a valid non-negative amount.`, "Confirm the approved value and correct the cost before financial reporting.", "reports");
  }));
  source.actuals.forEach((row, index) => {
    if (!row.evidenceStatus || /required|missing|rejected|not confirmed/i.test(row.evidenceStatus)) add("Evidence gaps", "High", "Confirm achievement evidence", `Actual ${row.id || index + 1}: ${row.employeeNumber || "No employee"} / ${row.course || "No course"}`, `Evidence status: ${row.evidenceStatus || "Not recorded"}.`, "Reference the approved evidence location or return the achievement for correction.", "training");
  });
  buildRequestedPlannedAchievedReport(source).forEach((row, index) => {
    const location = [row.division, row.department, row.course, row.provider].filter(Boolean).join(" / ") || `Report row ${index + 1}`;
    if (row.requestedNotPlanned) add("WSP / ATR reconciliation", "Medium", "Review requested training not planned", location, `${row.requestedNotPlanned} requested record(s) are not represented in the WSP plan.`, "Confirm the planning decision and either add the plan or record the approved reason for exclusion.", "reports");
    if (row.plannedNotAchieved) add("WSP / ATR reconciliation", "Medium", "Review planned training not achieved", location, `${row.plannedNotAchieved} planned record(s) have no matching achievement.`, "Confirm delivery status, evidence timing and whether the item must be carried forward.", "reports");
    if (row.achievedNotPlanned) add("WSP / ATR reconciliation", "High", "Reconcile achievement outside the plan", location, `${row.achievedNotPlanned} achieved record(s) have no matching WSP plan.`, "Confirm the source record and record the approved reconciliation treatment before submission.", "reports");
  });
  return issues;
}

function dataQualityAssessment(source = state) {
  const issues = dataQualityIssues(source);
  const records = [...source.requests, ...source.plans, ...source.actuals];
  const checks = qualityCategoryDefinitions.map(definition => ({
    ...definition,
    count: issues.filter(issue => issue.category === definition.label).length
  }));
  const affected = checks.reduce((total, check) => total + check.count, 0);
  const denominator = Math.max(1, source.employees.length + records.length + source.actuals.length);
  const score = Math.max(0, Math.round(100 * (1 - Math.min(affected, denominator) / denominator)));
  return { checks, affected, score, issues };
}

function renderReadiness(source) {
  const result = dataQualityAssessment(source);
  const tone = result.score >= 90 ? "good" : result.score >= 70 ? "warn" : "risk";
  document.getElementById("readinessScore").textContent = `${result.score}%`;
  document.getElementById("readinessLabel").textContent = result.score >= 90 ? "Ready for final review" : result.score >= 70 ? "Review required" : "Material gaps remain";
  document.getElementById("readinessBar").style.width = `${result.score}%`;
  document.getElementById("readinessBar").dataset.tone = tone;
  document.getElementById("readinessSummary").textContent = result.affected ? `${result.affected} check results require attention before submission.` : "No data-quality exceptions were found in the active dataset.";
  const status = document.getElementById("qualityStatus");
  status.textContent = result.affected ? `${result.affected} items to review` : "Checks passed";
  status.className = `status-pill ${tone}`;
  document.getElementById("qualityChecks").innerHTML = result.checks.map(check => `
    <button class="quality-check ${check.count ? "has-issues" : "clear"}" data-view-target="submission" data-submission-filter="${escapeHtml(check.label)}">
      <span><strong>${escapeHtml(check.label)}</strong><small>${escapeHtml(check.note)}</small></span>
      <b>${check.count}</b>
    </button>`).join("");
}

function recordKey(row) {
  return [row.employeeNumber, row.course, row.provider, String(row.period || "").slice(0, 7)].join("|").toLowerCase();
}

function reviewItems(row) {
  const reviewStatuses = ["Confirmation Required", "Reconciliation Opportunity", "Missed / Needs Justification"];
  return ["regionCluster","division","department","sexGender","race","ageBand","disability"].filter(field => String(row[field] || "").includes("Confirmation Required")).length + (reviewStatuses.includes(row.reviewStatus || row.status) ? 1 : 0);
}

function buildRequestedPlannedAchievedReport(source) {
  const planKeys = new Set(source.plans.map(recordKey));
  const actualKeys = new Set(source.actuals.map(recordKey));
  const people = new Map(source.employees.map(person => [person.employeeNumber, person]));
  const bookingStatuses = new Map((source.bookings || []).map(booking => [recordKey(booking), normalizeBookingStatus(booking.bookingStatus)]));
  const planBookingStatuses = new Map((source.bookings || []).filter(booking => booking.planId).map(booking => [booking.planId, normalizeBookingStatus(booking.bookingStatus)]));
  const groups = new Map();
  const add = (record, type) => {
    const person = people.get(record.employeeNumber) || {};
    const row = { ...person, ...record };
    const key = [row.regionCluster, row.division, row.department, row.provider, row.course, row.sexGender, row.race, row.ageBand, row.disability].join("|");
    const current = groups.get(key) || {
      regionCluster: row.regionCluster, division: row.division, department: row.department, provider: row.provider, course: row.course,
      sexGender: row.sexGender, race: row.race, ageBand: row.ageBand, disability: row.disability,
      requested: 0, planned: 0, achieved: 0, requestedNotPlanned: 0, plannedNotAchieved: 0, achievedNotPlanned: 0, reviewItems: 0, bookingStatus: "", period: ""
    };
    if (row.period && !String(current.period).split(", ").includes(row.period)) current.period = current.period ? `${current.period}, ${row.period}` : row.period;
    const keyValue = recordKey(record);
    if (type === "request") {
      current.requested += 1;
      if (!planKeys.has(keyValue)) current.requestedNotPlanned += 1;
    }
    if (type === "plan") {
      current.planned += 1;
      if (!actualKeys.has(keyValue)) current.plannedNotAchieved += 1;
    }
    if (type === "actual") {
      current.achieved += 1;
      if (!planKeys.has(keyValue)) current.achievedNotPlanned += 1;
    }
    const bookingStatus = planBookingStatuses.get(record.id) || bookingStatuses.get(keyValue);
    if (bookingStatus && !current.bookingStatus.includes(bookingStatus)) current.bookingStatus = current.bookingStatus ? `${current.bookingStatus}, ${bookingStatus}` : bookingStatus;
    current.reviewItems += reviewItems(row);
    groups.set(key, current);
  };
  source.requests.forEach(row => add(row, "request"));
  source.plans.forEach(row => add(row, "plan"));
  source.actuals.forEach(row => add(row, "actual"));
  return Array.from(groups.values()).map(row => {
    row.completion = row.planned ? Math.round((Math.min(row.achieved, row.planned) / row.planned) * 100) : 0;
    row.status = row.reviewItems ? "Confirmation Required" : row.achievedNotPlanned ? "Reconciliation Opportunity" : row.plannedNotAchieved ? "Follow-up Opportunity" : "Ready";
    return row;
  });
}

function summary(rows = state.reportRows) {
  const s = rows.reduce((acc, row) => {
    ["requested","planned","achieved","requestedNotPlanned","plannedNotAchieved","achievedNotPlanned","reviewItems"].forEach(k => acc[k] += Number(row[k] || 0));
    return acc;
  }, { requested: 0, planned: 0, achieved: 0, requestedNotPlanned: 0, plannedNotAchieved: 0, achievedNotPlanned: 0, reviewItems: 0 });
  s.completion = s.planned ? Math.round((Math.min(s.achieved, s.planned) / s.planned) * 100) : 0;
  s.reportingGaps = s.requestedNotPlanned + s.plannedNotAchieved + s.achievedNotPlanned;
  return s;
}

function bookingSummary(bookings = state.bookings || []) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    booked: bookings.filter(b => normalizeBookingStatus(b.bookingStatus) === "Booked").length,
    upcoming: bookings.filter(b => ["Proposed","Booked"].includes(normalizeBookingStatus(b.bookingStatus)) && (b.date || "") >= today).length,
    completed: bookings.filter(b => normalizeBookingStatus(b.bookingStatus) === "Completed").length,
    missed: bookings.filter(b => normalizeBookingStatus(b.bookingStatus) === "Missed / Needs Justification").length
  };
}

function normalizeBookingStatus(status) {
  if (status === "Draft") return "Proposed";
  if (status === ["Attendance", "To", "Confirm"].join(" ")) return "Missed / Needs Justification";
  return status || "Not booked";
}

function courseFor(provider, course, sourceCourses = DEMO_DATA.courses || []) {
  return sourceCourses.find(item => item.provider === provider && item.course === course) || {};
}

function normalizeBookingRecord(booking = {}, sourceCourses = DEMO_DATA.courses || []) {
  const course = courseFor(booking.provider, booking.course, sourceCourses);
  const status = normalizeBookingStatus(booking.bookingStatus || booking.status);
  return {
    id: booking.id || crypto.randomUUID(),
    planId: booking.planId || "",
    employeeNumber: booking.employeeNumber || "",
    groupName: booking.groupName || "",
    provider: booking.provider || "",
    course: booking.course || "",
    period: booking.period || booking.date || booking.preferredWindow || "Date to be confirmed",
    preferredWindow: booking.preferredWindow || "Date to be confirmed",
    date: booking.date || "",
    startTime: booking.startTime || "",
    endTime: booking.endTime || "",
    deliveryMode: booking.deliveryMode || course.deliveryMode || "",
    location: booking.location || booking.venueLink || "",
    venueLink: booking.venueLink || booking.location || "",
    reminderStatus: booking.reminderStatus || "Not sent",
    evidenceRequired: booking.evidenceRequired || course.evidenceRequired || "Not confirmed",
    bookingNotes: booking.bookingNotes || "",
    bookingStatus: status,
    status
  };
}

function quarterFromPeriod(value) {
  const text = String(value || "").trim();
  const direct = text.match(/^Q[1-4]$/i);
  if (direct) return direct[0].toUpperCase();
  const date = new Date(text);
  if (!Number.isNaN(date.getTime())) return `Q${Math.floor(date.getMonth() / 3) + 1}`;
  return text.toUpperCase();
}

function matchesOverviewFilters(row) {
  const quarter = overviewFilterState.quarter;
  const provider = overviewFilterState.provider;
  const quarterOk = quarter === "All" || quarterFromPeriod(row.period || row.date) === quarter;
  const providerOk = provider === "All" || row.provider === provider;
  return quarterOk && providerOk;
}

function overviewSource() {
  const requests = state.requests.filter(matchesOverviewFilters);
  const plans = state.plans.filter(matchesOverviewFilters);
  const actuals = state.actuals.filter(matchesOverviewFilters);
  const bookings = (state.bookings || []).filter(matchesOverviewFilters);
  return { ...state, requests, plans, actuals, bookings };
}

function overviewEmployeeCount(source) {
  if (overviewFilterState.quarter === "All" && overviewFilterState.provider === "All") return state.employees.length;
  const numbers = new Set([...source.requests, ...source.plans, ...source.actuals, ...source.bookings].map(row => row.employeeNumber).filter(Boolean));
  return numbers.size;
}

function hydrateOverviewFilters() {
  const quarterSelect = document.getElementById("overviewQuarterFilter");
  const providerSelect = document.getElementById("overviewProviderFilter");
  if (!quarterSelect || !providerSelect) return;
  quarterSelect.value = overviewFilterState.quarter === "All" ? "All quarters" : overviewFilterState.quarter;
  const providers = Array.from(new Set([...state.requests, ...state.plans, ...state.actuals, ...(state.bookings || [])].map(row => row.provider).filter(Boolean))).sort();
  providerSelect.innerHTML = `<option>All providers</option>${providers.map(provider => `<option ${overviewFilterState.provider === provider ? "selected" : ""}>${provider}</option>`).join("")}`;
}

function setView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === id));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === id));
}

function kpiHtml(s) {
  return [
    ["Employees", state.employees.length], ["Requested / Suggested", s.requested], ["Planned WSP", s.planned], ["Achieved ATR", s.achieved],
    ["Requested Not Planned", s.requestedNotPlanned], ["Planned Not Achieved", s.plannedNotAchieved], ["Achieved Not Planned", s.achievedNotPlanned],
    ["Review Items", s.reviewItems], ["Reporting Gaps", s.reportingGaps]
  ].map(([label, value]) => `<article class="kpi"><span>${label}</span><strong>${typeof value === "number" ? value.toLocaleString("en-ZA") : value}</strong><small>demo value</small></article>`).join("");
}

function outcomeHtml(s) {
  return [
    ["Training Demand", s.requested, "Requested / Suggested training records from the workbook."],
    ["Planned WSP", s.planned, "Interventions visible for planning and booking."],
    ["Achieved ATR", s.achieved, "Completed activity ready for achievement reporting."]
  ].map(([label, value, note]) => `<article class="kpi executive outcome-card"><span>${label}</span><strong>${value.toLocaleString("en-ZA")}</strong><small>${note}</small></article>`).join("");
}

function riskHtml(s) {
  return [
    ["Requested Not Planned", s.requestedNotPlanned],
    ["Planned Not Achieved", s.plannedNotAchieved],
    ["Achieved Not Planned", s.achievedNotPlanned],
    ["Review Items", s.reviewItems]
  ].map(([label, value]) => `<article class="kpi review-kpi"><span>${label}</span><strong>${typeof value === "number" ? value.toLocaleString("en-ZA") : value}</strong><small>demo records</small></article>`).join("");
}

function renderOverview() {
  hydrateOverviewFilters();
  const source = overviewSource();
  const rows = buildRequestedPlannedAchievedReport(source);
  const s = summary(rows);
  const b = bookingSummary(source.bookings);
  const employeeCount = overviewEmployeeCount(source);
  renderReadiness(source);
  const annualPayroll = employeeCount * 420000;
  const estimatedSdl = annualPayroll * 0.01;
  const mandatoryGrant = estimatedSdl * 0.2;
  const grantAtRisk = mandatoryGrant * Math.min(1, (s.reviewItems + s.plannedNotAchieved + s.achievedNotPlanned) / Math.max(1, s.planned + s.achieved));
  const max = Math.max(s.requested, s.planned, s.achieved, 1);
  const outcomeTarget = document.getElementById("overviewOutcomes");
  if (outcomeTarget) outcomeTarget.innerHTML = outcomeHtml(s, employeeCount);
  document.getElementById("overviewKpis").innerHTML = riskHtml(s);
  document.getElementById("financialExposure").innerHTML = [
    ["Annual payroll estimate", currency.format(annualPayroll)],
    ["Estimated SDL", currency.format(estimatedSdl)],
    ["Potential mandatory grant", currency.format(mandatoryGrant)],
    ["Grant value at risk", currency.format(grantAtRisk)],
    ["Evidence / review gap", s.reviewItems],
    ["Review status", "Needs Review"]
  ].map(([label, value]) => `<article class="kpi"><span>${label}</span><strong>${value}</strong><small>demo planning estimate</small></article>`).join("");
  document.getElementById("bookingKpis").innerHTML = [
    ["Booked Training", b.booked], ["Upcoming Sessions", b.upcoming], ["Completed Bookings", b.completed], ["Missed / Needs Justification", b.missed]
  ].map(([label, value]) => `<article class="summary-tile"><span>${label}</span><strong>${value}</strong><small>demo bookings</small></article>`).join("");
  document.getElementById("relationshipBars").innerHTML = [
    ["Requested / Suggested", s.requested, "#0067a0"], ["Planned WSP", s.planned, "#0b7f46"], ["Achieved ATR", s.achieved, "#6f4bb7"]
  ].map(([label, value, color]) => `<div class="bar-row"><div><strong>${label}</strong><span>${value} records</span></div><div class="bar-track"><span style="width:${Math.max(8, Math.round((value / max) * 100))}%;background:${color}"></span></div></div>`).join("");
  document.getElementById("reviewOverview").innerHTML = [
    ["Requested not planned", s.requestedNotPlanned, s.requestedNotPlanned ? "risk" : "good"],
    ["Planned not achieved", s.plannedNotAchieved, s.plannedNotAchieved ? "risk" : "good"],
    ["Achieved not planned", s.achievedNotPlanned, s.achievedNotPlanned ? "risk" : "good"],
    ["Review items", s.reviewItems, s.reviewItems ? "warn" : "good"]
  ].map(([label, value, tone]) => `<div class="issue ${tone}"><strong>${label}</strong><span>${value} demo records</span></div>`).join("");
  const providerCounts = source.plans.reduce((acc, row) => ((acc[row.provider] = (acc[row.provider] || 0) + 1), acc), {});
  const providerMax = Math.max(...Object.values(providerCounts), 1);
  document.getElementById("providerSummary").innerHTML = Object.entries(providerCounts).slice(0, 6).map(([label, value]) => `<div class="bar-row"><div><strong>${label}</strong><span>${value} planned WSP records</span></div><div class="bar-track"><span style="width:${Math.max(8, Math.round((value / providerMax) * 100))}%"></span></div></div>`).join("");
  document.getElementById("latestActivityRows").innerHTML = [...source.actuals.slice(-4), ...source.plans.slice(-4)].slice(-6).reverse().map(row => `<tr><td>${row.evidenceStatus ? "ATR" : "WSP"}</td><td>${employee(row.employeeNumber).employeeName}</td><td>${row.course}</td><td>${row.provider}</td><td>${row.status || row.evidenceStatus || "Clean"}</td></tr>`).join("") || `<tr><td colspan="5">No demo records match the selected filters.</td></tr>`;
}

function renderWorkbook() {
  const hasRows = stagedRows.length > 0;
  const isApplied = workbookStageState === "applied";
  const detectedColumns = workbookMeta?.columns?.length ? workbookMeta.columns : (stagedRows[0] ? Object.keys(stagedRows[0]) : requiredColumns);
  const detectedColumnSet = new Set(detectedColumns);
  const currentCounts = {
    requested: state.requests.length,
    planned: state.plans.length,
    achieved: state.actuals.length,
    total: state.requests.length + state.plans.length + state.actuals.length
  };
  const stagedCounts = hasRows ? stagedRows.reduce((acc, row) => {
    if (row["Requested / Suggested"] === "Yes") acc.requested += 1;
    if (row["Planned WSP"] === "Yes") acc.planned += 1;
    if (row["Achieved ATR"] === "Yes") acc.achieved += 1;
    return acc;
  }, { requested: 0, planned: 0, achieved: 0 }) : null;
  if (stagedCounts) stagedCounts.total = stagedCounts.requested + stagedCounts.planned + stagedCounts.achieved;
  document.getElementById("workbookSteps").innerHTML = [
    ["1", "Load workbook", hasRows || isApplied ? "complete" : "active"],
    ["2", "Review preview", hasRows && !isApplied ? "active" : isApplied ? "complete" : ""],
    ["3", "Apply to staging", isApplied ? "complete" : hasRows ? "ready" : ""]
  ].map(([number, label, status]) => `<div class="workbook-step ${status}"><span>${number}</span><strong>${label}</strong></div>`).join("");
  document.getElementById("detectedColumns").innerHTML = detectedColumns.map(col => `<div><span>${col}</span><strong>${requiredColumns.includes(col) ? "Mapped" : "Extra"}</strong></div>`).join("");
  document.getElementById("fieldChecklist").innerHTML = requiredColumns.map(col => {
    const complete = !hasRows || detectedColumnSet.has(col);
    return `<div class="check-row ${complete ? "complete" : "warn"}"><span>${complete ? "OK" : "CHECK"}</span><div><strong>${col}</strong><small>${complete ? "mapping ready" : "not found in workbook; demo fallback used"}</small></div></div>`;
  }).join("");
  const workbookSource = workbookMeta
    ? `<div class="issue ${workbookMeta.ignoredRows ? "warn" : "good"}"><strong>${escapeHtml(workbookMeta.fileName)}</strong><span>${workbookMeta.usedRows.toLocaleString("en-ZA")} rows mapped from ${workbookMeta.sheetCount} sheet${workbookMeta.sheetCount === 1 ? "" : "s"}. ${workbookMeta.ignoredRows ? `${workbookMeta.ignoredRows.toLocaleString("en-ZA")} rows were ignored because they had no usable employee, course or provider signal.` : "No unusable rows detected."}</span></div>`
    : "";
  document.getElementById("importImpact").innerHTML = [
    workbookSource,
    `<div class="issue good"><strong>Active dashboard source</strong><span>${isApplied ? "Loaded workbook" : "Baseline sample"}: ${currentCounts.total.toLocaleString("en-ZA")} included report records (${currentCounts.requested} requested, ${currentCounts.planned} planned, ${currentCounts.achieved} achieved).</span></div>`,
    hasRows && !isApplied
      ? `<div class="issue warn"><strong>Workbook staged for refresh</strong><span>${stagedRows.length.toLocaleString("en-ZA")} workbook rows will refresh the dashboard to ${stagedCounts.total.toLocaleString("en-ZA")} included report records (${stagedCounts.requested} requested, ${stagedCounts.planned} planned, ${stagedCounts.achieved} achieved).</span></div>`
      : `<div class="issue good"><strong>Workbook loader</strong><span>Load the sample workbook, upload Excel or upload CSV to preview new rows before applying them to the dashboard.</span></div>`
  ].filter(Boolean).join("");
  document.getElementById("importPreview").innerHTML = (stagedRows.length ? stagedRows : sampleWorkbookRows()).slice(0, 8).map(row => `<tr><td>${row["Employee Name"]}</td><td>${row["Course / Intervention"]}</td><td>${row["Requested / Suggested"]}</td><td>${row["Planned WSP"]}</td><td>${row["Achieved ATR"]}</td><td>${row["Review Status"]}</td></tr>`).join("");
  ["applyStaging", "applyStagingPreview"].forEach(id => {
    const button = document.getElementById(id);
    if (!button) return;
    button.disabled = !hasRows || isApplied;
    button.classList.toggle("primary", hasRows && !isApplied);
    button.textContent = isApplied ? "Applied To Staging" : "Apply To Staging";
  });
}

function renderTraining() {
  const form = document.getElementById("trainingForm");
  form.employeeNumber.innerHTML = state.employees.map(e => `<option value="${e.employeeNumber}">${e.employeeName} (${e.employeeNumber})</option>`).join("");
  if (selectedEmployeeNumber) form.employeeNumber.value = selectedEmployeeNumber;
  form.provider.innerHTML = state.providers.map(p => `<option>${p.provider}</option>`).join("");
  form.course.innerHTML = state.courses.map(c => `<option>${c.course}</option>`).join("");
  updateTrainingBookingDefaults(true);
  updateInheritedFields();
  hydrateProviderFilters();
  renderCourseResults();
  renderBookingForm();
  renderBookingRows();
  renderTrainingRows();
}

function renderBookingForm() {
  const form = document.getElementById("bookingForm");
  const trainingForm = document.getElementById("trainingForm");
  const selectedPlanId = form.planId.value;
  const personPlans = state.plans.filter(plan => plan.employeeNumber === selectedEmployeeNumber);
  form.planId.innerHTML = `<option value="NEW">New booking from selected course</option>${personPlans.map(plan => `<option value="${plan.id}">${plan.course} (${plan.status || "Clean"})</option>`).join("")}`;
  form.employeeNumber.innerHTML = state.employees.map(e => `<option value="${e.employeeNumber}">${e.employeeName} (${e.employeeNumber})</option>`).join("");
  form.employeeNumber.value = selectedEmployeeNumber;
  if (selectedPlanId && [...form.planId.options].some(option => option.value === selectedPlanId)) form.planId.value = selectedPlanId;
  if (form.planId.value === "NEW") {
    form.provider.value = trainingForm.provider.value || state.providers[0]?.provider || "";
    form.course.value = trainingForm.course.value || state.courses[0]?.course || "";
  }
  updateBookingFields();
}

function updateBookingFields() {
  const form = document.getElementById("bookingForm");
  const trainingForm = document.getElementById("trainingForm");
  const plan = form.planId.value === "NEW" ? {
    employeeNumber: selectedEmployeeNumber,
    provider: trainingForm.provider.value,
    course: trainingForm.course.value,
    preferredWindow: trainingForm.preferredWindow.value,
    bookingStatus: trainingForm.bookingStatus.value
  } : state.plans.find(item => item.id === form.planId.value) || {};
  const course = courseFor(plan.provider, plan.course, state.courses);
  form.provider.value = plan.provider || "";
  form.course.value = plan.course || "";
  form.employeeNumber.value = plan.employeeNumber || selectedEmployeeNumber;
  if (!form.preferredWindow.dataset.touched || !form.preferredWindow.value) form.preferredWindow.value = plan.preferredWindow || "Next month";
  if (!form.bookingStatus.dataset.touched || !form.bookingStatus.value || form.bookingStatus.value === "Not booked") form.bookingStatus.value = normalizeBookingStatus(plan.bookingStatus || "Proposed");
  if (!form.deliveryMode.dataset.touched) form.deliveryMode.value = plan.deliveryMode || course.deliveryMode || form.deliveryMode.value;
  if (!form.evidenceRequired.dataset.touched) form.evidenceRequired.value = plan.evidenceRequired || course.evidenceRequired || form.evidenceRequired.value || "Attendance register";
  if (!form.location.value) form.location.value = plan.provider?.includes("Digital") ? "Online meeting link" : "Demo Training Room 1";
}

function updateTrainingBookingDefaults(force = false) {
  const form = document.getElementById("trainingForm");
  const type = form.recordType.value;
  const defaults = {
    request: { preferredWindow: "Date to be confirmed", bookingStatus: "Not booked", evidenceRequired: "Not confirmed" },
    plan: { preferredWindow: "Next month", bookingStatus: "Proposed", evidenceRequired: "Attendance register" },
    actual: { preferredWindow: "Date to be confirmed", bookingStatus: "Completed", evidenceRequired: "Certificate" }
  }[type];
  if (!defaults) return;
  if (force || !form.preferredWindow.dataset.touched) form.preferredWindow.value = defaults.preferredWindow;
  if (force || !form.bookingStatus.dataset.touched) form.bookingStatus.value = defaults.bookingStatus;
  if (force || !form.evidenceRequired.dataset.touched) form.evidenceRequired.value = defaults.evidenceRequired;
}

function renderBookingRows() {
  const rows = (state.bookings || []).filter(booking => booking.employeeNumber === selectedEmployeeNumber);
  document.getElementById("bookingRows").innerHTML = rows.map(booking => {
    const person = employee(booking.employeeNumber);
    const name = booking.groupName || person.employeeName || "Demo cohort";
    const atr = state.actuals.some(row => row.employeeNumber === booking.employeeNumber && row.provider === booking.provider && row.course === booking.course) ? "ATR captured" : "Pending ATR";
    const dateOrWindow = booking.date || "Date to be confirmed";
    const time = booking.startTime || booking.endTime ? `${friendly(booking.startTime, "09:00")} - ${friendly(booking.endTime, "12:00")}` : "Not specified";
    return `<tr><td>${normalizeBookingStatus(booking.bookingStatus)}</td><td>${friendly(name, "Demo cohort")}</td><td>${friendly(booking.provider)}</td><td>${friendly(booking.course)}</td><td>${friendly(booking.preferredWindow, "Date to be confirmed")}</td><td>${friendly(dateOrWindow, "Date to be confirmed")}</td><td>${time}</td><td>${friendly(booking.deliveryMode)}</td><td>${friendly(booking.location || booking.venueLink)}</td><td>${friendly(booking.reminderStatus, "Not sent")}</td><td>${friendly(booking.evidenceRequired, "Not confirmed")}</td><td>${atr}</td><td><button class="table-action" data-booking-complete="${booking.id}">Mark Completed</button> <button class="table-action" data-booking-atr="${booking.id}">Record ATR</button> <button class="table-action" data-booking-missed="${booking.id}">Mark Missed</button></td></tr>`;
  }).join("") || `<tr><td colspan="13">No bookings for the selected employee yet.</td></tr>`;
}

function renderTrainingRows() {
  const rows = [
    ...state.requests.filter(row => row.employeeNumber === selectedEmployeeNumber).map(row => ["Request", row]),
    ...state.plans.filter(row => row.employeeNumber === selectedEmployeeNumber).map(row => ["Plan", row]),
    ...state.actuals.filter(row => row.employeeNumber === selectedEmployeeNumber).map(row => ["ATR", row])
  ].sort((a, b) => (a[1].createdAt || 0) - (b[1].createdAt || 0));
  document.getElementById("trainingRows").innerHTML = rows.slice(-12).map(([type,row]) => {
    const booking = state.bookings.find(item => item.employeeNumber === row.employeeNumber && item.provider === row.provider && item.course === row.course);
    const bookingStatus = booking ? normalizeBookingStatus(booking.bookingStatus) : friendly(row.bookingStatus, type === "Plan" ? "Not booked" : "Not applicable");
    const matchingCourse = courseFor(row.provider, row.course, state.courses);
    const action = type === "Plan"
      ? `<button class="table-action" data-book-plan="${row.id}">Book</button>`
      : matchingCourse.id ? `<button class="table-action" data-use-course="${matchingCourse.id}">Select</button>` : "";
    return `<tr><td>${type}</td><td>${friendly(row.course)}</td><td>${friendly(row.provider)}</td><td>${friendly(row.period, "Date to be confirmed")}</td><td>${bookingStatus}</td><td>${friendly(row.evidenceRequired || row.evidenceStatus, "Not confirmed")}</td><td>${friendly(row.status || row.reviewStatus, "Clean")}</td><td>${action}</td></tr>`;
  }).join("") || `<tr><td colspan="8">No interventions for the selected employee yet. Select a relevant course below or save a new record on the left.</td></tr>`;
}

function updateInheritedFields() {
  const form = document.getElementById("trainingForm");
  const person = employee(form.employeeNumber.value);
  selectedEmployeeNumber = form.employeeNumber.value;
  const fields = [
    ["Region", person.regionCluster],
    ["Division", person.division],
    ["Department", person.department],
    ["Gender", person.sexGender],
    ["Race", person.race],
    ["Age", `${person.age} (${person.ageBand})`],
    ["Disability", person.disability]
  ];
  document.getElementById("inheritedFields").innerHTML = fields.map(([label, value]) => `<span><small>${escapeHtml(label)}</small>${escapeHtml(friendly(value))}</span>`).join("");
}

function hydrateProviderFilters() {
  const providerFilter = document.getElementById("providerFilter");
  providerFilter.innerHTML = `<option value="All">All providers</option>${state.providers.map(p => `<option>${p.provider}</option>`).join("")}`;
  const categories = Array.from(new Set(state.courses.map(c => c.category))).sort();
  document.getElementById("categoryFilter").innerHTML = `<option value="All">All categories</option>${categories.map(c => `<option>${c}</option>`).join("")}`;
}

function relevantCategoriesForEmployee(person) {
  const text = [person.department, person.division, person.regionCluster, person.jobTitle].join(" ").toLowerCase();
  if (text.includes("passenger") || text.includes("customer")) return ["Service", "Operations", "Safety", "Digital"];
  if (text.includes("airside") || text.includes("airport") || text.includes("operations")) return ["Operations", "Safety", "Technical", "Service"];
  if (text.includes("corporate") || text.includes("finance") || text.includes("admin")) return ["Digital", "Leadership", "Service"];
  if (text.includes("human") || text.includes("hr") || text.includes("people")) return ["Leadership", "Digital", "Service"];
  if (text.includes("technical") || text.includes("maintenance") || text.includes("rescue") || text.includes("fire")) return ["Technical", "Safety", "Operations"];
  return ["Operations", "Safety", "Service", "Digital", "Leadership", "Technical"];
}

function employeeCourseHistorySet(employeeNumber) {
  return new Set([
    ...state.requests.filter(row => row.employeeNumber === employeeNumber).map(row => `${row.provider}|${row.course}`),
    ...state.plans.filter(row => row.employeeNumber === employeeNumber).map(row => `${row.provider}|${row.course}`),
    ...state.actuals.filter(row => row.employeeNumber === employeeNumber).map(row => `${row.provider}|${row.course}`)
  ]);
}

function courseRelevanceForEmployee(course, person, history) {
  if (history.has(`${course.provider}|${course.course}`)) return { score: 3, label: "Already linked" };
  const categories = relevantCategoriesForEmployee(person);
  if (categories[0] === course.category) return { score: 2, label: "Best match" };
  if (categories.includes(course.category)) return { score: 1, label: "Profile match" };
  return { score: 0, label: "Catalogue option" };
}

function renderCourseResults() {
  const providerText = document.getElementById("providerSearch").value.toLowerCase();
  const courseText = document.getElementById("courseSearch").value.toLowerCase();
  const provider = document.getElementById("providerFilter").value;
  const category = document.getElementById("categoryFilter").value;
  const hasManualFilter = providerText || courseText || provider !== "All" || category !== "All";
  const person = employee(selectedEmployeeNumber);
  const history = employeeCourseHistorySet(selectedEmployeeNumber);
  const rows = state.courses
    .map(course => ({ ...course, relevance: courseRelevanceForEmployee(course, person, history) }))
    .filter(c => (provider === "All" || c.provider === provider) && (category === "All" || c.category === category) && c.provider.toLowerCase().includes(providerText) && c.course.toLowerCase().includes(courseText))
    .filter(c => hasManualFilter || c.relevance.score > 0)
    .sort((a, b) => b.relevance.score - a.relevance.score || a.provider.localeCompare(b.provider) || a.course.localeCompare(b.course));
  document.getElementById("courseResults").innerHTML = rows.map(c => `<tr class="${c.relevance.score > 0 ? "course-relevant" : ""}"><td>${c.provider}</td><td>${c.course}</td><td>${c.category}</td><td>${c.duration}</td><td>${c.deliveryMode}</td><td>${currency.format(c.estimatedCost)}</td><td>${c.evidenceRequired}</td><td><span class="relevance-pill">${c.relevance.label}</span></td><td><button data-use-course="${c.id}">Select</button></td></tr>`).join("") || `<tr><td colspan="9">No courses match the selected employee context and filters.</td></tr>`;
}

function renderPeople() {
  const q = document.getElementById("peopleSearch").value.toLowerCase();
  const people = state.employees.filter(e => e.employeeName.toLowerCase().includes(q) || e.employeeNumber.includes(q)).slice(0, 30);
  if (!people.some(p => p.employeeNumber === selectedEmployeeNumber)) selectedEmployeeNumber = people[0]?.employeeNumber || state.employees[0].employeeNumber;
  document.getElementById("peopleList").innerHTML = people.map(e => `<button class="employee-item ${e.employeeNumber === selectedEmployeeNumber ? "active" : ""}" data-person="${e.employeeNumber}"><strong>${e.employeeName}</strong><span>${mask(e.employeeNumber)} - ${e.department}</span></button>`).join("");
  const p = employee(selectedEmployeeNumber);
  const req = state.requests.filter(r => r.employeeNumber === p.employeeNumber);
  const plans = state.plans.filter(r => r.employeeNumber === p.employeeNumber);
  const bookings = (state.bookings || []).filter(r => r.employeeNumber === p.employeeNumber);
  const actuals = state.actuals.filter(r => r.employeeNumber === p.employeeNumber);
  document.getElementById("personProfile").innerHTML = `<h2>${p.employeeName}</h2><p>${p.department} - ${p.regionCluster}</p><dl class="info-list"><div><dt>Employee Number</dt><dd>${mask(p.employeeNumber)}</dd></div><div><dt>ID Number</dt><dd>${mask(p.idNumber)}</dd></div><div><dt>Region / Cluster</dt><dd>${p.regionCluster}</dd></div><div><dt>Division</dt><dd>${p.division}</dd></div><div><dt>Department</dt><dd>${p.department}</dd></div><div><dt>Sex / Gender</dt><dd>${p.sexGender}</dd></div><div><dt>Race</dt><dd>${p.race}</dd></div><div><dt>Age</dt><dd>${p.age}</dd></div><div><dt>Age Band</dt><dd>${p.ageBand}</dd></div><div><dt>Disability</dt><dd>${p.disability}</dd></div></dl><div class="profile-note">Requested: ${req.length} | Planned: ${plans.length} | Bookings: ${bookings.length} | Achieved: ${actuals.length}</div><div class="table-wrap"><table><thead><tr><th>Type</th><th>Course</th><th>Provider</th><th>Evidence / Review Status</th></tr></thead><tbody>${[...req.map(r=>["Requested / Suggested",r]),...plans.map(r=>["Planned WSP",r]),...actuals.map(r=>["Achieved ATR",r])].map(([type,row])=>`<tr><td>${type}</td><td>${friendly(row.course)}</td><td>${friendly(row.provider)}</td><td>${friendly(row.evidenceStatus || row.status, "Clean")}</td></tr>`).join("")}</tbody></table></div><section class="profile-card"><div class="compact-head"><h3>Training Bookings</h3></div><div class="table-wrap"><table><thead><tr><th>Course</th><th>Provider</th><th>Preferred Window</th><th>Training Date</th><th>Booking Status</th><th>Delivery Mode</th><th>Evidence Required</th></tr></thead><tbody>${bookings.map(row => `<tr><td>${friendly(row.course)}</td><td>${friendly(row.provider)}</td><td>${friendly(row.preferredWindow, "Date to be confirmed")}</td><td>${friendly(row.date, "Date to be confirmed")}</td><td>${normalizeBookingStatus(row.bookingStatus)}</td><td>${friendly(row.deliveryMode)}</td><td>${friendly(row.evidenceRequired, "Not confirmed")}</td></tr>`).join("") || `<tr><td colspan="7">No bookings for this demo profile.</td></tr>`}</tbody></table></div></section>`;
}

function renderReports() {
  state.reportRows = buildRequestedPlannedAchievedReport(state);
  hydrateReportFilters();
  const rows = filteredReportRows();
  renderReportFilterSummary(rows);
  renderReportCoverage(rows);
  document.getElementById("reportKpis").innerHTML = kpiHtml(summary(rows));
  document.getElementById("reportRows").innerHTML = rows.map(row => `<tr>${reportColumns.map(([field]) => `<td>${reportCellValue(row, field)}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="19">No records match the selected filters.</td></tr>`;
}

function currentFilters() {
  return Object.fromEntries(filterDefs.map(([field]) => [field, reportFilterState[field] || "All"]));
}

function activeFilters() {
  return filterDefs
    .map(([field, label]) => [label, currentFilters()[field]])
    .filter(([, value]) => value && value !== "All");
}

function filteredReportRows() {
  const filters = currentFilters();
  return state.reportRows.filter(row => Object.entries(filters).every(([field, value]) => value === "All" || String(row[field] || "").split(", ").includes(value)));
}

function reportCellValue(row, field) {
  if (field === "completion") return `${row.completion}%`;
  if (field === "bookingStatus") return row.bookingStatus || "No booking";
  return row[field] ?? "";
}

function renderReportFilterSummary(rows) {
  const active = activeFilters();
  document.getElementById("reportFilterSummary").innerHTML = `<strong>Records shown: ${rows.length.toLocaleString("en-ZA")}</strong><span>Active filters: ${active.length ? active.map(([label, value]) => `${label} = ${value}`).join(", ") : "None"}</span>`;
}

function uniqueSorted(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function rowPeriods(row) {
  return String(row.period || "").split(", ").map(value => value.trim()).filter(Boolean);
}

function parseReportDate(value) {
  const text = String(value || "").trim();
  if (!/^\d{4}-\d{2}(-\d{2})?$/.test(text)) return null;
  const date = new Date(text.length === 7 ? `${text}-01T00:00:00` : `${text}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function monthKey(date) {
  return date.toISOString().slice(0, 7);
}

function monthLabel(key) {
  const date = new Date(`${key}-01T00:00:00`);
  return date.toLocaleDateString("en-ZA", { month: "short", year: "numeric" });
}

function monthsBetween(startKey, endKey) {
  const months = [];
  const cursor = new Date(`${startKey}-01T00:00:00`);
  const end = new Date(`${endKey}-01T00:00:00`);
  while (cursor <= end) {
    months.push(monthKey(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

function reportCoverage(rows) {
  const dates = rows.flatMap(row => rowPeriods(row).map(parseReportDate)).filter(Boolean).sort((a, b) => a - b);
  const periods = uniqueSorted(rows.flatMap(rowPeriods));
  const quarters = uniqueSorted(periods.map(quarterFromPeriod).filter(value => /^Q[1-4]$/.test(value)));
  if (!dates.length) {
    return {
      hasDateRange: false,
      rows: rows.length,
      quarters,
      exportDate: new Date().toISOString().slice(0, 10)
    };
  }
  const first = dates[0];
  const last = dates[dates.length - 1];
  const includedMonths = uniqueSorted(dates.map(monthKey));
  const expectedMonths = monthsBetween(monthKey(first), monthKey(last));
  const missingMonths = expectedMonths.filter(key => !includedMonths.includes(key));
  return {
    hasDateRange: true,
    rows: rows.length,
    earliest: monthKey(first),
    latest: monthKey(last),
    includedMonths,
    missingMonths,
    quarters,
    years: uniqueSorted(dates.map(date => String(date.getFullYear()))),
    exportDate: new Date().toISOString().slice(0, 10)
  };
}

function renderReportCoverage(rows) {
  const coverage = reportCoverage(rows);
  const dateText = coverage.hasDateRange
    ? `${monthLabel(coverage.earliest)} to ${monthLabel(coverage.latest)}`
    : "Date coverage not available from current demo fields.";
  const monthText = coverage.hasDateRange
    ? `<span><strong>Months included:</strong> ${coverage.includedMonths.map(monthLabel).join(", ")}</span><span><strong>Missing months:</strong> ${coverage.missingMonths.length ? coverage.missingMonths.map(monthLabel).join(", ") : "None"}</span>`
    : "";
  document.getElementById("reportCoverage").innerHTML = `<div><strong>Report coverage:</strong> ${dateText}</div>${monthText}<span><strong>Quarter coverage:</strong> ${coverage.quarters.length ? coverage.quarters.join(", ") : "Not available"}</span>${coverage.years?.length ? `<span><strong>Year coverage:</strong> ${coverage.years.join(", ")}</span>` : ""}<span><strong>Rows included:</strong> ${coverage.rows.toLocaleString("en-ZA")}</span><span><strong>Export date:</strong> ${coverage.exportDate}</span>`;
}

function resetReportFiltersState() {
  reportFilterState = Object.fromEntries(filterDefs.map(([field]) => [field, "All"]));
}

function hydrateReportFilters() {
  const current = currentFilters();
  document.getElementById("reportFilters").innerHTML = filterDefs.map(([field,label]) => {
    const values = Array.from(new Set(state.reportRows.flatMap(r => String(r[field] || "").split(", ")).filter(Boolean))).sort();
    return `<label>${label}<select id="filter-${field}"><option value="All">All</option>${values.map(v => `<option ${current[field] === v ? "selected" : ""}>${v}</option>`).join("")}</select></label>`;
  }).join("");
  filterDefs.forEach(([field]) => document.getElementById(`filter-${field}`).addEventListener("change", event => {
    reportFilterState[field] = event.target.value || "All";
    renderReports();
  }));
}

function executiveSummaryText() {
  if (document.getElementById("reports")?.classList.contains("active")) {
    state.reportRows = buildRequestedPlannedAchievedReport(state);
    const rows = filteredReportRows();
    const hasFilters = activeFilters().length > 0;
    return hasFilters
      ? `Demo summary: the current filtered view shows ${rows.length.toLocaleString("en-ZA")} report rows covering requested training, planned WSP activity, achieved ATR activity, reporting gaps and review items. This is demo data only and is intended to support management review.`
      : "Demo summary: the full demo report shows requested training, planned WSP activity, achieved ATR activity, reporting gaps and review items. This is demo data only and is intended to support management review.";
  }
  return "Demo summary: the dashboard shows requested training, planned WSP activity, achieved ATR activity, reporting gaps and records needing review. The current focus areas are workbook demand, planned WSP activity, achieved ATR activity and records that need review before management reporting.";
}

function copyExecutiveSummary() {
  copyText(executiveSummaryText(), "Executive summary copied.");
}

function reportRowsAsDelimited(rows, delimiter) {
  const header = reportColumns.map(([, label]) => label).join(delimiter);
  const body = rows.map(row => reportColumns.map(([field]) => String(reportCellValue(row, field)).replace(/\r?\n/g, " ")).join(delimiter));
  return [header, ...body].join("\r\n");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function reportRowsAsCsv(rows) {
  const header = reportColumns.map(([, label]) => csvEscape(label)).join(",");
  const body = rows.map(row => reportColumns.map(([field]) => csvEscape(reportCellValue(row, field))).join(","));
  return `\uFEFF${[header, ...body].join("\r\n")}`;
}

function copyFilteredReport() {
  state.reportRows = buildRequestedPlannedAchievedReport(state);
  const rows = filteredReportRows();
  if (!rows.length) {
    alert("No filtered rows to copy.");
    return;
  }
  copyText(reportRowsAsDelimited(rows, "\t"), "Filtered report copied. Paste into Excel or email.");
}

function exportFilteredReport() {
  state.reportRows = buildRequestedPlannedAchievedReport(state);
  const rows = filteredReportRows();
  if (!rows.length) {
    alert("No records match the selected filters. Adjust filters before exporting.");
    return;
  }
  const coverage = reportCoverage(rows);
  const date = coverage.hasDateRange ? `${coverage.earliest}-to-${coverage.latest}` : coverage.exportDate;
  const blob = new Blob([reportRowsAsCsv(rows)], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `wsp-atr-report-${date}.csv`;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

function reviewAction(issue) {
  return {
    owner: "SDF administrator",
    dueDate: "",
    status: "Open",
    evidenceReference: "",
    ...(state.reviewActions?.[issue.id] || {})
  };
}

function isClosedAction(status) {
  return ["Resolved", "Accepted exception"].includes(status);
}

function currentSubmissionIssues() {
  return dataQualityIssues(state).map(issue => ({ ...issue, action: reviewAction(issue) }));
}

function submissionMetrics(issues = currentSubmissionIssues()) {
  const open = issues.filter(issue => !isClosedAction(issue.action.status));
  const high = open.filter(issue => issue.severity === "High");
  const resolved = issues.length - open.length;
  const decision = high.length ? "HOLD" : open.length ? "CONDITIONAL" : "READY";
  return { open, high, resolved, decision };
}

function submissionDecisionCopy(metrics) {
  if (metrics.decision === "HOLD") return `${metrics.high.length} unresolved high-priority finding${metrics.high.length === 1 ? "" : "s"} block submission.`;
  if (metrics.decision === "CONDITIONAL") return `${metrics.open.length} action${metrics.open.length === 1 ? " remains" : "s remain"} before final approval.`;
  return "All generated findings are resolved or formally accepted as exceptions.";
}

function renderSubmission() {
  const issues = currentSubmissionIssues();
  const metrics = submissionMetrics(issues);
  const assessment = dataQualityAssessment(state);
  const categories = qualityCategoryDefinitions.map(item => item.label);
  const categoryFilter = document.getElementById("submissionCategoryFilter");
  if (categoryFilter) {
    categoryFilter.innerHTML = `<option value="All">All categories</option>${categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}`;
    categoryFilter.value = submissionFilterState.category;
  }
  const severityFilter = document.getElementById("submissionSeverityFilter");
  const statusFilter = document.getElementById("submissionStatusFilter");
  if (severityFilter) severityFilter.value = submissionFilterState.severity;
  if (statusFilter) statusFilter.value = submissionFilterState.status;
  const visible = issues.filter(issue => {
    const categoryOk = submissionFilterState.category === "All" || issue.category === submissionFilterState.category;
    const severityOk = submissionFilterState.severity === "All" || issue.severity === submissionFilterState.severity;
    const statusOk = submissionFilterState.status === "All" || (submissionFilterState.status === "Open actions" ? !isClosedAction(issue.action.status) : issue.action.status === submissionFilterState.status);
    return categoryOk && severityOk && statusOk;
  });
  document.getElementById("submissionDecision").textContent = metrics.decision;
  document.getElementById("submissionDecisionNote").textContent = submissionDecisionCopy(metrics);
  document.getElementById("submissionDecisionCard").dataset.tone = metrics.decision.toLowerCase();
  document.getElementById("submissionOpenCount").textContent = metrics.open.length.toLocaleString("en-ZA");
  document.getElementById("submissionHighCount").textContent = metrics.high.length.toLocaleString("en-ZA");
  document.getElementById("submissionResolvedCount").textContent = metrics.resolved.toLocaleString("en-ZA");
  document.getElementById("submissionScore").textContent = `${assessment.score}%`;
  document.getElementById("submissionFilterCount").textContent = `${visible.length} finding${visible.length === 1 ? "" : "s"}`;
  document.getElementById("submissionIssueRows").innerHTML = visible.map(issue => `
    <tr data-issue-id="${issue.id}">
      <td><span class="severity-pill ${issue.severity.toLowerCase()}">${issue.severity}</span></td>
      <td><strong>${escapeHtml(issue.category)}</strong><span class="cell-note">${escapeHtml(issue.title)}</span><small>${escapeHtml(issue.detail)}</small></td>
      <td>${escapeHtml(issue.location)}</td>
      <td>${escapeHtml(issue.recommendation)} <button class="table-link" data-view-target="${issue.view}">Open source view</button></td>
      <td><input data-action-field="owner" value="${escapeHtml(issue.action.owner)}" aria-label="Owner for ${escapeHtml(issue.title)}"></td>
      <td><input data-action-field="dueDate" type="date" value="${escapeHtml(issue.action.dueDate)}" aria-label="Due date for ${escapeHtml(issue.title)}"></td>
      <td><select data-action-field="status" aria-label="Status for ${escapeHtml(issue.title)}">${["Open", "In progress", "Resolved", "Accepted exception"].map(status => `<option ${issue.action.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></td>
      <td><input data-action-field="evidenceReference" value="${escapeHtml(issue.action.evidenceReference)}" placeholder="Link, document or decision note" aria-label="Evidence reference for ${escapeHtml(issue.title)}"></td>
    </tr>`).join("") || `<tr><td colspan="8"><div class="empty-state"><strong>No findings match this view.</strong><span>Adjust the filters or review the readiness decision above.</span></div></td></tr>`;
  const form = document.getElementById("submissionSignoffForm");
  if (form) {
    const signoff = state.submissionSignoff || {};
    form.decision.value = signoff.decision || "Not reviewed";
    form.approver.value = signoff.approver || "";
    form.decisionDate.value = signoff.decisionDate || "";
    form.notes.value = signoff.notes || "";
    document.getElementById("submissionSignoffMessage").textContent = signoff.approver ? `${signoff.decision} recorded by ${signoff.approver}${signoff.decisionDate ? ` on ${signoff.decisionDate}` : ""}.` : "No sign-off recorded.";
  }
}

function downloadTextFile(content, type, filename) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

function exportSubmissionActionRegister() {
  const rows = currentSubmissionIssues();
  const columns = ["Priority", "Category", "Finding", "Source", "Detail", "Recommended Action", "Owner", "Due Date", "Status", "Evidence Reference"];
  const body = rows.map(issue => [issue.severity, issue.category, issue.title, issue.location, issue.detail, issue.recommendation, issue.action.owner, issue.action.dueDate, issue.action.status, issue.action.evidenceReference].map(csvEscape).join(","));
  downloadTextFile(`\uFEFF${[columns.map(csvEscape).join(","), ...body].join("\r\n")}`, "text/csv;charset=utf-8", `submission-action-register-${new Date().toISOString().slice(0, 10)}.csv`);
}

function readinessPackHtml() {
  const config = activeClientConfig();
  const issues = currentSubmissionIssues();
  const metrics = submissionMetrics(issues);
  const assessment = dataQualityAssessment(state);
  const signoff = state.submissionSignoff || {};
  const generatedAt = new Date().toLocaleString("en-ZA", { dateStyle: "long", timeStyle: "short" });
  const rows = issues.map(issue => `<tr><td><span class="severity ${issue.severity.toLowerCase()}">${escapeHtml(issue.severity)}</span></td><td><strong>${escapeHtml(issue.category)}</strong><br>${escapeHtml(issue.title)}<small>${escapeHtml(issue.detail)}</small></td><td>${escapeHtml(issue.location)}</td><td>${escapeHtml(issue.action.owner)}</td><td>${escapeHtml(issue.action.dueDate || "Not set")}</td><td>${escapeHtml(issue.action.status)}</td><td>${escapeHtml(issue.action.evidenceReference || "Not referenced")}</td></tr>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(config.clientName)} Submission Readiness Pack</title><style>
    :root{--navy:${config.primaryColor};--blue:${config.secondaryColor};--accent:${config.accentColor}}*{box-sizing:border-box}body{margin:0;color:#173545;background:#eef4f6;font:14px Arial,sans-serif}.page{width:min(1180px,94vw);margin:28px auto;background:#fff;box-shadow:0 14px 42px #16384b1f}.head{padding:34px 42px;color:#fff;background:linear-gradient(135deg,var(--navy),var(--blue))}.head span,.eyebrow{color:var(--accent);font-weight:800;letter-spacing:.12em;text-transform:uppercase;font-size:11px}.head h1{margin:9px 0 4px;font-size:34px}.head p{margin:0;color:#dbeaf0}.content{padding:34px 42px}.decision{display:grid;grid-template-columns:1.2fr repeat(4,1fr);border:1px solid #d9e5e9}.metric{padding:18px;border-right:1px solid #d9e5e9}.metric:last-child{border:0}.metric small{display:block;color:#667e89;text-transform:uppercase;font-size:10px;letter-spacing:.08em}.metric strong{display:block;margin-top:7px;font-size:24px}.gate{color:#fff;background:${metrics.decision === "HOLD" ? "#a02f2f" : metrics.decision === "CONDITIONAL" ? "#8a6500" : "#167347"}}h2{margin:34px 0 10px;color:var(--navy)}.note{color:#607884}table{width:100%;border-collapse:collapse;font-size:11px}th{text-align:left;color:#fff;background:var(--navy);padding:10px}td{vertical-align:top;border:1px solid #d9e5e9;padding:9px}td small{display:block;margin-top:5px;color:#647b86}.severity{display:inline-block;padding:4px 6px;color:#fff;font-size:9px;font-weight:800}.severity.high{background:#a02f2f}.severity.medium{background:#a77600}.severity.low{background:#29705b}.signoff{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:20px;padding:18px;border:1px solid #d9e5e9}.signoff div{min-height:54px;border-bottom:1px solid #aebfc6}.signoff small{display:block;color:#647b86;text-transform:uppercase}.foot{padding:18px 42px;color:#607884;background:#f4f8f9;font-size:11px}@media print{body{background:#fff}.page{width:100%;margin:0;box-shadow:none}.head,.gate,th,.severity{print-color-adjust:exact;-webkit-print-color-adjust:exact}.content{padding:24px}table{font-size:9px}@page{size:A4 landscape;margin:10mm}}</style></head><body><main class="page"><header class="head"><span>Controlled management review</span><h1>${escapeHtml(config.clientName)} Submission Readiness Pack</h1><p>${escapeHtml(config.financialYear)} · Generated ${escapeHtml(generatedAt)} · ${escapeHtml(config.environmentLabel)}</p></header><div class="content"><section class="decision"><div class="metric gate"><small>Submission gate</small><strong>${metrics.decision}</strong><span>${escapeHtml(submissionDecisionCopy(metrics))}</span></div><div class="metric"><small>Readiness score</small><strong>${assessment.score}%</strong></div><div class="metric"><small>Open actions</small><strong>${metrics.open.length}</strong></div><div class="metric"><small>High priority</small><strong>${metrics.high.length}</strong></div><div class="metric"><small>Resolved</small><strong>${metrics.resolved}</strong></div></section><h2>Prioritised action register</h2><p class="note">System-generated checks are decision support. Final submission readiness requires human review, evidence confirmation and approved sign-off.</p><table><thead><tr><th>Priority</th><th>Category / Finding</th><th>Source</th><th>Owner</th><th>Due</th><th>Status</th><th>Evidence / Reference</th></tr></thead><tbody>${rows || `<tr><td colspan="7">No findings generated.</td></tr>`}</tbody></table><h2>Management sign-off</h2><section class="signoff"><div><small>Decision</small><strong>${escapeHtml(signoff.decision || "Not reviewed")}</strong></div><div><small>Approver</small><strong>${escapeHtml(signoff.approver || "Not recorded")}</strong></div><div><small>Decision date</small><strong>${escapeHtml(signoff.decisionDate || "Not recorded")}</strong></div><div><small>Conditions / Notes</small><strong>${escapeHtml(signoff.notes || "None recorded")}</strong></div></section></div><footer class="foot">${escapeHtml(config.privacyNotice)} This pack is generated from browser-local demo state and is not an official SETA, B-BBEE or statutory submission.</footer></main></body></html>`;
}

function downloadReadinessPack() {
  downloadTextFile(readinessPackHtml(), "text/html;charset=utf-8", `submission-readiness-pack-${new Date().toISOString().slice(0, 10)}.html`);
}

function sampleWorkbookRows() {
  return state.employees.slice(0, 24).map((e, i) => {
    const course = state.courses[i % state.courses.length];
    return { "Employee Number": e.employeeNumber, "Employee Name": e.employeeName, "ID Number": e.idNumber, "Region / Cluster": e.regionCluster, "Division": e.division, "Department": e.department, "Sex / Gender": e.sexGender, "Race": e.race, "Age": e.age, "Age Band": e.ageBand, "Disability": e.disability, "Course / Intervention": course.course, "Requested / Suggested": "Yes", "Planned WSP": i < 18 ? "Yes" : "No", "Achieved ATR": i < 12 ? "Yes" : "No", "Provider": course.provider, "Quarter / Date": ["Q1", "Q2", "Q3", "Q4"][i % 4], "Planned Cost": course.estimatedCost, "Actual Cost": i < 12 ? course.estimatedCost : 0, "Evidence Status": i < 12 ? "Evidence ready" : "Pending", "Review Status": i === 11 || i === 21 ? "Confirmation Required" : "Clean" };
  });
}

function stageSampleWorkbook() {
  stagedRows = sampleWorkbookRows();
  workbookMeta = {
    fileName: "SkillSet sample WSP / ATR workbook",
    sheetCount: 1,
    usedRows: stagedRows.length,
    ignoredRows: 0,
    columns: [...requiredColumns]
  };
  workbookStageState = "loaded";
  renderWorkbook();
  document.getElementById("workbookMessage").textContent = `Sample workbook loaded: ${stagedRows.length.toLocaleString("en-ZA")} rows are staged. Review the preview below, then click Apply To Staging.`;
  revealImportPreview();
}

function stageUploadedWorkbook(rows, meta = {}) {
  stagedRows = rows;
  workbookMeta = {
    fileName: meta.fileName || "Uploaded workbook",
    sheetCount: meta.sheetCount || 1,
    usedRows: meta.usedRows ?? rows.length,
    ignoredRows: meta.ignoredRows || 0,
    columns: meta.columns?.length ? meta.columns : Object.keys(rows[0] || {})
  };
  workbookStageState = "loaded";
  renderWorkbook();
  document.getElementById("workbookMessage").textContent = `${workbookMeta.fileName}: ${stagedRows.length.toLocaleString("en-ZA")} usable rows are staged from ${workbookMeta.sheetCount} sheet${workbookMeta.sheetCount === 1 ? "" : "s"}. Review the preview below, then click Apply To Staging.`;
  revealImportPreview();
}

function revealImportPreview() {
  const preview = document.getElementById("importPreviewPanel");
  if (!preview) return;
  preview.scrollIntoView({ behavior: "smooth", block: "start" });
  preview.classList.remove("preview-pulse");
  void preview.offsetWidth;
  preview.classList.add("preview-pulse");
}

function copyText(text, successMessage) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => alert(successMessage)).catch(() => fallbackCopyText(text, successMessage));
    return;
  }
  fallbackCopyText(text, successMessage);
}

function fallbackCopyText(text, successMessage) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
  alert(successMessage);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;
  const input = String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value.trim());
      value = "";
    } else if (char === "\n" && !inQuotes) {
      row.push(value.trim());
      if (row.some(cell => cell !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  row.push(value.trim());
  if (row.some(cell => cell !== "")) rows.push(row);
  const headers = rows.shift() || [];
  return rows.map(values => Object.fromEntries(headers.map((header, index) => [header.trim(), values[index] || ""])));
}

function normaliseImportKey(value) {
  return String(value || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

const importAliases = {
  "Employee Number": ["employee number", "employee no", "emp no", "employee id", "staff number", "learner number", "learner id"],
  "Employee Name": ["employee name", "learner name", "full name", "name"],
  "ID Number": ["id number", "national id", "rsa id", "identity number"],
  "Region / Cluster": ["region cluster", "region", "cluster", "site", "location"],
  "Division": ["division", "business unit", "unit"],
  "Department": ["department", "dept", "team"],
  "Sex / Gender": ["sex gender", "gender", "sex"],
  "Race": ["race", "equity race"],
  "Age": ["age"],
  "Age Band": ["age band", "age group"],
  "Disability": ["disability", "disabled"],
  "Course / Intervention": ["course intervention", "course", "course name", "intervention", "intervention name", "training", "programme", "program"],
  "Requested / Suggested": ["requested suggested", "requested", "suggested", "demand", "training demand", "need"],
  "Planned WSP": ["planned wsp", "wsp", "planned", "plan", "planned training"],
  "Achieved ATR": ["achieved atr", "atr", "achieved", "completed", "complete", "attendance"],
  "Provider": ["provider", "supplier", "training provider", "vendor"],
  "Quarter / Date": ["quarter date", "quarter", "period", "date", "training date", "month"],
  "Planned Cost": ["planned cost", "estimated cost", "budget", "cost"],
  "Actual Cost": ["actual cost", "actual spend", "spend", "invoice amount", "paid"],
  "Evidence Status": ["evidence status", "evidence", "certificate", "attendance register", "proof"],
  "Review Status": ["review status", "status", "comments", "notes"]
};

function getImportedValue(raw, field) {
  const lookup = Object.fromEntries(Object.entries(raw || {}).map(([key, value]) => [normaliseImportKey(key), value]));
  const keys = [field, ...(importAliases[field] || [])].map(normaliseImportKey);
  const found = keys.find(key => lookup[key] !== undefined && lookup[key] !== null && String(lookup[key]).trim() !== "");
  return found ? String(lookup[found]).trim() : "";
}

function importSheetIntent(sheetName) {
  const name = normaliseImportKey(sheetName);
  if (/\b(actual|atr|achievement|completed|complete)\b/.test(name)) return "actual";
  if (/\b(plan|planned|wsp|booking|booked)\b/.test(name)) return "plan";
  if (/\b(request|requested|demand|need|suggested)\b/.test(name)) return "request";
  return "generic";
}

function importYesNo(value, fallback = false) {
  const text = normaliseImportKey(value);
  if (!text) return fallback ? "Yes" : "No";
  if (["yes", "y", "true", "1", "planned", "requested", "suggested", "achieved", "completed", "complete", "booked"].includes(text)) return "Yes";
  if (["no", "n", "false", "0", "not planned", "not achieved", "pending", "cancelled", "canceled"].includes(text)) return "No";
  return fallback ? "Yes" : "No";
}

function normaliseWorkbookImportRow(raw, index, sheetName = "Workbook") {
  const intent = importSheetIntent(sheetName);
  const row = Object.fromEntries(requiredColumns.map(field => [field, getImportedValue(raw, field)]));
  const hasUsableSignal = row["Employee Number"] || row["Employee Name"] || row["Course / Intervention"] || row.Provider;
  if (!hasUsableSignal) return null;
  row["Employee Number"] = row["Employee Number"] || `IMP-${String(index + 1).padStart(4, "0")}`;
  row["Employee Name"] = row["Employee Name"] || `Imported Employee ${String(index + 1).padStart(3, "0")}`;
  row["Region / Cluster"] = row["Region / Cluster"] || "Imported";
  row.Division = row.Division || "Imported";
  row.Department = row.Department || "Imported";
  row["Sex / Gender"] = row["Sex / Gender"] || "Not specified";
  row.Race = row.Race || "Not specified";
  row.Age = row.Age || "";
  row["Age Band"] = row["Age Band"] || "Not specified";
  row.Disability = row.Disability || "Not specified";
  row["Course / Intervention"] = row["Course / Intervention"] || "Imported training intervention";
  row.Provider = row.Provider || "Imported provider";
  row["Quarter / Date"] = row["Quarter / Date"] || "Imported period";
  row["Requested / Suggested"] = importYesNo(row["Requested / Suggested"], intent === "request" || intent === "plan" || intent === "actual" || intent === "generic");
  row["Planned WSP"] = importYesNo(row["Planned WSP"], intent === "plan" || intent === "actual");
  row["Achieved ATR"] = importYesNo(row["Achieved ATR"], intent === "actual");
  row["Planned Cost"] = String(row["Planned Cost"] || row["Actual Cost"] || "0").replace(/[^\d.-]/g, "");
  row["Actual Cost"] = String(row["Actual Cost"] || (row["Achieved ATR"] === "Yes" ? row["Planned Cost"] : "0")).replace(/[^\d.-]/g, "");
  row["Evidence Status"] = row["Evidence Status"] || (row["Achieved ATR"] === "Yes" ? "Evidence to confirm" : "Pending");
  row["Review Status"] = row["Review Status"] || "Imported for review";
  return row;
}

function normaliseWorkbookRows(rawRows, sourceName, sheetName = "Workbook") {
  let ignoredRows = 0;
  const rows = rawRows.map((raw, index) => {
    const mapped = normaliseWorkbookImportRow(raw, index, sheetName);
    if (!mapped) ignoredRows += 1;
    return mapped;
  }).filter(Boolean);
  return {
    rows,
    meta: {
      fileName: sourceName,
      sheetCount: 1,
      usedRows: rows.length,
      ignoredRows,
      columns: [...new Set(rows.flatMap(row => Object.keys(row)))]
    }
  };
}

function parseExcelWorkbook(buffer, fileName) {
  if (!window.XLSX) throw new Error("The Excel parser has not finished loading. Please wait a moment and try again.");
  const workbook = window.XLSX.read(buffer, { type: "array", cellDates: true });
  let ignoredRows = 0;
  const rows = [];
  const columns = new Set();
  workbook.SheetNames.forEach(sheetName => {
    const sheetRows = window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "", raw: false });
    sheetRows.forEach((raw, index) => {
      Object.keys(raw).forEach(col => columns.add(col));
      const mapped = normaliseWorkbookImportRow(raw, rows.length + index, sheetName);
      if (mapped) rows.push(mapped);
      else ignoredRows += 1;
    });
  });
  return {
    rows,
    meta: {
      fileName,
      sheetCount: workbook.SheetNames.length,
      usedRows: rows.length,
      ignoredRows,
      columns: columns.size ? [...columns] : [...requiredColumns]
    }
  };
}

async function stageWorkbookFile(file) {
  const message = document.getElementById("workbookMessage");
  if (!file) return;
  try {
    message.textContent = `Reading ${file.name} locally in your browser...`;
    const lower = file.name.toLowerCase();
    const result = lower.endsWith(".csv")
      ? normaliseWorkbookRows(parseCsv(await file.text()), file.name)
      : parseExcelWorkbook(await file.arrayBuffer(), file.name);
    if (!result.rows.length) {
      message.textContent = `${file.name} was read, but no usable employee, course or provider rows could be mapped. Try a workbook with headings such as Employee Name, Course, Provider, Planned WSP or Achieved ATR.`;
      return;
    }
    stageUploadedWorkbook(result.rows, result.meta);
  } catch (error) {
    message.textContent = `Could not read the workbook: ${error.message}`;
  }
}

function upsertImportedMasterData(rows) {
  const existingEmployees = new Set(state.employees.map(e => e.employeeNumber));
  const existingProviders = new Set(state.providers.map(p => normaliseImportKey(p.provider)));
  const existingCourses = new Set(state.courses.map(c => `${normaliseImportKey(c.provider)}|${normaliseImportKey(c.course)}`));
  rows.forEach(row => {
    if (!existingEmployees.has(row["Employee Number"])) {
      state.employees.push({
        employeeNumber: row["Employee Number"],
        employeeName: row["Employee Name"],
        idNumber: row["ID Number"],
        regionCluster: row["Region / Cluster"],
        division: row.Division,
        department: row.Department,
        sexGender: row["Sex / Gender"],
        race: row.Race,
        age: Number(row.Age || 0) || "",
        ageBand: row["Age Band"],
        disability: row.Disability
      });
      existingEmployees.add(row["Employee Number"]);
    }
    const providerKey = normaliseImportKey(row.Provider);
    if (providerKey && !existingProviders.has(providerKey)) {
      state.providers.push({ id: `import-provider-${state.providers.length + 1}`, provider: row.Provider, focus: "Imported" });
      existingProviders.add(providerKey);
    }
    const courseKey = `${providerKey}|${normaliseImportKey(row["Course / Intervention"])}`;
    if (providerKey && !existingCourses.has(courseKey)) {
      state.courses.push({
        id: `import-course-${state.courses.length + 1}`,
        provider: row.Provider,
        course: row["Course / Intervention"],
        category: "Imported",
        duration: "To confirm",
        deliveryMode: "To confirm",
        estimatedCost: Number(row["Planned Cost"] || 0),
        evidenceRequired: "Evidence to confirm",
        setaBbbeeRelevance: "WSP / ATR"
      });
      existingCourses.add(courseKey);
    }
  });
}

function applyWorkbookRows() {
  if (!stagedRows.length || workbookStageState === "applied") return;
  const rows = stagedRows.length ? stagedRows : sampleWorkbookRows();
  upsertImportedMasterData(rows);
  state.requests = [];
  state.plans = [];
  state.actuals = [];
  state.bookings = [];
  rows.forEach((row, i) => {
    const base = { id: `import-${Date.now()}-${i}`, employeeNumber: row["Employee Number"], provider: row.Provider, course: row["Course / Intervention"], period: row["Quarter / Date"], cost: Number(row["Planned Cost"] || 0), status: row["Review Status"] };
    if (row["Requested / Suggested"] === "Yes") state.requests.push({ ...base, id: `${base.id}-req` });
    if (row["Planned WSP"] === "Yes") state.plans.push({ ...base, id: `${base.id}-plan` });
    if (row["Achieved ATR"] === "Yes") state.actuals.push({ ...base, id: `${base.id}-act`, cost: Number(row["Actual Cost"] || 0), evidenceStatus: row["Evidence Status"] });
  });
  workbookStageState = "applied";
  saveState();
  renderAll();
  setView("overview");
  document.getElementById("workbookMessage").textContent = "Workbook rows applied to staging. The Overview dashboard now reflects the loaded workbook.";
}

function renderAll() {
  state.reportRows = buildRequestedPlannedAchievedReport(state);
  renderOverview();
  renderWorkbook();
  renderTraining();
  renderPeople();
  renderSubmission();
  renderReports();
}

document.querySelectorAll("[data-view]").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));
document.addEventListener("click", event => {
  const target = event.target.closest("[data-view-target]");
  if (target) {
    if (target.dataset.submissionFilter) {
      submissionFilterState.category = target.dataset.submissionFilter;
      submissionFilterState.status = "Open actions";
      renderSubmission();
    }
    setView(target.dataset.viewTarget);
    if (target.dataset.mode) document.getElementById("trainingForm").recordType.value = target.dataset.mode;
    if (target.dataset.bookingFocus) document.getElementById("bookingForm").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const courseButton = event.target.closest("[data-use-course]");
  if (courseButton) {
    const course = state.courses.find(c => c.id === courseButton.dataset.useCourse);
    if (!course) return;
    const form = document.getElementById("trainingForm");
    form.provider.value = course.provider;
    form.course.value = course.course;
    form.recordType.value = "plan";
    if (course.deliveryMode) form.deliveryMode.value = course.deliveryMode;
    if (course.evidenceRequired) form.evidenceRequired.value = course.evidenceRequired;
    form.deliveryMode.dataset.touched = "true";
    form.evidenceRequired.dataset.touched = "true";
    updateTrainingBookingDefaults();
    renderBookingForm();
    renderBookingRows();
    renderTrainingRows();
    setView("training");
  }
  const bookPlanButton = event.target.closest("[data-book-plan]");
  if (bookPlanButton) {
    const plan = state.plans.find(item => item.id === bookPlanButton.dataset.bookPlan);
    if (plan) {
      selectedEmployeeNumber = plan.employeeNumber;
      const trainingForm = document.getElementById("trainingForm");
      trainingForm.employeeNumber.value = selectedEmployeeNumber;
      trainingForm.provider.value = plan.provider;
      trainingForm.course.value = plan.course;
      updateInheritedFields();
      renderBookingForm();
      const bookingForm = document.getElementById("bookingForm");
      bookingForm.planId.value = plan.id;
      updateBookingFields();
      renderBookingRows();
      renderTrainingRows();
      document.getElementById("bookingForm").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  const completeButton = event.target.closest("[data-booking-complete]");
  if (completeButton) {
    const booking = state.bookings.find(item => item.id === completeButton.dataset.bookingComplete);
    if (booking) booking.bookingStatus = "Completed";
    saveState();
    renderAll();
  }
  const missedButton = event.target.closest("[data-booking-missed]");
  if (missedButton) {
    const booking = state.bookings.find(item => item.id === missedButton.dataset.bookingMissed);
    if (booking) booking.bookingStatus = "Missed / Needs Justification";
    saveState();
    renderAll();
  }
  const atrButton = event.target.closest("[data-booking-atr]");
  if (atrButton) {
    const booking = state.bookings.find(item => item.id === atrButton.dataset.bookingAtr);
    if (booking) {
      const form = document.getElementById("trainingForm");
      form.recordType.value = "actual";
      if (booking.employeeNumber) form.employeeNumber.value = booking.employeeNumber;
      form.provider.value = booking.provider;
      form.course.value = booking.course;
      form.period.value = booking.preferredWindow || quarterFromPeriod(booking.date) || "Date to be confirmed";
      form.trainingDate.value = booking.date || "";
      form.bookingStatus.value = "Completed";
      form.evidenceRequired.value = booking.evidenceRequired || "Certificate";
      updateInheritedFields();
      setView("training");
    }
  }
  const person = event.target.closest("[data-person]");
  if (person) { selectedEmployeeNumber = person.dataset.person; renderPeople(); }
});
document.getElementById("trainingForm").addEventListener("change", event => {
  if (event.target.name === "employeeNumber") {
    updateInheritedFields();
    renderBookingForm();
    renderBookingRows();
    renderTrainingRows();
    renderCourseResults();
  }
  if (["provider","course"].includes(event.target.name)) updateBookingFields();
  if (["preferredWindow","bookingStatus","evidenceRequired"].includes(event.target.name)) event.target.dataset.touched = "true";
  if (event.target.name === "recordType") updateTrainingBookingDefaults();
});
document.getElementById("bookingForm").addEventListener("change", event => {
  if (["preferredWindow","bookingStatus","deliveryMode","evidenceRequired"].includes(event.target.name)) event.target.dataset.touched = "true";
  if (event.target.name === "planId") updateBookingFields();
  if (event.target.name === "employeeNumber") {
    selectedEmployeeNumber = event.target.value;
    document.getElementById("trainingForm").employeeNumber.value = selectedEmployeeNumber;
    updateInheritedFields();
    renderBookingForm();
    renderBookingRows();
    renderTrainingRows();
    renderCourseResults();
  }
});
document.getElementById("trainingForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const chosenPeriod = data.period || data.trainingDate || data.preferredWindow || "Date to be confirmed";
  const recordPeriod = data.recordType === "actual" && data.trainingDate ? data.trainingDate : chosenPeriod;
  const record = {
    id: crypto.randomUUID(),
    employeeNumber: data.employeeNumber,
    provider: data.provider,
    course: data.course,
    period: recordPeriod,
    cost: Number(data.cost || 0),
    hours: Number(data.hours || 0),
    status: "Clean",
    evidenceStatus: data.evidenceRequired || "Evidence ready",
    preferredWindow: data.preferredWindow,
    bookingStatus: data.bookingStatus,
    deliveryMode: data.deliveryMode,
    evidenceRequired: data.evidenceRequired,
    trainingDate: data.trainingDate,
    startTime: data.startTime,
    endTime: data.endTime,
    venueLink: data.venueLink,
    reminderStatus: data.reminderStatus,
    bookingNotes: data.bookingNotes,
    createdAt: Date.now()
  };
  if (data.recordType === "request") state.requests.push(record);
  if (data.recordType === "plan") state.plans.push(record);
  if (data.recordType === "actual") state.actuals.push(record);
  const hasBookingDetails = data.bookingStatus !== "Not booked" || data.trainingDate || data.venueLink || data.bookingNotes || data.preferredWindow !== "Date to be confirmed";
  if (hasBookingDetails) {
    const booking = {
      id: crypto.randomUUID(),
      planId: data.recordType === "plan" ? record.id : "",
      employeeNumber: data.employeeNumber,
      groupName: "",
      provider: data.provider,
      course: data.course,
      period: data.trainingDate || chosenPeriod,
      preferredWindow: data.preferredWindow,
      date: data.trainingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      deliveryMode: data.deliveryMode,
      location: data.venueLink,
      venueLink: data.venueLink,
      reminderStatus: data.reminderStatus,
      evidenceRequired: data.evidenceRequired,
      bookingNotes: data.bookingNotes,
      bookingStatus: data.bookingStatus,
      status: data.bookingStatus,
      createdAt: Date.now()
    };
    state.bookings.push(normalizeBookingRecord(booking));
  }
  saveState();
  const message = data.recordType === "request"
    ? "Requested training saved. Booking details can be added once the item is planned."
    : data.recordType === "plan"
      ? "Planned WSP intervention saved with booking details."
      : "ATR activity saved with completion and evidence details.";
  document.getElementById("bookingMessage").textContent = message;
  renderAll();
});
document.getElementById("bookingForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  let plan = state.plans.find(item => item.id === data.planId) || {};
  if (!plan.id) {
    plan = {
      id: crypto.randomUUID(),
      employeeNumber: data.employeeNumber,
      provider: data.provider,
      course: data.course,
      period: data.date || data.preferredWindow || "Date to be confirmed",
      cost: Number(courseFor(data.provider, data.course, state.courses).estimatedCost || 0),
      hours: 8,
      status: "Booked",
      preferredWindow: data.preferredWindow,
      bookingStatus: data.bookingStatus,
      deliveryMode: data.deliveryMode,
      evidenceRequired: data.evidenceRequired,
      createdAt: Date.now()
    };
    state.plans.push(plan);
  }
  const booking = {
    id: crypto.randomUUID(),
    planId: plan.id,
    employeeNumber: data.employeeNumber,
    groupName: "",
    provider: data.provider,
    course: data.course,
    period: data.date,
    preferredWindow: data.preferredWindow,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    deliveryMode: data.deliveryMode,
    location: data.location,
    reminderStatus: data.reminderStatus,
    evidenceRequired: data.evidenceRequired,
    bookingNotes: data.bookingNotes,
    bookingStatus: data.bookingStatus,
    status: data.bookingStatus,
    createdAt: Date.now()
  };
  state.bookings.push(normalizeBookingRecord(booking));
  if (plan.id) plan.status = "Booked";
  saveState();
  selectedEmployeeNumber = data.employeeNumber;
  document.getElementById("bookingMessage").textContent = `Booking saved for ${friendly(employee(data.employeeNumber).employeeName, "selected employee")}.`;
  renderAll();
});
["providerSearch","providerFilter","courseSearch","categoryFilter"].forEach(id => {
  document.getElementById(id).addEventListener("input", renderCourseResults);
  document.getElementById(id).addEventListener("change", renderCourseResults);
});
document.getElementById("overviewQuarterFilter").addEventListener("change", event => {
  overviewFilterState.quarter = event.target.value === "All quarters" ? "All" : event.target.value;
  renderOverview();
});
document.getElementById("overviewProviderFilter").addEventListener("change", event => {
  overviewFilterState.provider = event.target.value === "All providers" ? "All" : event.target.value;
  renderOverview();
});
document.getElementById("peopleSearch").addEventListener("input", renderPeople);
document.getElementById("loadSampleWorkbook").addEventListener("click", stageSampleWorkbook);
document.getElementById("overviewLoadSample").addEventListener("click", stageSampleWorkbook);
document.getElementById("csvUpload").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (file) await stageWorkbookFile(file);
  event.target.value = "";
});
document.getElementById("applyStaging").addEventListener("click", applyWorkbookRows);
document.getElementById("applyStagingPreview").addEventListener("click", applyWorkbookRows);
document.getElementById("resetDemoTop").addEventListener("click", resetDemo);
document.getElementById("resetDemoOverview").addEventListener("click", resetDemo);
document.getElementById("resetReportFilters").addEventListener("click", () => {
  resetReportFiltersState();
  renderReports();
});
document.getElementById("copyExecutiveSummaryOverview").addEventListener("click", copyExecutiveSummary);
document.getElementById("copyExecutiveSummaryReports").addEventListener("click", copyExecutiveSummary);
document.getElementById("copyFilteredReport").addEventListener("click", copyFilteredReport);
document.getElementById("exportFilteredReport").addEventListener("click", exportFilteredReport);
document.getElementById("submissionCategoryFilter").addEventListener("change", event => {
  submissionFilterState.category = event.target.value;
  renderSubmission();
});
document.getElementById("submissionSeverityFilter").addEventListener("change", event => {
  submissionFilterState.severity = event.target.value;
  renderSubmission();
});
document.getElementById("submissionStatusFilter").addEventListener("change", event => {
  submissionFilterState.status = event.target.value;
  renderSubmission();
});
document.getElementById("submissionIssueRows").addEventListener("change", event => {
  const row = event.target.closest("[data-issue-id]");
  const field = event.target.dataset.actionField;
  if (!row || !field) return;
  const existing = state.reviewActions[row.dataset.issueId] || {};
  state.reviewActions[row.dataset.issueId] = { ...existing, [field]: event.target.value };
  saveState();
  renderOverview();
  renderSubmission();
});
document.getElementById("submissionSignoffForm").addEventListener("submit", event => {
  event.preventDefault();
  state.submissionSignoff = Object.fromEntries(new FormData(event.currentTarget));
  saveState();
  renderSubmission();
});
document.getElementById("exportActionRegister").addEventListener("click", exportSubmissionActionRegister);
document.getElementById("downloadReadinessPack").addEventListener("click", downloadReadinessPack);
document.getElementById("downloadReadinessPackOverview").addEventListener("click", downloadReadinessPack);

applyClientBranding();
renderAll();
