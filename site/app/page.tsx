'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Globe2, Menu, Music2, Volume2, VolumeX } from 'lucide-react';

const acts = [
  ['01', 'Кто мы', 'hero'], ['02', 'Разделённая история', 'history'],
  ['03', 'Архив и память', 'people'], ['04', 'Казаки сегодня', 'culture'],
  ['05', 'Мы по всему миру', 'world'], ['06', 'Семьи и родословные', 'roots'],
  ['07', 'Песенная традиция', 'music'], ['08', 'Современные голоса', 'artists'],
  ['09', 'Войска и служба', 'battle'], ['10', 'Присоединиться', 'join'],
];
const portalPages = [
  ['01', 'Главная', 'home'],
  ['02', 'Новости', 'news'],
  ['03', 'История', 'history'],
  ['04', 'Лейбл', 'label'],
  ['05', 'Наследие', 'heritage'],
  ['06', 'О проекте', 'about'],
  ['07', 'Присоединиться', 'join'],
] as const;
const newsItems = [
  {
    slug:'kazachya-stanitsa-moskva-2026',
    date:'12 СЕНТЯБРЯ 2026', section:'КУЛЬТУРА · МОСКВА',
    title:'«Казачья станица Москва» соберёт гостей в Коломенском',
    intro:'XII Международный фестиваль объединит казачью культуру, музыку, ремёсла и конное мастерство.',
    body:'На площадках музея-заповедника «Коломенское» запланированы концертная программа, конкурсы, мастер-классы, выставка народных промыслов, ярмарка, джигитовка, фланкировка и рубка шашкой. Организаторы ожидают участников из разных регионов России и дружественных стран.',
    source:'Казачья станица Москва', url:'https://kazachyastanica.ru/novosti/registracziya-zavershilas-chto-zhdet-uchastnikov-festivalya-kazachya-stanicza-moskva/'
  },
  {
    slug:'kazachiy-krug-chita-2026',
    date:'31 АВГУСТА 2026', section:'ТРАДИЦИЯ · ЧИТА',
    title:'В Чите проходит смотр творческих коллективов «Казачий круг»',
    intro:'Первый этап всероссийского фольклорного конкурса объединил исполнителей Забайкалья и Бурятии.',
    body:'Организаторы заявили более тридцати творческих работ и свыше двухсот участников. Очный смотр назначен на 4 сентября в Центре казачьей культуры в Чите.',
    source:'Ансамбль «Забайкальские казаки»', url:'https://zabkazaki.ru/18274-2/'
  },
  {
    slug:'novocherkassk-voznesenskiy-sobor',
    date:'17 АВГУСТА 2026', section:'НАСЛЕДИЕ · НОВОЧЕРКАССК',
    title:'После реконструкции освящён нижний храм войскового собора',
    intro:'В Патриаршем Вознесенском войсковом всеказачьем соборе освятили Покровский храм-усыпальницу.',
    body:'Чин великого освящения совершил глава Донской митрополии Меркурий. В усыпальнице покоятся основатель Новочеркасска атаман Матвей Платов, генералы Василий Орлов-Денисов, Иван Ефремов и Яков Бакланов, а также архиепископ Донской и Новочеркасский Иоанн.',
    source:'Всероссийское казачье общество', url:'https://vsko.ru/v-novocherkasske-sostoyalos-osvyashhenie-nizhnego-hrama-patriarshego-sobora-posle-rekonstrukczii/'
  },
] as const;
const artists = [
  // Calibrate from the visible crown-to-chin height, never the whole PNG.
  // For a group use the average head; natural differences between people remain.
  { name:'РГД', copy:'Ритм земли. Голос поколения.', image:'/images/artist-rgd-framed.png', width:868, height:1320, headHeight:195, headTop:15 },
  { name:'ЖЕНЯ СЕРОВА', copy:'Тепло родной земли. Музыка от сердца.', image:'/images/artist-serova-framed.png', width:931, height:1549, headHeight:430, headTop:6 },
  { name:'YAZHEVIKA', copy:'Сталь, крест и женская сила Дона.', image:'/images/artist-yazhevika-concert-framed.png', width:925, height:1394, headHeight:250, headTop:6 },
];
const playlist = [
  {src:'/audio/stal-i-krest.mp3', title:'YAZHEVIKA x LRNA — Сталь и Крест'},
  {src:'/audio/alaya-noch-rock.mp3', title:'YAZHEVIKA — Алая Ночь Рок'},
  {src:'/audio/alaya-noch.mp3', title:'YAZHEVIKA — Алая Ночь'},
  {src:'/audio/veterochki.mp3', title:'YAZHEVIKA — Ветерочки'},
  {src:'/audio/vorony.mp3', title:'YAZHEVIKA x Чериган — Вороны'},
  {src:'/audio/marusya.mp3', title:'YAZHEVIKA — Маруся'},
  {src:'/audio/put-dorojka-mix2.mp3', title:'YAZHEVIKA — Путь дорожка'},
  {src:'/audio/rodina-mat.mp3', title:'YAZHEVIKA — Родина Мать'},
  {src:'/audio/mily-ne-speshi.mp3', title:'YAZHEVIKA — Милый, не спеши'},
  {src:'/audio/oisya.mp3', title:'YAZHEVIKA x SHUTIK — Ойся'},
  {src:'/audio/russkaya-rat-rock-drum.mp3', title:'YAZHEVIKA x YURI KAZBANOV — РУССКАЯ РАТЬ РОК'},
  {src:'/audio/russkaya-rat.mp3', title:'YAZHEVIKA x SHUTIK — Русская Рать'},
  {src:'/audio/utro.mp3', title:'YAZHEVIKA x V1NCENT — Утро'},
  {src:'/audio/rgd-lyubo-nam.mp3', title:'РГД — Любо нам'},
  {src:'/audio/rgd-chyorny-voron.mp3', title:'РГД — Чёрный ворон'},
  {src:'/audio/rgd-batyushka-don.mp3', title:'РГД — Батюшка Дон'},
  {src:'/audio/rgd-shyol-kazak.mp3', title:'РГД — Шёл казак'},
  {src:'/audio/rgd-zhenya-serova-devochka-kazachka.mp3', title:'РГД x Женя Серова — Девочка-казачка'},
];
const battleHosts = [
  {name:'ДОНСКОЕ',tab:'ДОНСКОЕ',year:'1812',place:'ЗАПАДНЫЙ ПОХОД',title:'Удар с фланга',copy:'Подвижные донские полки вели разведку, тревожили коммуникации и преследовали отступающие части армии Наполеона.',image:'/images/battle-hosts-v1/don-1812.png'},
  {name:'КУБАНСКОЕ',tab:'КУБАНСКОЕ',year:'1860-е',place:'ЗАКУБАНСКАЯ ЛИНИЯ',title:'Через горную воду',copy:'Кубанское войско складывалось на кавказской границе. Здесь конный строй встречался с теснинами, лесом и речными переправами.',image:'/images/battle-hosts-v1/kuban-caucasus.png'},
  {name:'ТЕРСКОЕ',tab:'ТЕРСКОЕ',year:'1860-е',place:'КАВКАЗСКАЯ ЛИНИЯ',title:'Держать рубеж',copy:'Терские станицы стояли вдоль укреплённых линий Кавказа: дозор, внезапная схватка и возвращение к заставе были одной службой.',image:'/images/battle-hosts-v1/terek-line.png'},
  {name:'ЯИЦКОЕ · УРАЛЬСКОЕ',tab:'ЯИЦКОЕ / УРАЛЬСКОЕ',year:'XVIII-XIX ВЕКА',place:'РЕКА ЯИК · УРАЛ',title:'Степной строй',copy:'Яицкое казачье войско после 1775 года стало называться Уральским. Его история продолжилась в степной службе, на речных рубежах и в дальних походах.',image:'/images/battle-hosts-v1/ural-yaik.png'},
  {name:'ОРЕНБУРГСКОЕ',tab:'ОРЕНБУРГСКОЕ',year:'1870-е',place:'СРЕДНЕАЗИАТСКИЙ РУБЕЖ',title:'Пыль крепостных стен',copy:'Оренбургские части несли пограничную службу и участвовали в походах, где расстояние, жара и вода решали не меньше оружия.',image:'/images/battle-hosts-v1/orenburg-frontier.png'},
  {name:'СИБИРСКОЕ',tab:'СИБИРСКОЕ',year:'XIX ВЕК',place:'СИБИРСКАЯ ЛИНИЯ',title:'Зимний переход',copy:'Восточная служба измерялась замёрзшими реками, таёжными дорогами и заставами, разделёнными сотнями вёрст.',image:'/images/battle-hosts-v1/siberian-winter.png'},
  {name:'СЕМИРЕЧЕНСКОЕ',tab:'СЕМИРЕЧЕНСКОЕ',year:'КОНЕЦ XIX ВЕКА',place:'СЕМЬ РЕК',title:'Высота и простор',copy:'Семиреченские сотни действовали между степью и Тянь-Шанем, где конная колонна становилась связью между далёкими постами.',image:'/images/battle-hosts-v1/semirechye.png'},
  {name:'ЗАБАЙКАЛЬСКОЕ',tab:'ЗАБАЙКАЛЬСКОЕ',year:'1904-1905',place:'МАНЬЧЖУРИЯ',title:'Разведка у железной дороги',copy:'В русско-японскую войну забайкальские части вели разведку, прикрывали фланги и действовали на огромном маньчжурском театре.',image:'/images/battle-hosts-v1/transbaikal-1904.png'},
  {name:'АМУРСКОЕ',tab:'АМУРСКОЕ',year:'1900',place:'АМУРСКИЙ РУБЕЖ',title:'Переправа',copy:'Амурские казаки охраняли дальневосточную границу и коммуникации, где широкая река была одновременно дорогой и рубежом.',image:'/images/battle-hosts-v1/amur-1900.png'},
  {name:'УССУРИЙСКОЕ',tab:'УССУРИЙСКОЕ',year:'1904-1905',place:'ПРИМОРЬЕ',title:'Дозор из камышей',copy:'Уссурийские разъезды работали в дождливых долинах Дальнего Востока: короткий бой начинался там, где кончалась видимость.',image:'/images/battle-hosts-v1/ussuri-recon.png'},
];
const archivePhotos = [
  '/images/archive-curated-v1/_review/review-01.jpg',
  '/images/archive-curated-v1/_review/review-02.jpg',
  '/images/archive-curated-v1/_review/review-04.jpg',
  '/images/archive-curated-v1/_review/review-11.jpg',
  '/images/archive-curated-v1/_review/review-12.jpg',
  '/images/archive-curated-v1/_review/review-14.jpg',
  '/images/archive-curated-v1/_review/review-16.jpg',
  '/images/archive-curated-v1/_review/review-17.jpg',
  '/images/archive-curated-v1/_review/review-19.jpg',
  '/images/archive-curated-v1/_review/review-22.jpg',
  '/images/genealogy-portraits-v1/cossack-woman.jpg',
  '/images/genealogy-portraits-v1/don-ataman.jpg',
  '/images/genealogy-portraits-v1/don-babkin.jpg',
  '/images/genealogy-portraits-v1/don-officer.jpg',
  '/images/genealogy-portraits-v1/kuban-cossack.jpg',
  '/images/genealogy-portraits-v1/orenburg-cossack.jpg',
  '/images/genealogy-portraits-v1/siberian-cossack.jpg',
  '/images/archive-curated-v1/new/war-regiment-1892.jpg',
];
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
  {n:1,x:57,y:39,ax:62,ay:48,src:'/images/archive-curated-v1/_review/review-01.jpg',label:'Русские казаки',era:'около 1906'},
  {n:2,x:66,y:27,ax:68,ay:41,src:'/images/archive-curated-v1/_review/review-02.jpg',label:'Казачий семейный портрет',era:'1906–1914'},
  {n:3,x:75,y:20,ax:75,ay:38,src:'/images/archive-curated-v1/_review/review-12.jpg',label:'Казак из степей России',era:'начало XX века'},
  {n:4,x:84,y:26,ax:82,ay:41,src:'/images/archive-curated-v1/_review/review-14.jpg',label:'Казак Лейб-гвардии',era:'1907–1914'},
  {n:5,x:92,y:38,ax:88,ay:48,src:'/images/archive-curated-v1/_review/review-22.jpg',label:'Сибирский казак',era:'1900-е'},
  {n:27,x:88,y:53,ax:84,ay:55,src:'/images/genealogy-portraits-v1/don-babkin.jpg',label:'Иван Бабкин с супругой',era:'1880-е'},
  {n:28,x:77,y:50,ax:77,ay:56,src:'/images/genealogy-portraits-v1/kuban-cossack.jpg',label:'Кубанский казак',era:'около 1920'},
  {n:29,x:66,y:52,ax:70,ay:56,src:'/images/genealogy-portraits-v1/orenburg-cossack.jpg',label:'Оренбургский казак',era:'XIX век'},
];
const hostCollage = [
  {src:'/images/hosts-collage/don.jpg',label:'ДОНСКИЕ',x:1,y:4,r:-5,w:39},
  {src:'/images/hosts-collage/terek.jpg',label:'ТЕРСКИЕ',x:35,y:1,r:4,w:35},
  {src:'/images/hosts-collage/kuban.jpg',label:'КУБАНСКИЕ',x:67,y:7,r:3,w:31},
  {src:'/images/archive-curated-v1/_review/review-04.jpg',label:'СЛУЖБА',x:3,y:48,r:4,w:31},
  {src:'/images/archive-curated-v1/_review/review-16.jpg',label:'СЕМЬИ',x:27,y:29,r:-2,w:35},
  {src:'/images/archive-curated-v1/_review/review-17.jpg',label:'СТАНИЦЫ',x:62,y:42,r:6,w:32},
  {src:'/images/archive-curated-v1/_review/review-19.jpg',label:'ПОКОЛЕНИЯ',x:17,y:58,r:-6,w:25},
];
const musicFaces = [
  {src:'/images/artist-rgd-cutout-v5.png',name:'РГД',era:'СЕЙЧАС',kind:'modern'},
];
const joinArchive: {src:string;label:string;x:number;y:number;r:number;depth:number}[] = [];

