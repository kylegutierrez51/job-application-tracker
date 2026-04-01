const modalOverlay = document.getElementById('detail-modal-overlay');

/*
Read form-modal.js to understand why we don't have "editButton", "deleteButton", etc. but just "modalOverlay"
*/

let job = null;
let rowIndex = null;
let editMode = false;

function populateViewMode() {
  const creation_date = job.created_at.substring(0, 10);
  const creation_time = job.created_at.substring(11, job.created_at.length);

  document.getElementById('detail-title').textContent = job.job_title;
  document.getElementById('detail-company').textContent = job.company_name;
  document.getElementById('detail-salary-min').textContent = job.salary_min ? `$${job.salary_min}` : '-';
  document.getElementById('detail-salary-max').textContent = job.salary_max ? `$${job.salary_max}` : '-';

  document.getElementById('detail-type').textContent = job.job_type ?? '-';
  document.getElementById('detail-posted').textContent = job.date_posted ?? '-';
  document.getElementById('detail-status').textContent = job.is_active ? 'Active' : 'Inactive';
  document.getElementById('detail-link').textContent = job.posting_url ? 'View Posting' : '-';
  document.getElementById('detail-description').textContent = job.job_description ?? '-';
  document.getElementById('detail-created').textContent = creation_date + ", " + creation_time
}

function openDetailModal() {
  editMode = false;
  modalOverlay.classList.remove('editing');
  populateViewMode(job);
  modalOverlay.classList.add('active');
}


function enterEditMode() {
  editMode = true;

  document.getElementById('edit-title').value = job.job_title;
  document.getElementById('edit-company').value = job.company_id;
  document.getElementById('edit-salary-min').value = job.salary_min ?? '';
  document.getElementById('edit-salary-max').value = job.salary_max ?? '';

  document.getElementById('edit-type').value = job.job_type ?? '';
  document.getElementById('edit-posted').value = job.date_posted ?? ''
  document.getElementById('edit-status').value = job.is_active ? 'Active' : 'Inactive';
  document.getElementById('edit-link').value = job.posting_url ?? '';
  document.getElementById('edit-description').value = job.job_description ?? '';

  modalOverlay.classList.add('editing');
}

function enterDeleteMode() {
  editMode = false;
  modalOverlay.classList.add('deleting');
}

function updateRow() {
  const row = document.querySelector(`.js-table-rows tr[data-index="${rowIndex}"]`);
  if (!row) return;

  row.dataset.job = JSON.stringify(job);

  const cells = row.querySelectorAll('td');
  cells[0].textContent = job.job_title || '-';
  cells[1].textContent = job.company_name || '-';
  cells[2].textContent = job.salary_min != null ? `$${job.salary_min}` : 'None';
  cells[3].textContent = job.salary_max != null ? `$${job.salary_max}` : 'None';
  cells[4].textContent = job.job_type || '-';
  cells[5].textContent = job.date_posted || '-';
  cells[6].textContent = job.is_active ? 'Active' : 'Inactive';
  cells[7].innerHTML = job.posting_url ? `<a href="${job.posting_url}" target="_blank">View</a>` : '-';
}

async function saveEdit() {
  const companySelect = document.getElementById('edit-company');

  job = {
    ...job,
    job_title: document.getElementById('edit-title').value,
    company_id: companySelect.value,
    company_name: companySelect.options[companySelect.selectedIndex].text,
    salary_min: document.getElementById('edit-salary-min').value || null,
    salary_max: document.getElementById('edit-salary-max').value || null,
    job_type: document.getElementById('edit-type').value || null,
    date_posted: document.getElementById('edit-posted').value || null,
    is_active: document.getElementById('edit-status').value === 'Active' ? 1 : 0,
    posting_url: document.getElementById('edit-link').value || null,
    job_description: document.getElementById('edit-description').value || null,
  };

  const res = await fetch(`/jobs/${job.job_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(job)
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
   1. Removes the job from the database
   2. Removes the matching <tr> from the DOM
   3. Decrements data-index on all subsequent rows so clicks still map to the correct array index
   4. Closes and resets the modal

  */
  if (rowIndex === null) return;

  const res = await fetch(`/jobs/${job.job_id}`, {
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

    modalOverlay.classList.remove('active', 'editing', 'deleting');
    rowIndex = null;
  }
}





document.querySelector('.js-table-rows').addEventListener('click', (e) => {
  const row = e.target.closest('tr[data-index]');
  if (!row) return;
  rowIndex = Number(row.dataset.index);
  job = JSON.parse(row.dataset.job); // gets the 'data-job='{{job | tojson}} data
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
