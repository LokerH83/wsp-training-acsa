# Deployment Notes

This demo is static and can run from:

- a local folder
- a local Python static server
- GitHub Pages

## GitHub Pages Requirements

The repository root must contain:

- index.html
- styles.css
- app.js
- data/demo-snapshot.js
- sample-workbooks/
- assets/
- docs/
- README.md

All paths must be relative.

The app must not depend on:

- local absolute Windows paths
- localhost
- local file URI paths
- Dataverse
- APIs
- authentication
- environment variables
- private workbooks

## Production Boundary

A production version would require:

- Microsoft Entra authentication
- Dataverse tables
- secured API/write layer
- validation rules
- audit logging
- role-based access
- evidence storage
- approved reporting outputs

Do not deploy private snapshot files, real client workbooks or private employee data with this demo.
