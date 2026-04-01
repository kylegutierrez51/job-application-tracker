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
}


function addRow(job) {
  const tbody = document.querySelector('.js-table-rows');
  const index = tbody.rows.length;
  const tr = document.createElement('tr');
  tr.dataset.index = index;
  tr.classList.add('clickable-row');

  tr.innerHTML = `
    <td>${job.job_title || '-'}</td>
    <td>${job.company_name || '-'}</td>
    <td>${job.salary_min !== null ? '$' + job.salary_min : 'None'}</td>
    <td>${job.salary_max !== null ? '$' + job.salary_max : 'None'}</td>
    <td>${job.job_type || '-'}</td>
    <td>${job.date_posted || '-'}</td>
    <td>${job.is_active ? 'Active' : 'Inactive'}</td>
    <td>${job.posting_url ? `<a href="${job.posting_url}" target="_blank">View</a>` : '-'}</td>
  `

  tbody.appendChild(tr);

}


subheader.addEventListener('click', (e) => {
  if (e.target.id === 'add-btn') modalOverlay.classList.add('active');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target.id === 'close-btn' || e.target.id === 'cancel-btn') {
    modalOverlay.classList.remove('active');
    resetInputs();
}});



document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'post-form') return;
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const res = await fetch('/jobs/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    // Gets company id, then uses it to find the company name before adding the row
    const companySelect = e.target.querySelector('select[name="company_id"]');
    data.company_name = companySelect.options[companySelect.selectedIndex].text;
    // the "const options" in render-modals/jobs.js adds in the company name as the input.
    // this just gets the text that's put in the <input> tag BEFORE resetInputs() is called.

    addRow(data);
    modalOverlay.classList.remove('active');
    resetInputs();
  }
});

