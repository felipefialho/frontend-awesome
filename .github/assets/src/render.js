// Regenerates the brand PNGs (README banners, OG images, logo.png) from logo.svg.
// Usage: npm i playwright && node .github/assets/src/render.js
const { chromium } = require('playwright');
const fs = require('fs');
const markN = () => fs.readFileSync(__dirname + '/../logo.svg', 'utf8').replace(/fa-g/g, 'g' + Math.random().toString(36).slice(2,7));
const font = `font-family:'Inter Display','Inter',sans-serif;`;
const wordmark = (ink) => `<span style="color:${ink}">frontend</span><span style="background:linear-gradient(90deg,#6E56FF,#FF4F8B);-webkit-background-clip:text;color:transparent">-awesome</span>`;

const banner = (dark) => `<html><body style="margin:0;background:transparent">
<div id="c" style="width:880px;height:200px;display:flex;align-items:center;justify-content:center;gap:28px;${font}">
  <div style="width:112px;height:112px">${markN().replace('width="128" height="128"','width="112" height="112"')}</div>
  <div style="font-size:76px;font-weight:700;letter-spacing:-0.035em;line-height:1">${wordmark(dark ? '#F4F3FF' : '#14121F')}</div>
</div></body></html>`;

const chips = ['Accessibility','APIs','CSS','Performance','SVG','Testing','Fonts','Images'];
const og = (dark) => {
  const bg = dark ? '#0E0C18' : '#FAF9FF', ink = dark ? '#F4F3FF' : '#14121F', sub = dark ? '#A7A3C2' : '#55516E',
        line = dark ? 'rgba(255,255,255,.06)' : 'rgba(20,18,31,.06)', chipBg = dark ? 'rgba(255,255,255,.06)' : '#fff', chipBd = dark ? 'rgba(255,255,255,.12)' : 'rgba(20,18,31,.10)';
  return `<html><body style="margin:0">
<div id="c" style="position:relative;overflow:hidden;width:1280px;height:640px;background:${bg};${font}">
  <div style="position:absolute;inset:0;background-image:linear-gradient(${line} 1px,transparent 1px),linear-gradient(90deg,${line} 1px,transparent 1px);background-size:40px 40px"></div>
  <div style="position:absolute;width:760px;height:760px;right:-260px;top:-320px;border-radius:50%;background:radial-gradient(circle,rgba(110,86,255,${dark?.45:.25}),transparent 65%)"></div>
  <div style="position:absolute;width:700px;height:700px;right:-120px;bottom:-420px;border-radius:50%;background:radial-gradient(circle,rgba(255,79,139,${dark?.35:.2}),transparent 65%)"></div>
  <div style="position:absolute;left:96px;top:92px;right:96px">
    <div style="width:120px;height:120px">${markN().replace('width="128" height="128"','width="120" height="120"')}</div>
    <div style="margin-top:44px;font-size:104px;font-weight:700;letter-spacing:-0.04em;line-height:1">${wordmark(ink)}</div>
    <div style="margin-top:26px;font-size:34px;font-weight:500;color:${sub};letter-spacing:-0.01em;max-width:900px;line-height:1.3">A curated list of tools and resources for front-end developers.</div>
    <div style="margin-top:44px;display:flex;flex-wrap:wrap;gap:12px">${chips.map(c=>`<span style="font-size:22px;font-weight:600;color:${ink};background:${chipBg};border:1.5px solid ${chipBd};padding:9px 18px;border-radius:999px">${c}</span>`).join('')}</div>
  </div>
  <div style="position:absolute;right:96px;bottom:44px;font-family:'DejaVu Sans Mono',monospace;font-size:22px;color:${sub}">github.com/felipefialho/frontend-awesome</div>
</div></body></html>`;
};

(async () => {
  const out = process.argv[2] || __dirname + '/..';
  const b = await chromium.launch();
  const shot = async (html, file, scale, omit) => {
    const p = await b.newPage({ deviceScaleFactor: scale });
    await p.setContent(html); await p.evaluate(() => document.fonts.ready);
    await (await p.$('#c')).screenshot({ path: out + '/' + file, omitBackground: omit });
    await p.close();
  };
  await shot(banner(false), 'banner-light.png', 2, true);
  await shot(banner(true), 'banner-dark.png', 2, true);
  await shot(og(true), 'og-image.png', 1, false);
  await shot(og(false), 'og-image-light.png', 1, false);
  await shot(`<html><body style="margin:0"><div id="c" style="width:512px;height:512px">${markN().replace('width="128" height="128"','width="512" height="512"')}</div></body></html>`, 'logo.png', 1, true);
  await b.close();
})();
