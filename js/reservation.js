// Vérifie que l'utilisateur est bien connecté avant d'autoriser la réservation
const sessionEnCours = utilisateurConnecte();
if (!sessionEnCours) { window.location.href = 'connexion.html'; }

let trajetChoisi = null;
let dateChoisie = '';
let placeChoisie = null;
let modePaiementChoisi = 'en_ligne';

function changerModePaiement(mode) {
  modePaiementChoisi = mode;
  const carteEnLigne = document.querySelector('#carte-mode-en-ligne');
  const carteStation = document.querySelector('#carte-mode-station');
  if (carteEnLigne && carteStation) {
    carteEnLigne.classList.toggle('actif', mode === 'en_ligne');
    carteStation.classList.toggle('actif', mode === 'station');
  }
}

function rechercherTrajets(event) {
  event.preventDefault();
  const depart = document.querySelector('#depart').value;
  const destination = document.querySelector('#destination').value;
  dateChoisie = document.querySelector('#date-voyage').value;
  const resultats = trajets.filter(function(t) { return t.depart === depart && t.destination === destination; });
  afficherTrajets(resultats);
}

function afficherTrajets(liste) {
  const conteneur = document.querySelector('#liste-trajets');
  conteneur.innerHTML = '';
  if (liste.length === 0) {
    conteneur.innerHTML = '<div class="alert alert--error">Aucun louage trouvé pour cet itinéraire.</div>';
    return;
  }
  liste.forEach(function(trajet) {
    const carte = document.createElement('div');
    carte.className = 'trajet-card';
    carte.innerHTML = `
      <div>
        <div class="trajet-heure">${trajet.heure}</div>
        <div class="trajet-villes">${trajet.depart} &rarr; ${trajet.destination}</div>
      </div>
      <div><span class="trajet-prix">${trajet.prix.toFixed(2)} DT</span></div>
      <button type="button" class="btn btn--primary btn--sm" onclick="choisirTrajet(${trajet.id})">Choisir</button>
    `;
    conteneur.appendChild(carte);
  });
}

function choisirTrajet(id) {
  trajetChoisi = trajets.find(function(t) { return t.id === id; });
  allerEtape(2);
  afficherPlaces();
}

// Récupère les places occupées depuis la BDD via PHP
function afficherPlaces() {
  const conteneurAvant   = document.querySelector('#places-avant');
  const conteneurMilieu  = document.querySelector('#places-milieu');
  const conteneurArriere = document.querySelector('#places-arriere');
  conteneurAvant.innerHTML = conteneurMilieu.innerHTML = conteneurArriere.innerHTML = '';

  fetch('../php/places-libres.php?trajetId=' + trajetChoisi.id + '&date=' + encodeURIComponent(dateChoisie))
    .then(function(r) { return r.json(); })
    .then(function(occupeesDB) {
      const occupees = [...trajetChoisi.placesOccupees, ...occupeesDB];
      dessinerPlaces(occupees, conteneurAvant, conteneurMilieu, conteneurArriere);
    })
    .catch(function() {
      dessinerPlaces([...trajetChoisi.placesOccupees], conteneurAvant, conteneurMilieu, conteneurArriere);
    });
}

function dessinerPlaces(occupees, avant, milieu, arriere) {
  for (let n = 1; n <= 8; n++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'siege-' + n;
    const estOccupee = occupees.includes(n);
    if (estOccupee) {
      btn.className = 'siege-fauteuil siege-fauteuil--occupe';
      btn.disabled = true;
      btn.innerHTML = `<span class="fauteuil-tete"></span><span class="fauteuil-corps"><span class="fauteuil-num">${n}</span><span class="fauteuil-etat">Occupée</span></span><span class="fauteuil-assise"></span>`;
    } else {
      const choisi = placeChoisie === n;
      btn.className = 'siege-fauteuil siege-fauteuil--libre' + (choisi ? ' siege-fauteuil--choisi' : '');
      btn.innerHTML = `<span class="fauteuil-tete"></span><span class="fauteuil-corps"><span class="fauteuil-num">${n}</span><span class="fauteuil-etat">${choisi ? 'Choisie' : 'Libre'}</span></span><span class="fauteuil-assise"></span>`;
      btn.onclick = function() { choisirPlace(n); };
    }
    if (n <= 2) avant.appendChild(btn);
    else if (n <= 5) milieu.appendChild(btn);
    else arriere.appendChild(btn);
  }
}

