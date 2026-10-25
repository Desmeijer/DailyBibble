// Robust Scripture Fetcher & Renderer: WEB & BBE Translations with OT Support

const scriptureContainer = document.getElementById('scripture-content');
const loadingSpinner = document.getElementById('scripture-loading');

let currentTranslation = localStorage.getItem('leaf_translation') || 'WEB';

const BIBLE_BOOK_IDS = {
  "Genesis": 1, "Exodus": 2, "Leviticus": 3, "Numbers": 4, "Deuteronomy": 5,
  "Joshua": 6, "Judges": 7, "Ruth": 8, "1 Samuel": 9, "2 Samuel": 10,
  "1 Kings": 11, "2 Kings": 12, "1 Chronicles": 13, "2 Chronicles": 14,
  "Ezra": 15, "Nehemiah": 16, "Esther": 17, "Job": 18, "Psalms": 19, "Psalm": 19,
  "Proverbs": 20, "Ecclesiastes": 21, "Song of Solomon": 22, "Isaiah": 23,
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

// Initialize Translation Button Listener
document.addEventListener('DOMContentLoaded', () => {
  const transBtn = document.getElementById('toggle-translation-btn');
  if (transBtn) {
    transBtn.textContent = `📖 Vers: ${currentTranslation}`;
    transBtn.addEventListener('click', () => {
      currentTranslation = (currentTranslation === 'WEB') ? 'BBE' : 'WEB';
      localStorage.setItem('leaf_translation', currentTranslation);
      transBtn.textContent = `📖 Vers: ${currentTranslation}`;
      
      // Reload current day's active column (NT, OT1, or OT2)
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
  const cacheKey = `${translation.toLowerCase()}_id_${bookId}_${chapter}`;
  let cached = null;
  try {
    cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
  } catch (e) {
    cached = null;
  }

  if (Array.isArray(cached) && cached.length > 0) {
    return cached;
  }

  const url = `https://bolls.life/get-text/${translation}/${bookId}/${chapter}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching chapter`);
  
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0) {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  }
  throw new Error("No verses returned from API");
}

// Fetch Scripture Passage (Supports single chapters, spans, and multi-chapters)
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
        <a href="https://www.bible.com/search/results?q=${encodeURIComponent(passageStr + ' ' + currentTranslation)}" target="_blank" style="color: var(--primary); font-weight: bold; text-decoration: underline; font-size: 1.05rem;">
          Tap here to read ${passageStr} on YouVersion &rarr;
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

    // Apply verse filtering when verse boundaries are specified
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

  // Safety fallback: if filtering excluded everything, show all fetched verses
  if (renderedCount === 0) {
    verses.forEach(v => {
      const p = document.createElement('div');
      p.className = 'scripture-verse';
      p.innerHTML = `<span class="verse-num">${v.chapter ? v.chapter + ':' : ''}${v.verse}</span><span> ${v.text}</span>`;
      scriptureContainer.appendChild(p);
    });
  }
}

// Passage Parser handling all plan string formats
function parsePassageString(str) {
  if (!str) return null;
  const cleanStr = str.trim();

  // Pattern 1: Cross-chapter verses like "Luke 1:67-2:7" or "Genesis 1:1-2:3"
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

  // Pattern 2: Multi-chapter blocks like "Genesis 1-2" or "Psalms 1-2"
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

  // Pattern 3: Standard chapter:verse like "Mark 1:1-28" or "Romans 8:1-17"
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

  // Fallback for single whole chapters or whole books
  const parts = cleanStr.split(' ');
  const chapter = parseInt(parts[parts.length - 1], 10) || 1;
  const book = parts.slice(0, parts.length - 1).join(' ') || cleanStr;
  return { book, startChapter: chapter, startVerse: null, endChapter: chapter, endVerse: null };
}
