/* ═══════════════════════════════════════════════════════════════
   Página de Cumpleaños · app.js
   ✏️ CONFIGURA TODO EN LA SECCIÓN "CONFIGURACIÓN PERSONAL"
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════════════════════
   ✏️ ══ CONFIGURACIÓN PERSONAL — CAMBIA SOLO AQUÍ ══ ✏️
   ════════════════════════════════════════════════════════════ */

const CONFIG = {

  // Nombre de tu novia (aparece en el reproductor y lugares JS)
  nombre: "GISELA",

  // Fecha de cumpleaños — formato: "Month Day Year"
  // Ejemplos: "January 15 2026"  |  "March 8 2026"  |  "December 3 2025"
  fechaCumple: "May 03 2026",

  // Tu nombre para la firma
  tuNombre: "ABRAHAM",
  // MUSICA DE FONDO
  musicaFondo: "fondo.mp3",

  // ── CANCIONES ──────────────────────────────────────────────
  // ✏️ Agrega hasta las que quieras.
  // "link" puede ser un URL de YouTube/Spotify, o déjalo "" si no tienes.
  canciones: [
    {
      titulo:  "POR TI ESO Y MAS HARE MI PRINCESA HERMOSA",
      artista: "ALEJANDRO FERNANCEZ",
      link:    "ESO Y MAS.mp3"   // ✏️ cambia esto
    },
    {
      titulo:  "SOLO QUIERO CAMINAR DE TU MANO LO QUE ME RESTA DEL CAMINO",
      artista: "RIO ROMA",
      link:    "QUIERO CAMINAR DE TU MANO.mp3"   // ✏️ cambia esto
    },
    {
      titulo:  "QUIERO VIVIR LA VIDA ENTERA JUNTO A TI",
      artista: "Axel",
      link:    "Te Voy a Amar.mp3"   // ✏️ cambia esto
    }
  ],

  // ── FOTOS ───────────────────────────────────────────────────
  // ✏️ Reemplaza los src con tus URLs o nombres de archivo (ej: "foto1.jpg")
  // Pon los archivos de imagen en la misma carpeta que index.html
  fotos: [
    { src: "FOTO 1.jpeg",  caption: "Nuestro primer momento juntos 💫" },
    { src: "FOTO 21.jpeg",  caption: "El día que todo cambió ✨",        destacada: true },
    { src: "FOTO 22.jpeg",  caption: "Tu sonrisa, mi universo 🌙" },
    { src: "FOTO 4.jpeg",  caption: "Juntos siempre 🌟" },
    { src: "FOTO 11.jpeg",  caption: "Mi favorita de todas ❤️",          destacada: true },
    { src: "FOTO 13.jpeg",  caption: "Recuerdos eternos 💎" }
  ]
};

/* ════════════════════════════════════════════════════════════
   FIN CONFIGURACIÓN — no es necesario tocar lo de abajo
   ════════════════════════════════════════════════════════════ */

// ── Estado ──────────────────────────────────────────────────
let cancionActual  = 0;
let reproductorOn  = false;
let lightboxActual = 0;
let fotosAbiertas  = [];

// ── Init ────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  initEstrellas();
  initParticulas();
  initCountdown();
  initGaleria();
  initReproductor();
  iniciarScrollReveal();
  initMusicaFondo();
});

/* ════════════════════════════════════════════════════════════
   CANVAS DE ESTRELLAS
   ════════════════════════════════════════════════════════════ */
