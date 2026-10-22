// Step 6A (Upgraded): Core App Logic, Navigation, Progress Tracker & Instant UI Toggle

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

// Initialize App on Load
document.addEventListener('DOMContentLoaded', () => {
  startDateInput.value = planStartDate;
  
  // Calculate today's scheduled day based on start date
  currentDayIndex = calculateTargetDayIndex();
  
  loadDay(currentDayIndex);
  renderGridDrawer();
  updateProgressUI();

  // Event Listeners for Navigation
  document.getElementById('prev-day-btn').addEventListener('click', () => {
    if (currentDayIndex > 0) {
      currentDayIndex--;
      loadDay(currentDayIndex);
    }
  });

  document.getElementById('next-day-btn').addEventListener('click', () => {
    if (currentDayIndex < ALL_DAYS.length - 1) {
      currentDayIndex++;
      loadDay(currentDayIndex);
    }
  });

  startDateInput.addEventListener('change', (e) => {
    planStartDate = e.target.value;
    localStorage.setItem('leaf_start_date', planStartDate);
    currentDayIndex = calculateTargetDayIndex();
    loadDay(currentDayIndex);
  });

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

  // Drawer Toggles
  document.getElementById('menu-btn').addEventListener('click', toggleDrawer);
  document.getElementById('close-drawer-btn').addEventListener('click', toggleDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', toggleDrawer);

  document.getElementById('reset-progress-btn').addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all progress?")) {
      completedDays = {};
      localStorage.removeItem('leaf_completed_days');
      updateProgressUI();
      renderGridDrawer();
      loadDay(currentDayIndex);
    }
  });
});

// Calculate day index based on calendar diff from start date
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

  dayLabel.textContent = `Day ${data.day}`;
  ntTitle.textContent = data.nt;
  
  // Context notes
  contextText.innerHTML = getContextNote(data.nt);
  ot1Text.textContent = data.ot1;
  ot2Text.textContent = data.ot2;

  // Update Mark as Read button state
  if (completedDays[data.day]) {
    markReadBtn.textContent = "✓ Completed";
    markReadBtn.classList.add('completed');
  } else {
    markReadBtn.textContent = "Mark as Read";
    markReadBtn.classList.remove('completed');
  }

  // Reset toggles and fetch scripture
  isFullChapterView = false;
  const fullChapBtn = document.getElementById('toggle-full-chapter-btn');
  if (fullChapBtn) fullChapBtn.textContent = "📖 Read Full Chapter";
  
  fetchScripture(data.nt, false);
}

// Update Progress Bar & Stats
function updateProgressUI() {
  const completedCount = Object.keys(completedDays).length;
  const percent = Math.round((completedCount / 365) * 100);
  
  progressBar.style.width = `${percent}%`;
  progressStats.textContent = `${completedCount} of 365 days (${percent}%)`;
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
