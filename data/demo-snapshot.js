const demoRegions = ["Western Cluster", "Central Cluster", "Northern Cluster", "Coastal Cluster", "National Support"];
const demoDivisions = ["Operations", "Corporate Services", "Commercial", "Technical Services", "Risk and Compliance"];
const demoDepartments = ["Service Operations", "Customer Services", "Finance", "Human Capital", "Engineering", "Security", "IT Services", "Procurement"];
const demoRace = ["African", "Coloured", "Indian", "White"];
const demoGender = ["Female", "Male"];
const demoAgeBands = ["18-35", "36-45", "46-55", "56+"];
const demoNames = [
  "Demo Employee 001", "Demo Employee 002", "Demo Employee 003", "Demo Employee 004", "Demo Employee 005",
  "Demo Employee 006", "Demo Employee 007", "Demo Employee 008", "Demo Employee 009", "Demo Employee 010",
  "Demo Employee 011", "Demo Employee 012", "Demo Employee 013", "Demo Employee 014", "Demo Employee 015",
  "Demo Employee 016", "Demo Employee 017", "Demo Employee 018", "Demo Employee 019", "Demo Employee 020",
  "Demo Employee 021", "Demo Employee 022", "Demo Employee 023", "Demo Employee 024", "Demo Employee 025",
  "Demo Employee 026", "Demo Employee 027", "Demo Employee 028", "Demo Employee 029", "Demo Employee 030",
  "Demo Employee 031", "Demo Employee 032", "Demo Employee 033", "Demo Employee 034", "Demo Employee 035",
  "Demo Employee 036"
];

const demoProviders = [
  ["Operations Skills Academy", "Operations"],
  ["Safety Skills Academy", "Safety"],
  ["Digital Skills Institute", "Digital"],
  ["Leadership Development Partner", "Leadership"],
  ["Technical Training Centre", "Technical"],
  ["Compliance Learning Partner", "Compliance"],
  ["Customer Service Training Partner", "Service"],
  ["Operations Skills Academy", "Operations"]
].map(([provider, focus], index) => ({ id: `provider-${index + 1}`, provider, focus }));

