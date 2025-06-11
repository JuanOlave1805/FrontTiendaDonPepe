import peticionApi from "../Modules/listar.js";
import actualizarDato from "../Modules/actualizar.js";
import { agregarDatoToken } from "../Modules/agregar.js";
import eliminarDato from "../Modules/eliminar.js";
import { proveedores, producto, categorias } from "../Modules/Config.js";

const tbody = document.getElementById("data-tbody");
const cardContainer = document.getElementById("card-container");
const modal = new bootstrap.Modal(document.getElementById("modalAcciones"));
const idInput = document.getElementById("productoId");
const nombreInput = document.getElementById("nombreProducto");
const precioInput = document.getElementById("precioProducto");
const stockInput = document.getElementById("stockProducto");
const categoriaInput = document.getElementById("categoriaProducto");
const proveedorInput = document.getElementById("proveedorProducto");
const btnActualizar = document.getElementById("btnActualizar");
const btnEliminar = document.getElementById("btnEliminar");
const btnAcciones = document.getElementById("btnAcciones");
const btnGuardar = document.getElementById("btnGuardar");
const formProducto = document.getElementById("formProducto");

document.addEventListener("DOMContentLoaded", () => {
  verificarTokenYListar();

  btnAcciones.addEventListener("click", () => {
    idInput.value = "";
    nombreInput.value = "";
    precioInput.value = "";
    stockInput.value = "";
    categoriaInput.value = "";
    proveedorInput.value = "";

    // Quitar clases de error anteriores
    [nombreInput, precioInput, stockInput, categoriaInput, proveedorInput].forEach(input => {
      input.classList.remove("is-invalid", "is-valid");
    });

    btnActualizar.disabled = true;
    btnEliminar.disabled = true;
    modal.show();
  });

  btnActualizar.addEventListener("click", async () => {
    const id = idInput.value;
    const nombre = nombreInput.value.trim();
    const precio = parseFloat(precioInput.value);
    const stock = parseInt(stockInput.value);
    const categoria_id = categoriaInput.value;
    const proveedor_id = proveedorInput.value;

    if (!id || !nombre || isNaN(precio) || isNaN(stock) || !categoria_id || !proveedor_id) {
      return;
    }

    const token = localStorage.getItem("token");
    const data = { id, nombre, precio, stock, categoria_id, proveedor_id };

    try {
      const respuesta = await actualizarDato(producto, data, token);
      if (respuesta && respuesta.ok !== false) {
        modal.hide();
        verificarTokenYListar();
      }
    } catch (err) {
      console.error(err);
    }
  });

  btnEliminar.addEventListener("click", async () => {
    const id = idInput.value;
    if (!id) return;

    const token = localStorage.getItem("token");

    try {
      const respuesta = await eliminarDato(producto, id, token);
      if (respuesta && respuesta.ok !== false) {
        modal.hide();
        verificarTokenYListar();
      }
    } catch (err) {
      console.error(err);
    }
  });
});

function verificarTokenYListar() {
  const token = localStorage.getItem('token');
  const fechaToken = localStorage.getItem('fechatoken');

  if (!token || !fechaToken) return cerrarSesion();

  const fecha = new Date(fechaToken);
  if (isNaN(fecha.getTime())) return cerrarSesion();

  const ahora = new Date();
  fecha.setHours(fecha.getHours() + 1);

  if (ahora >= fecha) return cerrarSesion();

  Listar(producto, token);
}

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('fechatoken');
  window.location.href = '../index.html';
}

async function Listar(endpoint, token) {
  try {
    const registros = await peticionApi(endpoint, token);
    const proveedoress = await peticionApi(proveedores, token);
    const categoriass = await peticionApi(categorias, token);

    tbody.innerHTML = "";
    cardContainer.innerHTML = "";

    // Llenar combobox de proveedores
    const proveedorSelect = document.getElementById("proveedorProducto");
    proveedorSelect.innerHTML = '<option value="">Seleccione un proveedor</option>';
    proveedoress.forEach((proveedor) => {
      const option = document.createElement("option");
      option.value = proveedor.id;
      option.textContent = proveedor.nombre;
      proveedorSelect.appendChild(option);
    });

    // Llenar combobox de categorías
    const categoriaSelect = document.getElementById("categoriaProducto");
    categoriaSelect.innerHTML = '<option value="">Seleccione una categoría</option>';
    categoriass.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria.id;
      option.textContent = categoria.nombre;
      categoriaSelect.appendChild(option);
    });

    if (!Array.isArray(registros) || registros.length === 0) {
      const filaVacia = document.createElement("tr");
      filaVacia.innerHTML = `<td colspan="6" class="text-center">No hay productos registrados.</td>`;
      tbody.appendChild(filaVacia);
      return;
    }

    registros.forEach((producto) => {
      const categoria = categoriass.find(cat => cat.id === producto.categoria_id);
      const proveedor = proveedoress.find(prov => prov.id === producto.proveedor_id);

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${producto.id ?? ''}</td>
        <td>${producto.nombre}</td>
        <td>${producto.precio}</td>
        <td>${producto.stock ?? ''}</td>
        <td>${categoria?.nombre ?? 'Categoría inválida'}</td>
        <td>${proveedor?.nombre ?? 'Proveedor inválido'}</td>
      `;
      fila.addEventListener("click", () => cargarDatosEnModal(producto));
      tbody.appendChild(fila);

      const card = document.createElement("div");
      card.className = "card mb-3 shadow-sm d-md-none";
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text"><strong>Precio:</strong> ${producto.precio}</p>
          <p class="card-text"><strong>Stock:</strong> ${producto.stock}</p>
          <p class="card-text"><strong>Categoría:</strong> ${categoria?.nombre ?? 'Categoría inválida'}</p>
          <p class="card-text"><strong>Proveedor:</strong> ${proveedor?.nombre ?? 'Proveedor inválido'}</p>
        </div>
      `;
      card.addEventListener("click", () => cargarDatosEnModal(producto));
      cardContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

function cargarDatosEnModal(producto) {
  idInput.value = producto.id;
  nombreInput.value = producto.nombre;
  precioInput.value = producto.precio;
  stockInput.value = producto.stock;
  categoriaInput.value = producto.categoria_id;
  proveedorInput.value = producto.proveedor_id;
  btnActualizar.disabled = false;
  btnEliminar.disabled = false;
  modal.show();
}

btnGuardar.addEventListener("click", async (event) => {
  event.preventDefault(); // PREVIENE EL SUBMIT

  const nombre = nombreInput.value.trim();
  const precio = parseFloat(precioInput.value);
  const stock = parseInt(stockInput.value);
  const categoria_id = categoriaInput.value;
  const proveedor_id = proveedorInput.value;

  if (!nombre || isNaN(precio) || isNaN(stock) || !categoria_id || !proveedor_id) {
    console.warn("Campos inválidos.");
    return;
  }

  const token = localStorage.getItem("token");
  const data = { nombre, precio, stock, categoria_id, proveedor_id };

  console.log("Datos a enviar:", data);
  try {
    const res = await agregarDatoToken(producto, data, token);
    console.log("Respuesta:", res);
    if (res && res.ok !== false) {
      modal.hide();
      verificarTokenYListar();
    }
  } catch (err) {
    console.error("Error al guardar producto:", err);
  }
});

const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", (e) => {
    e.preventDefault(); // Evita navegación por defecto del <a>
    cerrarSesion();
  });
}
