# Submission Workspace

## Purpose

The Submission Workspace converts the demo's automated data-quality findings into a controlled human review process. It is the bridge between detecting a problem and deciding whether the reporting pack is ready to proceed.

## Operating flow

1. Load or stage the active demo dataset.
2. Review the Data Quality Centre score and categories.
3. Open a category in the Submission Workspace.
4. Assign every material finding to an owner.
5. Set a due date and record the remediation status.
6. Add the evidence or reference used to close the finding.
7. Record management sign-off.
8. Export the action register and Readiness Pack for controlled review.

## Gate rules

| Gate | Rule | Meaning |
| --- | --- | --- |
| `HOLD` | One or more unresolved `High` findings | Do not proceed until corrected or formally accepted as an exception. |
| `CONDITIONAL` | No unresolved `High` findings, but unresolved `Medium` or `Low` findings remain | Management conditions must be recorded before proceeding. |
| `READY` | Every finding is `Resolved` or `Accepted exception` | The action register is closed, subject to human approval and evidence review. |

The score is a data-quality indicator, not legal, SETA, B-BBEE or statutory certification.

## Stored fields

Each finding has a deterministic issue ID plus:

- category and severity
- finding title and source location
- system recommendation
- owner
- due date
- status
- evidence/reference note

The sign-off record stores the decision, approver, decision date and conditions/notes.

## Exports

- **Action Register CSV**: Excel-ready operational register of every current finding.
- **Submission Readiness Pack**: standalone print-ready HTML containing the gate, score, action register and sign-off record. Open it in a browser and print to PDF when a fixed document is required.

## Demo and production boundary

The public static app stores data in the browser using `localStorage`. It does not send data to a server and must use synthetic or client-approved demo data only.

The production Microsoft implementation should map:

- findings and actions to Dataverse or a governed SharePoint list;
- evidence references to SharePoint document libraries;
- ownership to Microsoft Entra users;
- due-date reminders and approvals to Power Automate;
- management reporting to Power BI;
- access control and audit history to the approved production security model.

## Acceptance checks

- Issue IDs remain stable when the same dataset is reloaded.
- Owner, due date, status and evidence persist after refresh.
- Filters do not change the underlying gate calculation.
- `HOLD`, `CONDITIONAL` and `READY` follow the documented rules.
- CSV opens in Excel with one row per finding.
- Readiness Pack reflects the current action and sign-off state.
