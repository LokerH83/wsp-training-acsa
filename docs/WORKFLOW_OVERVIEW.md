# Workflow Overview

This repository uses GitHub Actions to support the demo and deployment process.

## Workflows

### `.github/workflows/pages-build-deployment.yml`

- Builds the static demo site into a `public` folder.
- Uploads the artifact and deploys it to GitHub Pages.
- Triggers on `push` to `main` and manual dispatch.

### `.github/workflows/preview-pages-build.yml`

- Builds the static demo site for pull request and manual preview validation.
- Uploads the artifact as `pages-preview-artifact`.
- Triggers on `pull_request` and manual dispatch.

### `.github/workflows/static-site-smoke-test.yml`

- Starts a local static server.
- Verifies the demo site responds with HTTP 200.
- Checks the index page for expected demo content.
- Triggers on `push` to `main`, `pull_request`, and manual dispatch.

### `.github/workflows/validate_powerplatform_export.yml`

- Validates the required Power Platform secrets.
- Confirms the export artifact `exports/WSPTrainingManagementSystem_complete_solution.zip` exists.
- Triggers on `push` to `main` and manual dispatch.

### `.github/workflows/preflight-export-validation.yml`

- Runs the repository export validation script.
- Verifies the verified export ZIP is present and structurally valid.
- Triggers on `pull_request` and manual dispatch.

### `.github/workflows/pack_and_inject.yml`

- Validates the required Power Platform secrets.
- Confirms the export artifact `exports/WSPTrainingManagementSystem_complete_solution.zip` exists.
- Triggers on `push` to `main` and manual dispatch.

### `.github/workflows/pack_and_inject.yml`

- Installs the Power Apps CLI.
- Authenticates to Power Platform using secrets.
- Imports the verified solution artifact to the configured environment.
- Retries the import up to three times.
- Triggers on `push` to `main`, manual dispatch, and every day at 03:00 UTC.

### `.github/workflows/workflow-failure-notification.yml`

- Sends a Slack notification when a key repo workflow fails.
- Triggers only when a workflow run completes with a failure.
- Uses the `SLACK_WEBHOOK_URL` secret if it is configured.

## Required Secrets

The following repository secrets must be configured for the import workflows:

- `PP_ENVIRONMENT`
- `PP_CLIENT_ID`
- `PP_CLIENT_SECRET`
- `PP_TENANT_ID`

## Demo status

- Public static demo: https://lokerh83.github.io/wsp-training-acsa/
- Workflow status badges are displayed on the repository `README.md`.
- The live workflow runs can be viewed under `Actions`.

## Handoff notes

1. Use the validation workflow before releasing a new export.
2. Use the Pages deployment workflow to publish changes to the live demo.
3. Use the Power Platform import workflow only if the verified export is ready and secrets are set.
4. Keep `exports/WSPTrainingManagementSystem_complete_solution.zip` as the production/demo artifact.
