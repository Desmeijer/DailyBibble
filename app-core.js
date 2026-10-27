// Step 6A: Core App Logic, Navigation, Progress Tracker & Drawer
// Updated with Calendar Date Mapping, Non-destructive Today Jump, and Checkmark Grid Cells

// Combine dataset parts into a single 365-day array
const ALL_DAYS = [].concat(
  window.PLAN_PART_1 || [],
  window.PLAN_PART_2A || [],
  window.PLAN_PART_2B || []
);

// App State
let currentDayIndex = 0; // 0 to 364
let completedDays = JSON.parse(localStorage.getItem('leaf_completed_days') || '{}');
let completedCols = JSON.parse(localStorage.getItem('leaf_completed_cols') || '{}');
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
