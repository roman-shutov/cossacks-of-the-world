import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const base = process.env.AUDIT_URL || 'http://localhost:3141';
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new', '--disable-gpu', '--mute-audio', '--no-first-run',
  '--remote-debugging-port=0', `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), 'cossacks-player-'))}`,
  'about:blank',
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let log = '';
chrome.stderr.on('data', chunk => log += chunk);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let endpoint;
for (let i = 0; i < 150; i++) {
  endpoint = log.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];
  if (endpoint) break;
  await delay(100);
}
if (!endpoint) throw Error(log);
const ws = new WebSocket(endpoint);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
const keepAlive = setInterval(() => {}, 1000);
let id = 0;
const pending = new Map();
ws.onmessage = event => {
  const result = JSON.parse(event.data), job = pending.get(result.id);
  if (!job) return;
  pending.delete(result.id);
  result.error ? job.reject(Error(JSON.stringify(result.error))) : job.resolve(result.result);
};
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const request = ++id;
  const timer = setTimeout(() => reject(Error(`Timeout: ${method}`)), 20000);
  pending.set(request, { resolve: r => { clearTimeout(timer); resolve(r); }, reject: e => { clearTimeout(timer); reject(e); } });
  ws.send(JSON.stringify({ id: request, method, params, ...(sessionId ? { sessionId } : {}) }));
});
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const call = (method, params) => send(method, params, sessionId);
await call('Page.enable');
const evaluate = async expression => {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
await call('Page.addScriptToEvaluateOnNewDocument', { source: `
  window.playErrors=[];
  const original=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){return original.call(this).catch(error=>{window.playErrors.push(error.name+': '+error.message);throw error})};
` });
const visit = async route => {
  await call('Page.navigate', { url: base + route });
  for (let i = 0; i < 150; i++) {
    await delay(50);
    if (await evaluate(`document.readyState==='complete'&&!!document.querySelector('main[data-ready="true"] .sound')`)) break;
  }
  await delay(100);
};
const click = async selector => {
  const point = await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await call('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
  await call('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
};
const state = () => evaluate(`(()=>{const a=document.querySelector('audio');return {paused:a.paused,time:a.currentTime,src:a.getAttribute('src'),pressed:document.querySelector('.sound').getAttribute('aria-pressed'),count:document.querySelectorAll('audio').length,errors:window.playErrors}})()`);
const waitPlaying = async () => { for (let i = 0; i < 60; i++) { const s = await state(); if (!s.paused && s.time > .1) return s; await delay(100); } return state(); };
const results = [];
const check = (name, pass, details) => { results.push({ name, pass, details }); console.log(name, pass ? 'PASS' : 'FAIL', JSON.stringify(details ?? {})); };
try {
  for (const width of [390, 1920]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: width === 390 ? 844 : 1080, deviceScaleFactor: 1, mobile: width === 390 });
    for (let attempt = 0; attempt < 3; attempt++) {
      await visit('/');
      // Force a non-default first track to exercise the former React/src race.
      await evaluate(`Math.random=()=>.55`);
      await click('.sound');
      const s = await waitPlaying();
      check(`speaker-first-${width}-${attempt}`, !s.paused && s.time > 0 && s.pressed === 'true' && s.count === 1 && s.src === '/audio/oisya.mp3' && !s.errors.length, s);
      await click('.sound'); await delay(100);
      const paused = await state();
      await click('.sound'); const resumed = await waitPlaying(); await delay(200);
      check(`pause-resume-${width}-${attempt}`, paused.paused && !(await state()).paused && resumed.src === paused.src && (await state()).time > paused.time);
      await evaluate(`Math.random=()=>.8`);
      await click('[aria-label="Следующая случайная песня"]'); const next = await waitPlaying();
      await click('[aria-label="Предыдущая песня"]'); const previous = await waitPlaying();
      check(`next-previous-${width}-${attempt}`, !next.paused && next.src !== resumed.src && !previous.paused && previous.src === resumed.src);
    }
    await visit('/');
    await click('.sound'); await click('.sound'); await delay(400);
    const rapidPaused = await state();
    check(`rapid-second-click-pauses-${width}`, rapidPaused.paused && rapidPaused.pressed === 'false', rapidPaused);
    await click('.sound'); const rapidResumed = await waitPlaying();
    check(`rapid-resume-same-track-${width}`, !rapidResumed.paused && rapidResumed.src === rapidPaused.src);
    await visit('/');
    await click('[aria-label="Предыдущая песня"]'); const firstBack = await waitPlaying();
    check(`previous-before-start-${width}`, !firstBack.paused && !!firstBack.src);
    await evaluate(`document.querySelector('audio').currentTime=12`);
    await click('[aria-label="Предыдущая песня"]'); const restarted = await waitPlaying();
    check(`previous-empty-history-restarts-${width}`, restarted.src===firstBack.src && restarted.time<3 && !restarted.paused);
    await click('[aria-label="Следующая случайная песня"]'); const middle = await waitPlaying();
    await click('[aria-label="Следующая случайная песня"]'); await waitPlaying();
    await click('[aria-label="Предыдущая песня"]'); const backOne = await waitPlaying();
    await click('[aria-label="Предыдущая песня"]'); const backTwo = await waitPlaying();
    check(`previous-walks-history-${width}`, backOne.src===middle.src && backTwo.src===firstBack.src && !backTwo.paused);
    await evaluate(`document.querySelector('[aria-label="Следующая случайная песня"]').click();document.querySelector('[aria-label="Предыдущая песня"]').click()`);
    const rapidBack = await waitPlaying();
    check(`rapid-next-back-keeps-history-${width}`, rapidBack.src===firstBack.src && !rapidBack.paused);
    await visit('/ru/label');
    for (let artist = 1; artist <= 3; artist++) {
      await evaluate(`document.querySelector('#artists').scrollIntoView({behavior:'instant'})`);
      await click(`.artist-tabs button:nth-child(${artist})`); await delay(100);
      const labels = await evaluate(`({tabs:[...document.querySelectorAll('.artist-tabs button')].map(e=>e.textContent),tag:document.querySelector('.artist-stage-copy>span')?.textContent,copy:document.querySelector('.artist-stage-copy p').textContent})`);
      check(`artist-label-${width}-${artist}`, labels.tabs.every(t=>!/[0-9]/.test(t)) && !labels.tag && !labels.copy.includes('готовятся'), labels);
      fs.mkdirSync('qa-responsive', { recursive: true });
      const { data } = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(`qa-responsive/artist-label-${width}-${artist}.png`, Buffer.from(data, 'base64'));
    }
    for (const route of ['/', '/ru/news', '/ru/history', '/ru/label', '/ru/heritage', '/ru/about', '/ru/join']) {
      await visit(route);
      await click('.menu-button'); await delay(350);
      const opened = await evaluate(`document.querySelector('.menu-button').getAttribute('aria-expanded')==='true' && document.querySelector('#site-menu').getBoundingClientRect().left<innerWidth`);
      await click('.menu-button'); await delay(350);
      const closed = await evaluate(`document.querySelector('.menu-button').getAttribute('aria-expanded')==='false'`);
      check(`menu-toggle-${width}-${route}`, opened && closed);
    }
    await visit('/ru/news');
    for (const side of ['left','right']) {
      await click('.news-card-trigger'); await delay(150);
      await click('#news-article-title');
      check(`news-inside-stays-${width}-${side}`, await evaluate(`!!document.querySelector('.portal-news-article')`));
      const point = await evaluate(`({x:${side==='left'?'4':'document.documentElement.clientWidth-4'},y:innerHeight/2})`);
      await call('Input.dispatchMouseEvent', {type:'mousePressed',button:'left',clickCount:1,...point});
      await call('Input.dispatchMouseEvent', {type:'mouseReleased',button:'left',clickCount:1,...point});
      await delay(150);
      check(`news-outside-closes-${width}-${side}`, await evaluate(`!document.querySelector('.portal-news-article') && location.pathname==='/ru/news'`));
    }
    const contacts = await evaluate(`['#music .label-mission-cta','#nation .ceremonial-button','#roots .heritage-launch-button','#join .join-contact-cta'].map(s=>({selector:s,href:document.querySelector(s)?.getAttribute('href')}))`);
    check(`engagement-links-${width}`, contacts.every(c=>c.href==='https://t.me/cossacksoftheworldbot'), contacts);
    await visit('/'); await evaluate(`Math.random=()=>.55`);
    await click('#hero .ceremonial-button'); const entry = await waitPlaying();
    check(`entry-starts-music-${width}`, !entry.paused && entry.time > 0 && await evaluate(`location.pathname==='/ru/join'`));
    await evaluate(`Math.random=()=>.8;document.querySelector('audio').dispatchEvent(new Event('ended'))`);
    const ended = await waitPlaying();
    check(`ended-event-advances-${width}`, !ended.paused && ended.src !== entry.src);
  }
  fs.mkdirSync('qa-responsive', { recursive: true });
  fs.writeFileSync('qa-responsive/player-regression.json', JSON.stringify(results, null, 2));
  if (results.some(r => !r.pass)) process.exitCode = 1;
} finally {
  await send('Browser.close').catch(() => {});
  ws.close(); clearInterval(keepAlive);
}
