import { applications } from '../sample-data.js';

const modalOverlay = document.getElementById('detail-modal-overlay');
const detailCloseBtn = document.getElementById('close-details-btn');

function openDetailModal(index) {
  const app = applications[index];
  if (!app) return;

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
