import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService, CompteService } from '../../../api/services';
import { Client, Compte } from '../../../api/models';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
  client = signal<Client | null>(null);
  comptes = signal<Compte[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private clientService: ClientService,
    private compteService: CompteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClient(+id);
      this.loadComptes(+id);
    }
  }

  loadClient(id: number): void {
    this.loading.set(true);
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.client.set(client);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du client');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  loadComptes(clientId: number): void {
    this.compteService.getComptesByClientId(clientId).subscribe({
      next: (comptes) => {
        this.comptes.set(comptes);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes:', err);
      }
    });
  }

  getTotalSolde(): number {
    return this.comptes().reduce((sum, compte) => sum + compte.solde, 0);
  }
}
