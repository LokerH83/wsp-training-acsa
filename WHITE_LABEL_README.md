# White-label WSP / ATR app note

## What changed

The app has been moved closer to a reusable SkillSet SA white-label product instead of a single ACSA-only demo.

Changes made:

- Converted the default branding to a neutral SkillSet SA / white-label training reporting hub.
- Added configurable hero wording, privacy copy, workbook-upload guidance and sidebar footer text.
- Added logo fallback initials so the app still looks clean when no client logo is supplied.
- Updated the default visual theme from ACSA blue to SkillSet green and yellow.
- Added reusable client configuration presets in `config-presets/`.

## Files changed

- `client-config.js`
- `index.html`
- `app.js`
- `styles.css`
- `config-presets/acsa-demo.client-config.js`
- `config-presets/skillset-default.client-config.js`
- `config-presets/generic-client-template.client-config.js`
- `README.md`
- `WHITE_LABEL_README.md`

## How to create a new client version

1. Open `config-presets/generic-client-template.client-config.js`.
2. Replace the client name, colours, logo path, reporting year and wording.
3. Save a client-specific copy, for example:

   `config-presets/example-client.client-config.js`

4. Copy that file over `client-config.js`.
5. Test the app locally.
6. Publish the client-specific version.

Only `client-config.js` should need to change for most client demos. If you are editing `index.html`, `app.js` or `styles.css` for every client, the white-label layer is not doing enough yet.

## Current commercial readiness

This is now suitable for:

- a branded walkthrough demo,
- a client-specific pilot,
- a Microsoft 365 reporting-system proposal,
- a proof-of-concept for WSP / ATR workflow control,
- a conversation starter for organisations using spreadsheets for training reporting.

It is not yet a fully self-service SaaS product.

Still required for true SaaS:

- client login and tenant separation,
- secure backend database,
- Microsoft 365 or SharePoint integration per client,
- payment/subscription billing,
- admin provisioning,
- automated deployments per client,
- production support and audit logging,
- legal/privacy wording for real client data.

## Recommended sales positioning

Use this as a controlled pilot offer, not as a finished SaaS claim:

> SkillSet SA can configure a training reporting hub for your organisation, using your branding, reporting year and workflow requirements. The demo shows the structure; the production version should run inside your Microsoft 365 environment.

Suggested commercial ladder:

1. Free demo walkthrough.
2. Paid reporting/workflow review.
3. Client-specific pilot build.
4. Microsoft 365 production rollout.
5. Monthly support and reporting improvement retainer.

## Validation checklist

Before showing a client:

- Run JavaScript syntax checks on `app.js`, `client-config.js` and the selected preset.
- Open the app and confirm the client name, logo, colours and hero copy are correct.
- Confirm no private or real client records are included.
- Reset demo data before the walkthrough.
- Export a sample readiness pack and action register.

## Note for future work

The next high-value build step is not more styling. It is turning the browser-local action register into a real Microsoft 365 workflow:

- SharePoint list for action items,
- Power Automate reminders,
- optional Power BI dashboard,
- client-controlled document library for evidence,
- status pack exported for management review.
