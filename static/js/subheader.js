

function renderSubheader() {

  const currentPagePath = window.location.pathname;
  const currentHTMLFile = currentPagePath.split('/').filter(Boolean).pop().replace('.html', '');

  /* 
  Since Flask adds a trailing slash ('/') at the end ('/job-match/', currentHTMLFile would just become an empty string. 
  
  filter(Boolean) strips empty strings from the split result.
   - It checks '/job-match/, gets ['', 'job-match', ''], and returns true if the string isn't empty, meaning it outputs 'job-match'.
  */

  let title = '';
  let subtitle = '';
  let buttonText = '';
  switch (currentHTMLFile) {
    case 'jobs':
      title = 'Jobs';
      subtitle = 'Open positions you\'re tracking: 8';
      buttonText = 'Add Job';
      break;
    case 'companies':
      title = 'Companies';
      subtitle = 'Organizations you\'re targeting: 7';
      buttonText = 'Add Company';
      break;
    case 'applications':
      title = 'Applications';
      subtitle = 'Track every application you\'ve submitted: 8';
      buttonText = 'Add Application';
      break;
    case 'contacts':
      title = 'Contacts';
      subtitle = 'People in your professional network: 7';
      buttonText = 'Add Contact';
      break;
    case 'job-match':
      title = 'Job Match';
      subtitle = 'Enter your skills to see jobs you fit!';
      buttonText = 'Add Skill';
      break;
  }

  let subheader = `    
    <div class="subheader-flex">
      <div class="title-group">
          <h1>${title}</h1>
          ${subtitle}
      </div>
      <div class="add-div">
        <button id='add-btn'>
          <ion-icon name="add-outline"></ion-icon>
          ${buttonText}
        </button>
      </div>
    </div>
  `;



  document.querySelector('.js-subheader').innerHTML = subheader;
}

renderSubheader();
