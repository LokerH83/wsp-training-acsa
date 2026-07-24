import { existsSync, readFileSync } from "node:fs";

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const alignmentStyles = readFileSync(new URL("../scanner-alignment.css", import.meta.url), "utf8");
const config = readFileSync(new URL("../client-config.js", import.meta.url), "utf8");
const officialLogo = new URL("../assets/skillset-sa-tree.png", import.meta.url);

const requiredIds = [
  "submissionDecisionCard",
  "submissionCategoryFilter",
  "submissionSeverityFilter",
  "submissionStatusFilter",
  "submissionIssueRows",
  "submissionSignoffForm",
  "exportActionRegister",
  "downloadReadinessPack"
];

const failures = [];
for (const id of requiredIds) {
  if (!index.includes(`id="${id}"`)) failures.push(`Missing HTML control: ${id}`);
  if (!app.includes(`getElementById("${id}")`)) failures.push(`Missing JavaScript wiring: ${id}`);
}

for (const marker of ["function dataQualityIssues", "function renderSubmission", "function exportSubmissionActionRegister", "function readinessPackHtml"]) {
  if (!app.includes(marker)) failures.push(`Missing application feature: ${marker}`);
}

for (const marker of [".submission-status-grid", ".submission-register", ".submission-signoff"]) {
  if (!styles.includes(marker)) failures.push(`Missing workspace style: ${marker}`);
}

if (!config.includes('logo: "./assets/skillset-sa-tree.png"')) {
  failures.push("SkillSet configuration must use the official tree logo asset.");
}
if (!existsSync(officialLogo)) failures.push("Official SkillSet tree logo asset is missing.");
if (index.includes("skillset-leaf")) failures.push("Invented SkillSet logo artwork must not appear in the public shell.");
for (const marker of ["ecosystem-links", "ecosystemNextStep", "Free Risk Scanner", "Reporting Rescue Review"]) {
  if (!index.includes(marker)) failures.push(`Missing SkillSet ecosystem marker: ${marker}`);
}
if (!index.includes("scanner-alignment.css")) failures.push("Scanner alignment stylesheet is not loaded.");
for (const marker of [".ecosystem-row", ".workbook-mapping-layout", ".ecosystem-handoff"]) {
  if (!alignmentStyles.includes(marker)) failures.push(`Missing scanner alignment style: ${marker}`);
}
for (const marker of [".report-filter-panel", "#reports .relationship-kpis", "#people .employee-list", "#submission .submission-status-grid"]) {
  if (!alignmentStyles.includes(marker)) failures.push(`Missing final sales-polish style: ${marker}`);
}
for (const marker of ["Profile-linked evidence", "Management reporting", "mobile-list-hint", "report-filter-panel"]) {
  if (!index.includes(marker)) failures.push(`Missing final sales-polish markup: ${marker}`);
}
if (!app.includes("window.scrollTo(0, 0)") || !app.includes('activeNavItem?.closest(".app-nav")')) {
  failures.push("View changes must return to the top and keep the active mobile navigation item visible.");
}
if (!/\.workflow-strip span\s*\{[^}]*color:\s*#ffffff\s*!important;/s.test(alignmentStyles)) {
  failures.push("Workflow strip labels must stay white on the SkillSet green surface.");
}
if (!/\.workflow-strip span:not\(:last-child\)::after\s*\{[^}]*color:\s*var\(--skillset-gold\)\s*!important;/s.test(alignmentStyles)) {
  failures.push("Workflow strip arrows must use SkillSet yellow.");
}

const ids = [...index.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicates = ids.filter((id, position) => ids.indexOf(id) !== position);
if (duplicates.length) failures.push(`Duplicate HTML IDs: ${[...new Set(duplicates)].join(", ")}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Static smoke checks passed: ${requiredIds.length} controls, ${ids.length} unique IDs.`);
