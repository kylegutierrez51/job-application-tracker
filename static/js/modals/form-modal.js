const addButton = document.getElementById('add-btn');
const modalOverlay = document.getElementById('modal-overlay'); 

/*
Event delegation -- rather than defining xButton and cancelButton button variables, we
define "modalOverlay".

We define modalOverlay since job-details.js's renderModalOverlay is async since it has to fetch data. 
This means that this js file runs before renderModalOverlay finishes, meaning that buttons like the xButton and cancelButton give errors since they're rendered only in renderModalOverlay.

But the id #modal-overlay is in the static HTML (templates/jobs.html) from the start.

We do the same thing in job-detail-modal.js. -- Remove Edit, Delete, Cancel, X buttons
*/

addButton.addEventListener('click', () => {
  modalOverlay.classList.add('active');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target.id === 'close-btn' || e.target.id === 'cancel-btn') {
    modalOverlay.classList.remove('active');
  }
})