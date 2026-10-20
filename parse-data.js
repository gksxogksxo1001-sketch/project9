const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'ritual-history-2026-10-20.txt'), 'utf-8');
const lines = content.split(/\r?\n/);

const records = [];
let currentRecord = null;
let currentSection = null; // 'morning' | 'evening'

for (let line of lines) {
  line = line.trim();
  if (!line || line.startsWith('# 기간') || line.startsWith('# 주한태')) continue;

  const dateMatch = line.match(/^##\s*(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    if (currentRecord) {
      records.push(currentRecord);
    }
    currentRecord = {
      date: dateMatch[1],
      morning: {},
      evening: {}
    };
    currentSection = null;
    continue;
  }

  if (line === '[아침]') {
    currentSection = 'morning';
    continue;
  }
  if (line === '[마무리]') {
    currentSection = 'evening';
    continue;
  }

  if (currentRecord && currentSection && line.startsWith('- ')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > -1) {
      const key = line.substring(2, colonIdx).trim();
      const val = line.substring(colonIdx + 1).trim();
      currentRecord[currentSection][key] = val;
    }
  }
}
if (currentRecord) {
  records.push(currentRecord);
}

// 하이라이트(명장면) 태깅 및 추가 메타데이터
const highlightDates = ['2026-08-11', '2026-08-14', '2026-09-11', '2026-10-07', '2026-10-14', '2026-10-15', '2026-10-16', '2026-10-20'];

records.forEach(r => {
  r.isHighlight = highlightDates.includes(r.date);
  // 호흡 시간 파싱
  if (r.morning['호흡']) {
    const m = r.morning['호흡'].match(/([\d.]+)/);
    r.morning.breathNum = m ? parseFloat(m[1]) : 0;
  } else {
    r.morning.breathNum = 0;
  }
});

const output = `// Auto-generated 38 days ritual records for 주한태
window.INITIAL_RITUAL_DATA = ${JSON.stringify(records, null, 2)};
`;

fs.mkdirSync(path.join(__dirname, 'js'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'js', 'ritual-data.js'), output, 'utf-8');
console.log(`Parsed ${records.length} records successfully!`);
