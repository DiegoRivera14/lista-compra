# 🛒 Lista de la compra

Aplicación web para apuntar lo que hay que comprar, hecha con **HTML, CSS y JavaScript**. La lista se guarda en el navegador, así que sigue ahí al volver a abrir la página.

🔗 **Demo en vivo:** https://diegorivera14.github.io/lista-compra/

## Funcionalidades

- Añadir productos con su cantidad.
- Si añades un producto que ya está pendiente, se suma la cantidad en lugar de duplicarlo.
- Marcar productos como comprados y eliminarlos.
- Filtros: todos, pendientes y comprados.
- Contador de pendientes y comprados.
- Botón para quitar de golpe todo lo comprado.
- Los datos se guardan en `localStorage`.

## Cómo usarla

Puedes probarlo directamente en la [demo](https://diegorivera14.github.io/lista-compra/), o descargar el repositorio y abrir `index.html` en el navegador (no necesita instalación).

```bash
git clone https://github.com/DiegoRivera14/lista-compra.git
cd lista-compra
# abre index.html en tu navegador
```

## Estructura

```
lista-compra/
├── index.html   # Formulario, filtros y lista
├── style.css    # Estilos
└── script.js    # Lógica, filtros y guardado en localStorage
```

## Cómo funciona

Los productos viven en un array de objetos en `script.js`:

```js
{ id: "lq3k9x2ab", nombre: "Leche", cantidad: 2, comprado: false }
```

Cada acción sigue el mismo patrón: **modificar el array → `guardar()` → `pintar()`**.

- `guardar()` serializa el array con `JSON.stringify` y lo escribe en `localStorage` bajo la clave `lista-compra`. `cargar()` hace lo contrario al abrir la página. Ambas van dentro de `try/catch`: si el navegador bloquea el almacenamiento, la app funciona igual pero no recuerda la lista.
- `pintar()` filtra el array según el filtro activo, genera un `<li>` por producto con `crearElemento()` y sustituye la lista entera con `replaceChildren()`. También actualiza el contador y muestra u oculta el mensaje de lista vacía.
- `anadir()` comprueba si ya hay un producto pendiente con el mismo nombre (sin distinguir mayúsculas); si lo hay, suma la cantidad (máximo 99) en lugar de crear otro.
- Los nombres se insertan con `textContent`, no con `innerHTML`, para que el texto del formulario nunca se interprete como HTML.
- Los clics en checkboxes y botones de eliminar se gestionan con un solo listener en la `<ul>` (delegación de eventos). El producto se localiza por el `data-id` de su `<li>`.

## Autor

Diego Rivera — [GitHub](https://github.com/DiegoRivera14)
