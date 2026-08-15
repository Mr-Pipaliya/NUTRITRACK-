// js/auth.js

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const googleSignupBtn = document.getElementById('googleSignupBtn');
  const onboardingForm = document.getElementById('onboardingForm');
  
  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.toLowerCase();
      const password = document.getElementById('password').value;
      const btn = document.getElementById('loginBtn');
      const errorDiv = document.getElementById('loginError');
      const errorText = document.getElementById('loginErrorText');
      
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      errorDiv.style.display = 'none';
      
      setTimeout(() => {
        const users = LocalDB.getUsers();
        if (users[email] && users[email].password === password) {
          LocalDB.setCurrentUser(email);
          window.location.href = 'dashboard.html';
        } else {
          errorText.textContent = 'Invalid email or password.';
          errorDiv.style.display = 'block';
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Log In';
        }
      }, 500); // Simulate network delay
    });
  }

  // Signup
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value.toLowerCase();
      const password = document.getElementById('password').value;
      const btn = document.getElementById('signupBtn');
      const errorDiv = document.getElementById('signupError');
      const errorText = document.getElementById('signupErrorText');
      
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
      errorDiv.style.display = 'none';
      
      setTimeout(() => {
        const users = LocalDB.getUsers();
        if (users[email]) {
          errorText.textContent = 'An account with this email already exists.';
          errorDiv.style.display = 'block';
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
        } else {
          // Create new user
          users[email] = { name, email, password, created_at: new Date().toISOString() };
          LocalDB.saveUsers(users);
          LocalDB.setCurrentUser(email);
          
          // Show onboarding step
          document.getElementById('step1').classList.add('hide');
          document.getElementById('step2').classList.remove('hide');
          document.getElementById('loginLink').classList.add('hide');
          document.querySelector('.auth-title').textContent = 'Personalize';
          document.querySelector('.auth-subtitle').textContent = `Welcome, ${name.split(' ')[0]}!`;
        }
      }, 500);
    });
  }
  
  // Onboarding Submit
  if (onboardingForm) {
    onboardingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const age = parseInt(document.getElementById('age').value);
      const gender = document.getElementById('gender').value;
      const weight = parseFloat(document.getElementById('weight').value);
      const height = parseFloat(document.getElementById('height').value);
      const goal = document.getElementById('goal').value;
      const btn = document.getElementById('completeBtn');
      
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      
      setTimeout(() => {
        const email = LocalDB.getCurrentUser();
        if (!email) {
          showToast('Session expired. Please log in again.', 'error');
          setTimeout(() => window.location.href = 'login.html', 1500);
          return;
        }
        
        const users = LocalDB.getUsers();
        
        // Calculate BMR and daily cal goal (Mifflin-St Jeor Equation)
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr = gender === 'male' ? bmr + 5 : bmr - 161;
        
        let dailyCal = Math.round(bmr * 1.2); // Sedentary multiplier
        if (goal === 'weightLoss') dailyCal -= 500;
        if (goal === 'muscleGain') dailyCal += 300;
        
        // Update user
        users[email] = {
          ...users[email],
          age, gender, weight, height, goal_type: goal, daily_cal_goal: dailyCal
        };
        LocalDB.saveUsers(users);
        
        window.location.href = 'dashboard.html';
      }, 500);
    });
  }

  // Google Auth (Mock since Firebase is removed)
  const googleAuthMock = () => {
    showToast('Google Sign-In is disabled. Please use email/password.', 'warning');
  };

  if (googleLoginBtn) googleLoginBtn.addEventListener('click', googleAuthMock);
  if (googleSignupBtn) googleSignupBtn.addEventListener('click', googleAuthMock);
});
