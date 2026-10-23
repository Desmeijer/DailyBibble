// Step 6A: Core App Logic, Navigation, Progress Tracker & Drawer

// Combine dataset parts into a single 365-day array
const ALL_DAYS = [].concat(
  window.PLAN_PART_1 || [],
  window.PLAN_PART_2A || [],
  window.PLAN_PART_2B || []
);

// App State
let currentDayIndex = 0; // 0 to 364
let completedDays = JSON.parse(localStorage.getItem('leaf_completed_days') || '{}');
let planStartDate = localStorage.getItem('leaf_start_date') || new Date().toISOString().split('T')[0];
let isFullChapterView = false;
let isOtVisible = false;
let activeColumn = 'NT'; // 'NT', 'OT1', or 'OT2'

// DOM Elements
const dayLabel = document.getElementById('day-number-label');
const ntTitle = document.getElementById('nt-passage-title');
const contextText = document.getElementById('context-text-body');
const ot1Text = document.getElementById('ot1-text');
const ot2Text = document.getElementById('ot2-text');
const progressBar = document.getElementById('progress-bar');
const progressStats = document.getElementById('progress-stats');
const markReadBtn = document.getElementById('mark-read-btn');
const startDateInput = document.getElementById('start-date-input');

// Helper: Direct Commentary Link
function getEnduringWordUrl(passageStr) {
  if (!passageStr) return "https://enduringword.com/";
  const parts = passageStr.split(" ")[0].toLowerCase();
  const match = passageStr.match(/\d+/);
  const chapter = match ? match[0] : "1";
  return `https://enduringword.com/bible-commentary/${parts}-${chapter}/`;
}

// Set Active Reading Column (NT, OT1, OT2)
function setActiveColumn(col) {
  activeColumn = col;
  
  const btnNT = document.getElementById('btn-col-nt');
  const btnOT1 = document.getElementById('btn-col-ot1');
  const btnOT2 = document.getElementById('btn-col-ot2');

  if (btnNT) btnNT.classList.toggle('active-col', col === 'NT');
  if (btnOT1) btnOT1.classList.toggle('active-col', col === 'OT1');
  if (btnOT2) btnOT2.classList.toggle('active-col', col === 'OT2');

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

  if (typeof fetchScripture === 'function') {
    fetchScripture(passageToFetch, isFullChapterView);
  }
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
  
  if (contextText && typeof getContextNote === 'function') {
    contextText.innerHTML = getContextNote(data.nt);
  }
  if (ot1Text) ot1Text.textContent = data.ot1;
  if (ot2Text) ot2Text.textContent = data.ot2;

  const studyBtn = document.getElementById('study-link-btn');
  if (studyBtn) studyBtn.href = getEnduringWordUrl(data.nt);

  if (markReadBtn) {
    if (completedDays[data.day]) {
      markReadBtn.textContent = "✓ Completed";
      markReadBtn.classList.add('completed');
    } else {
      markReadBtn.textContent = "Mark as Read";
      markReadBtn.classList.remove('completed');
    }
  }

  isFullChapterView = false;
  const fullChapBtn = document.getElementById('toggle-full-chapter-btn');
  if (fullChapBtn) fullChapBtn.textContent = "📖 Read Full Chapter";

  setActiveColumn(activeColumn);
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

// Render 365-Day Drawer Grid
function renderGridDrawer() {
  const gridContainer = document.getElementById('days-grid');
  if (!gridContainer) return;
  gridContainer.innerHTML = '';

  for (let i = 0; i < ALL_DAYS.length; i++) {
    const dayNum = i + 1;
    const cell = document.createElement('div');
    cell.className = 'grid-day-cell';
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

// Initialize App on Load
document.addEventListener('DOMContentLoaded', () => {
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

  // Calendar Date Picker Jump
  if (startDateInput) {
    startDateInput.addEventListener('change', (e) => {
      planStartDate = e.target.value;
      localStorage.setItem('leaf_start_date', planStartDate);
      currentDayIndex = calculateTargetDayIndex();
      loadDay(currentDayIndex);
      renderGridDrawer();
    });
  }

  // Column Buttons (Safe attachment)
  const btnNT = document.getElementById('btn-col-nt');
  if (btnNT) btnNT.addEventListener('click', () => setActiveColumn('NT'));

  const btnOT1 = document.getElementById('btn-col-ot1');
  if (btnOT1) btnOT1.addEventListener('click', () => setActiveColumn('OT1'));

  const btnOT2 = document.getElementById('btn-col-ot2');
  if (btnOT2) btnOT2.addEventListener('click', () => setActiveColumn('OT2'));

  // Mark as Read / Completed Button
  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      const dayNum = currentDayIndex + 1;
      if (completedDays[dayNum]) {
        delete completedDays[dayNum];
        markReadBtn.textContent = "Mark as Read";
        markReadBtn.classList.remove('completed');
      } else {
        completedDays[dayNum] = true;
        markReadBtn.textContent = "✓ Completed";
        markReadBtn.classList.add('completed');
      }
      localStorage.setItem('leaf_completed_days', JSON.stringify(completedDays));
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
        localStorage.removeItem('leaf_completed_days');
        updateProgressUI();
        renderGridDrawer();
        loadDay(currentDayIndex);
      }
    });
  }
});
