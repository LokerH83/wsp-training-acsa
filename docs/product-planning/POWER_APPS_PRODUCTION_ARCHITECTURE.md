# Power Apps Production Architecture

## Architecture Goal

Move from a static concept demo to a governed Microsoft Power Platform solution only after the data model, roles, reporting requirements and client ownership are confirmed.

## Recommended Stack

- Dataverse for production data storage
- Model-driven Power App for SDF/admin workflow
- Power BI for management dashboards
- SharePoint or Dataverse file columns for evidence, depending on client governance
- Power Automate for approved reminders and review workflows

## Environments

- Development
- Test / UAT
- Production

## Core Tables

- Employee Profiles
- Providers
- Courses
- Requested Training
- WSP Plans
- ATR Actuals
- Training Bookings
- Evidence Register
- Review Items
- Admin Settings

## App Areas

- Dashboard
- Employee Profiles
- Training Planning
- ATR Actuals
- Bookings
- Evidence
- Reports
- Admin

## Security

Use the role model in `SECURITY_PRIVACY_PLAN.md`. Production must control demographic and evidence access before go-live.

## Integration Boundaries

- No Microsoft Graph integration until approved.
- No Outlook automation until approved.
- No payroll/HR write-back in MVP.
- Imports should be controlled through approved templates or dataflows.

## Deployment

- Use managed solutions for production.
- Use separate environment variables for client-specific settings.
- Document import mappings.
- Test in UAT before production release.

## Future Automation

- Import validation workflow.
- Review item assignment.
- Training reminder notifications.
- Evidence review approval.
- Power BI refresh monitoring.
