// NAV SCROLL
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  });

  // MOBILE MENU
  function openMenu() { document.getElementById('mobileMenu').classList.add('open'); }
  function closeMenu() { document.getElementById('mobileMenu').classList.remove('open'); }

  // SCROLL REVEAL
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // DATE DEFAULTS
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
  const dayAfter = new Date(today); dayAfter.setDate(today.getDate()+3);
  const fmt = d => d.toISOString().split('T')[0];
  document.getElementById('checkin').min = fmt(today);
  document.getElementById('checkin').value = fmt(tomorrow);
  document.getElementById('checkout').min = fmt(dayAfter);
  document.getElementById('checkout').value = fmt(dayAfter);

  // PRICE PREVIEW
  const prices = { 'sea-view': 65, 'garden': 45, 'family': 85 };
  function updatePrice() {
    const ci = new Date(document.getElementById('checkin').value);
    const co = new Date(document.getElementById('checkout').value);
    const room = document.getElementById('roomType').value;
    const preview = document.getElementById('pricePreview');
    if (room && ci && co && co > ci) {
      const nights = Math.round((co - ci) / 86400000);
      const total = nights * prices[room];
      preview.style.display = 'block';
      preview.textContent = `${nights} night${nights>1?'s':''} × $${prices[room]}/night = Estimated Total: $${total} USD`;
    } else { preview.style.display = 'none'; }
  }
  ['checkin','checkout','roomType'].forEach(id => document.getElementById(id).addEventListener('change', updatePrice));

  // BOOKING SUBMIT
  function submitBooking() {
    const name = document.getElementById('guestName').value.trim();
    const email = document.getElementById('guestEmail').value.trim();
    const room = document.getElementById('roomType').value;
    const ci = document.getElementById('checkin').value;
    const co = document.getElementById('checkout').value;
    if (!name || !email || !room || !ci || !co) {
      alert('Please fill in all required fields.');
      return;
    }
    if (new Date(co) <= new Date(ci)) {
      alert('Check-out date must be after check-in date.');
      return;
    }
    document.getElementById('successMsg').style.display = 'block';
    document.getElementById('successMsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // LIGHTBOX
  const galleryImgs = [
    'images/gallery_1_1780752892800.png',
    'images/gallery_2_1780752910536.png',
    'images/gallery_3_1780752921994.png',
    'images/gallery_4_1780752934681.png',
    'images/about_hotel_1780752835645.png',
  ];
  let currentImg = 0;
  function openLightbox(i) {
    currentImg = i;
    document.getElementById('lb-img').src = galleryImgs[i];
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
  function lbNav(dir) {
    currentImg = (currentImg + dir + galleryImgs.length) % galleryImgs.length;
    document.getElementById('lb-img').src = galleryImgs[currentImg];
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
  });