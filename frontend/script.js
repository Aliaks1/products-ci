const API = (window.BACKEND_URL || 'http://localhost:3000') + '/api/products';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

async function fetchJSON(url, opts) {
  const r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw err;
  }
  return r.json();
}

async function load() {
  const rows = await fetchJSON(API);
  const tbody = $('#tbl tbody');
  tbody.innerHTML = '';
  rows.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td><td>${p.name}</td><td>${p.price}</td>
      <td>${p.code}</td><td>${p.supplierEmail}</td><td>${p.releaseDate}</td>
      <td>
        <button data-edit="${p.id}">Edytuj</button>
        <button data-del="${p.id}" class="ghost">Usuń</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function showErrors(el, list) {
  el.innerHTML = list.map(e => `• ${e.message || e}`).join('<br/>');
}

$('#productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#uiErrors').innerHTML = ''; $('#apiErrors').innerHTML = '';

  if (!e.target.checkValidity()) {
    const msgs = [];
    $$('input').forEach(inp => !inp.checkValidity() && msgs.push(`${inp.name}: niepoprawna wartość`));
    showErrors($('#uiErrors'), msgs);
    return;
  }

  const body = Object.fromEntries(new FormData(e.target).entries());
  body.price = Number(body.price);

  try {
    await fetchJSON(API, { method: 'POST', body: JSON.stringify(body) });
    e.target.reset();
    await load();
  } catch (err) {
    showErrors($('#apiErrors'), (err.fieldErrors || [{ message: err.error || 'Błąd' }]));
  }
});

$('#resetBtn').addEventListener('click', () => {
  $('#productForm').reset();
  $('#uiErrors').innerHTML = '';
  $('#apiErrors').innerHTML = '';
});

document.addEventListener('click', async (e) => {
  if (e.target.dataset.del) {
    try {
      await fetch(API + '/' + e.target.dataset.del, { method: 'DELETE' });
      await load();
    } catch (err) { showErrors($('#apiErrors'), [{ message: 'Nie udało się usunąć' }]); }
  }
});

load();
