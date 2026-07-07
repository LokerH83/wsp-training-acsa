# Tier 3: Missing Entities Design Spec

This document defines the three missing Dataverse tables required to complete the Tier 3 app: Evidence, Review Item, and Booking. It includes fields, relationships, business rules, model-driven form guidance, and minimal XML snippets (skeletons) to help create/import the metadata.

## Goals
- Provide a clear, importable specification for each table.
- Capture required fields, lookups, and status flows.
- Provide both Maker-UI steps and minimal XML skeletons for solution authors.

---

## 1) Evidence

- Logical name: `cr075_evidence`
- Display name: Evidence
- Primary name field: `cr075_evidenceid` (Auto-number or GUID) and `cr075_name` (Single line)

Fields:
- `cr075_name` (Single Line, required) — short title
- `cr075_description` (Multiple Lines) — details about the evidence
- `cr075_evidencetype` (Choice) — e.g., Document, Image, Link, Transcript
- `cr075_status` (Choice) — Draft, Submitted, Accepted, Rejected
- `cr075_file` (File/Attachment) — uploaded file reference
- `cr075_link` (URL) — external link if evidence stored externally
- `cr075_submittedon` (DateTime) — when evidence uploaded
- `cr075_submittedby` (Lookup -> systemuser/contact) — uploader
- `cr075_employeetrainingrecordid` (Lookup -> ssa_employeetrainingrecord) — parent ATR

Relationships:
- N:1 `cr075_evidence` -> `ssa_employeetrainingrecord` (cr075_employeetrainingrecordid)
- N:1 `cr075_evidence` -> `systemuser` (cr075_submittedby)

Business rules / Flows:
- When `cr075_status` set to Submitted, set `cr075_submittedon` to now and notify ATR owner.
- When `cr075_status` becomes Accepted, update ATR evidence summary field (aggregate accepted count).

Model-driven form notes:
- Form sections: Summary (name, type, status), File/Link, Related ATR, Audit (submitted on/by).

Minimal customizations.xml snippet (EntityMetadata skeleton):

```xml
<EntityMetadata LogicalName="cr075_evidence" SchemaName="cr075_Evidence">
  <DisplayName><LocalizedLabel Description="Evidence" Label="Evidence" /></DisplayName>
  <PrimaryNameAttribute>cr075_name</PrimaryNameAttribute>
  <Attributes>
    <!-- SingleLine, Multiline, Choice, Lookup attribute definitions go here -->
  </Attributes>
  <OneToManyRelationships />
  <ManyToOneRelationships />
</EntityMetadata>
```

---

## 2) Review Item

- Logical name: `cr075_reviewitem`
- Display name: Review Item
- Primary name field: `cr075_name`

Fields:
- `cr075_name` (Single Line, required) — short title
- `cr075_description` (Multiple Lines)
- `cr075_type` (Choice) — e.g., Evidence Review, ATR Review, Quality Check
- `cr075_status` (Choice) — Pending, In Review, Approved, Rejected
- `cr075_assignedto` (Lookup -> systemuser/team)
- `cr075_due` (DateTime)
- `cr075_relatedevidenceid` (Lookup -> cr075_evidence) — optional
- `cr075_relatedatrid` (Lookup -> ssa_employeetrainingrecord)

Relationships:
- N:1 `cr075_reviewitem` -> `cr075_evidence` (cr075_relatedevidenceid)
- N:1 `cr075_reviewitem` -> `ssa_employeetrainingrecord`

Business rules / Flows:
- On creation if type = Evidence Review, require `cr075_relatedevidenceid`.
- When status set to Approved/Rejected, create an activity (email/notes) and update linked ATR status if needed.

Minimal customizations.xml snippet:

```xml
<EntityMetadata LogicalName="cr075_reviewitem" SchemaName="cr075_ReviewItem">
  <DisplayName><LocalizedLabel Label="Review Item" /></DisplayName>
  <PrimaryNameAttribute>cr075_name</PrimaryNameAttribute>
  <Attributes />
</EntityMetadata>
```

---

## 3) Booking

- Logical name: `cr075_booking`
- Display name: Booking
- Primary name field: `cr075_name` (Auto-generated like "Booking #1234")

Fields:
- `cr075_name` (Single Line) — Booking reference
- `cr075_status` (Choice) — Requested, Planned, Booked, Cancelled, Completed
- `cr075_start` (DateTime)
- `cr075_end` (DateTime)
- `cr075_location` (Single Line or Lookup to Location table)
- `cr075_resource` (Lookup -> systemuser/team/Facility) — who/what is booked
- `cr075_employeetrainingrecordid` (Lookup -> ssa_employeetrainingrecord)
- `cr075_approvedby` (Lookup -> systemuser)

Relationships:
- N:1 `cr075_booking` -> `ssa_employeetrainingrecord`

Business rules / Flows:
- Status transition flow: Requested -> Planned -> Booked -> Completed. Enforce transitions via Power Automate or business rule.
- On Booked: notify attendees and update ATR (training scheduled flag).
- On Cancelled: free up resource, send notifications.

Minimal customizations.xml snippet:

```xml
<EntityMetadata LogicalName="cr075_booking" SchemaName="cr075_Booking">
  <DisplayName><LocalizedLabel Label="Booking" /></DisplayName>
  <PrimaryNameAttribute>cr075_name</PrimaryNameAttribute>
  <Attributes />
</EntityMetadata>
```

---

## Maker UI: Quick creation checklist (per table)

1. Open Power Apps Maker portal and your solution.
2. Click New -> Table.
3. Enter Display name and Primary name. Uncheck "Add to site map" initially.
4. Add columns exactly as specified above (choose data types and options).
5. Add lookups: create Relationship -> Many-to-one -> target entity (e.g., ssa_employeetrainingrecord).
6. Publish the table and add to the solution. Export solution for source control.

Notes: create choice sets centrally (e.g., `cr075_status` choices shared across tables where applicable).

## Next steps and deliverables I can produce now
- Expand the XML snippets into full `customizations.xml` EntityMetadata entries you can merge into the exported solution.
- Generate Power Platform CLI commands or example Web API calls to create these tables.
- Create an importable solution folder structure with minimal `solution.xml` and `customizations.xml` entries for you to merge.

If you want me to proceed, I'll generate the importable solution XML snippets and a small script to merge them into your existing `WSPTrainingManagementSystem_complete_solution.zip` (or produce step-by-step Maker-UI screenshots/instructions).
