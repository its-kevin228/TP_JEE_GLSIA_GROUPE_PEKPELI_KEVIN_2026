import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compte, CreateCompteRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  private readonly apiUrl = `${environment.apiUrl}/comptes`;

  constructor(private http: HttpClient) {}

  createCompte(request: CreateCompteRequest): Observable<Compte> {
    return this.http.post<Compte>(this.apiUrl, request);
  }

  getCompteById(id: number): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/${id}`);
  }

  getCompteByNumero(numeroCompte: string): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/numero/${numeroCompte}`);
  }

  getAllComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(this.apiUrl);
  }

  getComptesByClientId(clientId: number): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/client/${clientId}`);
  }

  deleteCompte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
