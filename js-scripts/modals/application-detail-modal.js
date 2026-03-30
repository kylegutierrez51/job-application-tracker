import { applications } from '../sample-data.js';

const modalOverlay = document.getElementById('detail-modal-overlay');
const detailCloseBtn = document.getElementById('close-details-btn');
const editBtn = document.querySelector('#detail-modal-overlay .edit-btn');
const cancelEditBtn = document.querySelector('#detail-modal-overlay .cancel-edit-btn');
const saveBtn = document.querySelector('#detail-modal-overlay .save-btn');

const deleteBtn = document.querySelector('#detail-modal-overlay .delete-btn');
const deleteConfirmationBtn = document.querySelector('#detail-modal-overlay .delete-confirm-btn');
const cancelDeleteBtn = document.querySelector('#detail-modal-overlay .delete-close-btn');

let currentIndex = null;
let editMode = false;

function populateViewMode(app) {
  document.getElementById('detail-position').textContent = app[0];
  document.getElementById('detail-company').textContent = app[1];
  document.getElementById('detail-applied').textContent = app[2];
  document.getElementById('detail-status').textContent = app[3];
  document.getElementById('detail-resume').textContent = app[4];
  document.getElementById('detail-cover-letter').textContent = app[5];
  document.getElementById('detail-response').textContent = app[6];
  document.getElementById('detail-interview').textContent = app[7];
  document.getElementById('detail-created').textContent = app[9];
  document.getElementById('detail-notes').textContent = app[8];
}

function openDetailModal(index) {
  currentIndex = index;
  const app = applications[index];
  if (!app) return;

  editMode = false;
  modalOverlay.classList.remove('editing');
  populateViewMode(app);
  modalOverlay.classList.add('active');
}

function enterEditMode() {
  const app = applications[currentIndex];
  if (!app) return;

  editMode = true;
  document.getElementById('edit-position').value = app[0];
  document.getElementById('edit-company').value = app[1];
  document.getElementById('edit-applied').value = app[2];
  document.getElementById('edit-status').value = app[3];
  document.getElementById('edit-resume').value = app[4];
  document.getElementById('edit-cover-letter').value = app[5];
  document.getElementById('edit-response').value = app[6];
  document.getElementById('edit-interview').value = app[7];
  document.getElementById('edit-notes').value = app[8];

  modalOverlay.classList.add('editing');
}

function saveEdit() {
  const app = applications[currentIndex];
  if (!app) return;

  app[0] = document.getElementById('edit-position').value;
  app[1] = document.getElementById('edit-company').value;
  app[2] = document.getElementById('edit-applied').value;
  app[3] = document.getElementById('edit-status').value;
  app[4] = document.getElementById('edit-resume').value;
  app[5] = document.getElementById('edit-cover-letter').value;
  app[6] = document.getElementById('edit-response').value;
  app[7] = document.getElementById('edit-interview').value;
  app[8] = document.getElementById('edit-notes').value;

  populateViewMode(app);
  modalOverlay.classList.remove('editing');
  editMode = false;
}

function enterDeleteMode() {
  editMode = false;
  modalOverlay.classList.add('deleting');
}

function deleteRow() {
  if (currentIndex === null) return;

  applications.splice(currentIndex, 1);

  const row = document.querySelector(`.js-table-rows tr[data-index="${currentIndex}"]`);
  if (row) row.remove();

  document.querySelectorAll('.js-table-rows tr[data-index]').forEach((tr) => {
    const idx = Number(tr.dataset.index);
    if (idx > currentIndex) tr.dataset.index = idx - 1;
  });

  modalOverlay.classList.remove('active', 'editing', 'deleting');
  currentIndex = null;
}

editBtn.addEventListener('click', enterEditMode);

cancelEditBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('editing');
  editMode = false;
});

saveBtn.addEventListener('click', saveEdit);

deleteBtn.addEventListener('click', enterDeleteMode);
deleteConfirmationBtn.addEventListener('click', deleteRow);
cancelDeleteBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('deleting');
});

document.querySelector('.js-table-rows').addEventListener('click', (e) => {
  const row = e.target.closest('tr[data-index]');
  if (!row) return;
  openDetailModal(Number(row.dataset.index));
});

detailCloseBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active', 'editing');
  editMode = false;
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay && !editMode) {
    modalOverlay.classList.remove('active', 'editing', 'deleting');
  }
});
