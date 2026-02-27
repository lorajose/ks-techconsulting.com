<?php
declare(strict_types=1);

$recipientEmail = 'klora@ks-techconsulting.com';
$senderEmail = 'klora@ks-techconsulting.com';
$defaultReturnUrl = 'index.html';
$siteName = 'KS Tech Consulting';
$logFilePath = __DIR__ . DIRECTORY_SEPARATOR . 'lead-capture-submissions.log';

$fieldLabels = [
    'form_name' => 'Form Name',
    'source_page' => 'Source Page',
    'name' => 'Full Name',
    'email' => 'Work Email',
    'company' => 'Company or Agency',
    'interest' => 'Primary Interest',
    'project_type' => 'Project Type',
    'timeline' => 'Timeline',
    'engagement_type' => 'Engagement Type',
    'organization_type' => 'Organization Type',
    'budget' => 'Estimated Budget',
    'phone' => 'Phone',
    'capability_statement' => 'Capability Statement Request',
    'goals' => 'Project Goals',
];

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function cleanText(?string $value): string
{
    $value = trim((string) $value);
    $value = str_replace(["\r", "\n", "\t"], ' ', $value);
    $value = preg_replace('/\s+/', ' ', $value);

    return trim(strip_tags((string) $value));
}

function cleanMultiline(?string $value): string
{
    $value = trim((string) $value);
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace("/\n{3,}/", "\n\n", $value);

    return trim(strip_tags((string) $value));
}

function normalizeReturnUrl(?string $value, string $fallback): string
{
    $candidate = trim((string) $value);

    if ($candidate === '') {
        return $fallback;
    }

    $parts = parse_url($candidate);

    if ($parts === false || isset($parts['scheme']) || isset($parts['host'])) {
        return $fallback;
    }

    if (!preg_match('/^[A-Za-z0-9._\\/-]*(?:\\?[A-Za-z0-9=&._%\\-]*)?(?:#[A-Za-z0-9_\\-]*)?$/', $candidate)) {
        return $fallback;
    }

    return $candidate;
}

function appendSubmissionLog(string $path, string $subject, string $body): bool
{
    $entry = str_repeat('=', 72) . "\r\n";
    $entry .= 'Logged At: ' . date('c') . "\r\n";
    $entry .= 'Subject: ' . $subject . "\r\n\r\n";
    $entry .= $body;
    $entry .= "\r\n";

    return @file_put_contents($path, $entry, FILE_APPEND | LOCK_EX) !== false;
}

function renderStatusPage(
    string $status,
    string $title,
    string $message,
    array $details,
    string $returnUrl
): void {
    http_response_code($status === 'success' ? 200 : ($status === 'error' ? 400 : 200));

    $isSuccess = $status === 'success';
    $cardBorder = $isSuccess ? '#0c8b84' : ($status === 'error' ? '#c2410c' : '#2563eb');
    $badgeBackground = $isSuccess ? '#dcfce7' : ($status === 'error' ? '#ffedd5' : '#dbeafe');
    $badgeColor = $isSuccess ? '#166534' : ($status === 'error' ? '#9a3412' : '#1d4ed8');
    $buttonBackground = $isSuccess ? '#0c8b84' : '#0d1b3e';

    echo '<!DOCTYPE html>';
    echo '<html lang="en">';
    echo '<head>';
    echo '    <meta charset="utf-8">';
    echo '    <meta name="viewport" content="width=device-width, initial-scale=1.0">';
    echo '    <title>Lead Capture | KS Tech Consulting</title>';
    echo '    <style>';
    echo '        :root { color-scheme: light; }';
    echo '        * { box-sizing: border-box; }';
    echo '        body { margin: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #0d1b3e, #13315c); color: #0f172a; }';
    echo '        .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 32px 20px; }';
    echo '        .card { width: min(680px, 100%); background: #ffffff; border-radius: 24px; padding: 32px; border-top: 6px solid ' . escapeHtml($cardBorder) . '; box-shadow: 0 20px 50px rgba(15, 23, 42, 0.24); }';
    echo '        .badge { display: inline-block; padding: 8px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: ' . escapeHtml($badgeBackground) . '; color: ' . escapeHtml($badgeColor) . '; }';
    echo '        h1 { margin: 18px 0 12px; font-size: clamp(28px, 4vw, 40px); line-height: 1.1; color: #0f172a; }';
    echo '        p { margin: 0; font-size: 16px; line-height: 1.7; color: #334155; }';
    echo '        .meta { margin-top: 22px; padding: 18px 20px; border-radius: 18px; background: #f8fafc; border: 1px solid #e2e8f0; }';
    echo '        .meta h2 { margin: 0 0 12px; font-size: 15px; color: #0f172a; }';
    echo '        .meta ul { margin: 0; padding-left: 18px; color: #475569; }';
    echo '        .meta li { margin-bottom: 8px; line-height: 1.5; }';
    echo '        .actions { margin-top: 26px; display: flex; flex-wrap: wrap; gap: 12px; }';
    echo '        .btn { display: inline-block; padding: 13px 18px; border-radius: 999px; text-decoration: none; font-weight: 700; }';
    echo '        .btn-primary { background: ' . escapeHtml($buttonBackground) . '; color: #ffffff; }';
    echo '        .btn-secondary { border: 1px solid #cbd5e1; color: #0f172a; background: #ffffff; }';
    echo '        .footnote { margin-top: 18px; font-size: 13px; color: #64748b; }';
    echo '    </style>';
    echo '</head>';
    echo '<body>';
    echo '    <main class="wrap">';
    echo '        <section class="card">';
    echo '            <span class="badge">' . escapeHtml(strtoupper($status)) . '</span>';
    echo '            <h1>' . escapeHtml($title) . '</h1>';
    echo '            <p>' . escapeHtml($message) . '</p>';

    if ($details !== []) {
        echo '            <div class="meta">';
        echo '                <h2>Submission Details</h2>';
        echo '                <ul>';

        foreach ($details as $item) {
            echo '                    <li>' . escapeHtml($item) . '</li>';
        }

        echo '                </ul>';
        echo '            </div>';
    }

    echo '            <div class="actions">';
    echo '                <a class="btn btn-primary" href="' . escapeHtml($returnUrl) . '">Return to Website</a>';
    echo '                <a class="btn btn-secondary" href="contact.html">Open Contact Page</a>';
    echo '            </div>';
    echo '            <p class="footnote">If the issue persists, email ' . escapeHtml($GLOBALS['recipientEmail']) . ' directly and include your project scope.</p>';
    echo '        </section>';
    echo '    </main>';
    echo '</body>';
    echo '</html>';
}

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($requestMethod !== 'POST') {
    renderStatusPage(
        'info',
        'Lead Capture Endpoint',
        'This page processes consultation requests submitted from the website forms.',
        ['Submit the form from the page where your inquiry started.'],
        $defaultReturnUrl
    );
    exit;
}

