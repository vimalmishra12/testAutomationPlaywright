/**
 * C1App Test Intelligence Dashboard Generator
 * Scans manual test registers defined in dashboard.config.json and compiles a standalone,
 * interactive, zero-dependency HTML dashboard at test/Manual/C1App/dashboard.html.
 */

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const CONFIG_PATH = path.resolve(__dirname, 'dashboard.config.json');
const DEFAULT_MANUAL_DIR = path.resolve(__dirname, '../../test/Manual/C1App');
const TEST_DIR = path.resolve(__dirname, '../../test/ExperienceApp');
const EXEC_DIR = path.resolve(__dirname, '../../testResources/testExecutionFiles/ExperienceApp/thor');

// Load config file
function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      return parsed;
    } catch (e) {
      console.warn('⚠️ Warning: Could not parse dashboard.config.json, using defaults.', e.message);
    }
  }

  // Fallback default config if file is missing
  return {
    title: 'Cambridge One · QA Test Automation Dashboard',
    outputHtml: 'test/Manual/C1App/dashboard.html',
    manualBaseDir: 'test/Manual/C1App',
    modules: [
      { folder: 'AdminApp-Classes', enabled: true, name: 'Classes Tab', badge: 'CLST / BCCF / GSCL' },
      { folder: 'AdminApp-Students', enabled: true, name: 'Students Tab', badge: 'SLST / SPRF / SBLK' },
      { folder: 'AdminApp-Staff', enabled: true, name: 'Staff Tab', badge: 'STFL / STFP / STFB' },
      { folder: 'AdminApp-Reports', enabled: true, name: 'Reports Tab', badge: 'MRPT' },
      { folder: 'AdminApp-Library', enabled: true, name: 'Library Tab', badge: 'SLIB' },
      { folder: 'AdminApp-Generic', enabled: true, name: 'Generic Navigation', badge: 'AGNC' },
      { folder: 'NEMO-24306', enabled: true, name: 'NEMO-24306 (CSV Rules)', badge: 'NEMO' },
      { folder: 'FOC', enabled: false, name: 'Front of Class (eBooks)', badge: 'FOC / EBOOK' }
    ]
  };
}

// BCCF to CCLS mapping for Classes automation detection
const BCCF_MAPPING = {
  'TST_BCCF_TC_1': ['TST_CCLS_TC_1', 'TST_CCLS_TC_2', 'TST_CCLS_TC_3'],
  'TST_BCCF_TC_2': ['TST_CCLS_TC_5'],
  'TST_BCCF_TC_3': ['TST_CCLS_TC_6'],
  'TST_BCCF_TC_4': ['TST_CCLS_TC_7'],
  'TST_BCCF_TC_5': ['TST_CCLS_TC_4', 'TST_CCLS_TC_8'],
  'TST_BCCF_TC_6': ['TST_CCLS_TC_16'],
  'TST_BCCF_TC_7': ['TST_CCLS_TC_18'],
  'TST_BCCF_TC_8': ['TST_CCLS_TC_15'],
  'TST_BCCF_TC_9': ['TST_CCLS_TC_17'],
  'TST_BCCF_TC_10': ['TST_CCLS_TC_13'],
  'TST_BCCF_TC_11': ['TST_CCLS_TC_19'],
  'TST_BCCF_TC_12': ['TST_CCLS_TC_14'],
  'TST_BCCF_TC_13': ['TST_CCLS_TC_11'],
  'TST_BCCF_TC_14': ['TST_CCLS_TC_12'],
  'TST_BCCF_TC_15': ['TST_CCLS_TC_9'],
  'TST_BCCF_TC_16': ['TST_CCLS_TC_10']
};

function getCodeContents() {
  const codeFiles = {};
  if (fs.existsSync(TEST_DIR)) {
    const files = fs.readdirSync(TEST_DIR).filter(f => f.endsWith('.js'));
    files.forEach(f => {
      codeFiles[f] = fs.readFileSync(path.join(TEST_DIR, f), 'utf8');
    });
  }
  return codeFiles;
}

function getExecutionContents() {
  const execFiles = {};
  if (fs.existsSync(EXEC_DIR)) {
    const files = fs.readdirSync(EXEC_DIR).filter(f => f.endsWith('.json'));
    files.forEach(f => {
      try {
        execFiles[f] = fs.readFileSync(path.join(EXEC_DIR, f), 'utf8');
      } catch (e) {}
    });
  }
  return execFiles;
}

// Parse standard 14-column AdminApp workbook
async function parseStandardWorkbook(filePath) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);

  const ws = wb.getWorksheet('Test Cases') || wb.worksheets[0];
  if (!ws) return [];

  const headers = [];
  ws.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber] = String(cell.value || '').trim();
  });

  const rows = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const item = { rowNumber: r };
    let hasData = false;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const h = headers[colNumber] || `Col_${colNumber}`;
      let val = cell.value;
      if (val && typeof val === 'object') {
        if (val.richText) val = val.richText.map(t => t.text).join('');
        else if (val.text) val = val.text;
        else if (val.result !== undefined) val = val.result;
      }
      item[h] = val !== null && val !== undefined ? String(val).trim() : '';
      if (item[h]) hasData = true;
    });

    const tcId = item['Test Case ID'] || item['Test ID'];
    if (hasData && tcId && String(tcId).trim().length > 0) {
      rows.push({
        sNo: item['S.No.'] || rows.length + 1,
        id: tcId,
        title: item['Title'] || item['Test Title'] || item['Test Description'] || 'Untitled Test',
        req: item['Linked Requirement'] || item['Linked Requirements'] || item['Requirement'] || '-',
        type: item['Type'] || 'Positive',
        priority: item['Priority'] || 'Medium',
        preconditions: item['Preconditions'] || '-',
        steps: item['Test Steps'] || item['Steps'] || '-',
        testData: item['Test Data'] || '-',
        expected: item['Expected Result'] || '-',
        actual: item['Actual Result'] || '-',
        status: item['Status'] || 'Not Run',
        remarks: item['Remarks'] || '-',
        comments: item['Comments / Defect ID'] || item['Comments'] || '-'
      });
    }
  }

  return rows;
}

