-- ============================================================
-- louagi.sql — Base complète (ajouter à louagi_db dans pgAdmin)
-- ============================================================

-- Messages contact (déjà créé)
CREATE TABLE IF NOT EXISTS messages_contact (
  id SERIAL PRIMARY KEY, nom VARCHAR(100) NOT NULL, email VARCHAR(150) NOT NULL,
  telephone VARCHAR(20), sujet VARCHAR(50) NOT NULL, message TEXT NOT NULL,
  date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ip_expediteur VARCHAR(45)
);

-- Compteur clics (déjà créé)
CREATE TABLE IF NOT EXISTS compteur_clics (
  id SERIAL PRIMARY KEY, bouton VARCHAR(80) NOT NULL UNIQUE,
  total INTEGER DEFAULT 0, derniere_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telephone VARCHAR(20),
  mot_de_passe VARCHAR(255) NOT NULL,
  date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Réservations
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  trajet_id INTEGER NOT NULL,
  depart VARCHAR(50) NOT NULL,
  destination VARCHAR(50) NOT NULL,
  date_voyage DATE NOT NULL,
  heure VARCHAR(10) NOT NULL,
  place INTEGER NOT NULL,
  prix DECIMAL(5,2) NOT NULL,
  mode_paiement VARCHAR(20) NOT NULL DEFAULT 'en_ligne',
  code VARCHAR(20) NOT NULL UNIQUE,
  date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Données initiales compteur clics
INSERT INTO compteur_clics (bouton, total) VALUES
  ('nav-cta-reserver', 0), ('hero-recherche', 0), ('services-reserver', 0)
ON CONFLICT (bouton) DO NOTHING;
