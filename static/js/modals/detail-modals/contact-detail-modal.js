const modalOverlay = document.getElementById('detail-modal-overlay');

let contact = null;
let rowIndex = null;
let editMode = false;

function populateViewMode() {
  // const name = [contact.first_name, contact.last_name].filter(Boolean).join(' ') || '-'; -- if you want to display the full name
  document.getElementById('detail-fname').textContent = contact.first_name;
  document.getElementById('detail-lname').textContent = contact.last_name;
  document.getElementById('detail-company').textContent = contact.company_name ?? '-';
  document.getElementById('detail-title').textContent = contact.job_title ?? '-';
  document.getElementById('detail-email').textContent = contact.email ?? '-';
  document.getElementById('detail-phone').textContent = contact.phone ?? '-';
  document.getElementById('detail-linkedin').textContent = contact.linkedin_url ?? '-';
  document.getElementById('detail-created').textContent = contact.created_at ? contact.created_at.substring(0, 10) : '-';
  document.getElementById('detail-notes').textContent = contact.notes ?? '-';
}

function enterEditMode() {
  document.getElementById('edit-fname').value = contact.first_name
  document.getElementById('edit-lname').value = contact.last_name
  document.getElementById('edit-company').value = contact.company_id ?? '';
  document.getElementById('edit-title').value = contact.job_title ?? '';
  document.getElementById('edit-email').value = contact.email ?? '';
  document.getElementById('edit-phone').value = contact.phone ?? '';
  document.getElementById('edit-linkedin').value = contact.linkedin_url ?? '';
  document.getElementById('edit-notes').value = contact.notes ?? '';

  editMode = true;
  modalOverlay.classList.add('editing');
}

async function saveEdit() {
  const data = {
    first_name: document.getElementById('edit-fname').value,
    last_name: document.getElementById('edit-lname').value,
    company_id: document.getElementById('edit-company').value,
    job_title: document.getElementById('edit-title').value || null,
    email: document.getElementById('edit-email').value || null,
    phone: document.getElementById('edit-phone').value || null,
    linkedin_url: document.getElementById('edit-linkedin').value || null,
    notes: document.getElementById('edit-notes').value || null,
  };

  const res = await fetch(`/contacts/${contact.contact_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    const resData = await res.json();
    contact = resData.contact;
    populateViewMode();
    updateRow();
    editMode = false;
    modalOverlay.classList.remove('editing');
  }
}

function updateRow() {
  const row = document.querySelector(`.js-table-rows tr[data-index="${rowIndex}"]`);
  if (!row) return;

  row.dataset.contact = JSON.stringify(contact);

  const name = [contact.first_name, contact.last_name].filter(Boolean).join(' ') || '-';
  const cells = row.querySelectorAll('td');
  cells[0].textContent = name;
  cells[1].textContent = contact.company_name || '-';
  cells[2].textContent = contact.job_title || '-';
  cells[3].textContent = contact.email || '-';
  cells[4].textContent = contact.phone || '-';
  cells[5].textContent = contact.linkedin_url || '-';
  cells[6].textContent = contact.notes || '-';
}

async function deleteRow() {
  const res = await fetch(`/contacts/${contact.contact_id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.ok) {
    const row = document.querySelector(`.js-table-rows tr[data-index="${rowIndex}"]`);
    if (row) row.remove();

    document.querySelectorAll('.js-table-rows tr[data-index]').forEach((tr) => {
      const idx = Number(tr.dataset.index);
      if (idx > rowIndex) tr.dataset.index = idx - 1;
    });


    /* decrement subheader count if not already 0 */
    const countElement = document.getElementById('subtitle-count');
    let currCount = Number(countElement.textContent);
    if (currCount !== 0) {
      countElement.textContent = --currCount;
    }

    modalOverlay.classList.remove('active', 'editing', 'deleting');
    contact = null;
    rowIndex = null;
  }
}

function openDetailModal() {
  editMode = false;
  modalOverlay.classList.remove('editing', 'deleting');
  populateViewMode();
  modalOverlay.classList.add('active');
}

document.querySelector('.js-table-rows').addEventListener('click', (e) => {
  const row = e.target.closest('tr[data-index]');
  if (!row) return;
  rowIndex = Number(row.dataset.index);
  contact = JSON.parse(row.dataset.contact);
  openDetailModal();
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay && !editMode) {
    modalOverlay.classList.remove('active', 'editing', 'deleting');
  }
  if (e.target.id === 'close-details-btn') {
    modalOverlay.classList.remove('active', 'editing');
    editMode = false;
  }
  if (e.target.classList.contains('edit-btn')) enterEditMode();
  if (e.target.classList.contains('cancel-edit-btn')) {
    modalOverlay.classList.remove('editing');
    editMode = false;
  }
  if (e.target.classList.contains('save-btn')) saveEdit();
  if (e.target.classList.contains('delete-btn')) modalOverlay.classList.add('deleting');
  if (e.target.classList.contains('delete-confirm-btn')) deleteRow();
  if (e.target.classList.contains('delete-close-btn')) modalOverlay.classList.remove('deleting');
});
