import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../../api/services';
import { OperationRequest, VirementRequest } from '../../../api/models';

@Component({
  selector: 'app-transaction-operation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaction-operation.component.html',
  styleUrls: ['./transaction-operation.component.css']
})
export class TransactionOperationComponent implements OnInit {
  operationForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  operationType = signal<'depot' | 'retrait' | 'virement'>('depot');

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Pre-fill if passed as query param
    const numeroCompte = this.route.snapshot.queryParamMap.get('numeroCompte');
    if (numeroCompte) {
      this.operationForm.patchValue({ numeroCompte });
    }
  }

  initForm(): void {
    this.operationForm = this.fb.group({
      numeroCompte: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0.01)]],
      description: [''],
      compteDestinataire: ['']
    });

    // Update validators when operation type changes
    this.updateValidators();
  }

  setOperationType(type: 'depot' | 'retrait' | 'virement'): void {
    this.operationType.set(type);
    this.updateValidators();
    this.error.set(null);
    this.success.set(null);
  }

  updateValidators(): void {
    const compteDestControl = this.operationForm.get('compteDestinataire');

    if (this.operationType() === 'virement') {
      compteDestControl?.setValidators([Validators.required]);
    } else {
      compteDestControl?.clearValidators();
      compteDestControl?.setValue('');
    }

    compteDestControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.operationForm.invalid) {
      this.operationForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const type = this.operationType();

    if (type === 'virement') {
      const request: VirementRequest = {
        compteSource: this.operationForm.value.numeroCompte,
        compteDestinataire: this.operationForm.value.compteDestinataire,
        montant: this.operationForm.value.montant,
        description: this.operationForm.value.description || undefined
      };

      this.transactionService.virement(request).subscribe({
        next: () => {
          this.success.set('Virement effectué avec succès');
          this.loading.set(false);
          this.resetForm();
          setTimeout(() => this.router.navigate(['/transactions']), 2000);
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    } else {
      const request: OperationRequest = {
        numeroCompte: this.operationForm.value.numeroCompte,
        montant: this.operationForm.value.montant,
        description: this.operationForm.value.description || undefined
      };

      const operation = type === 'depot'
        ? this.transactionService.deposer(request)
        : this.transactionService.retirer(request);

      operation.subscribe({
        next: () => {
          const message = type === 'depot' ? 'Dépôt' : 'Retrait';
          this.success.set(`${message} effectué avec succès`);
          this.loading.set(false);
          this.resetForm();
          setTimeout(() => this.router.navigate(['/transactions']), 2000);
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    }
  }

  handleError(err: any): void {
    let errorMessage = 'Une erreur est survenue';

    if (err.error?.message) {
      errorMessage = err.error.message;
    } else if (err.error?.error) {
      errorMessage = err.error.error;
    } else if (err.message) {
      errorMessage = err.message;
    }

    this.error.set(errorMessage);
    this.loading.set(false);
  }

  resetForm(): void {
    this.operationForm.reset();
    this.operationForm.patchValue({
      description: ''
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.operationForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.operationForm.get(fieldName);
    if (field?.hasError('required')) return 'Ce champ est obligatoire';
    if (field?.hasError('min')) return `Montant minimum: ${field.errors?.['min'].min}`;
    return '';
  }
}
