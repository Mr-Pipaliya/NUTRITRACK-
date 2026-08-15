// js/dashboard.js

let dailyCalGoal = 2000;
let todayLogs = [];
let todayWater = 0;
const todayStr = new Date().toISOString().split('T')[0];

document.addEventListener('DOMContentLoaded', () => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  document.getElementById('dateDisplay').textContent = new Date().toLocaleDateString('en-US', options);
  
  renderWaterGrid();
  
  if (currentUser) {
    loadUserData();
  }
  
  document.getElementById('quickAddForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser) return showToast('Please log in first', 'error');
    
    const name = document.getElementById('qaName').value;
    const cal = parseInt(document.getElementById('qaCal').value);
    
    let logs = LocalDB.getData('foodLogs', currentUser);
    logs.push({
      id: generateId(),
      name: name,
      calories: cal,
      date: todayStr,
      timestamp: new Date().toISOString()
    });
    LocalDB.saveData('foodLogs', currentUser, logs);
    
    showToast('Food logged!', 'success');
    document.getElementById('qaName').value = '';
    document.getElementById('qaCal').value = '';
    closeModal('quickAddModal');
    
    loadUserData(); // Refresh
  });
});

function loadUserData() {
  if (!currentUser) return;
  
  // 1. Profile Data
  const users = LocalDB.getUsers();
  const userData = users[currentUser] || {};
  document.getElementById('greetingMsg').textContent = `Good Morning, ${(userData.name || 'User').split(' ')[0]} 👋`;
  dailyCalGoal = userData.daily_cal_goal || 2000;
  document.getElementById('calGoal').textContent = dailyCalGoal;
  
  // 2. Water Data
  const waterData = LocalDB.getDict('waterLogs', currentUser);
  todayWater = waterData[todayStr] || 0;
  document.getElementById('waterCount').textContent = todayWater;
  renderWaterGrid();
  
  // 3. Food Logs
  const logs = LocalDB.getData('foodLogs', currentUser);
  todayLogs = logs.filter(l => l.date === todayStr).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  updateDashboard();
  
  // 4. Streak
  const streakBadge = document.getElementById('streakBadge');
  streakBadge.style.display = 'inline-flex';
  document.getElementById('streakCount').textContent = '1';
  
  // 5. Weekly Chart Data
  loadWeeklyChart(logs);
}

function updateDashboard() {
  const totalCal = todayLogs.reduce((sum, log) => sum + log.calories, 0);
  const remaining = Math.max(0, dailyCalGoal - totalCal);
  let pct = Math.round((totalCal / dailyCalGoal) * 100) || 0;
  
  document.getElementById('calConsumed').textContent = totalCal;
  document.getElementById('calRemaining').textContent = remaining;
  document.getElementById('calPct').textContent = `${pct}%`;
  
  const ring = document.getElementById('calorieRing');
  const maxPct = Math.min(pct, 100);
  const offset = 502 - (maxPct / 100) * 502;
  ring.style.strokeDashoffset = offset;
  
  if (pct > 100) {
    document.getElementById('calPct').style.color = 'var(--danger)';
    document.getElementById('calPct').classList.remove('text-gradient');
  } else {
    document.getElementById('calPct').classList.add('text-gradient');
    document.getElementById('calPct').style.color = '';
  }
  
  const pro = Math.round((totalCal * 0.25) / 4);
  const carbs = Math.round((totalCal * 0.50) / 4);
  const fat = Math.round((totalCal * 0.25) / 9);
  
  document.getElementById('proVal').textContent = pro;
  document.getElementById('carbsVal').textContent = carbs;
  document.getElementById('fatVal').textContent = fat;
  
  document.getElementById('proBar').style.width = `${Math.min((pro/150)*100, 100)}%`;
  document.getElementById('carbsBar').style.width = `${Math.min((carbs/250)*100, 100)}%`;
  document.getElementById('fatBar').style.width = `${Math.min((fat/65)*100, 100)}%`;
  
  const list = document.getElementById('foodLogList');
  document.getElementById('logCount').textContent = `${todayLogs.length} ITEMS`;
  
  if (todayLogs.length === 0) {
    list.innerHTML = `<p style="text-align: center; color: var(--text3); font-size: 13px; padding: 20px 0;">No foods logged yet. Tap + to add.</p>`;
  } else {
    list.innerHTML = todayLogs.map(log => {
      const time = new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      return `
        <div class="log-item">
          <div>
            <div class="log-name">${log.name}</div>
            <div class="log-time">${time}</div>
          </div>
          <div style="display: flex; align-items: center;">
            <div class="log-cal">+${log.calories} kcal</div>
            <div class="log-del" onclick="deleteLog('${log.id}')"><i class="fas fa-trash"></i></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function deleteLog(id) {
  if (!confirm("Remove this food log?")) return;
  let logs = LocalDB.getData('foodLogs', currentUser);
  logs = logs.filter(l => l.id !== id);
  LocalDB.saveData('foodLogs', currentUser, logs);
  showToast('Log removed', 'info');
  loadUserData();
}

function renderWaterGrid() {
  const grid = document.getElementById('waterGrid');
  let html = '';
  for(let i=1; i<=8; i++) {
    const isFilled = i <= todayWater;
    html += `<div class="water-drop ${isFilled ? 'filled' : ''}" onclick="addWater(${i})"><i class="fas fa-tint"></i></div>`;
  }
  grid.innerHTML = html;
}

function addWater(num) {
  if (!currentUser) return;
  if (num === todayWater) num = num - 1;
  todayWater = num;
  
  const waterData = LocalDB.getDict('waterLogs', currentUser);
  waterData[todayStr] = num;
  LocalDB.saveDict('waterLogs', currentUser, waterData);
  
  document.getElementById('waterCount').textContent = todayWater;
  renderWaterGrid();
  
  if (num === 8) showToast('Daily water goal reached! 💧', 'success');
}

function loadWeeklyChart(allLogs) {
  const dailyMap = {};
  for(let i=6; i>=0; i--) {
    const d2 = new Date();
    d2.setDate(d2.getDate() - i);
    dailyMap[d2.toISOString().split('T')[0]] = 0;
  }
  
  allLogs.forEach(log => {
    if(dailyMap[log.date] !== undefined) {
      dailyMap[log.date] += log.calories;
    }
  });
  
  const labels = Object.keys(dailyMap).map(d => new Date(d).toLocaleDateString('en-US', {weekday: 'short'}));
  const data = Object.values(dailyMap);
  
  initChart(labels, data);
}

let chartInstance = null;
function initChart(labels, data) {
  const ctx = document.getElementById('weeklyChart').getContext('2d');
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#CBD5E1' : '#64748B';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  
  if (chartInstance) chartInstance.destroy();
  
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Calories',
        data: data,
        backgroundColor: '#00F5A0',
        borderRadius: 4,
        barThickness: 'flex',
        maxBarThickness: 32
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } },
        x: { grid: { display: false }, ticks: { color: textColor, font: { size: 11, weight: 'bold' } } }
      }
    }
  });
}
