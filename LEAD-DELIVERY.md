# Private lead email configuration

All website consultation forms submit to `lead-capture.php`. The visible contact address and the email sender stay at `klora@ks-techconsulting.com`.

To send notifications to a private inbox, create this server-side text file **outside the website directory**:

`/home/oblm9wnyeimr/ks-leads/lead-recipient.txt`

Put exactly one destination email address in the file. Do not add quotes or other text. Use cPanel File Manager or SSH to create the directory and file. Limit file permissions to the cPanel account (for example, directory `700` and file `600`). This directory also holds private lead logs. The site deployment copies files only into `/home/oblm9wnyeimr/ks-techconsulting.com/`, so it will not overwrite this private file.

If the file is missing or contains an invalid address, requests go to the company inbox instead. After setting the file, submit a clearly marked test inquiry through the public website and confirm delivery in the intended inbox, including Spam. PHP accepting the message does not prove inbox delivery.

Never commit the private file or a personal address to this repository.
