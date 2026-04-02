async function fetchDashboardStats() {
  const response = await fetch('/dashboard/api/stats');
  return response.json();
}


function renderSummaryCards(summary) {
  const responseRate = summary.total_applications > 0 ? summary.response_rate + '%' : 'N/A';
  const coverLetterRate = summary.total_applications > 0 ? summary.cover_letter_rate + '%' : 'N/A';

  document.querySelector('.js-summary-cards').innerHTML = `
    <div class="grid-container">
      <div class="card">
        <p class="card-label">Total Applications</p>
        <span class="card-value">${summary.total_applications}</span>
      </div>
      <div class="card">
        <p class="card-label">Active Applications</p>
        <span class="card-value">${summary.active_applications}</span>
      </div>
      <div class="card">
        <p class="card-label">Companies Tracked</p>
        <span class="card-value">${summary.companies_count}</span>
      </div>
      <div class="card">
        <p class="card-label">Response Rate</p>
        <span class="card-value">${responseRate}</span>
      </div>
      <div class="card">
        <p class="card-label">Cover Letter Rate</p>
        <span class="card-value">${coverLetterRate}</span>
      </div>
      <div class="card">
        <p class="card-label">Offers Received</p>
        <span class="card-value">${summary.offers_received}</span>
      </div>
    </div>
  `;
}


function renderRecentActivity(recentActivity) {
  let activities = '';

  if (recentActivity.length === 0) {
    activities = '<p class="empty-state">No recent activity.</p>';
  } else {
    recentActivity.forEach((activity) => {
      const date = activity.application_date
        ? new Date(activity.application_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '';
      activities += `
        <div class="activity">
          <div>
            <div class="job-title">${activity.job_title}</div>
            <div class="company-date">${activity.company_name} &bull; ${date}</div>
          </div>
          <div class="status">${activity.status ?? ''}</div>
        </div>
      `;
    });
  }

  document.querySelector('.js-activity-layout').innerHTML = activities;
}


function renderUpcomingInterviews(upcomingInterviews) {
  let interviews = '';

  if (upcomingInterviews.length === 0) {
    interviews = '<p class="empty-state">No upcoming interviews.</p>';
  } else {
    upcomingInterviews.forEach((interview) => {
      interviews += `
        <div class="upcoming">
          <div>
            <div class="job-title">${interview.job_title}</div>
            <div class="company">${interview.company_name}</div>
          </div>
          <div class="date">
            <div>${interview.interview_date}</div>
            <div>${interview.interview_time}</div>
          </div>
        </div>
      `;
    });
  }

  document.querySelector('.js-upcoming-layout').innerHTML = interviews;
}


const STATUS_BAR_CLASS = {
  'Applied': 'applied-bar',
  'Phone Screen': 'phone-bar',
  'Interview Scheduled': 'interview-bar',
  'Interview Completed': 'interview-completed-bar',
  'Offer': 'offer-bar',
  'Rejected': 'rejected-bar'
};

function renderAppPipeline(pipeline, total) {
  const bars = pipeline.map((item) => {
    const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
    const barClass = STATUS_BAR_CLASS[item.status] || 'applied-bar';
    const id = barClass + '-' + item.status.toLowerCase().replace(/\s+/g, '-');
    return { ...item, pct, barClass, id };
  });

  const pipelineHTML = bars.map((item) => `
    <div class="app">
      <div class="app-details">
        <div>${item.status}</div>
        <div>${item.count}</div>
      </div>
      <div class="bar-track">
        <div id="${item.id}" class="${item.barClass}"></div>
      </div>
    </div>
  `).join('');

  document.querySelector('.js-app-pipeline').innerHTML = `
    <div class="app-pipeline-container">
      <p>Application Pipeline</p>
      <div class="pipeline-layout">
        ${pipelineHTML}
      </div>
    </div>
  `;

  bars.forEach((item) => {
    const el = document.getElementById(item.id);
    if (el) el.style.width = item.pct + '%';
  });
}


async function init() {
  const data = await fetchDashboardStats();
  const total = data.summary.total_applications;

  renderSummaryCards(data.summary);
  renderRecentActivity(data.recent_activity);
  renderUpcomingInterviews(data.upcoming_interviews);
  renderAppPipeline(data.pipeline, total);
}

init();
