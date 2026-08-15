// js/routine.js

const HABITS = [
  { id: 'workout', label: 'Morning Workout', desc: '30 mins of exercise', icon: 'fa-dumbbell' },
  { id: 'steps', label: '8,000 Steps', desc: 'Stay active throughout the day', icon: 'fa-shoe-prints' },
  { id: 'stretch', label: 'Stretching', desc: '10 mins of mobility work', icon: 'fa-child-reaching' },
  { id: 'sleep', label: 'Sleep 7+ Hours', desc: 'Rest and recovery', icon: 'fa-moon' }
];

let todayRoutine = {
  workout: false, steps: false, stretch: false, sleep: false, notes: ''
};
const todayStr = new Date().toISOString().split('T')[0];

document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) loadRoutine();
  else renderRoutine();
  
  document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
});

function renderRoutine() {
  const container = document.getElementById('routineList');
  let html = '';
  
  HABITS.forEach(habit => {
    const isDone = todayRoutine[habit.id] === true;
    html += `
      <div class="routine-item ${isDone ? 'done' : ''}" onclick="toggleHabit('${habit.id}')">
        <div class="routine-info">
          <div class="routine-icon"><i class="fas ${habit.icon}"></i></div>
          <div>
            <div class="routine-name">${habit.label}</div>
            <div class="routine-desc">${habit.desc}</div>
          </div>
        </div>
        <div class="routine-check"><i class="fas ${isDone ? 'fa-check-circle' : 'fa-circle-notch'}"></i></div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function loadRoutine() {
  if (!currentUser) return;
  
  const routines = LocalDB.getDict('routines', currentUser);
  if (routines[todayStr]) {
    todayRoutine = routines[todayStr];
    document.getElementById('routineNotes').value = todayRoutine.notes || '';
  } else {
    todayRoutine = { workout: false, steps: false, stretch: false, sleep: false, notes: '' };
  }
  renderRoutine();
}

function toggleHabit(habitId) {
  if (!currentUser) return showToast('Please log in to save habits', 'warning');
  
  todayRoutine[habitId] = !todayRoutine[habitId];
  renderRoutine();
  
  const routines = LocalDB.getDict('routines', currentUser);
  routines[todayStr] = todayRoutine;
  LocalDB.saveDict('routines', currentUser, routines);
  
  if (todayRoutine[habitId]) showToast(`${habitId} completed!`, 'success');
}

function saveNotes() {
  if (!currentUser) return showToast('Please log in to save notes', 'warning');
  
  const notes = document.getElementById('routineNotes').value;
  todayRoutine.notes = notes;
  
  const routines = LocalDB.getDict('routines', currentUser);
  routines[todayStr] = todayRoutine;
  LocalDB.saveDict('routines', currentUser, routines);
  
  showToast('Notes saved successfully', 'success');
}
