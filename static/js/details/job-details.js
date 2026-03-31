function renderModalOverlay() {
  const modalOverlay = `
    <div class="container">
      <div class="container-header">
        <h3>New Job</h3>
        <button class="close-btn" id="close-btn">x</button>
      </div>

      <form action="/url-route" method="POST">
        <div class="job-grid-container">
          <div class="job-box">
            <label>Job Title</label>
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

          <div class="min-salary-box">
            <label>Min Salary</label>
            <input />
          </div>

          <div class="max-salary-box">
            <label>Max Salary</label>
            <input />
          </div>

          <div class="job-type-box">
            <label>Job Type</label>
            <input />
          </div>

          <div class="date-box">
            <label>Date Posted</label>
            <input class="date-input" type="date" />
          </div>

          <div class="posting-box">
            <label>Posting URL</label>
            <input />
          </div>

          <div class="active-box">
            <label>Active</label>
            <label class="checkbox">
              <input type="checkbox" checked />
              Yes
            </label>
          </div>

          <div class="description-box">
            <label>Description</label>
            <textarea></textarea>
          </div>
        </div>
      </form>

      <div class="options">
        <button id="cancel-btn" class="cancel-btn">Cancel</button>
        <button id="create-btn" class="create-btn" type="submit">Create</button>
      </div>
    </div>
  `;

  document.querySelector('.js-modal-overlay').innerHTML = modalOverlay;
}




function renderDetailModalOverlay() {
  const detailModalOverlay = `
    <div class="container">
      <div class="container-header">
        <h3>Job Details</h3>
        <button class="close-btn" id="close-details-btn">x</button>
      </div>

      <div class="detail-grid">
        <div class="detail-field">
          <label>Job Title</label>
          <span id="detail-title" class="detail-view-value"></span>
          <input id="edit-title" class="detail-edit-input" />
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
          <label>Salary Min</label>
          <span id="detail-salary-min" class="detail-view-value"></span>
          <input id="edit-salary-min" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Salary Max</label>
          <span id="detail-salary-max" class="detail-view-value"></span>
          <input id="edit-salary-max" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Type</label>
          <span id="detail-type" class="detail-view-value"></span>
          <input id="edit-type" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Date Posted</label>
          <span id="detail-posted" class="detail-view-value"></span>
          <input id="edit-posted" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Status</label>
          <span id="detail-status" class="detail-view-value"></span>
          <input id="edit-status" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Link</label>
          <span id="detail-link" class="detail-view-value"></span>
          <input id="edit-link" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Created at</label>
          <span id="detail-created"></span>
        </div>

        <div class="detail-field detail-field--full">
          <label>Description</label>
          <span id="detail-description" class="detail-view-value"></span>
          <textarea id="edit-description" class="detail-edit-textarea"></textarea>
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