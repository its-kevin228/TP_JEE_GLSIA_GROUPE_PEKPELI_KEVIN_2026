import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService, CompteService } from '../../../api/services';
import { Client, TypeCompte, CreateCompteRequest } from '../../../api/models';

@Component({
  selector: 'app-compte-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './compte-form.component.html',
  styleUrls: ['./compte-form.component.css']
})
export class CompteFormComponent implements OnInit {
  compteForm!: FormGroup;
  clients = signal<Client[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  typeCompte = TypeCompte;

  constructor(
    private fb: FormBuilder,
    private compteService: CompteService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClients();

    // Pre-fill client if passed as query param
    const clientId = this.route.snapshot.queryParamMap.get('clientId');
    if (clientId) {
      this.compteForm.patchValue({ clientId: +clientId });
    }
  }

  initForm(): void {
    this.compteForm = this.fb.group({
      type: [TypeCompte.COURANT, Validators.required],
      clientId: ['', Validators.required],
      decouvertAutorise: [0, [Validators.min(0)]],
      tauxInteret: [0, [Validators.min(0), Validators.max(100)]]
    });

    // Listen to type changes to show/hide fields
    this.compteForm.get('type')?.valueChanges.subscribe(() => {
      this.updateFormValidation();
    });
  }

  updateFormValidation(): void {
    const type = this.compteForm.get('type')?.value;
    const decouvertControl = this.compteForm.get('decouvertAutorise');
    const tauxControl = this.compteForm.get('tauxInteret');

    if (type === TypeCompte.COURANT) {
      decouvertControl?.setValidators([Validators.required, Validators.min(0)]);
      tauxControl?.clearValidators();
      tauxControl?.setValue(null);
    } else {
      tauxControl?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      decouvertControl?.clearValidators();
      decouvertControl?.setValue(null);
    }

    decouvertControl?.updateValueAndValidity();
    tauxControl?.updateValueAndValidity();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients.set(clients);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.compteForm.invalid) {
      this.compteForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const request: CreateCompteRequest = {
      type: this.compteForm.value.type,
      clientId: this.compteForm.value.clientId,
      decouvertAutorise: this.compteForm.value.type === TypeCompte.COURANT
        ? this.compteForm.value.decouvertAutorise
        : undefined,
      tauxInteret: this.compteForm.value.type === TypeCompte.EPARGNE
        ? this.compteForm.value.tauxInteret
        : undefined
    };

    this.compteService.createCompte(request).subscribe({
      next: (compte) => {
        this.router.navigate(['/comptes', compte.id]);
      },
      error: (err) => {
        this.error.set('Erreur lors de la création du compte');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.compteForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.compteForm.get(fieldName);
    if (field?.hasError('required')) return 'Ce champ est obligatoire';
    if (field?.hasError('min')) return `Valeur minimale: ${field.errors?.['min'].min}`;
    if (field?.hasError('max')) return `Valeur maximale: ${field.errors?.['max'].max}`;
    return '';
  }

  isCourant(): boolean {
    return this.compteForm.get('type')?.value === TypeCompte.COURANT;
  }

  isEpargne(): boolean {
    return this.compteForm.get('type')?.value === TypeCompte.EPARGNE;
  }
}
