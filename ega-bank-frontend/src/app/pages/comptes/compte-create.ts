import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompteService } from '../../services/compte.service';
import { ClientService } from '../../services/client.service';
import { CreateCompteRequest } from '../../models/compte.model';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-compte-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './compte-create.html',
  styleUrl: './compte-create.css',
})
export class CompteCreate implements OnInit {
  compte: CreateCompteRequest = {
    clientId: 0,
    typeCompte: 'COURANT',
    soldeInitial: 0
  };

  clients: Client[] = [];
  loading = false;
  error = '';

  constructor(
    private compteService: CompteService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des clients';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.compte.clientId === 0) {
      this.error = 'Veuillez sélectionner un client';
      return;
    }

    this.loading = true;
    this.error = '';

    this.compteService.createCompte(this.compte).subscribe({
      next: () => {
        this.router.navigate(['/comptes']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création du compte';
        this.loading = false;
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/comptes']);
  }
}
