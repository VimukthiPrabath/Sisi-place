// NAV SCROLL
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  });

  // MOBILE MENU
  function openMenu() { document.getElementById('mobileMenu').classList.add('open'); }
  function closeMenu() { document.getElementById('mobileMenu').classList.remove('open'); }

  // SCROLL REVEAL
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { 
      if (e.isIntersecting) { 
        e.target.classList.add('visible'); 
      } else {
        e.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

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

  // CUSTOM CURSOR
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }, {passive: true});

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }, {passive: true});

  function animateCursor() {
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;
    outlineX += distX * 0.15;
    outlineY += distY * 0.15;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects for cursor
  document.querySelectorAll('a, button, select, input, .gallery-item, .map-placeholder').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.width = '50px';
      cursorOutline.style.height = '50px';
      cursorOutline.style.backgroundColor = 'rgba(201,168,76,0.1)';
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.width = '36px';
      cursorOutline.style.height = '36px';
      cursorOutline.style.backgroundColor = 'transparent';
    });
  });

  // CANVAS PARTICLES WITH MOUSE ATTRACTION
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particlesArray = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = document.getElementById('hero').offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * -1 - 0.5; 
        this.baseX = this.speedX;
        this.baseY = this.speedY;
      }
      update() {
        // Hero is at top, so clientY roughly matches canvas Y for hero section.
        let dx = mouseX - this.x;
        // Adjust for scroll if necessary, but hero is 100vh and particles are inside it.
        // Assuming particles canvas is pinned to top of hero
        let heroRect = document.getElementById('hero').getBoundingClientRect();
        let relativeMouseY = mouseY - heroRect.top;
        let dy = relativeMouseY - this.y;
        
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDistance = 250;
        let force = (maxDistance - distance) / maxDistance;

        if (distance < maxDistance) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          this.speedX += forceDirectionX * force * 0.08;
          this.speedY += forceDirectionY * force * 0.08;
        } else {
          // Slowly return to base speed
          this.speedX += (this.baseX - this.speedX) * 0.02;
          this.speedY += (this.baseY - this.speedY) * 0.02;
        }

        // Friction to prevent infinite acceleration
        this.speedX *= 0.96;
        this.speedY *= 0.96;

        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw() {
        ctx.fillStyle = 'rgba(201, 168, 76, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#c9a84c';
      }
    }

    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < 70; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }