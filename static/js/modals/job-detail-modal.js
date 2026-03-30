import { jobs } from '../sample-data.js';

const modalOverlay = document.getElementById('detail-modal-overlay');
const detailCloseBtn = document.getElementById('close-details-btn');

const editBtn = document.querySelector('#detail-modal-overlay .edit-btn');
const cancelEditBtn = document.querySelector('#detail-modal-overlay .cancel-edit-btn');
const saveBtn = document.querySelector('#detail-modal-overlay .save-btn');


const deleteBtn = document.querySelector('#detail-modal-overlay .delete-btn');
const deleteConfirmationBtn = document.querySelector('#detail-modal-overlay .delete-confirm-btn');
const cancelDeleteBtn = document.querySelector('#detail-modal-overlay .delete-close-btn');


let currentJobIndex = null;
let editMode = false;

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

  editMode = false;
  modalOverlay.classList.remove('editing');
  populateViewMode(job);
  modalOverlay.classList.add('active');
}

function enterEditMode() {
  const job = jobs[currentJobIndex];
  if (!job) return;

  editMode = true;
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

function enterDeleteMode() {
  editMode = false;
  modalOverlay.classList.add('deleting');
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
  editMode = false;
}

function deleteRow() {
  /*
   1. Removes the job from the jobs array via splice
   2. Removes the matching <tr> from the DOM
   3. Decrements data-index on all subsequent rows so clicks still map to the correct array index
   4. Closes and resets the modal

  */
  if (currentJobIndex === null) return;

  jobs.splice(currentJobIndex, 1);

  const row = document.querySelector(`.js-table-rows tr[data-index="${currentJobIndex}"]`);
  if (row) row.remove();

  document.querySelectorAll('.js-table-rows tr[data-index]').forEach((tr) => {
    const idx = Number(tr.dataset.index);
    if (idx > currentJobIndex) tr.dataset.index = idx - 1;
  });

  modalOverlay.classList.remove('active', 'editing', 'deleting');
  currentJobIndex = null;
}


/* edit buttons */
editBtn.addEventListener('click', enterEditMode);

cancelEditBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('editing');
  editMode = false;
});

saveBtn.addEventListener('click', saveEdit);


/* delete buttons */
deleteBtn.addEventListener('click', enterDeleteMode);

deleteConfirmationBtn.addEventListener('click', deleteRow);

cancelDeleteBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('deleting');
})










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
