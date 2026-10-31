// Lit une valeur dans localStorage (renvoie un tableau vide par défaut si aucune donnée)
function lireDonnees(cle) {
  const donnees = localStorage.getItem(cle);
  return donnees ? JSON.parse(donnees) : [];
}

// Enregistre une valeur convertie en format JSON dans localStorage
function sauvegarderDonnees(cle, valeur) {
  localStorage.setItem(cle, JSON.stringify(valeur));
}

// Renvoie l'utilisateur actuellement connecté ou null si aucune session active
function utilisateurConnecte() {
  const session = localStorage.getItem("louagi_session");
  return session ? JSON.parse(session) : null;
}
