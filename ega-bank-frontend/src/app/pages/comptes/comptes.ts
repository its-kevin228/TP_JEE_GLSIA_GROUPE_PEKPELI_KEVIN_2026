import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompteService } from '../../services/compte.service';
import { Compte } from '../../models/compte.model';

@Component({
  selector: 'app-comptes',
  imports: [CommonModule, RouterLink],
  templateUrl: './comptes.html',
  styleUrl: './comptes.css',
})
export class Comptes implements OnInit {
  comptes: Compte[] = [];
  loading = false;
  error = '';

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.loading = true;
    this.compteService.getAllComptes().subscribe({
      next: (data) => {
        this.comptes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des comptes';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteCompte(id: number | undefined): void {
    if (!id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      this.compteService.deleteCompte(id).subscribe({
        next: () => {
          this.loadComptes();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
  }

  getTypeBadgeClass(type: string): string {
    return type === 'COURANT'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  }
}
