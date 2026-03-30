import { companies } from '../sample-data.js';

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

function populateViewMode(company) {
  document.getElementById('detail-name').textContent = company[0];
  document.getElementById('detail-industry').textContent = company[1];
  document.getElementById('detail-website').textContent = company[2];
  document.getElementById('detail-location').textContent = company[3];
  document.getElementById('detail-jobs').textContent = company[4];
  document.getElementById('detail-contacts').textContent = company[5];
  document.getElementById('detail-added').textContent = company[7];
  document.getElementById('detail-notes').textContent = company[6];
}

function openDetailModal(index) {
  currentIndex = index;
  const company = companies[index];
  if (!company) return;

  editMode = false;
  modalOverlay.classList.remove('editing');
  populateViewMode(company);
  modalOverlay.classList.add('active');
}

function enterEditMode() {
  const company = companies[currentIndex];
  if (!company) return;

  editMode = true;
  document.getElementById('edit-name').value = company[0];
  document.getElementById('edit-industry').value = company[1];
  document.getElementById('edit-website').value = company[2];
  document.getElementById('edit-location').value = company[3];
  document.getElementById('edit-notes').value = company[6];

  modalOverlay.classList.add('editing');
}

function saveEdit() {
  const company = companies[currentIndex];
  if (!company) return;

  company[0] = document.getElementById('edit-name').value;
  company[1] = document.getElementById('edit-industry').value;
  company[2] = document.getElementById('edit-website').value;
  company[3] = document.getElementById('edit-location').value;
  company[6] = document.getElementById('edit-notes').value;

  populateViewMode(company);
  modalOverlay.classList.remove('editing');
  editMode = false;
}

function enterDeleteMode() {
  editMode = false;
  modalOverlay.classList.add('deleting');
}

function deleteRow() {
  if (currentIndex === null) return;

  companies.splice(currentIndex, 1);

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
