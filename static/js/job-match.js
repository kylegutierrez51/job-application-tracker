import { addSkillTag, collectSkills } from './modals/extras-utils.js';

const jobsData = JSON.parse(document.getElementById('jobs-data').textContent);

const skillsContainer = document.getElementById('match-skills-tags');
const skillTextInput  = document.getElementById('match-skill-input');
const resultsGrid     = document.getElementById('match-results');
const resultsCount    = document.getElementById('match-results-count');


function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function addSkill(raw) {
  const skill = raw.trim();
  if (!skill) return;
  const existing = collectSkills('match-skills-tags').map(s => s.toLowerCase());
  if (existing.includes(skill.toLowerCase())) return;
  addSkillTag('match-skills-tags', skill);
  skillTextInput.value = '';
  renderMatches();
}

// ── Input events ─────────────────────────────────────────────────────────────

skillTextInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    addSkill(skillTextInput.value.replace(',', ''));
  }
});

// Remove tag when × is clicked
skillsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('tag-remove')) {
    e.target.closest('.skill-tag').remove();
    renderMatches();
  }
});



// ── Matching logic ────────────────────────────────────────────────────────────

function renderMatches() {
  const enteredSkills = collectSkills('match-skills-tags').map(s => s.toLowerCase());

  if (enteredSkills.length === 0) {
    resultsCount.textContent = '';
    resultsGrid.innerHTML = `
      <div class="match-prompt">
        <ion-icon name="search-outline"></ion-icon>
        <p>Enter your skills above to find matching jobs</p>
      </div>`;
    return;
  }

  const scored = jobsData
    .map(job => {
      const reqSkills = job.requirements?.required_skills ?? [];
      const reqLower  = reqSkills.map(s => s.toLowerCase());

      const matched = enteredSkills.filter(s => reqLower.includes(s));
      const missing = reqSkills.filter(s => !enteredSkills.includes(s.toLowerCase()));

      return {
        ...job,
        matchedCount:  matched.length,
        totalRequired: reqSkills.length,
        matchedSkills: matched,
        missingSkills: missing,
        matchRatio: reqSkills.length > 0 ? matched.length / reqSkills.length : 0,
      };
    })
    .filter(job => job.matchedCount > 0)
    .sort((a, b) => b.matchRatio - a.matchRatio || b.matchedCount - a.matchedCount);

  if (scored.length === 0) {
    resultsCount.textContent = '';
    resultsGrid.innerHTML = `
      <div class="match-prompt">
        <ion-icon name="sad-outline"></ion-icon>
        <p>No jobs match your skills. Try different keywords.</p>
      </div>`;
    return;
  }

  resultsCount.textContent = `${scored.length} job${scored.length !== 1 ? 's' : ''} matched`;
  resultsGrid.innerHTML = scored.map(buildCard).join('');
}


// ── Card builder ──────────────────────────────────────────────────────────────

function buildCard(job) {
  const pct = job.totalRequired > 0 ? Math.round(job.matchRatio * 100) : 0;
  const scoreClass = pct >= 75 ? 'match-high' : pct >= 40 ? 'match-mid' : 'match-low';

  const salary = formatSalary(job.salary_min, job.salary_max);

  const matchedHtml = job.matchedSkills
    .map(s => `<span class="pill pill-matched">${escapeHtml(s)}</span>`)
    .join('');

  const shownMissing = job.missingSkills.slice(0, 5);
  const extraMissing = job.missingSkills.length - shownMissing.length;
  const missingHtml  = shownMissing
    .map(s => `<span class="pill pill-missing">${escapeHtml(s)}</span>`)
    .join('') + (extraMissing > 0 ? `<span class="pill-more">+${extraMissing} more</span>` : '');

  return `
    <div class="match-card">

      <div class="match-card-top">
        <div class="match-card-title-group">
          <div class="match-card-title">${escapeHtml(job.job_title)}</div>
          <div class="match-card-company">${escapeHtml(job.company_name)}</div>
        </div>
        <div class="match-score ${scoreClass}">
          <span class="match-score-pct">${pct}%</span>
          <span class="match-score-label">${job.matchedCount} / ${job.totalRequired} skills</span>
        </div>
      </div>

      <div class="match-card-meta">
        ${salary       ? `<span class="meta-badge">${escapeHtml(salary)}</span>` : ''}
        ${job.job_type ? `<span class="meta-badge">${escapeHtml(job.job_type)}</span>` : ''}
        <span class="meta-badge ${job.is_active ? 'meta-active' : 'meta-inactive'}">
          ${job.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      ${matchedHtml ? `
        <div class="match-skill-row">
          <span class="skill-row-label">Matched</span>
          <div class="pill-list">${matchedHtml}</div>
        </div>` : ''}

      ${missingHtml ? `
        <div class="match-skill-row">
          <span class="skill-row-label">Missing</span>
          <div class="pill-list">${missingHtml}</div>
        </div>` : ''}

      ${job.posting_url ? `
        <div class="match-card-footer">
          <a href="${escapeHtml(job.posting_url)}" target="_blank" class="view-btn">
            View Posting <ion-icon name="open-outline"></ion-icon>
          </a>
        </div>` : ''}

    </div>`;
}

function formatSalary(min, max) {
  const fmt = n => `$${Number(n).toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min)        return `From ${fmt(min)}`;
  if (max)        return `Up to ${fmt(max)}`;
  return null;
}


// Initial render
renderMatches();
