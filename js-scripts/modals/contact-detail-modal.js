import { contacts } from '../sample-data.js';

const modalOverlay = document.getElementById('detail-modal-overlay');
const detailCloseBtn = document.getElementById('close-details-btn');

function openDetailModal(index) {
  const contact = contacts[index];
  if (!contact) return;

  document.getElementById('detail-name').textContent = contact[0];
  document.getElementById('detail-company').textContent = contact[1];
  document.getElementById('detail-title').textContent = contact[2];
  document.getElementById('detail-email').textContent = contact[3];
  document.getElementById('detail-phone').textContent = contact[4];
  document.getElementById('detail-linkedin').textContent = contact[5];
  document.getElementById('detail-created').textContent = contact[7];
  document.getElementById('detail-notes').textContent = contact[6];

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
