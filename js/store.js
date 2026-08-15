// js/store.js

const FALLBACK_PRODUCTS = [
  { id: 'p1', name: 'Organic Kimchi (500g)', price: 350, img: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&w=400&q=80', desc: 'Spicy fermented cabbage rich in probiotics.' },
  { id: 'p2', name: 'Fresh Kombucha (1L)', price: 250, img: 'https://images.unsplash.com/photo-1596700018151-54b9d0b0efcb?auto=format&fit=crop&w=400&q=80', desc: 'Sparkling fermented tea for gut health.' },
  { id: 'p3', name: 'Miso Paste (250g)', price: 400, img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80', desc: 'Traditional Japanese soybean seasoning.' },
  { id: 'p4', name: 'Greek Yogurt Starter', price: 150, img: 'https://images.unsplash.com/photo-1555506085-71fa2841dc33?auto=format&fit=crop&w=400&q=80', desc: 'Make your own probiotic-rich yogurt at home.' },
  { id: 'p5', name: 'Premium Whey Protein (1kg)', price: 1800, img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=400&q=80', desc: 'High-quality whey protein isolate for muscle recovery.' },
  { id: 'p6', name: 'Organic Chia Seeds (250g)', price: 200, img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80', desc: 'Rich in Omega-3 fatty acids and fiber.' },
  { id: 'p7', name: 'Mixed Roasted Nuts (500g)', price: 650, img: 'https://images.unsplash.com/photo-1599598425947-330026296906?auto=format&fit=crop&w=400&q=80', desc: 'Healthy mix of almonds, walnuts, and cashews.' },
  { id: 'p8', name: 'Apple Cider Vinegar (500ml)', price: 300, img: 'https://images.unsplash.com/photo-1650371906757-5bbf89849202?auto=format&fit=crop&w=400&q=80', desc: 'Raw, unfiltered with the "mother" for digestion.' },
  { id: 'p9', name: 'Unsweetened Peanut Butter (1kg)', price: 400, img: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?auto=format&fit=crop&w=400&q=80', desc: '100% roasted peanuts with no added sugar or oil.' },
  { id: 'p10', name: 'Rolled Oats (1kg)', price: 250, img: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=400&q=80', desc: 'Perfect for a healthy, fiber-rich breakfast.' },
  { id: 'p11', name: 'Matcha Green Tea (50g)', price: 450, img: 'https://images.unsplash.com/photo-1582787010464-67d710bf4953?auto=format&fit=crop&w=400&q=80', desc: 'Antioxidant-rich ceremonial grade matcha powder.' },
  { id: 'p12', name: 'Organic Quinoa (500g)', price: 220, img: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=400&q=80', desc: 'Gluten-free super grain packed with protein.' }
];

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updateCartBadge();
});

function loadProducts() {
  const grid = document.getElementById('productsGrid');
  const products = FALLBACK_PRODUCTS; // Just use static for now as we removed Firestore
  
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}" class="product-img">
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">₹${p.price}</div>
        <button class="btn btn-outline btn-full" onclick="addToCart('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.img}')" style="font-size: 13px; padding: 8px;">
          <i class="fas fa-cart-plus"></i> Add
        </button>
      </div>
    </div>
  `).join('');
}

function addToCart(id, name, price, img) {
  if (currentUser) {
    let cart = LocalDB.getData('cart', currentUser);
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id, name, price, img, quantity: 1, added_at: new Date().toISOString() });
    }
    LocalDB.saveData('cart', currentUser, cart);
    showToast(`${name} added to cart`, 'success');
    updateCartBadge();
  } else {
    let cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id, name, price, img, quantity: 1 });
    }
    localStorage.setItem('tempCart', JSON.stringify(cart));
    showToast(`${name} added to cart`, 'success');
    updateCartBadge();
  }
}

function updateCartBadge() {
  let cart = [];
  if (currentUser) {
    cart = LocalDB.getData('cart', currentUser);
  } else {
    cart = JSON.parse(localStorage.getItem('tempCart') || '[]');
  }
  
  const qty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cartCount');
  
  if (qty > 0) {
    badge.textContent = qty;
    badge.classList.remove('hide');
  } else {
    badge.classList.add('hide');
  }
}
