import { addCustomFieldRow, collectCustomFields, clearExtras } from '../extras-utils.js';

const subheader = document.querySelector('.js-subheader');
const modalOverlay = document.getElementById('modal-overlay');

function addRow(app) {
  const tbody = document.querySelector('.js-table-rows');
  const index = tbody.rows.length;
  const tr = document.createElement('tr');
  tr.dataset.index = index;
  tr.dataset.application = JSON.stringify(app);
  tr.classList.add('clickable-row');

  tr.innerHTML = `
    <td>
      <div>${app.job_title || '-'}</div>
      <div class="company">${app.company_name || '-'}</div>
    </td>
    <td>${app.application_date ? app.application_date.substring(0, 10) : '-'}</td>
    <td>${app.status || '-'}</td>
    <td>${app.resume_version || '-'}</td>
    <td>${app.cover_letter_sent ? 'Sent' : '-'}</td>
    <td>${app.response_date ? app.response_date.substring(0, 10) : '-'}</td>
    <td>${app.interview_date ? app.interview_date.substring(0, 16).replace('T', ' ') : '-'}</td>
    <td>${app.notes || '-'}</td>
  `;

  tbody.appendChild(tr);

  const countElement = document.getElementById('subtitle-count');
  let currCount = Number(countElement.textContent);
  countElement.textContent = ++currCount;
}

subheader.addEventListener('click', (e) => {
  if (e.target.id === 'add-btn') modalOverlay.classList.add('active');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target.id === 'close-btn' || e.target.id === 'cancel-btn') {
    modalOverlay.classList.remove('active');
    document.getElementById('post-form').reset();
    clearExtras(null, 'interview-data-rows');
  }
  if (e.target.id === 'add-interview-field') {
    addCustomFieldRow('interview-data-rows');
  }
  if (e.target.classList.contains('remove-field-btn')) {
    e.target.closest('.custom-row').remove();
  }
});

document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'post-form') return;
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  data.cover_letter_sent = formData.has('cover_letter_sent') ? '1' : '0';

  const interviewData = collectCustomFields('interview-data-rows');
  if (Object.keys(interviewData).length > 0) data.interview_data = interviewData;

  const res = await fetch('/applications/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    const resData = await res.json();
    addRow(resData.application);
    modalOverlay.classList.remove('active');
    e.target.reset();
    clearExtras(null, 'interview-data-rows');
  }
});
