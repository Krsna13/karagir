const fs = require('fs');
const pdf = require('pdf-parse');
const inPath = 'c:\\Users\\krish\\OneDrive\\Desktop\\Karagir\\temp\\karagir editor.pdf';
const outPath = 'c:\\Users\\krish\\OneDrive\\Desktop\\Karagir\\temp\\karagir_editor.txt';
let dataBuffer = fs.readFileSync(inPath);
pdf(dataBuffer).then(function(data) {
  fs.writeFileSync(outPath, data.text, 'utf8');
  console.log('WROTE', outPath);
}).catch(err => { console.error(err); process.exit(1); });
