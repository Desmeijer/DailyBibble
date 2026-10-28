// Step 6A: Core App Logic, Navigation, Progress Tracker & Drawer (Complete & Robust)

// Combine dataset parts into a single 365-day array attached to window
window.ALL_DAYS = [].concat(
  window.PLAN_PART_1 || [],
  window.PLAN_PART_2A || [],
  window.PLAN_PART_2B || []
);

// App State (shared globally)
window.currentDayIndex = 0;
window.activeColumn = 'NT';
window.completedDays = JSON.parse(localStorage.getItem('leaf_completed_days') || '{}');
window.completedCols = JSON.parse(localStorage.getItem('leaf_completed_cols') || '{}');
window.planStartDate = localStorage.getItem('leaf_start_date') || new Date().toISOString().split('T')[0];
window.isDarkMode = localStorage.getItem('leaf_dark_mode') === 'true';
let isAiOverviewVisible = false;

// DOM Elements
const dayLabel = document.getElementById('day-number-label');
const dayDateLabel = document.getElementById('current-day-date');
const ntTitle = document.getElementById('nt-passage-title');
const contextText = document.getElementById('context-text-body');
const progressBar = document.getElementById('progress-bar');
const progressStats = document.getElementById('progress-stats');
const markReadBtn = document.getElementById('mark-read-btn');
const startDateInput = document.getElementById('start-date-input');
const jumpDateInput = document.getElementById('jump-date-input');
const jumpTodayBtn = document.getElementById('jump-today-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Helper: Formatted calendar date string for any day index
function getDateForDayIndex(index) {
  const start = new Date(window.planStartDate);
  start.setDate(start.getDate() + index);
  return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Helper: Direct Bible Gateway URL
function getBibleGatewayUrl(passageStr) {
  if (!passageStr) return "https://www.biblegateway.com/";
  const trans = (typeof window.currentTranslation !== 'undefined')
    ? window.currentTranslation
    : (localStorage.getItem('leaf_translation') || 'CEB');
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(passageStr)}&version=${encodeURIComponent(trans)}&tab=insights`;
}

// Update Column Buttons (showing checkmarks per column)
window.updateColumnButtonUI = function() {
  const data = window.ALL_DAYS[window.currentDayIndex];
  if (!data) return;
  const colStatus = window.completedCols[data.day] || {};

  const btnNT = document.getElementById('btn-col-nt');
  const btnOT1 = document.getElementById('btn-col-ot1');
  const btnOT2 = document.getElementById('btn-col-ot2');

  if (btnNT) {
    btnNT.textContent = colStatus.NT ? "📖 NT ✓" : "📖 NT";
    btnNT.classList.toggle('active-col', window.activeColumn === 'NT');
  }
  if (btnOT1) {
    btnOT1.textContent = colStatus.OT1 ? "📜 OT1 ✓" : "📜 OT1 (Early)";
    btnOT1.classList.toggle('active-col', window.activeColumn === 'OT1');
  }
  if (btnOT2) {
    btnOT2.textContent = colStatus.OT2 ? "🌿 OT2 ✓" : "🌿 OT2 (Late)";
    btnOT2.classList.toggle('active-col', window.activeColumn === 'OT2');
  }
};

// Set Active Column (NT, OT1, OT2)
window.setActiveColumn = function(col) {
  window.activeColumn = col;
  window.updateColumnButtonUI();

  const data = window.ALL_DAYS[window.currentDayIndex];
  if (!data) return;

  let passageToFetch = data.nt;
  if (col === 'NT') {
    if (ntTitle) ntTitle.textContent = data.nt;
    passageToFetch = data.nt;
  } else if (col === 'OT1') {
    if (ntTitle) ntTitle.textContent = `OT1: ${data.ot1}`;
    passageToFetch = data.ot1;
  } else if (col === 'OT2') {
    if (ntTitle) ntTitle.textContent = `OT2: ${data.ot2}`;
    passageToFetch = data.ot2;
  }

  // AI Overview
  if (contextText && typeof getContextNote === 'function') {
    contextText.innerHTML = getContextNote(passageToFetch, col, data);
  }

  // Study Guide
  const studyBtn = document.getElementById('study-link-btn');
  if (studyBtn) {
    studyBtn.href = getBibleGatewayUrl(passageToFetch);
  }

  // Trigger Scripture Fetch
  if (typeof window.fetchScripture === 'function') {
    window.fetchScripture(passageToFetch);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Calculate Day Index from Calendar Difference
function calculateTargetDayIndex() {
  const start = new Date(window.planStartDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 0;
  if (diffDays >= window.ALL_DAYS.length) return window.ALL_DAYS.length - 1;
  return diffDays;
}

// Load a specific day
window.loadDay = function(index) {
  window.currentDayIndex = index;
  const data = window.ALL_DAYS[index];
  if (!data) return;

  if (dayLabel) dayLabel.textContent = `Day ${data.day}`;
  if (dayDateLabel) dayDateLabel.textContent = getDateForDayIndex(index);

  if (markReadBtn) {
    if (window.completedDays[data.day]) {
      markReadBtn.textContent = "✓ Completed";
      markReadBtn.classList.add('completed');
    } else {
      markReadBtn.textContent = "Mark as Read";
      markReadBtn.classList.remove('completed');
    }
  }

  window.setActiveColumn(window.activeColumn);
  window.renderGridDrawer();
};

// Toggle AI Overview Card
function toggleAiOverview() {
  isAiOverviewVisible = !isAiOverviewVisible;
  const overviewBox = document.getElementById('historical-context-box');
  const aiBtn = document.getElementById('btn-ai-overview');
  if (overviewBox) overviewBox.classList.toggle('hidden', !isAiOverviewVisible);
  if (aiBtn) aiBtn.classList.toggle('active-col', isAiOverviewVisible);
}

// Update Top Progress Bar
window.updateProgressUI = function() {
  const count = Object.keys(window.completedDays).length;
  const percent = Math.round((count / 365) * 100);
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (progressStats) progressStats.textContent = `${count} of 365 days (${percent}%)`;
  const drawerCount = document.getElementById('drawer-completed-count');
  if (drawerCount) drawerCount.textContent = `Completed: ${count} / 365`;
};

// Render 365-Day Drawer Grid
window.renderGridDrawer = function() {
  const gridContainer = document.getElementById('days-grid');
  if (!gridContainer) return;
  gridContainer.innerHTML = '';

  for (let i = 0; i < window.ALL_DAYS.length; i++) {
    const dayNum = i + 1;
    const cell = document.createElement('div');
    cell.className = 'grid-day-cell';
    cell.title = `Day ${dayNum} (${getDateForDayIndex(i)})`;

    if (window.completedDays[dayNum]) {
      cell.classList.add('completed');
      cell.textContent = `${dayNum} ✓`;
    } else {
      cell.textContent = dayNum;
    }

    if (i === window.currentDayIndex) {
      cell.classList.add('current');
    }

    cell.addEventListener('click', () => {
      window.loadDay(i);
      toggleDrawer();
    });

    gridContainer.appendChild(cell);
  }
};

// Toggle Menu Drawer
function toggleDrawer() {
  const drawer = document.getElementById('progress-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer) drawer.classList.toggle('closed');
  if (overlay) overlay.classList.toggle('hidden');
}

// Apply Light/Dark Theme
function applyTheme() {
  document.body.classList.toggle('dark-mode', window.isDarkMode);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = window.isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
  }
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  applyTheme();

  if (startDateInput) startDateInput.value = window.planStartDate;

  window.currentDayIndex = calculateTargetDayIndex();
  window.loadDay(window.currentDayIndex);
  window.updateProgressUI();

  // Prev / Next Day
  const prevBtn = document.getElementById('prev-day-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (window.currentDayIndex > 0) {
        window.loadDay(window.currentDayIndex - 1);
      }
    });
  }

  const nextBtn = document.getElementById('next-day-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (window.currentDayIndex < window.ALL_DAYS.length - 1) {
        window.loadDay(window.currentDayIndex + 1);
      }
    });
  }

  // Start Date Picker (saves and recalibrates)
  if (startDateInput) {
    startDateInput.addEventListener('change', (e) => {
      window.planStartDate = e.target.value;
      localStorage.setItem('leaf_start_date', window.planStartDate);
      window.currentDayIndex = calculateTargetDayIndex();
      window.loadDay(window.currentDayIndex);
    });
  }

  // Jump to Today's Reading (keeps start date intact)
  if (jumpTodayBtn) {
    jumpTodayBtn.addEventListener('click', () => {
      window.loadDay(calculateTargetDayIndex());
      toggleDrawer();
    });
  }

  // Jump to Specific Calendar Date
  if (jumpDateInput) {
    jumpDateInput.addEventListener('change', (e) => {
      const val = e.target.value;
      if (!val) return;
      const target = new Date(val);
      const start = new Date(window.planStartDate);
      target.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);

      const diff = Math.floor((target - start) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < window.ALL_DAYS.length) {
        window.loadDay(diff);
        toggleDrawer();
      } else {
        alert("Selected date is outside the 365-day plan range.");
      }
      jumpDateInput.value = '';
    });
  }

  // Dark Mode Toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      window.isDarkMode = !window.isDarkMode;
      localStorage.setItem('leaf_dark_mode', window.isDarkMode);
      applyTheme();
    });
  }

  // Column Buttons
  const btnNT = document.getElementById('btn-col-nt');
  if (btnNT) btnNT.addEventListener('click', () => window.setActiveColumn('NT'));

  const btnOT1 = document.getElementById('btn-col-ot1');
  if (btnOT1) btnOT1.addEventListener('click', () => window.setActiveColumn('OT1'));

  const btnOT2 = document.getElementById('btn-col-ot2');
  if (btnOT2) btnOT2.addEventListener('click', () => window.setActiveColumn('OT2'));

  // AI Overview Button
  const btnAi = document.getElementById('btn-ai-overview');
  if (btnAi) btnAi.addEventListener('click', toggleAiOverview);

  // Mark Day Read / Completed
  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      const data = window.ALL_DAYS[window.currentDayIndex];
      if (!data) return;
      const dayNum = data.day;

      if (window.completedDays[dayNum]) {
        delete window.completedDays[dayNum];
        delete window.completedCols[dayNum];
        markReadBtn.textContent = "Mark as Read";
        markReadBtn.classList.remove('completed');
      } else {
        window.completedDays[dayNum] = true;
        window.completedCols[dayNum] = { NT: true, OT1: true, OT2: true };
        markReadBtn.textContent = "✓ Completed";
        markReadBtn.classList.add('completed');
      }

      localStorage.setItem('leaf_completed_days', JSON.stringify(window.completedDays));
      localStorage.setItem('leaf_completed_cols', JSON.stringify(window.completedCols));

      window.updateColumnButtonUI();
      window.updateProgressUI();
      window.renderGridDrawer();
    });
  }

  // Drawer Toggle Listeners
  const menuBtn = document.getElementById('menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', toggleDrawer);

  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', toggleDrawer);

  const drawerOverlay = document.getElementById('drawer-overlay');
  if (drawerOverlay) drawerOverlay.addEventListener('click', toggleDrawer);

  // Reset Plan Button
  const resetBtn = document.getElementById('reset-progress-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("Reset all 365-day reading progress?")) {
        window.completedDays = {};
        window.completedCols = {};
        localStorage.removeItem('leaf_completed_days');
        localStorage.removeItem('leaf_completed_cols');
        window.updateProgressUI();
        window.renderGridDrawer();
        window.loadDay(window.currentDayIndex);
      }
    });
  }
});

// === END OF app-core.js ===
