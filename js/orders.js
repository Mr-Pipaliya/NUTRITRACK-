// js/orders.js

document.addEventListener('DOMContentLoaded', () => {
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  loadOrders();
});

function loadOrders() {
  const container = document.getElementById('ordersList');
  const orders = LocalDB.getData('orders', currentUser);
  
  // Sort descending
  orders.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  
  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text3);">
        <i class="fas fa-box-open fa-2x" style="opacity: 0.5; margin-bottom: 12px;"></i>
        <p>You haven't placed any orders yet.</p>
        <a href="store.html" class="btn btn-outline" style="margin-top: 16px;">Shop Now</a>
      </div>
    `;
    return;
  }
  
  let html = '';
  orders.forEach(order => {
    const orderId = order.id.toUpperCase();
    const date = new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const itemsHtml = order.items.map(item => `
      <div class="o-item">
        <div class="o-item-name">
          <span style="color: var(--text3); font-size: 12px;">${item.quantity}x</span>
          ${item.name}
        </div>
        <div class="o-item-price">₹${item.price * item.quantity}</div>
      </div>
    `).join('');
    
    let statusColor = 'var(--primary)';
    let statusBg = 'rgba(0, 245, 160, 0.15)';
    if (order.status === 'Pending') {
      statusColor = 'var(--warning)';
      statusBg = 'rgba(255, 179, 71, 0.15)';
    }
    
    html += `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-id">Order #${orderId}</div>
            <div class="order-date">${date} • ${order.paymentMethod}</div>
          </div>
          <div class="order-status" style="color: ${statusColor}; background: ${statusBg};">${order.status}</div>
        </div>
        <div class="order-items">
          ${itemsHtml}
        </div>
        <div class="order-footer">
          <div class="order-total-label">Total Amount</div>
          <div class="order-total-val">₹${order.total}</div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}
