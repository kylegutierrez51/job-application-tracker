import { jobs, companies, contacts, applications } from './sample-data.js'


function renderTable() {

  const currentPagePath = window.location.pathname;
  const currentHTMLFile = currentPagePath.split('/').pop();

  let tableRows = '';

  switch (currentHTMLFile) {
    case 'jobs.html':
      jobs.forEach((job, index) => {
        tableRows += `
          <tr data-index="${index}" class="clickable-row">
            <td>${job[0]}</td>
            <td>${job[1]}</td>
            <td>${job[2]}</td>
            <td>${job[3]}</td>
            <td>${job[4]}</td>
            <td>${job[5]}</td>
            <td>${job[6] === true ? 'View' : '-'}</td>
          </tr>
        `
      });
      break;
    case 'companies.html':
      companies.forEach((company, index) => {
        tableRows += `
          <tr data-index="${index}" class="clickable-row">
            <td>${company[0]}</td>
            <td>${company[1]}</td>
            <td>${company[2]}</td>
            <td>${company[3]}</td>
            <td>${company[4]}</td>
            <td>${company[5]}</td>
            <td>${company[6]}</td>
            <td>${company[7]}</td>
          </tr>
        `
      });
      break;
    case 'applications.html':
      applications.forEach((application, index) => {
        tableRows += `
          <tr data-index="${index}" class="clickable-row">
            <td>
              <div>${application[0]}</div>
              <div class="company">${application[1]}</div>

            </td>
            <td>${application[2]}</td>
            <td>${application[3]}</td>
            <td>${application[4]}</td>
            <td>${application[5]}</td>
            <td>${application[6]}</td>
            <td>${application[7]}</td>
            <td>${application[8]}</td>
          </tr>
        `
      });
      break;
    case 'contacts.html':
      contacts.forEach((contact, index) => {
        tableRows += `
          <tr data-index="${index}" class="clickable-row">
            <td>${contact[0]}</td>
            <td>${contact[1]}</td>
            <td>${contact[2]}</td>
            <td>${contact[3]}</td>
            <td>${contact[4]}</td>
            <td>${contact[5]}</td>
            <td>${contact[6]}</td>
          </tr>
        `
      });
      break;
  }
  document.querySelector('.js-table-rows').innerHTML = tableRows;
}



// show page view if there's more than 10 items
function renderPageView() {
  let data = null;

  const currentPagePath = window.location.pathname;
  const currentHTMLFile = currentPagePath.split('/').pop();

  switch (currentHTMLFile) {
    case 'jobs.html':
      data = jobs;
      break;
    case 'companies.html':
      data = companies;
      break;
    case 'applications.html':
      data = applications;
      break;
    case 'contacts.html':
      data = contacts;
      break;
  }
  console.log(data.length);
  if (data.length > 1) { // supposed to be "data.length > 10", but it's 1 for testing purposes

    const pages = Math.floor(data.length / 10) + 1;

    document.querySelector('.js-page-view').innerHTML = `
    <div class="page-flex">
      <div>First</div>
      <div>Prev</div>
      <div class="page-number">Page 1 of ${pages}</div>
      <div>Next</div>
      <div>Last</div>
    </div>
    `;
  }
}

renderTable();
renderPageView();