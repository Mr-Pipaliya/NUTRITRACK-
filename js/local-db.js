// js/local-db.js

// Simulate a local database and auth system using localStorage

const LocalDB = {
  getUsers: () => JSON.parse(localStorage.getItem('nt_users') || '{}'),
  saveUsers: (users) => localStorage.setItem('nt_users', JSON.stringify(users)),
  
  getCurrentUser: () => {
    const email = localStorage.getItem('nt_currentUser');
    if (!email) return null;
    const users = LocalDB.getUsers();
    return users[email] || null;
  },
  
  setCurrentUser: (email) => {
    if (email) {
      localStorage.setItem('nt_currentUser', email);
    } else {
      localStorage.removeItem('nt_currentUser');
    }
  },
  
  // Data access helpers
  getData: (collection, email) => JSON.parse(localStorage.getItem(`nt_${collection}_${email}`) || '[]'),
  saveData: (collection, email, data) => localStorage.setItem(`nt_${collection}_${email}`, JSON.stringify(data)),
  
  getDict: (collection, email) => JSON.parse(localStorage.getItem(`nt_${collection}_${email}`) || '{}'),
  saveDict: (collection, email, data) => localStorage.setItem(`nt_${collection}_${email}`, JSON.stringify(data)),
};

// Expose a global currentUser variable to match previous behavior
let currentUser = LocalDB.getCurrentUser();

function checkAuthStatus(requireAuth = true) {
  currentUser = LocalDB.getCurrentUser();
  const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html') || window.location.pathname.includes('forgot-password.html');
  const isIndex = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '';
  
  if (currentUser) {
    if (isAuthPage) window.location.href = 'dashboard.html';
  } else {
    if (requireAuth && !isAuthPage && !isIndex) window.location.href = 'login.html';
  }
}

// Generate unique IDs
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Automatically run auth check
checkAuthStatus(false); // Check redirect for index/auth, but don't force login everywhere unless specified. Actually, wait. We should force auth everywhere EXCEPT auth pages and store.

