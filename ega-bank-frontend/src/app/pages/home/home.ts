import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { CompteService } from '../../services/compte.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Données du tableau de bord
  totalClients = 0;
  totalComptes = 0;
  totalTransactions = 0;

  constructor(
    private clientService: ClientService,
    private compteService: CompteService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Charger le nombre de clients
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.totalClients = data.length;
      },
      error: (err) => console.error('Erreur chargement clients:', err)
    });

    // Charger le nombre de comptes
    this.compteService.getAllComptes().subscribe({
      next: (data) => {
        this.totalComptes = data.length;
      },
      error: (err) => console.error('Erreur chargement comptes:', err)
    });

    // Charger le nombre de transactions
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.totalTransactions = data.length;
      },
      error: (err) => console.error('Erreur chargement transactions:', err)
    });
  }
}
