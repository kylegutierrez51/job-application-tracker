import { jobs } from '../sample-data.js';

const modalOverlay = document.getElementById('detail-modal-overlay');
const detailCloseBtn = document.getElementById('close-details-btn');
const editBtn = document.querySelector('#detail-modal-overlay .edit-btn');
const cancelEditBtn = document.querySelector('#detail-modal-overlay .cancel-edit-btn');
const saveBtn = document.querySelector('#detail-modal-overlay .save-btn');

let currentJobIndex = null;

function populateViewMode(job) {
  document.getElementById('detail-title').textContent = job[0];
  document.getElementById('detail-company').textContent = job[1];
  document.getElementById('detail-salary').textContent = job[2];
  document.getElementById('detail-type').textContent = job[3];
  document.getElementById('detail-posted').textContent = job[4];
  document.getElementById('detail-status').textContent = job[5];
  document.getElementById('detail-link').textContent = job[6] === true ? 'View Posting' : '-';
  document.getElementById('detail-description').textContent = job[7] ?? '-';
  document.getElementById('detail-created').textContent = job[8];
}

function openDetailModal(index) {
  currentJobIndex = index;
  const job = jobs[index];
  if (!job) return;

  modalOverlay.classList.remove('editing');
  populateViewMode(job);
  modalOverlay.classList.add('active');
}

function enterEditMode() {
  const job = jobs[currentJobIndex];
  if (!job) return;

  document.getElementById('edit-title').value = job[0];
  document.getElementById('edit-company').value = job[1];
  document.getElementById('edit-salary').value = job[2];
  document.getElementById('edit-type').value = job[3];
  document.getElementById('edit-posted').value = job[4];
  document.getElementById('edit-status').value = job[5];
  document.getElementById('edit-link').value = job[6] === true ? '' : (job[6] || '');
  document.getElementById('edit-description').value = job[7] ?? '';

  modalOverlay.classList.add('editing');
}

function saveEdit() {
  const job = jobs[currentJobIndex];
  if (!job) return;

  job[0] = document.getElementById('edit-title').value;
  job[1] = document.getElementById('edit-company').value;
  job[2] = document.getElementById('edit-salary').value;
  job[3] = document.getElementById('edit-type').value;
  job[4] = document.getElementById('edit-posted').value;
  job[5] = document.getElementById('edit-status').value;
  const linkVal = document.getElementById('edit-link').value.trim();
  job[6] = linkVal !== '' ? linkVal : true;
  job[7] = document.getElementById('edit-description').value;

  populateViewMode(job);
  modalOverlay.classList.remove('editing');
}

editBtn.addEventListener('click', enterEditMode);
cancelEditBtn.addEventListener('click', () => modalOverlay.classList.remove('editing'));
saveBtn.addEventListener('click', saveEdit);

document.querySelector('.js-table-rows').addEventListener('click', (e) => {
  const row = e.target.closest('tr[data-index]');
  if (!row) return;
  openDetailModal(Number(row.dataset.index));
});

detailCloseBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active', 'editing');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active', 'editing');
  }
});
