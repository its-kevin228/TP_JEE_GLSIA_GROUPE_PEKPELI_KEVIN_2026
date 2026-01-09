import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountResponse } from '../models/account.model';
import { TransactionResponse } from '../models/transaction.model';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';
import { AppStore } from '../stores/app.store';

@Component({
  standalone: true,
  selector: 'app-transactions',
  imports: [CommonModule, RouterLink],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit, OnDestroy {
  transactions: TransactionResponse[] = [];
  selectedAccount: AccountResponse | null = null;
  accountId: string | null = null;
  isLoading = true;
  errorMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private txService: TransactionService,
    private accountService: AccountService,
    private store: AppStore,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((map) => {
      this.accountId = map.get('accountId');
      if (this.accountId) {
        this.loadAccountAndTransactions(this.accountId);
      } else {
        // Charger toutes les transactions de tous les comptes
        this.loadAllTransactions();
      }
    });
    
    // S'abonner aux changements du store
    this.store.dataChanged$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      console.log('[Transactions] Data change event:', event);
      if (event.type === 'transaction' || event.type === 'system') {
        if (this.accountId) {
          this.loadAccountAndTransactions(this.accountId);
        } else {
          this.loadAllTransactions();
        }
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge toutes les transactions de tous les comptes
   */
  private loadAllTransactions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.selectedAccount = null;
    this.cdr.detectChanges();

    this.txService.getAll().subscribe({
      next: (transactions) => {
        this.transactions = transactions.sort(
          (a, b) => new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime()
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load all transactions', err);
        this.errorMessage = 'Failed to load transactions.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadAccountAndTransactions(numeroCompte: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    // Load account details
    this.accountService.getByNumber(numeroCompte).subscribe({
      next: (account) => {
        this.selectedAccount = account;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load account', err);
        this.errorMessage = 'Failed to load account details.';
        this.cdr.detectChanges();
      },
    });

    // Load transactions
    this.txService.getAllByAccount(numeroCompte).subscribe({
      next: (transactions) => {
        this.transactions = transactions.sort(
          (a, b) => new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime()
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
        this.errorMessage = 'Failed to load transactions.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getTypeDisplay(type: string): string {
    const types: Record<string, string> = {
      DEPOT: 'Deposit',
      RETRAIT: 'Withdrawal',
      VIREMENT_ENTRANT: 'Transfer In',
      VIREMENT_SORTANT: 'Transfer Out',
    };
    return types[type] || type;
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      DEPOT: 'ri-add-circle-line',
      RETRAIT: 'ri-subtract-line',
      VIREMENT_ENTRANT: 'ri-arrow-down-line',
      VIREMENT_SORTANT: 'ri-arrow-up-line',
    };
    return icons[type] || 'ri-exchange-dollar-line';
  }

  getTxnAmountClass(type: string): string {
    if (type === 'DEPOT' || type === 'VIREMENT_ENTRANT') {
      return 'text-success';
    }
    return 'text-danger';
  }

  getTxnSign(type: string): string {
    if (type === 'DEPOT' || type === 'VIREMENT_ENTRANT') {
      return '+';
    }
    return '-';
  }

  getAccountTypeDisplay(typeCompte: string): string {
    const types: Record<string, string> = {
      EPARGNE: 'Savings',
      COURANT: 'Checking',
    };
    return types[typeCompte] || typeCompte;
  }
}
