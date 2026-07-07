# ACSA WSP / ATR Reporting Concept Demo

[![Power Platform Import](https://github.com/LokerH83/wsp-training-acsa/actions/workflows/pack_and_inject.yml/badge.svg)](https://github.com/LokerH83/wsp-training-acsa/actions/workflows/pack_and_inject.yml)
[![Validation Workflow](https://github.com/LokerH83/wsp-training-acsa/actions/workflows/validate_powerplatform_export.yml/badge.svg)](https://github.com/LokerH83/wsp-training-acsa/actions/workflows/validate_powerplatform_export.yml)
[![CI Lint](https://github.com/LokerH83/wsp-training-acsa/actions/workflows/ci-lint.yml/badge.svg)](https://github.com/LokerH83/wsp-training-acsa/actions/workflows/ci-lint.yml)
[![Static Smoke Test](https://github.com/LokerH83/wsp-training-acsa/actions/workflows/static-site-smoke-test.yml/badge.svg)](https://github.com/LokerH83/wsp-training-acsa/actions/workflows/static-site-smoke-test.yml)

Demo-safe ACSA WSP / ATR reporting dashboard showing workbook loading, provider/course search, training booking, people profiles and requested vs planned vs achieved reporting.

Live demo: https://lokerh83.github.io/wsp-training-acsa/

## Current Live App State

The public demo is a static GitHub Pages app using synthetic/demo data only. It currently includes:

- Overview dashboard with operational WSP / ATR focus areas
- Load Workbook page with sample workbook staging and demo-safe CSV upload
- Manage Training page with provider/course search, employee profile context, booking details and ATR capture
- People Profiles page with searchable profile-linked training history
- Reports page with filters, report coverage/date range, copyable summaries and Excel-ready filtered CSV export
- Reset Demo controls to restore the baseline demo state

Recent polish included:

- Removed proposal/sales tier content from the visible app UI
- Replaced commercial wording with operational WSP / ATR dashboard language
- Removed the default `Q3` value from `Quarter / Date`
- Added `Date to be confirmed` as the neutral booking/date placeholder
- Tightened the Manage Training layout and provider/course table
- Changed the provider/course action button to `Select`
- Reworked employee inherited data into a labelled profile context block
- Preserved proposal/pricing content in documentation only

Recent app commits:

- `a837d29` - Polish training management layout
- `a077570` - Polish training quarter default
- `d960e7c` - Tighten manage training layout
- `af7ee0a` - Realign demo training booking flow
- `844b2a6` - Add filtered report export
- `450dbfa` - Polish final ACSA demo wording
- `c567380` - Remove proposal panel from live dashboard

## Start Here For The ACSA Demo

Use `demo/README.md` as the clean demo pack. It contains the live links, Power Apps status, demo order, and the files needed on demo day.

## What The Demo Does

- Load sample workbook
- Stage workbook data
- Add training interventions
- Book training
- Record ATR activity
- Search people profiles
- Search providers/courses
- Filter reports
- Show report coverage / date range where available
- Export filtered report as Excel-ready CSV
- Copy filtered report table
- Copy executive summary
- Reset demo

## Product Planning Documents

- `docs/product-planning/MASTER_PRODUCT_PLAN.md`
- `docs/product-planning/PRODUCT_REQUIREMENTS.md`
- `docs/product-planning/DATA_DICTIONARY.md`
- `docs/product-planning/REPORTING_REQUIREMENTS.md`
- `docs/product-planning/APP_MODULE_SPECIFICATION.md`
- `docs/product-planning/SECURITY_PRIVACY_PLAN.md`
- `docs/product-planning/IMPLEMENTATION_CHECKLIST.md`
- `docs/product-planning/TESTING_CHECKLIST.md`
- `docs/product-planning/COMMERCIAL_MODEL.md`
- `docs/product-planning/RISK_REGISTER.md`
- `docs/product-planning/PRODUCT_BACKLOG.md`
- `docs/product-planning/ONE_NOTE_MASTER_GUIDE.md`
- `docs/product-planning/DISCOVERY_QUESTIONNAIRE.md`
- `docs/product-planning/CLIENT_PROPOSAL_TEMPLATE.md`
- `docs/product-planning/POWER_BI_REPORTING_DESIGN.md`
- `docs/product-planning/POWER_APPS_PRODUCTION_ARCHITECTURE.md`
- `docs/product-planning/PILOT_RUN_PLAN.md`

## Run Locally

Option A: open `index.html`.

Option B: run from this repository folder:

```bash
python -m http.server 8092
```

Then open:

```text
http://localhost:8092
```

## Tomorrow's Demo Pack

- `docs/ACSA_TOMORROW_MEETING_PACK.md`
- `docs/FOLDER_MAP.md`
- `docs/ACSA_DEMO_SCRIPT.md`
- `docs/ACSA_THREE_TIER_PROPOSAL.md`
- `docs/ACSA_MEETING_ONE_PAGER.md`
- `docs/ACSA_BACKUP_IF_DEMO_FAILS.md`
- `docs/CLIENT_DEMO_INSTRUCTIONS.md`
- `docs/DEMO_DATA_POLICY.md`
- `docs/DEPLOYMENT_NOTES.md`
- `docs/WORKFLOW_OVERVIEW.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/MAINTENANCE_GUIDE.md`
- `docs/CHANGELOG.md`

## Manual GitHub Pages Publishing

Hayden publishes manually:

1. Open GitHub Desktop.
2. Select repository: `wsp-training-acsa`.
3. Review changed files.
4. Commit changes.
5. Click Publish repository.
6. Open the GitHub repository in a browser.
7. Go to Settings.
8. Go to Pages.
9. Select Deploy from branch.
10. Select the `main` branch and root folder.
11. Save.
12. Use the generated GitHub Pages URL.

Expected URL format:

```text
https://<github-username>.github.io/wsp-training-acsa/
```

Live demo: https://lokerh83.github.io/wsp-training-acsa/

## Workflow status

- GitHub Pages: served from the `main` branch/root folder.
- Power Platform import: `.github/workflows/pack_and_inject.yml`
- Validation workflow: `.github/workflows/validate_powerplatform_export.yml`

## Power Platform import workflow

The workflow `.github/workflows/pack_and_inject.yml` imports a verified Power Apps solution using the `pac` CLI.

Required GitHub Actions secrets:

- `PP_ENVIRONMENT` — Power Platform environment ID or environment URL
- `PP_CLIENT_ID`
- `PP_CLIENT_SECRET`
- `PP_TENANT_ID`

It also expects the export file at `exports/WSPTrainingManagementSystem_complete_solution.zip`.

## Safety Notes

- Synthetic/demo data only.
- No private ACSA records.
- No real ID numbers.
- No Dataverse connection.
- No production writes.
- Not official SETA output.
- Not official B-BBEE output.
