import { companies } from '../sample-data.js';

const modalOverlay = document.getElementById('detail-modal-overlay');
const detailCloseBtn = document.getElementById('close-details-btn');

function openDetailModal(index) {
  const company = companies[index];
  if (!company) return;

  document.getElementById('detail-name').textContent = company[0];
  document.getElementById('detail-industry').textContent = company[1];
  document.getElementById('detail-website').textContent = company[2];
  document.getElementById('detail-location').textContent = company[3];
  document.getElementById('detail-jobs').textContent = company[4];
  document.getElementById('detail-contacts').textContent = company[5];
  document.getElementById('detail-added').textContent = company[7];
  document.getElementById('detail-notes').textContent = company[6];

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
