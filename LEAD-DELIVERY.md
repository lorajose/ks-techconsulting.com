# Private lead email configuration

All website consultation forms submit to `lead-capture.php`. The visible contact address and the email sender stay at `klora@ks-techconsulting.com`.

To send notifications to a private inbox, create this server-side text file **outside the website directory**:

`/home/oblm9wnyeimr/ks-leads/lead-recipient.txt`

Put exactly one destination email address in the file. Do not add quotes or other text. Use cPanel File Manager or SSH to create the directory and file. Limit file permissions to the cPanel account (for example, directory `700` and file `600`). This directory also holds private lead logs. The site deployment copies files only into `/home/oblm9wnyeimr/ks-techconsulting.com/`, so it will not overwrite this private file.

If the file was initially created in the website directory, the next deployment moves it to the private location **before** copying website files. The deployment stops if it cannot find the file in either location or if both copies exist, so no ambiguous recipient is used. A separate Apache rule denies web access to that filename as an additional precaution.

If the file is missing or contains an invalid address, requests go to the company inbox instead. After setting the file, submit a clearly marked test inquiry through the public website and confirm delivery in the intended inbox, including Spam. PHP accepting the message does not prove inbox delivery.

Never commit the private file or a personal address to this repository.

## Reliable notification delivery with Resend

The hosting `mail()` function can return success without Gmail receiving the message. The website supports Resend's HTTPS email API so every accepted notification has an email ID that can be checked in the Resend dashboard. The private server log remains the backup for submitted requests.

1. Create a Resend account and add **`notify.ks-techconsulting.com`** as a sending domain. Add the exact verification DNS records shown by Resend at the domain's DNS provider and wait for the domain to show **Verified**. Do not change the existing website records or the root domain's incoming MX records.
2. Create a Resend API key with permission to send email from this domain. In cPanel File Manager, under `/home/oblm9wnyeimr/ks-leads/`, create `resend-api-key.txt` containing only that key. Set file permissions to `600`. Keep this file outside `/home/oblm9wnyeimr/ks-techconsulting.com/`. Never paste the key into chat, GitHub, a screenshot, or a website form.
3. Submit one clearly marked test consultation. The notification will be sent from `leads@notify.ks-techconsulting.com` to the existing address in `lead-recipient.txt`; replies go to the person who submitted the form. Confirm the message in the recipient inbox and in the Resend dashboard. The private `lead-capture-submissions.log` records `Delivery: Resend API accepted / ID: ...` when the API accepts it. API acceptance does not guarantee final inbox placement: check the dashboard for the final delivery event.

If the key file is not present, the site continues using the hosting `mail()` function. If the Resend API is configured but rejects a request, the form still saves the lead in the private log and shows a recorded status rather than claiming an email notification was sent. Check PHP error logs for the HTTP status and Resend dashboard for the detailed reason. The website must have PHP cURL enabled and allow HTTPS connections to `api.resend.com`.
