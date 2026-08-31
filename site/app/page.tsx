'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Globe2, Menu, Music2, Volume2 } from 'lucide-react';

const acts = [
  ['01', 'Мы — казаки', 'hero'], ['02', 'Нас разделила история', 'history'],
  ['03', 'Но мы не исчезли', 'people'], ['04', 'Казаки — народ', 'nation'],
  ['05', 'Казачий мир', 'world'], ['06', 'Найди свои корни', 'roots'],
  ['07', 'Наша культура жива', 'culture'], ['08', 'Новая музыка', 'music'],
  ['09', 'Казаки сегодня', 'today'], ['10', 'Присоединиться', 'join'],
];

function CrossedSabres() {
  return <span className="sabres" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M12 10c4 19 15 34 35 44M52 10C48 29 37 44 17 54"/><path d="m8 12 8-4-2 9m42-5-8-4 2 9M42 50l7 7m-27-7-7 7"/></svg></span>;
}

export default function Home() {
  const [scroll, setScroll] = useState(0);
  const [menu, setMenu] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(.45);
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const update = () => setScroll(window.scrollY);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);
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
    <audio ref={audioRef} src="/audio/stal-i-krest.mp3" loop preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} />
    <div className="progress" style={{ transform: `scaleX(${Math.min(1, scroll / 7500)})` }} />
    <header className="topbar">
      <button className="brand" onClick={() => jump('hero')} aria-label="К началу"><span className="brand-mark">К</span><span>КАЗАКИ<br/>ВСЕГО МИРА</span></button>
      <div className="topline" />
      <div className="top-actions"><button>RU <span>/ EN</span></button><div className="audio-control"><button className={`sound ${playing?'is-playing':''}`} onClick={toggleMusic} aria-label={playing?'Выключить музыку':'Включить музыку'}><Volume2 size={16}/><i/></button><div className="volume-pop"><span>{playing?'СТАЛЬ И КРЕСТ':'МУЗЫКА'}</span><input aria-label="Громкость" type="range" min="0" max="1" step="0.01" value={volume} onChange={e=>{const v=Number(e.target.value);setVolume(v);if(audioRef.current)audioRef.current.volume=v;}}/></div></div><button className="menu-button" onClick={() => setMenu(!menu)}><Menu size={18}/> ОГЛАВЛЕНИЕ</button></div>
    </header>
    <aside className={`chapter-menu ${menu ? 'open' : ''}`}>
      <div className="menu-label">ОГЛАВЛЕНИЕ / АКТЫ</div>
      {acts.map(([n, title, id]) => <button key={id} onClick={() => jump(id)}><span>{n}</span>{title}</button>)}
    </aside>

    <section id="hero" className="scene hero">
      <div className="hero-image parallax" style={{ transform: `translate3d(0,${scroll * .18}px,0) scale(${1 + scroll * .00008})` }} />
      <div className="hero-haze" style={{ transform: `translateY(${scroll * .35}px)` }} />
      <div className="hero-rider-track" aria-hidden="true"><img className="hero-rider-object" src="/images/rider-cutout-v2.png" alt="" /></div>
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
      <div className="paper paper-one" style={{ transform:`translate3d(0,${(scroll-1000)*-.035}px,0) rotate(-6deg)` }}>1919<br/><small>Письмо домой</small></div>
      <div className="paper paper-two" style={{ transform:`translate3d(0,${(scroll-1000)*.055}px,0) rotate(4deg)` }}>РОСТОВЪ<br/><small>Архив семьи</small></div>
      <div className="scene-copy left"><p className="chapter">АКТ II / ИСТОРИЯ</p><h2>НАС РАЗДЕЛИЛА<br/><i>ИСТОРИЯ</i></h2><p className="lead">Революции. Войны. Эмиграция.<br/>Поезда уходили, корабли исчезали за горизонтом, матери ждали.</p><blockquote>«История разбросала нас по миру»</blockquote></div>
    </section>
    <section id="people" className="scene people-scene">
      <div className="people-bg" style={{ transform:`scale(${1.04 + Math.max(0,scroll-1900)*.000035}) translateY(${Math.max(0,scroll-1900)*-.025}px)` }}/><div className="people-vignette"/>
      <div className="scene-copy center"><p className="chapter">АКТ III / ЛЮДИ</p><h2>НО МЫ<br/><i>НЕ ИСЧЕЗЛИ</i></h2><div className="memory-lines"><span>Мы сохранили память.</span><span>Мы сохранили песни.</span><span>Мы сохранили имена.</span><strong>Мы сохранили себя.</strong></div></div>
      <div className="counter"><strong>∞</strong><span>ИСТОРИЙ<br/>ОДНОГО НАРОДА</span></div>
    </section>
    <section id="nation" className="scene manifesto">
      <div className="manifesto-grid"/><p className="chapter">АКТ IV / САМОИДЕНТИФИКАЦИЯ</p><div className="giant-word">НАРОД</div>
      <div className="manifesto-copy"><h2>КАЗАКИ —<br/><i>НАРОД</i></h2><p>Наша позиция. Наша историческая память. Предмет серьёзного исторического исследования.</p><button>ИЗУЧИТЬ ДОКУМЕНТЫ <ArrowUpRight size={18}/></button></div>
      <div className="manifesto-index"><span>01 Архивы</span><span>02 Этнография</span><span>03 Карты</span><span>04 Исследования</span></div>
    </section>
    <section id="world" className="scene world-scene">
      <div className="globe"><Globe2/><div className="orbit o1"/><div className="orbit o2"/><i className="dot d1"/><i className="dot d2"/><i className="dot d3"/><i className="dot d4"/></div>
      <div className="scene-copy left"><p className="chapter">АКТ V / КАЗАЧИЙ МИР</p><h2>МЫ ЖИВЁМ<br/><i>ПО ВСЕМУ МИРУ</i></h2><p className="lead">Страна → община → человек → история.<br/>Карта наполняется только подтверждёнными историями.</p><button className="outline">Я КАЗАК. ДОБАВИТЬ СЕБЯ <ArrowUpRight size={18}/></button></div>
      <div className="world-list"><span>РОССИЯ</span><span>СЕРБИЯ</span><span>ФРАНЦИЯ</span><span>КАНАДА</span><span>АРГЕНТИНА</span><span>АВСТРАЛИЯ</span></div>
    </section>
    <section id="roots" className="scene roots-scene"><div className="roots-noise"/><img className="archive-objects" src="/images/archive-objects.png" alt="Архивные письма, карта и семейная фотография"/><div className="roots-copy"><p className="chapter">АКТ VI / РОДОВАЯ ПАМЯТЬ</p><h2>КАЖДАЯ СЕМЬЯ —<br/><i>ЧАСТЬ ОБЩЕЙ ИСТОРИИ</i></h2><div className="search-box">ФАМИЛИЯ / СТАНИЦА / МЕСТО <button>НАЙТИ КОРНИ</button></div></div><div className="archive-card a1">СТАНИЦА<br/><strong>ВЁШЕНСКАЯ</strong></div><div className="archive-card a2">СЕМЕЙНЫЙ<br/><strong>АРХИВ № 018</strong></div></section>
    <section id="culture" className="scene culture-scene"><div className="culture-marquee">КУЛЬТУРА ЖИВА • КУЛЬТУРА ЖИВА •</div><div className="culture-copy"><p className="chapter">АКТ VII / СЕГОДНЯ</p><h2>НЕ МУЗЕЙ.<br/><i>ЖИВАЯ КУЛЬТУРА.</i></h2><p>Песня. Танец. Ремесло. Семья. Праздник. Степь. Будущее.</p></div><div className="culture-tiles"><div>ПЕСНИ<span>01</span></div><div>РЕМЁСЛА<span>02</span></div><div>ТРАДИЦИИ<span>03</span></div></div></section>
    <section className="scene living-culture">
      <div className="living-heading"><p className="chapter">ЛИЦА / ГОЛОСА / ХАРАКТЕР</p><h2>ТЕ, КТО<br/><i>ДЕЛАЕТ СЕЙЧАС</i></h2><p>Новые песни и живые образы казачьего мира.</p></div>
      <div className="artist-stack">
        <article className="artist-card artist-rgd" style={{ transform:`translateY(${Math.max(-70,Math.min(70,(scroll-5450)*-.035))}px)` }}><img src="/images/artist-rgd.png" alt="РГД — современный музыкальный коллектив с Дона"/><div><span>01 / ДОН</span><h3>РГД</h3><p>Ритм земли. Голос поколения.</p></div></article>
        <article className="artist-card artist-beloboka" style={{ transform:`translateY(${Math.max(-55,Math.min(55,(scroll-5650)*.026))}px)` }}><img src="/images/artist-beloboka.png" alt="BELOBOKA — современный электронный фолк-проект"/><div><span>02 / НОВЫЙ ФОЛК</span><h3>BELOBOKA</h3><p>Фольклор, индустриальный звук и новая сцена.</p></div></article>
        <article className="artist-card artist-yazhevika" style={{ transform:`translateY(${Math.max(-75,Math.min(75,(scroll-5850)*-.03))}px)` }}><img src="/images/artist-yazhevika.png" alt="YAZHEVIKA — донская казачка и современная исполнительница"/><div><span>03 / ГОЛОС</span><h3>YAZHEVIKA</h3><p>Сталь, крест и женская сила Дона.</p></div></article>
      </div>
      <div className="papakha-film" style={{ transform:`translateY(${Math.max(-45,Math.min(45,(scroll-6100)*.02))}px)` }}><img src="/images/hero-riders.png" alt="Казаки в донских и терских папахах"/><span>ДОНСКАЯ И ТЕРСКАЯ ЛИНИЯ</span></div>
      <img className="living-rider" src="/images/rider-cutout.png" alt="Терский казак уходит верхом по степи" style={{ transform:`translate3d(${Math.max(-90,Math.min(130,(scroll-6000)*.05))}px,0,0)` }}/>
    </section>
    <section id="music" className="scene music-scene"><div className="vinyl"><Music2/><span>COTW<br/>LABEL</span></div><div className="wave">{Array.from({length:52}).map((_,i)=><i key={i} style={{height:`${18+(i*23)%78}%`}}/>)}</div><div className="music-copy"><p className="chapter">АКТ VIII / НОВАЯ МУЗЫКА</p><h2>МЫ НЕ ТОЛЬКО<br/>ХРАНИМ ПЕСНИ.<br/><i>МЫ СОЗДАЁМ НОВЫЕ.</i></h2><button>СЛУШАТЬ <ArrowUpRight size={18}/></button></div></section>
    <section id="today" className="scene today-scene"><p className="chapter">АКТ IX / МЕДИА</p><h2>КАЗАКИ<br/><i>СЕГОДНЯ</i></h2><div className="news-grid"><article><span>WORLD / ИСТОРИИ</span><h3>История одной семьи соединяет три страны</h3><p>Редакционная история — только после проверки источников.</p></article><article><span>MUSIC / РЕЛИЗЫ</span><h3>Новая музыка казачьего мира</h3></article><article><span>ARCHIVE / ПАМЯТЬ</span><h3>Документы возвращают забытые имена</h3></article></div></section>
    <section id="join" className="scene join-scene"><div className="join-bg"/><div className="join-copy"><p className="chapter">ФИНАЛ / МЫ НАХОДИМ ДРУГ ДРУГА</p><h2>НАС РАЗБРОСАЛА ИСТОРИЯ.<br/><i>ТЕПЕРЬ МЫ ВМЕСТЕ.</i></h2><button>ПРИСОЕДИНИТЬСЯ <ArrowUpRight size={20}/></button><div className="join-options"><span>Я казак</span><span>Я потомок</span><span>Я исследователь</span><span>Я музыкант</span><span>Я представляю общину</span></div></div></section>
    <footer><div className="brand-mark">К</div><p>КАЗАКИ ВСЕГО МИРА<br/><small>COSSACKS OF THE WORLD</small></p><span>© 2026 / ЦИФРОВОЙ МИРОВОЙ ЦЕНТР КАЗАЧЕСТВА</span></footer>
  </main>;
}
