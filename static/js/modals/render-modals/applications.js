async function fetchJobs() {
  const res = await fetch('/jobs/api');
  const data = await res.json();
  return data.jobs;
}

async function init() {
  const jobs = await fetchJobs();
  renderModalOverlay(jobs);
  renderDetailModalOverlay(jobs);
}

init();


function renderModalOverlay(jobs) {
  const jobOptions = jobs.map(j =>
    `<option value="${j.job_id}">${j.job_title} - ${j.company_name}</option>`
  ).join('');

  const modalOverlay = `
    <div class="container">
      <div class="container-header">
        <h3>New Application</h3>
        <button class="close-btn" id="close-btn">x</button>
      </div>

      <form id="post-form">
        <div class="applications-grid-container">
          <div class="job-box">
            <label>Job</label>
            <select name="job_id">
              <option value="" disabled selected>Select...</option>
              ${jobOptions}
            </select>
          </div>

          <div class="status-box">
            <label>Status</label>
            <select name="status">
              <option value="" disabled selected>Select...</option>
              <option value="Applied">Applied</option>
              <option value="Phone Screen">Phone Screen</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div class="applied-date-box">
            <label>Applied Date</label>
            <input class="date-input" type="date" name="application_date" />
          </div>

          <div class="response-date-box">
            <label>Response Date</label>
            <input type="date" name="response_date" />
          </div>

          <div class="resume-box">
            <label>Resume Version</label>
            <input name="resume_version" />
          </div>

          <div class="cover-letter-box">
            <label>Cover Letter Sent</label>
            <label class="checkbox">
              <input type="checkbox" name="cover_letter_sent" value="1" />
              Yes
            </label>
          </div>

          <div class="interview-date-box">
            <label>Interview Date</label>
            <input type="datetime-local" name="interview_date" />
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


function renderDetailModalOverlay(jobs) {
  const jobOptions = jobs.map(j =>
    `<option value="${j.job_id}">${j.job_title} - ${j.company_name}</option>`
  ).join('');

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
          <select id="edit-job" class="detail-edit-select">
            <option value="" disabled>Select...</option>
            ${jobOptions}
          </select>
        </div>
        <div class="detail-field">
          <label>Company</label>
          <span id="detail-company" class="detail-view-value"></span>
        </div>
        <div class="detail-field">
          <label>Applied</label>
          <span id="detail-applied" class="detail-view-value"></span>
          <input id="edit-applied" class="detail-edit-input" type="date" />
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
          <label class="checkbox detail-edit-input">
            <input id="edit-cover-letter" type="checkbox" value="1" />
            Sent
          </label>
        </div>
        <div class="detail-field">
          <label>Response Date</label>
          <span id="detail-response" class="detail-view-value"></span>
          <input id="edit-response" class="detail-edit-input" type="date" />
        </div>
        <div class="detail-field">
          <label>Interview</label>
          <span id="detail-interview" class="detail-view-value"></span>
          <input id="edit-interview" class="detail-edit-input" type="datetime-local" />
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
