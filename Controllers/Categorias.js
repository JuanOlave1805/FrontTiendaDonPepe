import peticionApi from "../Modules/listar.js";
import actualizarDato from "../Modules/actualizar.js";
import {agregarDatoToken} from "../Modules/agregar.js";
import eliminarDato from "../Modules/eliminar.js";
import { categorias } from "../Modules/Config.js";

const tbody = document.getElementById("data-tbody");
const cardContainer = document.getElementById("card-container");
const modal = new bootstrap.Modal(document.getElementById("modalAcciones"));
const idInput = document.getElementById("categoriaId");
const nombreInput = document.getElementById("nombreCategoria");
const btnActualizar = document.getElementById("btnActualizar");
const btnEliminar = document.getElementById("btnEliminar");
const btnAcciones = document.getElementById("btnAcciones");
const btnGuardar = document.getElementById("btnGuardar");
const formCategoria = document.getElementById("formCategoria");

document.addEventListener("DOMContentLoaded", () => {
  verificarTokenYListar();

  // Guardar nueva categoría
  formCategoria.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = nombreInput.value.trim();
    if (!nombre) {
      nombreInput.classList.add("is-invalid");
      return;
    }

    nombreInput.classList.remove("is-invalid");

    const token = localStorage.getItem("token");
    const data = { nombre };

    try {
      const res = await fetch(categorias, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al guardar la categoría");
      await res.json();
      modal.hide();
      verificarTokenYListar();
    } catch (err) {
      console.error(err);
    }
  });


  btnAcciones.addEventListener("click", () => {
  // Limpiar campos del formulario
  idInput.value = "";
  nombreInput.value = "";
  nombreInput.classList.remove("is-invalid");

  // Desactivar botones
  btnActualizar.disabled = true;
  btnEliminar.disabled = true;

  // Mostrar el modal
  modal.show();
});

  // Actualizar categoría
  btnActualizar.addEventListener("click", async () => {
  const id = idInput.value;
  const nombre = nombreInput.value.trim();

  if (!id || !nombre) {
    nombreInput.classList.add("is-invalid");
    return;
  }

  nombreInput.classList.remove("is-invalid");

  const token = localStorage.getItem("token");
  const data = { id, nombre };

  try {
    const respuesta = await actualizarDato(categorias, data, token);

    if (respuesta && respuesta.ok !== false) {
      modal.hide();
      verificarTokenYListar();
      // Puedes usar Toast o notificación ligera si deseas
      console.log("Categoría actualizada con éxito.");
    } else {
      console.error("La actualización falló:", respuesta);
    }
  } catch (err) {
    console.error("Error en la actualización:", err);
  }
});

// Guardar categoría
btnGuardar.addEventListener("click", async () => {
  const nombre = nombreInput.value.trim();

  if (!nombre) {
    nombreInput.classList.add("is-invalid");
    return;
  }

  nombreInput.classList.remove("is-invalid");

  const token = localStorage.getItem("token");
  const data = { nombre };

  try {
    const respuesta = await agregarDatoToken(categorias, data, token); // <- usa agregarDatoToken

    console.log(respuesta, data, token);

    if (respuesta && respuesta.ok !== false) {
      const modalInstance = bootstrap.Modal.getInstance(document.getElementById("modalAcciones"));
      modalInstance.hide();
      verificarTokenYListar();
      console.log("Categoría guardada con éxito.");
    } else {
      console.error("La operación de guardado falló:", respuesta);
    }
  } catch (err) {
    console.error("Error al guardar la categoría:", err);
  }
});

// Elimiar categoría
  btnEliminar.addEventListener("click", async () => {
  const id = idInput.value;
  const nombre = nombreInput.value.trim();

  if (!id || !nombre) {
    nombreInput.classList.add("is-invalid");
    return;
  }

  nombreInput.classList.remove("is-invalid");

  const token = localStorage.getItem("token");
  
  try {
    const respuesta = await eliminarDato(categorias, id, token);

    if (respuesta && respuesta.ok !== false) {
      modal.hide();
      verificarTokenYListar();
      // Puedes usar Toast o notificación ligera si deseas
      console.log("Categoría eliminada con éxito.");
    } else {
      console.error("La eliminacion falló:", respuesta);
    }
  } catch (err) {
    console.error("Error en la eliminacion:", err);
  }
});

});

// Abre modal con datos o en blanco
function cargarDatosEnModal(categoria) {
  idInput.value = categoria.id;
  nombreInput.value = categoria.nombre;
  btnActualizar.disabled = false;
  btnEliminar.disabled = false;
  modal.show();
}

// Lista datos
async function Listar(endpoint, token) {
  try {
    const registros = await peticionApi(endpoint, token);

    tbody.innerHTML = "";
    cardContainer.innerHTML = "";

    registros.forEach((categoria) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `<td>${categoria.id}</td><td>${categoria.nombre}</td>`;
      fila.addEventListener("click", () => cargarDatosEnModal(categoria));
      tbody.appendChild(fila);

      const card = document.createElement("div");
      card.className = "card mb-3 shadow-sm d-md-none";
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Nombre: ${categoria.nombre}</h5>
          <p class="card-text"><strong>ID:</strong> ${categoria.id}</p>
        </div>
      `;
      card.addEventListener("click", () => cargarDatosEnModal(categoria));
      cardContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error al listar:", error);
  }
}

// Token
function verificarTokenYListar() {
  const token = localStorage.getItem("token");
  const fechaToken = localStorage.getItem("fechatoken");

  if (!token || !fechaToken) return cerrarSesion();

  const fecha = new Date(fechaToken);
  if (isNaN(fecha.getTime())) return cerrarSesion();

  const ahora = new Date();
  fecha.setHours(fecha.getHours() + 1);

  if (ahora >= fecha) return cerrarSesion();

  Listar(categorias, token);
}

function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("fechatoken");
  window.location.href = "../index.html";
}

const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", (e) => {
    e.preventDefault(); // Evita navegación por defecto del <a>
    cerrarSesion();
  });
}