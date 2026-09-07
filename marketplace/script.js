const productos = [
  { id:1, 
    nombre:"Café orgánico Tierra Alta 500g",
    tienda:"Finca Tierra Alta · Huila",
    categoria:"Alimentos y bebidas", 
    precio:38000, 
    rating:4.8, 
    resenas:132, 
    stock:24, 
    imagen:"marketplace/cafe.jpg", 
    descripcion:"Café de origen único, cultivado a 1.800 msnm y tostado en pequeños lotes por la familia productora." 
  },
  { id:2, 
    nombre:"Vasija artesanal de barro", 
    tienda:"Barro & Fuego · Boyacá", 
    categoria:"Artesanías", 
    precio:95000, 
    rating:4.6, 
    resenas:41, 
    stock:9, 
    imagen:"marketplace/vasija.jpg", 
    descripcion:"Vasija de barro cocido, moldeada y pintada a mano por artesanos de Ráquira." 
  },
  { id:3, 
    nombre:"Mochila tejida wayuu", 
    tienda:"Telar Wayuu · Riohacha", 
    categoria:"Moda y accesorios", 
    precio:180000, 
    rating:5.0, resenas:87, 
    stock:5, 
    icono:"textil", 
    descripcion:"Mochila tejida a mano en algodón, con patrones tradicionales wayuu." 
  },
  { id:4, 
    nombre:"Miel pura de abejas 350ml", 
    tienda:"Apiario San Vicente", 
    categoria:"Alimentos y bebidas", 
    precio:22000, 
    rating:4.7, 
    resenas:64, 
    stock:40, 
    icono:"miel", 
    descripcion:"Miel 100% pura extraída en frío, sin aditivos ni procesos industriales." 
  },
  { id:5, 
    nombre:"Aretes de filigrana en plata", 
    tienda:"Joyería Mompox", 
    categoria:"Moda y accesorios", 
    precio:145000, 
    rating:4.9, 
    resenas:29, 
    stock:7, 
    icono:"joyeria", 
    descripcion:"Aretes elaborados con la técnica tradicional de filigrana momposina." 
  },
  { id:6, 
    nombre:"Chocolate 70% cacao 100g", 
    tienda:"Cacao Sierra Nevada", 
    categoria:"Alimentos y bebidas", 
    precio:15000, 
    rating:4.5, 
    resenas:58, 
    stock:60, 
    icono:"chocolate", 
    descripcion:"Barra de chocolate oscuro elaborada con cacao fino de aroma." 
  },
  { id:7, 
    nombre:"Velas de cera de abeja (set x3)", 
    tienda:"Casa Cera", 
    categoria:"Hogar", 
    precio:48000, 
    rating:4.4, 
    resenas:19, 
    stock:15, 
    icono:"vela", 
    descripcion:"Velas artesanales de cera de abeja natural." 
  },
  { id:8, 
    nombre:"Jabón natural de avena 100g", 
    tienda:"Raíz Botánica", 
    categoria:"Belleza natural", 
    precio:12000, 
    rating:4.6, 
    resenas:73, 
    stock:33, 
    icono:"jabon", 
    descripcion:"Jabón artesanal elaborado con avena e ingredientes vegetales." 
  }
];

