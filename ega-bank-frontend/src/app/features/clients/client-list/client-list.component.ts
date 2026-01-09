import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../api/services';
import { Client } from '../../../api/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients = signal<Client[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchQuery = signal('');

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading.set(true);
    this.error.set(null);
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des clients');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  searchClients(): void {
    const query = this.searchQuery();
    if (!query.trim()) {
      this.loadClients();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.clientService.searchClients(query).subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors de la recherche');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  deleteClient(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      return;
    }

    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.loadClients();
      },
      error: (err) => {
        this.error.set('Erreur lors de la suppression du client');
        console.error(err);
      }
    });
  }
}
