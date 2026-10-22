// Step 3 (Clean): Expanded Historical Context & Study Links
window.CONTEXT_NOTES = {
  "Mark": "Mark's Gospel is traditionally linked with Peter, presenting a fast-paced, action-oriented portrait of Jesus as the obedient Servant of God who came to give His life as a ransom.",
  "Peter": "The letters of Peter follow Mark's Gospel to reinforce endurance under suffering, reflecting Peter's firsthand apostolic witness and pastoral encouragement.",
  "Luke": "Written by Luke, a traveling companion of Paul, this detailed historical account emphasizes Christ's universal compassion for all nations, leading directly into the history of the early church in Acts.",
  "Timothy": "Practical pastoral instructions written by Paul to guide church leadership, guard sound doctrine, and encourage perseverance in the faith.",
  "Titus": "Paul's letter to Titus outlining church order, godly living, sound teaching, and the appointment of local elders in Crete.",
  "Acts": "Luke's dynamic narrative of the early church. Notice how Paul's epistles are inserted dynamically into the exact historical moments of his missionary journeys.",
  "Galatians": "Written during Paul's early travels, fiercely defending the freedom of the Gospel and arguing that justification comes by grace through faith alone, not works of the law.",
  "Philippians": "An epistle written by Paul from prison, brimming with joy, partnership in the Gospel, and the profound humility of Christ.",
  "Thessalonians": "Early letters from Paul encouraging a young, persecuted church to stand firm in holiness, love, and anticipation of Christ's return.",
  "Corinthians": "Written during Paul's extended ministry in Ephesus (Acts 19), addressing community divisions, spiritual gifts, sacrificial love, and the physical resurrection.",
  "Ephesians": "A soaring exposition on our spiritual identity in Christ, the unity of the body of believers, and putting on the full armor of God.",
  "Colossians": "Centers entirely on the supreme preeminence, lordship, and absolute sufficiency of Christ over all creation and human philosophy.",
  "Philemon": "A deeply personal appeal from Paul urging Philemon to welcome back his runaway slave Onesimus not as property, but as a beloved brother.",
  "Romans": "Paul's theological masterpiece written near the end of his third journey, laying out the depth of human sin, justification by faith, sanctification, and God's sovereign plan.",
  "Matthew": "Authored with a Jewish audience in mind, presenting Jesus as the promised Messiah, Davidic King, and ultimate fulfillment of Old Testament prophecy.",
  "James": "Practical, wisdom-driven exhortations emphasizing authentic, living faith demonstrated through active works, controlled speech, and patient endurance.",
  "Hebrews": "Exalts Jesus as the ultimate High Priest and Mediator of a superior covenant, far surpassing angels, Moses, and the Levitical priesthood.",
  "John": "The fourth Gospel, written so that readers may believe that Jesus is the Christ, the Son of God, and find eternal life in His name.",
  "JohnLetters": "1, 2, and 3 John emphasize the non-negotiables of divine love, fellowship with God, walking in the light, and guarding against deceptive teachings.",
  "Jude": "A sharp, urgent warning contending for the historic Christian faith once for all delivered to the saints against ungodly intruders.",
  "Revelation": "The apocalyptic climax of Scripture, pulling back the veil to reveal the ultimate victory of the Lamb, the renewal of all things, and God's eternal reign."
};

function getContextNote(ntString) {
  if (!ntString) return "Read today's assigned New Testament passage prayerfully and consistently.";
  let summary = "Reflect on how this passage points to God's redemptive story, character, and grace.";
  
  if (ntString.includes("Mark")) summary = window.CONTEXT_NOTES["Mark"];
  else if (ntString.includes("Peter")) summary = window.CONTEXT_NOTES["Peter"];
  else if (ntString.includes("Luke")) summary = window.CONTEXT_NOTES["Luke"];
  else if (ntString.includes("1 Timothy") || ntString.includes("2 Timothy")) summary = window.CONTEXT_NOTES["Timothy"];
  else if (ntString.includes("Titus")) summary = window.CONTEXT_NOTES["Titus"];
  else if (ntString.includes("Acts")) summary = window.CONTEXT_NOTES["Acts"];
  else if (ntString.includes("Galatians")) summary = window.CONTEXT_NOTES["Galatians"];
  else if (ntString.includes("Philippians")) summary = window.CONTEXT_NOTES["Philippians"];
  else if (ntString.includes("Thessalonians")) summary = window.CONTEXT_NOTES["Thessalonians"];
  else if (ntString.includes("Corinthians")) summary = window.CONTEXT_NOTES["Corinthians"];
  else if (ntString.includes("Ephesians")) summary = window.CONTEXT_NOTES["Ephesians"];
  else if (ntString.includes("Colossians")) summary = window.CONTEXT_NOTES["Colossians"];
  else if (ntString.includes("Philemon")) summary = window.CONTEXT_NOTES["Philemon"];
  else if (ntString.includes("Romans")) summary = window.CONTEXT_NOTES["Romans"];
  else if (ntString.includes("Matthew")) summary = window.CONTEXT_NOTES["Matthew"];
  else if (ntString.includes("James")) summary = window.CONTEXT_NOTES["James"];
  else if (ntString.includes("Hebrews")) summary = window.CONTEXT_NOTES["Hebrews"];
  else if (ntString.includes("John") && !ntString.includes("1 John") && !ntString.includes("2 John") && !ntString.includes("3 John")) summary = window.CONTEXT_NOTES["John"];
  else if (ntString.includes("John") || ntString.includes("1 John")) summary = window.CONTEXT_NOTES["JohnLetters"];
  else if (ntString.includes("Jude")) summary = window.CONTEXT_NOTES["Jude"];
  else if (ntString.includes("Revelation")) summary = window.CONTEXT_NOTES["Revelation"];

  const studyUrl = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ntString)}&version=WEB`;

  return `
    ${summary}
    <div style="margin-top: 10px; font-size: 0.85rem;">
      <a href="${studyUrl}" target="_blank" style="color: #b7950b; font-weight: bold; text-decoration: underline;">
        📖 Open Commentary & Word Studies for ${ntString} &rarr;
      </a>
    </div>
  `;
}
