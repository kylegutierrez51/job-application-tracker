





async function get_count(url) {
  const res = await fetch(`${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (res.ok) {
    const data = await res.json();
    return data['count']
  }
  return '-';
}


async function renderSubheader() {

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
  let count = '-';

  switch (currentHTMLFile) {
    case 'jobs':
      count = await get_count('/jobs/api/count')

      title = 'Jobs';
      subtitle = `Open positions you\'re tracking: ${count}`;
      buttonText = 'Add Job';
      break;
    case 'companies':
      count = await get_count('/companies/api/count')

      title = 'Companies';
      subtitle = `Organizations you\'re targeting: ${count}`;
      buttonText = 'Add Company';
      break;
    case 'applications':
      count = await get_count('/applications/api/count')

      title = 'Applications';
      subtitle = `Track every application you\'ve submitted: ${count}`;
      buttonText = 'Add Application';
      break;
    case 'contacts':
      count = await get_count('/contacts/api/count')

      title = 'Contacts';
      subtitle = `People in your professional network: ${count}`;
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
