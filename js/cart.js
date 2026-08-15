// js/cart.js

let cartItems = [];
const deliveryFee = 50;

document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) {
    migrateLocalCart();
    loadCart();
  } else {
    loadLocalCart();
  }
});

function migrateLocalCart() {
  const local = JSON.parse(localStorage.getItem('tempCart') || '[]');
  if (local.length > 0) {
    let userCart = LocalDB.getData('cart', currentUser);
    
    local.forEach(item => {
      const existing = userCart.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        userCart.push({ ...item, added_at: new Date().toISOString() });
      }
    });
    
    LocalDB.saveData('cart', currentUser, userCart);
    localStorage.removeItem('tempCart');
  }
}

function loadLocalCart() {
  cartItems = JSON.parse(localStorage.getItem('tempCart') || '[]');
  renderCart();
}

function loadCart() {
  cartItems = LocalDB.getData('cart', currentUser);
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cartList');
  const summary = document.getElementById('cartSummary');
  
  if (cartItems.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text3);">
        <i class="fas fa-shopping-cart fa-2x" style="opacity: 0.5; margin-bottom: 12px;"></i>
        <p>Your cart is empty.</p>
        <a href="store.html" class="btn btn-outline" style="margin-top: 16px;">Browse Store</a>
      </div>
    `;
    summary.classList.add('hide');
    return;
  }
  
  let subtotal = 0;
  list.innerHTML = cartItems.map(item => {
    subtotal += item.price * item.quantity;
    return `
      <div class="cart-item">
        <img src="${item.img}" class="cart-img">
        <div class="cart-info">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="cart-name">${item.name}</div>
            <button class="cart-del" onclick="removeItem('${item.id}')"><i class="fas fa-trash"></i></button>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div class="cart-price">₹${item.price}</div>
            <div class="qty-controls">
              <button class="qty-btn" onclick="updateQty('${item.id}', -1)"><i class="fas fa-minus" style="font-size: 10px;"></i></button>
              <div class="qty-val">${item.quantity}</div>
              <button class="qty-btn" onclick="updateQty('${item.id}', 1)"><i class="fas fa-plus" style="font-size: 10px;"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  summary.classList.remove('hide');
  document.getElementById('subtotal').textContent = `₹${subtotal}`;
  document.getElementById('totalAmount').textContent = `₹${subtotal + deliveryFee}`;
}

function updateQty(id, change) {
  if (currentUser) {
    let cart = LocalDB.getData('cart', currentUser);
    const idx = cart.findIndex(i => i.id === id);
    if (idx !== -1) {
      cart[idx].quantity += change;
      if (cart[idx].quantity <= 0) cart.splice(idx, 1);
      LocalDB.saveData('cart', currentUser, cart);
      loadCart();
    }
  } else {
    let local = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const idx = local.findIndex(i => i.id === id);
    if (idx !== -1) {
      local[idx].quantity += change;
      if (local[idx].quantity <= 0) local.splice(idx, 1);
      localStorage.setItem('tempCart', JSON.stringify(local));
      loadLocalCart();
    }
  }
}

function removeItem(id) {
  if (currentUser) {
    let cart = LocalDB.getData('cart', currentUser);
    cart = cart.filter(i => i.id !== id);
    LocalDB.saveData('cart', currentUser, cart);
    showToast('Item removed', 'info');
    loadCart();
  } else {
    let local = JSON.parse(localStorage.getItem('tempCart') || '[]');
    local = local.filter(i => i.id !== id);
    localStorage.setItem('tempCart', JSON.stringify(local));
    showToast('Item removed', 'info');
    loadLocalCart();
  }
}
