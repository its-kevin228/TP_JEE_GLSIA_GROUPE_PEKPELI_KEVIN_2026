import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card p-6" style="max-width: 600px; margin: 0 auto;">
      <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Edit Client' : 'Create Client' }}</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input formControlName="nom" class="w-full p-2 border rounded" />
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input formControlName="prenom" class="w-full p-2 border rounded" />
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
            <input type="date" formControlName="dateNaissance" class="w-full p-2 border rounded" />
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Sex</label>
            <select formControlName="sexe" class="w-full p-2 border rounded">
            <option value="MASCULIN">Male</option>
            <option value="FEMININ">Female</option>
            </select>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input formControlName="telephone" class="w-full p-2 border rounded" />
        </div>
        <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input formControlName="courriel" class="w-full p-2 border rounded" />
        </div>
        <div class="flex gap-4">
          <button type="button" routerLink="/clients" class="btn btn-secondary flex-1">Cancel</button>
          <button type="submit" [disabled]="form.invalid || isLoading" class="btn btn-primary flex-1">
            {{ isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ClientCreateComponent implements OnInit {
  form: any;
  isEditMode = false;
  clientId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: [new Date().toISOString().split('T')[0], Validators.required],
      sexe: ['MASCULIN', Validators.required],
      telephone: [''],
      courriel: ['', Validators.email],
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.clientId = +id;
        this.loadClientData(this.clientId);
      }
    });
  }

  loadClientData(id: number) {
    this.isLoading = true;
    this.clientService.getById(id).subscribe({
      next: (client) => {
        this.form.patchValue({
          nom: client.nom,
          prenom: client.prenom,
          dateNaissance: client.dateNaissance,
          sexe: client.sexe,
          telephone: client.telephone,
          courriel: client.courriel
        });
        this.isLoading = false;
      },
      error: () => {
        alert('Failed to load client data');
        this.router.navigate(['/clients']);
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    const payload = this.form.value;

    if (this.isEditMode && this.clientId) {
      this.clientService.update(this.clientId, payload).subscribe({
        next: () => this.router.navigateByUrl('/clients'),
        error: (err) => {
          console.error('Update failed', err);
          this.isLoading = false;
        }
      });
    } else {
      this.clientService.create(payload).subscribe({
        next: () => this.router.navigateByUrl('/clients'),
        error: (err) => {
          console.error('Create failed', err);
          this.isLoading = false;
        }
      });
    }
  }
}
