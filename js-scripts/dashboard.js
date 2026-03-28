

function renderSummaryCards() {
  let summaryCards = `
    <div class="grid-container">
      <div class="card">
        <p class="card-label">Total Applications</p>
        <span class="card-value">${24}</span>
      </div>
      <div class="card">
        <p class="card-label">Active Applications</p>
        <span class="card-value">${12}</span>
      </div>
      <div class="card">
        <p class="card-label">Companies Tracked</p>
        <span class="card-value">${4}</span>
      </div>
      <div class="card">
        <p class="card-label">Response Rate</p>
        <span class="card-value">${63 + '%'}</span>
      </div>
      <div class="card">
        <p class="card-label">Cover Letter Rate</p>
        <span class="card-value">${90 + '%'}</span>
      </div>
      <div class="card">
        <p class="card-label">Offers Received</p>
        <span class="card-value">${1}</span>
      </div>
    </div>  
  `;

  document.querySelector('.js-summary-cards').innerHTML = summaryCards;
}

renderSummaryCards();