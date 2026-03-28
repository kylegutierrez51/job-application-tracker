

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

function renderAppPipeline() {
  
  /*
    TODO: Create a function that takes the statuses of the jobs (COUNT()), divides by total number of jobs, and updates the bar size (width) based on the percentage

    The function can return an array of numbers for each percentage
  */




  let appPipeline = `
    <div class="app-pipeline-container">
      <p>Application Pipeline</p>
      <div class="pipeline-layout">

        <div class="app">
          <div class="app-details">
            <div>Applied</div>
            <div>${3}</div>
          </div>
          <div class="bar-track">
            <div id="applied-bar" class="applied-bar"></div>
          </div>
        </div>

        <div class="app">
          <div class="app-details">
            <div>Phone Screen</div>
            <div>${2}</div>
          </div>
          <div class="bar-track">
            <div id="phone-bar" class="phone-bar"></div>
          </div>
        </div>

        <div class="app">
          <div class="app-details">
            <div>Interview Scheduled</div>
            <div>1</div>
          </div>
          <div class="bar-track">
            <div id="interview-bar" class="interview-bar"></div>
          </div>
        </div>

        <div class="app">
          <div class="app-details">
            <div>Offer</div>
            <div>1</div>
          </div>
          <div class="bar-track">
            <div id="offer-bar" class="offer-bar"></div>
          </div>
        </div>

        <div class="app">
          <div class="app-details">
            <div>Rejected</div>
            <div>1</div>
          </div>
          <div class="bar-track">
            <div id="rejected-bar" class="rejected-bar"></div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.querySelector('.js-app-pipeline').innerHTML = appPipeline;

  document.getElementById('rejected-bar').style.width = '75%';
  document.getElementById('offer-bar').style.width = '10%';
  document.getElementById('interview-bar').style.width = '75%';
  document.getElementById('phone-bar').style.width = '67%';
  document.getElementById('applied-bar').style.width = '90%';
}

renderSummaryCards();
renderAppPipeline();