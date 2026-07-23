# ACSA Tier 3 Entity Merge README

## Purpose

This note explains the helper artifacts for merging the draft Tier 3 entities into the exported Power Apps solution for sandbox testing.

## Added artifacts

- `artifacts/entities/*/EntityMetadata.xml` - minimal EntityMetadata fragments for Evidence, Review Item and Booking.
- `scripts/merge_entities_into_solution.ps1` - PowerShell script to inject fragments into an unpacked solution and repack.

## Quick run

```powershell
cd <repository-root>
.\scripts\merge_entities_into_solution.ps1 -SolutionZip "exports\WSPTrainingManagementSystem_complete_solution.zip" -ArtifactsDir "artifacts\entities"
```

## What the script does

- Expands the supplied solution ZIP into `exports\unpacked_solution`.
- Copies entity folders into the solution `Entities` folder.
- Inserts the `EntityMetadata.xml` fragments into `customizations.xml`.
- Recreates a new ZIP named `WSPTrainingManagementSystem_with_entities_*.zip`.

## Notes and cautions

- This is a sandbox-validation accelerator, not a production deployment shortcut.
- The script performs a simple XML insert into `customizations.xml`.
- If the Power Apps export structure changes, inspect the generated package before import.
- Preferred validation path: import into a sandbox environment, resolve dependencies, then export the corrected solution from Maker.
