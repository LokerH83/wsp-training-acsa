# Demo Runbook

## 1. Static Demo

Open:

```text
https://lokerh83.github.io/wsp-training-acsa/
```

Suggested flow:

1. Load the dashboard.
2. Use the provided sample workbook if needed.
3. Show staged data, people profiles, training plans, and reporting.
4. Keep this part short; it is the polished visual front door.

## 2. GitHub Actions Proof

Open:

```text
https://github.com/LokerH83/wsp-training-acsa/actions
```

Point to the green run:

```text
Retry transient Power Platform solution import
```

Known good run:

```text
Import Verified Power Apps Export #24
Commit 59860d6
```

## 3. Power Apps Proof

Open Power Apps in Hayden Loker's Environment.

Direct app link:

```text
https://org4339676.crm4.dynamics.com/main.aspx?appid=0b94dd22-cd76-f111-ab0e-7ced8d71933e
```

Show:

1. Solution `WSP Training Management System`.
2. App `The About WSP Training Management System`.
3. `Employee Profiles` table/view.
4. One employee profile record opening successfully.

## 4. Fallback If The Live Import Is Slow

Use the existing green run and the opened Power Apps app as proof. The import has already succeeded, so the demo does not need a fresh import unless the audience specifically asks to see automation run live.

## 5. What To Avoid During The Demo

- Do not import the draft `with_entities` ZIP.
- Do not edit production-like data.
- Do not promise official SETA or B-BBEE outputs.
- Do not spend time inside old export/archive folders.
