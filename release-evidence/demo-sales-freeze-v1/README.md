# Demo Sales Freeze v1 Evidence

Release tag: `demo-sales-freeze-v1`

Live demo tested:

- https://lokerh83.github.io/wsp-training-acsa/

What was completed:

- Merged the white-label SkillSet SA training reporting demo into `main`.
- Pushed the latest `main` branch to GitHub.
- Verified the local static demo journey with `scripts/functional-demo-test.mjs`.
- Verified the live GitHub Pages assets and journey markers with the same test script.
- Removed the old ACSA-specific report export filename and replaced it with the neutral `wsp-atr-report-[date].csv` naming.
- Added demo freeze documentation, a production roadmap and a functional demo test log.
- Tagged the stable sales-demo release as `demo-sales-freeze-v1`.
- Captured a live homepage screenshot for release evidence.

Evidence files:

- `live-homepage-1365x1600.png`
- `../../FUNCTIONAL_DEMO_TEST_LOG_LIVE.md`
- `../../FUNCTIONAL_DEMO_TEST_LOG_LOCAL.md`
- `../../DEMO_RELEASE_FREEZE.md`
- `../../DEMO_FINISH_AND_PRODUCTION_ROADMAP.md`

Important boundary:

This remains a static, synthetic-data sales demo. It should now be used to secure a pilot client. The next product build should move into a governed Microsoft 365 backend with central data storage, permissions, evidence attachments, audit history and Power BI reporting.

Manual item still recommended:

- Record a short narrated walkthrough video using a screen recorder before a client meeting.
