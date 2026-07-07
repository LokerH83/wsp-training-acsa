# Power Apps Exports

Use this folder for the ACSA Power Apps / Dataverse solution packages.

## Earlier Client-Demo View Export

`WSPTrainingManagementSystem_after_successful_import.zip`

This export applied the Employee Profile client-demo view update.

## Latest Full Solution Export Attempt

`WSPTrainingManagementSystem_full_app_solution_unmanaged.zip`

Exported from the live `WSPTrainingManagementSystem` solution on 2026-07-06.

Verification result: the package exports successfully, but unpacking confirms it still contains Dataverse entities and relationships only. It does not yet include the model-driven app definition for `The About WSP Training Management System`.

## Latest App Navigation Export Attempt

`WSPTrainingManagementSystem_full_app_solution_with_app_nav_unmanaged.zip`

Added the app navigation/site map component using PAC and exported again.

Verification result: the package now includes `AppModuleSiteMaps/cr075_TheAboutWSPTrainingManagementSyste`, which proves the app navigation layer was added. It still does not include a full `AppModules` model-driven app definition folder.

## Maker Downloaded Export

`WSPTrainingManagementSystem_1_0_0_1_managed_from_maker.zip`

Downloaded from Power Apps Maker on 2026-07-06 and copied from Downloads into this folder.

Verification result: unpacking confirms this package contains the Dataverse entities and relationships only. It does not include `AppModules` or `AppModuleSiteMaps`.

## Completed Solution Export

`WSPTrainingManagementSystem_complete_solution.zip`

Exported after the full model-driven app component was added to the solution.

Verification result: unpacking confirms the package includes `AppModules`, `AppModuleSiteMaps`, app search components, MCP server metadata, Dataverse entities and solution metadata.

## Latest Entity-Merge Candidate

`WSPTrainingManagementSystem_with_entities_20260707075243.zip`

Generated after adding draft Evidence, Review Item and Booking entity artifacts. Treat this as a sandbox-validation candidate, not a production-ready package, until it has been imported and dependency-checked in Power Apps.

## Other Packages

- `WSPTrainingManagementSystem_client_demo_views.zip` - package imported to apply the client-demo Employee Profile view.
- `WSPTrainingManagementSystem_pre_demo_backup.zip` - backup exported before the live app view changes.
- `WSPTrainingManagementSystem_with_entities_*.zip` - generated entity-merge candidates for Tier 3 build validation.

## Notes

- These are solution metadata packages, not the public static demo.
- Do not add private workbook exports or raw Dataverse data files here.
- The static GitHub Pages demo still runs from the repository root.
- To complete the Tier 3 app package, add the full model-driven app component to the solution in Power Apps Maker, then export again.

## Completion Rule

Current verified app baseline:

`WSPTrainingManagementSystem_complete_solution.zip`

The final package now includes the actual app definition and app-specific components. If any future zip only contains `[Content_Types].xml`, `customizations.xml` and `solution.xml`, it is only a metadata/data-model export and is not complete.
