const addButton = document.getElementById('add-btn');
const xButton = document.getElementById('x-btn');
const cancelButton = document.getElementById('cancel-btn');
const createButton = document.getElementById('create-btn');

const modalOverlay = document.getElementById('modal-overlay');

addButton.addEventListener('click', () => {
  console.log('add-btn');
  modalOverlay.classList.add('active');
});

xButton.addEventListener('click', () => {
  console.log('cancel-btn');
  modalOverlay.classList.remove('active');
})

cancelButton.addEventListener('click', () => {
  console.log('cancel-btn');
  modalOverlay.classList.remove('active');
})

createButton.addEventListener('click', () => {
  console.log('create-btn');
  modalOverlay.classList.remove('active');
})