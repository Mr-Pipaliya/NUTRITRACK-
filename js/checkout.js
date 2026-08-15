// js/checkout.js

let cartItems = [];
let totalAmount = 0;
const deliveryFee = 50;
let selectedPayMethod = 'razorpay';

document.addEventListener('DOMContentLoaded', () => {
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  
  const users = LocalDB.getUsers();
  const userData = users[currentUser];
  if (userData && userData.name) {
    document.getElementById('chkName').value = userData.name;
  }
  
  cartItems = LocalDB.getData('cart', currentUser);
  
  if (cartItems.length === 0) {
    showToast('Cart is empty', 'warning');
    setTimeout(() => window.location.href = 'store.html', 1500);
    return;
  }
  
  let subtotal = 0;
  let count = 0;
  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
    count += item.quantity;
  });
  
  totalAmount = subtotal + deliveryFee;
  document.getElementById('chkItemCount').textContent = count;
  document.getElementById('chkSubtotal').textContent = `₹${subtotal}`;
  document.getElementById('chkTotal').textContent = `₹${totalAmount}`;

  document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
});

function selectPayment(method) {
  selectedPayMethod = method;
  document.querySelectorAll('.pay-option').forEach(opt => opt.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
}

function handleCheckout(e) {
  e.preventDefault();
  
  if (!currentUser) return;
  if (cartItems.length === 0) return showToast('Cart is empty', 'error');
  
  const address = {
    name: document.getElementById('chkName').value,
    phone: document.getElementById('chkPhone').value,
    address: document.getElementById('chkAddress').value,
    pin: document.getElementById('chkPin').value
  };
  
  const btn = document.getElementById('placeOrderBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  
  if (selectedPayMethod === 'cod') {
    setTimeout(() => {
      saveOrder(address, 'Cash on Delivery', 'Pending');
    }, 1000);
  } else {
    // Razorpay Integration Demo
    const options = {
      key: "rzp_test_YOUR_KEY_HERE", // Replace with your Razorpay Test Key
      amount: totalAmount * 100, // Amount in paise
      currency: "INR",
      name: "NutriTrack+",
      description: "Health Store Purchase",
      handler: function (response) {
        saveOrder(address, 'Razorpay (Online)', 'Paid', response.razorpay_payment_id);
      },
      prefill: {
        name: address.name,
        email: currentUser,
        contact: address.phone
      },
      theme: { color: "#00F5A0" }
    };
    
    if (typeof Razorpay !== 'undefined') {
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response){
        showToast('Payment Failed: ' + response.error.description, 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
      });
      rzp.open();
    } else {
      showToast('Payment gateway not available. Faking success.', 'info');
      setTimeout(() => {
        saveOrder(address, 'Razorpay (Simulated)', 'Paid', 'pay_' + generateId());
      }, 1000);
    }
  }
}

function saveOrder(address, method, paymentStatus, paymentId = null) {
  const order = {
    id: generateId(),
    items: cartItems,
    total: totalAmount,
    deliveryFee: deliveryFee,
    address: address,
    paymentMethod: method,
    paymentStatus: paymentStatus,
    paymentId: paymentId,
    status: 'Placed',
    created_at: new Date().toISOString()
  };
  
  let orders = LocalDB.getData('orders', currentUser);
  orders.push(order);
  LocalDB.saveData('orders', currentUser, orders);
  
  // Clear cart
  LocalDB.saveData('cart', currentUser, []);
  
  document.getElementById('successOrderId').textContent = '#' + order.id.toUpperCase();
  document.getElementById('successModal').classList.add('active');
  launchConfetti();
}

function launchConfetti() {
  const colors = ['#00F5A0', '#00D4FF', '#FFB347', '#FF4D6D', '#FFFFFF'];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 10 + 5;
    p.style.cssText = `position:fixed;top:-10px;left:${Math.random() * 100}vw;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:2px;pointer-events:none;z-index:9999;animation:confettiFall ${Math.random() * 2 + 1.5}s linear ${Math.random() * 0.5}s forwards;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3500);
  }
}

const style = document.createElement('style');
style.innerHTML = `@keyframes confettiFall { to { transform: translateY(110vh) rotate(720deg); } }`;
document.head.appendChild(style);
