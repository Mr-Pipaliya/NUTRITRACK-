/**
 * NUTRITRACK PERFORMANCE ENGINE
 * High-level state management for athletes
 */

const NutriApp = {
    // 1. DATA STATE
    state: {
        cals: parseInt(localStorage.getItem('nt_cals')) || 0,
        goal: parseInt(localStorage.getItem('nt_goal')) || 2500,
        water: parseInt(localStorage.getItem('nt_water')) || 0,
        streak: parseInt(localStorage.getItem('nt_streak')) || 0,
        logs: JSON.parse(localStorage.getItem('nt_logs')) || [],
        cart: []
    },

    // 2. INITIALIZATION
    init() {
        this.bindEvents();
        this.updateUI();
        this.checkStreak();
        console.log("🦾 Athlete System Online");
    },

    // 3. CORE LOGIC
    addFood(name, cal) {
        const entry = {
            id: Date.now(),
            name: name.toUpperCase(),
            cal: parseInt(cal),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        this.state.cals += entry.cal;
        this.state.logs.unshift(entry);
        
        // Performance optimization: Keep only last 8 logs
        if (this.state.logs.length > 8) this.state.logs.pop();

        this.saveAndRefresh();
        this.triggerFeedback('success');
    },

    addWater() {
        if (this.state.water < 12) {
            this.state.water++;
            this.saveAndRefresh();
            this.triggerFeedback('water');
        }
    },

    // 4. PERSISTENCE LAYER
    saveAndRefresh() {
        localStorage.setItem('nt_cals', this.state.cals);
        localStorage.setItem('nt_water', this.state.water);
        localStorage.setItem('nt_logs', JSON.stringify(this.state.logs));
        this.updateUI();
    },

    // 5. HIGH-LEVEL UI RENDERING
    updateUI() {
        // Update Stats Labels
        document.getElementById('current-cals').innerText = this.state.cals.toLocaleString();
        document.getElementById('water-count').innerText = this.state.water;
        document.getElementById('streak').innerText = this.state.streak;

        // Circular Progress Geometry
        const percent = Math.min((this.state.cals / this.state.goal) * 100, 100);
        const ring = document.getElementById('ring-fill');
        
        if (ring) {
            const circumference = 2 * Math.PI * ring.r.baseVal.value;
            const offset = circumference - (percent / 100 * circumference);
            ring.style.strokeDashoffset = offset;
            document.getElementById('percent-text').innerText = `${Math.round(percent)}%`;
            
            // Visual Warning: Change color to red if over goal
            ring.style.stroke = (this.state.cals > this.state.goal) ? "#ff3e3e" : "#ccff00";
        }

        this.renderLogs();
    },

    renderLogs() {
        const container = document.getElementById('log-list');
        if (!container) return;

        container.innerHTML = this.state.logs.map(log => `
            <div class="log-item animate-in">
                <div class="log-info">
                    <span class="log-name">${log.name}</span>
                    <small class="log-time">${log.time}</small>
                </div>
                <div class="log-value">+${log.cal} KCAL</div>
            </div>
        `).join('');
    },

    // 6. ATHLETE TOOLS
    triggerFeedback(type) {
        // Haptic feedback feel via CSS classes
        document.body.classList.add('action-pulse');
        setTimeout(() => document.body.classList.remove('action-pulse'), 200);
    },

    checkStreak() {
        const lastDate = localStorage.getItem('nt_last_date');
        const today = new Date().toDateString();

        if (lastDate !== today) {
            this.state.streak++;
            localStorage.setItem('nt_last_date', today);
            localStorage.setItem('nt_streak', this.state.streak);
        }
    }
};

// Start the engine
window.onload = () => NutriApp.init();

function resetLog(){
  data.logs = [];
  save();
  update();
}

function resetLog(){
  data.logs = [];   // Clear all log entries
  save();           // Save to localStorage
  update();         // Refresh UI
}