function ShashkaPair({className=''}:{className?:string}) {
  return <img className={`shashka-pair ${className}`} src="/images/shashkas-reference-clean.png" alt="" aria-hidden="true"/>;
}

function CrossedSabres() {
  return <span className="sabres" aria-hidden="true"><span className="sabres-orbit"/><ShashkaPair className="hero-shashkas"/></span>;
}

const contactUrl = 'https://t.me/cossacksoftheworldbot';
function WorldEntryButton({onClick,href,label='ВОЙТИ В НАШ МИР'}:{onClick?:()=>void;href?:string;label?:string}) {
  const content = <><CrossedSabres/><span>{label}</span></>;
  return href ? <a className="ceremonial-button world-entry-button" href={href} target="_blank" rel="noopener noreferrer">{content}</a> : <button className="ceremonial-button world-entry-button" onClick={onClick}>{content}</button>;
}

function TwoSabres() {
  return <span className="join-sabres" aria-hidden="true"><ShashkaPair className="join-shashkas"/></span>;
}

export default function Home() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const [view, setView] = useState('home');
  const [scroll, setScroll] = useState(0);
  const [menu, setMenu] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  // Navigation history must update synchronously, including rapid arrow clicks.
  const playHistoryRef = useRef<number[]>([]);
  const [artist, setArtist] = useState(0);
  useEffect(() => {
    // Warm the current artwork, never reuse another artist's painted image.
    const portraits = artists.map(({ image }) => {
      const portrait = new Image();
      portrait.src = image;
      void portrait.decode().catch(() => {});
      return portrait;
    });
    return () => { portraits.length = 0; };
  }, []);
  const [pointer, setPointer] = useState({x:0,y:0});
  const [peoplePointer, setPeoplePointer] = useState({x:0,y:0});
  const [soonOpen, setSoonOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<number|null>(null);
  const [focusedAncestor, setFocusedAncestor] = useState<number|null>(null);
  const [nationPointer, setNationPointer] = useState({x:0,y:0});
  const [culturePointer, setCulturePointer] = useState({x:0,y:0});
  const [collagePointer, setCollagePointer] = useState({x:0,y:0});
  const [collageHeld, setCollageHeld] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number|null>(null);
  const [selectedAncestor, setSelectedAncestor] = useState<number|null>(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [warPointer, setWarPointer] = useState({x:0,y:0});
  const [joinPointer, setJoinPointer] = useState({x:0,y:0});
  const [worldPointer, setWorldPointer] = useState({x:0,y:0});
  const [battleIndex, setBattleIndex] = useState(0);
  const [battlePointer, setBattlePointer] = useState({x:0,y:0});
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStartedRef = useRef(false);
  const currentTrackRef = useRef(0);
  const playRequestRef = useRef(0);
  const wantsPlaybackRef = useRef(false);
  const playerChannelRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('cossacks-radio');
    playerChannelRef.current = channel;
    channel.onmessage = event => {
      if (event.data !== 'play') return;
      ++playRequestRef.current;
      wantsPlaybackRef.current = false;
      audioRef.current?.pause();
      setPlaying(false);
    };
    return () => { channel.close(); playerChannelRef.current = null; };
  }, []);
  useEffect(() => {
    const readView = () => {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const section = parts[0] === 'ru' ? (parts[1] || 'home') : (parts[0] || 'home');
      const newsSlug = section === 'news' ? parts[2] : undefined;
      const newsIndex = newsSlug ? newsItems.findIndex(item=>item.slug===newsSlug) : -1;
      setView(portalPages.some(([, , id]) => id === section) ? section : 'home');
      setSelectedNews(newsIndex >= 0 ? newsIndex : null);
      window.scrollTo(0, 0);
    };
    readView();
    window.addEventListener('popstate', readView);
    return () => window.removeEventListener('popstate', readView);
  }, []);
  useEffect(() => {
    const update = () => setScroll(window.scrollY);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = .42;
  }, []);
  // Selection stays under the reader's control; long copy never changes mid-read.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('.scene, .battle-chronicle').forEach(scene => {
          if (!scene.getClientRects().length) return;
          const rect = scene.getBoundingClientRect();
          const offset = reduce.matches ? 0 : Math.max(-12, Math.min(12, (window.innerHeight / 2 - rect.top - rect.height / 2) * .025));
          scene.style.setProperty('--scene-shift', `${offset}px`);
        });
      });
    };
    update();
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    reduce.addEventListener('change', update);
    return () => {cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update);reduce.removeEventListener('change',update);};
  }, [view]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {if(event.key === 'Escape') setMenu(false);};
    window.addEventListener('keydown',close);
    return () => window.removeEventListener('keydown',close);
  }, []);
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
  const openPage = (next: string) => {
    window.history.pushState({}, '', next === 'home' ? '/' : `/ru/${next}`);
    setView(next);
    setSelectedNews(null);
    setMenu(false);
    window.scrollTo({top:0, behavior:'smooth'});
  };
  const openNews = (index:number) => {
    window.history.pushState({}, '', `/ru/news/${newsItems[index].slug}`);
    setView('news');
    setSelectedNews(index);
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const closeNews = () => {
    window.history.pushState({}, '', '/ru/news');
    setSelectedNews(null);
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const playTrack = async (next:number, remember=true) => {
    const audio=audioRef.current; if (!audio) return;
    const request = ++playRequestRef.current;
    wantsPlaybackRef.current = true;
    playerChannelRef.current?.postMessage('play');
    const previous = currentTrackRef.current;
    if (remember && hasStartedRef.current && next !== previous) {
      playHistoryRef.current = [...playHistoryRef.current.slice(-99), previous];
    }
    currentTrackRef.current = next;
    hasStartedRef.current = true;
    // One owner of the media source: React updates labels, not the audio src.
    // Keep play() inside the original user gesture, including the first click.
    if (audio.getAttribute('src') !== playlist[next].src) audio.src = playlist[next].src;
    setTrackIndex(next);
    try {
      await audio.play();
      if (request === playRequestRef.current) { hasStartedRef.current = true; setPlaying(true); }
    } catch {
      if (request === playRequestRef.current) { wantsPlaybackRef.current = false; setPlaying(false); }
    }
  };
  const toggleMusic = async () => {
    const audio = audioRef.current; if (!audio) return;
    if (!wantsPlaybackRef.current && audio.paused) {
      await playTrack(hasStartedRef.current ? currentTrackRef.current : Math.floor(Math.random()*playlist.length), false);
    } else {
      ++playRequestRef.current;
      wantsPlaybackRef.current = false;
      audio.pause(); setPlaying(false);
    }
  };
  const nextTrack = () => {
    if (playlist.length<2) return;
    const candidate = Math.floor(Math.random() * (playlist.length - 1));
    const next = candidate >= currentTrackRef.current ? candidate + 1 : candidate;
    void playTrack(next);
  };
  const previousTrack = () => {
    const previous = playHistoryRef.current.pop();
    if (previous !== undefined) {
      void playTrack(previous, false);
      return;
    }
    // At the beginning of listening history, restart this track rather than
    // unexpectedly sending the listener forward to another random song.
    if (hasStartedRef.current) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      void playTrack(currentTrackRef.current, false);
    } else {
      void playTrack(Math.floor(Math.random() * playlist.length), false);
    }
  };
  const enterWorld = async () => { if (!playing) await toggleMusic(); openPage('join'); };
  const playPhotoSound = () => {
    const AudioCtx = window.AudioContext || (window as typeof window & {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx(); const now=ctx.currentTime;
    const gain=ctx.createGain(); gain.gain.setValueAtTime(.0001,now); gain.gain.exponentialRampToValueAtTime(.075,now+.018); gain.gain.exponentialRampToValueAtTime(.0001,now+.42); gain.connect(ctx.destination);
    const osc=ctx.createOscillator(); osc.type='sine'; osc.frequency.setValueAtTime(220,now); osc.frequency.exponentialRampToValueAtTime(520,now+.22); osc.connect(gain); osc.start(now); osc.stop(now+.44);
  };
  const openPhoto = (index:number) => { playPhotoSound(); setPhotoZoom(1); setSelectedPhoto(index); };

  return <main className={`portal-view portal-view-${view}`} data-ready={ready}>
    <svg width="0" height="0" aria-hidden="true" style={{position:'absolute',pointerEvents:'none'}}><defs><filter id="artist-soft-contour" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB"><feMorphology in="SourceAlpha" operator="erode" radius="1.1" result="inset"/><feGaussianBlur in="inset" stdDeviation="1" result="soft"/><feComposite in="SourceGraphic" in2="soft" operator="in"/></filter></defs></svg>
    <audio ref={audioRef} preload="metadata" onEnded={nextTrack} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} />
    <div className="progress" style={{ transform: `scaleX(${Math.min(1, scroll / 7500)})` }} />
    <header className="topbar">
      <button className="brand" onClick={() => openPage('home')} aria-label="На главную"><span className="brand-mark"><img src="/images/orthodox-cross-logo-v3.png" alt="" aria-hidden="true"/></span><span>КАЗАКИ<br/>ВСЕГО МИРА</span></button>
      <nav className="quick-nav portal-nav" aria-label="Основные разделы">{portalPages.map(([,title,id])=><button key={id} className={view===id?'active':''} onClick={()=>openPage(id)}>{title}</button>)}</nav>
      <div className="topline" />
      <div className="top-actions"><div className="track-controls" title={playlist[trackIndex].title}><button onClick={previousTrack} aria-label="Предыдущая песня"><ChevronLeft size={16}/></button><button className={`sound ${playing?'is-playing':'is-muted'}`} onClick={toggleMusic} aria-label={playing?'Выключить музыку':'Включить музыку'} aria-pressed={playing}>{playing?<Volume2 size={17}/>:<VolumeX size={17}/>}<i/></button><button onClick={nextTrack} aria-label="Следующая случайная песня"><ChevronRight size={16}/></button></div><button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="site-menu"><Menu size={18}/> МЕНЮ</button></div>
    </header>
    <aside id="site-menu" className={`chapter-menu ${menu ? 'open' : ''}`}>
      <div className="menu-label">МЕНЮ</div>
      {portalPages.map(([n, title, id]) => <button key={id} className={view===id?'active':''} onClick={() => openPage(id)}><span>{n}</span>{title}</button>)}
    </aside>

    <section id="hero" className="scene hero">
      <img className="hero-image parallax" src="/images/hero-cossacks-detailed-1920.webp" srcSet="/images/hero-cossacks-detailed-1280.webp 1280w, /images/hero-cossacks-detailed-1920.webp 1920w, /images/hero-cossacks-detailed-3840.webp 3840w" sizes="100vw" alt="Художественная иллюстрация: казаки верхом в вечерней степи" fetchPriority="high" />
      <div className="hero-haze" style={{ transform: `translateY(${scroll * .35}px)` }} />
      <img className="hero-grass-object" src="/images/steppe-foreground.png" alt="" style={{transform:`translate3d(0,${Math.max(-10,Math.min(10,scroll*-.018))}px,0) scale(1.035)`}}/>
      <div className="hero-copy" style={{ transform: `translateY(${scroll * .12}px)`, opacity: Math.max(.12, 1-scroll/850) }}>
        <p className="eyebrow">МЕЖДУНАРОДНЫЙ ЦИФРОВОЙ ЦЕНТР КАЗАЧЕСТВА</p>
        <h1>КАЗАКИ<br/><em>ВСЕГО</em><br className="hero-mobile-break"/> МИРА</h1><p className="hero-en">COSSACKS OF THE WORLD</p><p className="hero-intro">Международный проект, который соединяет казаков, сохраняет историю и помогает культуре жить сегодня.</p>
        <div className="hero-bottom"><p>Один народ, одна память, один мир</p><WorldEntryButton onClick={enterWorld}/></div>
      </div><div className="act-stamp"><span>АКТ</span><strong>I</strong></div>
    </section>
    <section id="news" className="scene portal-news" onClick={event=>{if(selectedNews !== null && event.target === event.currentTarget) closeNews();}}>
      <div className="portal-news-bg" />
      {selectedNews === null ? <>
        <div className="portal-news-copy"><h2>НОВОСТИ<br/><i>КАЗАЧЬЕГО МИРА</i></h2></div>
        <div className="portal-news-grid">{newsItems.map((item,index)=><article className="news-card" key={item.title}><button className="news-card-trigger" type="button" onClick={()=>openNews(index)}><span>{item.section}</span><time>{item.date}</time><h3>{item.title}</h3><p>{item.intro}</p><b>{String(index+1).padStart(2,'0')}<i>ЧИТАТЬ</i></b></button></article>)}</div>
      </> : <article className="portal-news-article" aria-labelledby="news-article-title">
        <button className="news-back" type="button" onClick={closeNews}>← НАЗАД К НОВОСТЯМ</button>
        <header><span>{newsItems[selectedNews].section}</span><time>{newsItems[selectedNews].date}</time></header>
        <h1 id="news-article-title">{newsItems[selectedNews].title}</h1>
        <p className="news-article-intro">{newsItems[selectedNews].intro}</p>
        <div className="news-article-body"><p>{newsItems[selectedNews].body}</p></div>
        <a className="news-source" href={newsItems[selectedNews].url} target="_blank" rel="noreferrer">ПЕРВОИСТОЧНИК · {newsItems[selectedNews].source}<ArrowUpRight size={17}/></a>
        <aside className="news-related"><p>ПРОДОЛЖИТЬ ЗНАКОМСТВО С ПРОЕКТОМ</p><button onClick={()=>openPage('history')}>ИСТОРИЯ</button><button onClick={()=>openPage('heritage')}>НАСЛЕДИЕ</button><a href="https://t.me/cossacksoftheworldbot" target="_blank" rel="noreferrer">ПРИСЛАТЬ НОВОСТЬ</a></aside>
      </article>}
    </section>

    <section id="history" className="scene history-scene">
      <img className="history-bg" src="/images/history-stanitsa-1920.webp" srcSet="/images/history-stanitsa-1280.webp 1280w, /images/history-stanitsa-1920.webp 1920w, /images/history-stanitsa-3840.webp 3840w" sizes="100vw" alt="" aria-hidden="true"/>
      <div className="scene-copy left history-origin-copy"><p className="chapter">ПАМЯТЬ · ТРАДИЦИЯ · ИСТОРИЯ</p><h2><span>КАЗАЧЕСТВО</span><span><i>СКВОЗЬ ВЕКА</i></span></h2><p className="lead">Казачество прошло через века служения, переселений, испытаний и созидания. Менялись границы и государства, возникали войска, станицы и общины, но сохранялись память, традиции, вера, семья и имя казака.</p><p className="history-origin-final">Нас объединяет не одна территория. Нас объединяет история.</p></div>
    </section>
    <section id="people" className="scene people-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setPeoplePointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setPeoplePointer({x:0,y:0})}>
      <div className="archive-wall" style={{transform:`translate3d(${peoplePointer.x*-7}px,${peoplePointer.y*-5}px,0) rotate(-.45deg) scale(1.07)`}}>{archivePhotos.map((src,i)=>{const depth=.45+(i%6)*.18;return <img key={src} src={src} alt={`Старинная фотография казаков ${i+1}`} decoding="async" style={{transform:`translate3d(${peoplePointer.x*depth*24+((i%6)-2.5)*Math.max(-9,Math.min(9,(scroll-1900)*.004))}px,${peoplePointer.y*depth*17+((i%5)-2)*Math.max(-16,Math.min(16,(scroll-1900)*.007))}px,0) rotate(${(i%7)-3}deg) scale(${1+depth*.018})`}}/>})}</div><div className="people-vignette"/>
      <div className="scene-copy heritage-emotion-copy"><p className="chapter">ПАМЯТЬ СОЕДИНЯЕТ ПОКОЛЕНИЯ</p><h2><span>КАЖДЫЙ ЧЕЛОВЕК</span><span><i>ДОСТОИН ПАМЯТИ</i></span></h2><p className="heritage-lead"><strong>Наши семьи — это тысячи судеб, имён, фотографий и историй.</strong><br/>То, что не сохранить сегодня, однажды может исчезнуть навсегда.</p><p className="heritage-accent">Никто не должен быть потерян</p><p className="heritage-soon">Скоро мы откроем «Наследие»</p></div>
    </section>
    <section id="nation" className="scene nation-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setNationPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setNationPointer({x:0,y:0})}>
      <img className="nation-bg nation-family-art" src="/images/nation-family-detailed-1920.webp" srcSet="/images/nation-family-detailed-1280.webp 1280w, /images/nation-family-detailed-1920.webp 1920w, /images/nation-family-detailed-3840.webp 3840w" sizes="100vw" alt="Художественная иллюстрация: казачья семья у станичного храма" style={{'--family-pan':`${nationPointer.x*10}px`} as CSSProperties}/>
      <div className="nation-shade"/>
      <div className="nation-emblem" aria-hidden="true" style={{transform:`translate3d(${nationPointer.x*-12}px,${nationPointer.y*-9}px,0) scale(${1.06+Math.abs(nationPointer.x)*.08})`}}>
        <img className="orthodox-cross" src="/images/orthodox-cross-reference-v2.png" alt=""/>
      </div>
      <div className="nation-copy"><p className="chapter">МЕЖДУНАРОДНЫЙ ЦИФРОВОЙ ЦЕНТР</p><h2 className="nation-title"><span>КАЗАКИ</span><span><i>НАРОД</i></span></h2><p>Мы объединяем казаков по всему миру, сохраняем историю и культуру, поддерживаем современное творчество и создаём проекты для будущих поколений.</p><p className="nation-statement">Мы — один народ, одна большая семья</p><WorldEntryButton label="ПРИСОЕДИНИТЬСЯ" href={contactUrl}/></div><div className="nation-word">НАРОД</div>
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
      <div className="scene-copy left"><p className="chapter">ДОН · КАЗАЧИЙ МИР</p><h2>МЫ ЖИВЁМ<br/><i>ПО ВСЕМУ МИРУ</i></h2><p className="lead">Дон — наше сердце и начало общей истории. Сегодня казаки живут в разных странах, но остаются одним народом. География проекта растёт вместе с новыми семьями и общинами.</p><WorldEntryButton label="ПЕРЕЙТИ В НАСЛЕДИЕ" onClick={()=>openPage('heritage')}/></div>
    </section>
    <section id="roots" className={`scene genealogy-scene ${focusedAncestor!==null?'is-focusing':''}`}>
      <div className="genealogy-atmosphere"/><div className="genealogy-shade"/>
      <div className="genealogy-object" style={{transform:`translate3d(${focusedAncestor===null?0:(50-ancestors[focusedAncestor].x)*1.2}px,${Math.max(-62,Math.min(62,(scroll-4700)*.045))+(focusedAncestor===null?0:(44-ancestors[focusedAncestor].y)*.7)}px,0) scale(${focusedAncestor===null?1:1.1})`}}>
        <img className="genealogy-tree" src="/images/genealogy-wide-right-v2.png" alt="Генеалогическое древо казачьих семей" loading="lazy" decoding="async"/>
        <div className="tree-lamp" aria-hidden="true"/>
        <svg className="genealogy-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{ancestors.map((a,i)=><g key={`link-${a.n}`}><path d={`M${a.ax} ${a.ay} Q${(a.ax+a.x)/2} ${Math.min(a.ay,a.y)-2} ${a.x} ${a.y}`}/><circle cx={a.ax} cy={a.ay} r=".45"/><circle cx={a.x} cy={a.y} r=".32"/></g>)}</svg>
        {ancestors.map((a,i)=><button key={a.n} className={`ancestor-node ${focusedAncestor===i?'focused':''}`} style={{left:`${a.x}%`,top:`${a.y}%`}} onMouseEnter={()=>setFocusedAncestor(i)} onMouseLeave={()=>setFocusedAncestor(null)} onFocus={()=>setFocusedAncestor(i)} onBlur={()=>setFocusedAncestor(null)} onClick={()=>{setPhotoZoom(1);setSelectedAncestor(i)}} aria-label={`Открыть портрет: ${a.label}`}><span className="portrait-frame"><img src={a.src} alt={`${a.label}, ${a.era}`} loading="lazy" decoding="async"/></span></button>)}
      </div>
      <div className="roots-copy heritage-roots-copy"><p className="chapter">НАСЛЕДИЕ · СКОРО</p><h2><span>НАЙДИ</span><span><i>СВОИ КОРНИ</i></span></h2><h3>СОЕДИНИ ИСТОРИЮ СВОЕЙ СЕМЬИ</h3><p>Имена забываются. Фотографии теряются. Семейные истории уходят вместе с людьми, которые их помнят.</p><p>Мы создаём место, где память о семье сможет жить дальше, соединяя людей, поколения и корни.</p><p className="heritage-roots-accent">Возможно, часть вашей истории уже кто-то сохранил</p><p className="heritage-launch-label">НАСЛЕДИЕ СКОРО ОТКРОЕТСЯ</p><a className="heritage-launch-button" href={contactUrl} target="_blank" rel="noopener noreferrer">УЗНАТЬ О ЗАПУСКЕ ПЕРВЫМ</a></div>
    </section>
    <section id="culture" className="scene generations-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setCulturePointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setCulturePointer({x:0,y:0})}>
      <img className="generations-bg" src="/images/living-generations-v2.png" alt="Донская казачка в народном костюме и казаки в папахах - живая культура поколений" style={{transform:`translate3d(${culturePointer.x*-16}px,${Math.max(-42,Math.min(42,(scroll-5600)*-.02))+culturePointer.y*-10}px,0) scale(1.11)`}}/><div className="generations-shade"/>
      <div className="culture-copy"><p className="chapter">КУЛЬТУРА ЖИВЁТ</p><h2>МЫ ПОМНИМ<br/><i>МЫ ПРОДОЛЖАЕМ</i></h2></div>
      <div className="generation-phrase"><span className="elders-line" style={{transform:`translate3d(${culturePointer.x*8}px,${culturePointer.y*4+Math.max(-7,Math.min(7,(scroll-5600)*-.004))}px,0)`}}>Старшие передают память</span><span className="young-line" style={{transform:`translate3d(${culturePointer.x*16}px,${culturePointer.y*8+Math.max(-10,Math.min(10,(scroll-5600)*.006))}px,12px)`}}>Молодые берут её в будущее</span></div>
    </section>
    <section id="hosts" className="scene hosts-collage-scene">
      <div className="hosts-collage-heading"><div><p className="chapter">КАЗАЧЬИ СЕМЬИ И ВОЙСКА</p><h2>РАЗНЫЕ ВОЙСКА<br/><i>ОБЩАЯ ПАМЯТЬ</i></h2></div><p>Дон, Терек, Кубань, Яик — разные земли, один народ и одна память</p></div>
      <div className={`hosts-collage-stage ${collageHeld?'held':''}`} onPointerMove={event=>{const r=event.currentTarget.getBoundingClientRect();setCollagePointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);setCollageHeld(true)}} onPointerUp={()=>setCollageHeld(false)} onPointerCancel={()=>setCollageHeld(false)} onPointerLeave={()=>{setCollageHeld(false);setCollagePointer({x:0,y:0})}}>
        {hostCollage.map((item,i)=><figure key={`${item.label}-${i}`} className="collage-card" role="button" tabIndex={0} aria-label={`Открыть фотографию: ${item.label}`} onClick={()=>openPhoto(i)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openPhoto(i)}}} style={{left:`${item.x}%`,top:`${item.y}%`,width:`${item.w}%`,zIndex:i+1,transform:`translate3d(${collagePointer.x*((i%3)-1)*18}px,${collagePointer.y*((i%4)-1.5)*13}px,${i*2}px) rotate(${item.r}deg) scale(${collageHeld?1.025:1})`}}><img src={item.src} alt={`${item.label.toLowerCase()} казаки - архивная фотография`}/><figcaption>{item.label}</figcaption></figure>)}
      </div>
    </section>
    <section id="artists" className="scene living-culture">
      <div className="living-heading"><p className="chapter">ЛИЦА / ГОЛОСА / ХАРАКТЕР</p><h2>НОВЫЕ ГОЛОСА<br/><i>ТРАДИЦИИ</i></h2><p>Современные исполнители продолжают казачью песенную традицию.</p></div>
      <div className={`artist-stage artist-stage-${artist}`} onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();setPointer({x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setPointer({x:0,y:0})}>
        <img className="artist-stage-bg" src="/images/don-steppe-parallax.png" alt="" style={{transform:`translate3d(${pointer.x*-70}px,${pointer.y*-42}px,0) scale(1.12)`}}/>
        <figure key={artists[artist].image} className={`artist-portrait artist-portrait-${artist}`} style={{'--portrait-height-ratio':artists[artist].height/artists[artist].headHeight,'--portrait-width-ratio':artists[artist].width/artists[artist].headHeight,'--portrait-head-offset':artists[artist].headTop/artists[artist].headHeight} as CSSProperties}><img className={`artist-stage-person active artist-person-${artist}`} src={artists[artist].image} alt={artists[artist].name} decoding="async" style={{opacity:0}} ref={image => { if (!image) return; void image.decode().then(() => { if (image.isConnected) image.style.opacity = '1'; }).catch(() => {}); }}/></figure>
        <div className="artist-stage-fog fog-back" style={{transform:`translate3d(${pointer.x*-24}px,${pointer.y*-8}px,0)`}}/><div className="artist-stage-fog fog-front" style={{transform:`translate3d(${pointer.x*36}px,${pointer.y*14}px,0)`}}/>
        <div className="artist-stage-copy"><h3>{artists[artist].name}</h3><p>{artists[artist].copy}</p></div>
        <div className="artist-tabs">{artists.map((a,i)=><button key={a.name} className={artist===i?'active':''} onClick={()=>setArtist(i)}>{a.name}</button>)}</div>
      </div>
      <div id="battle" className="battle-chronicle" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setBattlePointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setBattlePointer({x:0,y:0})}>
        <div className="battle-overview"><p className="chapter">ВОЙСКА · ЗЕМЛИ · СЛУЖБА</p><h2>ДЕСЯТЬ ВОЙСК<br/><i>ОДНА ИСТОРИЯ</i></h2><p>Дон, Кубань, Терек, Урал, Оренбуржье, Сибирь и другие казачьи земли формировали собственные традиции и характер. Каждое войско имело свою историю, но вместе они создавали единый казачий мир.</p></div>
        <div className="battle-images" style={{transform:`translate3d(${battlePointer.x*-16}px,${battlePointer.y*-10}px,0) scale(1.035)`}}><img className="active" src={battleHosts[battleIndex].image} alt={`${battleHosts[battleIndex].name.toLowerCase()} казачье войско`} decoding="async"/></div>
        <div className="battle-shade"/>
        <div className="battle-copy" style={{transform:`translate3d(${battlePointer.x*10}px,${battlePointer.y*7}px,0)`}}><span>{battleHosts[battleIndex].year} · {battleHosts[battleIndex].place}</span><h3>{battleHosts[battleIndex].name}<i> ВОЙСКО</i></h3><h4>{battleHosts[battleIndex].title}</h4><p>{battleHosts[battleIndex].copy}</p></div>
        <div className="battle-counter"><b>{String(battleIndex+1).padStart(2,'0')}</b><i/>10</div>
        <div className="battle-rail">{battleHosts.map((host,i)=><button key={host.name} className={i===battleIndex?'active':''} onClick={()=>setBattleIndex(i)} aria-label={`Показать: ${host.name}`}><b>{String(i+1).padStart(2,'0')}</b><span>{host.tab}</span></button>)}</div>
        <div className="battle-arrows"><button onClick={()=>setBattleIndex(v=>(v-1+battleHosts.length)%battleHosts.length)} aria-label="Предыдущая картина">←</button><button onClick={()=>setBattleIndex(v=>(v+1)%battleHosts.length)} aria-label="Следующая картина">→</button></div>
      </div>
    </section>
    <section id="music" className="scene music-scene">
      <div className="music-wall"><img className="music-wide-bg" src="/images/music-generations-bg-v1.png" alt="Казачья песня объединяет поколения"/><div className="music-wall-shade"/></div>
      <div className="music-copy label-mission"><p className="chapter">МУЗЫКАЛЬНЫЙ ЛЕЙБЛ «КАЗАКИ ВСЕГО МИРА»</p><h2><span>СОХРАНЯЕМ ТРАДИЦИЮ</span><span><i>СОЗДАЁМ НОВОЕ ЗВУЧАНИЕ</i></span></h2><p className="label-mission-lead"><strong>Мы сохраняем казачью музыкальную традицию и помогаем ей звучать сегодня.</strong></p><div className="label-mission-columns"><article><h3>ТРАДИЦИЯ</h3><p>Поддерживаем артистов, которые исполняют классические казачьи песни, сохраняют народное творчество и передают его новым поколениям.</p></article><article><h3>СОВРЕМЕННАЯ МУЗЫКА</h3><p>Поддерживаем казаков и казачек, которые создают современную музыку в любых стилях: от рока, попа и электроники до хип-хопа, авторской и экспериментальной музыки.</p></article></div><p className="label-mission-principle"><strong>Для нас важен не жанр и не количество прослушиваний.</strong><br/><strong>Важно, чтобы музыка была настоящей и человеку было что сказать.</strong></p><p className="label-mission-outro">Помогаем артистам выпускать музыку, развиваться, находить свою аудиторию и становиться частью большой культурной экосистемы <strong>«Казаки всего мира»</strong>.</p><div className="label-crosslinks"><button type="button" onClick={toggleMusic}>{playing?'ОСТАНОВИТЬ РАДИО':'СЛУШАТЬ РАДИО'}</button><button type="button" onClick={()=>jump('artists')}>СМОТРЕТЬ АРТИСТОВ</button></div><a className="ceremonial-button world-entry-button label-mission-cta" href={contactUrl} target="_blank" rel="noopener noreferrer"><CrossedSabres/><span>СТАТЬ АРТИСТОМ ЛЕЙБЛА</span></a></div>
    </section>
    <section id="today" className="scene today-scene war-memory" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setWarPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setWarPointer({x:0,y:0})}>
      <div className="war-sky" style={{transform:`translate3d(${warPointer.x*-18}px,${warPointer.y*-10}px,0) scale(1.05)`}}/>
      <div className="war-copy history-diaspora-copy"><p className="chapter">ИСПЫТАНИЯ · РАССЕЯНИЕ · ПАМЯТЬ</p><h2><span>НАС РАЗБРОСАЛО</span><span>ПО ВСЕМУ <i>МИРУ</i></span></h2><p>Революции, войны и эмиграция изменили судьбу казачества. Семьи оказались разделены тысячами километров, появились казачьи общины далеко от родной земли. Вместе с людьми по миру разошлись традиции, песни, вера, семейная память и само имя казака.</p><blockquote>Мы оказались в разных странах. Но не перестали быть казаками.</blockquote><p className="history-today-line">Сегодня мы снова соединяем то, что когда-то разделила история.</p><WorldEntryButton label="НАЙТИ СВОИ КОРНИ" onClick={()=>openPage('heritage')}/><p className="history-heritage-note">Проект «Наследие» скоро откроется.</p></div>
      <div className="war-archive">
        <figure className="war-photo w1" style={{transform:`translate3d(${warPointer.x*24}px,${warPointer.y*16}px,0) rotate(-3deg)`}}><img src="/images/archive-curated-v1/new/war-group.jpg" alt="Группа казаков начала XX века"/></figure>
        <figure className="war-photo w2" style={{transform:`translate3d(${warPointer.x*-19}px,${warPointer.y*-12}px,0) rotate(2deg)`}}><img src="/images/archive-curated-v1/new/war-regiment-1892.jpg" alt="Казаки Российской армии, 1892 год"/></figure>
        <figure className="war-photo w3" style={{transform:`translate3d(${warPointer.x*13}px,${warPointer.y*-8}px,0) rotate(-1deg)`}}><img src="/images/archive-curated-v1/new/join-cosaques-1915.jpg" alt="Группа казаков, 1915 год"/></figure>
        <figure className="war-photo w4" style={{transform:`translate3d(${warPointer.x*-11}px,${warPointer.y*9}px,0) rotate(3deg)`}}><img src="/images/archive-wall/archive-05.jpg" alt="Казаки у собора"/></figure>
      </div>
    </section>
    <section id="join" className="scene join-scene" onMouseMove={event=>{const r=event.currentTarget.getBoundingClientRect();setJoinPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setJoinPointer({x:0,y:0})}>
      <img className="join-cosmic-bg" src="/images/join-community-v2.png" alt="Казаки и казачки собираются вместе на донской земле" style={{transform:`translate3d(${joinPointer.x*-18}px,${joinPointer.y*-10}px,0) scale(1.06)`}}/><div className="join-cosmic-shade"/><div className="join-drift"/>
      <div className="join-archive" aria-hidden="true">{joinArchive.map(photo=><figure key={photo.src} className="join-memory" style={{left:`${photo.x}%`,top:`${photo.y}%`,transform:`translate(calc(-50% + ${joinPointer.x*photo.depth*24}px),calc(-50% + ${joinPointer.y*photo.depth*16}px)) rotate(${photo.r}deg)`}}><img src={photo.src} alt=""/><small>{photo.label}</small></figure>)}</div>
      <div className="join-copy"><h2><span>НАС РАЗДЕЛЯЮТ РАССТОЯНИЯ</span><span><i>НО МЫ ОСТАЁМСЯ ВМЕСТЕ</i></span></h2><p>Если вам близки наши ценности, культура и дело, присоединяйтесь к «Казакам всего мира»</p><a className="ceremonial-button world-entry-button join-contact-cta" href="https://t.me/cossacksoftheworldbot" target="_blank" rel="noreferrer"><CrossedSabres/><span>СВЯЗАТЬСЯ С ПРОЕКТОМ</span></a></div>
    </section>
    <footer><p className="footer-rights">© 2026 «Казаки всего мира». Все права защищены. Любое копирование, распространение, переработка и коммерческое использование текстов, фото, видео, музыки и иных материалов допускается только с письменного разрешения правообладателя.</p></footer>
    {selectedAncestor !== null && <div className="photo-lightbox" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedAncestor(null)}}>
      <section className="photo-lightbox-dialog ancestor-lightbox" role="dialog" aria-modal="true" aria-label={`Казачий портрет: ${ancestors[selectedAncestor].label}`}>
        <button className="photo-close" onClick={()=>setSelectedAncestor(null)} aria-label="Закрыть портрет">×</button>
        <div className="photo-viewport"><img src={ancestors[selectedAncestor].src} alt={`${ancestors[selectedAncestor].label}, ${ancestors[selectedAncestor].era}`} style={{transform:`scale(${photoZoom})`}} onClick={()=>setPhotoZoom(photoZoom===1?1.75:1)}/></div>
        <div className="photo-toolbar"><strong>{ancestors[selectedAncestor].label}</strong><span>{ancestors[selectedAncestor].era}</span><button onClick={()=>setPhotoZoom(Math.max(1,photoZoom-.25))}>−</button><b>{Math.round(photoZoom*100)}%</b><button onClick={()=>setPhotoZoom(Math.min(2.5,photoZoom+.25))}>+</button></div>
      </section>
    </div>}
    {selectedPhoto !== null && <div className="photo-lightbox" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedPhoto(null)}}>
      <section className="photo-lightbox-dialog" role="dialog" aria-modal="true" aria-label={`Архивная фотография: ${hostCollage[selectedPhoto].label}`}>
        <button className="photo-close" onClick={()=>setSelectedPhoto(null)} aria-label="Закрыть фотографию">×</button>
        <div className="photo-viewport"><img src={hostCollage[selectedPhoto].src} alt={`${hostCollage[selectedPhoto].label.toLowerCase()} казаки - архивная фотография крупным планом`} style={{transform:`scale(${photoZoom})`}} onClick={()=>setPhotoZoom(photoZoom===1?1.75:1)}/></div>
        <div className="photo-toolbar"><strong>{hostCollage[selectedPhoto].label}</strong><button onClick={()=>setPhotoZoom(Math.max(1,photoZoom-.25))}>−</button><b>{Math.round(photoZoom*100)}%</b><button onClick={()=>setPhotoZoom(Math.min(2.5,photoZoom+.25))}>+</button></div>
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
