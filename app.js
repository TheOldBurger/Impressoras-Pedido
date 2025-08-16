// Dados do cardápio
const MENU = [
  { id: 'smash1', name: 'The Smash 1.0', price: 19.99 },
  { id: 'smash2', name: 'The Smash 2.0', price: 29.99 },
  { id: 'smash3', name: 'The Smash 3.0', price: 34.99 },
  { id: 'bigold', name: 'The Big Old', price: 39.99 },
  { id: 'theold', name: 'The Old', price: 35.99 },
  { id: 'cheese', name: 'The Cheeseburger', price: 25.99 },
  { id: 'cheese-super', name: 'The Cheeseburger Super', price: 44.99 },
  { id: 'frita150', name: 'Batata Frita 150g', price: 9.99 },
  { id: 'frita300', name: 'Batata Frita 300g', price: 15.99 },
  { id: 'batata-old', name: 'Batata The Old', price: 24.99 },
  { id: 'churros', name: 'Mini Churros', price: 15.99 },
  { id: 'coca2l', name: 'Coca 2L', price: 15.00 },
  { id: 'cocalata', name: 'Coca Lata Normal', price: 6.00 },
  { id: 'cocalatazero', name: 'Coca Lata Zero', price: 6.00 },
  { id: 'guarana2l', name: 'Guaraná 2L', price: 15.00 },
  { id: 'guarana-lata', name: 'Guaraná Lata', price: 6.00 },
];

// Estado
let cart = []; // { id, name, price, qty, note }
let pendingItem = null;

// Util
const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pad4 = (n) => '#' + String(n).padStart(4, '0');

function getNextOrderNumber() {
  const key = 'orderCounter';
  let n = Number(localStorage.getItem(key));
  if (!n || n < 1) n = 1;
  localStorage.setItem(key, n);
  return n;
}
function incrementOrderNumber() {
  const key = 'orderCounter';
  const n = getNextOrderNumber() + 1;
  localStorage.setItem(key, n);
  return n;
}

// DOM
const menuList = document.getElementById('menuList');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const nextOrderNumberEl = document.getElementById('nextOrderNumber');
const finalizeOrderBtn = document.getElementById('finalizeOrder');
const clearCartBtn = document.getElementById('clearCart');
const searchInput = document.getElementById('search');
const yearEl = document.getElementById('year');

// Dialog
const obsDialog = document.getElementById('obsDialog');
const obsText = document.getElementById('obsText');
const obsItemName = document.getElementById('obsItemName');
const obsConfirm = document.getElementById('obsConfirm');

// Comanda
const comandaContainer = document.getElementById('comandaContainer');
const comandaNumber = document.getElementById('comandaNumber');
const comandaItens = document.getElementById('comandaItens');
const comandaTotal = document.getElementById('comandaTotal');
const printComanda = document.getElementById('printComanda');
const closeComanda = document.getElementById('closeComanda');

// Init
function init() {
  renderMenu();
  renderCart();
  nextOrderNumberEl.textContent = pad4(getNextOrderNumber());
  yearEl.textContent = new Date().getFullYear().toString();

  // Eventos
  finalizeOrderBtn.addEventListener('click', handleFinalize);
  clearCartBtn.addEventListener('click', () => { cart = []; renderCart(); });
  searchInput.addEventListener('input', renderMenu);
  printComanda.addEventListener('click', () => window.print());
  closeComanda.addEventListener('click', () => {
    comandaContainer.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
document.addEventListener('DOMContentLoaded', init);

// Render menu
function renderMenu() {
  const q = (searchInput.value || '').toLowerCase();
  const items = MENU.filter(m => m.name.toLowerCase().includes(q));
  menuList.innerHTML = '';
  for (const m of items) {
    const li = document.createElement('li');
    li.className = 'menu-item';
    li.innerHTML = \`
      <div>
        <div class="item-name">\${m.name}</div>
        <div class="item-price">\${brl(m.price)}</div>
      </div>
      <button class="btn" data-id="\${m.id}" data-action="obs">Obs.</button>
      <button class="btn primary" data-id="\${m.id}" data-action="add">Adicionar</button>
    \`;
    // events
    li.querySelector('[data-action="add"]').addEventListener('click', () => addToCart(m));
    li.querySelector('[data-action="obs"]').addEventListener('click', () => openObsDialog(m));
    menuList.appendChild(li);
  }
}

function openObsDialog(item) {
  pendingItem = item;
  obsItemName.textContent = item.name;
  obsText.value = '';
  if (typeof obsDialog.showModal === 'function') obsDialog.showModal();
  else obsDialog.setAttribute('open', '');
}

obsConfirm.addEventListener('click', (e) => {
  e.preventDefault();
  if (!pendingItem) return;
  addToCart(pendingItem, obsText.value.trim());
  pendingItem = null;
  obsDialog.close();
});

function addToCart(item, note = '') {
  const existing = cart.find(c => c.id === item.id && c.note === note);
  if (existing) existing.qty += 1;
  else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1, note });
  renderCart();
}

function renderCart() {
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach((c, idx) => {
    total += c.price * c.qty;
    const li = document.createElement('li');
    li.className = 'cart-item';
    const note = c.note ? \`<div class="note">(\${c.note})</div>\` : '';
    li.innerHTML = \`
      <div>
        <div class="item-name">\${c.name}</div>
        \${note}
      </div>
      <div class="item-price">\${brl(c.price * c.qty)}</div>
      <div class="qty-controls">
        <button class="btn qty-btn" data-idx="\${idx}" data-act="dec">–</button>
        <span>\${c.qty}</span>
        <button class="btn qty-btn" data-idx="\${idx}" data-act="inc">+</button>
        <button class="btn qty-btn" data-idx="\${idx}" data-act="rm">x</button>
      </div>
    \`;
    li.querySelector('[data-act="dec"]').addEventListener('click', () => changeQty(idx, -1));
    li.querySelector('[data-act="inc"]').addEventListener('click', () => changeQty(idx, +1));
    li.querySelector('[data-act="rm"]').addEventListener('click', () => removeItem(idx));
    cartList.appendChild(li);
  });
  cartTotal.textContent = brl(total);
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}
function removeItem(idx) {
  cart.splice(idx, 1);
  renderCart();
}

function handleFinalize() {
  if (cart.length === 0) {
    alert('Adicione pelo menos 1 item ao pedido.');
    return;
  }
  const orderNumber = getNextOrderNumber();
  // Render comanda
  comandaNumber.textContent = pad4(orderNumber);
  comandaItens.innerHTML = '';
  let total = 0;
  cart.forEach(c => {
    total += c.price * c.qty;
    const li = document.createElement('li');
    const obs = c.note ? \` (\${c.note})\` : '';
    li.textContent = \`\${c.qty} \${c.name}\${obs}\`;
    comandaItens.appendChild(li);
  });
  comandaTotal.textContent = brl(total);
  comandaContainer.classList.remove('hidden');
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  // Preparar para o próximo pedido
  incrementOrderNumber();
  nextOrderNumberEl.textContent = pad4(getNextOrderNumber());
  cart = [];
  renderCart();
}
