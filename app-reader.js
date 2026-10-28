// Robust Scripture Fetcher & Clean Renderer: CEB (Default), ERV, WEB, NKJV, KJV
// Complete Edition: Multi-Passage Parsing, Storage Quota Safety, and Timeout Protection

const scriptureContainer = document.getElementById('scripture-content');
const loadingSpinner = document.getElementById('scripture-loading');

// Validated supported translations; defaults to CEB
const SUPPORTED_TRANSLATIONS = ['CEB', 'ERV', 'WEB', 'NKJV', 'KJV'];
let currentTranslation = (localStorage.getItem('leaf_translation') || 'CEB').toUpperCase();
if (!SUPPORTED_TRANSLATIONS.includes(currentTranslation)) {
  currentTranslation = 'CEB';
  try {
    localStorage.setItem('leaf_translation', 'CEB');
  } catch (err) {}
}
window.currentTranslation = currentTranslation;

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
    transSelect.value = window.currentTranslation;

    transSelect.addEventListener('change', (e) => {
      window.currentTranslation = e.target.value.toUpperCase();
      try {
        localStorage.setItem('leaf_translation', window.currentTranslation);
      } catch (err) {}

      if (typeof window.setActiveColumn === 'function' && typeof window.activeColumn !== 'undefined') {
        window.setActiveColumn(window.activeColumn);
      } else if (window.ALL_DAYS && window.ALL_DAYS[window.currentDayIndex]) {
        window.fetchScripture(window.ALL_DAYS[window.currentDayIndex].nt);
      }
    });
  }
});

// Storage Quota Safety Helper
function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
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
    } catch (innerErr) {}
  }
}

// Clean Scripture Text
function cleanVerseText(text) {
  if (!text) return '';
  return text
    .replace(/<s\b[^>]*>[\s\S]*?<\/s>/gi, '')
    .replace(/<\/?s\b[^>]*>/gi, '')
    .replace(/\[\w+\]/g, '')
    .replace(/\{[HG]?\d+\}/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-z0-9#]+;/gi, '')
    .replace(/[\u2020\u2021\u00a7\u00b6]/g, '')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, '')
    .replace(/\s+([,.;:?!])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Fetch Single Chapter with 8-second Timeout
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const url = `https://bolls.life/get-text/${transCode}/${bookId}/${chapter}/`;
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      safeSetLocalStorage(cacheKey, JSON.stringify(data));
      return data;
    }
    throw new Error("No verses returned");
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Parse Comma-Separated Passages
function splitAndParsePassages(passageStr) {
  if (!passageStr) return [];
  const cleanStr = passageStr.trim();

  if (!cleanStr.includes(',')) {
    const single = parseSinglePassage(cleanStr);
    return single ? [single] : [];
  }

  const parts = cleanStr.split(',').map(p => p.trim()).filter(Boolean);
  const parsedList = [];
  let baseBook = null;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
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
      const parsed = parseSinglePassage(`${baseBook} ${part}`);
      if (parsed) parsedList.push(parsed);
    } else {
      const parsed = parseSinglePassage(part);
      if (parsed) parsedList.push(parsed);
    }
  }

  return parsedList;
}

