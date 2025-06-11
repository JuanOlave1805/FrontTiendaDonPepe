import { agregarDato } from "../Modules/agregar.js";
import { autenticacion } from "../Modules/Config.js";

const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');


btnLogin.addEventListener("click", () => {
    loginForm.classList.remove("d-none");
    registerForm.classList.add("d-none");
  
    btnLogin.classList.add("btn-active");
    btnRegister.classList.remove("btn-active");
});
  
btnRegister.addEventListener("click", () => {
    registerForm.classList.remove("d-none");
    loginForm.classList.add("d-none");
  
    btnRegister.classList.add("btn-active");
    btnLogin.classList.remove("btn-active");
});
  

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;

  if (user === "admin" && pass === "12345") {

    const data = {
        username: user,
        password: pass
    };

    ObtenerToken(autenticacion, data);
  } 
  else {
    alert("Usuario o contraseña incorrectos.");
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const documento = document.getElementById('regDoc').value;
  const usuario = document.getElementById('regUser').value;
  const pass = document.getElementById('regPass').value;

  if (nombre && email && usuario && pass && documento) {
    alert(`¡Usuario ${usuario} registrado exitosamente!`);
    btnLogin.click(); // Cambiar a login
  } else {
    alert("Completa todos los campos.");
  }
});


function validarNumeroTiempoReal(inputElement, mensajeElement) {
    inputElement.addEventListener('input', function () {
      const valor = inputElement.value;
      const regex = /^[0-9]{7,10}$/;
  
      if (regex.test(valor)) {
        mensajeElement.textContent = '';
        inputElement.style.borderColor = 'green';
      } else {
        mensajeElement.textContent = 'Debe contener solo números (7 a 10 dígitos)';
        inputElement.style.borderColor = 'red';
      }
    });
  }

  function validarCampo(inputElement, mensajeElement) {
    inputElement.addEventListener('input', function () {
      const valor = inputElement.value;
  
      if (valor.length > 1) {
        mensajeElement.textContent = '';
        inputElement.style.borderColor = 'green';
      } else {
        mensajeElement.textContent = 'Por favor completa el campo';
        inputElement.style.borderColor = 'red';
      }
    });
  }
  
  
  document.addEventListener('DOMContentLoaded', () => {

    
    //Validacion registro
    /*const campo = document.getElementById('regDoc');
    const mensaje = document.getElementById('mensajeErrorDoc');*/
    
    const campo2 = document.getElementById('regName');
    const mensaje2 = document.getElementById('mensajeErrorNombre');

    const campo3 = document.getElementById('regEmail');
    const mensaje3 = document.getElementById('mensajeErrorCorreo');

    const campo4 = document.getElementById('regUser');
    const mensaje4 = document.getElementById('mensajeErrorUser');

    const campo5 = document.getElementById('regPass');
    const mensaje5 = document.getElementById('mensajeErrorPass');

    const campo6 = document.getElementById('regLastName');
    const mensaje6 = document.getElementById('mensajeErrorLastName');

    //validarNumeroTiempoReal(campo, mensaje);
    validarCampo(campo2, mensaje2);
    validarCampo(campo3, mensaje3);
    validarCampo(campo4, mensaje4);
    validarCampo(campo5, mensaje5);
    validarCampo(campo6, mensaje6);


    //Validacion login

    const campoLogin1 = document.getElementById('loginUser');
    const mensajeLogin1 = document.getElementById('mensajeErrorloginUser');

    const campoLogin2 = document.getElementById('loginPass');
    const mensajeLogin2 = document.getElementById('mensajeErrorLoginPass');

    validarCampo(campoLogin1, mensajeLogin1);
    validarCampo(campoLogin2, mensajeLogin2);
  });


// Metodos

async function ObtenerToken(autenticacion, data) {
  try {
    const peticion = await agregarDato(autenticacion, data);

    console.log(data);
    console.log(peticion);

    if (!peticion || peticion == "pendiente") {
      console.log("Backend no disponible");
      window.location.href = "index.html";
      return;
    }
  localStorage.setItem("token", peticion.token);
  localStorage.setItem("fechatoken", new Date().toISOString());

    // Puedes guardar token si es necesario: localStorage.setItem("token", peticion.token);
    alert("¡Bienvenido!");
    window.location.href = "Views/Venta.html";
    
  } catch (error) {
    console.error("Error en la solicitud:", error);
    window.location.href = "index.html";
  }
}