function initEstrellas() {
  const canvas = document.getElementById('stars');
  const ctx    = canvas.getContext('2d');
  let stars    = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    crearEstrellas();
  }

  function crearEstrellas() {
    stars = [];
    const n = Math.floor((canvas.width * canvas.height) / 4000);
    for (let i = 0; i < n; i++) {
      stars.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        r:       Math.random() * 1.4 + 0.2,
        alpha:   Math.random(),
        speed:   Math.random() * 0.008 + 0.002,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.twinkle += s.speed;
      const a = 0.3 + 0.7 * Math.abs(Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 223, 192, ${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ════════════════════════════════════════════════════════════
   PARTÍCULAS FLOTANTES
   ════════════════════════════════════════════════════════════ */
function initParticulas() {
  const container = document.getElementById('particles');
  const colores   = ['#c9a84c', '#d4608a', '#7b5ea7', '#b39ddb', '#f0d080'];

  function crearParticula() {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const dur  = Math.random() * 15 + 10;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colores[Math.floor(Math.random() * colores.length)]};
      animation-duration: ${dur}s;
      animation-delay: ${Math.random() * dur}s;
      opacity: 0;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), (dur + 5) * 1000);
  }

  // Crear partículas periódicamente
  for (let i = 0; i < 20; i++) crearParticula();
  setInterval(crearParticula, 1500);
}

/* ════════════════════════════════════════════════════════════
   CUENTA REGRESIVA
   ════════════════════════════════════════════════════════════ */
function initCountdown() {
  const display = document.getElementById('countdown-display');
  const msg     = document.getElementById('countdown-msg');

  function actualizar() {
    const ahora    = new Date();
    const cumple   = new Date(CONFIG.fechaCumple);
    // Ajustar al año actual o siguiente
    cumple.setFullYear(ahora.getFullYear());
    if (cumple < ahora) cumple.setFullYear(ahora.getFullYear() + 1);

    const diff = cumple - ahora;

    // ¿Ya es su cumpleaños hoy?
    const hoyEsCumple =
      ahora.getMonth()   === cumple.getMonth() &&
      ahora.getDate()    === cumple.getDate()  &&
      cumple.getFullYear() === ahora.getFullYear() + (diff > 0 ? 1 : 0);

    // Verificar si HOY es el día
    const cumpleHoy = new Date(CONFIG.fechaCumple);
    cumpleHoy.setFullYear(ahora.getFullYear());
    const esHoy = ahora.toDateString() === cumpleHoy.toDateString();

    if (esHoy) {
      display.innerHTML = `<div class="birthday-msg">🎉 ¡Feliz Cumpleaños ${CONFIG.nombre}! 🎉</div>`;
      msg.textContent = '¡Hoy es tu día más especial! ✨';
      return;
    }

    const dias  = Math.floor(diff / (1000*60*60*24));
    const horas = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const mins  = Math.floor((diff % (1000*60*60)) / (1000*60));
    const segs  = Math.floor((diff % (1000*60)) / 1000);

    display.innerHTML = `
      <div class="cd-block"><span class="cd-num">${String(dias).padStart(2,'0')}</span><span class="cd-label">días</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-block"><span class="cd-num">${String(horas).padStart(2,'0')}</span><span class="cd-label">horas</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-block"><span class="cd-num">${String(mins).padStart(2,'0')}</span><span class="cd-label">minutos</span></div>
      <div class="cd-sep">:</div>
      <div class="cd-block"><span class="cd-num">${String(segs).padStart(2,'0')}</span><span class="cd-label">segundos</span></div>
    `;
  }

  actualizar();
  setInterval(actualizar, 1000);
}

/* ════════════════════════════════════════════════════════════
   GALERÍA DE FOTOS
   ════════════════════════════════════════════════════════════ */
function initGaleria() {
  const gallery = document.getElementById('gallery');

  // Si se configuraron fotos reales en CONFIG.fotos, reemplaza los placeholders
  const conFotos = CONFIG.fotos.filter(f => f.src && f.src.trim() !== '');
  if (conFotos.length === 0) return; // Usar los placeholders del HTML

  // Construir galería con fotos reales
  gallery.innerHTML = '';
  CONFIG.fotos.forEach((foto, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card' + (foto.destacada ? ' featured' : '');
    card.setAttribute('data-caption', foto.caption);
    card.setAttribute('data-index', i);

    if (foto.src && foto.src.trim() !== '') {
      card.innerHTML = `
        <img src="${foto.src}" alt="${foto.caption}" loading="lazy" />
        <div class="photo-overlay"><p>${foto.caption}</p></div>
      `;
    } else {
      card.innerHTML = `
        <div class="photo-placeholder">
          <span>📷</span>
          <small>foto${i+1}.jpg</small>
        </div>
        <div class="photo-overlay"><p>${foto.caption}</p></div>
      `;
    }

    card.addEventListener('click', () => abrirLightbox(i));
    gallery.appendChild(card);
  });

  fotosAbiertas = CONFIG.fotos;
}

// ── Lightbox ─────────────────────────────────────────────────
function abrirLightbox(index) {
  const fotos = CONFIG.fotos.filter(f => f.src && f.src.trim() !== '');
  if (fotos.length === 0) return;
  lightboxActual = index;
  mostrarFotoLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function mostrarFotoLightbox() {
  const fotos = CONFIG.fotos.filter(f => f.src && f.src.trim() !== '');
  if (fotos.length === 0) return;
  const idx = lightboxActual % fotos.length;
  document.getElementById('lb-img').src         = fotos[idx].src;
  document.getElementById('lb-img').alt         = fotos[idx].caption;
  document.getElementById('lb-caption').textContent = fotos[idx].caption;
}

function fotoAnterior() {
  const fotos = CONFIG.fotos.filter(f => f.src && f.src.trim() !== '');
  lightboxActual = (lightboxActual - 1 + fotos.length) % fotos.length;
  mostrarFotoLightbox();
}

function fotoSiguiente() {
  const fotos = CONFIG.fotos.filter(f => f.src && f.src.trim() !== '');
  lightboxActual = (lightboxActual + 1) % fotos.length;
  mostrarFotoLightbox();
}

// Cerrar con Escape o clic fuera
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { cerrarLightbox(); cerrarModal(); cerrarDeseo(); }
  if (e.key === 'ArrowLeft')  fotoAnterior();
  if (e.key === 'ArrowRight') fotoSiguiente();
});

