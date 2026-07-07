# Flows & Roles: Next steps

Files added:
- `artifacts/flows/evidence_status_flow.json` — Evidence status transition skeleton.
- `artifacts/flows/booking_lifecycle_flow.json` — Booking lifecycle skeleton.
- `artifacts/security/SecurityRole_cr075.xml` — Security role skeleton for import.
- `scripts/pac_solution_pack_unpack.ps1` — `pac` helper for unpack/pack (requires Power Platform CLI).

How to use:

1) Inspect and adapt the JSON flow files, replacing placeholders with actual dynamic content and email addresses.
2) Create flows inside your Solution in Power Apps Maker, choose Import from JSON or recreate steps using the skeleton as guidance, then export the Solution.
3) For security role, convert the XML into the correct Solution structure (SecurityRoles folder) or create the role in the Maker UI and export.
4) Use either `scripts/merge_entities_into_solution.ps1` (simple text merge) or `scripts/pac_solution_pack_unpack.ps1` (preferred if you have `pac` installed) to produce a new solution ZIP containing the artifacts.

Recommended order:
1. Run the entity merge (entities must exist before flows/roles are imported).
2. Import flows into the solution and export them as part of the solution.
3. Add security role and map privileges, export and include.
4. Import the final solution into a sandbox environment and resolve any dependency errors.
