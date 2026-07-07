# Release Checklist

Use this checklist before publishing or presenting the demo.

## 1. Validate the export and secrets

- Run the validation workflow:
  - `.github/workflows/validate_powerplatform_export.yml`
- Confirm the required secrets are configured:
  - `PP_ENVIRONMENT`
  - `PP_CLIENT_ID`
  - `PP_CLIENT_SECRET`
  - `PP_TENANT_ID`
- Confirm `exports/WSPTrainingManagementSystem_complete_solution.zip` exists and is the verified artifact.

## 2. Validate the static site preview

- Run the preview workflow:
  - `.github/workflows/preview-pages-build.yml`
- Confirm the preview artifact uploads successfully.

## 2.5. Run static site smoke test

- Run the smoke test workflow:
  - `.github/workflows/static-site-smoke-test.yml`
- Confirm that the site responds with HTTP 200 and returns expected content.

## 3. Deploy the public demo

- Run the Pages deployment workflow:
  - `.github/workflows/pages-build-deployment.yml`
- Confirm the live site publishes successfully.
- Confirm the public URL works:
  - `https://lokerh83.github.io/wsp-training-acsa/`

## 4. Confirm the Power Platform import (if needed)

- Run the import workflow:
  - `.github/workflows/pack_and_inject.yml`
- Confirm the run completes successfully.
- If the audience needs live import proof, keep the latest successful run URL handy.

## 5. Demo readiness checks

- Confirm the live static demo loads.
- Confirm the Power Apps solution can be opened when needed.
- Confirm `demo/README.md` and `docs/WORKFLOW_OVERVIEW.md` are up to date.
