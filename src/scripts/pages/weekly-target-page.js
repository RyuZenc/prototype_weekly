import { getStudySchedule, toggleDayCompletion, getDailyCheckIns, addDailyCheckIn } from '../utils/storage';

const WeeklyTargetPage = {
  async render() {
    return `
      <div class="home-page">
        <section class="hero-section">
          <h1>Learning Weekly Target</h1>
          <p class="subtitle">Dicoding Indonesia</p>
        </section>

        <div class="dashboard-grid">
          <!-- Progress Belajar -->
          <div class="progress-card">
            <h2>📊 Progress Belajar</h2>
            
            <div class="weekly-streak">
              <div class="streak-icon">🔥</div>
              <div class="streak-info">
                <h3 id="streak-days">0</h3>
                <p>Hari Beruntun</p>
              </div>
            </div>

            <div class="schedule-list" id="schedule-list">
              <!-- Schedule items will be inserted here -->
            </div>

            <div class="progress-summary">
              <p>Progress Mingguan</p>
              <div class="progress-bar-container">
                <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
              </div>
              <div class="progress-stats">
                <span id="completed-days">0/7 hari selesai</span>
                <span id="progress-percentage">0%</span>
              </div>
            </div>
          </div>

          <!-- Jadwal Belajar -->
          <div class="schedule-card">
            <h2>📅 Jadwal Belajar</h2>
            
            <div class="calendar-view">
              <div class="calendar-header">
                <h3 id="current-month">June 2025</h3>
                <div class="calendar-nav">
                  <button id="prev-month">‹</button>
                  <button id="next-month">›</button>
                </div>
              </div>

              <div class="calendar-weekdays">
                <div class="weekday">Sun</div>
                <div class="weekday">Mon</div>
                <div class="weekday">Tue</div>
                <div class="weekday">Wed</div>
                <div class="weekday">Thu</div>
                <div class="weekday">Fri</div>
                <div class="weekday">Sat</div>
              </div>

              <div class="calendar-days" id="calendar-days">
                <!-- Calendar days will be inserted here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Initialize schedule
    this._initializeSchedule();
    
    // Initialize calendar
    this._currentDate = new Date();
    this._renderCalendar();
    
    // Event listeners for calendar navigation
    document.getElementById('prev-month')?.addEventListener('click', () => {
      this._currentDate.setMonth(this._currentDate.getMonth() - 1);
      this._renderCalendar();
    });
    
    document.getElementById('next-month')?.addEventListener('click', () => {
      this._currentDate.setMonth(this._currentDate.getMonth() + 1);
      this._renderCalendar();
    });

    // Update progress
    this._updateProgress();
  },

  _initializeSchedule() {
    const schedule = getStudySchedule();
    const scheduleList = document.getElementById('schedule-list');
    
    if (!scheduleList) return;

    const dayIcons = {
      'Monday': '📘',
      'Tuesday': '🌿',
      'Wednesday': '⛰️',
      'Thursday': '🏳️',
      'Friday': '🌙',
      'Saturday': '⭐',
      'Sunday': '☀️'
    };

    scheduleList.innerHTML = schedule.map(day => `
      <div class="schedule-item ${day.completed ? 'completed' : ''}">
        <div class="schedule-day">
          <div class="day-icon">${dayIcons[day.name]}</div>
          <div class="day-info">
            <h4>${day.name}</h4>
          </div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" ${day.completed ? 'checked' : ''} data-day="${day.name}">
          <span class="slider"></span>
        </label>
      </div>
    `).join('');

    // Add event listeners to toggles
    scheduleList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const dayName = e.target.dataset.day;
        toggleDayCompletion(dayName);
        this._initializeSchedule(); // Re-render
        this._updateProgress();
      });
    });
  },

  _updateProgress() {
    const schedule = getStudySchedule();
    const completedDays = schedule.filter(day => day.completed).length;
    const totalDays = schedule.length;
    const percentage = Math.round((completedDays / totalDays) * 100);

    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }

    // Update stats
    const completedDaysEl = document.getElementById('completed-days');
    if (completedDaysEl) {
      completedDaysEl.textContent = `${completedDays}/${totalDays} hari selesai`;
    }

    const progressPercentageEl = document.getElementById('progress-percentage');
    if (progressPercentageEl) {
      progressPercentageEl.textContent = `${percentage}%`;
    }

    // Update streak
    const streakDaysEl = document.getElementById('streak-days');
    if (streakDaysEl) {
      streakDaysEl.textContent = completedDays;
    }
  },

  _renderCalendar() {
    const year = this._currentDate.getFullYear();
    const month = this._currentDate.getMonth();
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthEl = document.getElementById('current-month');
    if (currentMonthEl) {
      currentMonthEl.textContent = `${monthNames[month]} ${year}`;
    }

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;

    let daysHTML = '';
    const checkIns = getDailyCheckIns();

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      daysHTML += `
        <div class="calendar-day other-month">
          <span class="day-number">${daysInPrevMonth - i}</span>
        </div>
      `;
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasCheckIn = checkIns.includes(dateStr);
      
      daysHTML += `
        <div class="calendar-day ${hasCheckIn ? 'has-checkin' : ''}" data-date="${dateStr}">
          <span class="day-number">${day}</span>
          ${hasCheckIn ? '<span class="day-status">✓ Check-in</span>' : ''}
        </div>
      `;
    }

    // Next month days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (firstDay + daysInMonth);
    for (let i = 1; i <= nextMonthDays; i++) {
      daysHTML += `
        <div class="calendar-day other-month">
          <span class="day-number">${i}</span>
        </div>
      `;
    }

    calendarDays.innerHTML = daysHTML;

    // Add click listeners to calendar days
    calendarDays.querySelectorAll('.calendar-day:not(.other-month)').forEach(dayEl => {
      dayEl.addEventListener('click', (e) => {
        const dateStr = dayEl.dataset.date;
        if (dateStr) {
          addDailyCheckIn(dateStr);
          this._renderCalendar();
          alert(`✅ Check-in berhasil untuk ${dateStr}!`);
        }
      });
    });
  }
};

export default WeeklyTargetPage;
