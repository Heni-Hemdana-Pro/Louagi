// Lit une valeur dans localStorage
function lireDonnees(cle) {
  const d = localStorage.getItem(cle);
  return d ? JSON.parse(d) : [];
}
function sauvegarderDonnees(cle, valeur) {
  localStorage.setItem(cle, JSON.stringify(valeur));
}
// Utilisateur connecté : lit sessionStorage ou localStorage
function utilisateurConnecte() {
  const s = sessionStorage.getItem('louagi_session') || localStorage.getItem('louagi_session');
  return s ? JSON.parse(s) : null;
}
// Déconnexion complète
function deconnecter() {
  localStorage.removeItem('louagi_session');
  sessionStorage.removeItem('louagi_session');
  fetch('../php/deconnexion.php').catch(function() {});
  window.location.href = 'connexion.html';
}
