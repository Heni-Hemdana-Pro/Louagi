# Louagi — Landing Page Fictive

> **Mini projet web universitaire**  
> **Établissement :** ISSAT Sousse — Département Informatique  
> **Niveau & Année :** FIA3 — Année Universitaire 2025 / 2026  
> **Sujet 1 :** Page d'accueil d'une startup fictive (« Louagi »)  
> **Slogan :** *« Réservez votre place, pas votre attente. »*

---

## 1. Description du Projet

**Louagi** est une plateforme web tunisienne innovante dédiée à la réservation de louage interurbain à distance.  
Elle résout le problème historique des stations de louage (attente aléatoire, départs imprévisibles uniquement lorsque le véhicule est complet) en permettant aux voyageurs de réserver leur siège garanti et leur horaire en amont.

---

## 2. Contraintes Techniques Respectées (100% Conformes)

- **Technologies :** **HTML5 sémantique** et **CSS3 pur uniquement**.
- **Aucun framework :** Aucun Bootstrap, Tailwind ou librairie tierce.
- **Aucun JavaScript :** Menu burger, accordéon FAQ, animations et interactions fonctionnent exclusivement en CSS3 pur.
- **Validation W3C :** **0 erreur** au validateur officiel W3C HTML et **0 erreur** au validateur W3C CSS.
- **Séparation stricte :** Aucun style CSS dans le HTML, aucun attribut `style=""`.
- **Responsive Design :** Approche Mobile-First (testé à 320 px, 768 px, 1024 px et 1440 px).
- **Accessibilité :** Lien d'évitement (« Aller au contenu »), navigation clavier `:focus-visible`, contrastes conformes WCAG AA, balises `aria-label`.
- **Performance :** Dépendance externe unique : Google Fonts (*Inter* et *Poppins*). Toutes les illustrations et icônes sont des SVG vectoriels locaux dans `/images`.

---

## 3. Arborescence du Projet

```
/louagi-landing-page
├── index.html                   # Page d'accueil principale
├── style.css                    # Feuille de styles unique et commentée
├── README.md                    # Documentation du projet
├── /images                      # Logos, illustrations de louage et icônes SVG
│   ├── Logo Louagi _ navette et repère jaune.png
│   ├── Réservation Louagi à la station tunisienne.png
│   ├── icon-*.svg
│   ├── service-*.svg
│   ├── avatar-*.svg
│   └── social-*.svg
└── /pages                       # Pages secondaires
    └── mentions-legales.html    # Mentions légales & cadre académique
```

---

## 4. Charte Graphique

| Élément | Valeur | Usage |
| :--- | :--- | :--- |
| **Couleur principale** | `#0B3C5D` | Bleu profond (identité, titres, navigation, footer) |
| **Couleur d'accent** | `#F5B700` | Jaune louage tunisien (boutons CTA, badges, surlignages) |
| **Fonds alternés** | `#FFFFFF` & `#F4F7FA` | Alternance douce des sections pour une lisibilité optimale |
| **Texte principal** | `#1F2933` | Gris foncé pour un contraste maximal (WCAG AAA) |
| **Police des titres** | `Poppins` (700) | Typographie moderne et affirmée |
| **Police du texte** | `Inter` (400, 500, 600) | Lisibilité et clarté sur tous les écrans |

---

## 5. Fonctionnalités Clés Implémentées

1. **Header fixe :** Reste visible au défilement avec effet de flou (`backdrop-filter: blur`), logo SVG et bouton CTA « Réserver ».
2. **Menu burger pur CSS :** Implémenté avec la technique `input[type="checkbox"]` + `label` + `:checked ~ nav` avec animation fluide des barres en croix.
3. **Hero section :** Titre unique `<h1>`, sous-titre explicatif, formulaire de recherche HTML5 complet (départ, destination, date, heure), indicateurs de confiance et illustration SVG d'un louage tunisien traversant l'écran en boucle CSS (`@keyframes`).
4. **Section À propos (`#apropos`) :** Mission, comparaison problème / solution et grille de 4 chiffres clés statiques avec survol interactif.
5. **Comment ça marche :** 3 étapes illustrées et numérotées menant de la réservation au voyage.
6. **Services (`#services`) :** Grille responsive de 6 cartes avec icônes personnalisées et effet d'élévation au survol (`translateY(-6px)`).
7. **Équipe fondatrice (`#equipe`) :** 4 profils avec avatars SVG, rôles et effet de zoom/rotation au survol.
8. **Témoignages & FAQ :** Avis de voyageurs et accordéon 100% HTML5 natif sans JavaScript (`<details>` / `<summary>`).
9. **Contact (`#contact`) :** Formulaire complet avec validation HTML5 native (`required`, `type="email"`, `type="tel"`, `minlength`), coordonnées réelles de Sousse et liens réseaux sociaux.
10. **Footer institutionnel :** Liens rapides, mentions légales et mention obligatoire : *« Projet académique fictif, ISSAT Sousse, 2025/2026 »*.
11. **Prise en charge de `prefers-reduced-motion` :** Désactivation propre des animations pour les utilisateurs ayant activé l'option d'accessibilité.
