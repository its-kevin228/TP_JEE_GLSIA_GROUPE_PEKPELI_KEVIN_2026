import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AccountResponse } from '../models/account.model';
import { TransactionResponse } from '../models/transaction.model';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';
import { AppStore } from '../stores/app.store';
import { AuthService } from '../services/auth.service';
import { RouteHelperService } from '../services/route-helper.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2">New Transaction</h1>
        <p class="text-gray-500">Perform a deposit, withdrawal, or transfer between accounts.</p>
      </div>

      <div class="card p-6" style="max-width: 700px;">
        <!-- Error Message -->
        <div *ngIf="errorMessage" class="alert alert-danger mb-4">
          <i class="ri-error-warning-line"></i> {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div *ngIf="successMessage" class="alert alert-success mb-4">
          <i class="ri-checkbox-circle-line"></i> {{ successMessage }}
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <!-- Transaction Type -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="ri-exchange-line text-primary"></i> Transaction Type *
            </label>
            <div class="grid gap-3" style="grid-template-columns: repeat(3, 1fr);">
              <label class="cursor-pointer" (click)="form.patchValue({type: 'DEPOT'})">
                <input type="radio" formControlName="type" value="DEPOT" class="sr-only">
                <div class="txn-type-card" [class.active]="form.value.type === 'DEPOT'">
                  <i class="ri-add-circle-line text-2xl"></i>
                  <div class="font-medium mt-1">Deposit</div>
                  <div class="text-xs opacity-70">Dépôt</div>
                </div>
              </label>
              <label class="cursor-pointer" (click)="form.patchValue({type: 'RETRAIT'})">
                <input type="radio" formControlName="type" value="RETRAIT" class="sr-only">
                <div class="txn-type-card" [class.active]="form.value.type === 'RETRAIT'">
                  <i class="ri-subtract-line text-2xl"></i>
                  <div class="font-medium mt-1">Withdraw</div>
                  <div class="text-xs opacity-70">Retrait</div>
                </div>
              </label>
              <label class="cursor-pointer" (click)="form.patchValue({type: 'VIREMENT'})">
                <input type="radio" formControlName="type" value="VIREMENT" class="sr-only">
                <div class="txn-type-card" [class.active]="form.value.type === 'VIREMENT'">
                  <i class="ri-arrow-left-right-line text-2xl"></i>
                  <div class="font-medium mt-1">Transfer</div>
                  <div class="text-xs opacity-70">Virement</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Source Account -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="ri-bank-card-line text-primary"></i>
              {{ form.value.type === 'VIREMENT' ? 'Source Account' : 'Account' }} *
            </label>

            <!-- Loading accounts -->
            <div *ngIf="isLoadingAccounts" class="skeleton" style="height: 44px; border-radius: 4px;"></div>

            <!-- No accounts available -->
            <div *ngIf="!isLoadingAccounts && accounts.length === 0" class="p-4 bg-gray-50 rounded border text-center">
              <i class="ri-bank-card-2-line text-2xl text-gray-400"></i>
              <p class="text-gray-500 mt-2">No accounts found.</p>
              <a routerLink="/accounts/new" class="btn btn-primary btn-sm mt-2">
                <i class="ri-add-line"></i> Create Account First
              </a>
            </div>

            <!-- Account dropdown -->
            <select *ngIf="!isLoadingAccounts && accounts.length > 0"
                    formControlName="accountNumber"
                    class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">-- Select an account --</option>
              <option *ngFor="let account of accounts" [value]="account.numeroCompte">
                {{ account.numeroCompte }} - {{ getTypeDisplay(account.typeCompte) }}
                ({{ account.solde | currency:'XOF':'symbol':'1.0-0' }})
                {{ account.clientNomComplet ? ' - ' + account.clientNomComplet : '' }}
              </option>
            </select>

            <!-- Selected account info -->
            <div *ngIf="sourceAccount" class="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <i class="ri-bank-card-line text-primary"></i>
                  <div>
                    <div class="font-medium font-mono">{{ sourceAccount.numeroCompte }}</div>
                    <div class="text-sm text-gray-500">
                      {{ getTypeDisplay(sourceAccount.typeCompte) }}
                      <span *ngIf="sourceAccount.clientNomComplet"> • {{ sourceAccount.clientNomComplet }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-gray-500">Available Balance</div>
                  <div class="font-bold font-mono text-lg" [class.text-success]="sourceAccount.solde > 0" [class.text-danger]="sourceAccount.solde <= 0">
                    {{ sourceAccount.solde | currency:'XOF':'symbol':'1.0-0' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Target Account (only for transfers) -->
          <div *ngIf="form.value.type === 'VIREMENT'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="ri-arrow-right-line text-primary"></i> Target Account *
            </label>
            <input type="text"
                   formControlName="targetAccountNumber"
                   class="w-full p-3 border rounded font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                   [class.border-red-500]="targetAccountError"
                   [class.border-green-500]="targetAccount && !targetAccountError"
                   placeholder="Enter or paste account number (e.g., TG73EGA0000101880345400)">

            <!-- Loading indicator -->
            <div *ngIf="isLoadingTargetAccount" class="mt-2 text-sm text-gray-500">
              <i class="ri-loader-4-line animate-spin"></i> Searching account...
            </div>

            <!-- Error message -->
            <div *ngIf="targetAccountError && !isLoadingTargetAccount" class="mt-2 text-sm text-red-500">
              <i class="ri-error-warning-line"></i> {{ targetAccountError }}
            </div>

            <!-- Help text -->
            <p *ngIf="!targetAccount && !targetAccountError && !isLoadingTargetAccount" class="text-xs text-gray-500 mt-1">
              <i class="ri-information-line"></i> Enter the recipient's account number
            </p>

            <!-- Target account info -->
            <div *ngIf="targetAccount && !targetAccountError" class="mt-2 p-3 bg-green-50 rounded border border-green-200">
              <div class="flex items-center gap-2">
                <i class="ri-checkbox-circle-fill text-success text-xl"></i>
                <div>
                  <div class="font-medium font-mono">{{ targetAccount.numeroCompte }}</div>
                  <div class="text-sm text-gray-500">
                    {{ getTypeDisplay(targetAccount.typeCompte) }}
                    <span *ngIf="targetAccount.clientNomComplet"> • {{ targetAccount.clientNomComplet }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Amount -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="ri-money-dollar-circle-line text-primary"></i> Amount (XOF) *
            </label>
            <div class="relative">
              <input type="number"
                     formControlName="amount"
                     class="w-full p-3 pl-12 border rounded text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                     placeholder="0"
                     min="1"
                     step="1">
              <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">XOF</span>
            </div>
            <div *ngIf="form.get('amount')?.value > 0 && sourceAccount" class="mt-2 text-sm">
              <span *ngIf="form.value.type !== 'DEPOT'" [class.text-success]="sourceAccount.solde >= form.get('amount')?.value"
                    [class.text-danger]="sourceAccount.solde < form.get('amount')?.value">
                <i [class]="sourceAccount.solde >= form.get('amount')?.value ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'"></i>
                {{ sourceAccount.solde >= form.get('amount')?.value ? 'Sufficient balance' : 'Insufficient balance!' }}
              </span>
              <span *ngIf="form.value.type === 'DEPOT'" class="text-success">
                <i class="ri-arrow-up-line"></i> New balance will be: {{ (sourceAccount.solde + form.get('amount')?.value) | currency:'XOF':'symbol':'1.0-0' }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="ri-file-text-line text-primary"></i> Description (optional)
            </label>
            <input type="text"
                   formControlName="description"
                   class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                   placeholder="Enter a description for this transaction">
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <a [routerLink]="transactionsRoute" class="btn btn-secondary flex-1" *ngIf="returnAccountId">
              <i class="ri-arrow-left-line"></i> Cancel
            </a>
            <a [routerLink]="accountsRoute" class="btn btn-secondary flex-1" *ngIf="!returnAccountId">
              <i class="ri-arrow-left-line"></i> Cancel
            </a>
            <button type="submit"
                    [disabled]="form.invalid || isSubmitting || accounts.length === 0 || !isBalanceSufficient() || !isTransferValid()"
                    class="btn flex-1"
                    [class.btn-success]="form.value.type === 'DEPOT'"
                    [class.btn-danger]="form.value.type === 'RETRAIT'"
                    [class.btn-primary]="form.value.type === 'VIREMENT'">
              <span *ngIf="isSubmitting">
                <i class="ri-loader-4-line spinner-icon"></i> Processing...
              </span>
              <span *ngIf="!isSubmitting">
                <i [class]="getSubmitIcon()"></i> {{ getSubmitLabel() }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }
    .txn-type-card {
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      text-align: center;
      transition: all 0.2s;
      color: #6b7280;
      background: transparent !important;
    }
    .txn-type-card:hover {
      border-color: var(--primary);
      background: transparent !important;
    }
    .txn-type-card.active {
      border-color: var(--primary);
      color: var(--primary);
      background: transparent !important;
    }
    select:focus, input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary), transparent 80%);
    }
    .btn-success {
      background-color: var(--success);
      color: white;
    }
    .btn-success:hover {
      filter: brightness(0.95);
    }
    .btn-success:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class TransactionFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  accounts: AccountResponse[] = [];
  sourceAccount: AccountResponse | null = null;
  targetAccount: AccountResponse | null = null;
  isLoadingAccounts = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  returnAccountId: string | null = null;
  isLoadingTargetAccount = false;
  targetAccountError = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private txService: TransactionService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private store: AppStore,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private routeHelper: RouteHelperService
  ) {
    this.form = this.fb.group({
      type: ['DEPOT', Validators.required],
      accountNumber: ['', Validators.required],
      targetAccountNumber: [''],
      amount: [null, [Validators.required, Validators.min(1)]],
      description: [''],
    });

    // Watch for account selection changes
    this.form.get('accountNumber')?.valueChanges.subscribe(accountNumber => {
      this.sourceAccount = this.accounts.find(a => a.numeroCompte === accountNumber) || null;
    });

    // Watch for target account input with debounce
    this.form.get('targetAccountNumber')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(accountNumber => {
      this.targetAccountError = '';
      if (accountNumber && accountNumber.length >= 10) {
        this.lookupTargetAccount(accountNumber);
      } else {
        this.targetAccount = null;
      }
    });

    // Reset target when type changes
    this.form.get('type')?.valueChanges.subscribe(type => {
      if (type !== 'VIREMENT') {
        this.form.patchValue({ targetAccountNumber: '' });
        this.targetAccount = null;
        this.targetAccountError = '';
      }
    });
  }

  private lookupTargetAccount(accountNumber: string): void {
    // Ne pas permettre le virement vers soi-même
    if (accountNumber === this.form.value.accountNumber) {
      this.targetAccountError = 'Cannot transfer to the same account';
      this.targetAccount = null;
      return;
    }

    this.isLoadingTargetAccount = true;
    this.cdr.detectChanges();

    this.accountService.getByNumber(accountNumber).subscribe({
      next: (account) => {
        this.targetAccount = account;
        this.isLoadingTargetAccount = false;
        this.targetAccountError = '';
        if (!account.actif) {
          this.targetAccountError = 'This account is inactive';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.targetAccount = null;
        this.isLoadingTargetAccount = false;
        this.targetAccountError = 'Account not found';
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.returnAccountId = params.get('accountId');
      if (this.returnAccountId) {
        // Pre-select account if coming from transactions page
        this.form.patchValue({ accountNumber: this.returnAccountId });
      }
    });
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoadingAccounts = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const request$: Observable<AccountResponse[]> = this.authService.isAdmin()
      ? this.accountService.getAll(0, 200).pipe(map(response => response.content || []))
      : this.accountService.getMine();

    request$.subscribe({
      next: (accounts) => {
        this.accounts = accounts.filter((a) => a.actif);
        this.isLoadingAccounts = false;

        // If pre-selected account
        if (this.returnAccountId) {
          this.sourceAccount = this.accounts.find(a => a.numeroCompte === this.returnAccountId) || null;
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to load accounts', err);
        this.errorMessage = 'Failed to load accounts. Please try again.';
        this.isLoadingAccounts = false;
        this.cdr.detectChanges();
      }
    });
  }

  getTargetAccounts(): AccountResponse[] {
    const sourceNum = this.form.value.accountNumber;
    return this.accounts.filter(a => a.numeroCompte !== sourceNum);
  }

  getTypeDisplay(typeCompte: string): string {
    const types: Record<string, string> = {
      EPARGNE: 'Savings',
      COURANT: 'Checking',
    };
    return types[typeCompte] || typeCompte;
  }

  isBalanceSufficient(): boolean {
    if (this.form.value.type === 'DEPOT') return true;
    if (!this.sourceAccount) return false;
    return this.sourceAccount.solde >= (this.form.value.amount || 0);
  }

  isTransferValid(): boolean {
    if (this.form.value.type !== 'VIREMENT') return true;
    return this.targetAccount !== null && !this.targetAccountError && !this.isLoadingTargetAccount;
  }

  getSubmitIcon(): string {
    switch (this.form.value.type) {
      case 'DEPOT': return 'ri-add-circle-line';
      case 'RETRAIT': return 'ri-subtract-line';
      case 'VIREMENT': return 'ri-arrow-left-right-line';
      default: return 'ri-check-line';
    }
  }

  getSubmitLabel(): string {
    switch (this.form.value.type) {
      case 'DEPOT': return 'Deposit';
      case 'RETRAIT': return 'Withdraw';
      case 'VIREMENT': return 'Transfer';
      default: return 'Submit';
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const v = this.form.value;

    // Validate transfer target
    if (v.type === 'VIREMENT') {
      if (!v.targetAccountNumber) {
        this.errorMessage = 'Please enter a target account number for the transfer.';
        return;
      }
      if (!this.targetAccount) {
        this.errorMessage = 'Please enter a valid target account number.';
        return;
      }
      if (this.targetAccountError) {
        this.errorMessage = this.targetAccountError;
        return;
      }
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (v.type === 'VIREMENT') {
      this.txService.transfer({
        compteSource: String(v.accountNumber),
        compteDestination: String(v.targetAccountNumber),
        montant: Number(v.amount),
        description: v.description || undefined
      }).subscribe({
        next: (tx) => this.handleSuccess('Transfer completed successfully!', tx),
        error: (e) => this.handleError(e)
      });
    } else if (v.type === 'DEPOT') {
      this.txService.deposit(String(v.accountNumber), {
        montant: Number(v.amount),
        description: v.description || undefined
      }).subscribe({
        next: (tx) => this.handleSuccess('Deposit completed successfully!', tx),
        error: (e) => this.handleError(e)
      });
    } else {
      this.txService.withdraw(String(v.accountNumber), {
        montant: Number(v.amount),
        description: v.description || undefined
      }).subscribe({
        next: (tx) => this.handleSuccess('Withdrawal completed successfully!', tx),
        error: (e) => this.handleError(e)
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleSuccess(message: string, transaction?: TransactionResponse): void {
    this.successMessage = message;
    this.isSubmitting = false;

    // Mettre à jour le store avec les nouveaux soldes
    if (transaction && transaction.soldeApres !== undefined) {
      const accountNumber = this.form.value.accountNumber;
      this.store.updateAccountBalance(accountNumber, transaction.soldeApres);

      // Pour les virements, mettre à jour aussi le compte destination
      if (this.form.value.type === 'VIREMENT' && this.targetAccount) {
        // Le backend retourne soldeApres du compte source
        // On déclenche un refresh complet pour les virements
        this.store.triggerFullRefresh();
      }
    } else {
      // Si pas de transaction response, déclencher un refresh complet
      this.store.triggerFullRefresh();
    }

    // Incrémenter le compteur de transactions
    this.store.incrementTransactionCount();

    // Navigate after showing success
    setTimeout(() => {
      if (this.returnAccountId) {
        this.router.navigate([this.transactionsRoute], { queryParams: { accountId: this.returnAccountId } });
      } else {
        this.router.navigateByUrl(this.accountsRoute);
      }
    }, 1500);
  }

  private handleError(err: any): void {
    console.error('Transaction failed', err);
    this.isSubmitting = false;
    this.errorMessage = err.error?.message || 'Transaction failed. Please try again.';
  }

  get accountsRoute(): string {
    return this.routeHelper.getAccountsRoute();
  }

  get transactionsRoute(): string {
    return this.routeHelper.getTransactionsRoute();
  }
}
