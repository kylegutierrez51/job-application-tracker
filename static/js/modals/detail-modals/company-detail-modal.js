const modalOverlay = document.getElementById('detail-modal-overlay');

/*
Read form-modal.js to understand why we don't have "editButton", "deleteButton", etc. but just "modalOverlay"
*/

let company = null;
let rowIndex = null;
let editMode = false;

function populateViewMode() {
  document.getElementById('detail-name').textContent = company.company_name;
  document.getElementById('detail-industry').textContent = company.industry ?? '-';
  document.getElementById('detail-website').textContent = company.website ?? '-';
  document.getElementById('detail-city').textContent = company.city ?? '-';
  document.getElementById('detail-state').textContent = company.state ?? '-';
  document.getElementById('detail-jobs').textContent = company.job_count ?? '0';
  document.getElementById('detail-contacts').textContent = company.contact_count ?? '0';
  document.getElementById('detail-notes').textContent = company.notes ?? '-';
  document.getElementById('detail-added').textContent = company.created_at ? company.created_at.substring(0, 10) : '-';
}

function openDetailModal() {
  editMode = false;
  modalOverlay.classList.remove('editing');
  populateViewMode();
  modalOverlay.classList.add('active');
}


function enterEditMode() {
  editMode = true;

  document.getElementById('edit-name').value = company.company_name ?? '';
  document.getElementById('edit-industry').value = company.industry ?? '';
  document.getElementById('edit-website').value = company.website ?? '';
  document.getElementById('edit-city').value = company.city ?? '';
  document.getElementById('edit-state').value = company.state ?? '';
  document.getElementById('edit-notes').value = company.notes ?? '';

  modalOverlay.classList.add('editing');
}

function enterDeleteMode() {
  editMode = false;
  modalOverlay.classList.add('deleting');
}

function updateRow() {
  const row = document.querySelector(`.js-table-rows tr[data-index="${rowIndex}"]`);
  if (!row) return;

  row.dataset.company = JSON.stringify(company);

  const location = [company.city, company.state].filter(Boolean).join(', ') || '-';
  const cells = row.querySelectorAll('td');
  cells[0].textContent = company.company_name || '-';
  cells[1].textContent = company.industry || '-';
  cells[2].textContent = company.website || '-';
  cells[3].textContent = location; // keep combined display in the table
  cells[4].textContent = company.job_count ?? '0';
  cells[5].textContent = company.contact_count ?? '0';
  cells[6].textContent = company.notes || '-';
  cells[7].textContent = company.created_at ? company.created_at.substring(0, 10) : '-';
}

async function saveEdit() {
  company = {
    ...company,
    company_name: document.getElementById('edit-name').value,
    industry: document.getElementById('edit-industry').value || null,
    website: document.getElementById('edit-website').value || null,
    city: document.getElementById('edit-city').value || null,
    state: document.getElementById('edit-state').value || null,
    notes: document.getElementById('edit-notes').value || null,
  };

  const res = await fetch(`/companies/${company.company_id}`, {
    // the company_id comes from the get_all_companies() query from the URL endpoint
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(company)
  });

  if (res.ok) {
    populateViewMode();
    updateRow();
    modalOverlay.classList.remove('editing');
    editMode = false;
  }
}

async function deleteRow() {
  /*
   1. Removes the company from the database
   2. Removes the matching <tr> from the DOM
   3. Decrements data-index on all subsequent rows so clicks still map to the correct array index
   4. Closes and resets the modal
  */
  if (rowIndex === null) return;

  const res = await fetch(`/companies/${company.company_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
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
    rowIndex = null;
  } else {
    const data = await res.json();
    modalOverlay.classList.remove('deleting');
    alert(data.message);
  }
}


document.querySelector('.js-table-rows').addEventListener('click', (e) => {
  const row = e.target.closest('tr[data-index]');
  if (!row) return;
  rowIndex = Number(row.dataset.index);
  company = JSON.parse(row.dataset.company); // gets the 'data-company='{{company | tojson}} data
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
  if (e.target.classList.contains('delete-btn')) enterDeleteMode();
  if (e.target.classList.contains('delete-confirm-btn')) deleteRow();
  if (e.target.classList.contains('delete-close-btn')) modalOverlay.classList.remove('deleting');
});
