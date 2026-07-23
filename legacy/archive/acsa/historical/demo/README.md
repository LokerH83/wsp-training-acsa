# ACSA Demo Pack

This folder is the one-stop demo kit. Start here before showing anything.

## Demo Links

- Public static demo: https://lokerh83.github.io/wsp-training-acsa/
- GitHub repository: https://github.com/LokerH83/wsp-training-acsa
- GitHub Actions: https://github.com/LokerH83/wsp-training-acsa/actions
- Power Platform import workflow: https://github.com/LokerH83/wsp-training-acsa/actions/workflows/pack_and_inject.yml
- Validation workflow: https://github.com/LokerH83/wsp-training-acsa/actions/workflows/validate_powerplatform_export.yml
- Preview build workflow: https://github.com/LokerH83/wsp-training-acsa/actions/workflows/preview-pages-build.yml
- Static smoke test workflow: https://github.com/LokerH83/wsp-training-acsa/actions/workflows/static-site-smoke-test.yml
- Maintenance docs: https://github.com/LokerH83/wsp-training-acsa/blob/main/docs/MAINTENANCE_GUIDE.md
- Release checklist: https://github.com/LokerH83/wsp-training-acsa/blob/main/docs/RELEASE_CHECKLIST.md
- Workflow overview: https://github.com/LokerH83/wsp-training-acsa/blob/main/docs/WORKFLOW_OVERVIEW.md
- Latest green import run: https://github.com/LokerH83/wsp-training-acsa/actions/runs/28854135835
- Power Apps solution overview: https://make.powerapps.com/environments/4ddc761e-0ac9-e691-abb8-6e83aaa5f855/solutions/f781ce30-3076-f111-ab0d-002248a37be5/overview
- Model-driven app: https://org4339676.crm4.dynamics.com/main.aspx?appid=0b94dd22-cd76-f111-ab0e-7ced8d71933e

## Current Demo Status

- Static GitHub Pages demo is live.
- GitHub Pages deployment is green.
- Power Platform import workflow is green.
- Validation workflow is green.
- Latest known good import run: workflow run #24, commit `59860d6`.
- Power Apps solution imported successfully into Hayden Loker's Environment.
- Model-driven app opens and shows imported demo data.

## Power Apps Smoke Test Passed

- Solution: `WSP Training Management System`
- Model-driven app: `The About WSP Training Management System`
- Employee Profiles view opens.
- Employee Profiles rows visible: `2170`.
- Employee Profile record form opens and displays fields.

## Demo Order

1. Open the public static demo.
2. Show the workflow run is green in GitHub Actions.
3. Open Power Apps and show the imported model-driven app.
4. Open `Employee Profiles`.
5. Open one employee profile record to prove the data/forms work.

## Demo Files In This Folder

- `files/WSPTrainingManagementSystem_complete_solution.zip`
  Verified solution package used by the successful import workflow.
- `files/ACSA_SDF_Demo_Workbook.csv`
  Sample workbook for the static demo.

## Source Files Used By The Live Static Demo

These stay at the repository root because GitHub Pages is already serving them from there:

- `index.html`
- `app.js`
- `styles.css`
- `assets/`
- `data/demo-snapshot.js`
- `sample-workbooks/ACSA_SDF_Demo_Workbook.csv`

## Do Not Use For The Demo

- `exports/WSPTrainingManagementSystem_with_entities_20260707075243.zip`

That file is a later draft/candidate export. The verified artifact for the demo is `WSPTrainingManagementSystem_complete_solution.zip`.
