/* main.js — Menu scroll, Carrousel, Validation contact, Modal CTA */

// 1. MENU SCROLL — cache au descente, réapparaît à la remontée
let dernierScroll = 0;
const header = document.querySelector('#header');
window.addEventListener('scroll', function () {
  const s = window.scrollY;
  if (s <= 80) { header.classList.remove('header--cache', 'header--compacte'); }
  else if (s > dernierScroll) { header.classList.add('header--cache'); header.classList.remove('header--compacte'); }
  else { header.classList.remove('header--cache'); header.classList.add('header--compacte'); }
  dernierScroll = s;
}, { passive: true });


// 2. CARROUSEL TÉMOIGNAGES
(function () {
  const grille = document.querySelector('.testimonials-grid');
  if (!grille) return;
  const cartes = Array.from(grille.querySelectorAll('.testimonial-card'));

  const wrapper = document.createElement('div');
  wrapper.className = 'carrousel-wrapper';
  const piste = document.createElement('div');
  piste.className = 'carrousel-piste';
  cartes.forEach(function (c) { piste.appendChild(c); });

  const dots = cartes.map(function (_, i) {
    const d = document.createElement('button');
    d.className = 'carr-dot' + (i === 0 ? ' actif' : '');
    d.onclick = function () { goTo(i); };
    return d;
  });

  const dotsBar = document.createElement('div');
  dotsBar.className = 'carr-dots';
  dots.forEach(function (d) { dotsBar.appendChild(d); });

  ['&#8592;', '&#8594;'].forEach(function (arrow, dir) {
    const b = document.createElement('button');
    b.className = 'carr-btn carr-btn--' + (dir ? 'next' : 'prev');
    b.innerHTML = arrow;
    b.onclick = function () { goTo(idx + (dir ? 1 : -1)); };
    wrapper.appendChild(b);
  });

  wrapper.append(piste, dotsBar);
  grille.parentNode.replaceChild(wrapper, grille);

  let idx = 0;
  function goTo(i) {
    cartes[idx].classList.remove('carr-actif');
    dots[idx].classList.remove('actif');
    idx = (i + cartes.length) % cartes.length;
    cartes[idx].classList.add('carr-actif');
    dots[idx].classList.add('actif');
    piste.style.transform = 'translateX(-' + idx * 100 + '%)';
  }

  cartes[0].classList.add('carr-actif');
  const t = setInterval(function () { goTo(idx + 1); }, 5000);
  wrapper.addEventListener('mouseenter', function () { clearInterval(t); });
})();


// 3. VALIDATION FORMULAIRE CONTACT — messages d'erreur sous chaque champ
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const regles = {
    'contact-nom':     function (v) { return v.trim().length >= 2 ? '' : 'Nom requis (min. 2 caractères).'; },
    'contact-email':   function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Email invalide.'; },
    'contact-tel':     function (v) { return !v.trim() || /^(\+216|00216)?[\d\s]{8,12}$/.test(v.trim()) ? '' : 'Format : +216 98 123 456'; },
    'contact-sujet':   function (v) { return v ? '' : 'Veuillez choisir un sujet.'; },
    'contact-message': function (v) { return v.trim().length >= 10 ? '' : 'Message trop court (min. 10 caractères).'; }
  };

  // Ajoute un span d'erreur sous chaque champ concerné
  Object.keys(regles).forEach(function (id) {
    const champ = document.getElementById(id);
    if (!champ) return;
    const span = document.createElement('span');
    span.className = 'champ-erreur';
    champ.parentNode.appendChild(span);

    function valider() {
      const msg = regles[id](champ.value);
      span.textContent = msg;
      champ.classList.toggle('champ--erreur', !!msg);
      champ.classList.toggle('champ--valide', !msg && !!champ.value);
      return !msg;
    }
    champ.addEventListener('blur', valider);
    champ.addEventListener('input', function () { if (champ.classList.contains('champ--erreur')) valider(); });
    champ._valider = valider;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const ok = Object.keys(regles).every(function (id) {
      const c = document.getElementById(id);
      return c ? c._valider() : true;
    });
    if (!ok) { form.querySelector('.champ--erreur').focus(); return; }

    // Toast succès
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = '✅ Message envoyé ! Réponse sous 24-48h.';
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('toast--visible'); });
    setTimeout(function () { t.classList.remove('toast--visible'); setTimeout(function () { t.remove(); }, 400); }, 4000);
    form.reset();
    form.querySelectorAll('.champ--erreur, .champ--valide').forEach(function (c) { c.className = c.className.replace(/champ--(erreur|valide)/g, ''); });
  });
})();

