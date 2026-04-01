const addButton = document.getElementById('add-btn');
const modalOverlay = document.getElementById('modal-overlay'); 

/*
Event delegation -- rather than defining xButton and cancelButton button variables, we
define "modalOverlay".

We define modalOverlay since job-details.js's renderModalOverlay is async since it has to fetch data. 
This means that this js file runs before renderModalOverlay finishes, meaning that buttons like the xButton and cancelButton give errors since they're rendered only in renderModalOverlay.

But the id #modal-overlay is in the static HTML (templates/jobs.html) from the start.

We do the same thing in job-detail-modal.js. -- Remove Edit, Delete, Cancel, X buttons
*/


function resetInputs() {
  document.getElementById("post-form").reset();
}

function addRow(company) {
  const tbody = document.querySelector('.js-table-rows');
  const index = tbody.rows.length;
  const tr = document.createElement('tr');
  tr.dataset.index = index;
  tr.classList.add('clickable-row');

  tr.innerHTML = `
    <td>${company.company_name}</td>
    <td>${company.industry || '-'}</td>
    <td>${company.website || '-'}</td>
    <td>${concatenateCityState(company)}</td>
    <td>${0}</td>
    <td>${0}</td>
    <td>${company.notes}</td>
    <td>${company.created_at.substring(0, 10)}</td>
  `

  tbody.appendChild(tr);
}

function concatenateCityState(company) {
  let result = null;
  if (company.city !== null && company.state !== null) {
    result = company.city + ', ' + company.state
  } else if (company.city !== null) {
    result = company.city
  } else if (company.state !== null) {
    result = company.state
  } else {
    result = '-'
  }
  return result
}



addButton.addEventListener('click', () => {
  modalOverlay.classList.add('active');
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

  const res = await fetch('/companies/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  console.log(res.ok);
  if (res.ok) {
    const resData = await res.json();
    addRow({ ...data, created_at: resData.created_at });
    modalOverlay.classList.remove('active');
    resetInputs();
  }
});

