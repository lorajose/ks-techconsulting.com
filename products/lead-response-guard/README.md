# Lead Response Guard — Agentforce action prototype

A deterministic, read-only Apex action that flags *potential* lead follow-up gaps for an authorized Salesforce user. It is a component candidate for AgentExchange, not an installable/released package or a complete Agentforce agent.

## What it does

- Receives one or more Lead IDs and an SLA threshold (default 24 hours).
- Checks whether each unconverted Lead is old enough and has no logged activity (`LastActivityDate == null`).
- Returns a reason and a recommendation for human review. It never sends email, updates Leads, creates tasks, or makes a claim that no contact occurred outside Salesforce.
- Uses `with sharing` and `WITH USER_MODE`; does not return names, emails, phone numbers or notes. Respect the agent user's Lead permissions and test access in the subscriber org.

## Validate in an authorized Salesforce development org

1. Confirm API version, Salesforce edition, Lead availability and Agentforce entitlement. Configure a namespaced Agentforce-enabled scratch org before packaging. Do not place org credentials in Git.
2. From this directory, deploy source to the org with `sf project deploy start --target-org <alias>` and run `sf apex run test --tests LeadResponseGuardActionTest --target-org <alias> --wait 10`.
3. In Agentforce Builder, create an action from the invocable method. Limit it to authenticated staff, and instruct it to ask for a Lead ID; never run broad searches or trigger outreach. Test permission denial, converted Leads, duplicates, 24-hour boundaries and orgs that customize Lead Status.
4. Decide how to measure real follow-up: `LastActivityDate` omits off-platform contacts and does not prove first response time. For production, define a timestamped event or audited SLA record with customer-approved definitions, deduplication, exceptions and retention.
5. After testing, configure partner Dev Hub + namespace, register Agentforce action metadata in Asset Library, generate/test an agent template if needed, create a managed 2GP version, scan and submit to AgentExchange security review. The customer needs a compatible Salesforce/Agentforce setup and product licensing.

**Do not publish this as a verified customer case or as an installable package until deployed and tested in Salesforce.**
