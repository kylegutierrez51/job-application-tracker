

function renderHeader() {
  
  const currentPagePath = window.location.pathname;

  const currentHTMLFile = currentPagePath.split('/').pop();

  let activePage = '';

  switch (currentHTMLFile) {
    case 'dashboard.html':
      activePage = 'a-dash';
      break;
    case 'jobs.html':
      activePage = 'a-jobs';
      break;
    case 'companies.html':
      activePage = 'a-comp';
      break;
    case 'applications.html':
      activePage = 'a-appl';
      break;
    case 'contacts.html':
      activePage = 'a-cont';
      break;
    case 'job_match.html':
      activePage = 'a-match';
      break;
  }


  const header = `
      <div>
        <nav>
          <a class="${activePage === 'a-dash' ? 'a-dash' : ''}"  href="dashboard.html">Dashboard</a>
          <a class="${activePage === 'a-jobs' ? 'a-jobs' : ''}" href="jobs.html">Jobs</a>
          <a class="${activePage === 'a-comp' ? 'a-comp' : ''}" href="companies.html">Companies</a>
          <a class="${activePage === 'a-appl' ? 'a-appl' : ''}" href="applications.html">Applications</a>
          <a class="${activePage === 'a-cont' ? 'a-cont' : ''}" href="contacts.html">Contacts</a>
          <a class="${activePage === 'a-match' ? 'a-match' : ''}" href="job_match.html">Job Match</a>
        </nav>
      </div>
  `;

  document.querySelector('.js-header-nav').innerHTML = header;
}

renderHeader();