// Storage utility for managing study schedule and daily check-ins

const STORAGE_KEYS = {
  STUDY_SCHEDULE: 'study_schedule',
  DAILY_CHECKINS: 'daily_checkins',
};

// Default study schedule
const DEFAULT_SCHEDULE = [
  { name: 'Monday', completed: false },
  { name: 'Tuesday', completed: false },
  { name: 'Wednesday', completed: false },
  { name: 'Thursday', completed: false },
  { name: 'Friday', completed: false },
  { name: 'Saturday', completed: false },
  { name: 'Sunday', completed: false },
];

/**
 * Get study schedule from localStorage
 * @returns {Array} Study schedule array
 */
export function getStudySchedule() {
  const stored = localStorage.getItem(STORAGE_KEYS.STUDY_SCHEDULE);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing study schedule:', e);
      return [...DEFAULT_SCHEDULE];
    }
  }
  return [...DEFAULT_SCHEDULE];
}

/**
 * Save study schedule to localStorage
 * @param {Array} schedule - Study schedule array
 */
export function saveStudySchedule(schedule) {
  localStorage.setItem(STORAGE_KEYS.STUDY_SCHEDULE, JSON.stringify(schedule));
}

/**
 * Toggle day completion status
 * @param {string} dayName - Name of the day
 */
export function toggleDayCompletion(dayName) {
  const schedule = getStudySchedule();
  const dayIndex = schedule.findIndex(day => day.name === dayName);
  
  if (dayIndex !== -1) {
    schedule[dayIndex].completed = !schedule[dayIndex].completed;
    saveStudySchedule(schedule);
  }
}

/**
 * Reset all day completions
 */
export function resetWeeklyProgress() {
  const schedule = getStudySchedule();
  schedule.forEach(day => {
    day.completed = false;
  });
  saveStudySchedule(schedule);
}

/**
 * Get daily check-ins from localStorage
 * @returns {Array} Array of check-in dates (YYYY-MM-DD format)
 */
export function getDailyCheckIns() {
  const stored = localStorage.getItem(STORAGE_KEYS.DAILY_CHECKINS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing daily check-ins:', e);
      return [];
    }
  }
  return [];
}

/**
 * Save daily check-ins to localStorage
 * @param {Array} checkIns - Array of check-in dates
 */
export function saveDailyCheckIns(checkIns) {
  localStorage.setItem(STORAGE_KEYS.DAILY_CHECKINS, JSON.stringify(checkIns));
}

/**
 * Add a daily check-in
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 */
export function addDailyCheckIn(dateStr) {
  const checkIns = getDailyCheckIns();
  
  if (!checkIns.includes(dateStr)) {
    checkIns.push(dateStr);
    saveDailyCheckIns(checkIns);
  }
}

/**
 * Remove a daily check-in
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 */
export function removeDailyCheckIn(dateStr) {
  let checkIns = getDailyCheckIns();
  checkIns = checkIns.filter(date => date !== dateStr);
  saveDailyCheckIns(checkIns);
}

/**
 * Check if a date has a check-in
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {boolean}
 */
export function hasCheckIn(dateStr) {
  const checkIns = getDailyCheckIns();
  return checkIns.includes(dateStr);
}

/**
 * Get check-ins for a specific month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {Array} Array of check-in dates in the month
 */
export function getMonthCheckIns(year, month) {
  const checkIns = getDailyCheckIns();
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  
  return checkIns.filter(date => date.startsWith(monthStr));
}

/**
 * Get current streak of consecutive check-ins
 * @returns {number} Number of consecutive days
 */
export function getCurrentStreak() {
  const checkIns = getDailyCheckIns();
  if (checkIns.length === 0) return 0;

  // Sort dates in descending order
  const sortedDates = checkIns
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => b - a);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentDate = new Date(today);

  for (let i = 0; i < sortedDates.length; i++) {
    const checkInDate = new Date(sortedDates[i]);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (checkInDate.getTime() < currentDate.getTime()) {
      break;
    }
  }

  return streak;
}

/**
 * Get total number of check-ins
 * @returns {number}
 */
export function getTotalCheckIns() {
  return getDailyCheckIns().length;
}

/**
 * Clear all data
 */
export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.STUDY_SCHEDULE);
  localStorage.removeItem(STORAGE_KEYS.DAILY_CHECKINS);
}
