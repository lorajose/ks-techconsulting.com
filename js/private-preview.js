// Loaded only by the owner-private review build. No lead data leaves this preview.
document.querySelectorAll('form[action="lead-capture.php"]').forEach(form => {
  const note = document.createElement('div');
  note.className = 'preview-alert';
  note.setAttribute('role', 'status');
  note.textContent = 'Private review: submission is disabled here. The live PHP delivery path is reserved for production approval.';
  form.prepend(note);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    note.textContent = 'Form validation passed. No information was sent or stored in this private review.';
    note.scrollIntoView({behavior: 'smooth', block: 'center'});
  });
});
