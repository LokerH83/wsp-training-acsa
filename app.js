const STORAGE_KEY = "acsa-sdf-demo-state-v3";
const DEMO_DATA = window.ACSA_DEMO_DATA || { employees: [], providers: [], courses: [], requests: [], plans: [], actuals: [], bookings: [] };
let state = loadState();
let stagedRows = [];
let selectedEmployeeNumber = state.employees[0]?.employeeNumber || "";
let reportFilterState = {};
let overviewFilterState = { quarter: "All", provider: "All" };

const currency = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });
const requiredColumns = ["Employee Number","Employee Name","ID Number","Region / Cluster","Division","Department","Sex / Gender","Race","Age","Age Band","Disability","Course / Intervention","Requested / Suggested","Planned WSP","Achieved ATR","Provider","Quarter / Date","Planned Cost","Actual Cost","Evidence Status","Review Status"];
const filterDefs = [
  ["regionCluster", "Region / Cluster"], ["division", "Division"], ["department", "Department"], ["provider", "Provider"],
  ["course", "Course / Intervention"], ["sexGender", "Sex / Gender"], ["race", "Race"], ["ageBand", "Age Band"],
  ["disability", "Disability"], ["status", "Status"], ["bookingStatus", "Booking Status"]
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
    bookings: data.bookings || [],
    reportRows: []
  };
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

function recordKey(row) {
  return [row.employeeNumber, row.course, row.provider, String(row.period || "").slice(0, 7)].join("|").toLowerCase();
}

function reviewItems(row) {
  const reviewStatuses = ["Confirmation Required", "Reconciliation Opportunity", "Attendance To Confirm"];
  return ["regionCluster","division","department","sexGender","race","ageBand","disability"].filter(field => String(row[field] || "").includes("Confirmation Required")).length + (reviewStatuses.includes(row.reviewStatus || row.status) ? 1 : 0);
}