// Specialized multi-sheet parser for FOC (eBooks)
async function parseFocWorkbook(filePath) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);

  const rows = [];
  wb.worksheets.forEach(ws => {
    const headers = [];
    ws.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = String(cell.value || '').trim();
    });

    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const id = row.getCell(1).value ? String(row.getCell(1).value).trim() : '';
      const title = row.getCell(2).value ? String(row.getCell(2).value).trim() : '';
      const moduleName = row.getCell(3).value ? String(row.getCell(3).value).trim() : ws.name;
      const desc = row.getCell(4).value ? String(row.getCell(4).value).trim() : '';
      const expected = row.getCell(5).value ? String(row.getCell(5).value).trim() : '-';

      if (id && id.length > 0) {
        rows.push({
          sNo: rows.length + 1,
          id: id,
          title: title || desc || `Test ${id}`,
          req: moduleName,
          type: 'Positive',
          priority: 'Medium',
          preconditions: `Sheet: ${ws.name}`,
          steps: desc || '-',
          testData: '-',
          expected: expected,
          actual: '-',
          status: 'Not Run',
          remarks: `Module: ${moduleName} (${ws.name})`,
          comments: '-'
        });
      }
    }
  });

  return rows;
}

async function collectModules(config, cliFilters = {}) {
  const codeContents = getCodeContents();
  const execContents = getExecutionContents();
  const manualBaseDir = path.resolve(__dirname, '../../', config.manualBaseDir || 'test/Manual/C1App');

  // Filter modules based on config "enabled" flag and natural sequence
  let configuredModules = (config.modules || []).filter(m => m.enabled !== false);

  // Apply CLI includes/excludes if provided
  if (cliFilters.include && cliFilters.include.length > 0) {
    const incList = cliFilters.include.map(s => s.toLowerCase());
    configuredModules = configuredModules.filter(m => 
      incList.includes(m.folder.toLowerCase()) || 
      incList.includes(m.folder.replace('AdminApp-', '').toLowerCase())
    );
  }
  if (cliFilters.exclude && cliFilters.exclude.length > 0) {
    const excList = cliFilters.exclude.map(s => s.toLowerCase());
    configuredModules = configuredModules.filter(m => 
      !excList.includes(m.folder.toLowerCase()) && 
      !excList.includes(m.folder.replace('AdminApp-', '').toLowerCase())
    );
  }

  const modules = [];

  for (const modConfig of configuredModules) {
    const folder = modConfig.folder;
    const fullPath = path.join(manualBaseDir, folder);
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
      continue;
    }

    const files = fs.readdirSync(fullPath);
    const xlsxFiles = files.filter(f => f.endsWith('.xlsx') && !f.startsWith('~$'));
    if (xlsxFiles.length === 0) continue;

    const mainXlsx = xlsxFiles.find(f => !f.includes('_v2')) || xlsxFiles[0];
    const filePath = path.join(fullPath, mainXlsx);

    let rawRows = [];
    if (folder.toUpperCase() === 'FOC') {
      rawRows = await parseFocWorkbook(filePath);
    } else {
      rawRows = await parseStandardWorkbook(filePath);
    }

    // Tag implementation & normalize
    const testCases = rawRows.map(r => {
      let isImplemented = false;
      let implFiles = [];

      // Check code files
      Object.entries(codeContents).forEach(([fn, content]) => {
        if (content.includes(r.id)) {
          isImplemented = true;
          implFiles.push(fn);
        }
      });

      // Check BCCF mapping
      if (!isImplemented && BCCF_MAPPING[r.id]) {
        BCCF_MAPPING[r.id].forEach(alias => {
          Object.entries(codeContents).forEach(([fn, content]) => {
            if (content.includes(alias)) {
              isImplemented = true;
              implFiles.push(`${fn} (${alias})`);
            }
          });
        });
      }

      // Check execution files
      Object.entries(execContents).forEach(([fn, content]) => {
        if (content.includes(r.id) && !implFiles.includes(fn)) {
          implFiles.push(fn);
        }
      });

      // Normalize status
      const rawStatus = (r.status || '').trim();
      let normalizedStatus = 'Not Automated';
      if (rawStatus.toLowerCase() === 'pass') {
        normalizedStatus = 'Pass';
      } else if (rawStatus.toLowerCase().includes('block')) {
        normalizedStatus = 'Blocked';
      } else if (rawStatus.toLowerCase() === 'fail') {
        normalizedStatus = 'Fail';
      }

      // Normalize Type
      let normType = 'Positive';
      if (r.type.toLowerCase().includes('edge')) normType = 'Edge';
      else if (r.type.toLowerCase().includes('neg')) normType = 'Negative';

      // Normalize Priority
      let normPrio = 'Medium';
      if (r.priority.toLowerCase().includes('high') || r.priority.toLowerCase().includes('p1')) normPrio = 'High';
      else if (r.priority.toLowerCase().includes('low') || r.priority.toLowerCase().includes('p3')) normPrio = 'Low';

      return {
        ...r,
        type: normType,
        priority: normPrio,
        status: normalizedStatus,
        rawStatus: rawStatus,
        isImplemented: isImplemented,
        implFiles: implFiles
      };
    });

    const total = testCases.length;
    const pass = testCases.filter(t => t.status === 'Pass').length;
    const blocked = testCases.filter(t => t.status === 'Blocked').length;
    const notAutomated = testCases.filter(t => t.status === 'Not Automated').length;
    const fail = testCases.filter(t => t.status === 'Fail').length;
    const automatedCode = testCases.filter(t => t.isImplemented).length;

    const positive = testCases.filter(t => t.type === 'Positive').length;
    const edge = testCases.filter(t => t.type === 'Edge').length;
    const negative = testCases.filter(t => t.type === 'Negative').length;

    const high = testCases.filter(t => t.priority === 'High').length;
    const medium = testCases.filter(t => t.priority === 'Medium').length;
    const low = testCases.filter(t => t.priority === 'Low').length;

    const modId = folder.toLowerCase().replace(/[^a-z0-9]/g, '-');

    modules.push({
      folder,
      id: modId,
      name: modConfig.name || folder,
      badge: modConfig.badge || 'MODULE',
      file: mainXlsx,
      total,
      pass,
      blocked,
      notAutomated,
      fail,
      automatedCode,
      typeDist: {
        positive: { count: positive, pass: testCases.filter(t => t.type === 'Positive' && t.status === 'Pass').length, blocked: testCases.filter(t => t.type === 'Positive' && t.status === 'Blocked').length, notAuto: testCases.filter(t => t.type === 'Positive' && t.status === 'Not Automated').length },
        edge: { count: edge, pass: testCases.filter(t => t.type === 'Edge' && t.status === 'Pass').length, blocked: testCases.filter(t => t.type === 'Edge' && t.status === 'Blocked').length, notAuto: testCases.filter(t => t.type === 'Edge' && t.status === 'Not Automated').length },
        negative: { count: negative, pass: testCases.filter(t => t.type === 'Negative' && t.status === 'Pass').length, blocked: testCases.filter(t => t.type === 'Negative' && t.status === 'Blocked').length, notAuto: testCases.filter(t => t.type === 'Negative' && t.status === 'Not Automated').length }
      },
      prioDist: { high, medium, low },
      blockedCases: testCases.filter(t => t.status === 'Blocked'),
      notAutomatedCases: testCases.filter(t => t.status === 'Not Automated'),
      allCases: testCases
    });
  }

  return modules;
}

