@IsTest
private class LeadResponseGuardActionTest {
    @IsTest static void flagsOldUncontactedLeadAndPreservesOrder() {
        Lead oldLead = new Lead(LastName='Example', Company='Fictional Company');
        insert oldLead;
        Test.setCreatedDate(oldLead.Id, System.now().addHours(-48));
        Lead recentLead = new Lead(LastName='Example 2', Company='Fictional Company');
        insert recentLead;
        LeadResponseGuardAction.Request oldRequest = new LeadResponseGuardAction.Request();
        oldRequest.leadId = oldLead.Id;
        oldRequest.slaHours = 24;
        LeadResponseGuardAction.Request recentRequest = new LeadResponseGuardAction.Request();
        recentRequest.leadId = recentLead.Id;
        List<LeadResponseGuardAction.Result> results = LeadResponseGuardAction.check(new List<LeadResponseGuardAction.Request>{recentRequest, oldRequest});
        System.assertEquals(2, results.size());
        System.assertEquals(recentLead.Id, results[0].leadId);
        System.assertEquals(false, results[0].reviewRecommended);
        System.assertEquals(oldLead.Id, results[1].leadId);
        System.assertEquals(true, results[1].reviewRecommended);
    }
    @IsTest static void rejectsInvalidThresholdAndInvalidIds() {
        Lead leadRecord = new Lead(LastName='Example', Company='Fictional Company');
        insert leadRecord;
        LeadResponseGuardAction.Request invalidThreshold = new LeadResponseGuardAction.Request();
        invalidThreshold.leadId = leadRecord.Id;
        invalidThreshold.slaHours = -1;
        LeadResponseGuardAction.Request invalidId = new LeadResponseGuardAction.Request();
        invalidId.leadId = UserInfo.getUserId();
        List<LeadResponseGuardAction.Result> results = LeadResponseGuardAction.check(new List<LeadResponseGuardAction.Request>{invalidThreshold, invalidId});
        System.assertEquals(false, results[0].reviewRecommended);
        System.assert(results[0].reason.contains('between 1 and 168'));
        System.assertEquals(false, results[1].reviewRecommended);
        System.assertEquals('Lead not available to the current user.', results[1].reason);
    }
}
