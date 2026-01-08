import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Données du tableau de bord (pour l'instant en dur, plus tard depuis l'API)
  totalClients = 0;
  totalComptes = 0;
  totalTransactions = 0;
}
