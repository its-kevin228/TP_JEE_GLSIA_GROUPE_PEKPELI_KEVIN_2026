import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compte, CreateCompteRequest } from '../models/compte.model';

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  private apiUrl = 'http://localhost:8080/api/comptes';

  constructor(private http: HttpClient) {}

  getAllComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(this.apiUrl);
  }

  getCompteById(id: number): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/${id}`);
  }

  getComptesByClientId(clientId: number): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/client/${clientId}`);
  }

  createCompte(request: CreateCompteRequest): Observable<Compte> {
    return this.http.post<Compte>(this.apiUrl, request);
  }

  deleteCompte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
