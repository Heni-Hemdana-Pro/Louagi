/* ==========================================================================
   reservation.js - Parcours de réservation de louage en 3 étapes
   ========================================================================== */

// Vérifie que l'utilisateur est bien connecté avant d'autoriser la réservation
const sessionEnCours = utilisateurConnecte();
if (!sessionEnCours) {
  window.location.href = "connexion.html";
}

let trajetChoisi = null;
let dateChoisie = "";
let placeChoisie = null;
let modePaiementChoisi = "en_ligne"; // Par défaut : paiement en ligne

// Permet de basculer interactivement entre les 2 modes de paiement
function changerModePaiement(mode) {
  modePaiementChoisi = mode;

  const carteEnLigne = document.querySelector("#carte-mode-en-ligne");
  const carteStation = document.querySelector("#carte-mode-station");

  if (carteEnLigne && carteStation) {
    if (mode === "en_ligne") {
      carteEnLigne.classList.add("actif");
      carteStation.classList.remove("actif");
    } else {
      carteStation.classList.add("actif");
      carteEnLigne.classList.remove("actif");
    }
  }
}

// Filtre les trajets selon la ville de départ et la destination choisies
function rechercherTrajets(event) {
  event.preventDefault();
  const depart = document.querySelector("#depart").value;
  const destination = document.querySelector("#destination").value;
  dateChoisie = document.querySelector("#date-voyage").value;

  const resultats = trajets.filter(function(trajet) {
    return trajet.depart === depart && trajet.destination === destination;
  });

  afficherTrajets(resultats);
}

// Crée une carte pour chaque trajet disponible trouvé
function afficherTrajets(liste) {
  const conteneur = document.querySelector("#liste-trajets");
  conteneur.innerHTML = "";

  if (liste.length === 0) {
    conteneur.innerHTML = '<div class="alert alert--error">Aucun louage trouvé pour cet itinéraire à la date demandée.</div>';
    return;
  }

  liste.forEach(function(trajet) {
    const carte = document.createElement("div");
    carte.className = "trajet-card";
    carte.innerHTML = `
      <div>
        <div class="trajet-heure">${trajet.heure}</div>
        <div class="trajet-villes">${trajet.depart} &rarr; ${trajet.destination}</div>
      </div>
      <div>
        <span class="trajet-prix">${trajet.prix.toFixed(2)} DT</span>
      </div>
      <button type="button" class="btn btn--primary btn--sm" onclick="choisirTrajet(${trajet.id})">Choisir</button>
    `;
    conteneur.appendChild(carte);
  });
}

// Mémorise le trajet sélectionné et passe à l'étape du choix de place
function choisirTrajet(id) {
  trajetChoisi = trajets.find(function(trajet) {
    return trajet.id === id;
  });

  allerEtape(2);
  afficherPlaces();
}

// Dessine les 8 places du louage selon les places libres et occupées
function afficherPlaces() {
  const conteneurAvant = document.querySelector("#places-avant");
  const conteneurMilieu = document.querySelector("#places-milieu");
  const conteneurArriere = document.querySelector("#places-arriere");

  conteneurAvant.innerHTML = "";
  conteneurMilieu.innerHTML = "";
  conteneurArriere.innerHTML = "";

  const reservations = lireDonnees("louagi_reservations");
  const occupees = [...trajetChoisi.placesOccupees];

  reservations.forEach(function(reservation) {
    if (reservation.trajetId === trajetChoisi.id && reservation.date === dateChoisie) {
      occupees.push(reservation.place);
    }
  });

  for (let numero = 1; numero <= 8; numero++) {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.id = "siege-" + numero;
    const estOccupee = occupees.includes(numero);

    if (estOccupee) {
      bouton.className = "siege-fauteuil siege-fauteuil--occupe";
      bouton.disabled = true;
      bouton.innerHTML = `
        <span class="fauteuil-tete"></span>
        <span class="fauteuil-corps">
          <span class="fauteuil-num">${numero}</span>
          <span class="fauteuil-etat">Occupée</span>
        </span>
        <span class="fauteuil-assise"></span>
      `;
    } else {
      const estChoisie = (placeChoisie === numero);
      bouton.className = "siege-fauteuil siege-fauteuil--libre" + (estChoisie ? " siege-fauteuil--choisi" : "");
      bouton.innerHTML = `
        <span class="fauteuil-tete"></span>
        <span class="fauteuil-corps">
          <span class="fauteuil-num">${numero}</span>
          <span class="fauteuil-etat">${estChoisie ? "Choisie" : "Libre"}</span>
        </span>
        <span class="fauteuil-assise"></span>
      `;
      bouton.onclick = function() {
        choisirPlace(numero);
      };
    }

    if (numero <= 2) {
      conteneurAvant.appendChild(bouton);
    } else if (numero <= 5) {
      conteneurMilieu.appendChild(bouton);
    } else {
      conteneurArriere.appendChild(bouton);
    }
  }
}

