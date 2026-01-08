export interface Transaction {
  id?: number;
  typeTransaction: 'DEPOT' | 'RETRAIT' | 'VIREMENT';
  montant: number;
  dateTransaction?: string;
  compteSourceId?: number;
  compteSourceNumero?: string;
  compteDestinataireId?: number;
  compteDestinataireNumero?: string;
  description?: string;
}

export interface OperationRequest {
  compteId: number;
  montant: number;
}

export interface VirementRequest {
  compteSourceId: number;
  compteDestinataireId: number;
  montant: number;
}
