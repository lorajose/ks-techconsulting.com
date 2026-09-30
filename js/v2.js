(function () {
  const paths = {
    salesforce: { label: 'Salesforce Flow, Apex or CRM data', title: 'Trace the failing workflow', first: 'Review the expected outcome, affected automation, error examples and business impact.', bring: 'A redacted error example and the name of the affected process.', url: 'salesforce-repair.html', link: 'Explore Salesforce repair' },
    integration: { label: 'Node.js, APIs and data handoffs', title: 'Map the point of failure', first: 'Follow one transaction across services, logs, retries and ownership of the data.', bring: 'The systems involved, a redacted failure example and how often it occurs.', url: 'nodejs-integrations.html', link: 'Explore integration work' },
    pos: { label: 'POS, inventory and commerce', title: 'Reconcile one real transaction', first: 'Map product identifiers, orders, refunds and sync timing before changing the integration.', bring: 'Which POS and commerce tools you use and one redacted mismatch.', url: 'pos-commerce.html', link: 'Explore POS solutions' },
    ai: { label: 'AI adoption and automation', title: 'Select one useful workflow', first: 'Define the repetitive task, available data, human approval and a measurable pilot.', bring: 'The task, its current owner and what a successful first pilot would save or improve.', url: 'ai-adoption.html', link: 'Explore AI adoption' },
    leads: { label: 'Website leads and follow-up', title: 'Follow a lead end to end', first: 'Test capture, notification, CRM assignment and the first human response.', bring: 'A sample inquiry path and where you can last confirm its arrival.', url: 'lead-handoff.html', link: 'Explore lead handoff' }
  };
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav-links]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    nav.addEventListener('click', e => {
      if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; }
    });
  }
  const finder = document.querySelector('[data-finder]');
  if (finder) {
    const buttons = [...finder.querySelectorAll('[data-issue]')];
    const set = key => {
      const item = paths[key];
      if (!item) return;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.issue === key)));
      finder.querySelector('[data-result-title]').textContent = item.title;
      finder.querySelector('[data-result-first]').textContent = item.first;
      const link = finder.querySelector('[data-result-link]');
      link.href = item.url;
      link.textContent = item.link;
      const start = finder.querySelector('[data-result-start]');
      start.href = 'start.html?issue=' + encodeURIComponent(key);
    };
    buttons.forEach(button => button.addEventListener('click', () => set(button.dataset.issue)));
    set(buttons[0]?.dataset.issue || 'salesforce');
  }
  const form = document.querySelector('[data-intake-form]');
  if (form) {
    const params = new URLSearchParams(location.search);
    const key = params.get('issue');
    const select = form.querySelector('[name=interest]');
    if (paths[key] && select) select.value = key;
    const summary = document.querySelector('[data-selected-path]');
    const update = () => {
      const item = paths[select.value];
      if (!summary) return;
      summary.hidden = !item;
      if (item) {
        summary.querySelector('strong').textContent = item.title;
        summary.querySelector('p').textContent = 'For the first conversation: ' + item.bring;
      }
    };
    select?.addEventListener('change', update);
    update();
    const source = form.querySelector('[name=source_page]');
    if (source) source.value = key && paths[key] ? 'start.html?issue=' + key : 'start.html';
  }
})();
