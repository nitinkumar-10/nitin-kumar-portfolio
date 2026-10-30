(() => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const header = $('#header');
  const progress = $('#progress-bar');
  const menuBtn = $('#menu-btn');
  const nav = $('#nav');
  const rail = $('#project-rail');
  const prev = $('#rail-prev');
  const next = $('#rail-next');
  const heroVisual = $('#hero-visual');
  const cursor = $('#cursor-glow');
  const preloader = $('#preloader');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const config = window.PORTFOLIO_CONFIG || {};
  const setText = (id, value) => { const el = $(id); if (el && value) el.textContent = value; };
  setText('#about-name', config.name);
  setText('#education', config.education);
  setText('#education-detail', config.educationDetail);
  setText('#hero-summary', config.summary);
  document.title = `${config.name || 'Nitin Kumar'} | Data Science • AI • ML`;
  $$('[data-github]').forEach(a => config.github && (a.href = config.github));
  $$('[data-repository]').forEach(a => config.repository && (a.href = config.repository));

  window.addEventListener('load', () => setTimeout(() => preloader?.classList.add('hide'), 450));

  menuBtn?.addEventListener('click', () => nav.classList.toggle('open'));
  $$('#nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

  const sections = $$('main section[id]');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, y / total))})`;
    let activeId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const bottom = top + sec.offsetHeight;
      if (y >= top && y < bottom) activeId = sec.id;
    });
    $$('#nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${activeId}`));
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.16 });
  $$('.reveal').forEach(el => observer.observe(el));

  if (!reduce && cursor) {
    window.addEventListener('pointermove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      if (!heroVisual) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      heroVisual.style.transform = `translate3d(${x * 0.35}px, ${y * 0.25}px, 0)`;
      $$('.parallax-card').forEach((card, i) => {
        card.style.transform = `perspective(1200px) rotateX(${(-y * 0.24).toFixed(2)}deg) rotateY(${(x * 0.24).toFixed(2)}deg) translateY(${Math.sin(Date.now() / 900 + i) * 2}px)`;
      });
      $$('.tilt-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const cx = e.clientX - (rect.left + rect.width / 2);
        const cy = e.clientY - (rect.top + rect.height / 2);
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          card.style.transform = `perspective(1000px) rotateX(${(-cy / rect.height * 6).toFixed(2)}deg) rotateY(${(cx / rect.width * 6).toFixed(2)}deg) translateY(-2px)`;
        }
      });
    }, { passive: true });

    $$('.tilt-card').forEach(card => card.addEventListener('pointerleave', () => card.style.transform = ''));
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${mx * 0.08}px, ${my * 0.08}px)`;
      });
      btn.addEventListener('pointerleave', () => btn.style.transform = '');
    });
  }

  const slideBy = () => Math.min(rail.clientWidth * 0.86, 380);
  prev?.addEventListener('click', () => rail.scrollBy({ left: -slideBy(), behavior: 'smooth' }));
  next?.addEventListener('click', () => rail.scrollBy({ left: slideBy(), behavior: 'smooth' }));
  let autoRail;
  const startRail = () => {
    if (reduce || !rail) return;
    clearInterval(autoRail);
    autoRail = setInterval(() => {
      const nearEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 10;
      rail.scrollTo({ left: nearEnd ? 0 : rail.scrollLeft + slideBy(), behavior: 'smooth' });
    }, 3600);
  };
  if (rail) {
    ['mouseenter', 'touchstart', 'focusin'].forEach(evt => rail.addEventListener(evt, () => clearInterval(autoRail), { passive: true }));
    ['mouseleave', 'focusout'].forEach(evt => rail.addEventListener(evt, startRail, { passive: true }));
    startRail();
  }

  const canvas = $('#bg-particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  function resize() {
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(120, Math.max(45, Math.floor(innerWidth / 16)));
    particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.5 + 0.12,
      hue: [185, 220, 280, 350][i % 4]
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy + window.scrollY * 0.00008;
      if (p.x < -10) p.x = innerWidth + 10;
      if (p.x > innerWidth + 10) p.x = -10;
      if (p.y < -10) p.y = innerHeight + 10;
      if (p.y > innerHeight + 10) p.y = -10;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < i + 4 && j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.strokeStyle = `rgba(110, 190, 255, ${0.08 * (1 - d / 110)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  resize();
  if (!reduce) draw();
  window.addEventListener('resize', resize, { passive: true });
})();
