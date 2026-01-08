import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { CompteService } from '../../services/compte.service';
import { Transaction, OperationRequest, VirementRequest } from '../../models/transaction.model';
import { Compte } from '../../models/compte.model';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {
  transactions: Transaction[] = [];
  comptes: Compte[] = [];
  activeTab: 'list' | 'depot' | 'retrait' | 'virement' = 'list';
  loading = false;
  error = '';
  success = '';

  depotRequest: OperationRequest = { compteId: 0, montant: 0 };
  retraitRequest: OperationRequest = { compteId: 0, montant: 0 };
  virementRequest: VirementRequest = { compteSourceId: 0, compteDestinataireId: 0, montant: 0 };

  constructor(
    private transactionService: TransactionService,
    private compteService: CompteService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadComptes();
  }

  loadTransactions(): void {
    this.loading = true;
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions = data.sort((a, b) =>
          new Date(b.dateTransaction || '').getTime() - new Date(a.dateTransaction || '').getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des transactions';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadComptes(): void {
    this.compteService.getAllComptes().subscribe({
      next: (data) => {
        this.comptes = data;
      },
      error: (err) => {
        console.error('Erreur chargement comptes:', err);
      }
    });
  }

  setActiveTab(tab: 'list' | 'depot' | 'retrait' | 'virement'): void {
    this.activeTab = tab;
    this.error = '';
    this.success = '';
  }

  effectuerDepot(): void {
    if (this.depotRequest.compteId === 0 || this.depotRequest.montant <= 0) {
      this.error = 'Veuillez remplir tous les champs correctement';
      return;
    }

    this.loading = true;
    this.transactionService.depot(this.depotRequest).subscribe({
      next: () => {
        this.success = 'Dépôt effectué avec succès';
        this.depotRequest = { compteId: 0, montant: 0 };
        this.loading = false;
        this.loadTransactions();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du dépôt';
        this.loading = false;
      }
    });
  }

  effectuerRetrait(): void {
    if (this.retraitRequest.compteId === 0 || this.retraitRequest.montant <= 0) {
      this.error = 'Veuillez remplir tous les champs correctement';
      return;
    }

    this.loading = true;
    this.transactionService.retrait(this.retraitRequest).subscribe({
      next: () => {
        this.success = 'Retrait effectué avec succès';
        this.retraitRequest = { compteId: 0, montant: 0 };
        this.loading = false;
        this.loadTransactions();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du retrait';
        this.loading = false;
      }
    });
  }

  effectuerVirement(): void {
    if (this.virementRequest.compteSourceId === 0 ||
        this.virementRequest.compteDestinataireId === 0 ||
        this.virementRequest.montant <= 0) {
      this.error = 'Veuillez remplir tous les champs correctement';
      return;
    }

    if (this.virementRequest.compteSourceId === this.virementRequest.compteDestinataireId) {
      this.error = 'Les comptes source et destinataire doivent être différents';
      return;
    }

    this.loading = true;
    this.transactionService.virement(this.virementRequest).subscribe({
      next: () => {
        this.success = 'Virement effectué avec succès';
        this.virementRequest = { compteSourceId: 0, compteDestinataireId: 0, montant: 0 };
        this.loading = false;
        this.loadTransactions();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du virement';
        this.loading = false;
      }
    });
  }

  getTransactionTypeClass(type: string): string {
    switch(type) {
      case 'DEPOT': return 'bg-green-100 text-green-800';
      case 'RETRAIT': return 'bg-red-100 text-red-800';
      case 'VIREMENT': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTransactionIcon(type: string): string {
    switch(type) {
      case 'DEPOT': return '↓';
      case 'RETRAIT': return '↑';
      case 'VIREMENT': return '↔';
      default: return '•';
    }
  }
}
