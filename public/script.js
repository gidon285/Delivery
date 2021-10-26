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
  const modals = document.querySelectorAll('.Mymodal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})
closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.Mymodal')
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
function AteempetSignup(){
  var data = {name:document.getElementById('name').value,
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
      document.getElementById('Mymodal-tile').innerHTML="Error!";
      document.getElementById('Mymodal-message').innerHTML= jsonrespons.err;
    }else{
      document.getElementById('Mymodal-tile').innerHTML="Thanke you for Signing up!"
      document.getElementById('Mymodal-message').innerHTML= jsonrespons.succ;
    }
    }
  }
}  
function AteempetLogin(){
  var data = {name:document.getElementById('user').value,
              pass:document.getElementById('password').value};
  let request = new XMLHttpRequest();
  request.open("POST", 'http://localhost:3000/login',true);
  request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
  request.send(JSON.stringify(data));
  request.onreadystatechange = function() {
  if (request.readyState === 4) {
    var jsonrespons = JSON.parse(request.response);
      if( jsonrespons.succ === ""){
        document.getElementById('Mymodal-tile').innerHTML="Error!";
        document.getElementById('Mymodal-message').innerHTML= jsonrespons.err;
      }else{
        let clossebutton = document.querySelectorAll('[data-close-button]')
        clossebutton.forEach(button =>{
          const modal2 = button.closest('.Mymodal')
          closeModal(modal2)
        })
        document.getElementById("accepted").submit();
      }
    }
  }
  
}  