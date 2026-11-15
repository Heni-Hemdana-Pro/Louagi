// Vérifie que l'utilisateur est connecté, sinon redirige
const sessionUtilisateur = utilisateurConnecte();
if (!sessionUtilisateur) { window.location.href = 'connexion.html'; }

// Affiche les réservations depuis la BDD via php/mes-reservations.php
function afficherReservations() {
  const conteneur = document.querySelector('#liste-mes-reservations');
  conteneur.innerHTML = '<p>Chargement...</p>';

  fetch('../php/mes-reservations.php')
    .then(function(r) { return r.json(); })
    .then(function(liste) {
      conteneur.innerHTML = '';
      if (liste.length === 0) {
        conteneur.innerHTML = `
          <div class="message-vide">
            <p>Vous n'avez aucune réservation pour le moment.</p>
            <a href="reservation.html" class="btn btn--primary btn--sm">Réserver un louage</a>
          </div>`;
        return;
      }
      liste.forEach(function(r) {
        const badge = r.mode_paiement === 'station'
          ? '<span class="status-pill status-pill--warning">À régler en station</span>'
          : '<span class="status-pill status-pill--success">Payé en ligne</span>';
        const carte = document.createElement('div');
        carte.className = 'reservation-card';
        carte.innerHTML = `
          <div>
            <div class="res-header">
              <span class="res-code">${r.code}</span>
              <span class="res-badge-place">Place ${r.place}</span>
            </div>
            <div class="res-trajet">${r.depart} &rarr; ${r.destination}</div>
            <div class="res-info"><strong>Date :</strong> ${r.date_voyage}</div>
            <div class="res-info"><strong>Départ :</strong> ${r.heure}</div>
            <div class="res-info"><strong>Paiement :</strong> ${badge}</div>
            <div class="res-prix">${parseFloat(r.prix).toFixed(2)} DT</div>
          </div>
          <div class="res-footer">
            <button type="button" class="btn btn--danger btn--sm" onclick="annulerReservation('${r.code}')">Annuler</button>
          </div>`;
        conteneur.appendChild(carte);
      });
    })
    .catch(function() {
      conteneur.innerHTML = '<p class="alert alert--error">Erreur de chargement. Vérifiez que XAMPP tourne.</p>';
    });
}

// Annule une réservation via php/annuler.php
function annulerReservation(code) {
  if (!confirm('Annuler la réservation ' + code + ' ?')) return;
  const data = new FormData();
  data.append('code', code);
  fetch('../php/annuler.php', { method: 'POST', body: data })
    .then(function(r) { return r.json(); })
    .then(function(res) { if (res.ok) afficherReservations(); });
}

afficherReservations();
