import { AccountResponse } from './account.model';

// Sexe enum matching backend
export type Sexe = 'MASCULIN' | 'FEMININ';

export interface ClientResponse {
  id: number;
  nom: string;
  prenom: string;
  nomComplet?: string;
  dateNaissance?: string; // ISO date
  sexe?: Sexe;
  adresse?: string;
  telephone?: string;
  courriel?: string;
  nationalite?: string;
  avatar?: string; // Base64 encoded image
  createdAt?: string;
  nombreComptes?: number;
  comptes?: AccountResponse[];
  enabled?: boolean; // Statut d'activation du compte utilisateur
  userId?: number; // ID de l'utilisateur associé
}

export interface ClientRequest {
  nom: string;
  prenom: string;
  dateNaissance: string; // ISO date YYYY-MM-DD
  sexe: Sexe;
  adresse?: string;
  telephone?: string;
  courriel?: string;
  nationalite?: string;
}
