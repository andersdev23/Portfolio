(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  const closeMenu = (restoreFocus = false) => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    navigation.classList.remove('is-open');
    if (restoreFocus) menuButton.focus();
  };
  menuButton?.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
    navigation?.classList.toggle('is-open', willOpen);
  });
  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-shell')) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  const header = document.querySelector('.site-header');
  let scrollScheduled = false;
  const updateHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
    scrollScheduled = false;
  };
  updateHeader();
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateHeader); }
  }, { passive: true });
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!reducedMotion.matches) entry.target.classList.add('revealed');
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal], .fade-up').forEach(element => revealObserver.observe(element));
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const link = navigation?.querySelector(`a[href="#${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navigation.querySelectorAll('[aria-current]').forEach(item => item.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'location');
        } else { link.removeAttribute('aria-current'); }
      });
    }, { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  }
  // Two perspectives of the same person, with a native, keyboard-operable button.
  const viewToggle = document.querySelector('.view-toggle');
  const portraitPanel = document.getElementById('portrait-panel');
  const codePanel = document.getElementById('code-panel');
  viewToggle?.addEventListener('click', () => {
    const showCode = viewToggle.getAttribute('aria-pressed') !== 'true';
    viewToggle.setAttribute('aria-pressed', String(showCode));
    viewToggle.querySelector('span').textContent = showCode ? 'Ver retrato' : 'Ver em código';
    if (portraitPanel) portraitPanel.hidden = showCode;
    if (codePanel) codePanel.hidden = !showCode;
  });
  const profileStage = document.getElementById('profile-stage');
  if (profileStage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let tiltFrame;
    profileStage.addEventListener('pointermove', event => {
      if (reducedMotion.matches) return;
      cancelAnimationFrame(tiltFrame);
      tiltFrame = requestAnimationFrame(() => {
        const rect = profileStage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        profileStage.style.setProperty('--tilt-x', `${-y * 5}deg`);
        profileStage.style.setProperty('--tilt-y', `${x * 5}deg`);
      });
    });
    const resetTilt = () => {
      cancelAnimationFrame(tiltFrame);
      profileStage.style.setProperty('--tilt-x', '0deg');
      profileStage.style.setProperty('--tilt-y', '0deg');
    };
    profileStage.addEventListener('pointerleave', resetTilt);
    reducedMotion.addEventListener('change', resetTilt);
  }
  const toast = document.querySelector('.toast');
  let toastTimer;
  const notify = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4200);
  };
  const copyEmail = document.querySelector('.copy-email');
  copyEmail?.addEventListener('click', async () => {
    const email = 'andersonalves.codes@gmail.com';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const input = document.createElement('textarea');
        input.value = email;
        input.setAttribute('aria-label', 'Endereço de e-mail');
        input.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        copyEmail.focus({ preventScroll: true });
        if (!copied) throw new Error('Clipboard unavailable');
      }
      notify('E-mail copiado. Vamos conversar!');
    } catch { notify('Não foi possível copiar. Use o link de e-mail ao lado.'); }
  });
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = String(new Date().getFullYear()); });
})();