const demoCourseRows = [
  ["Operations Skills Academy", "Operational Excellence Fundamentals", "Operations", "2 days", "Classroom", 2800, "Attendance register", "WSP / ATR"],
  ["Operations Skills Academy", "Workplace Safety Refresher", "Safety", "1 day", "Blended", 1800, "Assessment result", "ATR"],
  ["Operations Skills Academy", "Service Operations Workshop", "Operations", "1 day", "Workshop", 2100, "Facilitator report", "WSP"],
  ["Operations Skills Academy", "Customer Flow Basics", "Service", "1 day", "Classroom", 1600, "Attendance register", "WSP / ATR"],
  ["Safety Skills Academy", "Occupational Health and Safety", "Safety", "2 days", "Classroom", 2500, "Certificate", "ATR"],
  ["Safety Skills Academy", "Emergency Response Coordination", "Safety", "3 days", "Simulation", 4200, "Simulation checklist", "ATR"],
  ["Safety Skills Academy", "Incident Investigation", "Safety", "2 days", "Classroom", 3300, "Case assessment", "WSP / ATR"],
  ["Digital Skills Institute", "Excel Reporting for SDF Staff", "Digital", "1 day", "Virtual", 1200, "Practical workbook", "WSP"],
  ["Digital Skills Institute", "Power BI Overview Basics", "Digital", "2 days", "Virtual", 3600, "Overview file", "WSP / ATR"],
  ["Digital Skills Institute", "Data Quality for Training Records", "Digital", "1 day", "Workshop", 1700, "Data checklist", "WSP / ATR"],
  ["Digital Skills Institute", "Cyber Awareness for Operational Teams", "Digital", "Half day", "Online", 850, "Completion record", "ATR"],
  ["Leadership Development Partner", "Frontline Leadership Essentials", "Leadership", "2 days", "Classroom", 3900, "Attendance register", "WSP / ATR"],
  ["Leadership Development Partner", "Coaching Conversations", "Leadership", "1 day", "Workshop", 2100, "Reflection log", "WSP"],
  ["Leadership Development Partner", "Performance Management Basics", "Leadership", "1 day", "Blended", 1900, "Manager sign-off", "WSP"],
  ["Technical Training Centre", "Electrical Maintenance Safety", "Technical", "3 days", "Classroom", 5400, "Certificate", "ATR"],
  ["Technical Training Centre", "Equipment Systems Maintenance", "Technical", "2 days", "Practical", 4800, "Practical assessment", "WSP / ATR"],
  ["Technical Training Centre", "Facilities Inspection Routine", "Technical", "1 day", "Practical", 2300, "Inspection checklist", "WSP"],
  ["Compliance Learning Partner", "POPIA Awareness", "Compliance", "Half day", "Online", 700, "Completion record", "ATR"],
  ["Compliance Learning Partner", "Procurement Compliance", "Compliance", "1 day", "Classroom", 1600, "Assessment result", "WSP / ATR"],
  ["Compliance Learning Partner", "Ethics and Anti-Corruption", "Compliance", "Half day", "Online", 900, "Completion record", "ATR"],
  ["Customer Service Training Partner", "Passenger Experience Excellence", "Service", "1 day", "Classroom", 1500, "Attendance register", "WSP / ATR"],
  ["Customer Service Training Partner", "Conflict De-escalation", "Service", "1 day", "Workshop", 1850, "Role-play checklist", "ATR"],
  ["Customer Service Training Partner", "Inclusive Service Behaviours", "Service", "1 day", "Workshop", 1750, "Facilitator report", "WSP"],
  ["Operations Skills Academy", "Ramp Coordination Basics", "Operations", "2 days", "Practical", 3100, "Practical assessment", "WSP / ATR"],
  ["Operations Skills Academy", "Queue Management Techniques", "Operations", "1 day", "Workshop", 1450, "Attendance register", "WSP"],
  ["Operations Skills Academy", "Shift Handover Quality", "Operations", "Half day", "Workshop", 950, "Supervisor sign-off", "ATR"],
  ["Operations Skills Academy", "Resource Planning for Supervisors", "Operations", "1 day", "Classroom", 2200, "Planning exercise", "WSP"],
  ["Safety Skills Academy", "Fire Marshal Refresher", "Safety", "1 day", "Classroom", 1300, "Certificate", "ATR"]
];

const demoCourses = demoCourseRows.map((row, index) => ({
  id: `course-${index + 1}`,
  provider: row[0],
  course: row[1],
  category: row[2],
  duration: row[3],
  deliveryMode: row[4],
  estimatedCost: row[5],
  evidenceRequired: row[6],
  setaBbbeeRelevance: row[7]
}));

const demoEmployees = demoNames.map((employeeName, index) => {
  const ageBand = demoAgeBands[index % demoAgeBands.length];
  const baseAge = { "18-35": 26, "36-45": 39, "46-55": 49, "56+": 57 }[ageBand];
  return {
    employeeNumber: `DEM${String(index + 1).padStart(4, "0")}`,
    employeeName,
    idNumber: `900101${String(index + 1).padStart(4, "0")}00${index % 10}`,
    regionCluster: demoRegions[index % demoRegions.length],
    division: demoDivisions[index % demoDivisions.length],
    department: demoDepartments[index % demoDepartments.length],
    sexGender: demoGender[index % demoGender.length],
    race: demoRace[Math.floor(index / 2) % demoRace.length],
    age: baseAge + (index % 4),
    ageBand,
    disability: index % 11 === 0 ? "Yes" : "No"
  };
});

