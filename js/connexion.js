// Compare les identifiants saisis avec les comptes enregistrés et ouvre la session
function seConnecter(event) {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim().toLowerCase();
  const motDePasse = document.querySelector("#motDePasse").value;
  const messageErreur = document.querySelector("#message-erreur");
  const comptes = lireDonnees("louagi_comptes");
  const compteTrouve = comptes.find(function(compte) {
    return compte.email === email && compte.motDePasse === motDePasse;
  });

  if (!compteTrouve) {
    messageErreur.textContent = "E-mail ou mot de passe incorrect.";
    messageErreur.classList.remove("cache");
    return;
  }

  sauvegarderDonnees("louagi_session", {
    nom: compteTrouve.nom,
    email: compteTrouve.email,
    telephone: compteTrouve.telephone
  });

  window.location.href = "reservation.html";
}

// Écoute la soumission du formulaire de connexion
document.querySelector("#form-connexion").addEventListener("submit", seConnecter);