// Sélectionne le numéro de place cliqué et passe à l'étape 3 (Mode de paiement)
function choisirPlace(numero) {
  placeChoisie = numero;
  allerEtape(3);
  afficherEtapePaiement();
}

// Affiche les informations complètes du voyage dans l'étape de paiement
function afficherEtapePaiement() {
  const session = utilisateurConnecte();

  document.querySelector("#paiement-recap-trajet").textContent = trajetChoisi.depart + " \u2192 " + trajetChoisi.destination;
  document.querySelector("#paiement-recap-date").textContent = dateChoisie;
  document.querySelector("#paiement-recap-heure").textContent = trajetChoisi.heure;
  document.querySelector("#paiement-recap-place").textContent = "Place n° " + placeChoisie;
  document.querySelector("#paiement-recap-voyageur").textContent = session.nom;
  document.querySelector("#paiement-recap-prix").textContent = trajetChoisi.prix.toFixed(2) + " DT";
}

// Enregistre la réservation avec le mode de paiement choisi et affiche le billet électronique
function confirmerReservation() {
  const checkboxConditions = document.querySelector("#check-conditions");
  if (checkboxConditions && !checkboxConditions.checked) {
    alert("⚠️ Veuillez cocher la case d'acceptation des conditions d'annulation et de ponctualité pour valider votre réservation.");
    checkboxConditions.focus();
    return;
  }

  const session = utilisateurConnecte();
  const codeGenere = genererCode();

  const nouvelleReservation = {
    code: codeGenere,
    trajetId: trajetChoisi.id,
    depart: trajetChoisi.depart,
    destination: trajetChoisi.destination,
    date: dateChoisie,
    heure: trajetChoisi.heure,
    place: placeChoisie,
    prix: trajetChoisi.prix,
    modePaiement: modePaiementChoisi,
    utilisateurNom: session.nom,
    utilisateurEmail: session.email
  };

  const reservations = lireDonnees("louagi_reservations");
  reservations.push(nouvelleReservation);
  sauvegarderDonnees("louagi_reservations", reservations);

  // Remplissage du billet électronique officiel (Étape 4)
  document.querySelector("#billet-code").textContent = codeGenere;
  document.querySelector("#billet-trajet").textContent = nouvelleReservation.depart + " \u2192 " + nouvelleReservation.destination;
  document.querySelector("#billet-date").textContent = nouvelleReservation.date + " à " + nouvelleReservation.heure;
  document.querySelector("#billet-place").textContent = "Place n° " + nouvelleReservation.place;
  document.querySelector("#billet-passager").textContent = nouvelleReservation.utilisateurNom;
  document.querySelector("#billet-prix").textContent = nouvelleReservation.prix.toFixed(2) + " DT";

  const badgeMode = document.querySelector("#billet-mode-paiement");
  if (nouvelleReservation.modePaiement === "en_ligne") {
    badgeMode.innerHTML = '<span class="status-pill status-pill--success">Payé en ligne • Place 100% garantie</span>';
  } else {
    badgeMode.innerHTML = '<span class="status-pill status-pill--warning">À régler au guichet • Présence requise 15-20 min avant</span>';
  }

  allerEtape(4);
}

// Crée un code de réservation aléatoire au format LG-XXXX
function genererCode() {
  const aleatoire = Math.floor(1000 + Math.random() * 9000);
  return "LG-" + aleatoire;
}

// Bascule l'affichage vers l'étape demandée et met à jour les indicateurs et les lignes
function allerEtape(numero) {
  const etapes = [1, 2, 3, 4];

  // Met à jour l'affichage des 4 panneaux et des 4 indicateurs
  etapes.forEach(function(index) {
    const panneau = document.querySelector("#etape-" + index);
    const indicateur = document.querySelector("#stepper-" + index);

    if (panneau) {
      if (index === numero) {
        panneau.classList.remove("cache");
      } else {
        panneau.classList.add("cache");
      }
    }

    if (indicateur) {
      if (index === numero) {
        indicateur.className = "step-item actif";
      } else if (index < numero) {
        indicateur.className = "step-item termine";
      } else {
        indicateur.className = "step-item";
      }
    }
  });

  // Met à jour la couleur des lignes entre les étapes :
  // En avançant vers l'étape suivante, la ligne devient JAUNE (classe .actif).
  // Si on revient en arrière, la ligne redevient GRISE automatiquement !
  for (let i = 1; i <= 3; i++) {
    const ligne = document.querySelector("#step-line-" + i);
    if (ligne) {
      if (numero > i) {
        ligne.classList.add("actif");
      } else {
        ligne.classList.remove("actif");
      }
    }
  }

  // Repositionne doucement l'utilisateur en haut du flux de réservation
  window.scrollTo({ top: 120, behavior: "smooth" });
}

// Initialisation des écouteurs d'événements
document.querySelector("#form-recherche").addEventListener("submit", rechercherTrajets);
document.querySelector("#btn-confirmer").addEventListener("click", confirmerReservation);
