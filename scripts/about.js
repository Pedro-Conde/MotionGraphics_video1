// Simple reveal-on-scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('is-visible'));
}

// Lightweight image lightbox for frames
const lb = document.createElement('div');
lb.className = 'lb';
lb.innerHTML = `
  <button class="lb__close" aria-label="Close">Close</button>
  <img class="lb__img" alt="">
`;
document.body.appendChild(lb);

const lbImg = lb.querySelector('.lb__img');
const lbClose = lb.querySelector('.lb__close');

function openLB(src, alt){
  lbImg.src = src;
  lbImg.alt = alt || '';
  lb.classList.add('open');
}
function closeLB(){
  lb.classList.remove('open');
  lbImg.src = '';
}

lbClose.addEventListener('click', closeLB);
lb.addEventListener('click', (e) => {
  if (e.target === lb) closeLB();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lb.classList.contains('open')) closeLB();
});

document.querySelectorAll('.lightbox').forEach(fig => {
  fig.addEventListener('click', () => {
    const src = fig.dataset.src || fig.querySelector('img')?.src;
    const alt = fig.querySelector('img')?.alt || '';
    if (src) openLB(src, alt);
  });
});
