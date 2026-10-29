// =====================================================
// Lista de la compra
// Los productos se guardan en localStorage, así que la
// lista sigue ahí aunque cierres el navegador.
// =====================================================

const CLAVE_STORAGE = "lista-compra";

const formulario = document.getElementById("formulario");
const inputNombre = document.getElementById("nombre");
const inputCantidad = document.getElementById("cantidad");
const lista = document.getElementById("lista");
const resumen = document.getElementById("resumen");
const mensajeVacio = document.getElementById("vacio");
const botonLimpiar = document.getElementById("limpiar");
const botonesFiltro = document.querySelectorAll(".filtro");

// Cada producto: { id, nombre, cantidad, comprado }
let productos = cargar();
let filtroActual = "todos";

// ---------- Guardar y cargar ----------

function cargar() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
  } catch {
    return []; // si el navegador bloquea el almacenamiento, empieza vacía
  }
}

function guardar() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
  } catch {
    // Sin almacenamiento la app sigue funcionando, solo que no recuerda la lista
  }
}

// ---------- Pintar la lista ----------

function crearElemento(producto) {
  const li = document.createElement("li");
  li.className = "producto" + (producto.comprado ? " comprado" : "");
  li.dataset.id = producto.id;

  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = producto.comprado;
  check.setAttribute("aria-label", `Marcar ${producto.nombre} como comprado`);

  // textContent (y no innerHTML) evita que se pueda inyectar HTML
  const nombre = document.createElement("span");
  nombre.className = "nombre";
  nombre.textContent = producto.nombre;

  const cantidad = document.createElement("span");
  cantidad.className = "cantidad";
  cantidad.textContent = `×${producto.cantidad}`;

  const eliminar = document.createElement("button");
  eliminar.className = "eliminar";
  eliminar.textContent = "✕";
  eliminar.setAttribute("aria-label", `Eliminar ${producto.nombre}`);

  li.append(check, nombre, cantidad, eliminar);
  return li;
}

function pintar() {
  const visibles = productos.filter((p) => {
    if (filtroActual === "pendientes") return !p.comprado;
    if (filtroActual === "comprados") return p.comprado;
    return true;
  });

  lista.replaceChildren(...visibles.map(crearElemento));

  const pendientes = productos.filter((p) => !p.comprado).length;
  const comprados = productos.length - pendientes;

  resumen.textContent = productos.length
    ? `${pendientes} pendiente${pendientes !== 1 ? "s" : ""} · ${comprados} comprado${comprados !== 1 ? "s" : ""}`
    : "Añade tu primer producto.";

  mensajeVacio.classList.toggle("oculto", visibles.length > 0);
  botonLimpiar.classList.toggle("oculto", comprados === 0);
}

// ---------- Acciones ----------

function anadir(nombre, cantidad) {
  // Si el producto ya existe y no está comprado, se suma la cantidad
  const existente = productos.find(
    (p) => p.nombre.toLowerCase() === nombre.toLowerCase() && !p.comprado
  );

  if (existente) {
    existente.cantidad = Math.min(existente.cantidad + cantidad, 99);
  } else {
    productos.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      nombre,
      cantidad,
      comprado: false,
    });
  }
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = inputNombre.value.trim();
  const cantidad = Math.max(1, parseInt(inputCantidad.value, 10) || 1);
  if (!nombre) return;

  anadir(nombre, cantidad);
  guardar();
  pintar();

  formulario.reset();
  inputNombre.focus();
});

// Delegación: un solo listener para los checks y los botones de eliminar
lista.addEventListener("click", (evento) => {
  const li = evento.target.closest(".producto");
  if (!li) return;

  const producto = productos.find((p) => p.id === li.dataset.id);

  if (evento.target.matches("input[type='checkbox']")) {
    producto.comprado = evento.target.checked;
  } else if (evento.target.matches(".eliminar")) {
    productos = productos.filter((p) => p.id !== producto.id);
  } else {
    return;
  }

  guardar();
  pintar();
});

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    filtroActual = boton.dataset.filtro;
    botonesFiltro.forEach((b) => b.classList.toggle("activo", b === boton));
    pintar();
  });
});

botonLimpiar.addEventListener("click", () => {
  productos = productos.filter((p) => !p.comprado);
  guardar();
  pintar();
});

pintar();
