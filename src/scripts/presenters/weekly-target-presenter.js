// Services
import { StreakService, ScheduleService, CheckInService, CalendarService } from '../services/index.js';
// Helpers
import { DOMHelper, DateHelper, AlertHelper } from '../helpers/index.js';
// Constants
import { DAYS_OF_WEEK, DAY_NAMES_ID } from '../constants/index.js';
// Legacy storage (to be refactored)
import { getStudySchedule, toggleDayCompletion } from '../utils/storage.js';

// Presenter for Weekly Target page
// Handles business logic and coordinates between services and view
class WeeklyTargetPresenter {
  constructor(view) {
    this._view = view;
    // Initialize with today's date, but set to first of the month for consistency
    const today = new Date();
    this._currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this._selectedDate = null;
  }

  async init() {
    this._initializeSchedule();
    this._renderCalendar(); // This will call _attachEventListeners()
    this._updateProgress();
    this._updateActivityStats();
    this._updateStreakStats();
    this._updateSelectedDaysDisplay();
    this._attachModalEventListeners(); // Modal listeners don't need re-attachment
  }

  _initializeSchedule() {
    const schedule = getStudySchedule();
    this._view.displaySchedule(schedule);
  }

  _updateProgress() {
    const stats = this.getProgressStats();
    this._view.displayProgress(stats);
  }

  _updateActivityStats() {
    // Update activity statistics
    const studyTime = DOMHelper.query('#study-time');
    const courseCount = DOMHelper.query('#course-count');
    const assessmentCount = DOMHelper.query('#assessment-count');

    if (studyTime) studyTime.textContent = '120'; // Example data
    if (courseCount) courseCount.textContent = '3';
    if (assessmentCount) assessmentCount.textContent = '5';
  }

  _updateStreakStats() {
    // Update streak statistics using StreakService
    const bestStreakEl = DOMHelper.query('#best-streak');
    const currentStreakEl = DOMHelper.query('#current-streak');

    const { current, best } = StreakService.getStreakStats();
    
    if (bestStreakEl) bestStreakEl.textContent = best;
    if (currentStreakEl) currentStreakEl.textContent = current;
  }

  _renderCalendar() {
    const calendarData = this._getCalendarData();
    this._view.displayCalendar(calendarData);
    // Re-attach event listeners after DOM update
    this._attachEventListeners();
  }

  _attachEventListeners() {
    // Remove existing listeners to prevent duplicates
    this._removeEventListeners();

    // Calendar navigation
    const prevBtn = DOMHelper.query('#prev-month');
    const nextBtn = DOMHelper.query('#next-month');
    const todayBtn = DOMHelper.query('#today-btn');

    if (prevBtn) {
      this._prevMonthHandler = () => this._handlePrevMonth();
      DOMHelper.on(prevBtn, 'click', this._prevMonthHandler);
    }

    if (nextBtn) {
      this._nextMonthHandler = () => this._handleNextMonth();
      DOMHelper.on(nextBtn, 'click', this._nextMonthHandler);
    }

    if (todayBtn) {
      this._todayHandler = () => this._handleToday();
      DOMHelper.on(todayBtn, 'click', this._todayHandler);
    }

    // Schedule toggles
    const scheduleList = DOMHelper.query('#schedule-list');
    if (scheduleList) {
      this._scheduleChangeHandler = (e) => {
        if (e.target.type === 'checkbox') {
          this._handleDayToggle(e.target.dataset.day);
        }
      };
      DOMHelper.on(scheduleList, 'change', this._scheduleChangeHandler);
    }

    // Calendar day clicks - use event delegation for check-in buttons
    const calendarDays = DOMHelper.query('#calendar-days');
    if (calendarDays) {
      this._calendarClickHandler = (e) => {
        // Check if a check-in button was clicked
        const btn = e.target.closest('.checkin-btn');
        if (btn && !btn.disabled && btn.dataset.date) {
          e.stopPropagation();
          this._handleDayClick(btn.dataset.date);
        }
      };
      DOMHelper.on(calendarDays, 'click', this._calendarClickHandler);
    }
  }

