export enum TypeTransaction {
  DEPOT = 'DEPOT',
  RETRAIT = 'RETRAIT',
  VIREMENT = 'VIREMENT'
}

export interface Transaction {
  id?: number;
  typeTransaction: TypeTransaction;
  montant: number;
  dateTransaction?: string; // Format ISO
  description?: string;
  compteId?: number;
  numeroCompte?: string;
  compteDestinataire?: string;
}

export interface OperationRequest {
  numeroCompte: string;
  montant: number;
  description?: string;
}

export interface VirementRequest {
  compteSource: string;
  compteDestinataire: string;
  montant: number;
  description?: string;
}
