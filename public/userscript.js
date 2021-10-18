const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})
closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})
function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}
function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}
function ms(){
  data = {name:document.getElementById('name').value,
          pass1:document.getElementById('pass1').value,
          pass2:document.getElementById('pass2').value};
  let request = new XMLHttpRequest();
  request.open("POST", 'http://localhost:3000/register/s',true);
  request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
  request.send(JSON.stringify(data));
  request.onreadystatechange = function() {
  if (request.readyState === 4) {
    var jsonrespons = JSON.parse(request.response);
    if( jsonrespons.succ === ""){
      document.getElementById('modal-tile').innerHTML="Error!";
      document.getElementById('modal-message').innerHTML= jsonrespons.err;
    }else{
      document.getElementById('modal-tile').innerHTML="Thanke you for Signing up!"
      document.getElementById('modal-message').innerHTML= jsonrespons.succ;
    }
    }
  }
}  