/* ════════════════════════════════════════════════════════════
   REPRODUCTOR DE MÚSICA
   ════════════════════════════════════════════════════════════ */
   let audio = null;
   function initReproductor() {
  const playlist  = document.getElementById('playlist');
  const dots      = document.getElementById('song-dots');
  const canciones = CONFIG.canciones;
  audio = new Audio();
  audio.preload = "auto";

  // Construir playlist
  canciones.forEach((c, i) => {
    const item = document.createElement('button');
    item.className = 'playlist-item' + (i === 0 ? ' active' : '');
    item.innerHTML = `
      <span class="pl-num">${String(i+1).padStart(2,'0')}</span>
      <div class="pl-info">
        <div class="pl-title">${c.titulo}</div>
        <div class="pl-artist">${c.artista}</div>
      </div>
      ${c.link ? `<a href="${c.link}" target="_blank" class="pl-link" onclick="event.stopPropagation()">▶ Abrir</a>` : ''}
    `;
    item.addEventListener('click', () => seleccionarCancion(i));
    playlist.appendChild(item);
  });

  // Construir dots
  canciones.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'song-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => seleccionarCancion(i));
    dots.appendChild(dot);
  });
// Evento cuando termina la canción
audio.addEventListener('ended', () => {
  reproductorOn = false;
  document.getElementById('play-btn').textContent = '▶';
  document.getElementById('vinyl').classList.remove('playing');
});
  // Mostrar primera canción
  mostrarCancion(0);
}

