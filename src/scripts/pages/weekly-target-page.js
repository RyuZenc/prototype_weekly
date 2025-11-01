import WeeklyTargetPresenter from '../presenters/weekly-target-presenter';
import { DAYS_OF_WEEK, DAY_ICONS } from '../constants/index.js';

const WeeklyTargetPage = {
  _presenter: null,

  async render() {
    return `
      <div class="home-page">
        <section class="hero-section">
          <h1>Learning Weekly Target</h1>
        </section>

        <div class="dashboard-container">
          <!-- Stats Cards Section -->
          <div class="stats-cards-section">
            <!-- Aktivitas Belajar Card -->
            <div class="activity-card">
              <h3><i class="fa fa-book"></i> Aktivitas Belajar</h3>
              <div class="activity-stats">
                <div class="stat-item">
                  <div class="stat-icon"><i class="fa fa-clock-o"></i></div>
                  <div class="stat-content">
                    <h4 id="study-time">0</h4>
                    <p>Menit Belajar</p>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon"><i class="fa fa-graduation-cap"></i></div>
                  <div class="stat-content">
                    <h4 id="course-count">0</h4>
                    <p>Course</p>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon"><i class="fa fa-check-circle"></i></div>
                  <div class="stat-content">
                    <h4 id="assessment-count">0</h4>
                    <p>Assessment</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Streak Card -->
            <div class="streak-card">
              <h3><i class="fa fa-fire"></i> Streak</h3>
              <div class="streak-stats">
                <div class="best-streak">
                  <div class="streak-icon-large">🏆</div>
                  <div class="streak-content">
                    <h4 id="best-streak">0</h4>
                    <p>Best Streak</p>
                  </div>
                </div>
                <div class="daily-streak">
                  <div class="streak-icon-large">🔥</div>
                  <div class="streak-content">
                    <h4 id="current-streak">0</h4>
                    <p>Daily Streak</p>
                  </div>
                </div>
              </div>
              <div class="schedule-settings">
                <div class="schedule-settings-header">
                  <h4>Atur Jadwal Belajar</h4>
                  <button class="btn-edit-schedule" id="edit-schedule-btn">
                    <i class="fa fa-pencil"></i> Edit
                  </button>
                </div>
                <div class="schedule-type">
                  <span class="badge badge-primary">Weekly</span>
                </div>
                <div class="selected-days" id="selected-days">
                  <span class="day-tag">Mon</span>
                  <span class="day-tag">Tue</span>
                  <span class="day-tag">Wed</span>
                  <span class="day-tag">Thu</span>
                  <span class="day-tag">Fri</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Kalender Check-In -->
          <div class="schedule-card">
            <h2><i class="fa fa-calendar"></i> Daily Check-In</h2>

            <div class="calendar-view">
              <div class="calendar-header">
                <h3 id="current-month">June 2025</h3>
                <div class="calendar-nav">
                  <button id="today-btn" class="btn-today">Today</button>
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

      <!-- Check-in Modal -->
      <div class="modal-overlay" id="checkin-modal">
        <div class="modal-box">
          <button class="modal-close" id="modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
          <form id="checkin-form">
            <div class="modal-header">
              <h2 id="modal-title">Daily Check-in</h2>
            </div>
            <div class="modal-body">
              <div class="form-control">
                <label>Your mood</label>
                <div class="mood-selector">
                  <label class="mood-option">
                    <input type="radio" name="mood" value="bad" required>
                    <span class="mood-emoji">😞</span>
                    <span class="mood-label">Bad</span>
                  </label>
                  <label class="mood-option">
                    <input type="radio" name="mood" value="neutral" required>
                    <span class="mood-emoji">😐</span>
                    <span class="mood-label">Neutral</span>
                  </label>
                  <label class="mood-option">
                    <input type="radio" name="mood" value="great" required>
                    <span class="mood-emoji">😍</span>
                    <span class="mood-label">Great</span>
                  </label>
                </div>
              </div>
              <div class="form-control">
                <label>Your progress</label>
                <textarea 
                  class="progress-textarea" 
                  name="progress" 
                  placeholder="Accomplishments:&#10;...&#10;&#10;Challenges:&#10;...&#10;&#10;Next Steps:&#10;..."
                  required
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <div id="checkin-status"></div>
              <button type="submit" class="btn-primary">Submit Check-in</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Schedule Settings Modal -->
      <div class="modal-overlay" id="schedule-modal">
        <div class="modal-box schedule-modal-box">
          <button class="modal-close" id="schedule-modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
          <div class="modal-header">
            <h2>Atur Jadwal Belajar</h2>
          </div>
          <div class="modal-body">
            <div class="schedule-days-list">
              ${DAYS_OF_WEEK.map(day => `
              <label class="schedule-day-item">
                <div class="schedule-day-info">
                  <span class="day-icon">${DAY_ICONS[day]}</span>
                  <span>${day}</span>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" data-day="${day}">
                  <span class="toggle-slider"></span>
                </label>
              </label>
              `).join('')}
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-primary" id="save-schedule-btn">Simpan Jadwal</button>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Initialize presenter with view methods
    this._presenter = new WeeklyTargetPresenter(this);
    await this._presenter.init();
  },

  // View methods called by presenter
  displaySchedule(schedule) {
    const scheduleList = document.getElementById('schedule-list');
    
    if (!scheduleList) return;

    const dayIcons = {
    };

    scheduleList.innerHTML = schedule.map(day => `
      <div class="schedule-item ${day.completed ? 'completed' : ''}">
        <div class="schedule-day">
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
  },

  displayProgress(stats) {
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = `${stats.percentage}%`;
    }

    // Update stats
    const completedDaysEl = document.getElementById('completed-days');
    if (completedDaysEl) {
      completedDaysEl.textContent = `${stats.completedDays}/${stats.totalDays} hari selesai`;
    }

    const progressPercentageEl = document.getElementById('progress-percentage');
    if (progressPercentageEl) {
      progressPercentageEl.textContent = `${stats.percentage}%`;
    }

    // Update streak
    const streakDaysEl = document.getElementById('streak-days');
    if (streakDaysEl) {
      streakDaysEl.textContent = stats.streak;
    }
  },

  displayCalendar(calendarData) {
    // Update month display
    const currentMonthEl = document.getElementById('current-month');
    if (currentMonthEl) {
      currentMonthEl.textContent = `${calendarData.monthName} ${calendarData.year}`;
    }

    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;

    calendarDays.innerHTML = calendarData.days.map(day => {
      if (day.isOtherMonth) {
        return `
          <div class="calendar-day other-month">
            <span class="day-number">${day.number}</span>
          </div>
        `;
      } else {
        const statusClass = day.hasCheckIn ? 'submitted' : 'not-submitted';
        const statusText = day.hasCheckIn ? 'Submitted' : 'Not submitted';
        
        // Jangan tampilkan tombol check-in untuk hari yang akan datang
        if (day.isFuture) {
          return `
            <div class="calendar-day disabled-day" data-date="${day.dateStr}">
              <span class="day-number">${day.number}</span>
            </div>
          `;
        }
        
        // Disable tombol untuk hari lalu yang belum di-check-in
        const isDisabled = day.isPast && !day.hasCheckIn;
        const buttonDisabled = isDisabled ? 'disabled' : '';
        const buttonText = day.hasCheckIn ? 'View check-in' : 'Daily check-in';
        
        return `
          <div class="calendar-day ${day.isToday ? 'is-today' : ''} ${isDisabled ? 'disabled-day' : ''}" data-date="${day.dateStr}">
            <span class="day-number">${day.number}</span>
            <button class="checkin-btn ${day.hasCheckIn ? 'submitted-btn' : ''}" ${buttonDisabled} data-date="${day.dateStr}">
              ${buttonText}
            </button>
            <span class="checkin-status ${statusClass}">${statusText}</span>
          </div>
        `;
      }
    }).join('');
  }
};

export default WeeklyTargetPage;
