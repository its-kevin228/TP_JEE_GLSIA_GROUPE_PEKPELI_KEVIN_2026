import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  /**
   * Activer un compte utilisateur
   */
  activate(userId: number): Observable<any> {
    return this.api.put(`/users/${userId}/activate`, null);
  }

  /**
   * Désactiver un compte utilisateur
   */
  deactivate(userId: number): Observable<any> {
    return this.api.put(`/users/${userId}/deactivate`, null);
  }

  /**
   * Récupérer les comptes en attente de validation
   */
  getPendingUsers(): Observable<any[]> {
    return this.api.get('/users/pending');
  }
}
