import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, OperationRequest, VirementRequest } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getTransactionsByCompteId(compteId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/compte/${compteId}`);
  }

  depot(request: OperationRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/depot`, request);
  }

  retrait(request: OperationRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/retrait`, request);
  }

  virement(request: VirementRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/virement`, request);
  }
}