$returnUrl = normalizeReturnUrl($_POST['return_url'] ?? '', $defaultReturnUrl);
$formName = cleanText($_POST['form_name'] ?? 'Website Lead Form');
$sourcePage = cleanText($_POST['source_page'] ?? $returnUrl);
$name = cleanText($_POST['name'] ?? '');
$email = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_SANITIZE_EMAIL);
$company = cleanText($_POST['company'] ?? '');
$interest = cleanText($_POST['interest'] ?? '');
$projectType = cleanText($_POST['project_type'] ?? '');
$honeypot = trim((string) ($_POST['website'] ?? ''));

if ($honeypot !== '') {
    renderStatusPage(
        'success',
        'Request Received',
        'Your request was received successfully.',
        ['A member of the KS Tech Consulting team will review it shortly.'],
        $returnUrl
    );
    exit;
}

$errors = [];

if ($name === '') {
    $errors[] = 'Full name is required.';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid work email is required.';
}

if ($company === '') {
    $errors[] = 'Company or agency is required.';
}

if ($interest === '' && $projectType === '') {
    $errors[] = 'Please select a primary interest or project type.';
}

if ($errors !== []) {
    renderStatusPage(
        'error',
        'We Could Not Submit Your Request',
        'Please correct the issues below and submit the form again.',
        $errors,
        $returnUrl
    );
    exit;
}

$submittedAt = date('F j, Y g:i A T');
$ipAddress = cleanText($_SERVER['REMOTE_ADDR'] ?? 'Unknown');
$userAgent = cleanText($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown');
$subjectContext = $interest !== '' ? $interest : $projectType;
$subjectInput = cleanText($_POST['email_subject'] ?? '');
$emailSubject = $subjectInput !== '' ? $subjectInput : 'New Lead Capture Request: ' . $subjectContext;

$messageLines = [
    'A new lead capture request was submitted through KS Tech Consulting.',
    '',
    'Submission Summary',
    'Form Name: ' . $formName,
    'Source Page: ' . $sourcePage,
    'Submitted At: ' . $submittedAt,
    'IP Address: ' . $ipAddress,
    'User Agent: ' . $userAgent,
    '',
    'Form Fields',
];

foreach ($_POST as $field => $rawValue) {
    if (!is_string($rawValue)) {
        continue;
    }

    if (in_array($field, ['website', 'return_url', 'email_subject'], true)) {
        continue;
    }

    $value = $field === 'goals' ? cleanMultiline($rawValue) : cleanText($rawValue);

    if ($value === '') {
        continue;
    }

    $label = $fieldLabels[$field] ?? ucwords(str_replace('_', ' ', $field));

    if ($field === 'goals') {
        $messageLines[] = $label . ':';
        $messageLines[] = $value;
        $messageLines[] = '';
        continue;
    }

    $messageLines[] = $label . ': ' . $value;
}

$emailBody = implode("\r\n", $messageLines) . "\r\n";
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $siteName . ' <' . $senderEmail . '>',
    'Sender: ' . $senderEmail,
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . PHP_VERSION,
];

$submissionLogged = appendSubmissionLog($logFilePath, $emailSubject, $emailBody);
$emailSent = @mail($recipientEmail, $emailSubject, $emailBody, implode("\r\n", $headers), '-f' . $senderEmail);

if (!$emailSent && !$submissionLogged) {
    renderStatusPage(
        'error',
        'The Server Could Not Send Your Request',
        'The form data was validated, but the hosting server did not complete the email handoff or local lead logging. Please contact us directly.',
        ['Recipient: ' . $recipientEmail, 'Form: ' . $formName, 'Server Log: Unavailable'],
        $returnUrl
    );
    exit;
}

if (!$emailSent && $submissionLogged) {
    renderStatusPage(
        'info',
        'Your Request Was Recorded',
        'The form was saved on the server, but email delivery from the hosting environment needs attention. KS can still retrieve your request from the server log.',
        ['Recipient: ' . $recipientEmail, 'Form: ' . $formName, 'Server Log: Saved'],
        $returnUrl
    );
    exit;
}

renderStatusPage(
    'success',
    'Your Consultation Request Was Submitted',
    'Thank you. We received your request, saved it on the server, and handed it to the mail system for delivery.',
    [
        'Recipient: ' . $recipientEmail,
        'Form: ' . $formName,
        'Primary Interest: ' . ($subjectContext !== '' ? $subjectContext : 'General Inquiry'),
        'Server Log: ' . ($submissionLogged ? 'Saved' : 'Unavailable'),
    ],
    $returnUrl
);
