

function renderHeader() {
  
  const currentPagePath = window.location.pathname;

  const currentHTMLFile = currentPagePath.split('/').filter(Boolean).pop()?.replace('.html', '') || 'dashboard'; 

  /* 
  Default to dashboard if filter(Boolean) returns false for all strings in array 
  
  For dashboard, filter(Boolean) checks ['', '', ''], returning false for each
  */

  let activePage = '';

  switch (currentHTMLFile) {
    case 'dashboard':
      activePage = 'a-dash';
      break;
    case 'jobs':
      activePage = 'a-jobs';
      break;
    case 'companies':
      activePage = 'a-comp';
      break;
    case 'applications':
      activePage = 'a-appl';
      break;
    case 'contacts':
      activePage = 'a-cont';
      break;
    case 'job-match':
      activePage = 'a-match';
      break;
  }


  const header = `
      <div>
        <nav>
          <a class="${activePage === 'a-dash' ? 'a-dash' : ''}"  href="/">Dashboard</a>
          <a class="${activePage === 'a-jobs' ? 'a-jobs' : ''}" href="jobs">Jobs</a>
          <a class="${activePage === 'a-comp' ? 'a-comp' : ''}" href="companies">Companies</a>
          <a class="${activePage === 'a-appl' ? 'a-appl' : ''}" href="applications">Applications</a>
          <a class="${activePage === 'a-cont' ? 'a-cont' : ''}" href="contacts">Contacts</a>
          <a class="${activePage === 'a-match' ? 'a-match' : ''}" href="job-match">Job Match</a>
        </nav>
      </div>
  `;

  document.querySelector('.js-header-nav').innerHTML = header;
}

renderHeader();