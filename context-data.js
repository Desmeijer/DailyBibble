// Step 3 (Upgraded): 66-Book Structured AI Overview Dataset & 5-Lens Renderer
// Complete Edition: Old & New Testaments (66 Books + Aliases) + Dynamic Renderer

window.BIBLE_AI_OVERVIEWS = {
  // ==================== OLD TESTAMENT (39 Books) ====================
  "Genesis": {
    chapters: 50,
    authorDate: "Traditionally attributed to Moses (c. 15th–13th century BCE); scholarly consensus views it as compiled from earlier oral and written traditions reaching final form in the 6th–5th century BCE.",
    audience: "Ancient Israel seeking to understand their origins, identity, and covenantal relationship with God amidst surrounding Near Eastern cultures.",
    setting: "Spans primeval history (Creation, Flood, Babel) and the patriarchal era across Mesopotamia, Canaan, and Egypt.",
    themes: "Creation, human rebellion, divine sovereignty, and God's covenant promises through Abraham, Isaac, Jacob, and Joseph.",
    reflection: "How does God's faithfulness in this passage contrast with human imperfection or short-sightedness?"
  },
  "Exodus": {
    chapters: 40,
    authorDate: "Traditionally attributed to Moses; critical scholarship dates its final literary compilation to the exilic or post-exilic period (6th–5th century BCE).",
    audience: "The community of Israel, reminding them of their deliverance from slavery and the foundation of the Sinai covenant.",
    setting: "Egypt during Israel's bondage, the wilderness of the Sinai Peninsula, and Mount Sinai.",
    themes: "Redemption from oppression, the revelation of God's name (YHWH), covenant law, and God's dwelling presence in the Tabernacle.",
    reflection: "What does this passage reveal about how deliverance leads to a new way of living and worshiping?"
  },
  "Leviticus": {
    chapters: 27,
    authorDate: "Traditionally attributed to Moses; scholarly consensus associates it with the Priestly tradition compiled during the 6th–5th century BCE.",
    audience: "Israelite priests (Levites) and the wider congregation learning how to live in proximity to a holy God.",
    setting: "Encamped at the foot of Mount Sinai immediately following the construction of the Tabernacle.",
    themes: "Holiness, sacrifice, atonement, ritual purity, and ethical responsibility toward neighbors.",
    reflection: "What principle of holiness, gratitude, or justice lies beneath the ritual instructions in these verses?"
  },
  "Numbers": {
    chapters: 36,
    authorDate: "Traditionally attributed to Moses; modern scholarship views it as a combination of Priestly and earlier historical sources edited in the 6th–5th century BCE.",
    audience: "Israelite generations reflecting on the consequences of unbelief and God's preservation through wilderness testing.",
    setting: "The 40-year journey from Mount Sinai through the wilderness of Paran to the plains of Moab on the border of Canaan.",
    themes: "Census and organization, rebellion and grumbling, divine patience, discipline, and generational transition.",
    reflection: "Where do you see the tension between fear of the unknown and trust in God's provision in this reading?"
  },
  "Deuteronomy": {
    chapters: 34,
    authorDate: "Presented as Moses' farewell speeches; scholarship links its core to the 7th-century BCE reforms of King Josiah with final editing during the exile.",
    audience: "A new generation of Israelites poised to enter Canaan, called to renew the covenant their parents broke.",
    setting: "The plains of Moab east of the Jordan River, at the end of the 40-year wilderness wandering.",
    themes: "Wholehearted love for God (the Shema), covenant loyalty, blessings and curses, and remembering God's past faithfulness.",
    reflection: "Why is remembering past history so essential to remaining faithful in new seasons of life?"
  },
  "Joshua": {
    chapters: 24,
    authorDate: "Traditionally associated with Joshua; scholarly consensus places its composition within the Deuteronomistic History (7th–6th century BCE).",
    audience: "Israelites reflecting on the fulfillment of the land promise and the requirement of covenant obedience.",
    setting: "The crossing of the Jordan River and the settlement and tribal division of the land of Canaan.",
    themes: "God's faithfulness to His promises, courage, leadership transition, and the call to exclusive allegiance to the Lord.",
    reflection: "How does this passage connect courage and obedience to trusting what God has already promised?"
  },
  "Judges": {
    chapters: 21,
    authorDate: "Anonymous; traditionally linked to Samuel, while scholarship places it in the Deuteronomistic History (7th–6th century BCE).",
    audience: "Israelites examining the moral and political chaos of the pre-monarchic era when 'everyone did what was right in their own eyes.'",
    setting: "Canaan during the turbulent centuries between the death of Joshua and the rise of the monarchy.",
    themes: "The recurring cycle of apostasy, oppression, crying out, and deliverance through flawed leaders (judges).",
    reflection: "What warning does this narrative offer about gradual compromise and forgetting spiritual foundations?"
  },
  "Ruth": {
    chapters: 4,
    authorDate: "Anonymous; dated variously by scholars between the reign of David (10th century BCE) and the post-exilic period (5th century BCE).",
    audience: "Israelites needing a portrait of loyal love (hesed), inclusion of the outsider, and the lineage of King David.",
    setting: "Moab and Bethlehem during a time of famine in the era of the Judges.",
    themes: "Loyal loving-kindness (hesed), redemption (the kinsman-redeemer), providence in ordinary life, and inclusion of foreigners.",
    reflection: "How does God work quietly through ordinary acts of loyalty and kindness in this chapter?"
  },
  "1 Samuel": {
    chapters: 31,
    authorDate: "Anonymous compilation drawing on prophetic records (Samuel, Nathan, Gad); part of the Deuteronomistic History (7th–6th century BCE).",
    audience: "Israel evaluating the transition from tribal leadership to monarchy and what defines a true king under God.",
    setting: "The central hill country of Israel during the Philistine crisis (c. 11th–10th century BCE).",
    themes: "God's kingship vs. human kingship, the fall of Eli and Saul, and the rise and testing of David ('a man after God's own heart').",
    reflection: "How does this passage contrast outward appearance or power with the posture of a person's heart?"
  },
  "2 Samuel": {
    chapters: 24,
    authorDate: "Anonymous; originally a single scroll with 1 Samuel, compiled within the Deuteronomistic History (7th–6th century BCE).",
    audience: "Israel reflecting on the triumphs, eternal covenant promise, and tragic moral failures of King David's reign.",
    setting: "Hebron and Jerusalem during the 40-year reign of King David (c. 1010–970 BCE).",
    themes: "The Davidic Covenant (ch. 7), grace, the devastating consequences of sin and abuse of power, and repentance.",
    reflection: "What does this reading show about the real-world consequences of leadership choices, both faithful and flawed?"
  },
  "1 Kings": {
    chapters: 22,
    authorDate: "Anonymous; compiled from royal annals within the Deuteronomistic History during the Babylonian exile (6th century BCE).",
    audience: "Exiled Israelites asking how the glorious kingdom of Solomon fractured and eventually collapsed.",
    setting: "Jerusalem and the divided kingdoms of Israel (North) and Judah (South) from c. 970 to 850 BCE.",
    themes: "Wisdom and temple building, royal idolatry, the division of the kingdom, and the prophetic ministry of Elijah.",
    reflection: "Where do you see the difference between undivided devotion and divided loyalties in this passage?"
  },
  "2 Kings": {
    chapters: 25,
    authorDate: "Anonymous; continuation of 1 Kings, completed during the Babylonian exile (after 561 BCE).",
    audience: "Judahites in Babylonian exile grappling with the destruction of Samaria (722 BCE) and Jerusalem (586 BCE).",
    setting: "The Northern Kingdom of Israel and Southern Kingdom of Judah down to the Babylonian captivity.",
    themes: "Prophetic warnings (Elisha and later prophets), brief revivals under Hezekiah and Josiah, persistent idolatry, and judgment.",
    reflection: "How do the leaders or people in this text respond when confronted with uncomfortable truth?"
  },
  "1 Chronicles": {
    chapters: 29,
    authorDate: "Traditionally attributed to Ezra ('the Chronicler'); dated by scholars to the post-exilic Persian period (c. 450–350 BCE).",
    audience: "Returned exiles in Yehud (Judah) needing to reconnect with their heritage, temple worship, and Davidic hope.",
    setting: "Reviews history from Adam through the death of King David, written from the perspective of post-exilic Jerusalem.",
    themes: "Continuity of God's people through genealogies, proper Temple worship, the priesthood, and the idealized legacy of David.",
    reflection: "Why does the author emphasize worship, prayer, and continuity with the past in this section?"
  },
  "2 Chronicles": {
    chapters: 36,
    authorDate: "Compiled by the Chronicler alongside 1 Chronicles in the post-exilic Persian period (c. 450–350 BCE).",
    audience: "The post-exilic community rebuilding their identity around the Second Temple and seeking spiritual renewal.",
    setting: "Focuses exclusively on the Southern Kingdom of Judah from Solomon's temple construction to Cyrus's decree of return (538 BCE).",
    themes: "The centrality of the Temple, humbling oneself in prayer (7:14), reform, and hope beyond exile.",
    reflection: "What connection does this passage draw between humility, seeking God, and restoration?"
  },
  "Ezra": {
    chapters: 10,
    authorDate: "Compiled using Ezra's first-person memoirs and official Persian Aramaic documents (c. 450–350 BCE).",
    audience: "Post-exilic Jews re-establishing worship and Torah observance in a fragile, rebuilt Jerusalem.",
    setting: "Jerusalem during the returns from Babylon under Zerubbabel (538 BCE) and Ezra (458 BCE) under Persian rule.",
    themes: "God's sovereignty over foreign rulers, rebuilding the altar and Temple, and spiritual renewal through the Law.",
    reflection: "What challenges arise when rebuilding something broken, and how do the people respond here?"
  },
  "Nehemiah": {
    chapters: 13,
    authorDate: "Draws heavily on Nehemiah's personal memoirs, combined with Ezra in the late 5th or 4th century BCE.",
    audience: "The post-exilic community in Judah learning to combine prayerful dependence with practical action and reform.",
    setting: "Jerusalem starting in 445 BCE during the reign of Persian King Artaxerxes I.",
    themes: "Rebuilding Jerusalem's walls despite opposition, social justice for the poor, public reading of Scripture, and covenant renewal.",
    reflection: "How does this passage model combining earnest prayer with practical, organized action?"
  },
  "Esther": {
    chapters: 10,
    authorDate: "Anonymous; composed in the Persian or early Hellenistic period (c. 4th century BCE).",
    audience: "Jewish communities living in the Diaspora (outside the homeland) facing hostility and assimilation pressures.",
    setting: "The royal palace of Susa in Persia during the reign of Xerxes I (Ahasuerus, 486–465 BCE).",
    themes: "God's hidden providence (God's name is never explicitly mentioned), courage ('for such a time as this'), and the origin of Purim.",
    reflection: "Where can you trace quiet providence or the call to courageous action in your own circumstances?"
  },
  "Job": {
    chapters: 42,
    authorDate: "Anonymous wisdom text; date of composition is unknown, with scholarly estimates ranging from the 7th to 4th century BCE.",
    audience: "Readers wrestling with innocent suffering and the limits of simplistic 'prosperity-for-obedience' theology.",
    setting: "The patriarchal-style land of Uz, outside the covenantal setting of Israel.",
    themes: "Undeserved suffering, the inadequacy of human explanations for pain, the sovereignty of the Creator, and honest lament.",
    reflection: "How does this passage challenge simplistic assumptions about why people experience hardship?"
  },
  "Psalms": {
    chapters: 150,
    authorDate: "A collection composed over centuries by David, Asaph, the Sons of Korah, Solomon, Moses, and anonymous poets; finalized post-exile (c. 5th–4th century BCE).",
    audience: "The worshipping community of Israel and individuals bringing every human emotion before God.",
    setting: "Used in ancient Temple liturgy, pilgrimage festivals, royal ceremonies, and personal devotion.",
    themes: "Praise, raw lament, thanksgiving, wisdom, trust in God's unfailing love (hesed), and royal/messianic hope.",
    reflection: "What specific emotion—gratitude, grief, awe, or plea for help—is this Psalm teaching you to express honestly?"
  },
  "Proverbs": {
    chapters: 31,
    authorDate: "Attributed primarily to Solomon, along with the 'wise,' Agur, and Lemuel; edited into its final form between the 8th and 5th centuries BCE.",
    audience: "Young people and all seekers learning practical skill in living (hokmah) within family, work, and community.",
    setting: "Royal courts and family households of ancient Israel.",
    themes: "The fear of the Lord as the beginning of wisdom, speech ethics, diligence, integrity, humility, and folly vs. wisdom.",
    reflection: "Which practical insight in these verses speaks most directly to your daily habits, words, or relationships?"
  },
  "Ecclesiastes": {
    chapters: 12,
    authorDate: "Written from the persona of Qoheleth ('the Teacher/Preacher'), son of David; many scholars date its Hebrew style to the 4th–3rd century BCE.",
    audience: "Thinkers confronting the brevity, unpredictability, and apparent enigmas (hevel—'vapor/breath') of life 'under the sun.'",
    setting: "A reflective wisdom school or court setting examining wealth, labor, pleasure, and mortality.",
    themes: "The fleeting nature of earthly pursuits, the limits of human control, enjoying simple daily gifts, and revering God.",
    reflection: "How does recognizing the brevity of life shift what you value or stress over today?"
  },
  "Song of Solomon": {
    chapters: 8,
    authorDate: "Traditionally associated with Solomon (10th century BCE); linguistic scholarship suggests a later compilation or editing (up to the post-exilic period).",
    audience: "Israelite readers celebrating the beauty, mutuality, and strength of romantic and marital love within creation.",
    setting: "Pastoral landscapes, vineyards, and royal gardens across Israel and Jerusalem.",
    themes: "The goodness of love, mutual delight, faithfulness, and (in later Jewish and Christian tradition) an allegory of divine love.",
    reflection: "What does this poetic imagery celebrate about devotion, beauty, and mutual commitment?"
  },
  "Isaiah": {
    chapters: 66,
    authorDate: "Isaiah son of Amoz prophesied c. 740–700 BCE (chs. 1–39); many scholars attribute chs. 40–66 to exilic and post-exilic contexts, while tradition views it as a unified work.",
    audience: "Judah during the Assyrian crisis, and later the exiled and returning community in Babylon and Jerusalem.",
    setting: "Jerusalem under Kings Uzziah, Jotham, Ahaz, and Hezekiah, looking ahead to Babylonian exile and ultimate restoration.",
    themes: "The 'Holy One of Israel,' judgment on pride and injustice, comfort for the exiled, the Suffering Servant, and new creation.",
    reflection: "How does this passage hold together both the seriousness of human failure and the grandeur of God's restoration?"
  },
  "Jeremiah": {
    chapters: 52,
    authorDate: "Jeremiah of Anathoth, compiled with his scribe Baruch (c. 627–580 BCE).",
    audience: "The people of Judah ignoring warnings of impending collapse, and later the survivors in exile.",
    setting: "Jerusalem during the final four decades before its destruction by Babylon in 586 BCE, ending in Egypt.",
    themes: "The cost of false religion, the 'weeping prophet's' personal anguish, judgment via Babylon, and the promise of a New Covenant written on the heart (ch. 31).",
    reflection: "What does Jeremiah's perseverance teach about speaking or living out truth when it is unpopular?"
  },
  "Lamentations": {
    chapters: 5,
    authorDate: "Traditionally attributed to Jeremiah; anonymous acrostic poems composed shortly after 586 BCE.",
    audience: "Traumatized survivors mourning the siege, starvation, and destruction of Jerusalem and Solomon's Temple.",
    setting: "The ruins of Jerusalem immediately following the Babylonian conquest in 586 BCE.",
    themes: "Unfiltered grief over catastrophe, confession of national sin, and a central anchor of hope in God's mercies (3:22–23).",
    reflection: "How do these verses show that deep grief and enduring hope can exist together in prayer?"
  },
  "Ezekiel": {
    chapters: 48,
    authorDate: "Ezekiel, a priest deported to Babylon; prophesied between 593 and 571 BCE.",
    audience: "Jewish exiles in Babylon who initially believed Jerusalem could never fall, and later despaired after it fell.",
    setting: "By the Kebar River canal in Babylonia among the first wave of captives deported in 597 BCE.",
    themes: "The mobile glory of God, individual moral responsibility, judgment on Jerusalem and the nations, the Valley of Dry Bones, and a renewed Temple.",
    reflection: "What symbol or image in this reading illustrates God's power to bring life out of seemingly dead situations?"
  },
  "Daniel": {
    chapters: 12,
    authorDate: "Set during the 6th-century BCE exile of Daniel; traditional dating is 6th century BCE, while critical scholarship dates the final book to the 2nd century BCE.",
    audience: "Believers living under foreign imperial rule, tempted to compromise their identity or lose hope under persecution.",
    setting: "The royal courts of Babylon and Medo-Persia, followed by apocalyptic visions of future empires.",
    themes: "Uncompromising faithfulness in exile, God's sovereignty over earthly kingdoms, and the ultimate triumph of the 'Son of Man.'",
    reflection: "How can a person maintain integrity and calm confidence while living in a culture with conflicting values?"
  },
  "Hosea": {
    chapters: 14,
    authorDate: "Hosea son of Beeri (c. 755–722 BCE).",
    audience: "The prosperous but spiritually unfaithful Northern Kingdom of Israel prior to the Assyrian conquest.",
    setting: "The Northern Kingdom during the reign of Jeroboam II and the chaotic final years before Samaria fell in 722 BCE.",
    themes: "Israel's idolatry portrayed as spiritual adultery, mirrored in Hosea's marriage to Gomer, and God's relentless, redeeming love.",
    reflection: "What does the metaphor in this passage reveal about the heartache and persistence of divine love?"
  },
  "Joel": {
    chapters: 3,
    authorDate: "Joel son of Pethuel; exact date is uncertain (estimates range from the 9th to the 4th century BCE).",
    audience: "The people and priests of Judah devastated by a catastrophic locust plague and drought.",
    setting: "Jerusalem and Judah in the wake of an agricultural and economic disaster.",
    themes: "A call to genuine heart-repentance ('rend your hearts and not your garments'), the Day of the Lord, and the outpouring of God's Spirit on all people.",
    reflection: "How can a sudden crisis serve as a wake-up call to re-examine our priorities?"
  },
  "Amos": {
    chapters: 9,
    authorDate: "Amos, a Judean shepherd and fig-tree dresser from Tekoa (c. 760–750 BCE).",
    audience: "The wealthy elite of the Northern Kingdom (Israel) who combined lavish religious festivals with exploitation of the poor.",
    setting: "Bethel and Samaria during a period of peak economic prosperity and military security under Jeroboam II.",
    themes: "Social justice ('let justice roll down like waters'), the hypocrisy of worship without ethics, and accountability before God.",
    reflection: "How does this passage connect authentic faith with how we treat the vulnerable and disadvantaged?"
  },
  "Obadiah": {
    chapters: 1,
    authorDate: "Obadiah; most likely composed shortly after the Babylonian destruction of Jerusalem (post-586 BCE).",
    audience: "Judahites betrayed by their neighboring relatives, the Edomites, who gloated over and looted Jerusalem during its fall.",
    setting: "The aftermath of Jerusalem's fall, addressing the mountain stronghold of Edom (descendants of Esau).",
    themes: "Judgment on arrogance and betrayal of family/neighbors, the principle of moral retribution, and God's ultimate kingdom.",
    reflection: "Why is gloating over another's downfall or standing aloof in their distress so destructive?"
  },
  "Jonah": {
    chapters: 4,
    authorDate: "Anonymous narrative about the 8th-century BCE prophet Jonah son of Amittai (2 Kings 14:25); composed between the 8th and 4th centuries BCE.",
    audience: "Israelites tempted toward narrow nationalism and reluctant to believe God cares for their worst enemies.",
    setting: "Joppa, the Mediterranean Sea, and Nineveh, capital of the brutal Assyrian Empire.",
    themes: "God's sovereign compassion extending to all nations and creatures, contrasted with the prophet's stubborn resentment.",
    reflection: "In what ways does God's mercy in this story challenge our own boundaries of who deserves grace?"
  },
  "Micah": {
    chapters: 7,
    authorDate: "Micah of Moresheth, a contemporary of Isaiah (c. 735–700 BCE).",
    audience: "Corrupt rulers, false prophets, and citizens in both Samaria (Israel) and Jerusalem (Judah).",
    setting: "A rural Judean town watching the Assyrian threat advance and wealthy landowners seize peasant farms.",
    themes: "Judgment on corrupt leadership, the famous summary of true religion—'to do justice, love kindness, and walk humbly' (6:8)—and the ruler from Bethlehem.",
    reflection: "What does 'doing justice, loving kindness, and walking humbly' look like in your concrete responsibilities today?"
  },
  "Nahum": {
    chapters: 3,
    authorDate: "Nahum of Elkosh; composed between the fall of Thebes (663 BCE) and the fall of Nineveh (612 BCE).",
    audience: "Oppressed Judahites longing to know whether the brutal Assyrian superpower would ever be held accountable.",
    setting: "Judah looking toward Nineveh, the fortified capital of the Assyrian Empire, just before its collapse.",
    themes: "God as a refuge for the oppressed and an avenger against systemic cruelty, violence, and imperial arrogance.",
    reflection: "How does knowing that tyranny and cruelty do not have the final word bring comfort to the oppressed?"
  },
  "Habakkuk": {
    chapters: 3,
    authorDate: "Habakkuk; composed in the late 7th century BCE (c. 609–598 BCE) as Babylonian power rose.",
    audience: "Believers in Judah perplexed by unchecked injustice at home and terrified that God would use an even more ruthless empire (Babylon) as judgment.",
    setting: "Jerusalem on the eve of the first Babylonian invasions.",
    themes: "Wrestling honestly with God over the problem of evil, living by faith ('the righteous shall live by his faith'), and rejoicing in God even when resources fail.",
    reflection: "What does it look like to bring your hardest 'Why?' questions directly to God while choosing to trust Him?"
  },
  "Zephaniah": {
    chapters: 3,
    authorDate: "Zephaniah, a great-great-grandson of King Hezekiah, during the reign of King Josiah (c. 640–609 BCE).",
    audience: "Citizens of Judah steeped in syncretism (mixing worship of YHWH with pagan deities) and moral complacency.",
    setting: "Jerusalem prior to or during King Josiah's religious reforms.",
    themes: "The sweeping judgment of the 'Day of the Lord,' purifying a humble remnant, and God rejoicing over His people with singing (3:17).",
    reflection: "Where might complacency—assuming 'God will not do good, nor will He do ill'—creep into daily life?"
  },
  "Haggai": {
    chapters: 2,
    authorDate: "Haggai; four dated prophetic messages delivered between August and December of 520 BCE.",
    audience: "Returned Jewish exiles who had abandoned rebuilding the Temple for 16 years while focusing on their own paneled houses.",
    setting: "Post-exilic Jerusalem under Governor Zerubbabel and High Priest Joshua during the reign of Darius I of Persia.",
    themes: "Reordering misplaced priorities, overcoming discouragement when new beginnings look small, and God's presence ('I am with you').",
    reflection: "Have practical comforts or busyness crowded out deeper spiritual priorities in your schedule?"
  },
  "Zechariah": {
    chapters: 14,
    authorDate: "Zechariah son of Berechiah, beginning in 520–518 BCE (chs. 1–8); chs. 9–14 are dated by many scholars to a later post-exilic period.",
    audience: "A small, discouraged post-exilic community needing visionary hope beyond the immediate task of laying bricks.",
    setting: "Post-exilic Jerusalem alongside Haggai, looking forward to future messianic restoration.",
    themes: "Night visions of God's purifying work, reliance on God's Spirit rather than human might (4:6), and the humble King riding on a donkey (9:9).",
    reflection: "Why do we need reminders that lasting transformation happens 'not by might, nor by power, but by My Spirit'?"
  },
  "Malachi": {
    chapters: 4,
    authorDate: "Malachi ('My Messenger'); composed in the Persian post-exilic period (c. 460–430 BCE).",
    audience: "A spiritually weary community in Jerusalem going through religious motions with half-hearted offerings, cynicism, and broken marriages.",
    setting: "Jerusalem several decades after the Second Temple was completed, when initial enthusiasm had faded into disillusionment.",
    themes: "Six disputations (Q&A dialogues) challenging spiritual apathy, faithfulness in marriage and giving, and the promise of a forerunner (Elijah) before the Lord's coming.",
    reflection: "Where is there a risk of offering 'leftover' energy or going through hollow routines in your commitments?"
  },

  // ==================== NEW TESTAMENT (27 Books) ====================
  "Matthew": {
    chapters: 28,
    authorDate: "Traditionally attributed to the Apostle Matthew (Levi); composed c. 50–70 CE.",
    audience: "Jewish-Christian believers demonstrating that Jesus is the promised Davidic Messiah and fulfillment of Hebrew Scripture.",
    setting: "Antioch or Judea during the formative decades of the early church prior to the fall of Jerusalem.",
    themes: "Jesus as the fulfillment of the Law and Prophets, the Sermon on the Mount, the Kingdom of Heaven, and the Great Commission.",
    reflection: "How does seeing Jesus as the supreme teacher and King shape how you apply His words today?"
  },
  "Mark": {
    chapters: 16,
    authorDate: "John Mark, companion of Peter; traditionally considered the earliest written Gospel (c. 55–65 CE).",
    audience: "Gentile believers in Rome undergoing persecution, emphasizing endurance and the suffering servant.",
    setting: "Rome or Syrian Antioch during the reign of Emperor Nero.",
    themes: "Fast-paced action, the 'Messianic Secret,' the centrality of the cross, and Jesus as the servant who gives His life as a ransom.",
    reflection: "What stands out to you about the urgency and dedication of Jesus in this narrative?"
  },
  "Luke": {
    chapters: 24,
    authorDate: "Luke the physician, companion of Paul; composed c. 60–80 CE.",
    audience: "Theophilus and broad Hellenistic/Gentile readers emphasizing Christ's universal compassion and historical accuracy.",
    setting: "Caesarea and Rome during Paul's imprisonments.",
    themes: "Joy, salvation for the marginalized and outcasts, the Holy Spirit, prayer, and Jesus as Savior of all nations.",
    reflection: "Who is brought into the circle of God's grace or attention in this passage?"
  },
  "John": {
    chapters: 21,
    authorDate: "John the Apostle ('the disciple whom Jesus loved'); composed c. 80–95 CE from Ephesus.",
    audience: "Believers and seekers facing emerging philosophical doubts, designed so readers may believe that Jesus is the Son of God.",
    setting: "Ephesus and the wider Greco-Roman world toward the close of the 1st century.",
    themes: "The deity of Christ (the Seven 'I AM' statements), eternal life, light vs. darkness, and deep abiding love.",
    reflection: "What does this passage reveal about the divine identity and personal warmth of Jesus?"
  },
  "Acts": {
    chapters: 28,
    authorDate: "Luke the physician, written as the companion volume to the Gospel of Luke (c. 60–80 CE).",
    audience: "The early Christian community tracing how the Gospel spread from Jerusalem to Judea, Samaria, and the ends of the earth.",
    setting: "The Mediterranean basin throughout the first three decades of the church (c. 30–62 CE).",
    themes: "The unstoppable power of the Holy Spirit, bold witness under persecution, cross-cultural inclusion, and missionary expansion.",
    reflection: "Where do you see the guidance or power of the Holy Spirit opening doors in this account?"
  },
  "Romans": {
    chapters: 16,
    authorDate: "The Apostle Paul, written from Corinth during his third missionary journey (c. 57–58 CE).",
    audience: "The multi-ethnic house churches in Rome who had not yet met Paul personally.",
    setting: "Corinth prior to Paul's final return voyage to Jerusalem.",
    themes: "Universal human sinfulness, justification by grace through faith alone, union with Christ, sanctification, and God's plan for Jew and Gentile.",
    reflection: "How does the reality of unearned grace change your standing before God and your posture toward others?"
  },
  "1 Corinthians": {
    chapters: 16,
    authorDate: "The Apostle Paul, written from Ephesus during his third journey (c. 53–54 CE).",
    audience: "A deeply fractured, culturally proud urban church in Corinth facing divisions, immorality, and confusion.",
    setting: "Ephesus, addressing reports brought from Corinth.",
    themes: "Church unity, the foolishness of the cross vs. worldly wisdom, spiritual gifts, the supremacy of love (ch. 13), and bodily resurrection.",
    reflection: "In what areas of community or church life is love most urgently needed to heal division today?"
  },
  "2 Corinthians": {
    chapters: 13,
    authorDate: "The Apostle Paul, written from Macedonia (c. 55–56 CE).",
    audience: "The Corinthian church after a painful visit and an intermediate letter, defending Paul's apostolic authority.",
    setting: "Macedonia during travel between Ephesus and Corinth.",
    themes: "Comfort in affliction, ministry as jars of clay, generous giving, reconciliation, and God's power made perfect in human weakness.",
    reflection: "How does knowing that God's strength shines in weakness encourage you in your own limitations?"
  },
  "Galatians": {
    chapters: 6,
    authorDate: "The Apostle Paul; dated by scholars either to an early southern Galatian mission (c. 48 CE) or northern Galatia (c. 55 CE).",
    audience: "Churches in Galatia targeted by Judaizers teaching that Gentile believers must adopt Jewish ritual law to be saved.",
    setting: "Antioch or Ephesus addressing a theological crisis of legalism.",
    themes: "Justification by faith alone, Christian freedom, the contrast between flesh and the fruit of the Spirit, and boasting only in the cross.",
    reflection: "Where do you find yourself slipping back into performing for approval rather than resting in grace?"
  },
  "Ephesians": {
    chapters: 6,
    authorDate: "The Apostle Paul, likely written from prison in Rome (c. 60–62 CE).",
    audience: "Believers in Ephesus and surrounding Asian cities, grounding them in cosmic spiritual realities.",
    setting: "Roman imprisonment.",
    themes: "Our spiritual identity in Christ, the mystery of the unified church (Jew and Gentile), walking worthy, and putting on the armor of God.",
    reflection: "How does remembering your spiritual identity in Christ equip you to stand firm against discouragement?"
  },
  "Philippians": {
    chapters: 4,
    authorDate: "The Apostle Paul, written from prison (likely Rome, c. 60–62 CE).",
    audience: "A beloved, generous church in Philippi facing external pressures and minor internal friction.",
    setting: "Roman imprisonment.",
    themes: "Rejoicing in all circumstances, the breathtaking humility and exaltation of Christ (the Carmen Christi in ch. 2), and contentment.",
    reflection: "What helps cultivate inner joy and gratitude even when circumstances are difficult?"
  },
  "Colossians": {
    chapters: 4,
    authorDate: "The Apostle Paul, written from prison alongside Tychicus and Onesimus (c. 60–62 CE).",
    audience: "The church in Colossae (and Laodicea) facing syncretistic false teachings blending mysticism with asceticism.",
    setting: "Roman imprisonment.",
    themes: "The absolute preeminence, supremacy, and sufficiency of Christ over all creation and philosophy; living out our new life in Him.",
    reflection: "In what specific area of your life or thinking is Christ calling you to claim supreme authority today?"
  },
  "1 Thessalonians": {
    chapters: 5,
    authorDate: "The Apostle Paul from Corinth, joined by Silas and Timothy (c. 50–51 CE).",
    audience: "A young, heavily persecuted Greek church in Thessalonica needing pastoral encouragement.",
    setting: "Corinth during Paul's second missionary journey.",
    themes: "Holiness, mutual love, persevering through suffering, and confident hope in the return of Christ.",
    reflection: "How does active hope in Christ's return bring stability and comfort during hard times?"
  },
  "2 Thessalonians": {
    chapters: 3,
    authorDate: "The Apostle Paul shortly after his first letter (c. 50–52 CE).",
    audience: "The Thessalonian church, addressing misunderstandings that the Day of the Lord had already arrived.",
    setting: "Corinth.",
    themes: "Perseverance under ongoing persecution, warning against idleness, and standing firm in apostolic teaching.",
    reflection: "How do we balance waiting expectantly for God's future with being faithful in daily work right now?"
  },
  "1 Timothy": {
    chapters: 6,
    authorDate: "The Apostle Paul, written to his delegate in Ephesus during a window between his Roman imprisonments (c. 62–64 CE).",
    audience: "Timothy, young pastor in Ephesus facing false teachers and disorganized worship.",
    setting: "Macedonia writing to Ephesus.",
    themes: "Sound doctrine, orderly church leadership (elders and deacons), guarding against greed, and fighting the good fight of faith.",
    reflection: "What does this text teach about maintaining integrity, truth, and godliness in leadership?"
  },
  "2 Timothy": {
    chapters: 4,
    authorDate: "The Apostle Paul's final known letter, written from a harsh Roman dungeon shortly before his execution (c. 66–67 CE).",
    audience: "Timothy, urging him to endure hardship, guard the deposit of faith, and visit Paul.",
    setting: "Mamertine Prison in Rome under Nero.",
    themes: "Courageous endurance, the inspiration and sufficiency of Scripture (3:16–17), finishing the race well, and passing the torch.",
    reflection: "What does Paul's fearless final testimony inspire in your own commitment to the faith?"
  },
  "Titus": {
    chapters: 3,
    authorDate: "The Apostle Paul, written between imprisonments (c. 62–64 CE).",
    audience: "Titus, left on the island of Crete to organize fledgling churches amidst a difficult cultural environment.",
    setting: "Written from Macedonia or Greece regarding the Cretan church.",
    themes: "Appointing qualified elders, sound doctrine producing good works, grace training us to renounce ungodliness, and kindness.",
    reflection: "How should sound theology naturally overflow into practical kindness and good deeds in daily life?"
  },
  "Philemon": {
    chapters: 1,
    authorDate: "The Apostle Paul, written from prison alongside Colossians (c. 60–62 CE).",
    audience: "Philemon, a Christian slaveholder in Colossae, regarding his runaway slave Onesimus.",
    setting: "Roman imprisonment.",
    themes: "Radical Christian reconciliation, forgiveness, brotherhood in Christ transcending social hierarchies, and voluntary love.",
    reflection: "Where is God inviting you to extend unexpected grace, reconciliation, or brotherhood to someone else?"
  },
  "Hebrews": {
    chapters: 13,
    authorDate: "Anonymous; written by an eloquent Jewish-Christian teacher before the destruction of the Temple in 70 CE (c. 64–68 CE).",
    audience: "Jewish-Christian believers tempted to drift back to traditional Judaism under pressure of persecution.",
    setting: "Unknown (possibly Italy or Rome), addressing believers weary in their faith.",
    themes: "The absolute superiority of Jesus over angels, Moses, and the Levitical priesthood; Jesus as our ultimate High Priest and pioneer of faith.",
    reflection: "What encourages your heart most about having a heavenly High Priest who sympathizes with your weaknesses?"
  },
  "James": {
    chapters: 5,
    authorDate: "James, the half-brother of Jesus and leader of the Jerusalem church (c. 45–50 CE, likely the earliest New Testament book).",
    audience: "Scattered Jewish-Christian believers experiencing trials, economic exploitation, and internal friction.",
    setting: "Jerusalem church addressing the wider dispersed diaspora.",
    themes: "Trials as testing of faith, living out active deeds (faith without works is dead), taming the tongue, patience, and prayer.",
    reflection: "How does this practical letter challenge you to bridge the gap between what you believe and how you act?"
  },
  "1 Peter": {
    chapters: 5,
    authorDate: "The Apostle Peter, written from 'Babylon' (Rome) (c. 62–64 CE).",
    audience: "Believers scattered across Asia Minor facing mounting local hostility and social ostracism.",
    setting: "Rome ('Babylon') addressing Gentile and Jewish Christians in Asia Minor.",
    themes: "Living as 'aliens and exiles,' enduring unjust suffering by following Christ's example, holiness, and humble pastoral care.",
    reflection: "How does remembering your identity as a citizen of heaven help you navigate hostility or misunderstanding?"
  },
  "2 Peter": {
    chapters: 3,
    authorDate: "The Apostle Peter, written shortly before his martyrdom (c. 64–68 CE).",
    audience: "Believers warned against internal false teachers and scoffers mocking Christ's promised return.",
    setting: "Rome facing the twilight of the apostle's life.",
    themes: "Growing in Christian virtue, the reliability of prophetic and apostolic witness, and God's patient delay in judgment.",
    reflection: "What does God's patience toward humanity teach us about how we should live and treat others?"
  },
  "1 John": {
    chapters: 5,
    authorDate: "John the Apostle, written from Ephesus near the end of the 1st century (c. 85–95 CE).",
    audience: "Christian communities rattled by a schism where false teachers denied Christ's physical incarnation.",
    setting: "Ephesus combating early Gnostic/docetic heresy.",
    themes: "Fellowship with God in the light, testing spirits, the absolute non-negotiable of divine love, and assurance of eternal life.",
    reflection: "How does walking in the light and loving fellow believers practically guard your heart against deception?"
  },
  "2 John": {
    chapters: 1,
    authorDate: "John the Apostle ('the elder'), late 1st century (c. 85–95 CE).",
    audience: "'The elect lady and her children' (a local church), warning against hosting itinerant false teachers.",
    setting: "Ephesus.",
    themes: "Walking in truth and mutual love, and guarding against deceptive teachers who deny Christ's incarnation.",
    reflection: "How do truth and love work together as twin guardrails for Christian community?"
  },
  "3 John": {
    chapters: 1,
    authorDate: "John the Apostle ('the elder'), late 1st century (c. 85–95 CE).",
    audience: "Gaius, praising his hospitality to faithful traveling missionaries, contrasted with the dictatorial Diotrephes.",
    setting: "Ephesus.",
    themes: "Hospitality to traveling workers for the truth, imitating good rather than evil, and faithful witness.",
    reflection: "How can you practically encourage or support those who labor to share truth with others?"
  },
  "Jude": {
    chapters: 1,
    authorDate: "Jude, the brother of James and half-brother of Jesus (c. 65–80 CE).",
    audience: "Believers warned against ungodly intruders who had secretly slipped into the church perverting grace.",
    setting: "Palestinian or Syrian Jewish-Christian circles.",
    themes: "Contending earnestly for the historic Christian faith once for all delivered, keeping oneself in God's love, and rescuing others.",
    reflection: "What does it mean to contend for truth while remaining anchored in God's mercy and love?"
  },
  "Revelation": {
    chapters: 22,
    authorDate: "John the Apostle, written while exiled on the island of Patmos (c. 95–96 CE under Emperor Domitian).",
    audience: "Seven persecuted churches in Asia Minor facing pressure from Roman imperial cult worship.",
    setting: "Island of Patmos and the churches of Roman Asia.",
    themes: "The sovereign lordship of the risen Christ, worship of the Creator, cosmic victory over evil, perseverance, and the New Jerusalem.",
    reflection: "How does the breathtaking vision of Christ's ultimate victory give you courage for today's challenges?"
  }
};

