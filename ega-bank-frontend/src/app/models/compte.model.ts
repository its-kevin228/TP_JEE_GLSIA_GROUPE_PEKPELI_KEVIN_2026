export interface Compte {
  id?: number;
  numeroCompte?: string;
  solde: number;
  typeCompte: 'COURANT' | 'EPARGNE';
  dateCreation?: string;
  clientId: number;
  clientNom?: string;
  clientPrenom?: string;

  // Pour compte épargne
  tauxInteret?: number;

  // Pour compte courant
  decouvertAutorise?: number;
}

export interface CreateCompteRequest {
  clientId: number;
  typeCompte: 'COURANT' | 'EPARGNE';
  soldeInitial: number;
  tauxInteret?: number;
  decouvertAutorise?: number;
}