  _attachModalEventListeners() {
    // Modal controls - only attach once
    // Wait a bit to ensure DOM is ready
    setTimeout(() => {
      const modal = DOMHelper.query('#checkin-modal');
      const modalClose = DOMHelper.query('#modal-close');
      const checkinForm = DOMHelper.query('#checkin-form');

      if (modalClose) {
        this._modalCloseHandler = () => this._closeModal();
        DOMHelper.on(modalClose, 'click', this._modalCloseHandler);
      }

      if (modal) {
        this._modalOverlayHandler = (e) => {
          if (e.target === modal) {
            this._closeModal();
          }
        };
        DOMHelper.on(modal, 'click', this._modalOverlayHandler);
      }

      if (checkinForm) {
        this._formSubmitHandler = (e) => {
          e.preventDefault();
          this._handleCheckInSubmit(e);
        };
        DOMHelper.on(checkinForm, 'submit', this._formSubmitHandler);
      }

      // Schedule modal listeners
      const scheduleModal = DOMHelper.query('#schedule-modal');
      const scheduleModalClose = DOMHelper.query('#schedule-modal-close');
      const editScheduleBtn = DOMHelper.query('#edit-schedule-btn');

      if (editScheduleBtn) {
        this._editScheduleHandler = () => this._openScheduleModal();
        DOMHelper.on(editScheduleBtn, 'click', this._editScheduleHandler);
      }

      if (scheduleModalClose) {
        this._scheduleModalCloseHandler = () => this._closeScheduleModal();
        DOMHelper.on(scheduleModalClose, 'click', this._scheduleModalCloseHandler);
      }

      if (scheduleModal) {
        this._scheduleModalOverlayHandler = (e) => {
          if (e.target === scheduleModal) {
            this._closeScheduleModal();
          }
        };
        DOMHelper.on(scheduleModal, 'click', this._scheduleModalOverlayHandler);
        
        // Auto-save when toggle changes
        this._scheduleToggleHandler = (e) => {
          if (e.target.matches('input[data-day]')) {
            this._handleScheduleSave();
          }
        };
        DOMHelper.on(scheduleModal, 'change', this._scheduleToggleHandler);
      }
    }, 100);
  }

  _removeEventListeners() {
    const prevBtn = DOMHelper.query('#prev-month');
    const nextBtn = DOMHelper.query('#next-month');
    const todayBtn = DOMHelper.query('#today-btn');
    const scheduleList = DOMHelper.query('#schedule-list');
    const calendarDays = DOMHelper.query('#calendar-days');

    if (prevBtn && this._prevMonthHandler) {
      DOMHelper.off(prevBtn, 'click', this._prevMonthHandler);
    }
    if (nextBtn && this._nextMonthHandler) {
      DOMHelper.off(nextBtn, 'click', this._nextMonthHandler);
    }
    if (todayBtn && this._todayHandler) {
      DOMHelper.off(todayBtn, 'click', this._todayHandler);
    }
    if (scheduleList && this._scheduleChangeHandler) {
      DOMHelper.off(scheduleList, 'change', this._scheduleChangeHandler);
    }
    if (calendarDays && this._calendarClickHandler) {
      DOMHelper.off(calendarDays, 'click', this._calendarClickHandler);
    }
  }

  _handlePrevMonth() {
    const { year, month } = CalendarService.getPreviousMonth(
      this._currentDate.getFullYear(),
      this._currentDate.getMonth()
    );
    this._currentDate = new Date(year, month, 1);
    this._renderCalendar();
    this._attachEventListeners();
  }

  _handleNextMonth() {
    const { year, month } = CalendarService.getNextMonth(
      this._currentDate.getFullYear(),
      this._currentDate.getMonth()
    );
    this._currentDate = new Date(year, month, 1);
    this._renderCalendar();
    this._attachEventListeners();
  }

  _handleToday() {
    const today = new Date();
    this._currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this._renderCalendar();
    this._attachEventListeners();
  }

  _handleDayToggle(dayName) {
    toggleDayCompletion(dayName);
    this._initializeSchedule();
    this._updateProgress();
    this._attachEventListeners();
  }

  _handleDayClick(dateStr) {
    if (dateStr) {
      this._selectedDate = dateStr;
      const existingCheckIn = CheckInService.getCheckInDetails(dateStr);
      
      if (existingCheckIn) {
        // Show existing check-in in read-only mode
        this._showCheckInModal(dateStr, existingCheckIn);
      } else {
        // Show empty form for new check-in
        this._showCheckInModal(dateStr, null);
      }
    }
  }

