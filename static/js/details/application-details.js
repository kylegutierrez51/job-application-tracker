function renderModalOverlay() {
  const modalOverlay = `
    <div class="container">
      <div class="container-header">
        <h3>New Application</h3>
        <button class="close-btn" id="close-btn">x</button>
      </div>
      
      <form>
        <div class="applications-grid-container">
          <div class="job-box">
            <label>Job</label>
            <select>
              <option value="" disabled selected>Select...</option>
              <option value="1">Senior Frontend Engineer - Stripe</option>
              <option value="2">Product Designer - Figma</option>
              <option value="3">Full Stack Engineer - Notion</option>
              <option value="4">DevRel Engineer - Vercel</option>
              <option value="5">Backend Engineer - Linear</option>
              <option value="6">Site Reliability Engineer - Datadog</option>
              <option value="7">API Engineer - Plaid</option>
            </select>
          </div>

          <div class="status-box">
            <label>Status</label>
            <select>
              <option value="" disabled selected>Select...</option>
              <option value="1">Applied</option>
              <option value="2">Phone Screen</option>
              <option value="3">Interview Scheduled</option>
              <option value="4">Offer</option>
              <option value="5">Rejected</option>
            </select>
          </div>

          <div class="applied-date-box">
            <label>Applied Date</label>
            <input class="date-input" type="date" />
          </div>

          <div class="response-date-box">
            <label>Response Date</label>
            <input type="date" />
          </div>

          <div class="resume-box">
            <label>Resume Version</label>
            <input />
          </div>

          <div class="cover-letter-box">
            <label>Cover Letter Sent</label>
            <label class="checkbox">
              <input type="checkbox" />
              No
            </label>
          </div>

          <div class="interview-date-box">
            <label>Interview Date</label>
            <input type="datetime-local" />
          </div>

          <div class="notes-box">
            <label>Notes</label>
            <textarea></textarea>
          </div>
        </div>
      </form>

      <div class="options">
        <button id="cancel-btn" class="cancel-btn">Cancel</button>
        <button id="create-btn" class="create-btn">Create</button>
      </div>
    </div>
  `;

  
  document.querySelector('.js-modal-overlay').innerHTML = modalOverlay;
}


function renderDetailModalOverlay() {
  const detailModalOverlay = `
    <div class="container">
      <div class="container-header">
        <h3>Application Details</h3>
        <button class="close-btn" id="close-details-btn">x</button>
      </div>

      <div class="detail-grid">
        <div class="detail-field">
          <label>Position</label>
          <span id="detail-position" class="detail-view-value"></span>
          <select id="edit-position" class="detail-edit-select">
            <option value="" disabled>Select...</option>
            <option value="Senior Frontend Engineer - Stripe">Senior Frontend Engineer - Stripe</option>
            <option value="Product Designer - Figma">Product Designer - Figma</option>
            <option value="Full Stack Engineer - Notion">Full Stack Engineer - Notion</option>
            <option value="DevRel Engineer - Vercel">DevRel Engineer - Vercel</option>
            <option value="Backend Engineer - Linear">Backend Engineer - Linear</option>
            <option value="Site Reliability Engineer - Datadog">Site Reliability Engineer - Datadog</option>
            <option value="API Engineer - Plaid">API Engineer - Plaid</option>
          </select>
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
          <label>Applied</label>
          <span id="detail-applied" class="detail-view-value"></span>
          <input id="edit-applied" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Status</label>
          <span id="detail-status" class="detail-view-value"></span>
          <select id="edit-status" class="detail-edit-select">
            <option value="" disabled>Select...</option>
            <option value="Applied">Applied</option>
            <option value="Phone Screen">Phone Screen</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div class="detail-field">
          <label>Resume Version</label>
          <span id="detail-resume" class="detail-view-value"></span>
          <input id="edit-resume" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Cover Letter</label>
          <span id="detail-cover-letter" class="detail-view-value"></span>
          <input id="edit-cover-letter" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Response Date</label>
          <span id="detail-response" class="detail-view-value"></span>
          <input id="edit-response" class="detail-edit-input" />
        </div>
        <div class="detail-field">
          <label>Interview</label>
          <span id="detail-interview" class="detail-view-value"></span>
          <input id="edit-interview" class="detail-edit-input" />
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