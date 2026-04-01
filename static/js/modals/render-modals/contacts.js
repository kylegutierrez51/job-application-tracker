async function fetchCompanies() {
  const res = await fetch('/companies/api');
  const data = await res.json();
  return data.companies;
}

async function init() {
  const companies = await fetchCompanies();
  renderModalOverlay(companies);
  renderDetailModalOverlay(companies);
}

init();


function renderModalOverlay(companies) {
  const companyOptions = companies.map(c =>
    `<option value="${c.company_id}">${c.company_name}</option>`
  ).join('');

  const modalOverlay = `
    <div class="container">
      <div class="container-header">
        <h3>New Contact</h3>
        <button class="close-btn" id="close-btn">x</button>
      </div>

      <form id="post-form">
        <div class="contacts-grid-container">
          <div class="firstname-box">
            <label>First Name</label>
            <input name="first_name" />
          </div>

          <div class="lastname-box">
            <label>Last Name</label>
            <input name="last_name" />
          </div>

          <div class="company-box">
            <label>Company</label>
            <select name="company_id">
              <option value="" disabled selected>Select...</option>
              ${companyOptions}
            </select>
          </div>

          <div class="job-title-box">
            <label>Job Title</label>
            <input name="job_title" />
          </div>

          <div class="email-box">
            <label>Email</label>
            <input name="email" />
          </div>

          <div class="phone-box">
            <label>Phone</label>
            <input name="phone" />
          </div>

          <div class="linkedin-box">
            <label>LinkedIn URL</label>
            <input name="linkedin_url" />
          </div>

          <div class="notes-box">
            <label>Notes</label>
            <textarea name="notes"></textarea>
          </div>
        </div>

        <div class="options">
          <button id="cancel-btn" class="cancel-btn" type="button">Cancel</button>
          <button id="create-btn" class="create-btn" type="submit">Create</button>
        </div>
      </form>
    </div>
  `;

  document.querySelector('.js-modal-overlay').innerHTML = modalOverlay;
}


function renderDetailModalOverlay(companies) {
  const companyOptions = companies.map(c =>
    `<option value="${c.company_id}">${c.company_name}</option>`
  ).join('');

  const detailModalOverlay = `
    <div class="container">
      <div class="container-header">
        <h3>Contact Details</h3>
        <button class="close-btn" id="close-details-btn">x</button>
      </div>

      <div class="detail-grid">
        <div class="detail-field">
          <label>First Name</label>
          <span id="detail-fname" class="detail-view-value"></span>
          <input id="edit-fname" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Last Name</label>
          <span id="detail-lname" class="detail-view-value"></span>
          <input id="edit-lname" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Company</label>
          <span id="detail-company" class="detail-view-value"></span>
          <select id="edit-company" class="detail-edit-select">
            <option value="" disabled>Select...</option>
            ${companyOptions}
          </select>
        </div>
        <div class="detail-field">
          <label>Title</label>
          <span id="detail-title" class="detail-view-value"></span>
          <input id="edit-title" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Email</label>
          <span id="detail-email" class="detail-view-value"></span>
          <input id="edit-email" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Phone</label>
          <span id="detail-phone" class="detail-view-value"></span>
          <input id="edit-phone" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>LinkedIn</label>
          <span id="detail-linkedin" class="detail-view-value"></span>
          <input id="edit-linkedin" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Created</label>
          <span id="detail-created"></span>
        </div>
        <div class="detail-field detail-field--full">
          <label>Notes</label>
          <span id="detail-notes" class="detail-view-value"></span>
          <textarea id="edit-notes" class="detail-edit-textarea"></textarea>
        </div>
      </div>

      <div class="detail-actions">
        <button class="delete-btn detail-view-btn">Delete</button>
        <div class="detail-delete-div">
          <div class="confirm-delete-text">Delete this record?</div>
          <button class="delete-confirm-btn">Yes, delete</button>
          <button class="delete-close-btn">No</button>
        </div>
        <button class="edit-btn detail-view-btn">Edit</button>
        <button class="cancel-edit-btn detail-edit-btn">Cancel</button>
        <button class="save-btn detail-edit-btn">Save</button>
      </div>
    </div>
  `;

  document.querySelector('.js-detail-modal-overlay').innerHTML = detailModalOverlay;
}
