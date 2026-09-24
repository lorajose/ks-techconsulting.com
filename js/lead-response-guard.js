(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const evaluate = () => {
    const age = Number(byId('age').value);
    const sla = Number(byId('sla').value);
    let title;
    let detail;
    if (!Number.isInteger(age) || age < 0 || age > 720 || !Number.isInteger(sla) || sla < 1 || sla > 168) {
      title = 'Check the sample numbers';
      detail = 'Enter 0–720 hours for age and 1–168 hours for the follow-up threshold.';
    } else if (byId('converted').value === 'yes') {
      title = 'No review from this rule';
      detail = 'This Lead is marked converted. A separate process may track its next stage.';
    } else if (byId('activity').value === 'yes') {
      title = 'Check the existing activity';
      detail = 'An activity is logged. A person can confirm whether it counts as the first response.';
    } else if (age >= sla) {
      title = 'Review recommended';
      detail = `This sample is ${age} hours old and has no logged activity after the ${sla}-hour threshold. Ask an authorized owner to verify follow-up.`;
    } else {
      title = 'Threshold not reached';
      detail = `This sample is ${age} hours old; the configured threshold is ${sla} hours.`;
    }
    byId('result-title').textContent = title;
    byId('result-detail').textContent = detail;
  };
  byId('evaluate').addEventListener('click', evaluate);
  evaluate();
})();
