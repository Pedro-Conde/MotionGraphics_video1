// ===== Image swap: Hiro ↔ Momoka =====
const swapFigure = document.getElementById('swap-figure');
const img = document.getElementById('swap-image');
const cap = document.getElementById('swap-caption');

let showingMomoka = false;

function doSwap(){
  swapFigure.classList.add('is-swapping');
  setTimeout(() => {
    if (!showingMomoka){
      img.src = 'images/momoka.png';
      img.alt = 'Momoka — the Red Rose';
      cap.textContent = 'Momoka — the Red Rose';
      swapFigure.setAttribute('aria-label', 'Toggle to Hiro');
      swapFigure.setAttribute('aria-pressed', 'true');
    } else {
      img.src = 'images/hiro.png';
      img.alt = 'Hiro — the White Rose';
      cap.textContent = 'Hiro — the White Rose';
      swapFigure.setAttribute('aria-label', 'Toggle to Momoka');
      swapFigure.setAttribute('aria-pressed', 'false');
    }
    showingMomoka = !showingMomoka;
    swapFigure.classList.remove('is-swapping');
  }, 180);
}

if (swapFigure){
  swapFigure.addEventListener('click', doSwap);
  swapFigure.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      doSwap();
    }
  });
}

// ===== Custom Video Player =====
const frame = document.querySelector('.video-frame');
const video = document.getElementById('sv-video');
const playBtn = document.getElementById('sv-play');
const muteBtn = document.getElementById('sv-mute');
const fullBtn = document.getElementById('sv-full');
const seek = document.getElementById('sv-seek');
const vol = document.getElementById('sv-volume');
const cur = document.getElementById('sv-current');
const dur = document.getElementById('sv-duration');

// format time helper
function fmt(t){
  if (!isFinite(t)) return '0:00';
  const m = Math.floor(t/60);
  const s = Math.floor(t%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

if (video){
  // load metadata
  video.addEventListener('loadedmetadata', () => {
    seek.max = video.duration || 0;
    dur.textContent = fmt(video.duration);
  });

  // play/pause
  function togglePlay(){
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
  playBtn?.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay); // click video to play/pause
  video.addEventListener('play', () => {
    playBtn.textContent = '⏸';
    frame?.classList.add('playing');
  });
  video.addEventListener('pause', () => {
    playBtn.textContent = '▶';
    frame?.classList.remove('playing');
  });

  // time + seek
  video.addEventListener('timeupdate', () => {
    seek.value = video.currentTime;
    cur.textContent = fmt(video.currentTime);
  });
  seek.addEventListener('input', () => {
    video.currentTime = Number(seek.value);
  });

  // mute + volume
  muteBtn?.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? '🔇' : '🔊';
  });
  vol?.addEventListener('input', () => {
    video.volume = Number(vol.value);
    if (video.volume === 0) {
      video.muted = true;
      muteBtn.textContent = '🔇';
    } else {
      video.muted = false;
      muteBtn.textContent = '🔊';
    }
  });

  // fullscreen
  fullBtn?.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      frame?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });
}