function buildRequestedPlannedAchievedReport(source) {
  const planKeys = new Set(source.plans.map(recordKey));
  const actualKeys = new Set(source.actuals.map(recordKey));
  const people = new Map(source.employees.map(person => [person.employeeNumber, person]));
  const bookingStatuses = new Map((source.bookings || []).map(booking => [recordKey(booking), booking.bookingStatus]));
  const planBookingStatuses = new Map((source.bookings || []).filter(booking => booking.planId).map(booking => [booking.planId, booking.bookingStatus]));
  const groups = new Map();
  const add = (record, type) => {
    const person = people.get(record.employeeNumber) || {};
    const row = { ...person, ...record };
    const key = [row.regionCluster, row.division, row.department, row.provider, row.course, row.sexGender, row.race, row.ageBand, row.disability].join("|");
    const current = groups.get(key) || {
      regionCluster: row.regionCluster, division: row.division, department: row.department, provider: row.provider, course: row.course,
      sexGender: row.sexGender, race: row.race, ageBand: row.ageBand, disability: row.disability,
      requested: 0, planned: 0, achieved: 0, requestedNotPlanned: 0, plannedNotAchieved: 0, achievedNotPlanned: 0, reviewItems: 0, bookingStatus: ""
    };
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
    booked: bookings.filter(b => b.bookingStatus === "Booked").length,
    upcoming: bookings.filter(b => ["Draft","Booked"].includes(b.bookingStatus) && b.date >= today).length,
    completed: bookings.filter(b => b.bookingStatus === "Completed").length,
    missed: bookings.filter(b => b.bookingStatus === "Attendance To Confirm").length
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

function outcomeHtml(s, employeeCount = state.employees.length) {
  return [
    ["Training Demand", s.requested, "Requested / Suggested training records from the workbook."],
    ["WSP Planned", s.planned, "Interventions visible for planning and booking."],
    ["ATR Achieved", s.achieved, "Completed activity ready for achievement reporting."],
    ["Employees In Scope", employeeCount, "Synthetic active profiles linked to demo training data."]
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
    ["B-BBEE skills review status", s.reviewItems || s.plannedNotAchieved ? "Monitor" : "Low"]
  ].map(([label, value]) => `<article class="kpi"><span>${label}</span><strong>${value}</strong><small>demo planning estimate</small></article>`).join("");
  document.getElementById("bookingKpis").innerHTML = [
    ["Booked Training", b.booked], ["Upcoming Sessions", b.upcoming], ["Completed Bookings", b.completed], ["Attendance To Confirm", b.missed]
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
  document.getElementById("detectedColumns").innerHTML = (stagedRows[0] ? Object.keys(stagedRows[0]) : requiredColumns).map(col => `<div><span>${col}</span><strong>${requiredColumns.includes(col) ? "Mapped" : "Extra"}</strong></div>`).join("");
  document.getElementById("fieldChecklist").innerHTML = requiredColumns.map(col => `<div class="check-row complete"><span>OK</span><div><strong>${col}</strong><small>demo mapping ready</small></div></div>`).join("");
  document.getElementById("importImpact").innerHTML = `<div class="issue good"><strong>Rows staged</strong><span>${stagedRows.length || "Sample workbook ready"} rows available for demo staging.</span></div><div class="issue good"><strong>Production note</strong><span>Production version would validate and write approved rows through the secured API and Dataverse layer.</span></div>`;
  document.getElementById("importPreview").innerHTML = (stagedRows.length ? stagedRows : sampleWorkbookRows()).slice(0, 8).map(row => `<tr><td>${row["Employee Name"]}</td><td>${row["Course / Intervention"]}</td><td>${row["Requested / Suggested"]}</td><td>${row["Planned WSP"]}</td><td>${row["Achieved ATR"]}</td><td>${row["Review Status"]}</td></tr>`).join("");
}

function renderTraining() {
  const form = document.getElementById("trainingForm");
  form.employeeNumber.innerHTML = state.employees.map(e => `<option value="${e.employeeNumber}">${e.employeeName} (${e.employeeNumber})</option>`).join("");
  if (selectedEmployeeNumber) form.employeeNumber.value = selectedEmployeeNumber;
  form.provider.innerHTML = state.providers.map(p => `<option>${p.provider}</option>`).join("");
  form.course.innerHTML = state.courses.map(c => `<option>${c.course}</option>`).join("");
  updateInheritedFields();
  hydrateProviderFilters();
  renderCourseResults();
  renderBookingForm();
  renderBookingRows();
  document.getElementById("trainingRows").innerHTML = [...state.requests.map(r => ["Request", r]), ...state.plans.map(r => ["Plan", r]), ...state.actuals.map(r => ["ATR", r])].slice(-12).reverse().map(([type,row]) => `<tr><td>${type}</td><td>${employee(row.employeeNumber).employeeName}</td><td>${row.course}</td><td>${row.provider}</td><td>${row.period}</td><td>${row.status || row.evidenceStatus || "Clean"}</td></tr>`).join("");
}

function renderBookingForm() {
  const form = document.getElementById("bookingForm");
  const selectedPlanId = form.planId.value || state.plans[0]?.id || "";
  form.planId.innerHTML = state.plans.map(plan => `<option value="${plan.id}">${employee(plan.employeeNumber).employeeName || "Demo cohort"} - ${plan.course} (${plan.status || "Clean"})</option>`).join("");
  form.employeeNumber.innerHTML = `<option value="COHORT:Airport Operations Supervisors">Airport Operations Supervisors cohort</option>${state.employees.map(e => `<option value="${e.employeeNumber}">${e.employeeName} (${e.employeeNumber})</option>`).join("")}`;
  if (selectedPlanId) form.planId.value = selectedPlanId;
  updateBookingFields();
}

function updateBookingFields() {
  const form = document.getElementById("bookingForm");
  const plan = state.plans.find(item => item.id === form.planId.value) || state.plans[0] || {};
  form.provider.value = plan.provider || "";
  form.course.value = plan.course || "";
  if (plan.employeeNumber && (!form.employeeNumber.value || form.employeeNumber.value.startsWith("COHORT:"))) form.employeeNumber.value = plan.employeeNumber;
  if (!form.date.value) form.date.value = "2026-08-18";
  if (!form.location.value) form.location.value = plan.provider?.includes("Digital") ? "Online meeting link" : "Demo Training Room 1";
}

function renderBookingRows() {
  document.getElementById("bookingRows").innerHTML = (state.bookings || []).map(booking => {
    const person = employee(booking.employeeNumber);
    const name = booking.groupName || person.employeeName || "Demo cohort";
    const atr = state.actuals.some(row => row.employeeNumber === booking.employeeNumber && row.provider === booking.provider && row.course === booking.course) ? "ATR captured" : "Pending ATR";
    return `<tr><td>${booking.bookingStatus}</td><td>${name}</td><td>${booking.provider}</td><td>${booking.course}</td><td>${booking.date}</td><td>${booking.startTime} - ${booking.endTime}</td><td>${booking.deliveryMode}</td><td>${booking.location}</td><td>${booking.reminderStatus}</td><td>${atr}</td><td><button class="table-action" data-booking-complete="${booking.id}">Mark Completed</button> <button class="table-action" data-booking-atr="${booking.id}">Record ATR</button> <button class="table-action" data-booking-missed="${booking.id}">Mark Missed</button></td></tr>`;
  }).join("");
}

function updateInheritedFields() {
  const form = document.getElementById("trainingForm");
  const person = employee(form.employeeNumber.value);
  selectedEmployeeNumber = form.employeeNumber.value;
  document.getElementById("inheritedFields").textContent = `${person.regionCluster} | ${person.division} | ${person.department} | ${person.sexGender} | ${person.race} | ${person.age} | ${person.ageBand} | ${person.disability}`;
}

function hydrateProviderFilters() {
  const providerFilter = document.getElementById("providerFilter");
  providerFilter.innerHTML = `<option value="All">All providers</option>${state.providers.map(p => `<option>${p.provider}</option>`).join("")}`;
  const categories = Array.from(new Set(state.courses.map(c => c.category))).sort();
  document.getElementById("categoryFilter").innerHTML = `<option value="All">All categories</option>${categories.map(c => `<option>${c}</option>`).join("")}`;
}

function renderCourseResults() {
  const providerText = document.getElementById("providerSearch").value.toLowerCase();
  const courseText = document.getElementById("courseSearch").value.toLowerCase();
  const provider = document.getElementById("providerFilter").value;
  const category = document.getElementById("categoryFilter").value;
  const rows = state.courses.filter(c => (provider === "All" || c.provider === provider) && (category === "All" || c.category === category) && c.provider.toLowerCase().includes(providerText) && c.course.toLowerCase().includes(courseText));
  document.getElementById("courseResults").innerHTML = rows.map(c => `<tr><td>${c.provider}</td><td>${c.course}</td><td>${c.category}</td><td>${c.duration}</td><td>${c.deliveryMode}</td><td>${currency.format(c.estimatedCost)}</td><td>${c.evidenceRequired}</td><td>${c.setaBbbeeRelevance}</td><td><button data-use-course="${c.id}">Use In Training Plan</button></td></tr>`).join("");
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
  document.getElementById("personProfile").innerHTML = `<h2>${p.employeeName}</h2><p>${p.department} - ${p.regionCluster}</p><dl class="info-list"><div><dt>Employee Number</dt><dd>${mask(p.employeeNumber)}</dd></div><div><dt>ID Number</dt><dd>${mask(p.idNumber)}</dd></div><div><dt>Region / Cluster</dt><dd>${p.regionCluster}</dd></div><div><dt>Division</dt><dd>${p.division}</dd></div><div><dt>Department</dt><dd>${p.department}</dd></div><div><dt>Sex / Gender</dt><dd>${p.sexGender}</dd></div><div><dt>Race</dt><dd>${p.race}</dd></div><div><dt>Age</dt><dd>${p.age}</dd></div><div><dt>Age Band</dt><dd>${p.ageBand}</dd></div><div><dt>Disability</dt><dd>${p.disability}</dd></div></dl><div class="profile-note">Requested: ${req.length} | Planned: ${plans.length} | Bookings: ${bookings.length} | Achieved: ${actuals.length}</div><div class="table-wrap"><table><thead><tr><th>Type</th><th>Course</th><th>Provider</th><th>Evidence / Review Status</th></tr></thead><tbody>${[...req.map(r=>["Requested / Suggested",r]),...plans.map(r=>["Planned WSP",r]),...actuals.map(r=>["Achieved ATR",r])].map(([type,row])=>`<tr><td>${type}</td><td>${row.course}</td><td>${row.provider}</td><td>${row.evidenceStatus || row.status || "Clean"}</td></tr>`).join("")}</tbody></table></div><section class="profile-card"><div class="compact-head"><h3>Training Bookings</h3></div><div class="table-wrap"><table><thead><tr><th>Course</th><th>Provider</th><th>Date</th><th>Status</th><th>Reminder Status</th></tr></thead><tbody>${bookings.map(row => `<tr><td>${row.course}</td><td>${row.provider}</td><td>${row.date}</td><td>${row.bookingStatus}</td><td>${row.reminderStatus}</td></tr>`).join("") || `<tr><td colspan="5">No bookings for this demo profile.</td></tr>`}</tbody></table></div></section>`;
}

function renderReports() {
  state.reportRows = buildRequestedPlannedAchievedReport(state);
  const filters = currentFilters();
  hydrateReportFilters();
  const rows = state.reportRows.filter(row => Object.entries(filters).every(([field,value]) => value === "All" || String(row[field] || "").split(", ").includes(value)));
  document.getElementById("reportKpis").innerHTML = kpiHtml(summary(rows));
  document.getElementById("reportRows").innerHTML = rows.map(row => `<tr><td>${row.regionCluster}</td><td>${row.division}</td><td>${row.department}</td><td>${row.provider}</td><td>${row.course}</td><td>${row.sexGender}</td><td>${row.race}</td><td>${row.ageBand}</td><td>${row.disability}</td><td>${row.requested}</td><td>${row.planned}</td><td>${row.achieved}</td><td>${row.requestedNotPlanned}</td><td>${row.plannedNotAchieved}</td><td>${row.achievedNotPlanned}</td><td>${row.completion}%</td><td>${row.reviewItems}</td><td>${row.status}</td><td>${row.bookingStatus || "No booking"}</td></tr>`).join("") || `<tr><td colspan="19">No records match the selected filters.</td></tr>`;
}

function currentFilters() {
  return Object.fromEntries(filterDefs.map(([field]) => [field, reportFilterState[field] || "All"]));
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
  const s = summary();
  return `Demo summary: the dashboard shows ${s.requested} requested training records, ${s.planned} planned WSP records, ${s.achieved} achieved ATR records, ${s.reportingGaps} reporting gaps and ${s.reviewItems} records needing review. The recommended next step is to confirm the Excel data structure and prove the Power BI reporting layer before investing in the full workflow app.`;
}

function copyExecutiveSummary() {
  navigator.clipboard?.writeText(executiveSummaryText());
  alert("Executive summary copied.");
}

function sampleWorkbookRows() {
  return state.employees.slice(0, 12).map((e, i) => ({ "Employee Number": e.employeeNumber, "Employee Name": e.employeeName, "ID Number": e.idNumber, "Region / Cluster": e.regionCluster, "Division": e.division, "Department": e.department, "Sex / Gender": e.sexGender, "Race": e.race, "Age": e.age, "Age Band": e.ageBand, "Disability": e.disability, "Course / Intervention": state.courses[i].course, "Requested / Suggested": "Yes", "Planned WSP": i < 9 ? "Yes" : "No", "Achieved ATR": i < 6 ? "Yes" : "No", "Provider": state.courses[i].provider, "Quarter / Date": "Q3", "Planned Cost": state.courses[i].estimatedCost, "Actual Cost": i < 6 ? state.courses[i].estimatedCost : 0, "Evidence Status": i < 6 ? "Evidence ready" : "Pending", "Review Status": i === 11 ? "Confirmation Required" : "Clean" }));
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",").map(h => h.trim());
  return lines.map(line => Object.fromEntries(line.split(",").map((value, i) => [headers[i], value.trim()])));
}

function applyWorkbookRows() {
  const rows = stagedRows.length ? stagedRows : sampleWorkbookRows();
  rows.forEach((row, i) => {
    const base = { id: `import-${Date.now()}-${i}`, employeeNumber: row["Employee Number"], provider: row.Provider, course: row["Course / Intervention"], period: row["Quarter / Date"], cost: Number(row["Planned Cost"] || 0), status: row["Review Status"] };
    if (row["Requested / Suggested"] === "Yes") state.requests.push({ ...base, id: `${base.id}-req` });
    if (row["Planned WSP"] === "Yes") state.plans.push({ ...base, id: `${base.id}-plan` });
    if (row["Achieved ATR"] === "Yes") state.actuals.push({ ...base, id: `${base.id}-act`, cost: Number(row["Actual Cost"] || 0), evidenceStatus: row["Evidence Status"] });
  });
  saveState();
  document.getElementById("workbookMessage").textContent = "Workbook staged into the demo view. A production implementation would validate and write approved rows through a secured implementation layer.";
  renderAll();
}

function renderAll() {
  state.reportRows = buildRequestedPlannedAchievedReport(state);
  renderOverview();
  renderWorkbook();
  renderTraining();
  renderPeople();
  renderReports();
}

document.querySelectorAll("[data-view]").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));
document.addEventListener("click", event => {
  const target = event.target.closest("[data-view-target]");
  if (target) {
    setView(target.dataset.viewTarget);
    if (target.dataset.mode) document.getElementById("trainingForm").recordType.value = target.dataset.mode;
    if (target.dataset.bookingFocus) document.getElementById("bookingForm").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const courseButton = event.target.closest("[data-use-course]");
  if (courseButton) {
    const course = state.courses.find(c => c.id === courseButton.dataset.useCourse);
    document.getElementById("trainingForm").provider.value = course.provider;
    document.getElementById("trainingForm").course.value = course.course;
    document.getElementById("trainingForm").recordType.value = "plan";
    setView("training");
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
    if (booking) booking.bookingStatus = "Attendance To Confirm";
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
      form.period.value = booking.date;
      updateInheritedFields();
      setView("training");
    }
  }
  const person = event.target.closest("[data-person]");
  if (person) { selectedEmployeeNumber = person.dataset.person; renderPeople(); }
});
document.getElementById("trainingForm").addEventListener("change", event => { if (event.target.name === "employeeNumber") updateInheritedFields(); });
document.getElementById("bookingForm").addEventListener("change", event => {
  if (event.target.name === "planId") updateBookingFields();
});
document.getElementById("trainingForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const record = { id: crypto.randomUUID(), employeeNumber: data.employeeNumber, provider: data.provider, course: data.course, period: data.period, cost: Number(data.cost || 0), hours: Number(data.hours || 0), status: "Clean", evidenceStatus: "Evidence ready" };
  if (data.recordType === "request") state.requests.push(record);
  if (data.recordType === "plan") state.plans.push(record);
  if (data.recordType === "actual") state.actuals.push(record);
  saveState();
  renderAll();
});
document.getElementById("bookingForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const plan = state.plans.find(item => item.id === data.planId) || {};
  const isGroup = data.employeeNumber.startsWith("COHORT:");
  const booking = {
    id: crypto.randomUUID(),
    planId: data.planId,
    employeeNumber: isGroup ? plan.employeeNumber : data.employeeNumber,
    groupName: isGroup ? data.employeeNumber.replace("COHORT:", "") : "",
    provider: data.provider,
    course: data.course,
    period: data.date,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    deliveryMode: data.deliveryMode,
    location: data.location,
    reminderStatus: data.reminderStatus,
    bookingStatus: data.bookingStatus,
    status: data.bookingStatus
  };
  state.bookings.push(booking);
  if (plan.id) plan.status = "Booked";
  saveState();
  document.getElementById("bookingMessage").textContent = "Training booking added to demo schedule. Production version would create the booking through Microsoft 365 / Outlook integration.";
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
document.getElementById("loadSampleWorkbook").addEventListener("click", () => { stagedRows = sampleWorkbookRows(); renderWorkbook(); });
document.getElementById("overviewLoadSample").addEventListener("click", () => { stagedRows = sampleWorkbookRows(); renderWorkbook(); });
document.getElementById("csvUpload").addEventListener("change", async event => { const file = event.target.files[0]; if (file) { stagedRows = parseCsv(await file.text()); renderWorkbook(); } });
document.getElementById("applyStaging").addEventListener("click", applyWorkbookRows);
document.getElementById("resetDemoTop").addEventListener("click", resetDemo);
document.getElementById("resetDemoOverview").addEventListener("click", resetDemo);
document.getElementById("resetReportFilters").addEventListener("click", () => {
  resetReportFiltersState();
  renderReports();
});
document.getElementById("copyExecutiveSummaryOverview").addEventListener("click", copyExecutiveSummary);
document.getElementById("copyExecutiveSummaryReports").addEventListener("click", copyExecutiveSummary);

renderAll();
