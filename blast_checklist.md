# BLAST + SDD Feature Checklist

## Phase 1: Pre-Development Governance (The "Go/No-Go" Gate)

- [x] **Problem Definition**: Is the core problem clearly defined?
- [x] **Folder Structure**: Are structural choices saved under [`architecture/blueprint.md`](architecture/blueprint.md)?
- [x] **Linux/Security Alignment**: Does this follow Linux-native path practices, avoid hardcoded secrets, and adhere to least privilege?
- [x] **Ambiguity Check**: Have all undefined requirements been resolved via Spec Clarification?
- [x] **Tools Directory Context**: Are helper scripts or standalone CLI tools placed in [`tools/`](tools/)?

## Phase 2: Specification & Contract (SDD Initial State)

- [x] **Check Existing Specs**: Search [`specs/`](specs/) for an existing specification.
- [x] **Define Status**: Identify the status (`draft` | `approved` | `amended` | `implemented`).
- [x] **Draft/Update Spec**: Create/update `specs/<feature>.md` including Problem Statement, Goals & Non-Goals, Alternatives Considered, Risks & Limits, Dependencies, Inputs, Process, Outputs, and Edge Cases.
- [x] **Technical Spec**: Ensure data flow, component boundaries, and state management strategies are documented.

## Phase 3: Execution & Implementation

- [x] **Contract Approval**: Confirm specification approval (or owner standing auto-approve) before shipping.
- [x] **Type Safety**: Maintain strict type definitions ([`src/types.ts`](src/types.ts)) matching [`project.md`](project.md).
- [x] **Process Discipline**: Implement process steps in chronological order.
- [x] **Test Alignment**: Write at least one automated test per critical edge case.
- [x] **Automate**: Validate migrations and post-build outputs via [`tools/`](tools/) and npm scripts.
- [x] **Verify/Launch**: Complete checklists, mark specs `implemented`, and verify all edge cases.
