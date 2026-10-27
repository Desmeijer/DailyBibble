// Robust Scripture Fetcher & Clean Renderer: CEB (Default), ERV, WEB, NKJV, KJV

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
    // Set initial dropdown value from currentTranslation (CEB default)
    transSelect.value = currentTranslation;

    transSelect.addEventListener('change', (e) => {
      currentTranslation = e.target.value.toUpperCase();
      localStorage.setItem('leaf_translation', currentTranslation);

      // Re-fetch active column with the selected translation
      if (typeof setActiveColumn === 'function' && typeof activeColumn !== 'undefined') {
        setActiveColumn(activeColumn);
      } else {
        const data = ALL_DAYS[currentDayIndex];
        if (data) fetchScripture(data.nt);
      }
    });
  }
});

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
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  }
  throw new Error("No verses returned from API");
}

// Fetch Scripture Passage strictly using the selected translation
async function fetchScripture(passageStr) {
  if (!scriptureContainer) return;
  if (loadingSpinner) loadingSpinner.classList.remove('hidden');
  scriptureContainer.innerHTML = '';

  try {
    const parsed = parsePassageString(passageStr);
    if (!parsed) throw new Error("Could not parse passage reference.");

    const bookId = BIBLE_BOOK_IDS[parsed.book];
    if (!bookId) throw new Error(`Book not recognized: ${parsed.book}`);

    let allVerses = [];
    
    // Fetch start chapter
    const startData = await fetchChapterData(currentTranslation, bookId, parsed.startChapter);
    allVerses = allVerses.concat(startData.map(v => ({ ...v, chapter: parsed.startChapter })));

    // Fetch subsequent chapters if the reading spans multiple chapters
    if (parsed.endChapter && parsed.endChapter > parsed.startChapter) {
      for (let ch = parsed.startChapter + 1; ch <= parsed.endChapter; ch++) {
        try {
          const extraData = await fetchChapterData(currentTranslation, bookId, ch);
          allVerses = allVerses.concat(extraData.map(v => ({ ...v, chapter: ch })));
        } catch (e) {
          console.warn(`Could not fetch chapter ${ch}:`, e);
        }
      }
    }

    renderScriptureVerses(allVerses, parsed);
  } catch (err) {
    console.warn("Scripture fetch error:", err);
    scriptureContainer.innerHTML = `
      <p class="placeholder-instruction" style="padding: 20px;">
        Unable to load text live for <strong>${passageStr}</strong> (${currentTranslation}).<br><br>
        <a href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(passageStr)}&version=${encodeURIComponent(currentTranslation)}&tab=insights" target="_blank" style="color: var(--primary); font-weight: bold; text-decoration: underline; font-size: 1.05rem;">
          Tap here to read ${passageStr} on Bible Gateway &rarr;
        </a>
      </p>
    `;
  } finally {
    if (loadingSpinner) loadingSpinner.classList.add('hidden');
  }
}

// Render Filtered Verses
function renderScriptureVerses(verses, parsed) {
  scriptureContainer.innerHTML = '';
  
  if (!verses || verses.length === 0) {
    scriptureContainer.innerHTML = `<p class="placeholder-instruction">No verses found for this reading.</p>`;
    return;
  }

  let renderedCount = 0;

  verses.forEach(v => {
    const verseNum = parseInt(v.verse, 10);
    const vChapter = v.chapter || parsed.startChapter;
    const text = cleanVerseText(v.text);

    let showVerse = true;

    // Apply verse range filtering if boundaries exist
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

      scriptureContainer.appendChild(p);
    }
  });

  // Safety fallback: if strict boundary filtering excluded all verses, show chapter text
  if (renderedCount === 0) {
    verses.forEach(v => {
      const p = document.createElement('div');
      p.className = 'scripture-verse';
      p.innerHTML = `<span class="verse-num">${v.chapter ? v.chapter + ':' : ''}${v.verse}</span><span> ${cleanVerseText(v.text)}</span>`;
      scriptureContainer.appendChild(p);
    });
  }
}

// Robust Passage Parser
function parsePassageString(str) {
  if (!str) return null;
  const cleanStr = str.trim();

  // Comma-separated blocks (e.g., "Psalms 11, 58-59")
  if (cleanStr.includes(',')) {
    const firstPart = cleanStr.split(',')[0].trim();
    if (/\d+/.test(firstPart)) {
      return parsePassageString(firstPart);
    }
  }

  // Single-chapter books (e.g., "2 John", "3 John", "Jude", "Obadiah", "Philemon")
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

  // Pattern 1: Cross-chapter verses (e.g., "Genesis 3:8-4:16", "Luke 1:67-2:7")
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

  // Pattern 2: Multi-chapter blocks (e.g., "Song of Songs 1-2", "Psalms 1-2")
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

  // Pattern 3: Standard chapter:verse (e.g., "Mark 1:1-28", "Romans 8:1-17")
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

  // Fallback for standalone book or single chapter
  const parts = cleanStr.split(' ');
  const chapter = parseInt(parts[parts.length - 1], 10) || 1;
  const book = parts.slice(0, parts.length - 1).join(' ') || cleanStr;
  return { book, startChapter: chapter, startVerse: null, endChapter: chapter, endVerse: null };
}
