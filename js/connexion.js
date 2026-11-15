// Connexion via fetch → php/connexion.php
function seConnecter(event) {
  event.preventDefault();
  const messageErreur = document.querySelector('#message-erreur');
  messageErreur.classList.add('cache');

  fetch('../php/connexion.php', { method: 'POST', body: new FormData(event.target) })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      if (res.ok) {
        localStorage.setItem('louagi_session', JSON.stringify(res.utilisateur));
        sessionStorage.setItem('louagi_session', JSON.stringify(res.utilisateur));
        window.location.href = 'reservation.html';
      } else {
        messageErreur.textContent = res.erreur || 'Email ou mot de passe incorrect.';
        messageErreur.classList.remove('cache');
      }
    })
    .catch(function() {
      messageErreur.textContent = 'Erreur réseau. Vérifiez que XAMPP tourne.';
      messageErreur.classList.remove('cache');
    });
}

document.querySelector('#form-connexion').addEventListener('submit', seConnecter);
