# SkillSet WSP / ATR Demo configuration

The public app defaults to SkillSet SA branding and can also be configured for an approved client walkthrough without changing application logic.

## Configuration files

- `client-config.js` — active public configuration
- `config-presets/skillset-default.client-config.js` — SkillSet SA default
- `config-presets/generic-client-template.client-config.js` — reusable client template

Historical client-specific presets are retained under `legacy/archive/` and must not be used for the public product.

## Create an approved client walkthrough

1. Copy the generic client template.
2. Update the approved client name, colours, logo, reporting year and wording.
3. Replace `client-config.js` with the reviewed configuration.
4. Confirm that only synthetic or explicitly approved demo data is present.
5. Run the syntax and smoke checks.
6. Publish only after human review.

## Product boundary

White-label configuration changes presentation only. The static app remains a browser-local sales demo using `localStorage`.

A production implementation requires Microsoft 365 authentication, a SharePoint or Dataverse data layer, role-based access, governed Power BI reporting, workflow automation, audit logging and client-approved privacy controls.
