export enum TypeCompte {
  COURANT = 'COURANT',
  EPARGNE = 'EPARGNE'
}

export interface Compte {
  id?: number;
  numeroCompte?: string;
  type: TypeCompte;
  dateCreation?: string; // Format ISO
  solde: number;
  clientId: number;
  clientNom?: string;
  clientPrenom?: string;
  decouvertAutorise?: number; // Pour compte courant
  tauxInteret?: number; // Pour compte épargne
}

export interface CreateCompteRequest {
  type: TypeCompte;
  clientId: number;
  decouvertAutorise?: number;
  tauxInteret?: number;
}
