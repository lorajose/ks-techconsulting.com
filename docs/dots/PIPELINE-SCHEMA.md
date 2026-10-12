# KS Sales Dot — Pipeline Schema

## Purpose

This is the shared source-of-truth structure for opportunity tracking. Every deal must have a next action and a next-action date unless it is Closed Won, Closed Lost, or Nurture.

## Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| opportunity_id | text | yes | `KS-YYYY-NNN` |
| source | text | yes | RFP, referral, marketplace, partner, inbound, public research, etc. |
| company | text | yes | Buyer or prime contractor |
| website | URL | when known | Canonical company URL |
| contact | text | when known | Named contact only when grounded |
| contact_role | text | when known | Verified or clearly labeled inferred role |
| opportunity | text | yes | Short opportunity description |
| service | enum | yes | Salesforce, Website, Shopify, Node/API, AI Automation, Other Approved |
| estimated_value | currency/range | when supportable | Never invent budget; use KS internal estimate only when clearly labeled |
| ks_score | integer | yes | 0–100 |
| priority | enum | yes | A, B, C, DROP |
| stage | enum | yes | See stage definitions below |
| last_contact | datetime | when applicable | |
| next_action | text | yes for active deals | Concrete action, not "follow up eventually" |
| next_action_date | date/datetime | yes for active deals | |
| decision_deadline | date | when known | Buyer deadline, bid deadline, or internal target |
| buyer_pain_trigger | text | when known | Evidence-backed problem or trigger |
| ks_fit | text | yes | Why KS is credible for this work |
| risks_unknowns | text | yes | Missing scope, budget, authority, insurance, etc. |
| approval_status | enum | yes | NOT_REQUIRED, READY_FOR_APPROVAL, APPROVED, REJECTED, MODIFICATION_REQUESTED |
| source_links | list | yes | Grounding links / records |
| notes | text | optional | |

## Stages

- DISCOVERED — found but not yet qualified
- QUALIFIED — meets minimum fit threshold
- RESEARCHED — buyer/problem path sufficiently understood
- OUTREACH_READY — personalized outbound prepared
- CONTACTED — initial outreach sent
- REPLIED — prospect responded
- DISCOVERY — active scope/need qualification
- PROPOSAL_READY — proposal awaiting approval or final data
- PROPOSAL_SENT — buyer has proposal
- NEGOTIATION — active commercial discussion
- VERBAL_YES — expressed intent but commercial commitment not yet grounded
- CLOSED_WON — signed/accepted/PO/deposit/explicit commercial commitment
- CLOSED_LOST — confirmed loss/no-fit
- NURTURE — not actionable now but worth revisiting

## Data Quality Rules

1. Never fabricate a contact, email, phone, budget, deadline, requirement, certification, or buyer intent.
2. Distinguish an external fact from an internal KS estimate.
3. Every score must be explainable from the evidence available.
4. Every active deal must have one owner: `KS Sales Dot`, unless Jose explicitly reassigns it.
5. Every active deal must have a next action and date.
6. A deal cannot enter PROPOSAL_SENT without approval when the proposal contains price, scope, delivery commitment, or commercial terms.
7. A deal cannot enter CLOSED_WON based only on a meeting, positive reply, recruiter submission, proposal submission, or verbal interest.

## First Closed Won Dashboard

Until the first Closed Won, the status view should always surface:
- days remaining to November 1, 2026;
- total qualified pipeline;
- number of Priority A deals;
- proposals ready for approval;
- proposals sent;
- negotiations;
- closest deal to Closed Won;
- the single highest-leverage action today.