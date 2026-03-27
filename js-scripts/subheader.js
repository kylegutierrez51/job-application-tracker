

function renderSubheader() {

  const currentPagePath = window.location.pathname;
  const currentHTMLFile = currentPagePath.split('/').pop();

  let title = '';
  let subtitle = '';
  let buttonText = '';
  switch (currentHTMLFile) {
    case 'dashboard.html':
      title = 'Dashboard';
      subtitle = 'Your job search at a glance'
      buttonText = ''
      break;
    case 'jobs.html':
      title = 'Jobs';
      subtitle = 'Open positions you\'re tracking: 8';
      buttonText = 'Add Job'
      break;
    case 'companies.html':
      title = 'Companies';
      subtitle = 'Organizations you\'re targeting: 7';
      buttonText = 'Add Company'
      break;
    case 'applications.html':
      title = 'Applications';
      subtitle = 'Track every application you\'ve submitted: 8';
      buttonText = 'Add Application'
      break;
    case 'contacts.html':
      title = 'Contacts';
      subtitle = 'People in your professional network: 7';
      buttonText = 'Add Contact'
      break;
    case 'job_match.html':
      title = 'Job Match';
      subtitle = 'Enter your skills to see jobs you fit!';
      buttonText = 'Add Skill'
      break;
  }

  let subheader = `    
    <div class="subheader-flex ${buttonText.length === 0 ? "no-border dashboard" : ''}">
      <div class="title-group">
          <h1>${title}</h1>
          ${subtitle}
      </div>
      <div class="add-div">
      ${buttonText.length !== 0 ? 
        `
        <button>
          <ion-icon name="add-outline"></ion-icon>
          ${buttonText}
        </button>
        ` : ''
      }
      </div>
    </div>
  `;



  document.querySelector('.js-subheader').innerHTML = subheader;
}

renderSubheader();
