import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';

const base=process.env.AUDIT_URL || 'http://localhost:3141';
const output=path.resolve('qa-responsive');fs.mkdirSync(output,{recursive:true});
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'cossacks-responsive-'));
const chrome=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',[
  '--headless=new','--disable-gpu','--mute-audio','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'
],{stdio:['ignore','ignore','pipe'],windowsHide:true});
let stderr='';chrome.stderr.on('data',data=>stderr+=data);
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let endpoint;
for(let i=0;i<150;i++){endpoint=stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1];if(endpoint)break;await delay(100);}
if(!endpoint)throw Error('Chrome did not provide CDP endpoint: '+stderr);
const socket=new WebSocket(endpoint);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject});
const keepAlive=setInterval(()=>{},1000);
let id=0;const pending=new Map();
socket.onmessage=e=>{const result=JSON.parse(e.data);if(result.id){const task=pending.get(result.id);if(task){pending.delete(result.id);result.error?task.reject(Error(JSON.stringify(result.error))):task.resolve(result.result)}}};
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const msg={id:++id,method,params,...(sessionId?{sessionId}:{})};const timeout=setTimeout(()=>reject(Error('CDP timeout: '+method)),20000);pending.set(id,{resolve:r=>{clearTimeout(timeout);resolve(r)},reject:e=>{clearTimeout(timeout);reject(e)}});socket.send(JSON.stringify(msg))})}
const {targetId}=await send('Target.createTarget',{url:'about:blank'});
const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
const call=(method,params={})=>send(method,params,sessionId);
await call('Page.enable');await call('Runtime.enable');
const evaluate=async expression=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value};
const sizes=[[320,740],[360,800],[375,812],[390,844],[412,915],[430,932],[768,1024],[820,1180],[1024,1366],[1024,768],[1180,820],[1366,1024],[1280,720],[1366,768],[1440,900],[1536,864],[1600,900],[1920,1080],[2560,1440],[3840,2160],[3834,1959],[3800,1958],[3440,1440],[5120,1440],[1000,1000],[900,1200],[844,390]];
const allRoutes=['/','/ru/news','/ru/history','/ru/label','/ru/heritage','/ru/about','/ru/join','/ru/news/kazachya-stanitsa-moskva-2026'];
const routes=process.env.AUDIT_ROUTES?allRoutes.filter(r=>process.env.AUDIT_ROUTES.split(',').includes(r)):allRoutes;
const sample=process.argv.includes('--sample');
const chosen=sample?[[390,844],[1366,768],[1920,1080],[3834,1959]]:sizes;
const results=[];
const measure=`(() => {
 const visible=e=>!!e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&Number(getComputedStyle(e).opacity)!==0;
 const bounds=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom,right:r.right}};
 const scenes=[...document.querySelectorAll('main>section.scene,.battle-chronicle')].filter(visible).filter(e=>!(e.id==='artists'&&document.querySelector('main').classList.contains('portal-view-history')));
 const issues=[];
 const hero=document.querySelector('#hero'), heroArt=document.querySelector('#hero .hero-image');
 if(hero&&heroArt&&visible(hero)){
  const scene=hero.getBoundingClientRect(),art=heroArt.getBoundingClientRect();
  if(art.left>scene.left+1||art.top>scene.top+1||art.right<scene.right-1||art.bottom<scene.bottom-1)issues.push({kind:'hero-background-gap',scene:bounds(hero),art:bounds(heroArt)});
 }
 const text=[...document.querySelectorAll('h1,h2,h3,h4,p,.chapter,.eyebrow,.ceremonial-button,.heritage-launch-button,.artist-tabs button,.track-controls button,.menu-button')].filter(visible);
 for(const e of text){const r=e.getBoundingClientRect();const scene=e.closest('.scene');const s=scene?.getBoundingClientRect();const scrollRegion=e.closest('.portal-news-article,.chapter-menu,.photo-lightbox');if(scrollRegion)continue;
 if(r.x < -1 || r.right>innerWidth+1)issues.push({kind:'horizontal',selector:e.className||e.tagName,text:e.textContent.slice(0,55),...bounds(e)});
 if(s&&(r.bottom>s.bottom+2||r.top<s.top-2))issues.push({kind:'scene-clip',scene:scene.id,text:e.textContent.slice(0,55),...bounds(e)});
 if(e.scrollWidth>e.clientWidth+2&&e.clientWidth>0)issues.push({kind:'text-overflow',text:e.textContent.slice(0,55),width:e.clientWidth,scroll:e.scrollWidth});
 }
 const header=document.querySelector('.topbar');const first=scenes[0];const footer=document.querySelector('footer');
 if(document.documentElement.scrollWidth>innerWidth+1)issues.push({kind:'page-overflow',scroll:document.documentElement.scrollWidth,width:innerWidth});
 if(first&&first.getBoundingClientRect().top<header.getBoundingClientRect().bottom-1)issues.push({kind:'header-overlap'});
 if(first&&first.getBoundingClientRect().bottom<innerHeight-1)issues.push({kind:'short-first-scene',bottom:first.getBoundingClientRect().bottom});
 if(innerWidth>=1280&&innerHeight>=720&&innerWidth/innerHeight>1.2){
  for(const e of scenes)if(Math.abs(e.getBoundingClientRect().height-(innerHeight-header.offsetHeight))>2)issues.push({kind:'desktop-scene-height',scene:e.id,height:e.getBoundingClientRect().height,expected:innerHeight-header.offsetHeight});
 }
 const overlap=(a,b)=>{const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return Math.min(x.right,y.right)-Math.max(x.left,y.left)>2&&Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top)>2};
 for(const [a,b] of [['.living-heading','.artist-stage-copy'],['.artist-stage-copy','.artist-tabs'],['.artist-portrait','.artist-stage-copy'],['.artist-portrait','.living-heading'],['.battle-copy','.battle-rail']]){const x=document.querySelector(a),y=document.querySelector(b);if(x&&y&&visible(x)&&visible(y)&&overlap(x,y))issues.push({kind:'content-overlap',a,b})}
 const controls=[...document.querySelectorAll('.track-controls button,.menu-button')].map(e=>({...bounds(e),visible:visible(e)}));
 if(controls.some(r=>!r.visible||r.x<0||r.right>innerWidth||r.h<44||r.w<44))issues.push({kind:'header-control-target'});
 return {viewport:[innerWidth,innerHeight],header:bounds(header),scenes:scenes.map(e=>({id:e.id,...bounds(e)})),footer:bounds(footer),controls,issues};
})()`;
try{
for(const [w,h] of chosen){
 await call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<=700});
 await call('Emulation.setTouchEmulationEnabled',{enabled:w<=700});
 for(const route of routes){
   await call('Page.navigate',{url:base+route});
   const wanted=route==='/'?'home':route.split('/')[2];
   for(let retry=0;retry<100;retry++){await delay(60);if(await evaluate(`document.querySelector('main')?.classList.contains('portal-view-${wanted}') && document.readyState==='complete'`))break;}
   await evaluate('document.fonts.ready');await delay(70);
   const metrics=await evaluate(measure);
   metrics.route=route;results.push(metrics);
   const stateSelector=route==='/ru/label'?'.artist-tabs button':route==='/ru/history'?'.battle-rail button':null;
   if(stateSelector){metrics.states=[];const count=await evaluate(`document.querySelectorAll('${stateSelector}').length`);for(let state=0;state<count;state++){await evaluate(`document.querySelectorAll('${stateSelector}')[${state}].click()`);await delay(30);const m=await evaluate(measure);metrics.states.push({state,issues:m.issues});for(const issue of m.issues)if(!metrics.issues.some(i=>JSON.stringify(i)===JSON.stringify(issue)))metrics.issues.push({...issue,state});}await evaluate(`document.querySelector('${stateSelector}').click()`);await delay(50);}
   if(sample||([390,768,900,1000,1366,1920,3840,3834].includes(w)&&!route.includes('kazachya-'))){
     for(const scene of metrics.scenes){
       await evaluate(`document.getElementById('${scene.id}').scrollIntoView({behavior:'instant',block:'start'})`);await delay(80);
       await evaluate(`Promise.all([...document.images].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.top<innerHeight&&r.bottom>0}).map(e=>e.decode().catch(()=>null)))`);
       const alignment=await evaluate(`document.getElementById('${scene.id}').getBoundingClientRect().top-document.querySelector('.topbar').getBoundingClientRect().bottom`);
       if(Math.abs(alignment)>2)metrics.issues.push({kind:'scroll-alignment',scene:scene.id,offset:alignment});
       const {data}=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
       fs.writeFileSync(path.join(output,`${w}x${h}-${wanted}-${scene.id}.png`),Buffer.from(data,'base64'));
     }
   }
 }
 console.log(`${w}x${h}: ${results.slice(-routes.length).reduce((n,r)=>n+r.issues.length,0)} issues`);
}
const reportPath=path.join(output,sample?'sample.json':'results.json');
const key=r=>`${r.viewport.join('x')}:${r.route}`;
const merged=process.env.AUDIT_ROUTES&&fs.existsSync(reportPath)?new Map(JSON.parse(fs.readFileSync(reportPath,'utf8')).map(r=>[key(r),r])):new Map();
for(const r of results)merged.set(key(r),r);
fs.writeFileSync(reportPath,JSON.stringify([...merged.values()],null,2));
const interactions=[];
const check=(name,pass,details={})=>interactions.push({name,pass,...details});
const visit=async route=>{await call('Page.navigate',{url:base+route});for(let n=0;n<100;n++){await delay(50);if(await evaluate(`document.querySelector('.topbar')&&document.readyState==='complete'`))break;}await delay(100)};
for(const [width,height] of [[390,844],[1920,1080]]){
 await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<700});
 await visit('/');await evaluate(`document.querySelector('.menu-button').click()`);await delay(80);
 check(`menu-${width}`,await evaluate(`document.querySelector('.chapter-menu').classList.contains('open')`));
 await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))`);await delay(80);
 check(`menu-escape-${width}`,await evaluate(`!document.querySelector('.chapter-menu').classList.contains('open')`));
 await evaluate(`document.querySelector('audio').volume=0;document.querySelector('#hero .ceremonial-button').click()`);await delay(500);
 check(`home-cta-${width}`,await evaluate(`location.pathname==='/ru/join'&&document.querySelectorAll('audio').length===1`));
 await evaluate(`document.querySelector('audio').pause()`);
 await visit('/ru/news');await evaluate(`document.querySelector('.news-card-trigger').click()`);await delay(100);
 check(`article-frame-${width}`,await evaluate(`(()=>{const a=document.querySelector('.portal-news-article');const r=a?.getBoundingClientRect();return !!r&&r.top>=document.querySelector('.topbar').offsetHeight&&r.bottom<=innerHeight&&getComputedStyle(a).overflowY==='auto'})()`));
 await evaluate(`document.querySelector('.news-back').click()`);await delay(100);
 check(`article-back-${width}`,await evaluate(`document.querySelectorAll('.news-card-trigger').length===3&&!document.querySelector('.portal-news-article')`));
 await visit('/');let prior=await evaluate(`document.querySelector('audio').getAttribute('src')`);let randomOk=true;
 for(let i=0;i<20;i++){await evaluate(`document.querySelector('[aria-label="Следующая случайная песня"]').click()`);await delay(35);const next=await evaluate(`document.querySelector('audio').getAttribute('src')`);randomOk&&=next!==prior;prior=next;}
 check(`random-no-consecutive-repeat-${width}`,randomOk);
}
await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await visit('/');
check('reduced-motion',await evaluate(`getComputedStyle(document.querySelector('.hero-image')).transform==='none'`));
const source=fs.readFileSync('app/page.tsx','utf8');const songs=[...source.matchAll(/src:'(\/audio\/[^']+)'/g)].map(m=>m[1]);
const audioChecks=await Promise.all(songs.map(async src=>({src,status:(await fetch(base+src,{method:'HEAD'})).status})));
check('18-local-tracks-available',songs.length===18&&audioChecks.every(a=>a.status===200),{tracks:audioChecks});
fs.writeFileSync(path.join(output,'interactions.json'),JSON.stringify(interactions,null,2));
console.log(JSON.stringify({interactions:interactions.length,failed:interactions.filter(i=>!i.pass)}));
console.log(JSON.stringify({cases:results.length,issues:results.filter(r=>r.issues.length).map(r=>({route:r.route,viewport:r.viewport,issues:r.issues})),output}));
}finally{await send('Browser.close').catch(()=>{});socket.close();clearInterval(keepAlive);}
