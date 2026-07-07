# Maintenance Guide

This guide helps keep the demo repo healthy and reliable.

## What this repo does

- Builds and deploys a live GitHub Pages demo.
- Validates the verified Power Platform export artifact.
- Imports the solution automatically into Power Platform.
- Runs CI lint checks for workflow YAML and PowerShell.
- Supports preview build validation for pull requests.
- Sends failure notifications if `SLACK_WEBHOOK_URL` is configured.

## Key files

- `.github/workflows/pages-build-deployment.yml`
- `.github/workflows/preview-pages-build.yml`
- `.github/workflows/validate_powerplatform_export.yml`
- `.github/workflows/pack_and_inject.yml`
- `.github/workflows/ci-lint.yml`
- `.github/workflows/workflow-failure-notification.yml`
- `docs/RELEASE_CHECKLIST.md`
- `docs/WORKFLOW_OVERVIEW.md`
- `docs/MAINTENANCE_GUIDE.md`

## Secrets

These repository secrets must be configured for Power Platform automation:

- `PP_ENVIRONMENT`
- `PP_CLIENT_ID`
- `PP_CLIENT_SECRET`
- `PP_TENANT_ID`
- `SLACK_WEBHOOK_URL` (optional, for failure notifications)

## Daily maintenance

- Ensure the live site is publishing successfully.
- Confirm the preview workflow remains green for new pull requests.
- Validate the verified export artifact before deploying a new release.
- Review any failed workflow runs and address issues quickly.

## Updating the verified export

1. Replace `exports/WSPTrainingManagementSystem_complete_solution.zip` with the new verified export.
2. Run `.github/workflows/validate_powerplatform_export.yml`.
3. If validation passes, run `.github/workflows/pack_and_inject.yml` if you want to refresh the target environment.
4. Run `.github/workflows/pages-build-deployment.yml` to publish updates to the live demo.

## Notification setup

To enable workflow failure notifications:

1. Create a Slack incoming webhook.
2. Add the webhook URL as the repository secret `SLACK_WEBHOOK_URL`.
3. The notification workflow will post failures for the main automation workflows.

## Demo delivery tips

- Start with the public live demo and the GitHub Actions status badges.
- Use `docs/RELEASE_CHECKLIST.md` before handoff or showtime.
- Keep the verified export artifact stable and report any update only after validation succeeds.
