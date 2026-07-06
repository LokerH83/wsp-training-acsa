# ACSA SDF Demo

Demo-safe ACSA SDF dashboard showing workbook loading, provider/course search, training booking, people profiles and requested vs planned vs achieved reporting.

## What The Demo Does

- Load sample workbook
- Stage workbook data
- Add training interventions
- Book training
- Record ATR activity
- Search people profiles
- Search providers/courses
- Filter reports
- Copy executive summary
- Reset demo

## Run Locally

Option A: open `index.html`.

Option B: run from this repository folder:

```bash
python -m http.server 8092
```

Then open:

```text
http://localhost:8092
```

## Tomorrow's Demo Pack

- `docs/ACSA_TOMORROW_MEETING_PACK.md`
- `docs/FOLDER_MAP.md`
- `docs/ACSA_DEMO_SCRIPT.md`
- `docs/ACSA_THREE_TIER_PROPOSAL.md`
- `docs/ACSA_MEETING_ONE_PAGER.md`
- `docs/ACSA_BACKUP_IF_DEMO_FAILS.md`
- `docs/CLIENT_DEMO_INSTRUCTIONS.md`
- `docs/DEMO_DATA_POLICY.md`
- `docs/DEPLOYMENT_NOTES.md`

## Manual GitHub Pages Publishing

Hayden publishes manually:

1. Open GitHub Desktop.
2. Select repository: `wsp-training-acsa`.
3. Review changed files.
4. Commit changes.
5. Click Publish repository.
6. Open the GitHub repository in a browser.
7. Go to Settings.
8. Go to Pages.
9. Select Deploy from branch.
10. Select the `main` branch and root folder.
11. Save.
12. Use the generated GitHub Pages URL.

Expected URL format:

```text
https://<github-username>.github.io/wsp-training-acsa/
```

## Safety Notes

- Synthetic/demo data only.
- No private ACSA records.
- No real ID numbers.
- No Dataverse connection.
- No production writes.
- Not official SETA output.
- Not official B-BBEE output.
