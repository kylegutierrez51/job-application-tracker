

function renderHeader() {
  
  const currentPagePath = window.location.pathname;

  const currentHTMLFile = currentPagePath.split('/').pop();

  switch (currentHTMLFile) {
    case 'dashboard.html':
      console.log('dashboard');
      break;
    case 'jobs.html':
      console.log('jobs');
      break;
    case 'companies.html':
      console.log('companies');
      break;
    case 'applications.html':
      console.log('applications');
      break;
    case 'contacts.html':
      console.log('contacts');
      break;
    case 'job_match.html':
      console.log('job match');
      break;
  }


  const header = `
      <div>
        <nav>
          <a href="dashboard.html">Dashboard</a>
          <a href="applications.html">Applications</a>
          <a href="companies.html">Companies</a>
          <a href="contacts.html">Contacts</a>
          <a href="jobs.html">Jobs</a>
          <a href="job_match.html">Job Match</a>
        </nav>
      </div>
  `

  document.querySelector('.js-header-nav').innerHTML = header;
}

renderHeader();