  _showCheckInModal(dateStr, existingData) {
    const modal = DOMHelper.query('#checkin-modal');
    const modalTitle = DOMHelper.query('#modal-title');
    const form = DOMHelper.query('#checkin-form');
    const statusDiv = DOMHelper.query('#checkin-status');
    
    if (!modal || !form || !modalTitle || !statusDiv) {
      console.error('Modal elements not found!', {modal, modalTitle, form, statusDiv});
      return;
    }

    // Format date for display
    const date = DateHelper.fromDateString(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    
    if (existingData) {
      modalTitle.textContent = `View Check-in @ ${formattedDate}`;
    } else {
      modalTitle.textContent = `Daily Check-in @ ${formattedDate}`;
    }

    if (existingData) {
      // Fill form with existing data and make it read-only
      const moodInput = form.querySelector(`input[name="mood"][value="${existingData.mood}"]`);
      const progressTextarea = form.querySelector('textarea[name="progress"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      
      if (moodInput) moodInput.checked = true;
      if (progressTextarea) {
        progressTextarea.value = existingData.progress;
        progressTextarea.readOnly = true;
      }
      
      form.querySelectorAll('input[name="mood"]').forEach(input => {
        input.disabled = true;
      });
      
      statusDiv.innerHTML = '<span class="badge badge-success">Submitted</span>';
      
      if (submitBtn) {
        submitBtn.textContent = 'OK';
        submitBtn.type = 'button';
        submitBtn.onclick = () => this._closeModal();
      }
    } else {
      // Reset form for new entry
      form.reset();
      const progressTextarea = form.querySelector('textarea[name="progress"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      
      if (progressTextarea) progressTextarea.readOnly = false;
      
      form.querySelectorAll('input[name="mood"]').forEach(input => {
        input.disabled = false;
      });
      
      statusDiv.innerHTML = '';
      
      if (submitBtn) {
        submitBtn.textContent = 'Submit Check-in';
        submitBtn.type = 'submit';
        submitBtn.onclick = null;
      }
    }

    modal.classList.add('active');
  }

  _closeModal() {
    const modal = DOMHelper.query('#checkin-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  _openScheduleModal() {
    const modal = DOMHelper.query('#schedule-modal');
    if (modal) {
      // Load current schedule state using ScheduleService
      const schedule = ScheduleService.getWeeklySchedule();
      
      DAYS_OF_WEEK.forEach(day => {
        const checkbox = document.querySelector(`input[data-day="${day}"]`);
        if (checkbox) {
          checkbox.checked = ScheduleService.isDaySelected(day);
        }
      });
      
      modal.classList.add('active');
    }
  }

  _closeScheduleModal() {
    const modal = DOMHelper.query('#schedule-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  _handleScheduleSave() {
    const selectedDays = {};
    
    DAYS_OF_WEEK.forEach(day => {
      const checkbox = document.querySelector(`input[data-day="${day}"]`);
      if (checkbox) {
        selectedDays[day.toLowerCase()] = checkbox.checked;
      }
    });
    
    // Save using ScheduleService
    ScheduleService.saveWeeklySchedule(selectedDays);
    
    // Update UI (don't close modal - auto-save)
    this._updateSelectedDaysDisplay();
  }

  _updateSelectedDaysDisplay() {
    const selectedDaysIndonesian = ScheduleService.getSelectedDaysIndonesian();
    const selectedDaysContainer = document.querySelector('.selected-days');
    
    if (selectedDaysContainer) {
      if (selectedDaysIndonesian.length === 0) {
        selectedDaysContainer.innerHTML = '<span style="color: #999; font-size: 0.85rem;">Belum ada hari dipilih</span>';
      } else {
        selectedDaysContainer.innerHTML = selectedDaysIndonesian
          .map(day => `<span class="day-tag">${day}</span>`)
          .join('');
      }
    }
  }

  _handleCheckInSubmit(e) {
    const form = e.target;
    const formData = new FormData(form);
    const mood = formData.get('mood');
    const progress = formData.get('progress');

    if (!mood || !progress) {
      AlertHelper.showError('Mohon isi semua field');
      return;
    }

    // Save check-in using CheckInService
    CheckInService.saveCheckIn(this._selectedDate, { completed: true });
    CheckInService.saveCheckInDetails(this._selectedDate, { mood, progress });

    // Tampilkan alert sukses
    AlertHelper.showSuccess('Anda berhasil check-in!');

    // Update UI including streak stats
    this._renderCalendar();
    this._updateProgress();
    this._updateStreakStats();
    this._closeModal();
    this._attachEventListeners();
  }

  _getCalendarData() {
    const year = this._currentDate.getFullYear();
    const month = this._currentDate.getMonth();
    
    const calendarData = CalendarService.getCalendarData(year, month);
    const { daysInMonth, startDayOfWeek: firstDay } = calendarData;
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const checkInDates = CheckInService.getCheckInDates();
    const today = DateHelper.startOfDay(new Date());

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        number: daysInPrevMonth - i,
        isOtherMonth: true,
        hasCheckIn: false,
        dateStr: null,
        isPast: false,
        isFuture: false,
        isToday: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateStr = CalendarService.formatDateString(currentDate);
      const hasCheckIn = checkInDates.includes(dateStr);
      
      const isToday = DateHelper.isToday(currentDate);
      const isPast = DateHelper.startOfDay(currentDate) < today;
      const isFuture = DateHelper.startOfDay(currentDate) > today;
      
      days.push({
        number: day,
        isOtherMonth: false,
        hasCheckIn,
        dateStr,
        isPast,
        isFuture,
        isToday
      });
    }

    // Next month days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (firstDay + daysInMonth);
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        number: i,
        isOtherMonth: true,
        hasCheckIn: false,
        dateStr: null,
        isPast: false,
        isFuture: false,
        isToday: false
      });
    }

    return {
      monthName: CalendarService.getMonthNameIndonesian(month),
      year,
      days
    };
  }

  getProgressStats() {
    const schedule = getStudySchedule();
    const completedDays = schedule.filter(day => day.completed).length;
    const totalDays = schedule.length;
    const percentage = Math.round((completedDays / totalDays) * 100);

    return {
      completedDays,
      totalDays,
      percentage,
      streak: completedDays
    };
  }

  getScheduleData() {
    return getStudySchedule();
  }
}

export default WeeklyTargetPresenter;
