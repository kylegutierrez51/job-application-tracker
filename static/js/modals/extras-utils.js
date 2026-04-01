export function addSkillTag(containerId, skill) {
  const container = document.getElementById(containerId);
  if (!container || !skill.trim()) return;

  const tag = document.createElement('span');
  tag.className = 'skill-tag';
  tag.dataset.value = skill.trim();
  tag.textContent = skill.trim();

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'tag-remove';
  removeBtn.textContent = '×';
  tag.appendChild(removeBtn);

  container.appendChild(tag);
}

export function addCustomFieldRow(containerId, key = '', value = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'custom-row';

  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.className = 'field-key';
  keyInput.placeholder = 'Field';
  keyInput.value = key;
  keyInput.autocomplete = 'off';

  const valInput = document.createElement('input');
  valInput.type = 'text';
  valInput.className = 'field-value';
  valInput.placeholder = 'Value';
  valInput.value = value;
  valInput.autocomplete = 'off';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-field-btn';
  removeBtn.textContent = '×';

  row.appendChild(keyInput);
  row.appendChild(valInput);
  row.appendChild(removeBtn);
  container.appendChild(row);
}

export function collectSkills(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return [];
  return [...container.querySelectorAll('.skill-tag')].map(t => t.dataset.value);
}

export function collectCustomFields(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return {};
  const result = {};
  container.querySelectorAll('.custom-row').forEach(row => {
    const key = row.querySelector('.field-key').value.trim();
    const val = row.querySelector('.field-value').value.trim();
    if (key) result[key] = val;
  });
  return result;
}

export function clearExtras(skillsId, customRowsId) {
  const s = document.getElementById(skillsId);
  if (s) s.innerHTML = '';
  const c = document.getElementById(customRowsId);
  if (c) c.innerHTML = '';
}

export function renderRequirementsHtml(requirements) {
  if (!requirements || Object.keys(requirements).length === 0) return '-';
  let html = '';

  if (requirements.required_skills && requirements.required_skills.length > 0) {
    html += '<div class="req-skills-display">';
    requirements.required_skills.forEach(skill => {
      html += `<span class="skill-tag-view">${escapeHtml(skill)}</span>`;
    });
    html += '</div>';
  }

  const customKeys = Object.keys(requirements).filter(k => k !== 'required_skills');
  if (customKeys.length > 0) {
    html += '<div class="req-custom-display">';
    customKeys.forEach(key => {
      html += `<div class="req-custom-row"><span class="req-key">${escapeHtml(key)}</span> ${escapeHtml(String(requirements[key]))}</div>`;
    });
    html += '</div>';
  }

  return html || '-';
}

export function renderKeyValueHtml(data) {
  if (!data || Object.keys(data).length === 0) return '-';
  let html = '<div class="req-custom-display">';
  Object.entries(data).forEach(([key, val]) => {
    html += `<div class="req-custom-row"><span class="req-key">${escapeHtml(key)}</span> ${escapeHtml(String(val))}</div>`;
  });
  html += '</div>';
  return html;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
