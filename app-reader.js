// Step 6B (Advanced Multi-Chapter): WEB & BBE Support with Cross-Chapter Fetching

const scriptureContainer = document.getElementById('scripture-content');
const loadingSpinner = document.getElementById('scripture-loading');

let currentTranslation = localStorage.getItem('leaf_translation') || 'WEB';

const NT_BOOK_IDS = {
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


document.addEventListener('DOMContentLoaded', () => {
  const transBtn = document.getElementById('toggle-translation-btn');
  if (transBtn) {
    transBtn.textContent = `📖 Vers: ${currentTranslation}`;
    transBtn.addEventListener('click', () => {
      currentTranslation = (currentTranslation === 'WEB') ? 'BBE' : 'WEB';
      localStorage.setItem('leaf_translation', currentTranslation);
      transBtn.textContent = `📖 Vers: ${currentTranslation}`;
      
      const data = ALL_DAYS[currentDayIndex];
      if (data) fetchScripture(data.nt, isFullChapterView);
    });
  }

  const otBtn = document.getElementById('toggle-ot-btn');
  if (otBtn) {
    otBtn.addEventListener('click', () => {
      isOtVisible = !isOtVisible;
      const otBox = document.getElementById('ot-parallels-box');
      if (isOtVisible) {
        otBox.classList.remove('hidden');
        otBtn.textContent = "Hide OT Parallels";
      } else {
        otBox.classList.add('hidden');
        otBtn.textContent = "📜 View OT Parallels";
      }
    });
  }

  const fullChapBtn = document.getElementById('toggle-full-chapter-btn');
  if (fullChapBtn) {
    fullChapBtn.addEventListener('click', () => {
      isFullChapterView = !isFullChapterView;
      const data = ALL_DAYS[currentDayIndex];
      if (isFullChapterView) {
        fullChapBtn.textContent = "⚡ Show Assigned Verses Only";
        fetchScripture(data.nt, true);
      } else {
        fullChapBtn.textContent = "📖 Read Full Chapter";
        fetchScripture(data.nt, false);
      }
    });
  }
});

// Advanced Fetcher handling single and multi-chapter passages
async function fetchScripture(passageStr, fullChapter) {
  loadingSpinner.classList.remove('hidden');
  scriptureContainer.innerHTML = '';

  try {
    const parsed = parsePassageString(passageStr);
    if (!parsed) throw new Error("Could not parse passage format.");

    const { book, startChapter, endChapter } = parsed;
    const bookId = NT_BOOK_IDS[book];
    
    if (!bookId) throw new Error(`Unknown book: ${book}`);

    // Fetch start chapter
    let allVerses = [];
    const startCacheKey = `${currentTranslation.toLowerCase()}_id_${bookId}_${startChapter}`;
    let startData = JSON.parse(localStorage.getItem(startCacheKey) || 'null');

    if (!startData) {
      const res = await fetch(`https://bolls.life/get-text/${currentTranslation}/${bookId}/${startChapter}/`);
      if (!res.ok) throw new Error("Network error on start chapter");
      startData = await res.json();
      localStorage.setItem(startCacheKey, JSON.stringify(startData));
    }
    allVerses = allVerses.concat(startData.map(v => ({ ...v, chapter: startChapter })));

    // If passage spans to a second chapter (e.g., Luke 1:67-2:7)
    if (endChapter && endChapter > startChapter) {
      const endCacheKey = `${currentTranslation.toLowerCase()}_id_${bookId}_${endChapter}`;
      let endData = JSON.parse(localStorage.getItem(endCacheKey) || 'null');

      if (!endData) {
        const res2 = await fetch(`https://bolls.life/get-text/${currentTranslation}/${bookId}/${endChapter}/`);
        if (res2.ok) {
          endData = await res2.json();
          localStorage.setItem(endCacheKey, JSON.stringify(endData));
        }
      }
      if (endData) {
        allVerses = allVerses.concat(endData.map(v => ({ ...v, chapter: endChapter })));
      }
    }

    renderScriptureVerses(allVerses, parsed, fullChapter);
  } catch (err) {
    console.warn("API fetch error:", err);
    scriptureContainer.innerHTML = `
      <p class="placeholder-instruction" style="padding: 20px;">
        Unable to load text live for <strong>${passageStr}</strong>.<br><br>
        <a href="https://www.bible.com/search/results?q=${encodeURIComponent(passageStr + ' ' + currentTranslation)}" target="_blank" style="color: var(--primary); font-weight: bold; text-decoration: underline; font-size: 1.05rem;">
          Tap here to read ${passageStr} on YouVersion &rarr;
        </a>
      </p>
    `;
  } finally {
    loadingSpinner.classList.add('hidden');
  }
}

function renderScriptureVerses(verses, parsed, fullChapter) {
  scriptureContainer.innerHTML = '';
  
  if (!verses || verses.length === 0) {
    scriptureContainer.innerHTML = `<p class="placeholder-instruction">No verses found for this passage.</p>`;
    return;
  }

  verses.forEach(v => {
    const verseNum = parseInt(v.verse);
    const vChapter = v.chapter || parsed.startChapter;
    const text = v.text;

    let showVerse = true;
    if (!fullChapter && parsed.startVerse !== null && parsed.endVerse !== null) {
      if (parsed.startChapter === parsed.endChapter) {
        showVerse = (vChapter === parsed.startChapter && verseNum >= parsed.startVerse && verseNum <= parsed.endVerse);
      } else {
        // Cross-chapter range filtering
        if (vChapter === parsed.startChapter) {
          showVerse = (verseNum >= parsed.startVerse);
        } else if (vChapter === parsed.endChapter) {
          showVerse = (verseNum <= parsed.endVerse);
        } else {
          showVerse = (vChapter > parsed.startChapter && vChapter < parsed.endChapter);
        }
      }
    }

    if (showVerse || fullChapter) {
      const p = document.createElement('div');
      p.className = 'scripture-verse';

      const spanNum = document.createElement('span');
      spanNum.className = 'verse-num';
      spanNum.textContent = `${vChapter !== parsed.startChapter ? vChapter + ':' : ''}${verseNum}`;
      p.appendChild(spanNum);

      const spanText = document.createElement('span');
      spanText.innerHTML = text;

      if (fullChapter && parsed.startVerse !== null && parsed.endVerse !== null) {
        let inHighlight = false;
        if (parsed.startChapter === parsed.endChapter) {
          inHighlight = (vChapter === parsed.startChapter && verseNum >= parsed.startVerse && verseNum <= parsed.endVerse);
        } else {
          if (vChapter === parsed.startChapter && verseNum >= parsed.startVerse) inHighlight = true;
          if (vChapter === parsed.endChapter && verseNum <= parsed.endVerse) inHighlight = true;
          if (vChapter > parsed.startChapter && vChapter < parsed.endChapter) inHighlight = true;
        }
        if (inHighlight) {
          spanText.className = 'highlight-verse';
        }
      }

      p.appendChild(spanText);
      scriptureContainer.appendChild(p);
    }
  });

  if (scriptureContainer.children.length === 0) {
    verses.forEach(v => {
      const p = document.createElement('div');
      p.className = 'scripture-verse';
      p.innerHTML = `<span class="verse-num">${v.verse}</span><span>${v.text}</span>`;
      scriptureContainer.appendChild(p);
    });
  }
}

// Robust Parser supporting single chapters, verse ranges, and cross-chapter spans
function parsePassageString(str) {
  const cleanStr = str.trim();
  
  // Match formats like "Luke 1:67-2:7", "Mark 1:1-28", "1 Peter 1", "Romans 1:1-3:8"
  const complexMatch = cleanStr.match(/^([1-3]?\s?[A-Za-z\s]+?)\s+(\d+):(\d+)-(\d+):(\d+)$/);
  if (complexMatch) {
    return {
      book: complexMatch[1].trim(),
      startChapter: parseInt(complexMatch[2]),
      startVerse: parseInt(complexMatch[3]),
      endChapter: parseInt(complexMatch[4]),
      endVerse: parseInt(complexMatch[5])
    };
  }

  const standardMatch = cleanStr.match(/^([1-3]?\s?[A-Za-z\s]+?)\s+(\d+)(?::(\d+))?(?:-(\d+))?$/);
  if (standardMatch) {
    const book = standardMatch[1].trim();
    const startChapter = parseInt(standardMatch[2]);
    const startVerse = standardMatch[3] ? parseInt(standardMatch[3]) : null;
    const endVerse = standardMatch[4] ? parseInt(standardMatch[4]) : null;
    return {
      book,
      startChapter,
      startVerse,
      endChapter: startChapter,
      endVerse: endVerse !== null ? endVerse : startVerse
    };
  }

  // Fallback for whole books
  const parts = cleanStr.split(' ');
  const chapter = parseInt(parts[parts.length - 1]) || 1;
  const book = parts.slice(0, parts.length - 1).join(' ') || cleanStr;
  return { book, startChapter: chapter, startVerse: null, endChapter: chapter, endVerse: null };
}
// Helper to generate a direct Enduring Word commentary link from passage string
function getEnduringWordUrl(passageStr) {
  if (!passageStr) return "https://enduringword.com/";
  // Clean up passage string (e.g., "Mark 1:1-28" -> "mark/chapter-1/")
  const parts = passageStr.split(" ")[0].toLowerCase();
  const match = passageStr.match(/\d+/);
  const chapter = match ? match[0] : "1";
  return `https://enduringword.com/bible-commentary/${parts}-${chapter}/`;
}

