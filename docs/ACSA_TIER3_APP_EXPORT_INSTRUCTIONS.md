# ACSA Tier 3 App Export Instructions

## Purpose

This document explains how to export the full Power Apps/Dataverse solution for the ACSA Tier 3 app so the repo can be reviewed and the live deployment plan can be finalized.

## Export instructions

## Current export status

Latest package created:

`exports/WSPTrainingManagementSystem_full_app_solution_unmanaged.zip`

Result: export succeeded, but unpack verification shows the solution still contains only the Dataverse entity model and relationships. It does not yet include the model-driven app component `The About WSP Training Management System`.

Latest app-navigation package created:

`exports/WSPTrainingManagementSystem_full_app_solution_with_app_nav_unmanaged.zip`

Result: export succeeded and unpack verification shows `AppModuleSiteMaps/cr075_TheAboutWSPTrainingManagementSyste`. This confirms the app navigation/site map component was added. It still does not include a full `AppModules` model-driven app definition folder.

Attempted CLI app add:

`pac solution add-solution-component`

Result: PAC could list the model-driven app and add the site map component, but the environment/CLI rejected the full app module component add operation. Add the full app through Power Apps Maker UI if a complete app package is required, then export again.

### Option A: Export the app from a solution

1. Open `https://make.powerapps.com`.
2. Confirm you are in the correct environment.
3. Open `Solutions` in the left menu.
4. Locate the solution that contains the ACSA app.
5. Click the solution name.
6. Confirm `The About WSP Training Management System` is listed under solution objects.
7. If it is missing, click `Add existing` and add the model-driven app.
8. Click `Export`.
9. Follow the export wizard:
   - Set a package version.
   - Review components.
   - Export as unmanaged if you want to continue editing after import.
10. Download the `.zip` package.

### Option B: Export the app when it is not already in a solution

1. Open `https://make.powerapps.com`.
2. Confirm you are in the correct environment.
3. Open `Solutions` and create a new solution.
4. Add the ACSA app to that solution.
5. Add all dependent entities and components:
   - Custom tables and fields
   - Forms and views
   - Business rules and workflows
   - Security roles (if used)
   - Dashboards and charts (if relevant)
6. Export the solution from the new solution.

## What must be included in the export

- The app definition(s) (Canvas App or Model-driven App)
- Dataverse tables/entities
- Custom forms and views
- Business rules, workflows, and processes
- Security role components (if used)
- Dashboards or embedded Power BI components if part of the app

## What to do with the exported package

1. Save the exported `.zip` file to the local machine.
2. Copy the package into the repo under a new folder, for example:
   - `exports/full_app_solution.zip`
3. If possible, include a short note with the export name and environment.
4. Unpack or inspect the package and confirm it includes an app component, not only entity metadata.

## Why this is important

The current repo export shows the Tier 3 data model only. A full solution export is required to:

- review the actual app UI and forms
- validate workflows and business rules
- map the app to the Tier 3 live deployment plan
- identify missing entities or components needed for production