const iconosSVG = {
  cafe:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="24" y="38" width="42" height="38" rx="6" fill="rgb(200,132,36)"/><path d="M66 46h8a10 10 0 0 1 0 20h-8" fill="none" stroke="rgb(22,40,31)" stroke-width="5"/></svg>`,
  ceramica:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M35 30h30l-4 12c6 6 9 15 9 24 0 14-9 22-20 22s-20-8-20-22c0-9 3-18 9-24z" fill="rgb(193,67,46)"/></svg>`,
  textil:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="26" y="34" width="48" height="46" rx="10" fill="rgb(227,165,66)"/></svg>`,
  miel:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M36 28h28v14l6 8v26a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6V50l6-8z" fill="rgb(227,165,66)"/></svg>`,
  joyeria:`<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="38" r="12" fill="none" stroke="rgb(200,132,36)" stroke-width="5"/></svg>`,
  chocolate:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="24" y="32" width="52" height="36" rx="4" fill="rgb(90,58,30)"/></svg>`,
  vela:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="38" y="42" width="24" height="36" rx="3" fill="rgb(227,165,66)"/></svg>`,
  jabon:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="26" y="38" width="48" height="28" rx="10" fill="rgb(246,241,227)" stroke="rgb(200,132,36)" stroke-width="3"/></svg>`
};

const estado = { carrito:[], wishlist:[], filtros:{ categoria:"", precioMin:null, precioMax:null, calificacion:0, soloStock:false }, busqueda:"" };
const formatoCOP = (n) => "$" + n.toLocaleString("es-CO");

function mostrarToast(texto){
  const cont = document.getElementById("toast-contenedor");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = texto;
  cont.appendChild(toast);
  requestAnimationFrame(()=> toast.classList.add("visible"));
  setTimeout(()=>{
    toast.classList.remove("visible");
    setTimeout(()=> toast.remove(), 300);
  }, 3200);
}

function productoCumpleFiltros(p){
  const f = estado.filtros;
  if (f.categoria && p.categoria !== f.categoria) return false;
  if (f.precioMin != null && p.precio < f.precioMin) return false;
  if (f.precioMax != null && p.precio > f.precioMax) return false;
  if (f.calificacion && p.rating < f.calificacion) return false;
  if (f.soloStock && p.stock <= 0) return false;
  if (estado.busqueda && !(p.nombre.toLowerCase().includes(estado.busqueda) || p.tienda.toLowerCase().includes(estado.busqueda))) return false;
  return true;
}

function renderCatalogo(){
  const grid = document.getElementById("catalogo-grid");
  if(!grid) return;
  grid.innerHTML = "";
  const visibles = productos.filter(productoCumpleFiltros);
  document.getElementById("contador-resultados").textContent = visibles.length + " productos";
  visibles.forEach((p) => {
    const article = document.createElement("article");
    article.className = "producto-card";
    article.innerHTML = `
      <figure class="producto-imagen">
        <img src="${p.imagen}" alt="${p.nombre}">
        <figcaption>${p.tienda.split(" · ")[0]}</figcaption>
        <button class="btn-wishlist" data-producto-id="${p.id}" aria-pressed="${estado.wishlist.includes(p.id)}">♥</button>
      </figure>
      <div class="producto-cuerpo">
        <span class="producto-categoria">${p.categoria}</span>
        <h3>${p.nombre}</h3>
        <p class="producto-rating">★ ${p.rating.toFixed(1)} (${p.resenas})</p>
        <div class="producto-precio-fila">
          <span class="precio-etiqueta">${formatoCOP(p.precio)}</span>
          <span class="producto-stock ${p.stock <= 5 ? 'bajo' : ''}" data-stock-id="${p.id}">${p.stock > 0 ? p.stock + ' disp.' : 'Agotado'}</span>
        </div>
        <button class="boton boton-primario btn-agregar-carrito" data-producto-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>${p.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}</button>
      </div>`;
    grid.appendChild(article);
  });
  activarBotonesAgregarCarrito();
  activarBotonesWishlist();
}

document.getElementById("form-filtros")?.addEventListener("submit", (e) => {
  e.preventDefault();
  estado.filtros.categoria = document.getElementById("filtro-categoria").value;
  estado.filtros.precioMin = document.getElementById("filtro-precio-min").value || null;
  estado.filtros.precioMax = document.getElementById("filtro-precio-max").value || null;
  estado.filtros.calificacion = Number(document.getElementById("filtro-calificacion").value);
  estado.filtros.soloStock = document.getElementById("filtro-disponible").checked;
  renderCatalogo();
});

document.getElementById("btn-limpiar-filtros")?.addEventListener("click", () => {
  setTimeout(() => {
    estado.filtros = { categoria:"", precioMin:null, precioMax:null, calificacion:0, soloStock:false };
    renderCatalogo();
  }, 0);
});

document.getElementById("btn-toggle-filtros")?.addEventListener("click", function(){
  const aside = document.getElementById("filtros-aside");
  const abierto = aside.classList.toggle("visible");
  this.setAttribute("aria-expanded", abierto);
});

document.getElementById("form-busqueda-global")?.addEventListener("submit", (e) => {
  e.preventDefault();
  estado.busqueda = document.getElementById("busqueda-global").value.trim().toLowerCase();
  renderCatalogo();
});

document.getElementById("btn-menu")?.addEventListener("click", function(){
  const nav = document.getElementById("nav-categorias");
  const abierto = nav.classList.toggle("abierto");
  this.setAttribute("aria-expanded", abierto);
});

async function agregarAlCarrito(idProducto){
  return new Promise((resolve) => {
    setTimeout(() => {
      const producto = productos.find((p) => p.id === Number(idProducto));
      const existente = estado.carrito.find((i) => i.id === producto.id);
      if (existente) { existente.cantidad += 1; } 
      else { estado.carrito.push({ ...producto, cantidad: 1 }); }
      if (producto.stock > 0) producto.stock -= 1;
      resolve({ producto, totalItems: estado.carrito.reduce((acc, i) => acc + i.cantidad, 0) });
    }, 100);
  });
}

function activarBotonesAgregarCarrito(){
  document.querySelectorAll(".btn-agregar-carrito").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      if (btn.closest("form")) e.preventDefault();
      const idProducto = btn.dataset.productoId;
      if (!idProducto) return;
      btn.disabled = true;
      const item = await agregarAlCarrito(idProducto);
      document.querySelector("#contador-carrito").textContent = item.totalItems;
      renderListaCarrito();
      actualizarStockEnPantalla(item.producto.id);
      mostrarToast(`${item.producto.nombre} se agregó al carrito.`);
      btn.disabled = item.producto.stock <= 0;
      if (item.producto.stock <= 0) btn.textContent = "Sin stock";
    });
  });
}

function actualizarStockEnPantalla(idProducto){
  const producto = productos.find((p) => p.id === idProducto);
  const badge = document.querySelector(`[data-stock-id="${idProducto}"]`);
  if (badge) {
    badge.textContent = producto.stock > 0 ? producto.stock + " disp." : "Agotado";
    badge.classList.toggle("bajo", producto.stock <= 5);
  }
  renderInventario();
}

function renderListaCarrito(){
  const lista = document.getElementById("lista-carrito");
  if(!lista) return;
  lista.innerHTML = "";
  if (estado.carrito.length === 0) {
    lista.innerHTML = `<li class="carrito-vacio">Tu carrito está vacío.</li>`;
  } else {
    estado.carrito.forEach((item) => {
      const li = document.createElement("li");
      li.className = "carrito-item";
      li.innerHTML = `<span>${item.nombre} × ${item.cantidad}</span><span>${formatoCOP(item.precio * item.cantidad)}</span>`;
      lista.appendChild(li);
    });
  }
  const subtotal = estado.carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  document.getElementById("carrito-subtotal").textContent = formatoCOP(subtotal);
  document.getElementById("resumen-subtotal").textContent = formatoCOP(subtotal);
  const envio = subtotal > 0 ? 8000 : 0;
  document.getElementById("resumen-envio").textContent = formatoCOP(envio);
  document.getElementById("resumen-total").textContent = formatoCOP(subtotal + envio);
}

const carritoDrawer = document.getElementById("carrito-drawer");
const carritoOverlay = document.getElementById("carrito-overlay");

function abrirCarrito(){ carritoDrawer.classList.add("visible"); carritoOverlay.classList.add("visible"); }
function cerrarCarrito(){ carritoDrawer.classList.remove("visible"); carritoOverlay.classList.remove("visible"); }

document.getElementById("btn-abrir-carrito")?.addEventListener("click", abrirCarrito);
document.getElementById("btn-cerrar-carrito")?.addEventListener("click", cerrarCarrito);
carritoOverlay?.addEventListener("click", cerrarCarrito);
document.getElementById("btn-ir-checkout")?.addEventListener("click", cerrarCarrito);

function activarBotonesWishlist(){
  document.querySelectorAll(".btn-wishlist").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.productoId);
      const enLista = estado.wishlist.includes(id);
      if (enLista) {
        estado.wishlist = estado.wishlist.filter((x) => x !== id);
      } else {
        estado.wishlist.push(id);
        mostrarToast("Guardado en tu lista de deseos.");
      }
      btn.setAttribute("aria-pressed", !enLista);
      renderWishlist();
    });
  });
}

function renderWishlist(){
  const cont = document.getElementById("wishlist-lista");
  if(!cont) return;
  cont.innerHTML = "";
  if (estado.wishlist.length === 0) {
    cont.innerHTML = `<p class="wishlist-vacio">Aún no has guardado productos.</p>`;
    return;
  }
  estado.wishlist.forEach((id) => {
    const p = productos.find((prod) => prod.id === id);
    if (!p) return;
    const div = document.createElement("div");
    div.className = "wishlist-item";
    div.innerHTML = `<span>${p.nombre}<br><small style="color:#7a8a80;">${formatoCOP(p.precio)}</small></span><button class="boton boton-linea btn-agregar-carrito" data-producto-id="${p.id}">Agregar</button>`;
    cont.appendChild(div);
  });
  activarBotonesAgregarCarrito();
}

function renderInventario(){
  const cont = document.getElementById("inventario-lista");
  if(!cont) return;
  cont.innerHTML = "";
  productos.forEach((p) => {
    const porcentaje = Math.min(100, Math.round((p.stock / 60) * 100));
    const div = document.createElement("div");
    div.className = "inventario-item";
    div.innerHTML = `<div><strong>${p.nombre}</strong><div class="barra"><i style="width:${porcentaje}%;"></i></div></div><span>${p.stock} und.</span>`;
    cont.appendChild(div);
  });
}

function cargarFichaProducto(idProducto){
  const p = productos.find((prod) => prod.id === idProducto);
  if(!p) return;
  document.getElementById("ficha-nombre").textContent = p.nombre;
  document.getElementById("ficha-tienda").textContent = p.tienda;
  document.getElementById("ficha-descripcion").textContent = p.descripcion;
  document.getElementById("ficha-precio").textContent = formatoCOP(p.precio);
  document.getElementById("ficha-stock").textContent = p.stock + " unidades disponibles";
  document.getElementById("ficha-imagen-svg").src = p.imagen;
  document.getElementById("ficha-imagen-svg").alt = p.nombre;
}

document.querySelectorAll('input[name="rol"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const esVendedor = document.getElementById("radio-vendedor").checked;
    document.getElementById("campos-tienda").classList.toggle("visible", esVendedor);
  });
});

document.getElementById("form-registro")?.addEventListener("submit", (e) => {
  e.preventDefault();
  mostrarToast("Cuenta creada correctamente.");
});

document.getElementById("form-checkout")?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (estado.carrito.length === 0) {
    document.getElementById("mensaje-checkout").textContent = "Agrega al menos un producto al carrito.";
    return;
  }
  mostrarToast("¡Pago procesado con éxito!");
  estado.carrito = [];
  renderListaCarrito();
  document.getElementById("contador-carrito").textContent = "0";
});

// Inicialización
renderCatalogo();
renderListaCarrito();
renderWishlist();
renderInventario();
cargarFichaProducto(1);
