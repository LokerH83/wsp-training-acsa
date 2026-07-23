# WSP Demo 9.5 Visual Lift — 2026-07-23

## Purpose

Lift the static WSP / ATR demo closer to the visual and commercial standard already set by the SkillSet SA website and the Reporting Rescue Scanner.

The goal is not to pretend this is a finished SaaS platform. The goal is to make the GitHub Pages demo strong enough to sell the idea, explain the Microsoft 365 pilot path, and show how a client workbook can become a controlled training reporting workflow.

## What changed

- Reframed the app as the **SkillSet SA WSP / ATR Command Centre**.
- Rewrote the hero and workbook-import wording around workbook intake, diagnostic control, operational workflow and Microsoft 365 production migration.
- Added a four-step product path below the hero:
  - Workbook intake
  - Diagnostic control
  - Operational workflow
  - Microsoft 365 pilot
- Added a final CSS visual lift that makes the demo feel closer to the SkillSet website/scanner:
  - deep green SkillSet background
  - subtle grid structure
  - gold active states
  - cleaner DM Sans typography
  - stronger panel hierarchy
  - more polished sidebar and workbook-scanner area
  - clearer diagnostic cards for stable, problematic and process-risk signals
- Cache-busted CSS and JavaScript references so the live GitHub Pages version pulls the latest assets.

## What this still is

This remains a **static sales demo**.

It can inspect local files in the browser and demonstrate the workflow, but a production client version should be built on a governed backend such as:

- SharePoint Lists or Dataverse for records
- SharePoint document libraries for evidence
- Power Automate for workflow and approvals
- Power BI for management reporting
- Microsoft 365 authentication and permissions

## Validation checklist

Run these checks after changes:

```powershell
$repo = "C:\Users\ThinkPad P1\OneDrive\Documents\GitHub\skillset-wsp-demo"
$node = "C:\Users\ThinkPad P1\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$git = "C:\Users\ThinkPad P1\AppData\Local\GitHubDesktop\app-3.6.2\resources\app\git\cmd\git.exe"
Set-Location $repo
& $node --check app.js
& $node --check client-config.js
& $git diff --check
& $node .\scripts\static-smoke.mjs
& $node .\scripts\functional-demo-test.mjs
```

## Owner note

This version should now be treated as a sharper sales asset. If the next step is a real client pilot, avoid adding more pretend production features to the static demo. Build the production version inside the client-controlled Microsoft 365 environment.
