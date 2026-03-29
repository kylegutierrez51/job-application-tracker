import { jobs } from '../sample-data.js';

const modalOverlay = document.getElementById('detail-modal-overlay');
const detailCloseBtn = document.getElementById('close-details-btn');



function openDetailModal(index) {
  const job = jobs[index];
  if (!job) return;

  document.getElementById('detail-title').textContent = job[0];
  document.getElementById('detail-company').textContent = job[1];
  document.getElementById('detail-salary').textContent = job[2];
  document.getElementById('detail-type').textContent = job[3];
  document.getElementById('detail-posted').textContent = job[4];
  document.getElementById('detail-status').textContent = job[5];
  document.getElementById('detail-link').textContent = job[6] === true ? 'View Posting' : '-';
  document.getElementById('detail-description').textContent = job[7] ?? '-';
  document.getElementById('detail-created').textContent = job[8];

  modalOverlay.classList.add('active');
}





document.querySelector('.js-table-rows').addEventListener('click', (e) => {
  const row = e.target.closest('tr[data-index]');
  if (!row) return;
  openDetailModal(Number(row.dataset.index));
});

detailCloseBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});
