// Vérifie que l'utilisateur est connecté, sinon redirige vers la page de connexion
const sessionUtilisateur = utilisateurConnecte();
if (!sessionUtilisateur) {
  window.location.href = "connexion.html";
}

// Affiche la liste des réservations de l'utilisateur connecté ou un message vide
function afficherReservations() {
  const conteneur = document.querySelector("#liste-mes-reservations");
  conteneur.innerHTML = "";

  const toutesLesReservations = lireDonnees("louagi_reservations");
  const mesReservations = toutesLesReservations.filter(function(reservation) {
    return reservation.utilisateurEmail === sessionUtilisateur.email;
  });

  if (mesReservations.length === 0) {
    conteneur.innerHTML = `
      <div class="message-vide">
        <p>Vous n'avez aucune réservation pour le moment.</p>
        <a href="reservation.html" class="btn btn--primary btn--sm">Réserver un louage</a>
      </div>
    `;
    return;
  }

  mesReservations.forEach(function(reservation) {
    const badgePaiement = reservation.modePaiement === "station"
      ? '<span class="status-pill status-pill--warning">À régler en station</span>'
      : '<span class="status-pill status-pill--success">Payé en ligne</span>';

    const carte = document.createElement("div");
    carte.className = "reservation-card";
    carte.innerHTML = `
      <div>
        <div class="res-header">
          <span class="res-code">${reservation.code}</span>
          <span class="res-badge-place">Place ${reservation.place}</span>
        </div>
        <div class="res-trajet">${reservation.depart} &rarr; ${reservation.destination}</div>
        <div class="res-info"><strong>Date :</strong> ${reservation.date}</div>
        <div class="res-info"><strong>Départ :</strong> ${reservation.heure}</div>
        <div class="res-info"><strong>Paiement :</strong> ${badgePaiement}</div>
        <div class="res-prix">${reservation.prix.toFixed(2)} DT</div>
      </div>
      <div class="res-footer">
        <button type="button" class="btn btn--danger btn--sm" onclick="annulerReservation('${reservation.code}')">Annuler</button>
      </div>
    `;
    conteneur.appendChild(carte);
  });
}

// Supprime une réservation après confirmation de l'utilisateur et actualise l'affichage
function annulerReservation(code) {
  const confirmation = confirm("Voulez-vous vraiment annuler la réservation " + code + " ?");

  if (!confirmation) {
    return;
  }

  const reservations = lireDonnees("louagi_reservations");
  const resteReservations = reservations.filter(function(reservation) {
    return reservation.code !== code;
  });

  sauvegarderDonnees("louagi_reservations", resteReservations);
  afficherReservations();
}

// Chargement initial des réservations au démarrage de la page
afficherReservations();
