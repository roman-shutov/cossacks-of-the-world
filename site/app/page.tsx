'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Globe2, Menu, Music2, Volume2, VolumeX } from 'lucide-react';

const acts = [
  ['01', 'Мы — казаки', 'hero'], ['02', 'Нас разделила история', 'history'],
  ['03', 'Но мы не исчезли', 'people'], ['04', 'Казаки — народ', 'nation'],
  ['05', 'Казачий мир', 'world'], ['06', 'Найди свои корни', 'roots'],
  ['07', 'Наша культура жива', 'culture'], ['08', 'Новая музыка', 'music'],
  ['09', 'Казаки сегодня', 'today'], ['10', 'Присоединиться', 'join'],
];
const artists = [
  { name:'РГД', tag:'01 / ДОН', copy:'Ритм земли. Голос поколения.', image:'/images/artist-rgd-alpha-v2.png', position:'center bottom' },
  { name:'BELOBOKA', tag:'02 / НОВЫЙ ФОЛК', copy:'Фольклор, индустриальный звук и новая сцена.', image:'/images/artist-beloboka-alpha-v2.png', position:'center bottom' },
  { name:'YAZHEVIKA', tag:'03 / ГОЛОС', copy:'Сталь, крест и женская сила Дона.', image:'/images/artist-yazhevika-alpha-v2.png', position:'center bottom' },
];
const archivePhotos = Array.from({length:30},(_,i)=>`/images/archive-wall/archive-${String([1,2,3,4,5,27,28,29][i%8]).padStart(2,'0')}.jpg`);
const places = [
  {name:'ДОН',x:53.8,y:36.2,origin:true},
  {name:'МОСКВА',x:52.0,y:28.8},
  {name:'СТАВРОПОЛЬ',x:55.4,y:40.1},
  {name:'КИЕВ',x:46.9,y:34.0},
  {name:'КИТАЙ',x:77.1,y:45.4},
  {name:'США',x:7.8,y:35.5},
  {name:'ЧИЛИ',x:9.2,y:66.5},
  {name:'ФРАНЦИЯ',x:36.9,y:36.9},
];
const donOrigin = places[0];
const worldRoute = (place: typeof places[number]) => {
  const midX=(donOrigin.x+place.x)/2;
  const lift=Math.min(18,Math.abs(place.x-donOrigin.x)*.22+Math.abs(place.y-donOrigin.y)*.08+3);
  return `M${donOrigin.x} ${donOrigin.y} Q${midX} ${Math.min(donOrigin.y,place.y)-lift} ${place.x} ${place.y}`;
};
const ancestors = [
  {n:1,x:25,y:39,ax:34,ay:45},{n:2,x:36,y:29,ax:43,ay:41},
  {n:3,x:48,y:23,ax:49,ay:41},{n:4,x:61,y:29,ax:57,ay:43},
  {n:5,x:73,y:38,ax:64,ay:47},{n:27,x:79,y:49,ax:67,ay:53},
  {n:28,x:59,y:50,ax:55,ay:57},{n:29,x:39,y:51,ax:46,ay:57},
];
const hostCollage = [
  {src:'/images/hosts-collage/don.jpg',label:'ДОНСКИЕ',x:6,y:8,r:-6,w:46},
  {src:'/images/hosts-collage/terek.jpg',label:'ТЕРСКИЕ',x:48,y:4,r:5,w:43},
  {src:'/images/hosts-collage/kuban.jpg',label:'КУБАНСКИЕ',x:3,y:48,r:4,w:42},
  {src:'/images/archive-wall/archive-29.jpg',label:'ЯИЦКИЕ',x:51,y:49,r:-5,w:44},
  {src:'/images/archive-wall/archive-01.jpg',label:'СЕМЬИ',x:29,y:26,r:-2,w:34},
  {src:'/images/archive-wall/archive-02.jpg',label:'СТАНИЦЫ',x:64,y:30,r:7,w:28},
  {src:'/images/archive-wall/archive-03.jpg',label:'ПОКОЛЕНИЯ',x:17,y:67,r:-8,w:31},
  {src:'/images/archive-wall/archive-28.jpg',label:'ОДИН НАРОД',x:38,y:65,r:3,w:36},
];
const songTitles = ['ОЙ, ТО НЕ ВЕЧЕР','ЛЮБО, БРАТЦЫ, ЛЮБО','ЧЁРНЫЙ ВОРОН','ПО ДОНУ ГУЛЯЕТ','КОГДА МЫ БЫЛИ НА ВОЙНЕ','НЕ ДЛЯ МЕНЯ','ИЗ-ЗА ЛЕСА, КОПИЙ И МЕЧЕЙ','РАЗЛИВАЙСЯ, ТИХИЙ ДОН','ТАНЦУЙ И ПОЙ, КАЗАК ЛИХОЙ','НА ЗАРЕ КАЗАК КОНЯ ПОИЛ','ОЙ, ЗА КУБАНОМ ЗА РЕКОЙ','В СТЕПИ ШИРОКОЙ ПОД ИКАНОМ'];
const musicFaces = [
  {src:'/images/living-generations.png',name:'МОСКОВСКИЙ КАЗАЧИЙ ХОР'},
  {src:'/images/nation-starocherkassk.png',name:'КУБАНСКИЙ КАЗАЧИЙ ХОР'},
  {src:'/images/artist-rgd-alpha-v2.png',name:'РГД'},
  {src:'/images/artist-beloboka-alpha-v2.png',name:'BELOBOKA'},
  {src:'/images/artist-yazhevika-alpha-v2.png',name:'YAZHEVIKA'},
  {src:'/images/hosts-collage/don.jpg',name:'КАЗАЧИЙ КУРЕНЬ'},
];

