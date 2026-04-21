// ── CURSOR ──
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animCursor() {
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();

    // ── STARS CANVAS ──
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    let stars = [];
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.3 + 0.05,
        drift: (Math.random() - 0.5) * 0.1
      });
    }
    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a += s.speed * 0.01;
        if (s.a > 1) s.a = 0;
        s.x += s.drift;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a * 0.8})`;
        ctx.fill();
      });
      requestAnimationFrame(drawStars);
    }
    drawStars();

    // ── TYPEWRITER ──
    const words = ['Full Stack', 'Front-End', 'Back-End', 'JavaScript'];
    let wi = 0, ci = 0, del = false;
    const twEl = document.getElementById('typewriter');
    function typeNext() {
      const word = words[wi];
      if (!del) {
        twEl.textContent = word.slice(0, ++ci);
        if (ci === word.length) { del = true; setTimeout(typeNext, 1800); return; }
        setTimeout(typeNext, 80);
      } else {
        twEl.textContent = word.slice(0, --ci);
        if (ci === 0) { del = false; wi = (wi + 1) % words.length; setTimeout(typeNext, 300); return; }
        setTimeout(typeNext, 40);
      }
    }
    typeNext();

    // ── SCROLL ANIMATIONS ──
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // animate skill bars
          e.target.querySelectorAll('.skill-bar').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // ── NAV SCROLL EFFECT ──
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 50 ? 'rgba(5,8,16,0.95)' : 'rgba(5,8,16,0.7)';
    });

    // ── PARTICLE MOUSE TRAIL ──
    const particles = [];
    document.addEventListener('mousemove', e => {
      if (Math.random() > 0.6) return;
      const p = document.createElement('div');
      p.style.cssText = `
        position:fixed; pointer-events:none; z-index:9997;
        width:4px; height:4px; border-radius:50%;
        background: rgba(0,245,212,0.6);
        left:${e.clientX}px; top:${e.clientY}px;
        transform:translate(-50%,-50%);
        transition: all 0.8s ease;
      `;
      document.body.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(-50%,-50%) scale(0)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 800);
    });