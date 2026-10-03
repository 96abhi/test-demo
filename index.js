const http = require("http");
const os = require("os");

const PORT = process.env.PORT || 3000; // keep this the same port your Dockerfile/compose already uses
const VERSION = "v1"; // change to v2, v3... to see each deploy
const MESSAGE = "Hello from the server";
const startedAt = Date.now();

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const page = () => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(MESSAGE)} · ${esc(VERSION)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --paper:#EAF0F4; --panel:#FFFFFF; --ink:#0F2236; --muted:#53687C;
  --line:#C9D5DF; --live:#0E9F6E; --accent:#1B5FD6;
  --display:"Bricolage Grotesque",system-ui,sans-serif;
  --body:"Figtree",system-ui,sans-serif;
}
*{box-sizing:border-box;margin:0}
body{background:var(--paper);color:var(--ink);font:400 1.0625rem/1.6 var(--body);min-height:100vh}
main{max-width:56rem;margin:0 auto;padding:clamp(1.5rem,5vw,4rem) 1.25rem 3rem}
.status{display:inline-flex;align-items:center;gap:.6rem;font-weight:600;color:var(--live)}
.dot{width:.7rem;height:.7rem;border-radius:50%;background:var(--live);animation:pulse 2s ease-out 3}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(14,159,110,.5)}100%{box-shadow:0 0 0 .9rem rgba(14,159,110,0)}}
h1{font:800 clamp(2.6rem,9vw,5.5rem)/.98 var(--display);letter-spacing:-.03em;margin:1.25rem 0 1rem;max-width:12ch}
.ver{display:inline-block;font:700 1rem var(--display);background:var(--ink);color:var(--paper);padding:.2rem .7rem;border-radius:.4rem;vertical-align:middle;letter-spacing:0}
.lede{color:var(--muted);max-width:34rem}
.uptime{margin-top:2.5rem;padding:1.5rem;background:var(--panel);border:1px solid var(--line);border-radius:1rem;display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:1rem}
.uptime strong{font:700 clamp(2rem,7vw,3.5rem)/1 var(--display);font-variant-numeric:tabular-nums;color:var(--accent)}
.uptime span{color:var(--muted)}
h2{font:700 1.25rem var(--display);margin:3rem 0 1rem}
.steps{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(9.5rem,1fr));gap:.75rem;counter-reset:s}
.steps li{counter-increment:s;background:var(--panel);border:1px solid var(--line);border-radius:.75rem;padding:1rem}
.steps li::before{content:counter(s);display:grid;place-items:center;width:1.7rem;height:1.7rem;border-radius:50%;background:var(--accent);color:#fff;font:700 .85rem var(--display);margin-bottom:.6rem}
.steps b{display:block;font-weight:600}
.steps small{color:var(--muted)}
dl{display:grid;grid-template-columns:max-content 1fr;gap:.6rem 1.5rem;background:var(--panel);border:1px solid var(--line);border-radius:1rem;padding:1.25rem 1.5rem}
dt{color:var(--muted)} dd{font-weight:500;overflow-wrap:anywhere}
footer{margin-top:2.5rem;color:var(--muted);font-size:.95rem}
a{color:var(--accent);font-weight:600}
a:focus-visible{outline:3px solid var(--accent);outline-offset:3px;border-radius:2px}
@media (prefers-reduced-motion:reduce){.dot{animation:none}}
@media (max-width:30rem){dl{grid-template-columns:1fr;gap:.1rem}dd{margin-bottom:.7rem}}
</style>
</head>
<body>
<main>
  <p class="status"><span class="dot" aria-hidden="true"></span>Live and healthy</p>
  <h1>${esc(MESSAGE)} <span class="ver">${esc(VERSION)}</span></h1>
  <p class="lede">This page was deployed automatically. Push to <code>main</code> and the new version goes live in seconds.</p>

  <div class="uptime">
    <strong id="up" data-start="${startedAt}">00:00:00</strong>
    <span>since this version started</span>
  </div>

  <h2>How it got here</h2>
  <ol class="steps">
    <li><b>Push</b><small>Code goes to main on GitHub</small></li>
    <li><b>Actions</b><small>Workflow starts on push</small></li>
    <li><b>SSH</b><small>Runner connects to EC2</small></li>
    <li><b>Build</b><small>Docker Compose rebuilds</small></li>
    <li><b>Live</b><small>You are looking at it</small></li>
  </ol>

  <h2>Server details</h2>
  <dl>
    <dt>Hostname</dt><dd>${esc(os.hostname())}</dd>
    <dt>Node.js</dt><dd>${esc(process.version)}</dd>
    <dt>Platform</dt><dd>${esc(os.platform())} ${esc(os.arch())}</dd>
    <dt>Started</dt><dd>${esc(new Date(startedAt).toUTCString())}</dd>
    <dt>Port</dt><dd>${esc(PORT)}</dd>
  </dl>

  <footer>Need the raw data? Open <a href="/api">/api</a> for JSON or <a href="/health">/health</a> for a health check.</footer>
</main>
<script>
(function(){
  var el=document.getElementById("up"),start=+el.dataset.start;
  function pad(n){return String(n).padStart(2,"0")}
  function tick(){
    var s=Math.floor((Date.now()-start)/1000);
    el.textContent=pad(Math.floor(s/3600))+":"+pad(Math.floor(s%3600/60))+":"+pad(s%60);
  }
  tick();setInterval(tick,1000);
})();
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const path = req.url.split("?")[0];

  if (path === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ msg: `${MESSAGE} ${VERSION} deploy\n` }));
  }
  if (path === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok", uptime: Math.floor((Date.now() - startedAt) / 1000) }));
  }
  if (path === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(page());
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
