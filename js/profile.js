// js/profile.js

document.addEventListener('DOMContentLoaded', () => {
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  
  loadProfile();

  document.getElementById('profileForm').addEventListener('submit', saveProfile);
  document.getElementById('editProfileForm').addEventListener('submit', submitEditProfile);
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to log out?')) {
      LocalDB.setCurrentUser(null);
      window.location.href = 'index.html';
    }
  });
});

function loadProfile() {
  const users = LocalDB.getUsers();
  const data = users[currentUser] || {};
  
  document.getElementById('profName').textContent = data.name || 'User';
  document.getElementById('profEmail').textContent = currentUser;
  
  const avatar = document.getElementById('avatarInitials');
  if (data.photo) {
    avatar.style.background = `url('${data.photo}') center/cover`;
    avatar.textContent = '';
    
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview) {
      photoPreview.src = data.photo;
      photoPreview.style.display = 'block';
      document.getElementById('photoIcon').style.display = 'none';
      currentBase64Photo = data.photo;
    }
  } else {
    avatar.style.background = 'linear-gradient(135deg, var(--primary), var(--primary2))';
    const initials = (data.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    avatar.textContent = initials;
    
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview) {
      photoPreview.style.display = 'none';
      document.getElementById('photoIcon').style.display = 'block';
      currentBase64Photo = null;
    }
  }
  
  if (document.getElementById('modalProfName')) {
    document.getElementById('modalProfName').value = data.name || '';
  }
  
  document.getElementById('profWeight').value = data.weight || '';
  document.getElementById('profHeight').value = data.height || '';
  document.getElementById('profCal').value = data.daily_cal_goal || 2000;
  
  calculateBMI(data.weight, data.height);
}

function calculateBMI(weight, height) {
  if (!weight || !height) return;
  
  const hMeters = height / 100;
  const bmi = (weight / (hMeters * hMeters)).toFixed(1);
  
  document.getElementById('bmiValue').textContent = bmi;
  
  const statusEl = document.getElementById('bmiStatus');
  let status = '';
  let color = '';
  let bg = '';
  
  if (bmi < 18.5) {
    status = 'Underweight'; color = 'var(--secondary)'; bg = 'rgba(99, 102, 241, 0.15)';
  } else if (bmi >= 18.5 && bmi < 25) {
    status = 'Healthy Weight'; color = 'var(--primary)'; bg = 'rgba(0, 245, 160, 0.15)';
  } else if (bmi >= 25 && bmi < 30) {
    status = 'Overweight'; color = 'var(--warning)'; bg = 'rgba(255, 179, 71, 0.15)';
  } else {
    status = 'Obese'; color = 'var(--danger)'; bg = 'rgba(255, 77, 109, 0.15)';
  }
  
  statusEl.textContent = status;
  statusEl.style.color = color;
  statusEl.style.background = bg;
  
  const minBmi = 15;
  const maxBmi = 40;
  let pct = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;
  pct = Math.max(0, Math.min(100, pct));
  
  setTimeout(() => {
    document.getElementById('bmiMarker').style.left = `${pct}%`;
  }, 100);
}

function saveProfile(e) {
  e.preventDefault();
  if (!currentUser) return;
  
  const weight = parseFloat(document.getElementById('profWeight').value);
  const height = parseFloat(document.getElementById('profHeight').value);
  const calGoal = parseInt(document.getElementById('profCal').value);
  
  const btn = document.getElementById('saveProfBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  
  setTimeout(() => {
    const users = LocalDB.getUsers();
    if (users[currentUser]) {
      users[currentUser].weight = weight;
      users[currentUser].height = height;
      users[currentUser].daily_cal_goal = calGoal;
      LocalDB.saveUsers(users);
    }
    
    loadProfile();
    
    calculateBMI(weight, height);
    showToast('Goals updated!', 'success');
    
    btn.disabled = false;
    btn.innerHTML = 'Save Changes';
  }, 500);
}

let currentBase64Photo = null;

function previewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (file.size > 2 * 1024 * 1024) {
    showToast('File too large. Max 2MB.', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    currentBase64Photo = e.target.result;
    document.getElementById('photoPreview').src = currentBase64Photo;
    document.getElementById('photoPreview').style.display = 'block';
    document.getElementById('photoIcon').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function submitEditProfile(e) {
  e.preventDefault();
  const name = document.getElementById('modalProfName').value.trim();
  
  const users = LocalDB.getUsers();
  if (users[currentUser]) {
    users[currentUser].name = name;
    if (currentBase64Photo) {
      users[currentUser].photo = currentBase64Photo;
    }
    LocalDB.saveUsers(users);
  }
  
  closeModal('editProfileModal');
  showToast('Profile updated successfully!', 'success');
  loadProfile();
}
