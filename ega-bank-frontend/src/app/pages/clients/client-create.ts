import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './client-create.html',
  styleUrl: './client-create.css',
})
export class ClientCreate {
  client: Client = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: ''
  };

  loading = false;
  error = '';

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.clientService.createClient(this.client).subscribe({
      next: () => {
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création du client';
        this.loading = false;
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/clients']);
  }
}