// Parse Single Passage
function parseSinglePassage(str) {
  if (!str) return null;
  const cleanStr = str.trim();

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

  const standardMatch = cleanStr.match(/^([1-3]?\s?[A-Za-z\s]+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (standardMatch) {
    const book = standardMatch[1].trim();
    const startChapter = parseInt(standardMatch[2], 10);
    const startVerse = standardMatch[3] ? parseInt(standardMatch[3], 10) : null;
    const endVerse = standardMatch[4] ? parseInt(standardMatch[4], 10) : startVerse;
    return {
      book,
      startChapter,
      startVerse,
      endChapter: startChapter,
      endVerse
    };
  }

  const parts = cleanStr.split(' ');
  const chapter = parseInt(parts[parts.length - 1], 10) || 1;
  const book = parts.slice(0, parts.length - 1).join(' ') || cleanStr;
  return { book, startChapter: chapter, startVerse: null, endChapter: chapter, endVerse: null };
}

// Globally Exposed Scripture Fetcher
window.fetchScripture = async function(passageStr) {
  const spinner = document.getElementById('scripture-loading');
  const container = document.getElementById('scripture-content');
  
  if (spinner) spinner.classList.remove('hidden');
  if (container) container.innerHTML = '';

  const activeTrans = window.currentTranslation || 'CEB';

  try {
    const passageList = splitAndParsePassages(passageStr);
    if (!passageList || passageList.length === 0) {
      throw new Error("Could not parse passage reference.");
    }

    const renderedSections = [];

    for (let i = 0; i < passageList.length; i++) {
      const parsed = passageList[i];
      const bookId = BIBLE_BOOK_IDS[parsed.book];
      if (!bookId) throw new Error(`Book not recognized: ${parsed.book}`);

      let allVerses = [];
      const startData = await fetchChapterData(activeTrans, bookId, parsed.startChapter);
      allVerses = allVerses.concat(startData.map(v => ({ ...v, chapter: parsed.startChapter })));

      if (parsed.endChapter && parsed.endChapter > parsed.startChapter) {
        for (let ch = parsed.startChapter + 1; ch <= parsed.endChapter; ch++) {
          try {
            const extraData = await fetchChapterData(activeTrans, bookId, ch);
            allVerses = allVerses.concat(extraData.map(v => ({ ...v, chapter: ch })));
          } catch (e) {}
        }
      }

      renderedSections.push({ verses: allVerses, parsed });
    }

    renderMultiScriptureSections(renderedSections);
  } catch (err) {
    if (container) {
      container.innerHTML = `
        <div style="padding: 24px 16px; text-align: center;">
          <p style="color: var(--text-main); font-weight: 600; font-size: 1.05rem; margin-bottom: 8px;">
            Unable to load text live for <strong>${passageStr}</strong> (${activeTrans}).
          </p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">
            The connection to the translation server timed out or was interrupted.
          </p>
          <a href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(passageStr)}&version=${encodeURIComponent(activeTrans)}&tab=insights" target="_blank" style="display: inline-block; background: var(--primary); color: white; padding: 10px 18px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 0.95rem;">
            Read on Bible Gateway &rarr;
          </a>
        </div>
      `;
    }
  } finally {
    const activeSpinner = document.getElementById('scripture-loading');
    if (activeSpinner) activeSpinner.classList.add('hidden');
  }
};

// Render Verses
function renderMultiScriptureSections(sections) {
  const container = document.getElementById('scripture-content');
  if (!container) return;
  container.innerHTML = '';
  
  if (!sections || sections.length === 0) {
    container.innerHTML = `<p class="placeholder-instruction">No verses found for this reading.</p>`;
    return;
  }

  sections.forEach((sec) => {
    const { verses, parsed } = sec;

    if (sections.length > 1) {
      const subHeader = document.createElement('h3');
      subHeader.style.cssText = "margin: 20px 0 10px 0; padding-bottom: 4px; border-bottom: 1px solid var(--border); color: var(--primary); font-size: 1.05rem;";
      subHeader.textContent = (parsed.startChapter === parsed.endChapter)
        ? `${parsed.book} ${parsed.startChapter}`
        : `${parsed.book} ${parsed.startChapter}–${parsed.endChapter}`;
      container.appendChild(subHeader);
    }

    let renderedCount = 0;

    verses.forEach(v => {
      const verseNum = parseInt(v.verse, 10);
      const vChapter = v.chapter || parsed.startChapter;
      const text = cleanVerseText(v.text);

      let showVerse = true;

      if (parsed.startVerse !== null && parsed.endVerse !== null) {
        if (parsed.startChapter === parsed.endChapter) {
          showVerse = (vChapter === parsed.startChapter && verseNum >= parsed.startVerse && verseNum <= parsed.endVerse);
        } else {
          if (vChapter === parsed.startChapter) {
            showVerse = (verseNum >= parsed.startVerse);
          } else if (vChapter === parsed.endChapter) {
            showVerse = (verseNum <= parsed.endVerse);
          } else {
            showVerse = (vChapter > parsed.startChapter && vChapter < parsed.endChapter);
          }
        }
      }

      if (showVerse) {
        renderedCount++;
        const p = document.createElement('div');
        p.className = 'scripture-verse';

        const spanNum = document.createElement('span');
        spanNum.className = 'verse-num';
        spanNum.textContent = (parsed.startChapter !== parsed.endChapter)
          ? `${vChapter}:${verseNum}`
          : `${verseNum}`;
        p.appendChild(spanNum);

        const spanText = document.createElement('span');
        spanText.innerHTML = ` ${text}`;
        p.appendChild(spanText);

        container.appendChild(p);
      }
    });

    if (renderedCount === 0) {
      verses.forEach(v => {
        const p = document.createElement('div');
        p.className = 'scripture-verse';
        p.innerHTML = `<span class="verse-num">${v.chapter ? v.chapter + ':' : ''}${v.verse}</span><span> ${cleanVerseText(v.text)}</span>`;
        container.appendChild(p);
      });
    }
  });

  appendScriptureFooter();
}

// Append Bottom Navigation Footer
function appendScriptureFooter() {
  const container = document.getElementById('scripture-content');
  if (!container) return;

  const footerDiv = document.createElement('div');
  footerDiv.className = 'scripture-footer-nav';

  const dayData = (window.ALL_DAYS && window.ALL_DAYS[window.currentDayIndex])
    ? window.ALL_DAYS[window.currentDayIndex]
    : { day: 1, nt: '', ot1: '', ot2: '' };
  const dayNum = dayData.day;

  if (!window.completedCols) window.completedCols = {};
  if (!window.completedCols[dayNum]) window.completedCols[dayNum] = {};
  const colStatus = window.completedCols[dayNum];

  const currentCol = window.activeColumn || 'NT';
  const isCurrentColDone = !!colStatus[currentCol];

  let nextActionLabel = "";
  let nextTargetCol = null;

  if (currentCol === 'NT' && !colStatus.OT1) {
    nextActionLabel = "Next: 📜 OT1 →";
    nextTargetCol = 'OT1';
  } else if ((currentCol === 'NT' || currentCol === 'OT1') && !colStatus.OT2) {
    nextActionLabel = "Next: 🌿 OT2 →";
    nextTargetCol = 'OT2';
  } else if (!colStatus.NT && currentCol !== 'NT') {
    nextActionLabel = "Next: 📖 NT →";
    nextTargetCol = 'NT';
  } else {
    nextActionLabel = "✓ Mark Day Complete";
    nextTargetCol = 'DONE';
  }

  footerDiv.innerHTML = `
    <button id="footer-mark-col-btn" class="footer-action-btn ${isCurrentColDone ? 'done' : ''}">
      ${isCurrentColDone ? `✓ ${currentCol} Read` : `Mark ${currentCol} Read ✓`}
    </button>
    <button id="footer-next-btn" class="footer-next-btn">
      ${nextActionLabel}
    </button>
  `;

  container.appendChild(footerDiv);

  const markColBtn = document.getElementById('footer-mark-col-btn');
  const nextBtn = document.getElementById('footer-next-btn');

  if (markColBtn) {
    markColBtn.addEventListener('click', () => {
      colStatus[currentCol] = !colStatus[currentCol];
      try {
        localStorage.setItem('leaf_completed_cols', JSON.stringify(window.completedCols));
      } catch (err) {}

      if (colStatus.NT && colStatus.OT1 && colStatus.OT2) {
        window.completedDays[dayNum] = true;
      } else {
        delete window.completedDays[dayNum];
      }
      try {
        localStorage.setItem('leaf_completed_days', JSON.stringify(window.completedDays));
      } catch (err) {}

      if (typeof window.updateColumnButtonUI === 'function') window.updateColumnButtonUI();
      if (typeof window.updateProgressUI === 'function') window.updateProgressUI();
      if (typeof window.renderGridDrawer === 'function') window.renderGridDrawer();
      if (typeof window.loadDay === 'function') window.loadDay(window.currentDayIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      colStatus[currentCol] = true;
      try {
        localStorage.setItem('leaf_completed_cols', JSON.stringify(window.completedCols));
      } catch (err) {}

      if (colStatus.NT && colStatus.OT1 && colStatus.OT2) {
        window.completedDays[dayNum] = true;
      }
      try {
        localStorage.setItem('leaf_completed_days', JSON.stringify(window.completedDays));
      } catch (err) {}

      if (nextTargetCol === 'DONE') {
        if (window.ALL_DAYS && window.currentDayIndex < window.ALL_DAYS.length - 1) {
          window.currentDayIndex++;
          if (typeof window.loadDay === 'function') window.loadDay(window.currentDayIndex);
        } else {
          alert("Congratulations! You have completed the 365-day reading plan!");
        }
      } else {
        if (typeof window.setActiveColumn === 'function') window.setActiveColumn(nextTargetCol);
      }

      if (typeof window.updateColumnButtonUI === 'function') window.updateColumnButtonUI();
      if (typeof window.updateProgressUI === 'function') window.updateProgressUI();
      if (typeof window.renderGridDrawer === 'function') window.renderGridDrawer();
    });
  }
}

// === END OF app-reader.js ===