// Map alternative book titles used in the reading plan dataset
window.BIBLE_AI_OVERVIEWS["Psalm"] = window.BIBLE_AI_OVERVIEWS["Psalms"];
window.BIBLE_AI_OVERVIEWS["Song of Songs"] = window.BIBLE_AI_OVERVIEWS["Song of Solomon"];

// ==================== 5-LENS DYNAMIC RENDERER ====================

// Helper to robustly extract book name from passage strings like "2 John", "Psalms 11, 58-59", or "Mark 1:1-28"
function extractBookName(passageStr) {
  if (!passageStr) return "";
  const clean = passageStr.trim();

  // Known single-chapter books that might confuse regex if they start with numbers
  if (clean.startsWith("2 John")) return "2 John";
  if (clean.startsWith("3 John")) return "3 John";
  if (clean.startsWith("Philemon")) return "Philemon";
  if (clean.startsWith("Obadiah")) return "Obadiah";
  if (clean.startsWith("Jude")) return "Jude";

  // Match standard book names up to the first digit or comma
  const match = clean.match(/^([1-3]?\s?[A-Za-z\s]+?)(?:\s+\d+|\s*,)/);
  if (match) {
    return match[1].trim();
  }
  
  // Fallback: strip numbers and punctuation from start/end
  const parts = clean.split(/\s+\d+/);
  return parts[0].trim();
}

