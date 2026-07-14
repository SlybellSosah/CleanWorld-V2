# BLAST + SDD Feature Checklist

## 🔍 Phase 1: Pre-Development Governance (The "Go/No-Go" Gate)
- [ ] **Problem Definition**: Is the core problem clearly defined?
- [ ] **Folder Structure**: Are structural choices saved under `/architecture/` (e.g. `blueprint.md`)?
- [ ] **Linux/Security Alignment**: Does this follow Linux-native path practices, avoid hardcoded secrets, and adhere to least privilege?
- [ ] **Ambiguity Check**: Have all undefined requirements been resolved via Spec Clarification?
- [ ] **Tools Directory Context**: Are helper scripts or standalone CLI tools placed in `/tools/`?

## 🏗️ Phase 2: Specification & Contract (SDD Initial State)
- [ ] **Check Existing Specs**: Search `/specs/` for an existing specification.
- [ ] **Define Status**: Identify the status (`draft` | `approved` | `amended` | `implemented`).
- [ ] **Draft/Update Spec**: Create/update `/specs/view-name.md` following the SDD template (Dependencies, Inputs, Process, Outputs).
- [ ] **Technical Spec**: Ensure data flow, component boundaries, and state management strategies are documented.

## 🛑 Phase 3: Execution & Implementation
- [ ] **Mandatory Pause**: Halt implementation until the technical contract (the spec) is approved.
- [ ] **Type Safety**: Generate strict type definitions (`src/types.ts`) directly from the spec shapes.
- [ ] **Process Discipline**: Implement process steps in chronological order.
- [ ] **Test Alignment**: Write exactly one test or validation check per critical edge case.
- [ ] **Automate**: Run CLI seed/audit scripts via `/tools/` to validate database structures.
- [ ] **Verify/Launch**: Complete the checklist, mark spec as `implemented`, and verify all edge cases.