function ShashkaPair({className=''}:{className?:string}) {
  return <img className={`shashka-pair ${className}`} src="/images/shashkas-reference-clean.png" alt="" aria-hidden="true"/>;
}

function CrossedSabres() {
  return <span className="sabres" aria-hidden="true"><span className="sabres-orbit"/><ShashkaPair className="hero-shashkas"/></span>;
}

function TwoSabres() {
  return <span className="join-sabres" aria-hidden="true"><ShashkaPair className="join-shashkas"/></span>;
}

export default function Home() {
  const [scroll, setScroll] = useState(0);
  const [menu, setMenu] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [artist, setArtist] = useState(0);
  const [pointer, setPointer] = useState({x:0,y:0});
  const [soonOpen, setSoonOpen] = useState(false);
  const [focusedAncestor, setFocusedAncestor] = useState<number|null>(null);
  const [nationPointer, setNationPointer] = useState({x:0,y:0});
  const [culturePointer, setCulturePointer] = useState({x:0,y:0});
  const [collagePointer, setCollagePointer] = useState({x:0,y:0});
  const [collageHeld, setCollageHeld] = useState(false);
  const [musicPointer, setMusicPointer] = useState({x:0,y:0});
  const [joinPointer, setJoinPointer] = useState({x:0,y:0});
  const [worldPointer, setWorldPointer] = useState({x:0,y:0});
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const update = () => setScroll(window.scrollY);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => { if (audioRef.current) audioRef.current.volume = .42; }, []);
  useEffect(() => { const timer=window.setInterval(()=>setArtist(v=>(v+1)%artists.length),6500); return()=>window.clearInterval(timer); }, []);
  useEffect(() => {
    if (!soonOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setSoonOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [soonOpen]);
  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenu(false);
  };
  const toggleMusic = async () => {
    const audio = audioRef.current; if (!audio) return;
    if (audio.paused) { try { await audio.play(); setPlaying(true); } catch { setPlaying(false); } }
    else { audio.pause(); setPlaying(false); }
  };
  const enterWorld = async () => { if (!playing) await toggleMusic(); jump('history'); };

  return <main>
    <style>{`.join-scene{min-height:125vh!important;background:#050506!important}.join-cosmic-bg{position:absolute;z-index:0;inset:-6%;width:112%;height:112%;object-fit:cover;filter:contrast(1.08) saturate(.9) brightness(.72);transition:transform .18s ease-out;will-change:transform}.join-cosmic-shade{position:absolute;z-index:1;inset:0;background:radial-gradient(circle at 50% 46%,transparent 0 22%,#04040555 58%),linear-gradient(90deg,#030405d4 0%,transparent 50%,#260b0873),linear-gradient(0deg,#040405d9,transparent 52%)}.join-scene .join-copy{z-index:4!important;inset:16vh 6vw auto!important}.join-scene .join-copy h2{font-size:clamp(58px,8.1vw,132px)!important;text-shadow:0 8px 40px #000;margin-bottom:6vh}.cosmic-join-button{position:relative;display:flex!important;align-items:center;justify-content:center;gap:28px!important;min-width:330px;margin:0 auto!important;padding:14px 34px 14px 16px!important;border:1px solid #f0c68188!important;border-radius:60px!important;background:linear-gradient(105deg,#5f1d16,#b3482a 52%,#5d1d17)!important;overflow:visible!important;box-shadow:0 22px 70px #000b,0 0 44px #d95f3222;letter-spacing:.21em!important;transition:.35s!important}.join-sabres{position:relative;width:74px;height:74px;flex:0 0 74px;border:1px solid #e7bd7b88;border-radius:50%;background:#160b08aa;box-shadow:inset 0 0 22px #000,0 0 26px #e8b96a22}.join-sabres img{position:absolute;left:50%;bottom:-4px;width:92px;height:118px;object-fit:contain;mix-blend-mode:screen;transform:translateX(-50%) scale(1.02);transform-origin:50% 85%;filter:drop-shadow(0 8px 8px #000d);transition:.45s}.cosmic-join-button:hover{transform:translateY(-5px) scale(1.03);box-shadow:0 30px 90px #000d,0 0 54px #e06a3844}.cosmic-join-button:hover .join-sabres img{transform:translateX(-50%) translateY(-6px) scale(1.12);filter:drop-shadow(0 10px 10px #000e) drop-shadow(0 0 9px #ffd08266)}.join-options{display:none!important}.join-orbit{position:absolute;z-index:2;right:5vw;top:11vh;width:24vw;aspect-ratio:1;border:1px solid #f5a26a2b;border-radius:50%;box-shadow:0 0 90px #b72e1722;animation:join-orbit 18s linear infinite}.join-orbit:before,.join-orbit:after{content:"";position:absolute;border:1px solid #f5a26a22;border-radius:50%}.join-orbit:before{inset:17%;transform:rotate(55deg)}.join-orbit:after{inset:38%}@keyframes join-orbit{to{transform:rotate(360deg)}}@media(max-width:700px){.join-scene .join-copy{inset:13vh 5vw auto!important}.cosmic-join-button{min-width:min(330px,90vw)}.join-orbit{width:50vw;right:-12vw}}`}</style>
    <style>{`.shashka-pair{display:block;overflow:visible;filter:drop-shadow(0 7px 7px #000c);transition:transform .45s,filter .45s}.hero-shashkas{position:relative;z-index:2;width:82px!important;height:82px!important;transform:scale(1.12)}.ceremonial-button:hover .hero-shashkas{transform:scale(1.24) translateY(-2px);filter:drop-shadow(0 8px 8px #000d) drop-shadow(0 0 7px #ffc87877)}.join-shashkas{position:absolute;left:50%;bottom:-12px;width:104px!important;height:128px!important;transform:translateX(-50%);transform-origin:50% 85%}.cosmic-join-button:hover .join-shashkas{transform:translateX(-50%) translateY(-6px) scale(1.1);filter:drop-shadow(0 10px 10px #000e) drop-shadow(0 0 9px #ffd08266)}`}</style>
    <style>{`.music-scene{min-height:165vh!important;padding:0!important;background:#070708!important}.music-wall{position:absolute;inset:0;overflow:hidden;background:radial-gradient(circle at 60% 44%,#44271e,#090909 66%)}.music-wall-card{position:absolute;overflow:hidden;border:1px solid #e0bd7a44;box-shadow:0 35px 90px #000c;transition:transform .18s ease-out,filter .5s;will-change:transform}.music-wall-card img{width:100%;height:100%;object-fit:cover;filter:saturate(.68) contrast(1.12) brightness(.65)}.music-wall-card:nth-child(1){left:-4%;top:-4%;width:54%;height:54%}.music-wall-card:nth-child(2){right:-5%;top:-3%;width:57%;height:53%}.music-wall-card:nth-child(3){left:5%;bottom:5%;width:30%;height:48%}.music-wall-card:nth-child(4){left:34%;bottom:-3%;width:31%;height:51%}.music-wall-card:nth-child(5){right:4%;bottom:2%;width:29%;height:48%}.music-wall-card:nth-child(6){left:38%;top:24%;width:26%;height:31%;z-index:3}.music-wall-card:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 45%,#080808e8)}.music-wall-card span{position:absolute;z-index:2;left:18px;bottom:16px;font:9px Arial;letter-spacing:.2em;color:#f0ca87}.music-wall-shade{position:absolute;z-index:4;inset:0;background:linear-gradient(90deg,#050607e8 0%,transparent 58%),linear-gradient(0deg,#050607d9,transparent 47%)}.music-scene .music-copy{position:absolute;z-index:6;left:6vw;top:12vh;max-width:760px}.music-scene .music-copy h2{font-size:clamp(54px,7.5vw,118px)!important}.music-count{display:flex;align-items:baseline;gap:15px;margin-top:4vh;color:#f0ca87}.music-count strong{font:clamp(56px,8vw,112px)/.8 Georgia}.music-count span{font:9px/1.5 Arial;letter-spacing:.2em}.song-river{position:absolute;z-index:7;left:0;right:0;bottom:3vh;overflow:hidden;border-block:1px solid #fff2;background:#080909b8;backdrop-filter:blur(12px)}.song-river-track{display:flex;width:max-content;gap:42px;padding:18px 0;animation:song-flow 38s linear infinite}.song-river span{font:10px Arial;letter-spacing:.18em;color:#e4d8c4aa;white-space:nowrap}.song-river span:after{content:' •';color:#d6a75d;margin-left:42px}@keyframes song-flow{to{transform:translateX(-50%)}}@media(max-width:700px){.music-wall-card:nth-child(1),.music-wall-card:nth-child(2){height:45%}.music-wall-card:nth-child(3),.music-wall-card:nth-child(4),.music-wall-card:nth-child(5){width:43%;height:38%}.music-wall-card:nth-child(3){left:0}.music-wall-card:nth-child(4){left:29%}.music-wall-card:nth-child(5){right:-3%}.music-wall-card:nth-child(6){display:none}.music-scene .music-copy{top:10vh}.music-count{margin-top:2vh}}`}</style>
    <style>{`.hosts-collage-scene{min-height:145vh;padding:15vh 4vw;background:radial-gradient(circle at 50% 40%,#30271d,#080807 68%);display:flex;flex-direction:column;align-items:center}.hosts-collage-heading{position:relative;z-index:4;width:min(1050px,92vw);margin-bottom:5vh;display:flex;justify-content:space-between;align-items:end}.hosts-collage-heading h2{margin:0!important;font-size:clamp(50px,7vw,104px)!important}.hosts-collage-heading p:last-child{max-width:300px;font:15px/1.45 Georgia;color:#d4c8b4aa}.hosts-collage-stage{position:relative;z-index:3;width:min(92vw,1050px);aspect-ratio:1;transform:scale(1);transition:transform .7s cubic-bezier(.16,.85,.2,1);cursor:zoom-in;touch-action:none}.hosts-collage-stage.held{transform:scale(1.09);cursor:zoom-out}.collage-card{position:absolute;margin:0;padding:9px 9px 32px;background:#d9cbb2;box-shadow:0 28px 65px #000b;transition:transform .22s ease-out,filter .45s,box-shadow .45s;will-change:transform;user-select:none}.collage-card img{display:block;width:100%;aspect-ratio:1;object-fit:cover;filter:sepia(.68) grayscale(.28) contrast(1.08);pointer-events:none}.collage-card figcaption{position:absolute;left:12px;bottom:10px;color:#2e261c;font:8px Arial;letter-spacing:.18em}.collage-card:hover{z-index:20!important;filter:brightness(1.04);box-shadow:0 38px 90px #000}.collage-card:hover img{filter:sepia(.15) grayscale(0) contrast(1.04)}.collage-hold-hint{position:absolute;z-index:30;left:50%;bottom:3%;transform:translateX(-50%);padding:12px 18px;border:1px solid #e4c38455;background:#080908b8;backdrop-filter:blur(10px);font:8px Arial;letter-spacing:.22em;color:#e4c384;white-space:nowrap}.hosts-collage-stage.held .collage-hold-hint{opacity:0}@media(max-width:700px){.hosts-collage-heading{align-items:start;flex-direction:column}.hosts-collage-heading p:last-child{display:none}.collage-card{padding:5px 5px 23px}.collage-card figcaption{left:7px;bottom:7px;font-size:6px}}`}</style>
    <style>{`.generation-phrase{position:absolute;z-index:6;left:7vw;bottom:9vh;display:flex;flex-direction:column;gap:5px;padding-left:18px;border-left:1px solid #d8ae6988;font:clamp(17px,1.55vw,24px)/1.25 Georgia;perspective:700px}.generation-phrase span{display:block;width:max-content;max-width:86vw;text-shadow:0 6px 24px #000;transition:transform .18s ease-out,opacity .5s;will-change:transform}.generation-phrase .elders-line{color:#d8d0c2a8}.generation-phrase .young-line{color:#f0c982;font-style:italic}.generations-scene .culture-copy h2{margin-bottom:0}.generations-scene .culture-marquee,.generation-echo{display:none!important}`}</style>
    <style>{`.nation-bg{transition:transform .16s ease-out!important;will-change:transform}.nation-people-layer{position:absolute;z-index:2;inset:-7%;width:114%;height:114%;object-fit:cover;pointer-events:none;will-change:transform;transition:transform .13s ease-out;filter:saturate(.9) contrast(1.06) brightness(.9);mask-image:linear-gradient(to bottom,transparent 0 54%,#000 70% 100%);-webkit-mask-image:linear-gradient(to bottom,transparent 0 54%,#000 70% 100%)}.nation-shade{z-index:3!important}.nation-copy,.nation-emblem,.nation-word{z-index:4!important}`}</style>
    <style>{`.ceremonial-button{overflow:visible!important}.hero-image{background-image:linear-gradient(90deg,#05080de8 0%,#05080d55 42%,#05080d18 75%),url('/images/hero-riders-v4-no-glasses.png')!important}.living-culture,.artist-stage{background-image:none!important}.living-culture:before{background:linear-gradient(90deg,#050708d9 0%,#10151273 44%,#050708b8 100%)!important;background-size:100% 100%!important}.artist-stage:after{top:auto!important;background-image:linear-gradient(to top,#111814d9,transparent)!important}
    .globe-routes{position:absolute;z-index:2;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}.globe-routes path{fill:none;stroke:#ffd18a99;stroke-width:.2;stroke-dasharray:1.2 1.8;filter:drop-shadow(0 0 1.2px #ffb85c);animation:route-flow 7s linear infinite}.route-pulse{fill:#ffe0a0;filter:drop-shadow(0 0 2px #ff9b45)}.world-dot{display:block!important;transform:translate(-50%,-50%)}.world-dot span{position:absolute;left:15px;top:-8px;padding:5px 8px;border:1px solid #ffd18a55;background:#061013e8;color:#ffe1a9;white-space:nowrap;font:7px Arial;letter-spacing:.14em;opacity:0;transform:translateX(-5px);transition:.35s;pointer-events:none}.world-dot:before{content:"";position:absolute;left:8px;top:4px;width:9px;height:1px;background:#ffd18a88;transform-origin:left}.world-dot:hover span,.world-dot.origin span{opacity:1;transform:none}.world-dot:hover{scale:1.65!important}.world-dot.origin{width:13px;height:13px;background:#fff0b9;box-shadow:0 0 10px #fff0b9,0 0 34px #ff8c42,0 0 65px #ff8c4266}.world-dot.origin:after{content:"";position:absolute;inset:-9px;border:1px solid #ffd18a88;border-radius:50%;animation:don-wave 2.2s ease-out infinite}@keyframes route-flow{to{stroke-dashoffset:-30}}@keyframes don-wave{to{transform:scale(2.1);opacity:0}}
    .genealogy-scene{min-height:145vh!important;background:radial-gradient(circle at 69% 48%,#34281b 0,#15110c 34%,#070706 76%)!important}.genealogy-atmosphere{position:absolute;inset:0;background:radial-gradient(ellipse at 68% 75%,#bd783b25,transparent 48%);filter:blur(18px)}.genealogy-object{position:absolute;z-index:2;right:1vw;top:11vh;width:min(76vw,1120px);height:116vh;transform-origin:62% 46%;transition:transform .55s cubic-bezier(.18,.85,.2,1);will-change:transform}.genealogy-tree{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:contrast(1.09) brightness(.82) drop-shadow(0 34px 70px #000b)}.genealogy-links{position:absolute;z-index:5;inset:0;width:100%;height:100%;pointer-events:none}.genealogy-links path{fill:none;stroke:#d8aa6388;stroke-width:.16;stroke-dasharray:.8 .9;filter:drop-shadow(0 0 1px #e8ba72)}.genealogy-links circle{fill:#f2cb82;filter:drop-shadow(0 0 2px #ffb860)}.genealogy-shade{z-index:3!important;pointer-events:none;background:linear-gradient(90deg,#070707ed 0%,#070707a5 28%,transparent 60%),linear-gradient(0deg,#070707c4,transparent 48%)!important}.genealogy-scene .roots-copy{z-index:8!important}.roots-hint{font:italic 15px/1.5 Georgia;color:#d7bd91aa;margin:22px 0}.genealogy-object .ancestor-node{position:absolute!important;z-index:6!important;width:76px!important;height:96px!important;padding:0!important;border:0!important;background:transparent!important;transform:translate(-50%,-50%) rotate(var(--tilt,0deg));box-shadow:none!important;transition:transform .38s cubic-bezier(.18,.9,.2,1),filter .38s!important}.portrait-frame{position:relative;display:block;width:100%;height:100%;padding:7px;background:linear-gradient(145deg,#8e6836,#e1be7a 28%,#4e3218 74%,#c99750);clip-path:polygon(6% 0,94% 0,100% 6%,100% 94%,94% 100%,6% 100%,0 94%,0 6%);box-shadow:0 16px 38px #000c,0 0 0 2px #e7c98f55 inset}.portrait-frame:before{content:"";position:absolute;inset:5px;border:1px solid #1a1008aa;pointer-events:none}.portrait-frame img{display:block;width:100%;height:100%;object-fit:cover;filter:sepia(.72) grayscale(.28) contrast(1.08);transition:filter .38s}.genealogy-object .ancestor-node:nth-of-type(odd){--tilt:-2deg}.genealogy-object .ancestor-node:nth-of-type(even){--tilt:2deg}.genealogy-object .ancestor-node:hover,.genealogy-object .ancestor-node.focused{z-index:20!important;transform:translate(-50%,-50%) scale(1.24) rotate(0)!important;filter:drop-shadow(0 20px 28px #000)}.genealogy-object .ancestor-node:hover img,.genealogy-object .ancestor-node.focused img{filter:sepia(.12) grayscale(0) contrast(1.03)}.genealogy-scene.is-focusing .tree-lamp{animation:lamp-flicker .18s infinite alternate;opacity:1}.genealogy-scene.is-focusing .genealogy-tree{filter:contrast(1.12) brightness(.9) drop-shadow(0 38px 80px #000c)}@media(max-width:800px){.genealogy-object{right:-34vw;top:20vh;width:135vw;height:100vh}.genealogy-object .ancestor-node{width:58px!important;height:74px!important}.genealogy-scene .roots-copy{top:8vh!important}.roots-hint{display:none}}`}</style>
    <audio ref={audioRef} src="/audio/stal-i-krest.mp3" loop preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} />
    <div className="progress" style={{ transform: `scaleX(${Math.min(1, scroll / 7500)})` }} />
    <header className="topbar">
      <button className="brand" onClick={() => jump('hero')} aria-label="К началу"><span className="brand-mark">К</span><span>КАЗАКИ<br/>ВСЕГО МИРА</span></button>
      <nav className="quick-nav" aria-label="Быстрые главы">{acts.slice(0,7).map(([n,,id])=><button key={id} onClick={()=>jump(id)}>{n}</button>)}</nav>
      <div className="topline" />
      <div className="top-actions"><button>RU <span>/ EN</span></button><button className={`sound ${playing?'is-playing':'is-muted'}`} onClick={toggleMusic} aria-label={playing?'Выключить музыку':'Включить музыку'} aria-pressed={playing} title={playing?'Музыка включена — нажмите, чтобы выключить':'Музыка выключена — нажмите, чтобы включить'}>{playing?<Volume2 size={17}/>:<VolumeX size={17}/>}<i/></button><button className="menu-button" onClick={() => setMenu(!menu)}><Menu size={18}/> ОГЛАВЛЕНИЕ</button></div>
    </header>
    <aside className={`chapter-menu ${menu ? 'open' : ''}`}>
      <div className="menu-label">ОГЛАВЛЕНИЕ / АКТЫ</div>
      {acts.map(([n, title, id]) => <button key={id} onClick={() => jump(id)}><span>{n}</span>{title}</button>)}
    </aside>

    <section id="hero" className="scene hero">
      <div className="hero-image parallax" style={{ transform: `translate3d(0,${scroll * .18}px,0) scale(${1 + scroll * .00008})` }} />
      <div className="hero-haze" style={{ transform: `translateY(${scroll * .35}px)` }} />
      <img className="hero-grass-object" src="/images/steppe-foreground.png" alt="" style={{ transform: `translateY(${scroll * -.05}px) scale(1.08)` }} />
      <div className="hero-copy" style={{ transform: `translateY(${scroll * .12}px)`, opacity: Math.max(.12, 1-scroll/850) }}>
        <p className="eyebrow">МЕЖДУНАРОДНЫЙ ЦИФРОВОЙ ЦЕНТР КАЗАЧЕСТВА</p>
        <h1>КАЗАКИ<br/><em>ВСЕГО</em> МИРА</h1><p className="hero-en">COSSACKS OF THE WORLD</p>
        <div className="hero-bottom"><p>Один народ.<br/>Одна память.<br/>Один мир.</p><button className="ceremonial-button" onClick={enterWorld}><CrossedSabres/><span>ВОЙТИ В НАШ МИР<small>НАЧАТЬ ИСТОРИЮ</small></span><ArrowDown size={18}/></button></div>
      </div><div className="act-stamp"><span>АКТ</span><strong>I</strong></div>
    </section>
    <nav className="act-strip" aria-label="Главы"><span>ПРОЛИСТЫВАЙТЕ ИСТОРИЮ</span>{acts.slice(0,5).map(([n,t,id])=><button key={id} onClick={()=>jump(id)}><b>{n}</b>{t}</button>)}</nav>

    <section id="history" className="scene history-scene">
      <div className="history-bg parallax" style={{ transform: `translateY(${Math.max(-120,(scroll-850)*.08)}px) scale(1.08)` }}/>
      <div className="history-rider-depth" style={{transform:`translate3d(${Math.max(0,Math.min(18,(scroll-850)*.018))}vw,${Math.max(-20,Math.min(55,(scroll-850)*.07))}px,0) scale(${Math.max(.58,1-(scroll-850)*.00042)})`}}/>
      <div className="history-window" style={{transform:`translate3d(${Math.max(-9,Math.min(0,(scroll-760)*.012))}vw,${Math.max(-16,Math.min(10,(scroll-900)*-.012))}px,0)`}}><div className="history-woman"/></div>
      <div className="history-echo echo-one" style={{transform:`translate3d(${Math.max(-52,Math.min(10,(scroll-920)*.07))}vw,0,0)`}}/>
      <div className="history-echo echo-two" style={{transform:`translate3d(${Math.max(-62,Math.min(14,(scroll-1080)*.08))}vw,0,0)`}}/>
      <svg className="history-lightning" viewBox="0 0 600 900" aria-hidden="true"><path d="M366 0 250 278l92 6-168 277 112-28-118 367 252-430-102 18 155-311-98 15L458 0"/></svg>
      <div className="storm-flash" aria-hidden="true"/>
      <div className="paper paper-one" style={{ transform:`translate3d(0,${(scroll-1000)*-.035}px,0) rotate(-6deg)` }}>1919<br/><small>Письмо домой</small></div>
      <div className="paper paper-two" style={{ transform:`translate3d(0,${(scroll-1000)*.055}px,0) rotate(4deg)` }}>РОСТОВЪ<br/><small>Архив семьи</small></div>
      <div className="scene-copy left"><p className="chapter">АКТ II / ИСТОРИЯ</p><h2>НАС РАЗДЕЛИЛА<br/><i>ИСТОРИЯ</i></h2><p className="lead">Революции. Войны. Эмиграция.<br/>Поезда уходили, корабли исчезали за горизонтом, матери ждали.</p><blockquote>«История разбросала нас по миру»</blockquote></div>
    </section>
    <section id="people" className="scene people-scene">
      <div className="archive-wall">{archivePhotos.map((src,i)=><img key={i} src={src} alt="Историческая фотография казаков" style={{transform:`translate3d(${((i%6)-2.5)*Math.max(-9,Math.min(9,(scroll-1900)*.004))}px,${((i%5)-2)*Math.max(-16,Math.min(16,(scroll-1900)*.007))}px,0) rotate(${(i%7)-3}deg)`}}/>)}</div><div className="people-vignette"/>
      <div className="scene-copy center"><p className="chapter">АКТ III / ЛЮДИ</p><h2>НО МЫ<br/><i>НЕ ИСЧЕЗЛИ</i></h2><div className="memory-lines"><span style={{transform:`translateX(${Math.max(-80,Math.min(0,(scroll-1900)*.08-80))}px)`}}>Мы сохранили память.</span><span style={{transform:`translateX(${Math.max(0,80-(scroll-2020)*.08)}px)`}}>Мы сохранили песни.</span><span style={{transform:`translateX(${Math.max(-80,Math.min(0,(scroll-2140)*.08-80))}px)`}}>Мы сохранили имена.</span><strong style={{transform:`scale(${Math.max(.72,Math.min(1,(scroll-2200)/480))})`}}>Мы сохранили себя.</strong></div></div>
      <div className="counter"><strong>∞</strong><span>ИСТОРИЙ<br/>ОДНОГО НАРОДА</span></div>
    </section>
    <section id="nation" className="scene nation-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setNationPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setNationPointer({x:0,y:0})}>
      <img className="nation-bg" src="/images/nation-starocherkassk.png" alt="Казаки в Старочеркасске получают благословение" style={{transform:`translate3d(${nationPointer.x*-22}px,${Math.max(-48,Math.min(48,(scroll-3000)*-.025))+nationPointer.y*-13}px,0) scale(1.12)`}}/>
      <img className="nation-people-layer" src="/images/nation-starocherkassk.png" alt="" style={{transform:`translate3d(${nationPointer.x*18}px,${nationPointer.y*10}px,0) scale(1.125)`}}/>
      <div className="nation-shade"/><div className="nation-emblem"><span>☦</span><b>ВСЕВЕЛИКОЕ<br/>ВОЙСКО ДОНСКОЕ</b></div>
      <div className="nation-copy"><p className="chapter">АКТ IV / САМОИДЕНТИФИКАЦИЯ</p><h2>КАЗАКИ —<br/><i>НАРОД</i></h2><p>Не декорация. Не сословная тень. Живое сообщество поколений, памяти, веры и земли.</p><button>СЛАВА БОГУ, МЫ КАЗАКИ <ArrowUpRight size={18}/></button></div><div className="nation-word">НАРОД</div>
    </section>
    <section id="world" className="scene world-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setWorldPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setWorldPointer({x:0,y:0})}>
      <div className="real-globe" style={{transform:`translate3d(${worldPointer.x*14}px,${Math.sin(scroll*.003)*7+worldPointer.y*10}px,0) rotateX(${worldPointer.y*-1.3}deg) rotateY(${worldPointer.x*1.6}deg) scale(${1+Math.max(0,Math.min(.09,(scroll-3900)*.00006))})`}}>
        <img className="globe-surface" src="/images/earth-globe-orthographic.png" alt="Объёмный глобус казачьего мира" style={{transform:`translate3d(${worldPointer.x*-3}px,${worldPointer.y*-2}px,0) scale(1.015)`}}/><div className="globe-shine" style={{transform:`translate3d(${worldPointer.x*-7}px,${worldPointer.y*-5}px,0)`}}/>
        <div className="globe-map-overlay" style={{transform:`translate3d(${worldPointer.x*6}px,${worldPointer.y*4}px,0)`}}>
          <svg className="globe-routes" viewBox="0 0 100 100" aria-hidden="true">
            <defs><marker id="route-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" className="route-arrow-head"/></marker></defs>
            {places.slice(1).map((place,i)=><g key={place.name}><path id={`route-${i}`} d={worldRoute(place)} markerEnd="url(#route-arrow)"/><circle className="route-pulse" r=".48"><animateMotion dur={`${4.8+i*.55}s`} begin={`${i*-.7}s`} repeatCount="indefinite" path={worldRoute(place)}/></circle></g>)}
          </svg>
          {places.map((place,i)=><i key={place.name} className={`world-dot ${place.origin?'origin':''}`} title={place.name} style={{left:`${place.x}%`,top:`${place.y}%`,animationDelay:`${i*.42}s`}}><span>{place.name}</span></i>)}
        </div>
      </div>
      <div className="scene-copy left"><p className="chapter">АКТ V / КАЗАЧИЙ МИР</p><h2>МЫ ЖИВЁМ<br/><i>ПО ВСЕМУ МИРУ</i></h2><p className="lead">Страна → община → человек → история.<br/>Карта наполняется только подтверждёнными историями.</p><button className="outline" onClick={()=>setSoonOpen(true)}>Я КАЗАК. ДОБАВИТЬ СЕБЯ <ArrowUpRight size={18}/></button></div>
      <div className="world-list">{places.map(place=><span key={place.name}>{place.name}</span>)}</div>
    </section>
    <section id="roots" className={`scene genealogy-scene ${focusedAncestor!==null?'is-focusing':''}`}>
      <div className="genealogy-atmosphere"/><div className="genealogy-shade"/><div className="tree-lamp"/>
      <div className="genealogy-object" style={{transform:`translate3d(${focusedAncestor===null?0:(50-ancestors[focusedAncestor].x)*1.2}px,${Math.max(-62,Math.min(62,(scroll-4700)*.045))+(focusedAncestor===null?0:(44-ancestors[focusedAncestor].y)*.7)}px,0) scale(${focusedAncestor===null?1:1.1})`}}>
        <img className="genealogy-tree" src="/images/genealogy-tree-clean.png" alt="Чистое генеалогическое древо казачьих семей"/>
        <svg className="genealogy-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{ancestors.map((a,i)=><g key={`link-${a.n}`}><path d={`M${a.ax} ${a.ay} Q${(a.ax+a.x)/2} ${Math.min(a.ay,a.y)-2} ${a.x} ${a.y}`}/><circle cx={a.ax} cy={a.ay} r=".45"/><circle cx={a.x} cy={a.y} r=".32"/></g>)}</svg>
        {ancestors.map((a,i)=><button key={a.n} className={`ancestor-node ${focusedAncestor===i?'focused':''}`} style={{left:`${a.x}%`,top:`${a.y}%`}} onMouseEnter={()=>setFocusedAncestor(i)} onMouseLeave={()=>setFocusedAncestor(null)} onFocus={()=>setFocusedAncestor(i)} onBlur={()=>setFocusedAncestor(null)} aria-label={`Открыть фотографию семьи ${i+1}`}><span className="portrait-frame"><img src={`/images/archive-wall/archive-${String(a.n).padStart(2,'0')}.jpg`} alt="Фотография предка"/></span></button>)}
      </div>
      <div className="roots-copy"><p className="chapter">АКТ VI / РОДОВАЯ ПАМЯТЬ</p><h2>КАЖДАЯ СЕМЬЯ —<br/><i>ЧАСТЬ ОБЩЕЙ ИСТОРИИ</i></h2><p className="roots-hint">Наведите на портрет — древо приблизит выбранную ветвь.</p><div className="search-box">ФАМИЛИЯ / СТАНИЦА / МЕСТО <button>НАЙТИ КОРНИ</button></div></div>
    </section>
    <section id="culture" className="scene generations-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setCulturePointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setCulturePointer({x:0,y:0})}>
      <img className="generations-bg" src="/images/living-generations.png" alt="Смена поколений живой казачьей культуры" style={{transform:`translate3d(${culturePointer.x*-16}px,${Math.max(-42,Math.min(42,(scroll-5600)*-.02))+culturePointer.y*-10}px,0) scale(1.11)`}}/><div className="generations-shade"/>
      <div className="culture-copy"><p className="chapter">АКТ VII / СЕГОДНЯ</p><h2>НЕ МУЗЕЙ.<br/><i>ЖИВАЯ КУЛЬТУРА.</i></h2></div>
      <div className="generation-phrase"><span className="elders-line" style={{transform:`translate3d(${culturePointer.x*8}px,${culturePointer.y*4+Math.max(-7,Math.min(7,(scroll-5600)*-.004))}px,0)`}}>Старшие передают память.</span><span className="young-line" style={{transform:`translate3d(${culturePointer.x*16}px,${culturePointer.y*8+Math.max(-10,Math.min(10,(scroll-5600)*.006))}px,12px)`}}>Молодые берут её в будущее.</span></div>
    </section>
    <section id="hosts" className="scene hosts-collage-scene">
      <div className="hosts-collage-heading"><div><p className="chapter">АРХИВ / КАЗАЧЬИ ЛИНИИ</p><h2>ДЕРЖИМСЯ<br/><i>ВМЕСТЕ</i></h2></div><p>Дон. Терек. Кубань. Яик. Разные земли — одна память.</p></div>
      <div className={`hosts-collage-stage ${collageHeld?'held':''}`} onPointerMove={event=>{const r=event.currentTarget.getBoundingClientRect();setCollagePointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);setCollageHeld(true)}} onPointerUp={()=>setCollageHeld(false)} onPointerCancel={()=>setCollageHeld(false)} onPointerLeave={()=>{setCollageHeld(false);setCollagePointer({x:0,y:0})}}>
        {hostCollage.map((item,i)=><figure key={`${item.label}-${i}`} className="collage-card" style={{left:`${item.x}%`,top:`${item.y}%`,width:`${item.w}%`,zIndex:i+1,transform:`translate3d(${collagePointer.x*((i%3)-1)*18}px,${collagePointer.y*((i%4)-1.5)*13}px,${i*2}px) rotate(${item.r}deg) scale(${collageHeld?1.025:1})`}}><img src={item.src} alt={`${item.label.toLowerCase()} казаки — архивная фотография`}/><figcaption>{item.label}</figcaption></figure>)}
        <div className="collage-hold-hint">УДЕРЖИВАЙТЕ, ЧТОБЫ ПРИБЛИЗИТЬ</div>
      </div>
    </section>
    <section id="artists" className="scene living-culture">
      <div className="living-heading"><p className="chapter">ЛИЦА / ГОЛОСА / ХАРАКТЕР</p><h2>ТЕ, КТО<br/><i>ДЕЛАЕТ СЕЙЧАС</i></h2><p>Новые песни и живые образы казачьего мира.</p></div>
      <div className="artist-stage" onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();setPointer({x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setPointer({x:0,y:0})}>
        <img className="artist-stage-bg" src="/images/don-steppe-parallax.png" alt="" style={{transform:`translate3d(${pointer.x*-70}px,${pointer.y*-42}px,0) scale(1.12)`}}/>
        {artists.map((a,i)=><img key={a.name} className={`artist-stage-person ${artist===i?'active':''}`} src={a.image} alt={a.name} style={{objectPosition:a.position,transform:`translate3d(${pointer.x*12}px,${pointer.y*8}px,0) scale(1.01)`}}/>)}
        <div className="artist-stage-fog fog-back" style={{transform:`translate3d(${pointer.x*-24}px,${pointer.y*-8}px,0)`}}/><div className="artist-stage-fog fog-front" style={{transform:`translate3d(${pointer.x*36}px,${pointer.y*14}px,0)`}}/>
        <div className="artist-stage-copy"><span>{artists[artist].tag}</span><h3>{artists[artist].name}</h3><p>{artists[artist].copy}</p></div>
        <div className="artist-tabs">{artists.map((a,i)=><button key={a.name} className={artist===i?'active':''} onClick={()=>setArtist(i)}><b>0{i+1}</b>{a.name}</button>)}</div>
        <div className="artist-cursor-note">ДВИГАЙТЕ МЫШЬ · ПАРАЛЛАКС</div>
      </div>
      <div className="papakha-film" style={{ transform:`translateY(${Math.max(-45,Math.min(45,(scroll-6100)*.02))}px)` }}><img src="/images/hero-riders.png" alt="Казаки в донских и терских папахах"/><span>ДОНСКАЯ И ТЕРСКАЯ ЛИНИЯ</span></div>
    </section>
    <section id="music" className="scene music-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setMusicPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setMusicPointer({x:0,y:0})}>
      <div className="music-wall">{musicFaces.map((item,i)=><figure key={item.name} className="music-wall-card" style={{transform:`translate3d(${musicPointer.x*((i%3)-1)*34}px,${musicPointer.y*((i%2)-.5)*28}px,0) scale(${1.03+i*.004})`}}><img src={item.src} alt={item.name}/><span>{item.name}</span></figure>)}<div className="music-wall-shade"/></div>
      <div className="music-copy"><p className="chapter">АКТ VIII / ГОЛОСА</p><h2>МЫ НЕ ТОЛЬКО<br/>ХРАНИМ ПЕСНИ.<br/><i>МЫ СОЗДАЁМ НОВЫЕ.</i></h2><div className="music-count"><strong>100+</strong><span>ПЕСЕН<br/>ОДНОЙ ЖИВОЙ ТРАДИЦИИ</span></div></div>
      <div className="song-river"><div className="song-river-track">{[...songTitles,...songTitles].map((title,i)=><span key={`${title}-${i}`}>{title}</span>)}</div></div>
    </section>
    <section id="today" className="scene today-scene"><p className="chapter">АКТ IX / МЕДИА</p><h2>КАЗАКИ<br/><i>СЕГОДНЯ</i></h2><div className="news-grid"><article><span>WORLD / ИСТОРИИ</span><h3>История одной семьи соединяет три страны</h3><p>Редакционная история — только после проверки источников.</p></article><article><span>MUSIC / РЕЛИЗЫ</span><h3>Новая музыка казачьего мира</h3></article><article><span>ARCHIVE / ПАМЯТЬ</span><h3>Документы возвращают забытые имена</h3></article></div></section>
    <section id="join" className="scene join-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setJoinPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setJoinPointer({x:0,y:0})}>
      <img className="join-cosmic-bg" src="/images/join-mars-cossacks.png" alt="Казаки собираются вместе под космическим небом" style={{transform:`translate3d(${joinPointer.x*-24}px,${joinPointer.y*-14}px,0) scale(1.08)`}}/><div className="join-cosmic-shade"/><div className="join-orbit"/>
      <div className="join-copy"><p className="chapter">ФИНАЛ / МЫ НАХОДИМ ДРУГ ДРУГА</p><h2>НАС РАЗБРОСАЛА ИСТОРИЯ.<br/><i>ТЕПЕРЬ МЫ ВМЕСТЕ.</i></h2><button className="cosmic-join-button" onClick={()=>setSoonOpen(true)}><TwoSabres/><span>ПРИСОЕДИНИТЬСЯ</span></button></div>
    </section>
    <footer><div className="brand-mark">К</div><p>КАЗАКИ ВСЕГО МИРА<br/><small>COSSACKS OF THE WORLD</small></p><span>© 2026 / ЦИФРОВОЙ МИРОВОЙ ЦЕНТР КАЗАЧЕСТВА</span></footer>
    {soonOpen && <div className="soon-overlay" onMouseDown={event=>{if(event.target===event.currentTarget)setSoonOpen(false)}} role="presentation">
      <section className="soon-dialog" role="dialog" aria-modal="true" aria-labelledby="soon-title">
        <div className="soon-emblem">К</div><p className="chapter">КАЗАЧИЙ МИР / СКОРО</p>
        <h2 id="soon-title">СКОРО!</h2>
        <p>Здесь вы сможете объединить казаков со всего мира, рассказать историю своей семьи и найти земляков.</p>
        <strong>СЛАВА БОГУ, МЫ КАЗАКИ!</strong>
        <button autoFocus onClick={()=>setSoonOpen(false)}>OK</button>
      </section>
    </div>}
  </main>;
}
