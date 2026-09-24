/**
 * Read-only Agentforce/Flow action. Evaluates one or more Lead records without
 * returning lead names, email addresses, phone numbers, or customer notes.
 * No tasks, messages or Lead changes are created by this action.
 */
public with sharing class LeadResponseGuardAction {
    public class Request {
        @InvocableVariable(label='Lead ID' description='ID of the Lead to check' required=true)
        public Id leadId;
        @InvocableVariable(label='SLA hours' description='Hours allowed before a newly created Lead without a logged activity should be reviewed (default 24)')
        public Integer slaHours;
    }
    public class Result {
        @InvocableVariable(label='Lead ID')
        public Id leadId;
        @InvocableVariable(label='Review recommended')
        public Boolean reviewRecommended;
        @InvocableVariable(label='Reason')
        public String reason;
        @InvocableVariable(label='Next step')
        public String nextStep;
    }
    @InvocableMethod(label='Check lead follow-up gap' description='Read-only check for a Lead with no logged activity after a defined SLA. Never contacts a customer or creates a task.')
    public static List<Result> check(List<Request> requests) {
        List<Result> outputs = new List<Result>();
        if (requests == null || requests.isEmpty()) return outputs;
        Set<Id> ids = new Set<Id>();
        for (Request item : requests) {
            if (item != null && item.leadId != null && item.leadId.getSObjectType() == Lead.SObjectType) ids.add(item.leadId);
        }
        Map<Id, Lead> visible = new Map<Id, Lead>();
        if (!ids.isEmpty()) {
            try {
                // USER_MODE enforces record access, object permissions and field-level security.
                visible = new Map<Id, Lead>([
                    SELECT Id, CreatedDate, IsConverted, LastActivityDate
                    FROM Lead WHERE Id IN :ids WITH USER_MODE
                ]);
            } catch (QueryException ex) {
                // Do not return permission or query details to an AI agent.
                for (Request item : requests) {
                    Result result = new Result();
                    result.leadId = item == null ? null : item.leadId;
                    result.reviewRecommended = false;
                    result.reason = 'Unable to evaluate with current permissions.';
                    result.nextStep = 'Ask an authorized Salesforce user to review the Lead.';
                    outputs.add(result);
                }
                return outputs;
            }
        }
        for (Request item : requests) {
            Result result = new Result();
            result.leadId = item == null ? null : item.leadId;
            result.reviewRecommended = false;
            result.nextStep = 'No automated outreach. A person decides what to do next.';
            if (item == null || item.leadId == null || item.leadId.getSObjectType() != Lead.SObjectType || !visible.containsKey(item.leadId)) {
                result.reason = 'Lead not available to the current user.';
            } else {
                Lead record = visible.get(item.leadId);
                Integer hours = item.slaHours == null ? 24 : item.slaHours;
                if (hours < 1 || hours > 168) {
                    result.reason = 'SLA hours must be between 1 and 168.';
                } else if (record.IsConverted) {
                    result.reason = 'Converted Lead; no follow-up check needed.';
                } else if (record.LastActivityDate != null) {
                    result.reason = 'A logged activity exists; check its details with an authorized user.';
                } else {
                    Long ageMs = System.now().getTime() - record.CreatedDate.getTime();
                    if (ageMs >= ((Long) hours) * 3600000L) {
                        result.reviewRecommended = true;
                        result.reason = 'No logged activity and the Lead has passed the requested age threshold.';
                        result.nextStep = 'Ask the authorized owner to confirm whether follow-up is needed.';
                    } else {
                        result.reason = 'The age threshold has not been reached.';
                    }
                }
            }
            outputs.add(result);
        }
        return outputs;
    }
}
