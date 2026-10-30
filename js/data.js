/* ==========================================================================
   data.js - Liste des trajets de louage disponibles (données fictives)
   ========================================================================== */

// Tableau des trajets interurbains avec horaires, tarifs et places occupées par défaut
const trajets = [
  { id: 1, depart: "Sousse", destination: "Tunis", heure: "07:30", prix: 11.5, placesOccupees: [2, 5] },
  { id: 2, depart: "Sousse", destination: "Tunis", heure: "09:00", prix: 11.5, placesOccupees: [1] },
  { id: 3, depart: "Sousse", destination: "Tunis", heure: "11:30", prix: 11.5, placesOccupees: [] },
  { id: 4, depart: "Tunis", destination: "Sousse", heure: "08:00", prix: 11.5, placesOccupees: [3, 7] },
  { id: 5, depart: "Tunis", destination: "Sousse", heure: "10:30", prix: 11.5, placesOccupees: [] },
  { id: 6, depart: "Sousse", destination: "Sfax", heure: "08:30", prix: 9.0, placesOccupees: [4] },
  { id: 7, depart: "Sousse", destination: "Sfax", heure: "13:00", prix: 9.0, placesOccupees: [] },
  { id: 8, depart: "Sfax", destination: "Sousse", heure: "09:00", prix: 9.0, placesOccupees: [1, 2] },
  { id: 9, depart: "Tunis", destination: "Monastir", heure: "09:30", prix: 12.0, placesOccupees: [6] },
  { id: 10, depart: "Monastir", destination: "Tunis", heure: "14:00", prix: 12.0, placesOccupees: [] }
];
