(() => {
  const header = document.getElementById('header');
  const drawer = document.getElementById('drawer');
  const burger = document.getElementById('burger');

  // sticky header border
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // mobile menu
  const setMenu = open => {
    drawer.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.addEventListener('click', () => setMenu(!drawer.classList.contains('open')));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // FAQ: animasi buka/tutup, satu terbuka dalam satu waktu, item pertama terbuka otomatis saat terlihat
  const acc = document.getElementById('acc');
  const rows = [...acc.querySelectorAll('.acc__item')];
  const setItem = (row, open) => {
    row.classList.toggle('is-open', open);
    row.querySelector('.acc__btn').setAttribute('aria-expanded', open);
  };
  rows.forEach(row => row.querySelector('.acc__btn').addEventListener('click', () => {
    const willOpen = !row.classList.contains('is-open');
    rows.forEach(r => setItem(r, r === row && willOpen));
  }));
  let auto = false;
  const openFirst = () => { if (!auto) { auto = true; setTimeout(() => setItem(rows[0], true), 350); } };
  if ('IntersectionObserver' in window) {
    const fo = new IntersectionObserver(es => { if (es[0].isIntersecting) { openFirst(); fo.disconnect(); } }, { threshold: 0.35 });
    fo.observe(acc);
  } else { openFirst(); }

  // scroll animation: elemen membuka saat masuk layar & menutup saat keluar (berulang)
  const setup = (sel, cls) => document.querySelectorAll(sel).forEach(el => {
    el.classList.add(cls);
    if (el.parentElement) {
      const sib = [...el.parentElement.children].filter(n => n.matches(sel));
      el.style.setProperty('--i', Math.min(sib.indexOf(el), 5));
    }
  });
  setup('.hero__title', 'rv-title');
  setup('.hero__img', 'rv-pop');
  setup('.hero__row, .partners__in, .center-head, .split, .solutions, .sol, .acc__item, .contact, .footer__in > div, .footer__bar, .credit', 'rv');
  setup('.pc, .feat, .cta', 'rv');
  document.querySelectorAll('.pc, .feat, .cta').forEach(el => el.classList.add('wipe'));
  // jadwal masuk hero saat halaman pertama dibuka / di-refresh
  const heroDelay = { '.hero__title': 3, '.hero__img': 7, '.hero__row': 12 };
  Object.entries(heroDelay).forEach(([s, d]) => { const el = document.querySelector(s); if (el) el.style.setProperty('--i', d); });

  const items = document.querySelectorAll('.rv, .rv-title, .rv-pop');
  const start = () => {
    void document.body.offsetHeight; // paksa browser menggambar kondisi awal (tersembunyi) dulu
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting));
      }, { threshold: 0.08, rootMargin: '-6% 0px -6% 0px' });
      items.forEach(el => io.observe(el));
    } else {
      items.forEach(el => el.classList.add('in'));
    }
  };
  const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(start, 120)));
  const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise(r => window.addEventListener('load', r, { once: true }));
  Promise.all([fontsReady, loaded]).then(ready);
  setTimeout(() => { if (!document.querySelector('.in')) start(); }, 2500); // jaring pengaman

  // quote form -> WhatsApp
  const form = document.getElementById('form');
  const note = document.getElementById('note');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const nama = (d.get('nama') || '').trim();
    if (!nama) { note.textContent = 'Mohon isi nama Anda.'; form.nama.focus(); return; }
    const text = `Halo INVILON, saya ${nama}.\nProduk: ${d.get('produk')}\nKebutuhan: ${(d.get('pesan') || '-').trim()}`;
    window.open(`https://api.whatsapp.com/send/?phone=6282164584922&text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    note.textContent = 'Membuka WhatsApp...';
  });
})();
