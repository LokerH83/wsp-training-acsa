# Security And Privacy Plan

## Public Demo Rules

- [Done] Use synthetic data only.
- [Done] Mask employee numbers and ID numbers in profile views.
- [Done] Do not upload private ACSA data into the public demo.
- [Done] Do not connect to Dataverse, Graph, Outlook or production services.
- [Done] Do not expose API keys, secrets or connection strings.

## Production Rules

- [Not Started] Confirm client data owner.
- [Not Started] Confirm legal basis for demographic reporting fields.
- [Not Started] Define retention rules.
- [Not Started] Define evidence storage rules.
- [Not Started] Define export approval rules.
- [Not Started] Configure role-based access.
- [Not Started] Audit imports, updates and exports.

## User Roles

- System Owner
- SDF Admin
- Training Coordinator
- Manager / Viewer
- Report Viewer
- IT Admin

## Permission Matrix

| Permission | System Owner | SDF Admin | Training Coordinator | Manager / Viewer | Report Viewer | IT Admin |
|---|---|---|---|---|---|---|
| View employee records | Yes | Yes | Limited | Limited | No | Limited |
| Edit employee records | Yes | Yes | No | No | No | No |
| Import workbook | Yes | Yes | No | No | No | No |
| Approve imported rows | Yes | Yes | No | No | No | No |
| Create WSP plan | Yes | Yes | Yes | No | No | No |
| Record ATR actual | Yes | Yes | Yes | No | No | No |
| Upload evidence | Yes | Yes | Yes | No | No | No |
| Export reports | Yes | Yes | No | Limited | Yes | No |
| View dashboards | Yes | Yes | Yes | Yes | Yes | Limited |
| Manage providers/courses | Yes | Yes | Limited | No | No | No |
| Manage users | Yes | No | No | No | No | Yes |
