import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../api/services';
import { Client } from '../../../api/models';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  isEditMode = signal(false);
  clientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId = +id;
      this.isEditMode.set(true);
      this.loadClient(this.clientId);
    }
  }

  initForm(): void {
    this.clientForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateNaissance: ['', Validators.required],
      sexe: ['M', Validators.required],
      adresse: ['', [Validators.required, Validators.maxLength(200)]],
      telephone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadClient(id: number): void {
    this.loading.set(true);
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.clientForm.patchValue(client);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du client');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const client: Client = this.clientForm.value;

    const request = this.isEditMode()
      ? this.clientService.updateClient(this.clientId!, client)
      : this.clientService.createClient(client);

    request.subscribe({
      next: () => {
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        this.error.set('Erreur lors de l\'enregistrement du client');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (field?.hasError('required')) return 'Ce champ est obligatoire';
    if (field?.hasError('minlength')) return `Minimum ${field.errors?.['minlength'].requiredLength} caractères`;
    if (field?.hasError('maxlength')) return `Maximum ${field.errors?.['maxlength'].requiredLength} caractères`;
    if (field?.hasError('email')) return 'Email invalide';
    if (field?.hasError('pattern')) return 'Format invalide';
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }
}