function choisirPlace(numero) {
  placeChoisie = numero;
  allerEtape(3);
  afficherEtapePaiement();
}

function afficherEtapePaiement() {
  const session = utilisateurConnecte();
  document.querySelector('#paiement-recap-trajet').textContent   = trajetChoisi.depart + ' → ' + trajetChoisi.destination;
  document.querySelector('#paiement-recap-date').textContent     = dateChoisie;
  document.querySelector('#paiement-recap-heure').textContent    = trajetChoisi.heure;
  document.querySelector('#paiement-recap-place').textContent    = 'Place n° ' + placeChoisie;
  document.querySelector('#paiement-recap-voyageur').textContent = session.nom;
  document.querySelector('#paiement-recap-prix').textContent     = trajetChoisi.prix.toFixed(2) + ' DT';
}

// Envoie la réservation vers php/reserver.php
function confirmerReservation() {
  const checkbox = document.querySelector('#check-conditions');
  if (checkbox && !checkbox.checked) {
    alert('⚠️ Veuillez accepter les conditions pour valider.');
    checkbox.focus();
    return;
  }

  const data = new FormData();
  data.append('trajetId',     trajetChoisi.id);
  data.append('depart',       trajetChoisi.depart);
  data.append('destination',  trajetChoisi.destination);
  data.append('date',         dateChoisie);
  data.append('heure',        trajetChoisi.heure);
  data.append('place',        placeChoisie);
  data.append('prix',         trajetChoisi.prix);
  data.append('modePaiement', modePaiementChoisi);

  fetch('../php/reserver.php', { method: 'POST', body: data })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      if (!res.ok) { alert('Erreur : ' + (res.erreur || 'Réservation impossible.')); return; }
      remplirBillet(res.code);
      allerEtape(4);
    })
    .catch(function() { alert('Erreur réseau. Vérifiez que XAMPP tourne.'); });
}

function remplirBillet(code) {
  const session = utilisateurConnecte();
  document.querySelector('#billet-code').textContent    = code;
  document.querySelector('#billet-trajet').textContent  = trajetChoisi.depart + ' → ' + trajetChoisi.destination;
  document.querySelector('#billet-date').textContent    = dateChoisie + ' à ' + trajetChoisi.heure;
  document.querySelector('#billet-place').textContent   = 'Place n° ' + placeChoisie;
  document.querySelector('#billet-passager').textContent = session.nom;
  document.querySelector('#billet-prix').textContent    = trajetChoisi.prix.toFixed(2) + ' DT';
  const badge = document.querySelector('#billet-mode-paiement');
  if (badge) {
    badge.innerHTML = modePaiementChoisi === 'en_ligne'
      ? '<span class="status-pill status-pill--success">Payé en ligne • Place 100% garantie</span>'
      : '<span class="status-pill status-pill--warning">À régler au guichet • 15-20 min avant</span>';
  }
}

function genererCode() {
  return 'LG-' + Math.floor(1000 + Math.random() * 9000);
}

function allerEtape(numero) {
  [1, 2, 3, 4].forEach(function(i) {
    const panneau = document.querySelector('#etape-' + i);
    const ind     = document.querySelector('#stepper-' + i);
    if (panneau) panneau.classList.toggle('cache', i !== numero);
    if (ind) ind.className = 'step-item' + (i === numero ? ' actif' : i < numero ? ' termine' : '');
  });
  for (let i = 1; i <= 3; i++) {
    const ligne = document.querySelector('#step-line-' + i);
    if (ligne) ligne.classList.toggle('actif', numero > i);
  }
  window.scrollTo({ top: 120, behavior: 'smooth' });
}

document.querySelector('#form-recherche').addEventListener('submit', rechercherTrajets);
document.querySelector('#btn-confirmer').addEventListener('click', confirmerReservation);
