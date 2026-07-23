# Tier 3 Build Workspace

## Purpose

This repository now contains two different tracks:

- Public static demo: the sales-ready GitHub Pages app in the repository root.
- Tier 3 build workspace: unpacked Power Apps solution source, draft entity artifacts, flow skeletons and helper scripts.

Keep the public demo as the client walkthrough. Use this workspace for sandbox build validation only.

## Current verified baseline

- Static demo URL: `https://lokerh83.github.io/wsp-training-acsa/`
- Verified Power Apps app baseline: `exports/WSPTrainingManagementSystem_complete_solution.zip`
- Latest generated sandbox candidate: `exports/WSPTrainingManagementSystem_with_entities_20260707075243.zip`

## What was added for Tier 3 build work

- `src/solution/` - unpacked Power Apps solution source.
- `artifacts/entities/` - draft metadata for Evidence, Review Item and Booking.
- `artifacts/flows/` - flow skeletons for evidence status and booking lifecycle.
- `artifacts/security/` - draft security role skeleton.
- `scripts/merge_entities_into_solution.ps1` - quick ZIP merge helper.
- `scripts/pac_solution_pack_unpack.ps1` - preferred Power Platform CLI pack/unpack helper.
- `.github/workflows/pack_and_inject.yml` - manual/branch workflow for packing the solution candidate.

## Validation order

1. Keep the public demo unchanged and use it for the client walkthrough.
2. Import `exports/WSPTrainingManagementSystem_with_entities_20260707075243.zip` into a sandbox Power Apps environment.
3. Confirm whether Evidence, Review Item and Booking import cleanly.
4. If import fails, use `src/solution/` and `artifacts/` to correct metadata and regenerate the package.
5. Recreate or import the flow skeletons inside the Power Apps solution.
6. Create or adjust the security role in Maker, then export again.

## Do not overclaim

- The static demo is sales-ready.
- `WSPTrainingManagementSystem_complete_solution.zip` is the verified app baseline.
- `WSPTrainingManagementSystem_with_entities_20260707075243.zip` is a sandbox-validation candidate.
- Production still needs dependency checks, security role validation, flow testing, Power BI reporting and pilot approval.
