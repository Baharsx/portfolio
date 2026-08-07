function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let raf = 0;
  let stars = [];

  const count = () => (window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4 ? 46 : 105);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: count() }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.1 + 0.2,
      a: Math.random() * 0.45 + 0.16,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.0007 + 0.0002
    }));
  }

  function draw(now) {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      const alpha = Math.max(0.05, star.a + Math.sin(now * star.speed + star.phase) * 0.16);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233,238,244,${alpha})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  resize();
  raf = requestAnimationFrame(draw);
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(draw);
  });
}

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;
  const close = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

initStarfield();
initNav();
