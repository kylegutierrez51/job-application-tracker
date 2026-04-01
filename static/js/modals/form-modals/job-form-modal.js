import { addSkillTag, addCustomFieldRow, collectSkills, collectCustomFields, clearExtras } from '../extras-utils.js';

const subheader = document.querySelector('.js-subheader');
const modalOverlay = document.getElementById('modal-overlay');

/*
Event delegation -- rather than defining xButton and cancelButton button variables, we
define "modalOverlay".

We define modalOverlay since job-details.js's renderModalOverlay is async since it has to fetch data.
This means that this js file runs before renderModalOverlay finishes, meaning that buttons like the xButton and cancelButton give errors since they're rendered only in renderModalOverlay.

But the id #modal-overlay is in the static HTML (templates/jobs.html) from the start.

ALSO use event delegation w/ subheader since subheader.js is async, meaning just using the addButton may not work/

We do the same thing in job-detail-modal.js. -- Remove Edit, Delete, Cancel, X buttons
*/


function resetInputs() {
  document.getElementById("post-form").reset();
  clearExtras('skills-tags', 'requirements-custom-rows');
}


function addRow(job) {
  const tbody = document.querySelector('.js-table-rows');
  const index = tbody.rows.length;
  const tr = document.createElement('tr');
  tr.dataset.index = index;
  tr.dataset.job = JSON.stringify(job);
  tr.classList.add('clickable-row');

  tr.innerHTML = `
    <td>${job.job_title || '-'}</td>
    <td>${job.company_name || '-'}</td>
    <td>${job.salary_min !== null ? '$' + job.salary_min : '-'}</td>
    <td>${job.salary_max !== null ? '$' + job.salary_max : '-'}</td>
    <td>${job.job_type || '-'}</td>
    <td>${job.date_posted || '-'}</td>
    <td>${job.is_active ? 'Active' : 'Inactive'}</td>
  `;

  tbody.appendChild(tr);

  const countElement = document.getElementById('subtitle-count');
  let currCount = Number(countElement.textContent);
  countElement.textContent = ++currCount;
}

function validateInputs(data) {
  let message = '';
  if (!data.job_title.trim() || !data.company_id) {
    message += 'Job Title and Company are required. '
  }

  const DECIMAL_MAX = 99999999.99;
  const DECIMAL_MIN = -99999999.99;

  if (data.job_title !== '' && data.job_title.length > 100) {
    message += 'Job Title cannot be greater than 100 characters. '
  }

  if (data.salary_min !== '' && (Number(data.salary_min) < DECIMAL_MIN || Number(data.salary_min) > DECIMAL_MAX)) {
    message += `Salary Min must be between ${DECIMAL_MIN.toLocaleString()} and ${DECIMAL_MAX.toLocaleString()}. `
  }
  
  if (data.salary_max !== '' && (Number(data.salary_max) < DECIMAL_MIN || Number(data.salary_max) > DECIMAL_MAX)) {
    message += `Salary Max must be between ${DECIMAL_MIN.toLocaleString()} and ${DECIMAL_MAX.toLocaleString()}. `
  }
  if (data.job_type !== '' && data.job_type.length > 20) {
    message += 'Job Type cannot be greater than 20 characters. '
  }

  if (data.posting_url !== '' && data.posting_url.length > 500) {
    message += 'Posting URL cannot be greater than 500 characters. '
  }
  else if (data.posting_url && !/^https?:\/\//i.test(data.posting_url)) {
    data.posting_url = 'https://' + data.posting_url;
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
    resetInputs();
  }
  if (e.target.id === 'add-requirements-field') {
    addCustomFieldRow('requirements-custom-rows');
  }
  if (e.target.classList.contains('remove-field-btn')) {
    e.target.closest('.custom-row').remove();
  }
  if (e.target.classList.contains('tag-remove')) {
    e.target.closest('.skill-tag').remove();
  }
});

modalOverlay.addEventListener('keydown', (e) => {
  if (e.target.id === 'skill-input' && (e.key === 'Enter' || e.key === ',')) {
    e.preventDefault();
    const val = e.target.value.trim().replace(/,$/, '');
    if (val) {
      addSkillTag('skills-tags', val);
      e.target.value = '';
    }
  }
});



document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'post-form') return;
  e.preventDefault();

  const formData = new FormData(e.target);
  let data = Object.fromEntries(formData.entries());

  data = validateInputs(data);
  if (!data) return;

  const skills = collectSkills('skills-tags');
  const customFields = collectCustomFields('requirements-custom-rows');
  const requirements = { ...customFields };
  if (skills.length > 0) requirements.required_skills = skills;
  if (Object.keys(requirements).length > 0) data.requirements = requirements;

  const res = await fetch('/jobs/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    const resData = await res.json();
    addRow(resData.job);
    modalOverlay.classList.remove('active');
    resetInputs();
  }
});
