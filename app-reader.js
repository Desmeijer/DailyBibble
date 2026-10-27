// Robust Scripture Fetcher & Clean Renderer: CEB (Default), ERV, WEB, NKJV, KJV
// Updated with localStorage Quota Protection and Multi-Passage (Comma-Separated) Support

const scriptureContainer = document.getElementById('scripture-content');
const loadingSpinner = document.getElementById('scripture-loading');

// Validated supported translations; defaults to CEB if none or invalid is stored
const SUPPORTED_TRANSLATIONS = ['CEB', 'ERV', 'WEB', 'NKJV', 'KJV'];
let currentTranslation = (localStorage.getItem('leaf_translation') || 'CEB').toUpperCase();
if (!SUPPORTED_TRANSLATIONS.includes(currentTranslation)) {
  currentTranslation = 'CEB';
  localStorage.setItem('leaf_translation', 'CEB');
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
        const data = ALL_DAYS[currentDayIndex];
        if (data) fetchScripture(data.nt);
      }
    });
  }
});

// Helper to safely write to localStorage with automated quota-clearing fallback
function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // If quota is exceeded, clear old cached chapters while preserving user plan progress
    console.warn("Storage quota exceeded. Purging cached scripture chapters...");
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('leaf_v') || k.includes('_id_'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      localStorage.setItem(key, value);
    } catch (innerErr) {
      console.error("Critical storage failure, skipping local cache write:", innerErr);
    }
  }
}

// Helper to strip API tags, Strong's concordance numbers (<s>...</s>), and bracketed footnotes
function cleanVerseText(text) {
  if (!text) return '';
  return text
    // 1. Remove <s>...</s> tags and the Strong's numbers inside them (KJV/NKJV)
    .replace(/<s\b[^>]*>[\s\S]*?<\/s>/gi, '')
    // 2. Remove any orphaned or unclosed <s> tags
    .replace(/<\/?s\b[^>]*>/gi, '')
    // 3. Remove footnote references like [1], [a], etc.
    .replace(/\[\w+\]/g, '')
    // 4. Remove bracketed Strong's references like {H1234} or {G5678}
    .replace(/\{[HG]?\d+\}/gi, '')
    // 5. Remove any other HTML markup (<i>, </i>, <add>, etc.)
    .replace(/<[^>]*>/g, '')
    // 6. Clean HTML entities
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-z0-9#]+;/gi, '')
    // 7. Remove footnote markers (†, ‡, §, ¶)
    .replace(/[\u2020\u2021\u00a7\u00b6]/g, '')
    // 8. Remove isolated superscript numerals
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, '')
    // 9. Fix spacing before punctuation (e.g. "word , next" -> "word, next")
    .replace(/\s+([,.;:?!])/g, '$1')
    // 10. Normalize multiple whitespace characters
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Helper to fetch and cache a single chapter strictly using uppercase translation codes
async function fetchChapterData(translation, bookId, chapter) {
  const transCode = translation.toUpperCase();
  const cacheKey = `leaf_v5_${transCode}_id_${bookId}_${chapter}`;
  let cached = null;
  
  try {
    cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
  } catch (e) {
    cached = null;
  }

  if (Array.isArray(cached) && cached.length > 0) {
    return cached;
  }

  const url = `https://bolls.life/get-text/${transCode}/${bookId}/${chapter}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching chapter for ${transCode}`);
  
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0) {
    safeSetLocalStorage(cacheKey, JSON.stringify(data));
    return data;
  }
  throw new Error("No verses returned from API");
}

// Parse a multi-passage string into an array of atomic passage objects
// Handles comma-separated items like "Psalms 11, 58-59" or "Psalms 130-131, 134-135"
function splitAndParsePassages(passageStr) {
  if (!passageStr) return [];
  const cleanStr = passageStr.trim();

  // If there are no commas, parse directly as a single item
  if (!cleanStr.includes(',')) {
    const single = parseSinglePassage(cleanStr);
    return single ? [single] : [];
  }

  const parts = cleanStr.split(',').map(p => p.trim()).filter(Boolean);
  const parsedList = [];
  let baseBook = null;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    // Check if part explicitly contains a known book name
    let detectedBook = null;
    for (const book of Object.keys(BIBLE_BOOK_IDS)) {
      if (part.startsWith(book)) {
        detectedBook = book;
        break;
      }
    }

    if (detectedBook) {
      baseBook = detectedBook;
      const parsed = parseSinglePassage(part);
      if (parsed) parsedList.push(parsed);
    } else if (baseBook) {
      // Re-attach the base book to subsequent chapter/verse lists (e.g. "58-59" -> "Psalms 58-59")
      const parsed = parseSinglePassage(`${baseBook} ${part}`);
      if (parsed) parsedList.push(parsed);
    } else {
      const parsed = parseSinglePassage(part);
      if (parsed) parsedList.push(parsed);
    }
  }

  return parsedList;
}

// Parse a single atomic passage reference
function parseSinglePassage(str) {
  if (!str) return null;
  const cleanStr = str.trim();

  // Single-chapter books
  if (["2 John", "3 John", "Jude", "Obadiah", "Philemon"].some(b => cleanStr.startsWith(b))) {
    const bookMatch = ["2 John", "3 John", "Jude", "Obadiah", "Philemon"].find(b => cleanStr.startsWith(b));
    const remainder = cleanStr.replace(bookMatch, '').trim();
    const vMatch = remainder.match(/(\d+)(?::-(\d+))?/);
    return {
      book: bookMatch,
      startChapter: 1,
      startVerse: vMatch ? parseInt(vMatch[1], 10) : null,
      endChapter: 1,
      endVerse: vMatch && vMatch[2] ? parseInt(vMatch[2], 10) : (vMatch ? parseInt(vMatch[1], 10) : null)
    };
  }

  // Cross-chapter verses (e.g., "Genesis 3:8-4:16")
  const crossMatch = cleanStr.match(/^([1-3]?\s?[A-Za-z\s]+?)\s+(\d+):(\d+)-(\d+):(\d+)$/);
  if (crossMatch) {
    return {
      book: crossMatch[1].trim(),
      startChapter: parseInt(crossMatch[2], 10),
      startVerse: parseInt(crossMatch[3], 10),
      endChapter: parseInt(crossMatch[4], 10),
      endVerse: parseInt(crossMatch[5], 10)
    };
  }

  // Multi-chapter blocks (e.g., "Psalms 58-59", "Genesis 1-2")
  const multiChapterMatch = cleanStr.match(/^([1-3]?\s?[A-Za-z\s]+?)\s+(\d+)-(\d+)$/);
  if (multiChapterMatch) {
    return {
      book: multiChapterMatch[1].trim(),
      startChapter: parseInt(multiChapterMatch[2], 10),
      startVerse: null,
      endChapter: parseInt(multiChapterMatch[3], 10),
      endVerse: null
    };
  }

  // Standard chapter:verse (e.g., "Mark 1:1-28", "Psalm 18")
  const standardMatch = cleanStr.match(/^([1-3]?\s?[A-Za-z\s]+?)\s+(\d+)(?
