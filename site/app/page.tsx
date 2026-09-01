'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Globe2, Menu, Music2, Volume2, VolumeX } from 'lucide-react';

const acts = [
  ['01', 'Кто мы', 'hero'], ['02', 'Разделённая история', 'history'],
  ['03', 'Архив и память', 'people'], ['04', 'Казаки сегодня', 'culture'],
  ['05', 'Мы по всему миру', 'world'], ['06', 'Семьи и родословные', 'roots'],
  ['07', 'Песенная традиция', 'music'], ['08', 'Современные голоса', 'artists'],
  ['09', 'Войска и служба', 'battle'], ['10', 'Присоединиться', 'join'],
];
const artists = [
  { name:'РГД', tag:'01 / ДОН', copy:'Ритм земли. Голос поколения.', image:'/images/artist-rgd-alpha-v2.png', position:'center bottom' },
  { name:'BELOBOKA', tag:'02 / НОВЫЙ ФОЛК', copy:'Фольклор, индустриальный звук и новая сцена.', image:'/images/artist-beloboka-alpha-v2.png', position:'center bottom' },
  { name:'YAZHEVIKA', tag:'03 / ГОЛОС', copy:'Сталь, крест и женская сила Дона.', image:'/images/artist-yazhevika-alpha-v2.png', position:'center bottom' },
];
const playlist = [
  {src:'/audio/stal-i-krest.mp3', title:'Сталь и крест'},
  {src:'/audio/alaya-noch-rock.mp3', title:'Алая Ночь Рок'},
  {src:'/audio/alaya-noch.mp3', title:'Алая ночь'},
  {src:'/audio/veterochki.mp3', title:'Ветерочки'},
  {src:'/audio/vorony.mp3', title:'YAZHEVIKA и Чериган - Вороны'},
  {src:'/audio/kazachya-kolybelnaya.mp3', title:'Русский Бэнд - Казачья колыбельная'},
  {src:'/audio/marusya.mp3', title:'Маруся'},
  {src:'/audio/put-dorojka-mix2.mp3', title:'Путь-дорожка'},
  {src:'/audio/rodina-mat.mp3', title:'Родина-мать'},
  {src:'/audio/mily-ne-speshi.mp3', title:'Милый, не спеши'},
  {src:'/audio/oisya.mp3', title:'Ойся'},
  {src:'/audio/russkaya-rat-rock-drum.mp3', title:'Русская Рать Рок Драм'},
  {src:'/audio/russkaya-rat.mp3', title:'Русская Рать'},
  {src:'/audio/utro.mp3', title:'Утро'},
];
const battleHosts = [
  {name:'ДОНСКОЕ',tab:'ДОНСКОЕ',year:'1812',place:'ЗАПАДНЫЙ ПОХОД',title:'Удар с фланга',copy:'Подвижные донские полки вели разведку, тревожили коммуникации и преследовали отступающие части армии Наполеона.',image:'/images/battle-hosts-v1/don-1812.png'},
  {name:'КУБАНСКОЕ',tab:'КУБАНСКОЕ',year:'1860-е',place:'ЗАКУБАНСКАЯ ЛИНИЯ',title:'Через горную воду',copy:'Кубанское войско складывалось на кавказской границе. Здесь конный строй встречался с теснинами, лесом и речными переправами.',image:'/images/battle-hosts-v1/kuban-caucasus.png'},
  {name:'ТЕРСКОЕ',tab:'ТЕРСКОЕ',year:'1860-е',place:'КАВКАЗСКАЯ ЛИНИЯ',title:'Держать рубеж',copy:'Терские станицы стояли вдоль укреплённых линий Кавказа: дозор, внезапная схватка и возвращение к заставе были одной службой.',image:'/images/battle-hosts-v1/terek-line.png'},
  {name:'ЯИЦКОЕ · УРАЛЬСКОЕ',tab:'ЯИЦКОЕ / УРАЛЬСКОЕ',year:'XVIII-XIX ВЕКА',place:'РЕКА ЯИК - УРАЛ',title:'Степной строй',copy:'Яицкое казачье войско после 1775 года стало называться Уральским. Его история продолжилась в степной службе, на речных рубежах и в дальних походах.',image:'/images/battle-hosts-v1/ural-yaik.png'},
  {name:'ОРЕНБУРГСКОЕ',tab:'ОРЕНБУРГСКОЕ',year:'1870-е',place:'СРЕДНЕАЗИАТСКИЙ РУБЕЖ',title:'Пыль крепостных стен',copy:'Оренбургские части несли пограничную службу и участвовали в походах, где расстояние, жара и вода решали не меньше оружия.',image:'/images/battle-hosts-v1/orenburg-frontier.png'},
  {name:'СИБИРСКОЕ',tab:'СИБИРСКОЕ',year:'XIX ВЕК',place:'СИБИРСКАЯ ЛИНИЯ',title:'Зимний переход',copy:'Восточная служба измерялась замёрзшими реками, таёжными дорогами и заставами, разделёнными сотнями вёрст.',image:'/images/battle-hosts-v1/siberian-winter.png'},
  {name:'СЕМИРЕЧЕНСКОЕ',tab:'СЕМИРЕЧЕНСКОЕ',year:'КОНЕЦ XIX ВЕКА',place:'СЕМЬ РЕК',title:'Высота и простор',copy:'Семиреченские сотни действовали между степью и Тянь-Шанем, где конная колонна становилась связью между далёкими постами.',image:'/images/battle-hosts-v1/semirechye.png'},
  {name:'ЗАБАЙКАЛЬСКОЕ',tab:'ЗАБАЙКАЛЬСКОЕ',year:'1904-1905',place:'МАНЬЧЖУРИЯ',title:'Разведка у железной дороги',copy:'В русско-японскую войну забайкальские части вели разведку, прикрывали фланги и действовали на огромном маньчжурском театре.',image:'/images/battle-hosts-v1/transbaikal-1904.png'},
  {name:'АМУРСКОЕ',tab:'АМУРСКОЕ',year:'1900',place:'АМУРСКИЙ РУБЕЖ',title:'Переправа',copy:'Амурские казаки охраняли дальневосточную границу и коммуникации, где широкая река была одновременно дорогой и рубежом.',image:'/images/battle-hosts-v1/amur-1900.png'},
  {name:'УССУРИЙСКОЕ',tab:'УССУРИЙСКОЕ',year:'1904-1905',place:'ПРИМОРЬЕ',title:'Дозор из камышей',copy:'Уссурийские разъезды работали в дождливых долинах Дальнего Востока: короткий бой начинался там, где кончалась видимость.',image:'/images/battle-hosts-v1/ussuri-recon.png'},
];
const archivePhotos = Array.from({length:30},(_,i)=>`/images/archive-wall/archive-${String([1,2,3,6,5,27,28,29][i%8]).padStart(2,'0')}.jpg`);
const places = [
  {name:'ДОН',x:53.8,y:36.2,origin:true},
  {name:'РОСТОВ-НА-ДОНУ',x:54.4,y:36.9},
  {name:'КРАСНОДАР',x:53.2,y:39.2},
  {name:'СТАВРОПОЛЬ',x:55.1,y:40.1},
  {name:'ОРЕНБУРГ',x:62.0,y:34.5},
  {name:'ОМСК',x:70.5,y:30.5},
  {name:'ИРКУТСК',x:79.0,y:32.5},
  {name:'ЧИТА',x:84.0,y:35.5},
  {name:'ВЛАДИВОСТОК',x:91.0,y:43.0},
  {name:'МОСКВА',x:52.0,y:28.8},
  {name:'КИЕВ',x:46.9,y:34.0},
  {name:'АСТАНА',x:68.0,y:34.0},
  {name:'БИШКЕК',x:70.0,y:43.0},
  {name:'ТАШКЕНТ',x:66.0,y:43.0},
  {name:'ПЕКИН',x:82.0,y:45.0},
  {name:'БЕЛГРАД',x:44.0,y:41.0},
  {name:'СОФИЯ',x:46.0,y:43.0},
  {name:'ПРАГА',x:42.0,y:35.0},
  {name:'ПАРИЖ',x:36.8,y:37.0},
  {name:'БЕРЛИН',x:41.0,y:32.0},
  {name:'ВЕНА',x:42.0,y:38.0},
  {name:'ВАРШАВА',x:45.0,y:32.0},
  {name:'ХЕЛЬСИНКИ',x:44.0,y:25.0},
  {name:'АНКАРА',x:51.0,y:43.0},
  {name:'СТАМБУЛ',x:48.2,y:43.8},
  {name:'ТБИЛИСИ',x:57.0,y:43.0},
  {name:'ЕРЕВАН',x:57.2,y:45.0},
  {name:'ТЕГЕРАН',x:61.0,y:48.0},
  {name:'ЛОНДОН',x:33.0,y:33.0},
  {name:'БРЮССЕЛЬ',x:36.0,y:35.0},
  {name:'РИМ',x:40.0,y:43.0},
  {name:'АФИНЫ',x:45.0,y:46.0},
  {name:'ХАРБИН',x:87.0,y:39.0},
  {name:'ШАНХАЙ',x:86.0,y:49.0},
  {name:'КАИР',x:49.5,y:53.0},
  {name:'ТУНИС',x:40.5,y:50.0},
  {name:'АЛЖИР',x:36.5,y:50.0},
  {name:'АДДИС-АБЕБА',x:56.5,y:64.0},
  {name:'ПРЕТОРИЯ',x:48.8,y:78.0},
  {name:'ЙОХАННЕСБУРГ',x:48.3,y:79.0},
  {name:'КЕЙПТАУН',x:42.5,y:86.0},
  {name:'ВИНДХУК',x:42.8,y:75.0},
  {name:'ОТТАВА',x:9.0,y:29.0},
  {name:'ВАШИНГТОН',x:7.8,y:39.0},
  {name:'НЬЮ-ЙОРК',x:8.8,y:36.5},
  {name:'САН-ФРАНЦИСКО',x:3.5,y:45.0},
  {name:'ТОРОНТО',x:9.5,y:33.0},
  {name:'МОНРЕАЛЬ',x:11.0,y:31.0},
  {name:'БУЭНОС-АЙРЕС',x:12.0,y:68.0},
  {name:'МОНТЕВИДЕО',x:14.0,y:70.0},
  {name:'САНТЬЯГО',x:8.0,y:69.0},
  {name:'САН-ПАУЛУ',x:15.0,y:65.0},
  {name:'КАНБЕРРА',x:90.0,y:70.0},
  {name:'СИДНЕЙ',x:92.0,y:68.0},
  {name:'МЕЛЬБУРН',x:89.0,y:72.5},
  {name:'БРИСБЕН',x:94.0,y:64.0},
  {name:'АДЕЛАИДА',x:87.0,y:71.0},
  {name:'ВЕЛЛИНГТОН',x:92.0,y:76.0},
];
const donOrigin = places[0];
const worldRoute = (place: typeof places[number]) => {
  const midX=(donOrigin.x+place.x)/2;
  const lift=Math.min(18,Math.abs(place.x-donOrigin.x)*.22+Math.abs(place.y-donOrigin.y)*.08+3);
  return `M${donOrigin.x} ${donOrigin.y} Q${midX} ${Math.min(donOrigin.y,place.y)-lift} ${place.x} ${place.y}`;
};
const ancestors = [
  {n:1,x:47,y:37,ax:51,ay:43,src:'/images/genealogy-portraits-v1/don-officer.jpg',label:'Донской офицер',era:'1815'},
  {n:2,x:58,y:27,ax:59,ay:37,src:'/images/genealogy-portraits-v1/don-ataman.jpg',label:'Атаман С. Д. Ефремов',era:'XVIII век'},
  {n:3,x:68,y:21,ax:67,ay:34,src:'/images/genealogy-portraits-v1/kuban-cossack.jpg',label:'Кубанский казак',era:'около 1920'},
  {n:4,x:78,y:27,ax:76,ay:39,src:'/images/genealogy-portraits-v1/terek-cossack.jpg',label:'Терский казак',era:'XIX век'},
  {n:5,x:87,y:37,ax:83,ay:45,src:'/images/genealogy-portraits-v1/orenburg-cossack.jpg',label:'Оренбургский казак',era:'XIX век'},
  {n:27,x:84,y:51,ax:79,ay:52,src:'/images/genealogy-portraits-v1/siberian-cossack.jpg',label:'Сибирский казак',era:'1890-е'},
  {n:28,x:72,y:48,ax:71,ay:52,src:'/images/genealogy-portraits-v1/don-babkin.jpg',label:'Казак Иван Бабкин с супругой',era:'1880-е'},
  {n:29,x:59,y:49,ax:63,ay:52,src:'/images/genealogy-portraits-v1/cossack-woman.jpg',label:'Казачка в праздничном костюме',era:'XIX век'},
];
const hostCollage = [
  {src:'/images/hosts-collage/don.jpg',label:'ДОНСКИЕ',x:1,y:4,r:-5,w:39},
  {src:'/images/hosts-collage/terek.jpg',label:'ТЕРСКИЕ',x:35,y:1,r:4,w:35},
  {src:'/images/hosts-collage/kuban.jpg',label:'КУБАНСКИЕ',x:67,y:7,r:3,w:31},
  {src:'/images/archive-wall/archive-29.jpg',label:'ЯИЦКИЕ',x:3,y:48,r:4,w:31},
  {src:'/images/archive-wall/archive-01.jpg',label:'СЕМЬИ',x:27,y:29,r:-2,w:35},
  {src:'/images/archive-wall/archive-02.jpg',label:'СТАНИЦЫ',x:62,y:42,r:6,w:32},
  {src:'/images/archive-wall/archive-03.jpg',label:'ПОКОЛЕНИЯ',x:17,y:58,r:-6,w:25},
  {src:'/images/archive-wall/archive-28.jpg',label:'ОДИН НАРОД',x:45,y:55,r:3,w:34},
];
const songTitles = ['ОЙ, ТО НЕ ВЕЧЕР','ЛЮБО, БРАТЦЫ, ЛЮБО','ЧЁРНЫЙ ВОРОН','ПО ДОНУ ГУЛЯЕТ','КОГДА МЫ БЫЛИ НА ВОЙНЕ','НЕ ДЛЯ МЕНЯ','ИЗ-ЗА ЛЕСА, КОПИЙ И МЕЧЕЙ','РАЗЛИВАЙСЯ, ТИХИЙ ДОН','ТАНЦУЙ И ПОЙ, КАЗАК ЛИХОЙ','НА ЗАРЕ КАЗАК КОНЯ ПОИЛ','ОЙ, ЗА КУБАНОМ ЗА РЕКОЙ','В СТЕПИ ШИРОКОЙ ПОД ИКАНОМ'];
const musicFaces = [
  {src:'/images/archive-wall/archive-01.jpg',name:'ДОНСКОЙ ХОР',era:'1887',kind:'archive'},
  {src:'/images/artist-rgd-alpha-v2.png',name:'РГД',era:'СЕЙЧАС',kind:'modern'},
  {src:'/images/artist-beloboka-alpha-v2.png',name:'BELOBOKA',era:'СЕЙЧАС',kind:'modern'},
  {src:'/images/archive-wall/archive-03.jpg',name:'КУБАНСКИЕ ПЕВЧИЕ',era:'1912',kind:'archive'},
  {src:'/images/artist-yazhevika-alpha-v2.png',name:'YAZHEVIKA',era:'СЕЙЧАС',kind:'modern'},
  {src:'/images/genealogy-portraits-v1/don-officer.jpg',name:'ДОНСКОЙ КАЗАК',era:'XIX ВЕК',kind:'archive'},
  {src:'/images/hosts-collage/don.jpg',name:'ГОЛОС ДОНА',era:'ПАМЯТЬ',kind:'archive'},
];
const joinArchive = [
  {src:'/images/genealogy-portraits-v1/don-officer.jpg',label:'ДОНСКОЕ ВОЙСКО · 1815',x:7,y:49,r:-7,depth:.55},
  {src:'/images/genealogy-portraits-v1/don-ataman.jpg',label:'АТАМАН ДОНА · XVIII ВЕК',x:18,y:68,r:5,depth:.8},
  {src:'/images/genealogy-portraits-v1/kuban-cossack.jpg',label:'КУБАНСКИЙ КАЗАК · 1920',x:79,y:48,r:7,depth:.65},
  {src:'/images/genealogy-portraits-v1/terek-cossack.jpg',label:'ТЕРСКИЙ КАЗАК · XIX ВЕК',x:88,y:67,r:-5,depth:.9},
  {src:'/images/genealogy-portraits-v1/cossack-woman.jpg',label:'КАЗАЧКА · XIX ВЕК',x:70,y:76,r:4,depth:.72},
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
  const [trackIndex, setTrackIndex] = useState(0);
  const [playHistory, setPlayHistory] = useState<number[]>([]);
  const [artist, setArtist] = useState(0);
  const [pointer, setPointer] = useState({x:0,y:0});
  const [soonOpen, setSoonOpen] = useState(false);
  const [focusedAncestor, setFocusedAncestor] = useState<number|null>(null);
  const [nationPointer, setNationPointer] = useState({x:0,y:0});
  const [culturePointer, setCulturePointer] = useState({x:0,y:0});
  const [collagePointer, setCollagePointer] = useState({x:0,y:0});
  const [collageHeld, setCollageHeld] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number|null>(null);
  const [selectedAncestor, setSelectedAncestor] = useState<number|null>(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [musicPointer, setMusicPointer] = useState({x:0,y:0});
  const [warPointer, setWarPointer] = useState({x:0,y:0});
  const [joinPointer, setJoinPointer] = useState({x:0,y:0});
  const [worldPointer, setWorldPointer] = useState({x:0,y:0});
  const [battleIndex, setBattleIndex] = useState(0);
  const [battlePointer, setBattlePointer] = useState({x:0,y:0});
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const update = () => setScroll(window.scrollY);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    setTrackIndex(Math.floor(Math.random()*playlist.length));
    if (audioRef.current) audioRef.current.volume = .42;
  }, []);
  useEffect(() => { const timer=window.setInterval(()=>setArtist(v=>(v+1)%artists.length),6500); return()=>window.clearInterval(timer); }, []);
  useEffect(() => { const timer=window.setInterval(()=>setBattleIndex(v=>(v+1)%battleHosts.length),7600); return()=>window.clearInterval(timer); }, []);
  useEffect(() => {
    if (!soonOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setSoonOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [soonOpen]);
  useEffect(() => {
    if (selectedPhoto === null && selectedAncestor === null) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') {setSelectedPhoto(null);setSelectedAncestor(null);} };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [selectedPhoto,selectedAncestor]);
  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenu(false);
  };
  const toggleMusic = async () => {
    const audio = audioRef.current; if (!audio) return;
    if (audio.paused) { try { await audio.play(); setPlaying(true); } catch { setPlaying(false); } }
    else { audio.pause(); setPlaying(false); }
  };
  const playTrack = async (next:number, remember=true) => {
    const audio=audioRef.current; if (!audio) return;
    if (remember) setPlayHistory(history=>[...history.slice(-19),trackIndex]);
    setTrackIndex(next);
    window.setTimeout(async()=>{ try { await audio.play(); setPlaying(true); } catch { setPlaying(false); } },0);
  };
  const nextTrack = () => {
    if (playlist.length<2) return;
    let next=trackIndex;
    while(next===trackIndex) next=Math.floor(Math.random()*playlist.length);
    void playTrack(next);
  };
  const previousTrack = () => {
    const previous=playHistory.at(-1);
    if (previous===undefined) { nextTrack(); return; }
    setPlayHistory(history=>history.slice(0,-1));
    void playTrack(previous,false);
  };
  const enterWorld = async () => { if (!playing) await toggleMusic(); jump('history'); };
  const playPhotoSound = () => {
    const AudioCtx = window.AudioContext || (window as typeof window & {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx(); const now=ctx.currentTime;
    const gain=ctx.createGain(); gain.gain.setValueAtTime(.0001,now); gain.gain.exponentialRampToValueAtTime(.075,now+.018); gain.gain.exponentialRampToValueAtTime(.0001,now+.42); gain.connect(ctx.destination);
    const osc=ctx.createOscillator(); osc.type='sine'; osc.frequency.setValueAtTime(220,now); osc.frequency.exponentialRampToValueAtTime(520,now+.22); osc.connect(gain); osc.start(now); osc.stop(now+.44);
  };
  const openPhoto = (index:number) => { playPhotoSound(); setPhotoZoom(1); setSelectedPhoto(index); };

  return <main>
    <style>{`.join-scene{min-height:125vh!important;background:#050506!important}.join-cosmic-bg{position:absolute;z-index:0;inset:-9%;width:118%;height:118%;object-fit:cover;filter:contrast(1.12) saturate(.78) brightness(.63);transition:transform .18s ease-out;will-change:transform;animation:join-breathe 16s ease-in-out infinite alternate}.join-cosmic-shade{position:absolute;z-index:1;inset:0;background:radial-gradient(circle at 50% 43%,transparent 0 18%,#04040566 56%),linear-gradient(90deg,#030405df 0%,transparent 47%,#260b0888),linear-gradient(0deg,#040405e8,transparent 55%)}.join-drift{position:absolute;z-index:2;inset:-18%;background:radial-gradient(ellipse at 35% 72%,#bf4e2526,transparent 32%),radial-gradient(ellipse at 68% 38%,#d58a4a1c,transparent 29%);filter:blur(28px);mix-blend-mode:screen;animation:join-drift 13s ease-in-out infinite alternate;pointer-events:none}.join-archive{position:absolute;z-index:3;inset:0;pointer-events:none}.join-memory{position:absolute;width:clamp(88px,8vw,138px);padding:7px 7px 25px;background:#d4c6a8;box-shadow:0 24px 65px #000d;opacity:.58;filter:sepia(.62) grayscale(.3);transition:transform .18s ease-out,opacity .45s,filter .45s;will-change:transform}.join-memory img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover}.join-memory small{position:absolute;left:9px;bottom:8px;color:#2d251a;font:6px Arial;letter-spacing:.13em;white-space:nowrap}.join-memory:nth-child(2),.join-memory:nth-child(4){width:clamp(78px,7vw,120px);opacity:.43}.join-scene:hover .join-memory{opacity:.72;filter:sepia(.36) grayscale(.12)}.join-scene .join-copy{z-index:6!important;inset:14vh 6vw auto!important}.join-scene .join-copy h2{font-size:clamp(58px,8.1vw,132px)!important;text-shadow:0 8px 40px #000;margin-bottom:5vh}.cosmic-join-button{position:relative;display:grid!important;grid-template-rows:92px auto;place-items:center;gap:5px!important;width:390px;min-height:132px;margin:0 auto!important;padding:8px 34px 17px!important;border:1px solid #f0c68188!important;border-radius:72px!important;background:linear-gradient(105deg,#5f1d16,#b3482a 52%,#5d1d17)!important;overflow:visible!important;box-shadow:0 22px 70px #000b,0 0 44px #d95f3222;letter-spacing:.21em!important;transition:.35s!important}.cosmic-join-button>span:last-child{position:relative;z-index:3;text-align:center}.join-sabres{position:relative;width:108px;height:88px;border:0;border-radius:50%;background:radial-gradient(circle,#160b08d9 0 46%,transparent 48%);box-shadow:0 0 34px #e8b96a22}.cosmic-join-button:hover{transform:translateY(-5px) scale(1.03);box-shadow:0 30px 90px #000d,0 0 54px #e06a3844}.join-options{display:none!important}.join-orbit{position:absolute;z-index:2;right:5vw;top:11vh;width:24vw;aspect-ratio:1;border:1px solid #f5a26a2b;border-radius:50%;box-shadow:0 0 90px #b72e1722;animation:join-orbit 18s linear infinite}.join-orbit:before,.join-orbit:after{content:"";position:absolute;border:1px solid #f5a26a22;border-radius:50%}.join-orbit:before{inset:17%;transform:rotate(55deg)}.join-orbit:after{inset:38%}@keyframes join-orbit{to{transform:rotate(360deg)}}@keyframes join-breathe{to{filter:contrast(1.17) saturate(.9) brightness(.72)}}@keyframes join-drift{to{transform:translate3d(5%,-3%,0) scale(1.08);opacity:.72}}@media(max-width:700px){.join-scene .join-copy{inset:12vh 5vw auto!important}.cosmic-join-button{width:min(350px,90vw)}.join-orbit{width:50vw;right:-12vw}.join-memory{width:76px}.join-memory:nth-child(n+4){display:none}}`}</style>
    <style>{`.shashka-pair{display:block;overflow:visible;filter:drop-shadow(0 7px 7px #000c);transition:transform .45s,filter .45s}.hero-shashkas{position:relative;z-index:2;width:82px!important;height:82px!important;transform:scale(1.12)}.ceremonial-button:hover .hero-shashkas{transform:scale(1.24) translateY(-2px);filter:drop-shadow(0 8px 8px #000d) drop-shadow(0 0 7px #ffc87877)}.join-shashkas{position:absolute;left:50%;top:50%;width:142px!important;height:142px!important;object-fit:contain;transform:translate(-50%,-50%) scale(1.02);transform-origin:50% 50%}.cosmic-join-button:hover .join-shashkas{transform:translate(-50%,-54%) scale(1.13);filter:drop-shadow(0 10px 10px #000e) drop-shadow(0 0 9px #ffd08266)}`}</style>
    <style>{`.music-scene{min-height:165vh!important;padding:0!important;background:#070708!important}.music-wall{position:absolute;inset:0;overflow:hidden;background:radial-gradient(circle at 60% 44%,#44271e,#090909 66%)}.music-wall-card{position:absolute;overflow:hidden;border:1px solid #e0bd7a44;box-shadow:0 35px 90px #000c;transition:transform .18s ease-out,filter .5s;will-change:transform}.music-wall-card img{width:100%;height:100%;object-fit:cover;filter:saturate(.68) contrast(1.12) brightness(.65)}.music-wall-card:nth-child(1){left:-4%;top:-4%;width:54%;height:54%}.music-wall-card:nth-child(2){right:-5%;top:-3%;width:57%;height:53%}.music-wall-card:nth-child(3){left:5%;bottom:5%;width:30%;height:48%}.music-wall-card:nth-child(4){left:34%;bottom:-3%;width:31%;height:51%}.music-wall-card:nth-child(5){right:4%;bottom:2%;width:29%;height:48%}.music-wall-card:nth-child(6){left:38%;top:24%;width:26%;height:31%;z-index:3}.music-wall-card:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 45%,#080808e8)}.music-wall-card span{position:absolute;z-index:2;left:18px;bottom:16px;font:9px Arial;letter-spacing:.2em;color:#f0ca87}.music-wall-shade{position:absolute;z-index:4;inset:0;background:linear-gradient(90deg,#050607e8 0%,transparent 58%),linear-gradient(0deg,#050607d9,transparent 47%)}.music-scene .music-copy{position:absolute;z-index:6;left:6vw;top:12vh;max-width:760px}.music-scene .music-copy h2{font-size:clamp(54px,7.5vw,118px)!important}.music-count{display:flex;align-items:baseline;gap:15px;margin-top:4vh;color:#f0ca87}.music-count strong{font:clamp(56px,8vw,112px)/.8 Georgia}.music-count span{font:9px/1.5 Arial;letter-spacing:.2em}.song-river{position:absolute;z-index:7;left:0;right:0;bottom:3vh;overflow:hidden;border-block:1px solid #fff2;background:#080909b8;backdrop-filter:blur(12px)}.song-river-track{display:flex;width:max-content;gap:42px;padding:18px 0;animation:song-flow 38s linear infinite}.song-river span{font:10px Arial;letter-spacing:.18em;color:#e4d8c4aa;white-space:nowrap}.song-river span:after{content:' •';color:#d6a75d;margin-left:42px}@keyframes song-flow{to{transform:translateX(-50%)}}@media(max-width:700px){.music-wall-card:nth-child(1),.music-wall-card:nth-child(2){height:45%}.music-wall-card:nth-child(3),.music-wall-card:nth-child(4),.music-wall-card:nth-child(5){width:43%;height:38%}.music-wall-card:nth-child(3){left:0}.music-wall-card:nth-child(4){left:29%}.music-wall-card:nth-child(5){right:-3%}.music-wall-card:nth-child(6){display:none}.music-scene .music-copy{top:10vh}.music-count{margin-top:2vh}}`}</style>
    <style>{`.hosts-collage-scene{height:100svh;min-height:620px;padding:11vh 4vw 4vh;background:radial-gradient(circle at 72% 46%,#3b2b1d,#100d0a 48%,#060606 76%);display:grid;grid-template-columns:minmax(290px,.72fr) minmax(0,1.48fr);gap:3.5vw;align-items:center}.hosts-collage-heading{position:relative;z-index:4;width:auto;margin:0;display:flex;flex-direction:column;align-items:flex-start;gap:3vh}.hosts-collage-heading h2{margin:1.8vh 0 0!important;font-size:clamp(45px,5.7vw,92px)!important;line-height:.86!important}.hosts-collage-heading p:last-child{max-width:360px;margin:0;font:clamp(14px,1.2vw,18px)/1.5 Georgia;color:#d4c8b4b8}.hosts-collage-stage{position:relative;z-index:3;width:100%;max-height:80vh;aspect-ratio:1.48;transform:scale(1);transition:transform .7s cubic-bezier(.16,.85,.2,1);cursor:zoom-in;touch-action:none}.hosts-collage-stage.held{transform:scale(1.025);cursor:zoom-out}.collage-card{position:absolute;margin:0;padding:7px 7px 25px;background:#d9cbb2;box-shadow:0 22px 55px #000c;transition:transform .22s ease-out,filter .45s,box-shadow .45s;will-change:transform;user-select:none}.collage-card img{display:block;width:100%;aspect-ratio:1;object-fit:cover;filter:sepia(.68) grayscale(.28) contrast(1.08);pointer-events:none}.collage-card figcaption{position:absolute;left:10px;bottom:8px;color:#2e261c;font:7px Arial;letter-spacing:.18em}.collage-card:hover{z-index:20!important;filter:brightness(1.04);box-shadow:0 34px 78px #000}.collage-card:hover img{filter:sepia(.15) grayscale(0) contrast(1.04)}.collage-hold-hint{position:absolute;z-index:30;left:50%;bottom:1%;transform:translateX(-50%);padding:10px 15px;border:1px solid #e4c38455;background:#080908b8;backdrop-filter:blur(10px);font:7px Arial;letter-spacing:.2em;color:#e4c384;white-space:nowrap}.hosts-collage-stage.held .collage-hold-hint{opacity:0}@media(max-width:800px){.hosts-collage-scene{height:100svh;min-height:560px;padding:10vh 4vw 2vh;grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);gap:1.5vh}.hosts-collage-heading{gap:1vh}.hosts-collage-heading h2{font-size:clamp(38px,11vw,64px)!important}.hosts-collage-heading p:last-child{display:none}.hosts-collage-stage{height:100%;max-height:61vh;width:min(96vw,760px);justify-self:center;aspect-ratio:1.48}.collage-card{padding:4px 4px 18px}.collage-card figcaption{left:6px;bottom:5px;font-size:5px}.collage-hold-hint{bottom:0;font-size:5px;padding:7px 10px}}`}</style>
    <style>{`.generation-phrase{position:absolute;z-index:6;left:7vw;bottom:9vh;display:flex;flex-direction:column;gap:5px;padding-left:18px;border-left:1px solid #d8ae6988;font:clamp(17px,1.55vw,24px)/1.25 Georgia;perspective:700px}.generation-phrase span{display:block;width:max-content;max-width:86vw;text-shadow:0 6px 24px #000;transition:transform .18s ease-out,opacity .5s;will-change:transform}.generation-phrase .elders-line{color:#d8d0c2a8}.generation-phrase .young-line{color:#f0c982;font-style:italic}.generations-scene .culture-copy h2{margin-bottom:0}.generations-scene .culture-marquee,.generation-echo{display:none!important}`}</style>
    <style>{`.nation-bg{transition:transform .16s ease-out!important;will-change:transform}.nation-people-layer{position:absolute;inset:auto -2.5% -2%;width:105%;height:auto;object-fit:contain;object-position:center bottom;pointer-events:none;will-change:transform,translate,scale;transition:transform .13s ease-out;z-index:2!important;opacity:1!important;mix-blend-mode:normal!important;filter:saturate(.98) contrast(1.035) brightness(.9)!important;mask-image:none!important;-webkit-mask-image:none!important;transform-origin:center bottom}.nation-shade{z-index:3!important}.nation-copy,.nation-emblem,.nation-word{z-index:4!important}`}</style>
    <style>{`.ceremonial-button{overflow:visible!important}.hero-image{background-image:linear-gradient(90deg,#05080de8 0%,#05080d55 42%,#05080d18 75%),url('/images/hero-riders-v4-no-glasses.png')!important}.living-culture,.artist-stage{background-image:none!important}.living-culture:before{background:linear-gradient(90deg,#050708d9 0%,#10151273 44%,#050708b8 100%)!important;background-size:100% 100%!important}.artist-stage:after{top:auto!important;background-image:linear-gradient(to top,#111814d9,transparent)!important}
    .globe-routes{position:absolute;z-index:2;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}.globe-routes>g>path{fill:none;stroke:#ffd18a88;stroke-width:.16;stroke-dasharray:1.1 1.7;filter:drop-shadow(0 0 1.1px #ffb85c);animation:route-flow 7s linear infinite}.route-pulse{fill:#ffe0a0;filter:drop-shadow(0 0 2px #ff9b45)}.world-dot{display:block!important;transform:translate(-50%,-50%)}.world-dot span{position:absolute;left:13px;top:-8px;padding:5px 8px;border:1px solid #ffd18a55;background:#061013e8;color:#ffe1a9;white-space:nowrap;font:7px Arial;letter-spacing:.14em;opacity:0;transform:translateX(-5px);transition:.35s;pointer-events:none}.world-dot:before{content:"";position:absolute;left:7px;top:4px;width:8px;height:1px;background:#ffd18a88;transform-origin:left}.world-dot:hover span,.world-dot.origin span{opacity:1;transform:none}.world-dot:hover{scale:1.55!important;z-index:12}.world-dot.origin{width:13px;height:13px;background:#fff0b9;box-shadow:0 0 10px #fff0b9,0 0 34px #ff8c42,0 0 65px #ff8c4266}.world-dot.origin:after{content:"";position:absolute;inset:-9px;border:1px solid #ffd18a88;border-radius:50%;animation:don-wave 2.2s ease-out infinite}@keyframes route-flow{to{stroke-dashoffset:-30}}@keyframes don-wave{to{transform:scale(2.1);opacity:0}}
    .genealogy-scene{min-height:145vh!important;background:radial-gradient(circle at 69% 48%,#34281b 0,#15110c 34%,#070706 76%)!important}.genealogy-atmosphere{position:absolute;inset:0;background:radial-gradient(ellipse at 68% 75%,#bd783b25,transparent 48%);filter:blur(18px)}.genealogy-object{position:absolute;z-index:2;right:1vw;top:11vh;width:min(76vw,1120px);height:116vh;transform-origin:62% 46%;transition:transform .55s cubic-bezier(.18,.85,.2,1);will-change:transform}.genealogy-tree{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:contrast(1.09) brightness(.82) drop-shadow(0 34px 70px #000b)}.genealogy-links{position:absolute;z-index:5;inset:0;width:100%;height:100%;pointer-events:none}.genealogy-links path{fill:none;stroke:#d8aa6388;stroke-width:.16;stroke-dasharray:.8 .9;filter:drop-shadow(0 0 1px #e8ba72)}.genealogy-links circle{fill:#f2cb82;filter:drop-shadow(0 0 2px #ffb860)}.genealogy-shade{z-index:3!important;pointer-events:none;background:linear-gradient(90deg,#070707ed 0%,#070707a5 28%,transparent 60%),linear-gradient(0deg,#070707c4,transparent 48%)!important}.genealogy-scene .roots-copy{z-index:8!important}.roots-hint{font:italic 15px/1.5 Georgia;color:#d7bd91aa;margin:22px 0}.genealogy-object .ancestor-node{position:absolute!important;z-index:6!important;width:76px!important;height:96px!important;padding:0!important;border:0!important;background:transparent!important;transform:translate(-50%,-50%) rotate(var(--tilt,0deg));box-shadow:none!important;transition:transform .38s cubic-bezier(.18,.9,.2,1),filter .38s!important}.portrait-frame{position:relative;display:block;width:100%;height:100%;padding:7px;background:linear-gradient(145deg,#8e6836,#e1be7a 28%,#4e3218 74%,#c99750);clip-path:polygon(6% 0,94% 0,100% 6%,100% 94%,94% 100%,6% 100%,0 94%,0 6%);box-shadow:0 16px 38px #000c,0 0 0 2px #e7c98f55 inset}.portrait-frame:before{content:"";position:absolute;inset:5px;border:1px solid #1a1008aa;pointer-events:none}.portrait-frame img{display:block;width:100%;height:100%;object-fit:cover;filter:sepia(.72) grayscale(.28) contrast(1.08);transition:filter .38s}.genealogy-object .ancestor-node:nth-of-type(odd){--tilt:-2deg}.genealogy-object .ancestor-node:nth-of-type(even){--tilt:2deg}.genealogy-object .ancestor-node:hover,.genealogy-object .ancestor-node.focused{z-index:20!important;transform:translate(-50%,-50%) scale(1.24) rotate(0)!important;filter:drop-shadow(0 20px 28px #000)}.genealogy-object .ancestor-node:hover img,.genealogy-object .ancestor-node.focused img{filter:sepia(.12) grayscale(0) contrast(1.03)}.genealogy-scene.is-focusing .tree-lamp{animation:lamp-flicker .18s infinite alternate;opacity:1}.genealogy-scene.is-focusing .genealogy-tree{filter:contrast(1.12) brightness(.9) drop-shadow(0 38px 80px #000c)}@media(max-width:800px){.genealogy-object{right:-34vw;top:20vh;width:135vw;height:100vh}.genealogy-object .ancestor-node{width:58px!important;height:74px!important}.genealogy-scene .roots-copy{top:8vh!important}.roots-hint{display:none}}`}</style>
    <audio ref={audioRef} src={playlist[trackIndex].src} preload="metadata" onEnded={nextTrack} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} />
    <div className="progress" style={{ transform: `scaleX(${Math.min(1, scroll / 7500)})` }} />
    <style>{`.hosts-collage-stage>.collage-card{position:absolute!important}@media(max-width:800px){.hosts-collage-stage>.collage-card:nth-child(3){left:63%!important}}`}</style>
    <header className="topbar">
      <button className="brand" onClick={() => jump('hero')} aria-label="К началу"><span className="brand-mark"><img src="/images/orthodox-cross-logo-v3.png" alt="" aria-hidden="true"/></span><span>КАЗАКИ<br/>ВСЕГО МИРА</span></button>
      <nav className="quick-nav" aria-label="Быстрые главы">{acts.map(([n,,id])=><button key={id} onClick={()=>jump(id)}>{Number(n)}</button>)}</nav>
      <div className="topline" />
      <div className="top-actions"><div className="track-controls" title={playlist[trackIndex].title}><button onClick={previousTrack} aria-label="Предыдущая песня"><ChevronLeft size={16}/></button><button className={`sound ${playing?'is-playing':'is-muted'}`} onClick={toggleMusic} aria-label={playing?'Выключить музыку':'Включить музыку'} aria-pressed={playing}>{playing?<Volume2 size={17}/>:<VolumeX size={17}/>}<i/></button><button onClick={nextTrack} aria-label="Следующая случайная песня"><ChevronRight size={16}/></button></div><button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="site-menu"><Menu size={18}/> МЕНЮ</button></div>
    </header>
    <aside id="site-menu" className={`chapter-menu ${menu ? 'open' : ''}`}>
      <div className="menu-label">МЕНЮ</div>
      {acts.map(([n, title, id]) => <button key={id} onClick={() => jump(id)}><span>{n}</span>{title}</button>)}
    </aside>

    <section id="hero" className="scene hero">
      <div className="hero-image parallax" style={{ transform: `translate3d(0,${scroll * .18}px,0) scale(${1 + scroll * .00008})` }} />
      <div className="hero-haze" style={{ transform: `translateY(${scroll * .35}px)` }} />
      <img className="hero-grass-object" src="/images/steppe-foreground.png" alt="" style={{transform:`translate3d(0,${Math.max(-10,Math.min(10,scroll*-.018))}px,0) scale(1.035)`}}/>
      <div className="hero-copy" style={{ transform: `translateY(${scroll * .12}px)`, opacity: Math.max(.12, 1-scroll/850) }}>
        <p className="eyebrow">МЕЖДУНАРОДНЫЙ ЦИФРОВОЙ ЦЕНТР КАЗАЧЕСТВА</p>
        <h1>КАЗАКИ<br/><em>ВСЕГО</em> МИРА</h1><p className="hero-en">COSSACKS OF THE WORLD</p>
        <div className="hero-bottom"><p>Один народ.<br/>Одна память.<br/>Один мир.</p><button className="ceremonial-button" onClick={enterWorld}><CrossedSabres/><span>ВОЙТИ В НАШ МИР<small>НАЧАТЬ ИСТОРИЮ</small></span><ArrowDown size={18}/></button></div>
      </div><div className="act-stamp"><span>АКТ</span><strong>I</strong></div>
    </section>
    <nav className="act-strip" aria-label="Главы"><span>ПРОЛИСТЫВАЙТЕ ИСТОРИЮ</span>{acts.slice(0,5).map(([n,t,id])=><button key={id} onClick={()=>jump(id)}><b>{n}</b>{t}</button>)}</nav>

    <section id="history" className="scene history-scene">
      <div className="history-bg parallax" style={{ transform: `translateY(${Math.max(-120,(scroll-850)*.08)}px) scale(1.08)` }}/>
      <div className="history-woman-depth" style={{transform:`translate3d(${Math.max(-8,Math.min(8,(scroll-850)*-.012))}px,${Math.max(-7,Math.min(7,(scroll-850)*-.008))}px,0) scale(1.085)`}}/>
      <div className="history-rider-depth" style={{transform:`translate3d(${Math.max(0,Math.min(28,(scroll-850)*.024))}px,${Math.max(-4,Math.min(16,(scroll-850)*.014))}px,0) scale(${Math.max(.97,1-(scroll-850)*.000035)})`}}/>
      <div className="storm-flash" aria-hidden="true"/>
      <div className="paper paper-one" style={{ transform:`translate3d(0,${(scroll-1000)*-.035}px,0) rotate(-6deg)` }}>1919<br/><small>Письмо домой</small></div>
      <div className="paper paper-two" style={{ transform:`translate3d(0,${(scroll-1000)*.055}px,0) rotate(4deg)` }}>РОСТОВЪ<br/><small>Архив семьи</small></div>
      <div className="scene-copy left"><p className="chapter">РАЗДЕЛЁННАЯ ИСТОРИЯ</p><h2>НАС РАЗДЕЛИЛА<br/><i>ИСТОРИЯ</i></h2><p className="lead">Революции. Войны. Эмиграция.<br/>Поезда уходили, корабли исчезали за горизонтом, матери ждали.</p><blockquote>«История разбросала нас по миру»</blockquote></div>
    </section>
    <section id="people" className="scene people-scene">
      <div className="archive-wall">{archivePhotos.map((src,i)=><img key={i} src={src} alt="Историческая фотография казаков" loading="lazy" decoding="async" style={{transform:`translate3d(${((i%6)-2.5)*Math.max(-9,Math.min(9,(scroll-1900)*.004))}px,${((i%5)-2)*Math.max(-16,Math.min(16,(scroll-1900)*.007))}px,0) rotate(${(i%7)-3}deg)`}}/>)}</div><div className="people-vignette"/>
      <div className="scene-copy center"><p className="chapter">ПАМЯТЬ СОХРАНИЛА СВЯЗЬ</p><h2>НО МЫ<br/><i>НЕ ИСЧЕЗЛИ</i></h2><div className="memory-lines"><span style={{transform:`translateX(${Math.max(-80,Math.min(0,(scroll-1900)*.08-80))}px)`}}>Мы сохранили память.</span><span style={{transform:`translateX(${Math.max(0,80-(scroll-2020)*.08)}px)`}}>Мы сохранили песни.</span><span style={{transform:`translateX(${Math.max(-80,Math.min(0,(scroll-2140)*.08-80))}px)`}}>Мы сохранили имена.</span><strong style={{transform:`scale(${Math.max(.72,Math.min(1,(scroll-2200)/480))})`}}>Мы сохранили себя.</strong></div></div>
      <div className="counter"><strong>∞</strong><span>ИСТОРИЙ<br/>ОДНОГО НАРОДА</span></div>
    </section>
    <section id="nation" className="scene nation-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setNationPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setNationPointer({x:0,y:0})}>
      <img className="nation-bg" src="/images/nation-background-v2.png" alt="Старочеркасский собор и донская земля" style={{transform:`translate3d(${nationPointer.x*-6}px,${Math.max(-14,Math.min(14,(scroll-3000)*-.008))+nationPointer.y*-4}px,0) scale(1.045)`}}/>
      <img className="nation-flags-layer" src="/images/nation-flags-alpha-v2.png" alt="" style={{transform:`translate3d(${nationPointer.x*10}px,${Math.max(-22,Math.min(22,(scroll-3000)*-.013))+nationPointer.y*7}px,0) scale(1.052)`}}/>
      <img className="nation-people-layer" src="/images/nation-people-alpha-v3.png" alt="Казаки и семьи получают благословение" style={{transform:`translate3d(${nationPointer.x*18}px,${Math.max(-24,Math.min(24,(scroll-3000)*-.014))+nationPointer.y*9}px,0)`}}/>
      <div className="nation-shade"/>
      <div className="nation-emblem" aria-hidden="true" style={{transform:`translate3d(${nationPointer.x*-12}px,${nationPointer.y*-9}px,0) scale(${1.06+Math.abs(nationPointer.x)*.08})`}}>
        <img className="orthodox-cross" src="/images/orthodox-cross-reference-v2.png" alt=""/>
      </div>
      <div className="nation-copy"><p className="chapter">ВЕРА · ПАМЯТЬ · ЗЕМЛЯ</p><h2>КАЗАКИ -<br/><i>НАРОД</i></h2><p>Мы жили. Мы живы. Мы будем жить дальше. Православная вера, память предков и родная земля соединяют казачьи семьи по всему миру. Мы - один народ. Мы - одна семья.</p><button className="ceremonial-button" onClick={()=>jump('join')}><CrossedSabres/><span>СЛАВА БОГУ, МЫ КАЗАКИ</span><ArrowUpRight size={18}/></button></div><div className="nation-word">НАРОД</div>
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
      <div className="scene-copy left"><p className="chapter">ДОН · КАЗАЧИЙ МИР</p><h2>МЫ ЖИВЁМ<br/><i>ПО ВСЕМУ МИРУ</i></h2><p className="lead">Дон - наше сердце и начало общей истории. Сегодня казаки живут по всему миру, в разных странах, но остаются одним народом.<br/>На карте отмечены города, где живут казачьи семьи и потомки. Это открытая география, а не полный реестр.</p><button className="outline ceremonial-button" disabled aria-disabled="true"><CrossedSabres/><span>ДОБАВЛЕНИЕ ИСТОРИЙ ГОТОВИТСЯ</span></button></div>
      <div className="world-list">{places.map(place=><span key={place.name}>{place.name}</span>)}</div>
    </section>
    <section id="roots" className={`scene genealogy-scene ${focusedAncestor!==null?'is-focusing':''}`}>
      <div className="genealogy-atmosphere"/><div className="genealogy-shade"/>
      <div className="genealogy-object" style={{transform:`translate3d(${focusedAncestor===null?0:(50-ancestors[focusedAncestor].x)*1.2}px,${Math.max(-62,Math.min(62,(scroll-4700)*.045))+(focusedAncestor===null?0:(44-ancestors[focusedAncestor].y)*.7)}px,0) scale(${focusedAncestor===null?1:1.1})`}}>
        <img className="genealogy-tree" src="/images/genealogy-tree-clean.png" alt="Генеалогическое древо казачьих семей" loading="lazy" decoding="async"/>
        <div className="tree-lamp" aria-hidden="true"/>
        <svg className="genealogy-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{ancestors.map((a,i)=><g key={`link-${a.n}`}><path d={`M${a.ax} ${a.ay} Q${(a.ax+a.x)/2} ${Math.min(a.ay,a.y)-2} ${a.x} ${a.y}`}/><circle cx={a.ax} cy={a.ay} r=".45"/><circle cx={a.x} cy={a.y} r=".32"/></g>)}</svg>
        {ancestors.map((a,i)=><button key={a.n} className={`ancestor-node ${focusedAncestor===i?'focused':''}`} style={{left:`${a.x}%`,top:`${a.y}%`}} onMouseEnter={()=>setFocusedAncestor(i)} onMouseLeave={()=>setFocusedAncestor(null)} onFocus={()=>setFocusedAncestor(i)} onBlur={()=>setFocusedAncestor(null)} onClick={()=>{setPhotoZoom(1);setSelectedAncestor(i)}} aria-label={`Открыть портрет: ${a.label}`}><span className="portrait-frame"><img src={a.src} alt={`${a.label}, ${a.era}`} loading="lazy" decoding="async"/></span></button>)}
      </div>
      <div className="roots-copy"><p className="chapter">РОДОВАЯ ПАМЯТЬ</p><h2>КАЖДАЯ СЕМЬЯ -<br/><i>ЧАСТЬ ОБЩЕЙ ИСТОРИИ</i></h2><p className="roots-hint">Ищете фамилию, станицу или историю своей семьи? Вы не одни. Здесь мы находим друг друга.</p><div className="search-box">ФАМИЛИЯ / СТАНИЦА / МЕСТО <button disabled aria-disabled="true">ПОИСК ГОТОВИТСЯ</button></div></div>
    </section>
    <section id="culture" className="scene generations-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setCulturePointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setCulturePointer({x:0,y:0})}>
      <img className="generations-bg" src="/images/living-generations-v2.png" alt="Донская казачка в народном костюме и казаки в папахах — живая культура поколений" style={{transform:`translate3d(${culturePointer.x*-16}px,${Math.max(-42,Math.min(42,(scroll-5600)*-.02))+culturePointer.y*-10}px,0) scale(1.11)`}}/><div className="generations-shade"/>
      <div className="culture-copy"><p className="chapter">КУЛЬТУРА ЖИВЁТ</p><h2>МЫ ПОМНИМ.<br/><i>МЫ ПРОДОЛЖАЕМ.</i></h2></div>
      <div className="generation-phrase"><span className="elders-line" style={{transform:`translate3d(${culturePointer.x*8}px,${culturePointer.y*4+Math.max(-7,Math.min(7,(scroll-5600)*-.004))}px,0)`}}>Старшие передают память.</span><span className="young-line" style={{transform:`translate3d(${culturePointer.x*16}px,${culturePointer.y*8+Math.max(-10,Math.min(10,(scroll-5600)*.006))}px,12px)`}}>Молодые берут её в будущее.</span></div>
    </section>
    <section id="hosts" className="scene hosts-collage-scene">
      <div className="hosts-collage-heading"><div><p className="chapter">КАЗАЧЬИ СЕМЬИ И ВОЙСКА</p><h2>РАЗНЫЕ ВОЙСКА.<br/><i>ОБЩАЯ ПАМЯТЬ.</i></h2></div><p>Дон. Терек. Кубань. Яик. Разные земли - один народ и одна память.</p></div>
      <div className={`hosts-collage-stage ${collageHeld?'held':''}`} onPointerMove={event=>{const r=event.currentTarget.getBoundingClientRect();setCollagePointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);setCollageHeld(true)}} onPointerUp={()=>setCollageHeld(false)} onPointerCancel={()=>setCollageHeld(false)} onPointerLeave={()=>{setCollageHeld(false);setCollagePointer({x:0,y:0})}}>
        {hostCollage.map((item,i)=><figure key={`${item.label}-${i}`} className="collage-card" role="button" tabIndex={0} aria-label={`Открыть фотографию: ${item.label}`} onClick={()=>openPhoto(i)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openPhoto(i)}}} style={{left:`${item.x}%`,top:`${item.y}%`,width:`${item.w}%`,zIndex:i+1,transform:`translate3d(${collagePointer.x*((i%3)-1)*18}px,${collagePointer.y*((i%4)-1.5)*13}px,${i*2}px) rotate(${item.r}deg) scale(${collageHeld?1.025:1})`}}><img src={item.src} alt={`${item.label.toLowerCase()} казаки — архивная фотография`}/><figcaption>{item.label}</figcaption></figure>)}
        <div className="collage-hold-hint">УДЕРЖИВАЙТЕ, ЧТОБЫ ПРИБЛИЗИТЬ</div>
      </div>
    </section>
    <section id="artists" className="scene living-culture">
      <div className="living-heading"><p className="chapter">ЛИЦА / ГОЛОСА / ХАРАКТЕР</p><h2>НОВЫЕ ГОЛОСА<br/><i>ТРАДИЦИИ</i></h2><p>Современные исполнители продолжают казачью песенную традицию.</p></div>
      <div className={`artist-stage artist-stage-${artist}`} onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();setPointer({x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setPointer({x:0,y:0})}>
        <img className="artist-stage-bg" src="/images/don-steppe-parallax.png" alt="" style={{transform:`translate3d(${pointer.x*-70}px,${pointer.y*-42}px,0) scale(1.12)`}}/>
        <div className="artist-backdrop-title" style={{transform:`translate3d(${pointer.x*-24}px,${pointer.y*-14}px,0)`}}>{artists[artist].name}</div>
        <img className="artist-stage-person active" src={artists[artist].image} alt={artists[artist].name} decoding="async" style={{objectPosition:artists[artist].position,transform:`translate3d(${pointer.x*12}px,${pointer.y*8}px,0) scale(1.01)`}}/>
        <div className="artist-stage-fog fog-back" style={{transform:`translate3d(${pointer.x*-24}px,${pointer.y*-8}px,0)`}}/><div className="artist-stage-fog fog-front" style={{transform:`translate3d(${pointer.x*36}px,${pointer.y*14}px,0)`}}/>
        <div className="artist-stage-copy"><span>{artists[artist].tag}</span><h3>{artists[artist].name}</h3><p>{artists[artist].copy}</p></div>
        <div className="artist-tabs">{artists.map((a,i)=><button key={a.name} className={artist===i?'active':''} onClick={()=>setArtist(i)}><b>0{i+1}</b>{a.name}</button>)}</div>
        <div className="artist-cursor-note">ДВИГАЙТЕ МЫШЬ · ПАРАЛЛАКС</div>
      </div>
      <div id="battle" className="battle-chronicle" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setBattlePointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setBattlePointer({x:0,y:0})}>
        <div className="battle-kicker">ДЕСЯТЬ ВОЙСК · ДЕСЯТЬ РУБЕЖЕЙ · ОДНА ЛЕТОПИСЬ</div>
        <div className="battle-images" style={{transform:`translate3d(${battlePointer.x*-16}px,${battlePointer.y*-10}px,0) scale(1.035)`}}><img className="active" src={battleHosts[battleIndex].image} alt={`${battleHosts[battleIndex].name.toLowerCase()} казачье войско`} decoding="async"/></div>
        <div className="battle-shade"/>
        <div className="battle-copy" style={{transform:`translate3d(${battlePointer.x*10}px,${battlePointer.y*7}px,0)`}}><span>{battleHosts[battleIndex].year} · {battleHosts[battleIndex].place}</span><h3>{battleHosts[battleIndex].name}<i> ВОЙСКО</i></h3><h4>{battleHosts[battleIndex].title}</h4><p>{battleHosts[battleIndex].copy}</p></div>
        <div className="battle-counter"><b>{String(battleIndex+1).padStart(2,'0')}</b><i/>10</div>
        <div className="battle-rail">{battleHosts.map((host,i)=><button key={host.name} className={i===battleIndex?'active':''} onClick={()=>setBattleIndex(i)} aria-label={`Показать: ${host.name}`}><b>{String(i+1).padStart(2,'0')}</b><span>{host.tab}</span></button>)}</div>
        <div className="battle-arrows"><button onClick={()=>setBattleIndex(v=>(v-1+battleHosts.length)%battleHosts.length)} aria-label="Предыдущая картина">←</button><button onClick={()=>setBattleIndex(v=>(v+1)%battleHosts.length)} aria-label="Следующая картина">→</button></div>
      </div>
    </section>
    <section id="music" className="scene music-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setMusicPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setMusicPointer({x:0,y:0})}>
      <div className="music-wall">{musicFaces.map((item,i)=><figure key={`${item.name}-${item.era}`} className={`music-wall-card ${item.kind}`} style={{transform:`translate3d(${musicPointer.x*((i%4)-1.5)*24}px,${musicPointer.y*((i%3)-1)*20}px,0) scale(${1.015+i*.003})`}}><img src={item.src} alt={item.name}/><figcaption><small>{item.era}</small><span>{item.name}</span></figcaption></figure>)}<div className="music-wall-shade"/><div className="music-era-rail"><b>1887</b><i/><em>ГОЛОС ПЕРЕДАЁТСЯ</em><i/><b>СЕЙЧАС</b></div></div>
      <div className="music-copy"><p className="chapter">ГОЛОСА СКВОЗЬ ВРЕМЯ</p><h2>ПЕСНЯ<br/><i>НЕ ПРЕРЫВАЛАСЬ.</i><br/>ОНА ЖИВЁТ.</h2><p className="music-lead">От старших к молодым, от семейной памяти к новой сцене — одна живая песенная традиция.</p><div className="music-count"><strong>∞</strong><span>ПЕСЕН<br/>ОДНОГО НАРОДА</span></div></div>
      <div className="song-river"><div className="song-river-track">{[...songTitles,...songTitles].map((title,i)=><span key={`${title}-${i}`}>{title}</span>)}</div></div>
    </section>
    <section id="today" className="scene today-scene war-memory" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setWarPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setWarPointer({x:0,y:0})}>
      <div className="war-sky" style={{transform:`translate3d(${warPointer.x*-18}px,${warPointer.y*-10}px,0) scale(1.05)`}}/>
      <div className="war-copy"><p className="chapter">ВОЙНА И ПАМЯТЬ</p><h2>УХОДИЛИ<br/><i>ПОЛКАМИ.</i><br/>ВОЗВРАЩАЛИСЬ<br/>ИМЕНАМИ.</h2><p>Война входила в каждую станицу. Одни уходили на фронт. Другие спасали раненых, ждали писем и сохраняли фотографии тех, кто не вернулся.</p><blockquote>Память о людях и цене, которую заплатили семьи.</blockquote></div>
      <div className="war-archive">
        <figure className="war-photo w1" style={{transform:`translate3d(${warPointer.x*24}px,${warPointer.y*16}px,0) rotate(-3deg)`}}><img src="/images/mother-farewell.png" alt="Прощание перед уходом на службу"/><figcaption><b>ПРОЩАНИЕ</b><span>Дорога начиналась у родного порога.</span></figcaption></figure>
        <figure className="war-photo w2" style={{transform:`translate3d(${warPointer.x*-19}px,${warPointer.y*-12}px,0) rotate(2deg)`}}><img src="/images/archive-wall/archive-02.jpg" alt="Историческая фотография лазарета"/><figcaption><b>ЛАЗАРЕТ</b><span>Рядом с фронтом шла другая служба — спасать.</span></figcaption></figure>
        <figure className="war-photo w3" style={{transform:`translate3d(${warPointer.x*13}px,${warPointer.y*-8}px,0) rotate(-1deg)`}}><img src="/images/genealogy-portraits-v1/don-officer.jpg" alt="Портрет донского казака"/><figcaption><b>СЛУЖБА</b><span>За формой и чином всегда оставался человек.</span></figcaption></figure>
        <figure className="war-photo w4" style={{transform:`translate3d(${warPointer.x*-11}px,${warPointer.y*9}px,0) rotate(3deg)`}}><img src="/images/archive-wall/archive-29.jpg" alt="Исторический вид казачьей станицы"/><figcaption><b>ДОМ ЖДАЛ</b><span>Станица помнила каждого по имени.</span></figcaption></figure>
      </div>
      <div className="war-line"><span>ФРОНТ</span><i/><span>ЛАЗАРЕТ</span><i/><span>ПИСЬМО</span><i/><span>ПАМЯТЬ</span></div>
    </section>
    <section id="join" className="scene join-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setJoinPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setJoinPointer({x:0,y:0})}>
      <img className="join-cosmic-bg" src="/images/join-mars-cossacks.png" alt="Казаки собираются вместе под космическим небом" style={{transform:`translate3d(${joinPointer.x*-30}px,${joinPointer.y*-18}px,0) scale(1.08)`}}/><div className="join-cosmic-shade"/><div className="join-drift"/><div className="join-orbit"/>
      <div className="join-archive" aria-hidden="true">{joinArchive.map(photo=><figure key={photo.src} className="join-memory" style={{left:`${photo.x}%`,top:`${photo.y}%`,transform:`translate(calc(-50% + ${joinPointer.x*photo.depth*24}px),calc(-50% + ${joinPointer.y*photo.depth*16}px)) rotate(${photo.r}deg)`}}><img src={photo.src} alt=""/><small>{photo.label}</small></figure>)}</div>
      <div className="join-copy"><p className="chapter">МЫ НАШЛИ ДРУГ ДРУГА</p><h2>НАС РАЗДЕЛИЛИ РАССТОЯНИЯ.<br/><i>МЫ ОСТАЛИСЬ ОДНИМ НАРОДОМ.</i></h2><button className="cosmic-join-button" disabled aria-disabled="true"><TwoSabres/><span>РАЗДЕЛ ОБЪЕДИНЕНИЯ ГОТОВИТСЯ</span></button></div>
    </section>
    <footer><div className="brand-mark"><img src="/images/orthodox-cross-logo-v3.png" alt="Православный крест"/></div><p>КАЗАКИ ВСЕГО МИРА<br/><small>COSSACKS OF THE WORLD</small></p><span>© 2026 / ЦИФРОВОЙ МИРОВОЙ ЦЕНТР КАЗАЧЕСТВА</span></footer>
    {selectedAncestor !== null && <div className="photo-lightbox" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedAncestor(null)}}>
      <section className="photo-lightbox-dialog ancestor-lightbox" role="dialog" aria-modal="true" aria-label={`Казачий портрет: ${ancestors[selectedAncestor].label}`}>
        <button className="photo-close" onClick={()=>setSelectedAncestor(null)} aria-label="Закрыть портрет">×</button>
        <div className="photo-viewport"><img src={ancestors[selectedAncestor].src} alt={`${ancestors[selectedAncestor].label}, ${ancestors[selectedAncestor].era}`} style={{transform:`scale(${photoZoom})`}} onClick={()=>setPhotoZoom(photoZoom===1?1.75:1)}/></div>
        <div className="photo-toolbar"><strong>{ancestors[selectedAncestor].label}</strong><span>{ancestors[selectedAncestor].era} · НАЖМИТЕ НА ПОРТРЕТ ДЛЯ УВЕЛИЧЕНИЯ</span><button onClick={()=>setPhotoZoom(Math.max(1,photoZoom-.25))}>−</button><b>{Math.round(photoZoom*100)}%</b><button onClick={()=>setPhotoZoom(Math.min(2.5,photoZoom+.25))}>+</button></div>
      </section>
    </div>}
    {selectedPhoto !== null && <div className="photo-lightbox" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedPhoto(null)}}>
      <section className="photo-lightbox-dialog" role="dialog" aria-modal="true" aria-label={`Архивная фотография: ${hostCollage[selectedPhoto].label}`}>
        <button className="photo-close" onClick={()=>setSelectedPhoto(null)} aria-label="Закрыть фотографию">×</button>
        <div className="photo-viewport"><img src={hostCollage[selectedPhoto].src} alt={`${hostCollage[selectedPhoto].label.toLowerCase()} казаки — архивная фотография крупным планом`} style={{transform:`scale(${photoZoom})`}} onClick={()=>setPhotoZoom(photoZoom===1?1.75:1)}/></div>
        <div className="photo-toolbar"><strong>{hostCollage[selectedPhoto].label}</strong><span>НАЖМИТЕ НА ФОТО ДЛЯ УВЕЛИЧЕНИЯ</span><button onClick={()=>setPhotoZoom(Math.max(1,photoZoom-.25))}>−</button><b>{Math.round(photoZoom*100)}%</b><button onClick={()=>setPhotoZoom(Math.min(2.5,photoZoom+.25))}>+</button></div>
      </section>
    </div>}
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
