# SkillSet WSP / ATR Demo

[![Power Platform Import](https://github.com/LokerH83/skillset-wsp-demo/actions/workflows/pack_and_inject.yml/badge.svg)](https://github.com/LokerH83/skillset-wsp-demo/actions/workflows/pack_and_inject.yml)
[![Validation Workflow](https://github.com/LokerH83/skillset-wsp-demo/actions/workflows/validate_powerplatform_export.yml/badge.svg)](https://github.com/LokerH83/skillset-wsp-demo/actions/workflows/validate_powerplatform_export.yml)
[![Static Smoke Test](https://github.com/LokerH83/skillset-wsp-demo/actions/workflows/static-site-smoke-test.yml/badge.svg)](https://github.com/LokerH83/skillset-wsp-demo/actions/workflows/static-site-smoke-test.yml)

Live demo: https://lokerh83.github.io/skillset-wsp-demo/

SkillSet WSP / ATR Demo is a static sales and workflow demonstration from [SkillSet SA](https://www.skillsetsa.com/). It shows how messy training spreadsheets can be turned into a controlled workflow for workforce planning, training delivery, evidence tracking and decision-ready reporting.

## What the demo shows

- Local Excel and CSV workbook inspection
- Training demand, WSP planning and ATR capture
- Provider, course, booking and employee workflow
- Requested versus planned versus achieved reporting
- Submission-readiness scoring and actionable data-quality checks
- Evidence, owner, due-date and management sign-off controls
- Filtered CSV exports and a print-ready readiness pack
- SkillSet SA white-label configuration through `client-config.js`

## Honest product boundary

This repository is a browser-based static demo and sales asset. It uses synthetic data and browser `localStorage`; it is not a production Microsoft 365 system, an official SETA submission tool or a system of record.

A production implementation would be designed around:

- Microsoft 365 authentication and role-based access
- SharePoint or Dataverse as the controlled data layer
- Power Automate for approvals, reminders and evidence workflows
- Power BI for governed management reporting
- Client-approved security, privacy, retention and compliance controls

## Run locally

From the repository folder:

```bash
python -m http.server 8092
```

Then open `http://localhost:8092/`.

Opening `index.html` directly also works for most demo flows, but a local HTTP server gives the most reliable browser behaviour.

## Configure the demo

Edit `client-config.js` to change product wording, colours, reporting cycle and privacy copy. The default configuration is the public SkillSet SA demo.

Reusable presets:

- `config-presets/skillset-default.client-config.js`
- `config-presets/generic-client-template.client-config.js`

## Core files

- `index.html` — application shell
- `styles.css` — SkillSet-aligned interface
- `app.js` — browser-local workflow and reporting logic
- `client-config.js` — public demo positioning and visual settings
- `data/demo-snapshot.js` — synthetic neutral demo data
- `scripts/static-smoke.mjs` — structural application smoke test
- `docs/product-planning/` — production-conversion planning material

## Safety

- Use synthetic or explicitly approved demo data only.
- Do not load private employee records into the public GitHub Pages demo.
- Workbook inspection happens locally in the browser.
- No data is sent to SkillSet SA by this static demo.
- Confirm SETA, legal, security and compliance requirements during a real implementation.

## Legacy archive

Historical ACSA-specific demonstration documents, assets and Power Platform artifacts are retained under `legacy/archive/acsa/` for traceability. They are not part of the current public SkillSet product positioning.

## Publishing

GitHub Pages should publish the `main` branch from the repository root.

Repository: https://github.com/LokerH83/skillset-wsp-demo

Expected public URL: https://lokerh83.github.io/skillset-wsp-demo/
