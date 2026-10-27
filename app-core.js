// Step 6A: Core App Logic, Navigation, Progress Tracker & Drawer
// Upgraded with Calendar Date Mapping, Date Jump, Dark Mode, and Column Checkmarks

// Combine dataset parts into a single 365-day array
const ALL_DAYS = [].concat(
  window.PLAN_PART_1 || [],
  window.PLAN_PART_2A || [],
  window.PLAN_PART_2B || []
);

// App State
let currentDayIndex = 0; // 0 to 364
let completedDays = JSON.parse(localStorage.getItem('leaf_completed_days') || '{}');
let completedCols = JSON.parse(localStorage.getItem('leaf_completed_cols') || '{}'); // Format: { dayNum: { NT: true, OT1: false, OT2: true } }
let planStartDate = localStorage.getItem('leaf_start_date') || new Date().toISOString().split('T')[0];
let activeColumn = 'NT'; // Default column is NT
let isAiOverviewVisible = false; // Starts collapsed by default
let isDarkMode = localStorage.getItem('leaf_dark_mode') === 'true';

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

// Helper: Get formatted calendar date for any 0-364 day index based on plan start date
function getDateForDayIndex(index) {
  const start = new Date(planStartDate);
  start.setDate(start.getDate() + index);
  return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Helper: Get YYYY-MM-DD string for a day index
function getDateStringForDayIndex(index) {
  const start = new Date(planStartDate);
  start.setDate(start.getDate() + index);
  return start.toISOString().split('T')[0];
}

// Helper: Direct Bible Gateway Insights Link for active passage & translation
function getBibleGatewayUrl(passageStr) {
  if (!passageStr) return "https://www.biblegateway.com/";
  const trans = (typeof currentTranslation !== 'undefined')
    ? currentTranslation
    : (localStorage.getItem('leaf_translation') || 'CEB');
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(passageStr)}&version=${encodeURIComponent(trans)}&tab=insights`;
}

// Update Column Button Badges with Checkmarks
function updateColumnButtonUI() {
  const data = ALL_DAYS[currentDayIndex];
  if (!data) return;
  const dayNum = data.day;
  const colStatus = completedCols[dayNum] || {};

  const btnNT = document.getElementById('btn-col-nt');
  const btnOT1 = document.getElementById('btn-col-ot1');
  const btnOT2 = document.getElementById('btn-col-ot2');

  if (btnNT) {
    btnNT.textContent = colStatus.NT ? "📖 NT ✓" : "📖 NT";
    btnNT.classList.toggle('active-col', activeColumn === 'NT');
  }
  if (btnOT1) {
    btnOT1.textContent = colStatus.OT1 ? "📜 OT1 ✓" : "📜 OT1 (Early)";
    btnOT1.classList.toggle('active-col', activeColumn === 'OT1');
  }
  if (btnOT2) {
    btnOT2.textContent = colStatus.OT2 ? "🌿 OT2 ✓" : "🌿 OT2 (Late)";
    btnOT2.classList.toggle('active-col', activeColumn === 'OT2');
  }
}

// Set Active Reading Column (NT, OT1, OT2)
function setActiveColumn(col) {
  activeColumn = col;
  updateColumnButtonUI();

  const data = ALL_DAYS[currentDayIndex];
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

  // Update AI Overview dynamically
  if (contextText && typeof getContextNote === 'function') {
    contextText.innerHTML = getContextNote(passageToFetch, col, data);
  }

  // Update Study Guide link
  const studyBtn = document.getElementById('study-link-btn');
  if (studyBtn) {
    studyBtn.href = getBibleGatewayUrl(passageToFetch);
  }

  if (typeof fetchScripture === 'function') {
    fetchScripture(passageToFetch);
  }

  // Smooth scroll back to top of passage card on column change
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Calculate day index based on calendar diff from start date to today
function calculateTargetDayIndex() {
  const start = new Date(planStartDate);
  const today = new Date();
  start.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  
  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 0;
  if (diffDays >= ALL_DAYS.length) return ALL_DAYS.length - 1;
  return diffDays;
}

// Load a specific day into the UI
function loadDay(index) {
  currentDayIndex = index;
  const data = ALL_DAYS[index];
  if (!data) return;

  if (dayLabel) dayLabel.textContent = `Day ${data.day}`;
  if (dayDateLabel) dayDateLabel.textContent = getDateForDayIndex(index);

  if (markReadBtn) {
    if (completedDays[data.day]) {
      markReadBtn.textContent = "✓ Completed";
      markReadBtn.classList.add('completed');
    } else {
      markReadBtn.textContent = "Mark as Read";
      markReadBtn.classList.remove('completed');
    }
  }

  setActiveColumn(activeColumn);
  renderGridDrawer();
}

// Toggle AI Overview Card Visibility
function toggleAiOverview() {
  isAiOverviewVisible = !isAiOverviewVisible;
  const overviewBox = document.getElementById('historical-context-box');
  const aiBtn = document.getElementById('btn-ai-overview');

  if (overviewBox) {
    overviewBox.classList.toggle('hidden', !isAiOverviewVisible);
  }
  if (aiBtn) {
    aiBtn.classList.toggle('active-col', isAiOverviewVisible);
  }
}

// Update Progress Bar & Stats
function updateProgressUI() {
  const completedCount = Object.keys(completedDays).length;
  const percent = Math.round((completedCount / 365) * 100);
  
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (progressStats) progressStats.textContent = `${completedCount} of 365 days (${percent}%)`;
  const drawerCount = document.getElementById('drawer-completed-count');
  if (drawerCount) drawerCount.textContent = `Completed: ${completedCount} / 365`;
}

// Render 365-Day Drawer Grid with Mapped Dates
function renderGridDrawer() {
  const gridContainer = document.getElementById('days-grid');
  if (!gridContainer) return;
  gridContainer.innerHTML = '';

  for (let i = 0; i < ALL_DAYS.length; i++) {
    const dayNum = i + 1;
    const cell = document.createElement('div');
    cell.className = 'grid-day-cell';
    cell.title = `Day ${dayNum} (${getDateForDayIndex(i)})`;
    cell.textContent = dayNum;

    if (completedDays[dayNum]) {
      cell.classList.add('completed');
    }
    if (i === currentDayIndex) {
      cell.classList.add('current');
    }

    cell.addEventListener('click', () => {
      loadDay(i);
      toggleDrawer();
    });

    gridContainer.appendChild(cell);
  }
}

function toggleDrawer() {
  const drawer = document.getElementById('progress-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer) drawer.classList.toggle('closed');
  if (overlay) overlay.classList.toggle('hidden');
}

// Apply Theme state
function applyTheme() {
  document.body.classList.toggle('dark-mode', isDarkMode);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
  }
}

// Initialize App on Load
document.addEventListener('DOMContentLoaded', () => {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered successfully:', reg.scope))
      .catch(err => console.warn('Service Worker registration skipped/failed:', err));
  }

  // Apply saved theme
  applyTheme();

  if (startDateInput) startDateInput.value = planStartDate;
  
  // Calculate today's scheduled day based on start date
  currentDayIndex = calculateTargetDayIndex();
  
  loadDay(currentDayIndex);
  renderGridDrawer();
  updateProgressUI();

  // Navigation Buttons
  const prevBtn = document.getElementById('prev-day-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentDayIndex > 0) {
        currentDayIndex--;
        loadDay(currentDayIndex);
      }
    });
  }

  const nextBtn = document.getElementById('next-day-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentDayIndex < ALL_DAYS.length - 1) {
        currentDayIndex++;
        loadDay(currentDayIndex);
      }
    });
  }

  // Start Date Picker Change
  if (startDateInput) {
    startDateInput.addEventListener('change', (e) => {
      planStartDate = e.target.value;
      try {
        localStorage.setItem('leaf_start_date', planStartDate);
      } catch (err) {
        console.warn("Could not save start date:", err);
      }
      currentDayIndex = calculateTargetDayIndex();
      loadDay(currentDayIndex);
      renderGridDrawer();
    });
  }

  // Jump to Today Button
  if (jumpTodayBtn) {
    jumpTodayBtn.addEventListener('click', () => {
      planStartDate = new Date().toISOString().split('T')[0];
      if (startDateInput) startDateInput.value = planStartDate;
      try {
        localStorage.setItem('leaf_start_date', planStartDate);
      } catch (err) {}
      currentDayIndex = calculateTargetDayIndex();
      loadDay(currentDayIndex);
      renderGridDrawer();
      toggleDrawer();
    });
  }

  // Jump to Specific Date Picker
  if (jumpDateInput) {
    jumpDateInput.addEventListener('change', (e) => {
      const targetDateStr = e.target.value;
      if (!targetDateStr) return;
      const targetDate = new Date(targetDateStr);
      const start = new Date(planStartDate);
      targetDate.setHours(0,0,0,0);
      start.setHours(0,0,0,0);

      const diffDays = Math.floor((targetDate - start) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < ALL_DAYS.length) {
        loadDay(diffDays);
        toggleDrawer();
      } else {
        alert("Selected date is outside the 365-day plan window based on your current Start Date.");
      }
      jumpDateInput.value = '';
    });
  }

  // Theme Toggle Button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      isDarkMode = !isDarkMode;
      try {
        localStorage.setItem('leaf_dark_mode', isDarkMode);
      } catch (err) {}
      applyTheme();
    });
  }

  // Column Buttons
  const btnNT = document.getElementById('btn-col-nt');
  if (btnNT) btnNT.addEventListener('click', () => setActiveColumn('NT'));

  const btnOT1 = document.getElementById('btn-col-ot1');
  if (btnOT1) btnOT1.addEventListener('click', () => setActiveColumn('OT1'));

  const btnOT2 = document.getElementById('btn-col-ot2');
  if (btnOT2) btnOT2.addEventListener('click', () => setActiveColumn('OT2'));

  // AI Overview Toggle Button
  const btnAiOverview = document.getElementById('btn-ai-overview');
  if (btnAiOverview) {
    btnAiOverview.addEventListener('click', toggleAiOverview);
  }

  // Mark as Read / Completed Button
  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      const data = ALL_DAYS[currentDayIndex];
      if (!data) return;
      const dayNum = data.day;

      if (completedDays[dayNum]) {
        delete completedDays[dayNum];
        delete completedCols[dayNum];
        markReadBtn.textContent = "Mark as Read";
        markReadBtn.classList.remove('completed');
      } else {
        completedDays[dayNum] = true;
        completedCols[dayNum] = { NT: true, OT1: true, OT2: true };
        markReadBtn.textContent = "✓ Completed";
        markReadBtn.classList.add('completed');
      }
      try {
        localStorage.setItem('leaf_completed_days', JSON.stringify(completedDays));
        localStorage.setItem('leaf_completed_cols', JSON.stringify(completedCols));
      } catch (err) {}
      
      updateColumnButtonUI();
      updateProgressUI();
      renderGridDrawer();
    });
  }

  // Drawer Toggles
  const menuBtn = document.getElementById('menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', toggleDrawer);

  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', toggleDrawer);

  const drawerOverlay = document.getElementById('drawer-overlay');
  if (drawerOverlay) drawerOverlay.addEventListener('click', toggleDrawer);

  const resetBtn = document.getElementById('reset-progress-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to reset all progress?")) {
        completedDays = {};
        completedCols = {};
        localStorage.removeItem('leaf_completed_days');
        localStorage.removeItem('leaf_completed_cols');
        updateProgressUI();
        renderGridDrawer();
        loadDay(currentDayIndex);
        updateColumnButtonUI();
      }
    });
  }
});