function parseCliArgs() {
  const args = process.argv.slice(2);
  const filters = { include: [], exclude: [] };

  args.forEach(arg => {
    if (arg.startsWith('--include=')) {
      filters.include = arg.replace('--include=', '').split(',').map(s => s.trim());
    } else if (arg.startsWith('--exclude=')) {
      filters.exclude = arg.replace('--exclude=', '').split(',').map(s => s.trim());
    }
  });

  return filters;
}

function buildHtml(modules, config) {
  const title = config.title || 'Cambridge One · QA Test Intelligence Dashboard';
  const generatedAt = new Date().toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata'
  });

  const globalTotal = modules.reduce((acc, m) => acc + m.total, 0);
  const globalPass = modules.reduce((acc, m) => acc + m.pass, 0);
  const globalBlocked = modules.reduce((acc, m) => acc + m.blocked, 0);
  const globalNotAuto = modules.reduce((acc, m) => acc + m.notAutomated, 0);
  const globalFail = modules.reduce((acc, m) => acc + m.fail, 0);
  const globalAutoCode = modules.reduce((acc, m) => acc + m.automatedCode, 0);

  const globalPassPct = globalTotal > 0 ? ((globalPass / globalTotal) * 100).toFixed(1) : 0;
  const globalAutoPct = globalTotal > 0 ? ((globalAutoCode / globalTotal) * 100).toFixed(1) : 0;

  const payloadJson = JSON.stringify({
    title,
    generatedAt,
    global: {
      total: globalTotal,
      pass: globalPass,
      blocked: globalBlocked,
      notAutomated: globalNotAuto,
      fail: globalFail,
      automatedCode: globalAutoCode,
      passPct: globalPassPct,
      autoPct: globalAutoPct
    },
    modules
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', Consolas, monospace;
      --bg-main: #0B132B;
      --bg-card: #1C2541;
      --bg-card-hover: #232F55;
      --bg-subtle: rgba(255, 255, 255, 0.04);
      --border-color: rgba(255, 255, 255, 0.1);
      --border-subtle: rgba(255, 255, 255, 0.06);
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
      
      --c1-blue: #0284C7;
      --c1-blue-glow: rgba(2, 132, 199, 0.25);
      
      --color-pass: #10B981;
      --color-pass-bg: rgba(16, 185, 129, 0.12);
      --color-blocked: #F59E0B;
      --color-blocked-bg: rgba(245, 158, 11, 0.12);
      --color-notauto: #64748B;
      --color-notauto-bg: rgba(100, 116, 139, 0.15);
      --color-fail: #EF4444;
      --color-fail-bg: rgba(239, 68, 68, 0.15);

      --color-p1: #EF4444;
      --color-p2: #F59E0B;
      --color-p3: #3B82F6;

      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 16px;
      --radius-xl: 20px;
      --shadow-card: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      --shadow-glow: 0 0 20px rgba(2, 132, 199, 0.15);
    }

    .light-theme {
      --bg-main: #F1F5F9;
      --bg-card: #FFFFFF;
      --bg-card-hover: #F8FAFC;
      --bg-subtle: #F8FAFC;
      --border-color: #E2E8F0;
      --border-subtle: #F1F5F9;
      --text-main: #0F172A;
      --text-muted: #64748B;
      --text-dim: #94A3B8;
      --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      --shadow-glow: 0 0 15px rgba(2, 132, 199, 0.1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg-main);
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      transition: background-color 0.2s, color 0.2s;
    }

    .app-container {
      max-width: 1540px;
      margin: 0 auto;
      padding: 24px 32px 64px;
    }

    header.dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 28px;
    }

    .brand-title {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-logo-badge {
      background: linear-gradient(135deg, #0284C7 0%, #2563EB 100%);
      color: white;
      font-weight: 800;
      font-size: 18px;
      padding: 8px 14px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-glow);
      letter-spacing: -0.5px;
    }

    .brand-text h1 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-text p {
      font-size: 13px;
      color: var(--text-muted);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--border-color);
      background: var(--bg-card);
      color: var(--text-main);
      transition: all 0.15s ease;
    }
    .btn:hover {
      background: var(--bg-card-hover);
      border-color: var(--c1-blue);
    }

    .tabs-wrapper {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 12px;
      margin-bottom: 28px;
      border-bottom: 1px solid var(--border-color);
      scrollbar-width: thin;
    }
    .tab-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      border-radius: var(--radius-lg);
      font-size: 13.5px;
      font-weight: 600;
      background: var(--bg-subtle);
      color: var(--text-muted);
      border: 1px solid transparent;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .tab-btn:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.08);
    }
    .tab-btn.active {
      background: var(--bg-card);
      color: #38BDF8;
      border-color: rgba(56, 189, 248, 0.4);
      box-shadow: var(--shadow-glow);
    }
    .tab-badge {
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
    }
    .tab-btn.active .tab-badge {
      background: rgba(56, 189, 248, 0.2);
      color: #38BDF8;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .kpi-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 20px 22px;
      box-shadow: var(--shadow-card);
      position: relative;
      overflow: hidden;
    }
    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      background: var(--accent-color, var(--c1-blue));
    }
    .kpi-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    .kpi-value {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -1px;
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .kpi-sub {
      font-size: 12.5px;
      color: var(--text-dim);
      margin-top: 4px;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: 24px 28px;
      margin-bottom: 28px;
      box-shadow: var(--shadow-card);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .card-title {
      font-size: 17px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
      text-align: left;
    }
    table.data-table th {
      background: var(--bg-subtle);
      color: var(--text-muted);
      font-weight: 600;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color);
      white-space: nowrap;
    }
    table.data-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-subtle);
      color: var(--text-main);
    }
    table.data-table tr:last-child td {
      border-bottom: none;
    }
    table.data-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      font-family: var(--font-sans);
    }
    .badge-pass { background: var(--color-pass-bg); color: var(--color-pass); }
    .badge-blocked { background: var(--color-blocked-bg); color: var(--color-blocked); }
    .badge-notauto { background: var(--color-notauto-bg); color: #94A3B8; }
    .badge-fail { background: var(--color-fail-bg); color: var(--color-fail); }

    .badge-p1 { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
    .badge-p2 { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
    .badge-p3 { background: rgba(59, 130, 246, 0.15); color: #60A5FA; }

    .badge-pos { background: rgba(16, 185, 129, 0.1); color: #10B981; }
    .badge-edge { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
    .badge-neg { background: rgba(239, 68, 68, 0.1); color: #F87171; }

    .tc-code {
      font-family: var(--font-mono);
      font-size: 12.5px;
      font-weight: 600;
      color: #38BDF8;
      background: rgba(56, 189, 248, 0.1);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
    }

    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
      align-items: center;
    }
    .search-input {
      flex: 1;
      min-width: 260px;
      padding: 9px 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-main);
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.15s;
    }
    .search-input:focus {
      border-color: var(--c1-blue);
    }
    .filter-select {
      padding: 9px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-main);
      font-size: 13px;
      outline: none;
      cursor: pointer;
    }

    .progress-bar-wrap {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      height: 8px;
      width: 100%;
      overflow: hidden;
      display: flex;
    }
    .progress-segment {
      height: 100%;
    }

    details.tc-details {
      cursor: pointer;
      margin-top: 6px;
    }
    details.tc-details summary {
      color: #38BDF8;
      font-size: 12px;
      font-weight: 500;
      outline: none;
    }
    .tc-detail-body {
      background: rgba(0, 0, 0, 0.2);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      margin-top: 8px;
      font-size: 12.5px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .empty-state {
      text-align: center;
      padding: 36px 20px;
      color: var(--text-muted);
      font-size: 14px;
    }

    @media print {
      body { background: white; color: black; }
      .tabs-wrapper, .filter-bar, .header-actions { display: none; }
      .card { border: 1px solid #ccc; box-shadow: none; break-inside: avoid; }
    }
  </style>
</head>
<body>

  <div class="app-container">
    <header class="dashboard-header">
      <div class="brand-title">
        <div class="brand-logo-badge">C1</div>
        <div class="brand-text">
          <h1>${title}</h1>
          <p>Automated Manual Test Register Aggregation · Generated: ${generatedAt}</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn" onclick="exportCurrentViewCsv()">📥 Export CSV</button>
        <button class="btn" onclick="window.print()">🖨️ Print / PDF</button>
        <button class="btn" id="themeToggleBtn" onclick="toggleTheme()">🌓 Theme</button>
      </div>
    </header>

    <nav class="tabs-wrapper" id="tabsNav"></nav>
    <main id="tabContentArea"></main>
  </div>

  <script>
    const DASHBOARD_DATA = ${payloadJson};

    let activeTabId = 'overview';
    let currentSearchTerm = '';
    let currentTypeFilter = 'ALL';
    let currentStatusFilter = 'ALL';
    let currentPrioFilter = 'ALL';

    function init() {
      renderTabs();
      renderActiveTab();
    }

    function renderTabs() {
      const nav = document.getElementById('tabsNav');
      let html = '';

      html += \`
        <button class="tab-btn \${activeTabId === 'overview' ? 'active' : ''}" onclick="switchTab('overview')">
          🌐 Global Overview
          <span class="tab-badge">\${DASHBOARD_DATA.global.total}</span>
        </button>
      \`;

      DASHBOARD_DATA.modules.forEach(m => {
        html += \`
          <button class="tab-btn \${activeTabId === m.id ? 'active' : ''}" onclick="switchTab('\${m.id}')">
            📂 \${m.name}
            <span class="tab-badge">\${m.total}</span>
          </button>
        \`;
      });

      nav.innerHTML = html;
    }

    function switchTab(tabId) {
      activeTabId = tabId;
      currentSearchTerm = '';
      currentTypeFilter = 'ALL';
      currentStatusFilter = 'ALL';
      currentPrioFilter = 'ALL';
      renderTabs();
      renderActiveTab();
    }

    function renderActiveTab() {
      const container = document.getElementById('tabContentArea');
      if (activeTabId === 'overview') {
        container.innerHTML = renderOverviewTab();
      } else {
        const mod = DASHBOARD_DATA.modules.find(m => m.id === activeTabId);
        container.innerHTML = renderModuleTab(mod);
      }
    }

    function renderOverviewTab() {
      const g = DASHBOARD_DATA.global;
      const mods = DASHBOARD_DATA.modules;

      let html = \`
        <div class="kpi-grid">
          <div class="kpi-card" style="--accent-color: #38BDF8;">
            <div class="kpi-label">Total Test Cases</div>
            <div class="kpi-value">\${g.total}</div>
            <div class="kpi-sub">Across \${mods.length} Configured Modules</div>
          </div>
          <div class="kpi-card" style="--accent-color: #10B981;">
            <div class="kpi-label">Verified Passed</div>
            <div class="kpi-value" style="color: #10B981;">\${g.pass}</div>
            <div class="kpi-sub">\${g.passPct}% Live Environment Pass Rate</div>
          </div>
          <div class="kpi-card" style="--accent-color: #0284C7;">
            <div class="kpi-label">Automated in Code</div>
            <div class="kpi-value" style="color: #38BDF8;">\${g.automatedCode}</div>
            <div class="kpi-sub">\${g.autoPct}% Playwright Code Coverage</div>
          </div>
          <div class="kpi-card" style="--accent-color: #F59E0B;">
            <div class="kpi-label">Blocked Test Cases</div>
            <div class="kpi-value" style="color: #F59E0B;">\${g.blocked}</div>
            <div class="kpi-sub">Environment / Fixture Blockers</div>
          </div>
          <div class="kpi-card" style="--accent-color: #64748B;">
            <div class="kpi-label">Pending / Not Automated</div>
            <div class="kpi-value" style="color: #94A3B8;">\${g.notAutomated}</div>
            <div class="kpi-sub">Ready in Manual Register</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">📊 Cross-Module Executive Rollup & Health Summary</div>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Prefix / Focus</th>
                  <th style="text-align: center;">Total</th>
                  <th style="text-align: center;">Pass</th>
                  <th style="text-align: center;">Blocked</th>
                  <th style="text-align: center;">Not Automated</th>
                  <th style="text-align: center;">Automated in Code</th>
                  <th style="width: 220px;">Health & Execution Status</th>
                </tr>
              </thead>
              <tbody>
      \`;

      mods.forEach(m => {
        const passPct = ((m.pass / m.total) * 100).toFixed(0);
        const blkPct = ((m.blocked / m.total) * 100).toFixed(0);
        const notPct = ((m.notAutomated / m.total) * 100).toFixed(0);

        html += \`
          <tr style="cursor: pointer;" onclick="switchTab('\${m.id}')">
            <td><strong>\${m.name}</strong></td>
            <td><span class="tc-code">\${m.badge}</span></td>
            <td style="text-align: center; font-weight: 700;">\${m.total}</td>
            <td style="text-align: center;"><span class="badge badge-pass">\${m.pass}</span></td>
            <td style="text-align: center;"><span class="badge badge-blocked">\${m.blocked}</span></td>
            <td style="text-align: center;"><span class="badge badge-notauto">\${m.notAutomated}</span></td>
            <td style="text-align: center; font-weight: 600; color: #38BDF8;">\${m.automatedCode} / \${m.total}</td>
            <td>
              <div class="progress-bar-wrap">
                <div class="progress-segment" style="width: \${passPct}%; background: var(--color-pass);" title="Pass: \${m.pass}"></div>
                <div class="progress-segment" style="width: \${blkPct}%; background: var(--color-blocked);" title="Blocked: \${m.blocked}"></div>
                <div class="progress-segment" style="width: \${notPct}%; background: rgba(255,255,255,0.15);" title="Not Automated: \${m.notAutomated}"></div>
              </div>
            </td>
          </tr>
        \`;
      });

      html += \`
              </tbody>
            </table>
          </div>
        </div>
      \`;

      return html;
    }

    function renderModuleTab(mod) {
      if (!mod) return '<div class="empty-state">Module not found</div>';

      const d = mod.typeDist;
      const filteredCases = applyFilters(mod.allCases);

      let html = \`
        <div class="kpi-grid">
          <div class="kpi-card" style="--accent-color: #38BDF8;">
            <div class="kpi-label">Total Test Cases</div>
            <div class="kpi-value">\${mod.total}</div>
            <div class="kpi-sub">\${mod.badge}</div>
          </div>
          <div class="kpi-card" style="--accent-color: #10B981;">
            <div class="kpi-label">Pass Verified</div>
            <div class="kpi-value" style="color: #10B981;">\${mod.pass}</div>
            <div class="kpi-sub">\${((mod.pass / mod.total) * 100).toFixed(1)}% Pass Rate</div>
          </div>
          <div class="kpi-card" style="--accent-color: #0284C7;">
            <div class="kpi-label">Automated in Code</div>
            <div class="kpi-value" style="color: #38BDF8;">\${mod.automatedCode}</div>
            <div class="kpi-sub">\${((mod.automatedCode / mod.total) * 100).toFixed(1)}% Automated</div>
          </div>
          <div class="kpi-card" style="--accent-color: #F59E0B;">
            <div class="kpi-label">Blocked</div>
            <div class="kpi-value" style="color: #F59E0B;">\${mod.blocked}</div>
            <div class="kpi-sub">Environment Blockers</div>
          </div>
          <div class="kpi-card" style="--accent-color: #64748B;">
            <div class="kpi-label">Not Automated</div>
            <div class="kpi-value" style="color: #94A3B8;">\${mod.notAutomated}</div>
            <div class="kpi-sub">Pending Automation</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">📋 Test Case Distribution by Type (Positive / Edge / Negative)</div>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Test Case Type</th>
                  <th style="text-align: center;">Count</th>
                  <th style="text-align: center;">Pass</th>
                  <th style="text-align: center;">Blocked</th>
                  <th style="text-align: center;">Not Automated</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="badge badge-pos">🟢 Positive</span> (Happy path & feature workflows)</td>
                  <td style="text-align: center; font-weight: 700;">\${d.positive.count}</td>
                  <td style="text-align: center;"><span class="badge badge-pass">\${d.positive.pass}</span></td>
                  <td style="text-align: center;"><span class="badge badge-blocked">\${d.positive.blocked}</span></td>
                  <td style="text-align: center;"><span class="badge badge-notauto">\${d.positive.notAuto}</span></td>
                </tr>
                <tr>
                  <td><span class="badge badge-edge">🟡 Edge</span> (Boundary conditions, limits, max lengths)</td>
                  <td style="text-align: center; font-weight: 700;">\${d.edge.count}</td>
                  <td style="text-align: center;"><span class="badge badge-pass">\${d.edge.pass}</span></td>
                  <td style="text-align: center;"><span class="badge badge-blocked">\${d.edge.blocked}</span></td>
                  <td style="text-align: center;"><span class="badge badge-notauto">\${d.edge.notAuto}</span></td>
                </tr>
                <tr>
                  <td><span class="badge badge-neg">🔴 Negative</span> (Validation errors, rejected inputs)</td>
                  <td style="text-align: center; font-weight: 700;">\${d.negative.count}</td>
                  <td style="text-align: center;"><span class="badge badge-pass">\${d.negative.pass}</span></td>
                  <td style="text-align: center;"><span class="badge badge-blocked">\${d.negative.blocked}</span></td>
                  <td style="text-align: center;"><span class="badge badge-notauto">\${d.negative.notAuto}</span></td>
                </tr>
                <tr style="font-weight: 700; background: var(--bg-subtle);">
                  <td>TOTAL</td>
                  <td style="text-align: center;">\${mod.total}</td>
                  <td style="text-align: center;">\${mod.pass}</td>
                  <td style="text-align: center;">\${mod.blocked}</td>
                  <td style="text-align: center;">\${mod.notAutomated}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        \${renderBlockedSection(mod)}
        \${renderNotAutomatedSection(mod)}

        <div class="card">
          <div class="card-header">
            <div class="card-title">📑 Complete Test Case Registry (\${filteredCases.length} / \${mod.total})</div>
          </div>

          <div class="filter-bar">
            <input type="text" class="search-input" placeholder="🔍 Search test case ID, title, requirement..." 
                   value="\${currentSearchTerm}" oninput="onSearchChange(this.value)">
            
            <select class="filter-select" onchange="onTypeFilterChange(this.value)">
              <option value="ALL" \${currentTypeFilter==='ALL'?'selected':''}>All Types</option>
              <option value="Positive" \${currentTypeFilter==='Positive'?'selected':''}>Positive</option>
              <option value="Edge" \${currentTypeFilter==='Edge'?'selected':''}>Edge</option>
              <option value="Negative" \${currentTypeFilter==='Negative'?'selected':''}>Negative</option>
            </select>

            <select class="filter-select" onchange="onStatusFilterChange(this.value)">
              <option value="ALL" \${currentStatusFilter==='ALL'?'selected':''}>All Statuses</option>
              <option value="Pass" \${currentStatusFilter==='Pass'?'selected':''}>Pass</option>
              <option value="Blocked" \${currentStatusFilter==='Blocked'?'selected':''}>Blocked</option>
              <option value="Not Automated" \${currentStatusFilter==='Not Automated'?'selected':''}>Not Automated</option>
            </select>

            <select class="filter-select" onchange="onPrioFilterChange(this.value)">
              <option value="ALL" \${currentPrioFilter==='ALL'?'selected':''}>All Priorities</option>
              <option value="High" \${currentPrioFilter==='High'?'selected':''}>High</option>
              <option value="Medium" \${currentPrioFilter==='Medium'?'selected':''}>Medium</option>
              <option value="Low" \${currentPrioFilter==='Low'?'selected':''}>Low</option>
            </select>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 50px;">S.No.</th>
                  <th>Test Case ID</th>
                  <th>Title</th>
                  <th>Requirement</th>
                  <th style="text-align: center;">Type</th>
                  <th style="text-align: center;">Priority</th>
                  <th style="text-align: center;">Status</th>
                  <th>Automation Files</th>
                </tr>
              </thead>
              <tbody>
      \`;

      if (filteredCases.length === 0) {
        html += '<tr><td colspan="8" class="empty-state">No matching test cases found.</td></tr>';
      } else {
        filteredCases.forEach((tc, idx) => {
          const typeBadge = tc.type === 'Positive' ? 'badge-pos' : tc.type === 'Edge' ? 'badge-edge' : 'badge-neg';
          const prioBadge = tc.priority === 'High' ? 'badge-p1' : tc.priority === 'Medium' ? 'badge-p2' : 'badge-p3';
          const statusBadge = tc.status === 'Pass' ? 'badge-pass' : tc.status === 'Blocked' ? 'badge-blocked' : 'badge-notauto';

          html += \`
            <tr>
              <td>\${idx + 1}</td>
              <td><span class="tc-code">\${tc.id}</span></td>
              <td>
                <strong>\${escapeHtml(tc.title)}</strong>
                \${tc.remarks !== '-' || tc.comments !== '-' ? \`
                  <details class="tc-details">
                    <summary>View Notes & Expected Result</summary>
                    <div class="tc-detail-body">
                      \${tc.expected !== '-' ? \`<div><strong>Expected:</strong> \${escapeHtml(tc.expected)}</div>\` : ''}
                      \${tc.remarks !== '-' ? \`<div><strong>Remarks:</strong> \${escapeHtml(tc.remarks)}</div>\` : ''}
                      \${tc.comments !== '-' ? \`<div><strong>Comments:</strong> \${escapeHtml(tc.comments)}</div>\` : ''}
                    </div>
                  </details>
                \` : ''}
              </td>
              <td>\${escapeHtml(tc.req)}</td>
              <td style="text-align: center;"><span class="badge \${typeBadge}">\${tc.type}</span></td>
              <td style="text-align: center;"><span class="badge \${prioBadge}">\${tc.priority}</span></td>
              <td style="text-align: center;"><span class="badge \${statusBadge}">\${tc.status}</span></td>
              <td>\${tc.implFiles.length > 0 ? tc.implFiles.map(f => \`<span class="tc-code" style="font-size:11px;">\${f}</span>\`).join(' ') : '<span style="color:var(--text-dim);">-</span>'}</td>
            </tr>
          \`;
        });
      }

      html += \`
              </tbody>
            </table>
          </div>
        </div>
      \`;

      return html;
    }

    function renderBlockedSection(mod) {
      if (mod.blockedCases.length === 0) return '';

      let html = \`
        <div class="card" style="border-left: 4px solid var(--color-blocked);">
          <div class="card-header">
            <div class="card-title" style="color: var(--color-blocked);">
              🚫 Blocked Test Cases (\${mod.blockedCases.length})
            </div>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 50px;">S.No.</th>
                  <th>Test Case ID</th>
                  <th>Title</th>
                  <th style="text-align: center;">Type</th>
                  <th style="text-align: center;">Priority</th>
                  <th>Blocker Root Cause & Unblocking Strategy</th>
                </tr>
              </thead>
              <tbody>
      \`;

      mod.blockedCases.forEach((tc, idx) => {
        const reason = tc.comments !== '-' ? tc.comments : tc.remarks;
        html += \`
          <tr>
            <td>\${idx + 1}</td>
            <td><span class="tc-code">\${tc.id}</span></td>
            <td><strong>\${escapeHtml(tc.title)}</strong></td>
            <td style="text-align: center;"><span class="badge \${tc.type === 'Edge' ? 'badge-edge' : 'badge-pos'}">\${tc.type}</span></td>
            <td style="text-align: center;"><span class="badge badge-p2">\${tc.priority}</span></td>
            <td style="line-height: 1.6; color: #FCD34D;">\${escapeHtml(reason)}</td>
          </tr>
        \`;
      });

      html += \`
              </tbody>
            </table>
          </div>
        </div>
      \`;

      return html;
    }

    function renderNotAutomatedSection(mod) {
      if (mod.notAutomatedCases.length === 0) return '';

      let html = \`
        <div class="card" style="border-left: 4px solid var(--c1-blue);">
          <div class="card-header">
            <div class="card-title" style="color: #38BDF8;">
              ⏸️ Not Automated Test Cases (\${mod.notAutomatedCases.length})
            </div>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 50px;">S.No.</th>
                  <th>Test Case ID</th>
                  <th>Title</th>
                  <th>Linked Requirement</th>
                  <th style="text-align: center;">Type</th>
                  <th style="text-align: center;">Priority</th>
                  <th>Remarks / Automation Roadmap</th>
                </tr>
              </thead>
              <tbody>
      \`;

      mod.notAutomatedCases.forEach((tc, idx) => {
        const notes = tc.remarks !== '-' ? tc.remarks : tc.comments;
        const typeBadge = tc.type === 'Positive' ? 'badge-pos' : tc.type === 'Edge' ? 'badge-edge' : 'badge-neg';
        const prioBadge = tc.priority === 'High' ? 'badge-p1' : tc.priority === 'Medium' ? 'badge-p2' : 'badge-p3';

        html += \`
          <tr>
            <td>\${idx + 1}</td>
            <td><span class="tc-code">\${tc.id}</span></td>
            <td><strong>\${escapeHtml(tc.title)}</strong></td>
            <td>\${escapeHtml(tc.req)}</td>
            <td style="text-align: center;"><span class="badge \${typeBadge}">\${tc.type}</span></td>
            <td style="text-align: center;"><span class="badge \${prioBadge}">\${tc.priority}</span></td>
            <td style="color: var(--text-muted); font-size: 13px;">\${escapeHtml(notes)}</td>
          </tr>
        \`;
      });

      html += \`
              </tbody>
            </table>
          </div>
        </div>
      \`;

      return html;
    }

    function applyFilters(cases) {
      return cases.filter(tc => {
        const matchSearch = currentSearchTerm === '' ||
          tc.id.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
          tc.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
          tc.req.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
          tc.remarks.toLowerCase().includes(currentSearchTerm.toLowerCase());

        const matchType = currentTypeFilter === 'ALL' || tc.type === currentTypeFilter;
        const matchStatus = currentStatusFilter === 'ALL' || tc.status === currentStatusFilter;
        const matchPrio = currentPrioFilter === 'ALL' || tc.priority === currentPrioFilter;

        return matchSearch && matchType && matchStatus && matchPrio;
      });
    }

    function onSearchChange(val) {
      currentSearchTerm = val;
      renderActiveTab();
    }
    function onTypeFilterChange(val) {
      currentTypeFilter = val;
      renderActiveTab();
    }
    function onStatusFilterChange(val) {
      currentStatusFilter = val;
      renderActiveTab();
    }
    function onPrioFilterChange(val) {
      currentPrioFilter = val;
      renderActiveTab();
    }

    function exportCurrentViewCsv() {
      const mod = DASHBOARD_DATA.modules.find(m => m.id === activeTabId);
      const cases = mod ? mod.allCases : DASHBOARD_DATA.modules.flatMap(m => m.allCases);
      const filename = \`C1App_\${activeTabId}_QA_TestCases.csv\`;

      let csv = 'Test Case ID,Title,Linked Requirement,Type,Priority,Status,Remarks,Comments\\n';
      cases.forEach(c => {
        const clean = str => '"' + String(str || '').replace(/"/g, '""').replace(/\\r?\\n/g, ' ') + '"';
        csv += \`\${clean(c.id)},\${clean(c.title)},\${clean(c.req)},\${clean(c.type)},\${clean(c.priority)},\${clean(c.status)},\${clean(c.remarks)},\${clean(c.comments)}\\n\`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }

    function toggleTheme() {
      document.body.classList.toggle('light-theme');
    }

    function escapeHtml(str) {
      if (!str) return '-';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    window.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>`;
}

async function main() {
  const config = loadConfig();
  const cliFilters = parseCliArgs();

  console.log('🔄 Loading configuration from tooling/dashboard/dashboard.config.json...');
  const startTime = Date.now();

  const modules = await collectModules(config, cliFilters);
  console.log(`✅ Loaded ${modules.length} active module(s):`);
  modules.forEach(m => {
    console.log(`   - ${m.name} [${m.badge}]: ${m.total} TCs (Pass: ${m.pass}, Blocked: ${m.blocked}, Not Automated: ${m.notAutomated})`);
  });

  const outputHtmlPath = path.resolve(__dirname, '../../', config.outputHtml || 'test/Manual/C1App/dashboard.html');
  const html = buildHtml(modules, config);
  fs.writeFileSync(outputHtmlPath, html, 'utf8');

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n🎉 Dashboard compiled successfully in ${elapsed}s:`);
  console.log(`👉 ${outputHtmlPath}\n`);
}

if (require.main === module) {
  main().catch(err => {
    console.error('❌ Error generating dashboard:', err);
    process.exit(1);
  });
}

module.exports = { main, collectModules, buildHtml, loadConfig };
