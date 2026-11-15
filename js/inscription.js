// Crée un compte via fetch → php/inscription.php
function creerCompte(event) {
  event.preventDefault();
  const messageErreur = document.querySelector('#message-erreur');
  messageErreur.classList.add('cache');

  fetch('../php/inscription.php', { method: 'POST', body: new FormData(event.target) })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      if (res.ok) {
        localStorage.setItem('louagi_session', JSON.stringify(res.utilisateur));
        sessionStorage.setItem('louagi_session', JSON.stringify(res.utilisateur));
        window.location.href = 'reservation.html';
      } else {
        messageErreur.textContent = res.erreur || 'Erreur lors de l\'inscription.';
        messageErreur.classList.remove('cache');
      }
    })
    .catch(function(err) {
      messageErreur.textContent = 'Erreur réseau. Vérifiez que XAMPP tourne.';
      messageErreur.classList.remove('cache');
    });
}

document.querySelector('#form-inscription').addEventListener('submit', creerCompte);
