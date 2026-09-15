/**
 * C1App QA Test Dashboard Live Watcher
 * Watches test/Manual/C1App/ for .xlsx or .md changes, automatically regenerates
 * dashboard.html, and serves it on a local lightweight HTTP server with auto-refresh.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { main: generateDashboard } = require('./generateDashboard');

const WATCH_DIR = path.resolve(__dirname, '../../test/Manual/C1App');
const DASHBOARD_HTML_PATH = path.resolve(WATCH_DIR, 'dashboard.html');
const PORT = process.env.PORT || 3000;

let isRebuilding = false;
let rebuildTimeout = null;

// Track SSE clients for live reload
const clients = [];

function triggerReload() {
  clients.forEach(res => {
    res.write('data: reload\n\n');
  });
}

async function rebuild() {
  if (isRebuilding) return;
  isRebuilding = true;
  console.log('\n⚡ Change detected in manual test registers. Rebuilding dashboard...');
  try {
    await generateDashboard();
    triggerReload();
  } catch (err) {
    console.error('❌ Rebuild failed:', err.message);
  } finally {
    isRebuilding = false;
  }
}

function debounceRebuild() {
  if (rebuildTimeout) clearTimeout(rebuildTimeout);
  rebuildTimeout = setTimeout(rebuild, 800);
}

function startWatcher() {
  console.log(`👀 Watching for test register changes in: ${WATCH_DIR}`);

  fs.watch(WATCH_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    if (filename.includes('~$') || filename.endsWith('dashboard.html') || filename.endsWith('.csv')) {
      return;
    }
    if (filename.endsWith('.xlsx') || filename.endsWith('.md')) {
      console.log(`📝 File modified: ${filename}`);
      debounceRebuild();
    }
  });
}

function startServer(port = PORT) {
  const server = http.createServer((req, res) => {
    // SSE Endpoint for Live Reload
    if (req.url === '/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      clients.push(res);
      req.on('close', () => {
        const idx = clients.indexOf(res);
        if (idx !== -1) clients.splice(idx, 1);
      });
      return;
    }

    // Serve dashboard.html
    if (req.url === '/' || req.url === '/dashboard.html') {
      if (fs.existsSync(DASHBOARD_HTML_PATH)) {
        let html = fs.readFileSync(DASHBOARD_HTML_PATH, 'utf8');
        // Inject live reload script
        const reloadScript = `
          <script>
            (function() {
              const es = new EventSource('/events');
              es.onmessage = function(e) {
                if (e.data === 'reload') {
                  console.log('⚡ Dashboard updated, reloading...');
                  window.location.reload();
                }
              };
            })();
          </script>
        `;
        html = html.replace('</body>', `${reloadScript}</body>`);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('dashboard.html not found. Generating...');
      }
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`\n🚀 QA Dashboard live server running at:`);
    console.log(`👉 http://localhost:${port}/`);
    console.log(`(Press Ctrl+C to stop watcher)\n`);
  });
}

async function run() {
  await generateDashboard();
  startWatcher();
  startServer();
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { startWatcher, startServer };
