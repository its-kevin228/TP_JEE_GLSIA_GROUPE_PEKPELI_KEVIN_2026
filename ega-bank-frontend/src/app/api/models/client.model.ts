export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string; // Format ISO: YYYY-MM-DD
  sexe: 'M' | 'F' | 'HOMME' | 'FEMME';
  adresse: string;
  telephone: string;
  email: string;
}
