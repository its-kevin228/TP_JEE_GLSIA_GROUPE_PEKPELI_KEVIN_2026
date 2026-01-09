import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompteService } from '../../../api/services';
import { Compte } from '../../../api/models';

@Component({
  selector: 'app-compte-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './compte-list.component.html',
  styleUrls: ['./compte-list.component.css']
})
export class CompteListComponent implements OnInit {
  comptes = signal<Compte[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.loading.set(true);
    this.error.set(null);
    this.compteService.getAllComptes().subscribe({
      next: (comptes) => {
        this.comptes.set(comptes);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des comptes');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  deleteCompte(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      return;
    }

    this.compteService.deleteCompte(id).subscribe({
      next: () => {
        this.loadComptes();
      },
      error: (err) => {
        this.error.set('Erreur lors de la suppression du compte');
        console.error(err);
      }
    });
  }

  getTotalSolde(): number {
    return this.comptes().reduce((sum, compte) => sum + compte.solde, 0);
  }
}