// Generate the 5-lens structured AI passage overview HTML
function getContextNote(passageStr, activeColumn = 'NT', dayData = null) {
  if (!passageStr) return "<p>Select a reading to view its overview.</p>";

  const bookName = extractBookName(passageStr);
  const overview = window.BIBLE_AI_OVERVIEWS[bookName] || {
    chapters: 1,
    authorDate: "Historical composition details are traditional or general for this biblical writing.",
    audience: "Early believers and covenant readers receiving pastoral instruction.",
    setting: "Biblical historical and cultural context.",
    themes: "Faithfulness, redemption, and walking with God.",
    reflection: "How does this text encourage your faith and daily walk with God?"
  };

  // Determine structural position based on passage string chapters
  let positionDesc = `Reading from ${bookName}`;
  const chMatch = passageStr.match(/(\d+)(?::\d+)?(?:-(\d+)(?::\d+)?)?/);
  if (chMatch && overview.chapters) {
    const startCh = parseInt(chMatch[1], 10);
    const totalCh = overview.chapters;
    const pct = startCh / totalCh;
    
    if (totalCh === 1) {
      positionDesc = `${bookName} (Single Chapter Epistle/Prophecy)`;
    } else if (pct <= 0.25) {
      positionDesc = `${bookName} — Opening chapters (Ch. ${startCh} of ${totalCh})`;
    } else if (pct <= 0.75) {
      positionDesc = `${bookName} — Mid-book progression (Ch. ${startCh} of ${totalCh})`;
    } else {
      positionDesc = `${bookName} — Closing climax & themes (Ch. ${startCh} of ${totalCh})`;
    }
  }

  const colBadge = activeColumn === 'NT' ? 'New Testament' : (activeColumn === 'OT1' ? 'Early Old Testament' : 'Late Old Testament');

  return `
    <div class="ai-lens-grid">
      <div class="ai-lens-item">
        <span class="ai-lens-label">📖 Scope:</span> ${positionDesc} (${colBadge})
      </div>
      <div class="ai-lens-item">
        <span class="ai-lens-label">👤 Author & Date:</span> ${overview.authorDate}
      </div>
      <div class="ai-lens-item">
        <span class="ai-lens-label">🎯 Audience & Purpose:</span> ${overview.audience}
      </div>
      <div class="ai-lens-item">
        <span class="ai-lens-label">🏛️ Historical Setting:</span> ${overview.setting}
      </div>
      <div class="ai-lens-item">
        <span class="ai-lens-label">💡 Core Themes:</span> ${overview.themes}
      </div>
      <div class="ai-lens-item" style="margin-top: 4px; padding-top: 8px; border-top: 1px dashed rgba(154,125,10,0.3);">
        <span class="ai-lens-label">🔍 Guided Reflection:</span> ${overview.reflection}
      </div>
    </div>
  `;
}
