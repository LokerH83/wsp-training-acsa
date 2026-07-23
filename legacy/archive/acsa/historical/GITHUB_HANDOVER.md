# GitHub Handover

## Source And Target

- Source DEMO folder: `C:\Users\ThinkPad P1\Documents\Codex\2026-07-03\th\outputs\DEMO`
- Target GitHub repository folder: `C:\Users\ThinkPad P1\OneDrive\Documents\GitHub\wsp-training-acsa`

## Inventory

- Total files discovered: 43
- Total files copied: 14
- Total files excluded: 29
- Total files overwritten: 0

## Files Copied

- `ACSA_DEMO_HANDOVER_NOTE.md`
- `app.js`
- `assets/acsa-cropped.png`
- `assets/acsa.png`
- `assets/the-about-logo-cropped.png`
- `assets/the-about-logo.jpg`
- `data/demo-snapshot.js`
- `docs/CLIENT_DEMO_INSTRUCTIONS.md`
- `docs/DEMO_DATA_POLICY.md`
- `docs/DEPLOYMENT_NOTES.md`
- `index.html`
- `README.md`
- `sample-workbooks/ACSA_SDF_Demo_Workbook.csv`
- `styles.css`

## Files Excluded

The excluded files were the nested accidental `wsp-training-acsa/` folder found inside the source DEMO folder, including its `.git/` metadata, `.gitattributes`, and placeholder README. This nested folder was not copied.

## Safety Checks Completed

- `dataverse-snapshot.js` not copied.
- No `.zip`, Excel workbook, Power BI, logs, `node_modules`, archive, private or temporary files copied.
- No private snapshot markers found in the target files.
- Demo data file is `data/demo-snapshot.js`.
- Demo CSV sample is preserved.

## Broken Reference Check Result

Passed. Required references exist:

- `./styles.css`
- `./app.js`
- `./data/demo-snapshot.js`
- `./assets/acsa-cropped.png`
- `./sample-workbooks/ACSA_SDF_Demo_Workbook.csv`

## Static Hosting Readiness

Passed. The app is static-hosting ready from the repository root and uses relative paths. It is intended to work from:

```text
https://<github-username>.github.io/wsp-training-acsa/
```

Local static test passed from the target folder on:

```text
http://127.0.0.1:8092
```

Smoke-tested: Overview non-zero values, Load Workbook preview, Manage Training, provider/course search, Book Training, People Profiles, Reports, Reports filters, Reset Demo and Copy Executive Summary.

## Git Status Note

The requested target folder did not contain `.git/` metadata when prepared. No `.git/`, `.github/` or `.git/config` files were created, moved, replaced or modified. Hayden may need to add this folder to GitHub Desktop or create/open the repository there before committing and publishing.

## Final Repository Tree

```text
wsp-training-acsa/
├── .gitignore
├── ACSA_DEMO_HANDOVER_NOTE.md
├── GITHUB_HANDOVER.md
├── README.md
├── app.js
├── index.html
├── styles.css
├── assets/
│   ├── acsa-cropped.png
│   ├── acsa.png
│   ├── the-about-logo-cropped.png
│   └── the-about-logo.jpg
├── data/
│   └── demo-snapshot.js
├── docs/
│   ├── CLIENT_DEMO_INSTRUCTIONS.md
│   ├── DEMO_DATA_POLICY.md
│   └── DEPLOYMENT_NOTES.md
└── sample-workbooks/
    └── ACSA_SDF_Demo_Workbook.csv
```

## Manual GitHub Desktop Steps

1. Open GitHub Desktop.
2. Add or select the repository folder: `C:\Users\ThinkPad P1\OneDrive\Documents\GitHub\wsp-training-acsa`.
3. Review changed files.
4. Commit changes.
5. Publish the repository manually.

## GitHub Pages Setup Steps

1. Open the GitHub repository in a browser.
2. Go to Settings.
3. Go to Pages.
4. Select Deploy from branch.
5. Select `main` branch and root folder.
6. Save.
7. Use the generated GitHub Pages URL.
