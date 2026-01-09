import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, OperationRequest, VirementRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  deposer(request: OperationRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/depot`, request);
  }

  retirer(request: OperationRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/retrait`, request);
  }

  virement(request: VirementRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/virement`, request);
  }

  getTransactionsByCompte(numeroCompte: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/compte/${numeroCompte}`);
  }

  getTransactionsByPeriode(
    numeroCompte: string,
    dateDebut: string,
    dateFin: string
  ): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);
    return this.http.get<Transaction[]>(
      `${this.apiUrl}/compte/${numeroCompte}/periode`,
      { params }
    );
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }
}
