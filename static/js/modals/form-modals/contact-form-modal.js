const subheader = document.querySelector('.js-subheader');
const modalOverlay = document.getElementById('modal-overlay');

function addRow(contact) {
  const tbody = document.querySelector('.js-table-rows');
  const index = tbody.rows.length;
  const tr = document.createElement('tr');
  tr.dataset.index = index;
  tr.dataset.contact = JSON.stringify(contact);
  tr.classList.add('clickable-row');

  const name = [contact.first_name, contact.last_name].filter(Boolean).join(' ') || '-';

  tr.innerHTML = `
    <td>${name}</td>
    <td>${contact.company_name || '-'}</td>
    <td>${contact.job_title || '-'}</td>
    <td>${contact.email || '-'}</td>
    <td>${contact.phone || '-'}</td>
    <td>${contact.linkedin_url || '-'}</td>
    <td>${contact.notes ? (contact.notes.length > 30 ? contact.notes.substring(0, 30) + '...' : contact.notes) : '-'}</td>
  `;

  tbody.appendChild(tr);

  const countElement = document.getElementById('subtitle-count');
  let currCount = Number(countElement.textContent);
  countElement.textContent = ++currCount;
}


function validateInputs(data) {
  let message = '';
  if (!data.first_name.trim() || !data.last_name.trim()) {
    message += 'First Name and Last Name are required. '
  }

  if (!data.company_id) {
    message += 'Company is required. '
  }

  if(data.first_name.length > 50) {
    message += 'First Name cannot be greater than 50 characters. '
  }

  if(data.last_name.length > 50) {
    message += 'Last Name cannot be greater than 50 characters. '
  }

  if (data.email !== '' && data.email.length > 100) {
    message += 'Email cannot be greater than 100 characters. '
  }

  if (data.phone !== '' && data.phone.length > 20) {
    message += 'Phone Number cannot be greater than 20 characters. '
  }

  if (data.job_title !== '' && data.job_title.length > 100) {
    message += 'Job Title cannot be greater than 100 characters. '
  }

  if (data.linkedin_url !== '' && data.linkedin_url.length > 200) {
    message += 'LinkedIn URL cannot be greater than 200 characters. '
  }
  else if (data.linkedin_url && !/^https?:\/\//i.test(data.linkedin_url)) {
    data.linkedin_url = 'https://' + data.linkedin_url;
  }


  if (message.length > 0) {
    alert(message);
    return undefined;
  }

  return data
}



subheader.addEventListener('click', (e) => {
  if (e.target.id === 'add-btn') modalOverlay.classList.add('active');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target.id === 'close-btn' || e.target.id === 'cancel-btn') {
    modalOverlay.classList.remove('active');
    document.getElementById('post-form').reset();
  }
});

document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'post-form') return;
  e.preventDefault();

  const formData = new FormData(e.target);
  let data = Object.fromEntries(formData.entries());

  data = validateInputs(data);
  if (!data) return;

  const res = await fetch('/contacts/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    const resData = await res.json();
    addRow(resData.contact);
    modalOverlay.classList.remove('active');
    e.target.reset();
  }
});
