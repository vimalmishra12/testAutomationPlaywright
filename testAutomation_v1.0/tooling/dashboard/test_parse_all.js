const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

async function testParseAll() {
  const baseDir = path.resolve(__dirname, '../../test/Manual/C1App');
  if (!fs.existsSync(baseDir)) {
    console.error(`Directory not found: ${baseDir}`);
    return;
  }

  const items = fs.readdirSync(baseDir);

  for (const item of items) {
    const full = path.join(baseDir, item);
    if (fs.statSync(full).isDirectory()) {
      const files = fs.readdirSync(full);
      const xlsxFiles = files.filter(f => f.endsWith('.xlsx') && !f.startsWith('~$'));
      for (const xf of xlsxFiles) {
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(path.join(full, xf));
        console.log(`Folder: ${item} | File: ${xf}`);
        wb.worksheets.forEach(ws => {
          const h = [];
          ws.getRow(1).eachCell((cell, col) => h.push(cell.value));
          console.log(`  Sheet: ${ws.name} | Rows: ${ws.rowCount} | Headers: ${JSON.stringify(h.slice(0, 8))}`);
        });
      }
    }
  }
}

testParseAll().catch(console.error);
