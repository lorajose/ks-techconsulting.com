(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const cases = {
    salesforce: {
      en: { headline:'Repair a stalled Salesforce handoff', bottleneck:'A Flow failure can leave opportunities unassigned while staff reconcile updates by hand.', steps:['Website or sales team','Salesforce Flow + Apex checks','Exception review','Owner dashboard'], before:['Failed updates discovered by email','Ownership unclear across the team','Manual reconciliation each morning'], after:['Failed events visible in a review queue','Assignment rule with an accountable owner','Dashboard shows pending exceptions'], safeguards:['Least-privilege Salesforce access','Review changes in a sandbox before release','Keep an audit trail and manual override'] },
      es: { headline:'Reparar el traspaso en Salesforce', bottleneck:'Un Flow con fallos puede dejar oportunidades sin asignar mientras el equipo revisa registros manualmente.', steps:['Website o equipo comercial','Validación de Flow y Apex','Revisión de excepciones','Tablero del responsable'], before:['Errores detectados por correo','Responsable sin definir','Conciliación manual diaria'], after:['Errores visibles en una cola','Regla de asignación con responsable','Tablero con excepciones pendientes'], safeguards:['Acceso mínimo necesario en Salesforce','Pruebas en sandbox antes de producción','Historial de cambios y revisión humana'] }
    },
    pos: {
      en: { headline:'Connect POS events to a trustworthy view', bottleneck:'Sales and stock may disagree when events arrive late or are retried without safeguards.', steps:['POS sale or return','API validation + retry','CRM and inventory sync','Exception dashboard'], before:['Stock checked across separate screens','Unclear failed syncs','Returns reconciled manually'], after:['Events queued with delivery status','Discrepancies surfaced for review','Sales and returns mapped consistently'], safeguards:['Use scoped API credentials','Avoid storing payment card data','Log event IDs without sensitive payloads'] },
      es: { headline:'Conectar el POS a una vista confiable', bottleneck:'Ventas e inventario pueden diferir cuando los eventos llegan tarde o se reintentan sin control.', steps:['Venta o devolución','Validación API y reintento','Sincronización con CRM','Tablero de excepciones'], before:['Inventario en varias pantallas','Fallas de envío poco visibles','Devoluciones conciliadas a mano'], after:['Eventos con estado de entrega','Diferencias visibles para revisión','Reglas claras para ventas y devoluciones'], safeguards:['Credenciales API con permisos limitados','Evitar guardar datos de tarjetas','Registrar identificadores sin datos sensibles'] }
    },
    leads: {
      en: { headline:'Make every new inquiry visible to a person', bottleneck:'A form submission can get lost between a website, an inbox and a CRM.', steps:['Website inquiry','Validation + deduplication','Salesforce assignment','Follow-up dashboard'], before:['New leads buried in an inbox','No clear next owner','Follow-up status hard to inspect'], after:['Inquiry captured with source','Owner and response task assigned','Unanswered inquiries highlighted'], safeguards:['Collect only needed contact details','Restrict CRM field access','Define retention and deletion rules'] },
      es: { headline:'Dar seguimiento visible a cada consulta', bottleneck:'Un formulario puede perderse entre el website, el correo y el CRM.', steps:['Consulta del website','Validación y duplicados','Asignación en Salesforce','Tablero de seguimiento'], before:['Consultas perdidas en el correo','Responsable incierto','Estado difícil de verificar'], after:['Consulta registrada con origen','Tarea asignada a una persona','Consultas sin respuesta visibles'], safeguards:['Pedir solo datos necesarios','Limitar acceso a campos del CRM','Definir retención y eliminación'] }
    },
    support: {
      en: { headline:'Assist support with approved knowledge', bottleneck:'Agents repeat research when answers are scattered across documents and tickets.', steps:['Support question','Approved knowledge retrieval','AI draft with sources','Human approval + dashboard'], before:['Answers scattered in documents','Repeated searches for policy','No clear review of AI drafts'], after:['Suggested answer with source links','Human confirms before sending','Unanswered topics tracked for improvement'], safeguards:['Restrict knowledge by permission','Do not expose raw customer records to a public model','Require human review and source checking'] },
      es: { headline:'Ayudar a soporte con conocimiento aprobado', bottleneck:'El equipo repite búsquedas cuando las respuestas están repartidas entre documentos y casos.', steps:['Pregunta de soporte','Búsqueda en fuentes aprobadas','Borrador IA con fuentes','Revisión humana y tablero'], before:['Respuestas en varios documentos','Búsquedas repetidas','Sin revisión de borradores IA'], after:['Respuesta sugerida con fuentes','Persona aprueba antes de enviar','Temas sin respuesta identificados'], safeguards:['Respetar permisos de documentos','No exponer registros reales a una demo pública','Exigir revisión humana y de fuentes'] }
    }
  };
  // Prioritize named platforms and failure types: "Salesforce ... sales team" is a Salesforce case.
  const pick = text => /salesforce|\bapex\b|\bflow\b|\bcrm\b/i.test(text) ? 'salesforce' : /\bpos\b|invent|stock|order|pedido|venta|shopify|square/i.test(text) ? 'pos' : /support|soporte|ticket|faq|knowledge|conocimiento|chat/i.test(text) ? 'support' : /lead|contact|form|prospect|cliente|website|sitio/i.test(text) ? 'leads' : 'salesforce';
  const followUp = {
    salesforce: { href:'salesforce-repair.html?utm_source=ai-lab&utm_medium=demo#request', esHref:'reparacion-salesforce.html?utm_source=ai-lab&utm_medium=demo#solicitud', en:'Discuss a Salesforce repair', es:'Consultar reparación de Salesforce' },
    pos: { href:'index.html?interest=POS%20Integration&utm_source=ai-lab#lead-capture', en:'Discuss a POS integration', es:'Consultar integración POS' },
    leads: { href:'index.html?interest=Custom%20Web%20Development&utm_source=ai-lab#lead-capture', en:'Discuss lead capture', es:'Consultar captación de clientes' },
    support: { href:'index.html?interest=AI%20Automation%20Solutions&utm_source=ai-lab#lead-capture', en:'Discuss AI support', es:'Consultar soporte con IA' }
  };
  const updateFollowUp = key => {
    const option = followUp[key];
    const es = $('language').value === 'es';
    document.querySelectorAll('[data-lab-cta]').forEach(link => {
      link.href = es && option.esHref ? option.esHref : option.href;
      link.textContent = es ? option.es : option.en;
    });
  };
  const addList = (id, items) => { const target = $(id); target.replaceChildren(); items.slice(0, 4).forEach(item => { const li = document.createElement('li'); li.textContent = String(item).slice(0, 200); target.append(li); }); };
  function render(data, mode) {
    const es = $('language').value === 'es';
    $('mode').textContent = mode === 'live' ? (es ? 'Análisis generado con IA · propuesta hipotética' : 'AI-generated analysis · hypothetical proposal') : (es ? 'Ejemplo interactivo · datos ficticios' : 'Interactive sample · fictitious data');
    $('headline').textContent = data.headline;
    $('bottleneck').textContent = data.bottleneck;
    const flow = $('workflow'); flow.replaceChildren(); data.steps.slice(0, 4).forEach((step, i) => { const node = document.createElement('div'); node.className = 'node'; node.textContent = `${i + 1}. ${String(step).slice(0, 110)}`; flow.append(node); });
    $('before-title').textContent = es ? 'Antes · ejemplo' : 'Before · example';
    $('after-title').textContent = es ? 'Después · propuesta' : 'After · proposal';
    $('safety-title').textContent = es ? 'Controles por planificar' : 'Controls to plan';
    addList('before', data.before); addList('after', data.after); addList('safeguards', data.safeguards);
    $('disclaimer').textContent = es ? 'Flujo y tablero ilustrativos. No hay conexión a datos ni sistemas de clientes. No se garantizan resultados.' : 'Illustrative workflow and dashboard. No customer environment or live business data is connected. Outcomes are not guaranteed.';
  }
  let selectedCase = 'salesforce';
  const showSample = key => { selectedCase = key; $('error').textContent = ''; render(cases[key][$('language').value], 'sample'); updateFollowUp(key); };
  document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => { $('problem').value = ''; showSample(button.dataset.case); }));
  $('language').addEventListener('change', () => showSample($('problem').value.trim() ? pick($('problem').value) : selectedCase));
  $('clear').addEventListener('click', () => { $('problem').value = ''; $('consent').checked = false; showSample('salesforce'); });
  $('analyze').addEventListener('click', async () => {
    const problem = $('problem').value.trim(); const es = $('language').value === 'es';
    if (problem.length < 25) { $('error').textContent = es ? 'Describe el problema en al menos 25 caracteres o elige un ejemplo.' : 'Describe your problem in at least 25 characters or choose a sample.'; return; }
    if (!$('consent').checked) { $('error').textContent = es ? 'Confirma primero el aviso sobre el envío a un proveedor de IA.' : 'Please confirm the AI provider notice first.'; return; }
    $('error').textContent = ''; $('analyze').disabled = true;
    let diagnostic = '';
    try {
      const response = await fetch('ai-demo.php', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({problem, language:$('language').value}), credentials:'same-origin', cache:'no-store' });
      const payload = await response.json();
      diagnostic = typeof payload.diagnostic === 'string' && /^[A-Z_]{2,20}$/.test(payload.diagnostic) ? payload.diagnostic : '';
      if (!response.ok || payload.mode !== 'live' || !payload.result) throw new Error(payload.error || 'unavailable');
      render(payload.result, 'live');
      updateFollowUp(pick(problem));
    } catch (_) {
      showSample(pick(problem));
      $('error').textContent = (es ? 'El análisis en vivo no está disponible. Mostramos un ejemplo relacionado; no analiza los detalles de tu texto.' : 'Live AI analysis is unavailable. This is a related sample; it does not analyze the details of your text.') + (diagnostic ? ` · ${es ? 'Código' : 'Code'}: ${diagnostic}` : '');
    } finally { $('analyze').disabled = false; }
  });
  showSample('salesforce');
})();
