/* ==========================================================================
   inscription.js - Gestion de la création de compte voyageur
   ========================================================================== */

// Vérifie les mots de passe et l'e-mail, enregistre le compte puis redirige vers la connexion
function creerCompte(event) {
  event.preventDefault(); //rechargement de la page

  const nom = document.querySelector("#nom").value.trim();
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const telephone = document.querySelector("#telephone").value.trim();
  const motDePasse = document.querySelector("#motDePasse").value;
  const confirmation = document.querySelector("#confirmation").value;
  const messageErreur = document.querySelector("#message-erreur");

  if (motDePasse !== confirmation) {
    messageErreur.textContent = "Les deux mots de passe ne sont pas identiques.";
    messageErreur.classList.remove("cache");
    return;
  }

  const comptes = lireDonnees("louagi_comptes");
  const existeDeja = comptes.find(function(compte) {
    return compte.email === email;
  });

  if (existeDeja) {
    messageErreur.textContent = "Un compte existe déjà avec cette adresse e-mail.";
    messageErreur.classList.remove("cache");
    return;
  }

  comptes.push({
    nom: nom,
    email: email,
    telephone: telephone,
    motDePasse: motDePasse
  });
  sauvegarderDonnees("louagi_comptes", comptes);
  window.location.href = "connexion.html?succes=1";
}

// Écoute la soumission du formulaire d'inscription
document.querySelector("#form-inscription").addEventListener("submit", creerCompte);
