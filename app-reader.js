// Step 3 (Upgraded): Robust Scripture Fetcher & Renderer: WEB, BBE, NKJV & KJV Translations with OT Support

const scriptureContainer = document.getElementById('scripture-content');
const loadingSpinner = document.getElementById('scripture-loading');

// Validated supported translations; defaults to WEB if none or invalid is stored
const SUPPORTED_TRANSLATIONS = ['WEB', 'BBE', 'NKJV', 'KJV'];
let currentTranslation = localStorage.getItem('leaf_translation') || 'WEB';
if (!SUPPORTED_TRANSLATIONS.includes(currentTranslation)) {
  currentTranslation = 'WEB';
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
      currentTranslation = e.target.value;
      localStorage.setItem('leaf_translation', currentTranslation);

      if (typeof setActiveColumn === 'function' && typeof activeColumn !== 'undefined') {
        setActiveColumn(activeColumn);
      } else {
        const data = ALL_DAYS[currentDayIndex];
        if (data) fetchScripture(data.nt);
      }
    });
  }
});

// Helper to fetch and cache a single chapter from the API safely
async function fetchChapterData(translation, bookId, chapter) {
  const transCode = translation.toLowerCase(); // Ensure lowercase for Bolls.life API
  const cacheKey = `${transCode}_id_${bookId}_${chapter}`;
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
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching chapter`);
  
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0) {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  }
  throw new Error("No verses returned from API");
}


// Fetch Scripture Passage with Robust Fallback for BBE and Multi-Chapter Spans
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
    
    try {
      const startData = await fetchChapterData(currentTranslation, bookId, parsed.startChapter);
      allVerses = allVerses.concat(startData.map(v => ({ ...v, chapter: parsed.startChapter })));

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
    } catch (primaryErr) {
      // BBE Fallback: if multi-chapter or specific range fails, try fetching just the base chapter
      if (currentTranslation === 'BBE' && parsed.startChapter) {
        console.warn("BBE multi-chapter fetch failed, attempting single chapter fallback:", primaryErr);
        const fallbackData = await fetchChapterData('BBE', bookId, parsed.startChapter);
        allVerses = fallbackData.map(v => ({ ...v, chapter: parsed.startChapter }));
      } else {
        throw primaryErr;
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
    const text = v.text;

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

      scriptureContainer.appendChild(p);
    }
  });

  if (renderedCount === 0) {
    verses.forEach(v => {
      const p = document.createElement('div');
      p.className = 'scripture-verse';
      p.innerHTML = `<span class="verse-num">${v.chapter ? v.chapter + ':' : ''}${v.verse}</span><span> ${v.text}</span>`;
      scriptureContainer.appendChild(p);
    });
  }
}

// Robust Passage Parser
function parsePassageString(str) {
  if (!str) return null;
  const cleanStr = str.trim();

  if (cleanStr.includes(',')) {
    const firstPart = cleanStr.split(',')[0].trim();
    if (/\d+/.test(firstPart)) {
      return parsePassageString(firstPart);
    }
  }

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
