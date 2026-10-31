# Louagi — Plateforme Web de Réservation de Louage en Tunisie

> **Projet Académique Web**  
> **Établissement :** Institut Supérieur des Sciences Appliquées et de Technologie de Sousse (ISSAT Sousse)  
> **Filière :** Département Informatique  
> **Année Universitaire :** 2026 / 2027  
> **Slogan :** _« Réservez votre place, pas votre attente. »_

---

## 1. Description du Projet

**Louagi** est une plateforme web moderne et intuitive dédiée à la modernisation du transport interurbain par louage en Tunisie.  
Elle résout la contrainte historique des stations (attente aléatoire, départs imprévisibles, sièges non garantis) en permettant aux usagers de planifier leurs déplacements, de choisir leur place numérotée dans le véhicule et de réserver leur billet en ligne ou en station.

---

## 2. Architecture & Technologies

Le projet repose sur une architecture web front-end légère, ultra-rapide et sans framework lourd :

- **HTML5 Sémantique :** Structure accessible (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3 Pur & Modulaire :**
  - `style.css` : Feuille de styles principale de la landing page (mise en page, animations fluides, composantes partagées).
  - `pages.css` : Styles dédiés aux applications internes (thème sombre avec voile d'ambiance, stepper, plan d'habitacle et cartes de paiement).
- **Vanilla JavaScript (ES6) :** Aucun framework ni dépendance externe. Code structuré, modulaire et optimisé.
- **Stockage Local (`localStorage`) :** Persistance des comptes voyageurs, des sessions utilisateur et de l'historique des réservations.
- **Optimisation des Performances (WebPerf) :**
  - Formats d'image modernes **WebP** (réduction de plus de 90% du poids des visuels).
  - Chargement asynchrone non-bloquant des polices Google Fonts.
  - Préchargement haute priorité (`preload`, `fetchpriority="high"`) des ressources critiques (LCP).

---

## 3. Arborescence du Projet

```text
louagi-landing-page/
├── index.html                    # Landing page officielle
├── style.css                     # Styles généraux & landing page
├── pages.css                     # Styles des pages applicatives internes
├── README.md                     # Documentation du projet
├── js/
│   ├── main.js                   # Interactions landing page (menu scroll, carrousel, validation)
│   ├── stockage.js               # Gestionnaire centralisé du localStorage
│   ├── data.js                   # Données simulées (trajets, horaires, tarifs)
│   ├── connexion.js              # Authentification voyageur & session
│   ├── inscription.js            # Création de compte & validation de formulaire
│   ├── reservation.js            # Moteur de réservation interactif en 4 étapes
│   └── mes-reservations.js       # Affichage & gestion des billets réservés
├── pages/
│   ├── connexion.html            # Interface de connexion
│   ├── inscription.html          # Formulaire d'inscription voyageur
│   ├── reservation.html          # Tunnel de réservation (Trajet -> Siège -> Paiement -> Billet)
│   ├── mes-reservations.html     # Espace voyageur & historique des billets
│   └── mentions-legales.html     # Mentions légales & cadre académique
└── images/                       # Assets vectoriels (SVG), logos et photographies WebP
    ├── logo-louagi.webp          # Logo officiel optimisé
    ├── terminal-minibus-soleil.webp # Image d'ambiance optimisée LCP
    ├── icon-*.svg                # Icônes fonctionnelles
    └── avatar-*.svg              # Avatars des avis et membres de l'équipe
```

---

## 4. Parcours & Fonctionnalités Clés

### 🌟 A. Page d'Accueil (`index.html`)
1. **Menu Dynamique au Scroll :** Le header s'escamote lors du défilement vers le bas et réapparaît automatiquement lors de la remontée avec un effet d'élévation.
2. **Carrousel de Témoignages :** Défilement automatique toutes les 5 secondes, transitions fluides, commandes manuelles (flèches et puces indicatrices) et pause intelligente au survol.
3. **Validation Avancée du Formulaire de Contact :** Contrôle instantané sous chaque champ (format d'email, longueur du nom, numéro tunisien valide) et retour utilisateur par toast notification.
4. **Moteur de Recherche Rapide :** Sélection des gares et dates pour orienter directement l'usager vers la réservation.

### 🚐 B. Tunnel de Réservation en 4 Étapes (`reservation.html`)
1. **Étape 1 — Trajet & Horaires :** Recherche par gare de départ (Tunis, Sousse, Sfax, Monastir...) avec filtrage dynamique des départs et affichage des tarifs en dinars tunisiens (DT).
2. **Étape 2 — Choix Interactif du Siège :** Modélisation visuelle de l'habitacle d'un louage 8 places (poste chauffeur, rangée avant 2 places, rangées intermédiaire et arrière de 3 places) avec états temps réel (*Libre*, *Occupé*, *Votre sélection*).
3. **Étape 3 — Mode de Paiement & Validation des Conditions :**
   - **Paiement en ligne :** Carte bancaire CIB, Visa/Mastercard, D17 ou Flouci avec garantie intégrale de la place (mention des pénalités d'abandon à moins de 30 min du départ).
   - **Paiement à la station :** Règlement en espèces au guichet avec rappel strict de la règle des **15 à 20 minutes** d'anticipation avant le départ.
   - Case à cocher obligatoire d'acceptation des conditions de transport.
4. **Étape 4 — Confirmation & Billet Électronique :** Génération d'un code de réservation unique (`LG-XXXX`), récapitulatif détaillé et option d'impression du billet.

### 👤 C. Espace Voyageur & Authentification
- **Inscription & Connexion :** Contrôle des doublons d'adresse électronique, vérification des mots de passe et gestion automatique de l'état connecté.
- **Mes Réservations (`mes-reservations.html`) :** Consultation de l'ensemble des réservations effectuées avec badges d'état (*Payé en ligne* ou *À régler au guichet*).

---

## 5. Charte Graphique

| Élément | Code Couleur / Rendu | Signification & Usage |
| :--- | :--- | :--- |
| **Bleu Profond** | `#0B3C5D` | Couleur primaire institutionnelle (stabilité, confiance, sécurité) |
| **Jaune Louage** | `#F5B700` | Couleur d'accentuation inspirée des bandes emblématiques des louages tunisiens |
| **Bleu Nuit (Dark)** | `#0B131B` | Fond sombre des pages applicatives rehaussé d'un voile photo |
| **Typographie Titres** | `Poppins` (Bold / SemiBold) | Modernité, lisibilité et impact visuel |
| **Typographie Corps** | `Inter` (Regular / Medium) | Excellente lisibilité sur terminaux mobiles |

---

## 6. Lancement & Test du Projet

Le projet ne nécessite aucune installation de serveur backend complexe ni compilation :

1. Cloner ou télécharger le dossier du projet.
2. Ouvrir le fichier `index.html` dans n'importe quel navigateur moderne (Chrome, Firefox, Edge, Safari) ou lancer un serveur local léger (ex. extension *Live Server* sous VS Code / Antigravity).
3. Naviguer entre la page d'accueil, la création de compte et la réservation d'un trajet.

---

## 7. Mentions Académiques

Ce projet est réalisé dans un cadre pédagogique et académique au sein de l'**ISSAT Sousse**.  
Les données de transport, transporteurs et avis sont présentés à des fins de démonstration et d'apprentissage des bonnes pratiques du développement Web moderne (HTML5, CSS3, JavaScript ES6 & Web Performance).
