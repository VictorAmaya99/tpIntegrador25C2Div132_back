/* carrito.js corregido para tu proyecto
   Requisitos:
   - En productos.ejs: <script>window.productosDesdeDB = <%- JSON.stringify(products) %>;</script>
   - Botones: <button class="btn-carrito" data-id="<%= prod.id %>">Agregar al carrito</button>
   - En carrito.ejs: #carrito-items, #total, #btn-vaciar, #pagar, #contador-carrito
*/

(() => {
  const contenedorItems = document.getElementById("carrito-items");
  const totalSpan = document.getElementById("total");
  const btnVaciarGlobal = document.getElementById("btn-vaciar");
  const btnPagar = document.getElementById("pagar");
  const contadorCarrito = document.getElementById("contador-carrito");

  const STORAGE_KEY = "mi_carrito_v1";
  let carrito = []; // items: { id, nombre, precio, imagen, tipo, cantidad }

  // Helpers
  const formatCurrency = v => Number(v).toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  const escapeHtml = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

  // Storage
  function guardarLocalStorage(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito)); }
  function loadLocalStorage(){ const d = localStorage.getItem(STORAGE_KEY); carrito = d ? JSON.parse(d) : []; }

  function findIndexInCart(id){ return carrito.findIndex(i => String(i.id) === String(id)); }

  // Agregar: si existe incrementa cantidad, sino lo crea
  function agregarAlCarrito(producto){
    if (!producto || producto.id == null) return;
    const idx = findIndexInCart(producto.id);
    if (idx >= 0) carrito[idx].cantidad += 1;
    else carrito.push({ ...producto, cantidad: 1 });
    guardarLocalStorage();
    renderCarrito();
    actualizarContador();
  }

  function setCantidad(id, cantidad){
    const idx = findIndexInCart(id);
    if (idx < 0) return;
    carrito[idx].cantidad = cantidad;
    if (carrito[idx].cantidad <= 0) carrito.splice(idx,1);
    guardarLocalStorage();
    renderCarrito();
    actualizarContador();
  }

  function eliminarPorId(id){
    carrito = carrito.filter(it => String(it.id) !== String(id));
    guardarLocalStorage();
    renderCarrito();
    actualizarContador();
  }

  function vaciarCarrito(){
    carrito = [];
    guardarLocalStorage();
    renderCarrito();
    actualizarContador();
  }

  // Render
  function renderCarrito(){
    if (!contenedorItems) return;
    contenedorItems.innerHTML = "";
    if (carrito.length === 0){
      contenedorItems.innerHTML = "<p>Tu carrito está vacío.</p>";
      if (totalSpan) totalSpan.textContent = "0";
      return;
    }
    const frag = document.createDocumentFragment();
    carrito.forEach(prod => {
      const wrap = document.createElement("div");
      wrap.className = "bloque-item";
      wrap.innerHTML = `
        <div class="item-left">
          ${prod.imagen ? `<img src="${prod.imagen}" alt="${escapeHtml(prod.nombre)}" width="80" loading="lazy">` : ""}
        </div>
        <div class="item-body">
          <p class="nombre-item">${escapeHtml(prod.nombre)}</p>
          <p class="precio-item">${formatCurrency(prod.precio)}</p>
          <p class="cantidad-item">
            <button class="cantidad-decrease" data-id="${prod.id}">-</button>
            <span class="cantidad-valor">${prod.cantidad}</span>
            <button class="cantidad-increase" data-id="${prod.id}">+</button>
          </p>
        </div>
        <div class="item-actions">
          <button class="boton-eliminar" data-id="${prod.id}">Eliminar</button>
        </div>
      `;
      frag.appendChild(wrap);
    });
    contenedorItems.appendChild(frag);

    const total = carrito.reduce((a,p) => a + (Number(p.precio)||0) * (p.cantidad||0), 0);
    if (totalSpan) totalSpan.textContent = total.toFixed(2);
  }

  function actualizarContador(){
    if (!contadorCarrito) return;
    const totalItems = carrito.reduce((a,p) => a + (p.cantidad||0), 0);
    contadorCarrito.innerHTML = `Cantidad: <span class="cantidadProductos">${totalItems}</span> productos`;
  }

  // Delegación de eventos (único listener central)
  function setupDelegatedListeners(){
    document.addEventListener("click", (e) => {
      const addBtn = e.target.closest && e.target.closest(".btn-carrito");
      if (addBtn){
        const id = addBtn.dataset.id;
        // obtener producto desde window.productosDesdeDB (expuesto por EJS)
        const productos = window.productosDesdeDB || [];
        const prod = productos.find(p => String(p.id) === String(id));
        if (!prod){
          console.warn("Producto no encontrado para id", id);
        } else {
          agregarAlCarrito({ id: prod.id, nombre: prod.nombre, precio: Number(prod.precio), imagen: prod.imagen, tipo: prod.tipo });
        }
        return;
      }

      if (e.target.matches(".boton-eliminar")){
        const id = e.target.dataset.id;
        eliminarPorId(id);
        return;
      }

      if (e.target.matches(".cantidad-increase")){
        const id = e.target.dataset.id;
        const idx = findIndexInCart(id);
        if (idx >= 0) setCantidad(id, carrito[idx].cantidad + 1);
        return;
      }

      if (e.target.matches(".cantidad-decrease")){
        const id = e.target.dataset.id;
        const idx = findIndexInCart(id);
        if (idx >= 0) setCantidad(id, carrito[idx].cantidad - 1);
        return;
      }
    });

    if (btnVaciarGlobal) btnVaciarGlobal.addEventListener("click", (ev)=>{ ev.preventDefault(); vaciarCarrito(); });
    if (btnPagar) btnPagar.addEventListener("click", (ev)=>{ ev.preventDefault(); checkout(); });
  }

  // checkout simple (usa /api/ventas). Ajustalo si necesitas.
  async function checkout(){
    if (!carrito || carrito.length === 0){ alert("El carrito está vacío."); return; }
    const nombreUsuario = window.NOMBRE_USUARIO || null;
    if (!nombreUsuario){ alert("Necesitamos tu nombre. Volviendo al inicio."); window.location.href = "/index"; return; }
    const productosPayload = carrito.map(it => ({ producto_id: it.id, precio: it.precio, cantidad: it.cantidad }));
    const body = { nombre_usuario: nombreUsuario, productos: productosPayload };
    try {
      const res = await fetch("/api/ventas", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
      if (!res.ok){ const err = await res.json().catch(()=>null); console.error(err); alert("Error procesando la compra"); return; }
      const data = await res.json().catch(()=>({}));
      vaciarCarrito();
      alert(data.message || "Compra registrada con éxito");
      window.location.href = "/index";
    } catch (err){
      console.error("checkout error", err);
      alert("Error de red en el pago");
    }
  }

  // Init
  function init(){
    loadLocalStorage();
    setupDelegatedListeners();
    renderCarrito();
    actualizarContador();
  }

  document.addEventListener("DOMContentLoaded", init);

  // debug
  window.miCarrito = { agregarAlCarrito, vaciarCarrito, obtenerCarrito: ()=>carrito };
})();
