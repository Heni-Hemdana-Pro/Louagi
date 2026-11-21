// 1. MENU SCROLL — cache au descente, réapparaît à la remontée
let dernierScroll = 0;
const header = document.querySelector('#header');
window.addEventListener('scroll', function () {
  const s = window.scrollY;
  if (s <= 80) { header.classList.remove('header--cache', 'header--compacte'); }
  else if (s > dernierScroll) { header.classList.add('header--cache'); header.classList.remove('header--compacte'); }
  else { header.classList.remove('header--cache'); header.classList.add('header--compacte'); }
  dernierScroll = s;
});


// 2. CARROUSEL TÉMOIGNAGES (Simple et fonctionnel)
const cartes = document.querySelectorAll('.carr-contenu .testimonial-card');
const dots = document.querySelectorAll('.carr-dot');
let idx = 0;

function afficherTemoignage(n) {
  if (!cartes.length) return;
  cartes[idx].classList.remove('actif');
  dots[idx]?.classList.remove('actif');
  idx = (n + cartes.length) % cartes.length;
  cartes[idx].classList.add('actif');
  dots[idx]?.classList.add('actif');
}

document.querySelector('.carr-btn--prev')?.addEventListener('click', function () { afficherTemoignage(idx - 1); });
document.querySelector('.carr-btn--next')?.addEventListener('click', function () { afficherTemoignage(idx + 1); });
dots.forEach(function (dot, i) {
  dot.addEventListener('click', function () { afficherTemoignage(i); });
});

let timer = setInterval(function () { afficherTemoignage(idx + 1); }, 5000);
const carrousel = document.querySelector('.temoignages-carrousel');
carrousel?.addEventListener('mouseenter', function () { clearInterval(timer); });
carrousel?.addEventListener('mouseleave', function () { timer = setInterval(function () { afficherTemoignage(idx + 1); }, 5000); });


// 3. VALIDATION FORMULAIRE CONTACT (Simple et lisible)
const form = document.querySelector('.contact-form');
if (form) {
  const regles = {
    'contact-nom': v => v.trim().length >= 2 ? '' : 'Nom requis (min. 2 caractères).',
    'contact-email': v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Email invalide.',
    'contact-tel': v => !v.trim() || /^(\+216|00216)?[\d\s]{8,12}$/.test(v.trim()) ? '' : 'Format : +216 98 123 456',
    'contact-sujet': v => v ? '' : 'Veuillez choisir un sujet.',
    'contact-message': v => v.trim().length >= 10 ? '' : 'Message trop court (min. 10 caractères).'
  };

  function validerChamp(id) {
    const champ = document.getElementById(id);
    if (!champ) return true;
    let span = champ.nextElementSibling;
    if (!span || !span.classList.contains('champ-erreur')) {
      span = document.createElement('span');
      span.className = 'champ-erreur';
      champ.after(span);
    }
    const erreur = regles[id](champ.value);
    span.textContent = erreur;
    champ.classList.toggle('champ--erreur', !!erreur);
    return !erreur;
  }

  Object.keys(regles).forEach(id => {
    document.getElementById(id)?.addEventListener('blur', () => validerChamp(id));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const estValide = Object.keys(regles).every(validerChamp);
    if (!estValide) return;

    alert(' Message envoyé ! Nous vous répondrons sous 24-48h.');
    form.reset();
    document.querySelectorAll('.champ-erreur').forEach(s => s.remove());
    document.querySelectorAll('.champ--erreur').forEach(c => c.classList.remove('champ--erreur'));
  });
}