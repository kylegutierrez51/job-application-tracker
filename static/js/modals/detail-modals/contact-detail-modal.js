import { contacts } from '../../sample-data.js';

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

function populateViewMode(contact) {
  document.getElementById('detail-name').textContent = contact[0];
  document.getElementById('detail-company').textContent = contact[1];
  document.getElementById('detail-title').textContent = contact[2];
  document.getElementById('detail-email').textContent = contact[3];
  document.getElementById('detail-phone').textContent = contact[4];
  document.getElementById('detail-linkedin').textContent = contact[5];
  document.getElementById('detail-created').textContent = contact[7];
  document.getElementById('detail-notes').textContent = contact[6];
}

function openDetailModal(index) {
  currentIndex = index;
  const contact = contacts[index];
  if (!contact) return;

  editMode = false;
  modalOverlay.classList.remove('editing');
  populateViewMode(contact);
  modalOverlay.classList.add('active');
}

function enterEditMode() {
  const contact = contacts[currentIndex];
  if (!contact) return;

  editMode = true;
  document.getElementById('edit-name').value = contact[0];
  document.getElementById('edit-company').value = contact[1];
  document.getElementById('edit-title').value = contact[2];
  document.getElementById('edit-email').value = contact[3];
  document.getElementById('edit-phone').value = contact[4];
  document.getElementById('edit-linkedin').value = contact[5];
  document.getElementById('edit-notes').value = contact[6];

  modalOverlay.classList.add('editing');
}

function saveEdit() {
  const contact = contacts[currentIndex];
  if (!contact) return;

  contact[0] = document.getElementById('edit-name').value;
  contact[1] = document.getElementById('edit-company').value;
  contact[2] = document.getElementById('edit-title').value;
  contact[3] = document.getElementById('edit-email').value;
  contact[4] = document.getElementById('edit-phone').value;
  contact[5] = document.getElementById('edit-linkedin').value;
  contact[6] = document.getElementById('edit-notes').value;

  populateViewMode(contact);
  modalOverlay.classList.remove('editing');
  editMode = false;
}

function enterDeleteMode() {
  editMode = false;
  modalOverlay.classList.add('deleting');
}

function deleteRow() {
  if (currentIndex === null) return;

  contacts.splice(currentIndex, 1);

  const row = document.querySelector(`.js-table-rows tr[data-index="${currentIndex}"]`);
  if (row) row.remove();

  document.querySelectorAll('.js-table-rows tr[data-index]').forEach((tr) => {
    const idx = Number(tr.dataset.index);
    if (idx > currentIndex) tr.dataset.index = idx - 1;
  });

  modalOverlay.classList.remove('active', 'editing', 'deleting');
  currentIndex = null;
}

deleteBtn.addEventListener('click', enterDeleteMode);
deleteConfirmationBtn.addEventListener('click', deleteRow);
cancelDeleteBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('deleting');
});

editBtn.addEventListener('click', enterEditMode);

cancelEditBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('editing');
  editMode = false;
});

saveBtn.addEventListener('click', saveEdit);

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
