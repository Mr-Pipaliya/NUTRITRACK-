/**
 * NUTRITRACK+ — Shared App Utilities
 * Ripple · Toast · 3D Tilt · Swipe Gesture · Number Counter
 */

/* ════════ RIPPLE ════════════════════════════ */
document.addEventListener('pointerdown', (e) => {
  const target = e.target.closest('.btn, .quick-btn, .water-drop, .cat-tab, .bnav-item, .routine-item, .pay-option');
  if (!target) return;
  const rect   = target.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  const size = Math.max(rect.width, rect.height) * 2.2;
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;`;
  target.appendChild(ripple);
  setTimeout(() => ripple.remove(), 560);
});

/* ════════ TOAST ═════════════════════════════ */
const _tc = (() => {
  const el = document.createElement('div');
  el.id = 'toastContainer';
  document.body.appendChild(el);
  return el;
})();

window.toast = function(msg, type = 'ok', duration = 3000) {
  const icons = { ok:'✓', err:'✕', warn:'⚠', info:'ℹ' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type] || '✓'}</span><span class="toast-msg">${msg}</span>`;
  _tc.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 280);
  }, duration);
};

/* ════════ 3D CARD TILT ══════════════════════ */
window.initTilt = function(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `perspective(700px) rotateY(${dx*7}deg) rotateX(${-dy*7}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
};

/* ════════ SWIPE-TO-DELETE ═══════════════════ */
window.initSwipeDel = function(selector, onDel) {
  document.querySelectorAll(selector).forEach(el => {
    let sx = 0, swiping = false;
    el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; swiping = false; }, { passive: true });
    el.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - sx;
      if (dx < -18) {
        swiping = true;
        el.style.transform  = `translateX(${Math.max(dx, -90)}px)`;
        el.style.transition = 'none';
      }
    }, { passive: true });
    el.addEventListener('touchend', e => {
      el.style.transition = '';
      const dx = e.changedTouches[0].clientX - sx;
      if (swiping && dx < -80) {
        const h = el.offsetHeight;
        el.style.height  = h + 'px';
        el.style.opacity = '0';
        el.style.transform = 'translateX(-110%)';
        setTimeout(() => {
          el.style.height  = '0';
          el.style.margin  = '0';
          el.style.padding = '0';
          el.style.border  = 'none';
          setTimeout(() => { onDel(el); el.remove(); }, 220);
        }, 280);
      } else {
        el.style.transform = '';
      }
    });
  });
};

/* ════════ NUMBER COUNTER ANIMATION ══════════ */
window.animCount = function(el, target, duration = 900) {
  const from = parseInt(el.textContent.replace(/,/g,'')) || 0;
  const diff = target - from;
  const t0   = performance.now();
  const raf  = (now) => {
    const p = Math.min((now - t0) / duration, 1);
    const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(from + diff * e).toLocaleString();
    if (p < 1) requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
};

/* ════════ PROGRESS RING ══════════════════════ */
window.setRing = function(id, pct) {
  const ring = document.getElementById(id);
  if (!ring) return;
  const circ   = 2 * Math.PI * 80; // r=80
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  ring.style.strokeDashoffset = offset;
};

/* ════════ ACTIVE NAV HIGHLIGHT ══════════════ */
function _highlightNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .bnav-item').forEach(a => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('active', href === page);
  });
}

/* ════════ NAVBAR SCROLL SHADOW ══════════════ */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.style.boxShadow = scrollY > 20 ? '0 4px 30px rgba(0,0,0,0.55)' : '';
}, { passive: true });

/* ════════ PAGE INIT ══════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  _highlightNav();

  // Stagger entrance for cards
  document.querySelectorAll('.card, .stat-card').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.04}s`;
    el.classList.add('anim-page');
  });

  // Init tilt on food cards (if any present)
  initTilt('.food-card');
});
