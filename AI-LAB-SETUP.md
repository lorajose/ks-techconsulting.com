# Interactive AI lab: deployment and operations

Deploy `ai-lab.html`, `js/ai-lab.js`, `ai-demo.php` and the updated navigation files together. The four sample scenarios run in the visitor's browser immediately. The sample dashboard uses fictional statuses; it has no live Salesforce, MuleSoft, POS, Agentforce or knowledge-base connection.

## Enable custom AI analysis (optional)

1. Set up a billed OpenAI API account and set a budget in its dashboard. Create an API key with the minimum access needed for Responses.
2. In cPanel File Manager, create `/home/oblm9wnyeimr/ks-leads/openai-api-key.txt` (outside the website directory). Paste only the key, on one line; save and set permissions to `600`. Do not add the key to GitHub, HTML, browser scripts, screenshots or support emails. This is a separate file from `resend-api-key.txt`.
3. Verify PHP 8+ and cURL are enabled. Submit a brief fictional problem on `/ai-lab.html`, tick the notice and check for the “AI-generated analysis” label. If the provider is unavailable or the key is missing, visitors see a clearly labelled sample instead.

The PHP endpoint sends submitted problem text to OpenAI using `store:false`; review the provider's data controls and your own privacy notice before activating it for visitors. Visitors are asked not to enter secrets or customer records. The app does not save problem text or send it to the lead inbox. A per-IP hourly count (maximum five requests) lives in private files in `ks-leads`; these files may be periodically removed after their hour expires. An API budget remains important even with this limit.

Never represent this demonstration as an actual audit, production integration, guarantee of results or verification of data security. Real implementation requires approved access, a data flow review, human oversight and testing in the customer's environment.