function demoRecord(index, offset = 0, extra = {}) {
  const person = demoEmployees[index % demoEmployees.length];
  const course = demoCourses[(index + offset) % demoCourses.length];
  return {
    id: `${extra.prefix || "record"}-${index + 1}-${offset}`,
    employeeNumber: person.employeeNumber,
    provider: course.provider,
    course: course.course,
    period: ["Q1", "Q2", "Q3", "Q4"][index % 4],
    cost: course.estimatedCost,
    hours: index % 3 === 0 ? 16 : 8,
    status: extra.status || "Clean",
    evidenceStatus: extra.evidenceStatus || "Evidence ready"
  };
}

const demoRequests = Array.from({ length: 34 }, (_, index) => demoRecord(index, 0, {
  prefix: "request",
  status: index === 9 || index === 23 ? "Review Required" : "Clean"
}));

const demoPlans = [
  ...Array.from({ length: 26 }, (_, index) => demoRecord(index, 0, { prefix: "plan", status: index === 12 ? "Review Required" : "Clean" })),
  demoRecord(30, 5, { prefix: "plan-only", status: "Clean" }),
  demoRecord(31, 7, { prefix: "plan-only", status: "Clean" })
];

const demoActuals = [
  ...Array.from({ length: 19 }, (_, index) => demoRecord(index, 0, { prefix: "actual", evidenceStatus: index === 8 ? "Pending evidence" : "Evidence ready" })),
  demoRecord(32, 8, { prefix: "actual-only", status: "Needs Reconciliation", evidenceStatus: "Evidence ready" }),
  demoRecord(33, 10, { prefix: "actual-only", status: "Needs Reconciliation", evidenceStatus: "Evidence ready" })
];

function demoBooking(planIndex, status, date, startTime, endTime, deliveryMode, reminderStatus, location, groupName = "") {
  const plan = demoPlans[planIndex];
  const course = demoCourses.find(item => item.provider === plan.provider && item.course === plan.course) || {};
  return {
    id: `booking-${planIndex + 1}`,
    planId: plan.id,
    employeeNumber: plan.employeeNumber,
    groupName,
    provider: plan.provider,
    course: plan.course,
    period: plan.period,
    preferredWindow: date ? "Next month" : "Date to be confirmed",
    date,
    startTime,
    endTime,
    deliveryMode,
    location,
    reminderStatus,
    evidenceRequired: course.evidenceRequired || "Not confirmed",
    bookingNotes: "",
    bookingStatus: status,
    status
  };
}

const demoBookings = [
  demoBooking(0, "Booked", "2026-08-12", "09:00", "12:00", "Classroom", "Reminder scheduled", "Demo Training Room 1"),
  demoBooking(1, "Completed", "2026-07-22", "10:00", "13:00", "Blended", "Reminder sent", "Demo Training Room 2"),
  demoBooking(2, "Proposed", "2026-08-19", "09:00", "11:00", "Classroom", "Not sent", "To be confirmed"),
  demoBooking(4, "Missed / Needs Justification", "2026-07-29", "08:30", "12:30", "Classroom", "Reminder sent", "Demo Safety Lab"),
  demoBooking(8, "Booked", "2026-09-03", "13:00", "16:00", "Online", "Reminder scheduled", "Online meeting link"),
  demoBooking(11, "Completed", "2026-07-15", "09:00", "16:00", "Classroom", "Reminder sent", "Leadership Room A"),
  demoBooking(15, "Booked", "2026-08-27", "09:00", "15:00", "Blended", "Not sent", "Technical Training Centre"),
  demoBooking(23, "Proposed", "2026-09-10", "10:00", "12:00", "Classroom", "Not sent", "Operations Skills Academy", "Operations supervisors cohort")
];

window.SKILLSET_WSP_DEMO_DATA = {
  employees: demoEmployees,
  providers: demoProviders,
  courses: demoCourses,
  requests: demoRequests,
  plans: demoPlans,
  actuals: demoActuals,
  bookings: demoBookings
};
