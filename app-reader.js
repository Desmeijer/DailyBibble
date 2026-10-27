// Robust Scripture Fetcher & Clean Renderer: CEB (Default), ERV, WEB, NKJV, KJV
// Complete Edition: Multi-Passage Parsing, Storage Quota Safety, and Bottom Action Footer

const scriptureContainer = document.getElementById('scripture-content');
const loadingSpinner = document.getElementById('scripture-loading');

// Validated supported translations; defaults to CEB if none or invalid is stored
const SUPPORTED_TRANSLATIONS = ['CEB', 'ERV', 'WEB', 'NKJV', 'KJV'];
let currentTranslation = (localStorage.getItem('leaf_translation') || 'CEB').toUpperCase();
if (!SUPPORTED_TRANSLATIONS.includes(currentTranslation)) {
  currentTranslation = 'CEB';
  try {
    localStorage.setItem('leaf_translation', 'CEB');
  } catch (err) {}
}

const BIBLE_BOOK_IDS = {
  "Genesis": 1, "Exodus": 2, "Leviticus": 3, "Numbers": 4, "Deuteronomy": 5,
  "Joshua": 6, "Judges": 7, "Ruth": 8, "1 Samuel": 9, "2 Samuel": 10,
  "1 Kings": 11, "2 Kings": 12, "1 Chronicles": 13, "2 Chronicles": 14,
  "Ezra": 15, "Nehemiah": 16, "Esther": 17, "Job": 18, "Psalms": 19, "Psalm": 19,
  "Proverbs": 20, "Ecclesiastes": 21, "Song of Solomon": 22, "Song of Songs": 22, "Isaiah": 23,
  "Jeremiah": 24, "Lamentations": 25, "Ezekiel": 26, "Daniel": 27, "Hosea": 28,
  "Joel": 29, "Amos": 30, "Obadiah": 31, "Jonah": 32, "Micah": 33, "Nahum": 34,
  "Habakkuk": 35, "Zephaniah": 36, "Haggai": 37, "Zechariah": 38, "Malachi": 39,
  "Matthew": 40, "Mark": 41, "Luke": 42, "John": 43, "Acts": 44,
  "Romans": 45, "1 Corinthians": 46, "2 Corinthians": 47, "Galatians": 48,
  "Ephesians": 49, "Philippians": 50, "Colossians": 51, "1 Thessalonians": 52,
  "2 Thessalonians": 53, "1 Timothy": 54, "2 Timothy": 55, "Titus": 56,
  "Philemon": 57, "Hebrews": 58, "James": 59, "1 Peter": 60, "2 Peter": 61,
  "1 John": 62, "2 John": 63, "3 John": 64, "Jude": 65, "Revelation": 66
};

// Initialize Translation Dropdown Listener
document.addEventListener('DOMContentLoaded', () => {
  const transSelect = document.getElementById('translation-select');
  if (transSelect) {
    transSelect.value = currentTranslation;

    transSelect.addEventListener('change', (e) => {
      currentTranslation = e.target.value.toUpperCase();
      try {
        localStorage.setItem('leaf_translation', currentTranslation);
      } catch (err) {
        console.warn("Could not save translation to localStorage:", err);
      }

      if (typeof setActiveColumn === 'function' && typeof activeColumn !== 'undefined') {
        setActiveColumn(activeColumn);
      } else {
        const data = (typeof ALL_DAYS !==
