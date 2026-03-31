function renderModalOverlay() {
  const modalOverlay = `
    <div class="container">
      <div class="container-header">
        <h3>New Company</h3>
        <button class="close-btn" id="close-btn">x</button>
      </div>

      <form action="/companies" method="POST">
        <div class="company-grid-container">
          
          <div class="company-box">
            <label>Company Name</label>
            <input name="company_name">
          </div>

          <div class="industry-box">
            <label>Industry</label>
            <input name="industry">
          </div>

          <div class="city-box">
            <label>City</label>
            <input name="city">
          </div>

          <div class="state-box">
            <label>State</label>
            <input name="state">
          </div>

          <div class="website-box">
            <label>Website</label>
            <input name="website">
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




function renderDetailModalOverlay() {
  const detailModalOverlay = `
    <div class="container">
      <div class="container-header">
        <h3>Company Details</h3>
        <button class="close-btn" id="close-details-btn">x</button>
      </div>

      <div class="detail-grid">
        <div class="detail-field">
          <label>Company</label>
          <span id="detail-name" class="detail-view-value"></span>
          <input id="edit-name" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Industry</label>
          <span id="detail-industry" class="detail-view-value"></span>
          <input id="edit-industry" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Website</label>
          <span id="detail-website" class="detail-view-value"></span>
          <input id="edit-website" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Location</label>
          <span id="detail-location" class="detail-view-value"></span>
          <input id="edit-location" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Jobs</label>
          <span id="detail-jobs"></span>
        </div>
        <div class="detail-field">
          <label>Contacts</label>
          <span id="detail-contacts"></span>
        </div>
        <div class="detail-field">
          <label>Added</label>
          <span id="detail-added"></span>
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