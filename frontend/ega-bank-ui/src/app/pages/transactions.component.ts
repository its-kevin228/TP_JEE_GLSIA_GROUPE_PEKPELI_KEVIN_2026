import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountResponse } from '../models/account.model';
import { TransactionResponse } from '../models/transaction.model';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';
import { AppStore } from '../stores/app.store';
import { AuthService } from '../services/auth.service';
import { RouteHelperService } from '../services/route-helper.service';
import { StatementService } from '../services/statement.service';

@Component({
  standalone: true,
  selector: 'app-transactions',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit, OnDestroy {
  transactions: TransactionResponse[] = [];
  selectedAccount: AccountResponse | null = null;
  accountId: string | null = null;
  isLoading = true;
  errorMessage = '';
  isAdmin = false;
  statementStart = '';
  statementEnd = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private txService: TransactionService,
    private accountService: AccountService,
    private store: AppStore,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private routeHelper: RouteHelperService,
    private statementService: StatementService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.initStatementDates();

    this.route.queryParamMap.subscribe((map) => {
      this.accountId = map.get('accountId');
      if (this.accountId) {
        this.loadAccountAndTransactions(this.accountId);
      } else {
        // Admin: toutes les transactions, Client: charger un compte par défaut
        if (this.isAdmin) {
          this.loadAllTransactions();
        } else {
          this.loadDefaultAccountTransactions();
        }
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

    const request$ = this.isAdmin ? this.txService.getAll() : this.txService.getMine();

    request$.subscribe({
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

    this.initStatementDates();

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

  private loadDefaultAccountTransactions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.selectedAccount = null;
    this.cdr.detectChanges();

    this.accountService.getMine().subscribe({
      next: (accounts) => {
        const firstAccount = accounts[0];
        if (!firstAccount) {
          this.transactions = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }
        this.accountId = firstAccount.numeroCompte;
        this.loadAccountAndTransactions(firstAccount.numeroCompte);
      },
      error: (err) => {
        console.error('Failed to load accounts', err);
        this.errorMessage = 'Failed to load accounts.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
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

  downloadStatement(): void {
    if (!this.accountId || !this.statementStart || !this.statementEnd) {
      return;
    }

    this.statementService.downloadStatement(this.accountId, this.statementStart, this.statementEnd).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `releve_${this.accountId}_${this.statementStart}_${this.statementEnd}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to download statement', err);
        this.errorMessage = 'Failed to download statement.';
      }
    });
  }

  private initStatementDates(): void {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 30);
    this.statementEnd = today.toISOString().slice(0, 10);
    this.statementStart = start.toISOString().slice(0, 10);
  }

  get transactionsRoute(): string {
    return this.routeHelper.getTransactionsRoute();
  }

  get newTransactionRoute(): string {
    return this.routeHelper.getNewTransactionRoute();
  }

  get accountsRoute(): string {
    return this.routeHelper.getAccountsRoute();
  }
}