function mostrarCancion(index) {
  const c = CONFIG.canciones[index];
  audio.src = c.link;
  document.getElementById('song-title').textContent  = c.titulo;
  document.getElementById('song-artist').textContent = c.artista;

  // Actualizar playlist activa
  document.querySelectorAll('.playlist-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });

  // Actualizar dots
  document.querySelectorAll('.song-dot').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
}

function seleccionarCancion(index) {
  cancionActual = index;
  mostrarCancion(index);
  if (reproductorOn) {
    document.getElementById('vinyl').classList.add('playing');
  }
}

function togglePlay() {
  const btn = document.getElementById('play-btn');
  const vinyl = document.getElementById('vinyl');

  if (audio.paused) {
    audio.play()
     .then(() => {
        reproductorOn = true;
        btn.textContent = '⏸';
        vinyl.classList.add('playing');
      })
     .catch(error => {
        console.error('Error al reproducir:', error);
        alert('Dale click para activar el sonido ❤️');
      });
  } else {
    audio.pause();
    reproductorOn = false;
    btn.textContent = '▶';
    vinyl.classList.remove('playing');
  }
}

function cancionAnterior() {
  cancionActual = (cancionActual - 1 + CONFIG.canciones.length) % CONFIG.canciones.length;
  mostrarCancion(cancionActual);
}

function cancionSiguiente() {
  cancionActual = (cancionActual + 1) % CONFIG.canciones.length;
  mostrarCancion(cancionActual);
}

/* ════════════════════════════════════════════════════════════
   MODAL SORPRESA
   ════════════════════════════════════════════════════════════ */
function abrirSorpresa() {
  document.getElementById('modal-sorpresa').classList.add('open');
  document.body.style.overflow = 'hidden';
  lanzarConfetti();
}

function cerrarModal() {
  document.getElementById('modal-sorpresa').classList.remove('open');
  document.body.style.overflow = '';
}

/* ════════════════════════════════════════════════════════════
   MODAL DESEO
   ════════════════════════════════════════════════════════════ */
function pedirDeseo() {
  document.getElementById('modal-deseo').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarDeseo() {
  document.getElementById('modal-deseo').classList.remove('open');
  document.body.style.overflow = '';
}

function soplarVela() {
  cerrarDeseo();
  // Lluvia de estrellas como celebración del deseo
  setTimeout(lloverEstrellas, 200);
  setTimeout(() => {
    const box = document.getElementById('fx-container');
    const msg = document.createElement('div');
    msg.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%);
      font-family: 'Cinzel', serif; font-size: clamp(20px,4vw,36px);
      color: #f0d080; text-align: center; z-index: 450;
      text-shadow: 0 0 30px rgba(201,168,76,.8);
      animation: fadeUp .5s ease forwards;
      pointer-events: none;
    `;
    msg.textContent = '✨ ¡Que se cumpla! ✨';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }, 800);
}

/* ════════════════════════════════════════════════════════════
   EFECTOS ESPECIALES
   ════════════════════════════════════════════════════════════ */
function crearItem(emoji, cantidad, duracion) {
  const container = document.getElementById('fx-container');
  for (let i = 0; i < cantidad; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className   = 'fx-item';
      el.textContent = emoji;
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        font-size: ${Math.random() * 20 + 16}px;
        animation-duration: ${Math.random() * 2 + duracion}s;
        animation-delay: 0s;
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), (duracion + 3) * 1000);
    }, i * 60);
  }
}

function lloverEstrellas() {
  const estrellas = ['⭐','✨','🌟','💫','⚡'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      crearItem(estrellas[Math.floor(Math.random() * estrellas.length)], 1, 2.5);
    }, i * 80);
  }
}

function lloverCorazones() {
  const corazones = ['❤️','💕','💖','💗','💝','💞'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      crearItem(corazones[Math.floor(Math.random() * corazones.length)], 1, 3);
    }, i * 80);
  }
}

function lanzarConfetti() {
  const items = ['🎉','🎊','🎈','🥳','🌸','✨','💎','🌟','🦋','🎀'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      crearItem(items[Math.floor(Math.random() * items.length)], 1, 2.5);
    }, i * 50);
  }
}

/* ════════════════════════════════════════════════════════════
   SCROLL REVEAL
   ════════════════════════════════════════════════════════════ */
function iniciarScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.section').forEach(s => {
    s.style.opacity    = '0';
    s.style.transform  = 'translateY(30px)';
    s.style.transition = 'opacity .7s ease, transform .7s ease';
    observer.observe(s);
  });
}
function initMusicaFondo() {
  const audioFondo = document.getElementById('audioFondo');
  audioFondo.volume = 0.15; // Bajito, 15% para no tapar las canciones

  // Cuando haga click en CUALQUIER parte de la página, suena
  document.body.addEventListener('click', function iniciarFondo() {
    audioFondo.play().catch(e => console.log('Fondo:', e));
    document.body.removeEventListener('click', iniciarFondo);
    document.getElementById("srcfondo").src = CONFIG.musicafondo; // Solo 1 vez
  }, { once: true });
}