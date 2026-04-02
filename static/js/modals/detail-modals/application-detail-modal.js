import { addCustomFieldRow, collectCustomFields, clearExtras, renderKeyValueHtml } from '../extras-utils.js';

const modalOverlay = document.getElementById('detail-modal-overlay');

let application = null;
let rowIndex = null;
let editMode = false;

function populateViewMode() {
  document.getElementById('detail-position').textContent = application.job_title ?? '-';
  document.getElementById('detail-applied').textContent = application.application_date ? application.application_date.substring(0, 10) : '-';
  document.getElementById('detail-status').textContent = application.status ?? '-';
  document.getElementById('detail-resume').textContent = application.resume_version ?? '-';
  document.getElementById('detail-cover-letter').textContent = application.cover_letter_sent ? 'Sent' : '-';
  document.getElementById('detail-response').textContent = application.response_date ? application.response_date.substring(0, 10) : '-';
  document.getElementById('detail-interview').textContent = application.interview_date ? application.interview_date.substring(0, 16).replace('T', ' ') : '-';
  document.getElementById('detail-created').textContent = application.created_at ? application.created_at.substring(0, 10) : '-';
  document.getElementById('detail-notes').textContent = application.notes ?? '-';
  document.getElementById('detail-interview-data').innerHTML = renderKeyValueHtml(application.interview_data);
}

function enterEditMode() {
  document.getElementById('edit-job').value = application.job_id ?? '';
  document.getElementById('edit-applied').value = application.application_date ? application.application_date.substring(0, 10) : '';
  document.getElementById('edit-status').value = application.status ?? '';
  document.getElementById('edit-resume').value = application.resume_version ?? '';
  document.getElementById('edit-cover-letter').checked = !!application.cover_letter_sent;
  document.getElementById('edit-response').value = application.response_date ? application.response_date.substring(0, 10) : '';
  document.getElementById('edit-interview').value = application.interview_date ? application.interview_date.substring(0, 16) : '';
  document.getElementById('edit-notes').value = application.notes ?? '';

  clearExtras(null, 'detail-interview-data-rows');
  if (application.interview_data) {
    Object.entries(application.interview_data).forEach(([k, v]) => addCustomFieldRow('detail-interview-data-rows', k, v));
  }

  editMode = true;
  modalOverlay.classList.add('editing');
}

async function saveEdit() {
  const interviewData = collectCustomFields('detail-interview-data-rows');

  const candidate = {
    job_id: document.getElementById('edit-job').value,
    application_date: document.getElementById('edit-applied').value || null,
    status: document.getElementById('edit-status').value || null,
    resume_version: document.getElementById('edit-resume').value || null,
    cover_letter_sent: document.getElementById('edit-cover-letter').checked ? 1 : 0,
    response_date: document.getElementById('edit-response').value || null,
    interview_date: document.getElementById('edit-interview').value || null,
    notes: document.getElementById('edit-notes').value || null,
    interview_data: Object.keys(interviewData).length > 0 ? interviewData : null,
  };

  const validated = validateInputs(candidate);
  if (!validated) return;
  application = validated;

  const res = await fetch(`/applications/${application.application_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application)
  });

  if (res.ok) {
    const resData = await res.json();
    application = resData.application;
    populateViewMode();
    updateRow();
    editMode = false;
    modalOverlay.classList.remove('editing');
  }
}

function updateRow() {
  const row = document.querySelector(`.js-table-rows tr[data-index="${rowIndex}"]`);
  if (!row) return;

  row.dataset.application = JSON.stringify(application);

  const cells = row.querySelectorAll('td');
  cells[0].innerHTML = `<div>${application.job_title || '-'}</div><div class="company">${application.company_name || '-'}</div>`;
  cells[1].textContent = application.application_date ? application.application_date.substring(0, 10) : '-';
  cells[2].textContent = application.status || '-';
  cells[3].textContent = application.resume_version || '-';
  cells[4].textContent = application.cover_letter_sent ? 'Sent' : '-';
  cells[5].textContent = application.response_date ? application.response_date.substring(0, 10) : '-';
  cells[6].textContent = application.interview_date ? application.interview_date.substring(0, 16).replace('T', ' ') : '-';
  cells[7].textContent = application.notes ? (application.notes.length > 30 ? application.notes.substring(0, 30) + '...' : application.notes) : '-';
}

async function deleteRow() {
  const res = await fetch(`/applications/${application.application_id}`, {
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
    application = null;
    rowIndex = null;
  }
}

function openDetailModal() {
  editMode = false;
  modalOverlay.classList.remove('editing', 'deleting');
  populateViewMode();
  modalOverlay.classList.add('active');
}




function validateInputs(data) {
  let message = '';
  if (!data.job_id) {
    message += 'Job is required. '
  }

  if(!data.application_date) {
    message += 'Application date is required. ';
  }

  if (data.resume_version && data.resume_version.length > 50) {
    message += 'Resume Version cannot be greater than 50 characters. '
  }

  if (message.length > 0) {
    alert(message);
    return undefined;
  }

  return data
}




document.querySelector('.js-table-rows').addEventListener('click', (e) => {
  const row = e.target.closest('tr[data-index]');
  if (!row) return;
  rowIndex = Number(row.dataset.index);
  application = JSON.parse(row.dataset.application);
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
  if (e.target.id === 'detail-add-interview-field') addCustomFieldRow('detail-interview-data-rows');
  if (e.target.classList.contains('remove-field-btn')) e.target.closest('.custom-row').remove();
});
