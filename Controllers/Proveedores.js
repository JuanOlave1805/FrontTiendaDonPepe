import peticionApi from "../Modules/listar.js";
import actualizarDato from "../Modules/actualizar.js";
import { agregarDatoToken } from "../Modules/agregar.js";
import eliminarDato from "../Modules/eliminar.js";
import { proveedores } from "../Modules/Config.js";

const tbody = document.getElementById("data-tbody");
const cardContainer = document.getElementById("card-container");
const modal = new bootstrap.Modal(document.getElementById("modalAcciones"));
const idInput = document.getElementById("proveedorId");
const nombreInput = document.getElementById("nombreProveedor");
const nitInput = document.getElementById("nitProveedor");
const btnActualizar = document.getElementById("btnActualizar");
const btnEliminar = document.getElementById("btnEliminar");
const btnAcciones = document.getElementById("btnAcciones");
const btnGuardar = document.getElementById("btnGuardar");
const formProveedor = document.getElementById("formProveedor");

document.addEventListener("DOMContentLoaded", () => {
  verificarTokenYListar();

  formProveedor.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = nombreInput.value.trim();
    const nit = nitInput.value.trim();

    if (!nombre || !nit) {
      nombreInput.classList.add("is-invalid");
      nitInput.classList.add("is-invalid");
      return;
    }

    nombreInput.classList.remove("is-invalid");
    nitInput.classList.remove("is-invalid");

    const token = localStorage.getItem("token");
    const data = { nombre, nit };

    try {
      const res = await fetch(proveedores, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al guardar el proveedor");
      await res.json();
      modal.hide();
      verificarTokenYListar();
    } catch (err) {
      console.error(err);
    }
  });

  btnAcciones.addEventListener("click", () => {
    idInput.value = "";
    nombreInput.value = "";
    nitInput.value = "";
    nombreInput.classList.remove("is-invalid");
    nitInput.classList.remove("is-invalid");
    btnActualizar.disabled = true;
    btnEliminar.disabled = true;
    modal.show();
  });

  btnActualizar.addEventListener("click", async () => {
    const id = idInput.value;
    const nombre = nombreInput.value.trim();
    const nit = nitInput.value.trim();

    if (!id || !nombre || !nit) {
      nombreInput.classList.add("is-invalid");
      nitInput.classList.add("is-invalid");
      return;
    }

    nombreInput.classList.remove("is-invalid");
    nitInput.classList.remove("is-invalid");

    const token = localStorage.getItem("token");
    const data = { id, nombre, nit };

    try {
      const respuesta = await actualizarDato(proveedores, data, token);

      if (respuesta && respuesta.ok !== false) {
        modal.hide();
        verificarTokenYListar();
        console.log("Proveedor actualizado con éxito.");
      } else {
        console.error("La actualización falló:", respuesta);
      }
    } catch (err) {
      console.error("Error en la actualización:", err);
    }
  });

  btnGuardar.addEventListener("click", async () => {
    const nombre = nombreInput.value.trim();
    const nit = nitInput.value.trim();

    if (!nombre || !nit) {
      nombreInput.classList.add("is-invalid");
      nitInput.classList.add("is-invalid");
      return;
    }

    nombreInput.classList.remove("is-invalid");
    nitInput.classList.remove("is-invalid");

    const token = localStorage.getItem("token");
    const data = { nombre, nit };

    try {
      const respuesta = await agregarDatoToken(proveedores, data, token);

      if (respuesta && respuesta.ok !== false) {
        modal.hide();
        verificarTokenYListar();
        console.log("Proveedor guardado con éxito.");
      } else {
        console.error("La operación de guardado falló:", respuesta);
      }
    } catch (err) {
      console.error("Error al guardar el proveedor:", err);
    }
  });

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
      const respuesta = await eliminarDato(proveedores, id, token);

      if (respuesta && respuesta.ok !== false) {
        modal.hide();
        verificarTokenYListar();
        console.log("Proveedor eliminado con éxito.");
      } else {
        console.error("La eliminación falló:", respuesta);
      }
    } catch (err) {
      console.error("Error en la eliminación:", err);
    }
  });
});

// Verifica token y lista datos
function verificarTokenYListar() {
  const token = localStorage.getItem('token');
  const fechaToken = localStorage.getItem('fechatoken');

  if (!token || !fechaToken) return cerrarSesion();

  const fecha = new Date(fechaToken);
  if (isNaN(fecha.getTime())) return cerrarSesion();

  const ahora = new Date();
  fecha.setHours(fecha.getHours() + 1);

  if (ahora >= fecha) return cerrarSesion();

  Listar(proveedores, token);
}

// Cierra sesión si token no es válido
function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('fechatoken');
  window.location.href = '../index.html';
}

// Listar datos en tabla y generar cards
async function Listar(endpoint, token) {
  try {
    const registros = await peticionApi(endpoint, token);

    tbody.innerHTML = "";
    cardContainer.innerHTML = "";

    if (!Array.isArray(registros) || registros.length === 0) {
      const filaVacia = document.createElement("tr");
      filaVacia.innerHTML = `
        <td colspan="3" class="text-center">No hay proveedores registrados.</td>
      `;
      tbody.appendChild(filaVacia);
      return;
    }

    registros.forEach((proveedor) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${proveedor.id ?? ''}</td>
        <td>${proveedor.nombre ?? 'Sin nombre'}</td>
        <td>${proveedor.nit ?? 'Sin NIT'}</td>
      `;
      fila.addEventListener("click", () => cargarDatosEnModal(proveedor));
      tbody.appendChild(fila);

      const card = document.createElement("div");
      card.className = "card mb-3 shadow-sm d-md-none";
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Proveedor: ${proveedor.nombre ?? 'Sin nombre'}</h5>
          <p class="card-text"><strong>NIT:</strong> ${proveedor.nit ?? 'Sin NIT'}</p>
          <p class="card-text"><strong>ID:</strong> ${proveedor.id ?? ''}</p>
        </div>
      `;
      card.addEventListener("click", () => cargarDatosEnModal(proveedor));
      cardContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

// Abre modal con datos o en blanco
function cargarDatosEnModal(proveedor) {
  idInput.value = proveedor.id;
  nombreInput.value = proveedor.nombre;
  nitInput.value = proveedor.nit;
  btnActualizar.disabled = false;
  btnEliminar.disabled = false;
  modal.show();
}

const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", (e) => {
    e.preventDefault(); // Evita navegación por defecto del <a>
    cerrarSesion();
  });
}
