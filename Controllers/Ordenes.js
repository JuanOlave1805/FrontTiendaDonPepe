import peticionApi from "../Modules/listar.js";
import { agregarDatoToken } from "../Modules/agregar.js";
import actualizarDato from "../Modules/actualizar.js";
import eliminarDato from "../Modules/eliminar.js";
import { ordenes, usuarios, producto } from "../Modules/Config.js";
import getById from "../Modules/listarbyId.js"; 

const tbody = document.getElementById("data-tbody");
const cardContainer = document.getElementById("card-container");
const modal = new bootstrap.Modal(document.getElementById("modalAcciones"));
const idInput = document.getElementById("ordenId");
const usuarioInput = document.getElementById("usuarioOrden");
const productoInput = document.getElementById("productoOrden");
const tipoInput = document.getElementById("tipoOrden");
const cantidadInput = document.getElementById("cantidadOrden");
const btnEliminar = document.getElementById("btnEliminar");
const btnAcciones = document.getElementById("btnAcciones");
const btnGuardar = document.getElementById("btnGuardar");

document.addEventListener('DOMContentLoaded', () => {
  verificarTokenYListar();

  btnAcciones.addEventListener("click", () => {
    idInput.value = "";
    usuarioInput.value = "";
    productoInput.value = "";
    tipoInput.value = "";
    cantidadInput.value = "";
    [usuarioInput, productoInput, tipoInput, cantidadInput].forEach(input => {
      input.classList.remove("is-invalid", "is-valid");
    });

    btnEliminar.disabled = true;
    modal.show();
  });

  btnEliminar.addEventListener("click", async () => {
    const id = idInput.value;
    if (!id) return;

    const token = localStorage.getItem("token");

    try {
      const respuesta = await eliminarDato(ordenes, id, token);
      if (respuesta && respuesta.ok !== false) {
        modal.hide();
        verificarTokenYListar();
      }
    } catch (err) {
      console.error(err);
    }
  });

  btnGuardar.addEventListener("click", async (event) => {
  event.preventDefault();

  const usuario_id = usuarioInput.value;
  const producto_id = productoInput.value;
  const tipo = tipoInput.value.trim();
  const cantidad = parseInt(cantidadInput.value);
  const fecha = new Date().toISOString();

  // Validaciones básicas
  if (!usuario_id || !producto_id || !tipo || isNaN(cantidad) || cantidad <= 0 || !fecha) {
    alert("Por favor, complete todos los campos correctamente.");
    return;
  }

  if (tipo !== "Venta" && tipo !== "Compra") {
    alert("El tipo de orden debe ser 'venta' o 'compra'.");
    return;
  }

  const token = localStorage.getItem("token");
  const data = { usuario_id, producto_id, tipo, cantidad, fecha };

  try {
    // Obtener el producto actual
    const productoActual = await getById(producto, producto_id, token);
    if (!productoActual) {
      alert("Producto no encontrado.");
      return;
    }

    let nuevoStock = productoActual.stock;

    if (tipo === "Venta") {
      if (cantidad > productoActual.stock) {
        alert("No hay suficiente stock para realizar esta venta.");
        return;
      }
      nuevoStock -= cantidad;
    } else if (tipo === "Compra") {
      nuevoStock += cantidad;
    }

    const productoActualizado = {
      id: productoActual.id,
      nombre: productoActual.nombre,
      precio: productoActual.precio,
      stock: nuevoStock,
      categoria_id: productoActual.categoria_id,
      proveedor_id: productoActual.proveedor_id
    };

    // Actualizar el producto
    await actualizarDato(producto, productoActualizado, token);

    // Registrar la orden
    const res = await agregarDatoToken(ordenes, data, token);
    if (res && res.ok !== false) {
      modal.hide();
      verificarTokenYListar();
    }
  } catch (err) {
    console.error("Error al guardar la orden:", err);
    alert("Ocurrió un error al guardar la orden.");
  }
});


});

function cargarDatosEnModal(orden) {
  idInput.value = orden.id;
  usuarioInput.value = orden.usuario_id;
  productoInput.value = orden.producto_id;
  tipoInput.value = orden.tipo;
  cantidadInput.value = orden.cantidad;
  btnEliminar.disabled = false;
  modal.show();
}

function generarCardsDesdeTabla() {
  if (!tbody || !cardContainer) return;
  cardContainer.innerHTML = "";

  const rows = tbody.querySelectorAll("tr");

  rows.forEach(row => {
    const cols = row.querySelectorAll("td");
    if (cols.length < 6) return;

    const card = document.createElement("div");
    card.className = "card mb-3 shadow-sm d-md-none";

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${cols[1].textContent}</h5>
        <p class="card-text"><strong>Producto:</strong> ${cols[2].textContent}</p>
        <p class="card-text"><strong>Tipo:</strong> ${cols[3].textContent}</p>
        <p class="card-text"><strong>Cantidad:</strong> ${cols[4].textContent}</p>
        <p class="card-text"><strong>Fecha:</strong> ${cols[5].textContent}</p>
      </div>
    `;

    cardContainer.appendChild(card);
  });
}

function verificarTokenYListar() {
  const token = localStorage.getItem('token');
  const fechaToken = localStorage.getItem('fechatoken');

  if (!token || !fechaToken) return cerrarSesion();

  const fecha = new Date(fechaToken);
  if (isNaN(fecha.getTime())) return cerrarSesion();

  const ahora = new Date();
  fecha.setHours(fecha.getHours() + 1);

  if (ahora >= fecha) return cerrarSesion();

  ListarOrdenes(ordenes, token);
}

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('fechatoken');
  window.location.href = '../index.html';
}

async function ListarOrdenes(endpoint, token) {
  try {
    const registros = await peticionApi(endpoint, token);
    const usuarioss = await peticionApi(usuarios, token);
    const productoss = await peticionApi(producto, token);

    if (!Array.isArray(registros)) return;

    tbody.innerHTML = "";

    // Combos
    const usuarioSelect = document.getElementById("usuarioOrden");
    usuarioSelect.innerHTML = '<option value="">Seleccione un usuario</option>';
    usuarioss.forEach((u) => {
      const option = document.createElement("option");
      option.value = u.id;
      option.textContent = u.usuario;
      usuarioSelect.appendChild(option);
    });

    const productoSelect = document.getElementById("productoOrden");
    productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
    productoss.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.nombre;
      productoSelect.appendChild(option);
    });

    if (registros.length === 0) {
      const filaVacia = document.createElement("tr");
      filaVacia.innerHTML = `
        <td colspan="6" class="text-center">No hay órdenes registradas.</td>
      `;
      tbody.appendChild(filaVacia);
      return;
    }

    registros.forEach((orden) => {
      const usuario = usuarioss.find(u => u.id === orden.usuario_id);
      const prod = productoss.find(p => p.id === orden.producto_id);

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${orden.id ?? ''}</td>
        <td>${usuario?.usuario ?? 'Desconocido'}</td>
        <td>${prod?.nombre ?? 'Desconocido'}</td>
        <td>${orden.tipo}</td>
        <td>${orden.cantidad}</td>
        <td>${orden.fecha?.split('T')[0] || ''}</td>
      `;
      fila.addEventListener("click", () => cargarDatosEnModal(orden));
      tbody.appendChild(fila);
    });

    generarCardsDesdeTabla();
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }

  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", (e) => {
    e.preventDefault(); // Evita navegación por defecto del <a>
    cerrarSesion();
  });
}
}
