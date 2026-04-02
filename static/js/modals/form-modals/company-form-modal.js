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

function addRow(company) {
  const tbody = document.querySelector('.js-table-rows');
  const index = tbody.rows.length;
  const tr = document.createElement('tr');
  tr.dataset.index = index;
  tr.dataset.company = JSON.stringify(company);
  tr.classList.add('clickable-row');

  tr.innerHTML = `
    <td>${company.company_name}</td>
    <td>${company.industry || '-'}</td>
    <td>${company.website || '-'}</td>
    <td>${concatenateCityState(company)}</td>
    <td>${0}</td>
    <td>${0}</td>
    <td>${company.notes ? (company.notes.length > 30 ? company.notes.substring(0, 30) + '...' : company.notes) : '-'}</td>
    <td>${company.created_at.substring(0, 10)}</td>
  `

  tbody.appendChild(tr);

  const countElement = document.getElementById('subtitle-count');
  let currCount = Number(countElement.textContent);
  countElement.textContent = ++currCount;
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




function validateInputs(data) {
  let message = '';


  if (!data.company_name) {
    message += 'Company Name is required. ';
  }

  if(data.company_name.length > 100) {
    message += 'Company Name cannot be greater than 100 characters. '
  }

  if (data.industry !== '' && data.industry.length > 50) {
    message += 'Industry cannot be greater than 50 characters. '
  }

  if (data.website !== '' && data.website.length > 200) {
    message += 'Website cannot be greater than 200 characters. '
  }

  if (data.city !== '' && data.city.length > 50) {
    message += 'City cannot be greater than 50 characters. '
  }

  if (data.state !== '' && data.state.length > 50) {
    message += 'State cannot be greater than 50 characters. '
  }

  
  if (message.length > 0) {
    alert(message);
    return undefined;
  }
  return true;
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

  console.log('here');

  if(!validateInputs(data)) return;

  console.log('there');

  const res = await fetch('/companies/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  console.log(res.ok);
  if (res.ok) {
    const resData = await res.json();
    addRow(resData.company);
    modalOverlay.classList.remove('active');
    resetInputs();
  }
});

