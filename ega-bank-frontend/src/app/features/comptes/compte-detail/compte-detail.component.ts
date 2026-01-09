import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompteService, TransactionService } from '../../../api/services';
import { Compte, Transaction } from '../../../api/models';

@Component({
  selector: 'app-compte-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './compte-detail.component.html',
  styleUrls: ['./compte-detail.component.css']
})
export class CompteDetailComponent implements OnInit {
  compte = signal<Compte | null>(null);
  transactions = signal<Transaction[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private compteService: CompteService,
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCompte(+id);
    }
  }

  loadCompte(id: number): void {
    this.loading.set(true);
    this.compteService.getCompteById(id).subscribe({
      next: (compte) => {
        this.compte.set(compte);
        this.loadTransactions(compte.numeroCompte!);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du compte');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  loadTransactions(numeroCompte: string): void {
    this.transactionService.getTransactionsByCompte(numeroCompte).subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des transactions:', err);
      }
    });
  }

  getTransactionClass(type: string): string {
    switch(type) {
      case 'DEPOT': return 'transaction-depot';
      case 'RETRAIT': return 'transaction-retrait';
      case 'VIREMENT': return 'transaction-virement';
      default: return '';
    }
  }

  getTransactionIcon(type: string): string {
    switch(type) {
      case 'DEPOT': return '⬇️';
      case 'RETRAIT': return '⬆️';
      case 'VIREMENT': return '↔️';
      default: return '•';
    }
  }
}
