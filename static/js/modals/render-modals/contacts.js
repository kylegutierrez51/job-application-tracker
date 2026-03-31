function renderModalOverlay() {
  const modalOverlay = `
    <div class="container">
      <div class="container-header">
        <h3>New Contact</h3>
        <button class="close-btn" id="close-btn">x</button>
      </div>
      
      <form action="/url_route" method="POST">
        <div class="contacts-grid-container">
          <div class="firstname-box">
            <label>First Name</label>
            <input />
          </div>

          <div class="lastname-box">
            <label>Last Name</label>
            <input />
          </div>

          <div class="company-box">
            <label>Company</label>
            <select>
              <option value="" disabled selected>Select...</option>
              <option value="1">Stripe</option>
              <option value="2">Figma</option>
              <option value="3">Notion</option>
              <option value="4">Vercel</option>
              <option value="5">Linear</option>
              <option value="6">Datadog</option>
              <option value="7">Plaid</option>
            </select>
          </div>

          <div class="job-title-box">
            <label>Job Title</label>
            <input />
          </div>

          <div class="email-box">
            <label>Email</label>
            <input />
          </div>

          <div class="phone-box">
            <label>Phone</label>
            <input />
          </div>

          <div class="linkedin-box">
            <label>LinkedIn URL</label>
            <input />
          </div>

          <div class="notes-box">
            <label>Notes</label>
            <textarea></textarea>
          </div>
        </div>
        
        <div class="options">
          <button id="cancel-btn" class="cancel-btn">Cancel</button>
          <button id="create-btn" class="create-btn">Create</button>
        </div>
      </form>
    </div>
  `;

  
  document.querySelector('.js-modal-overlay').innerHTML = modalOverlay;
}


function renderDetailModalOverlay() {
  const detailModalOverlay = `
    <div class="container">
      <div class="container-header">
        <h3>Contact Details</h3>
        <button class="close-btn" id="close-details-btn">x</button>
      </div>

      <div class="detail-grid">
        <div class="detail-field">
          <label>Name</label>
          <span id="detail-name" class="detail-view-value"></span>
          <input id="edit-name" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Company</label>
          <span id="detail-company" class="detail-view-value"></span>
          <select id="edit-company" class="detail-edit-select">
            <option value="" disabled>Select...</option>
            <option value="Stripe">Stripe</option>
            <option value="Figma">Figma</option>
            <option value="Notion">Notion</option>
            <option value="Vercel">Vercel</option>
            <option value="Linear">Linear</option>
            <option value="Datadog">Datadog</option>
            <option value="Plaid">Plaid</option>
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

renderModalOverlay();
renderDetailModalOverlay();