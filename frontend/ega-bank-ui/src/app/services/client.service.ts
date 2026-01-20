import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClientRequest, ClientResponse } from '../models/client.model';
import { PageResponse } from '../models/page.model';
import { ApiService } from './api.service';

export interface ProfileUpdateRequest {
  telephone?: string;
  adresse?: string;
  avatar?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly meSubject = new BehaviorSubject<ClientResponse | null>(null);
  readonly me$ = this.meSubject.asObservable();

  constructor(private api: ApiService) {}

  getAll(page = 0, size = 10): Observable<PageResponse<ClientResponse>> {
    return this.api.get<PageResponse<ClientResponse>>(`/clients`, { page, size });
  }

  search(q: string, page = 0, size = 10): Observable<PageResponse<ClientResponse>> {
    return this.api.get<PageResponse<ClientResponse>>(`/clients/search`, { q, page, size });
  }

  getById(id: number): Observable<ClientResponse> {
    return this.api.get<ClientResponse>(`/clients/${id}`);
  }

  getWithAccounts(id: number): Observable<ClientResponse> {
    return this.api.get<ClientResponse>(`/clients/${id}/details`);
  }

  getMe(): Observable<ClientResponse> {
    return this.api.get<ClientResponse>(`/clients/me`).pipe(
      tap((me) => this.meSubject.next(me))
    );
  }

  updateProfile(payload: ProfileUpdateRequest): Observable<ClientResponse> {
    return this.api.put<ClientResponse>(`/clients/me`, payload).pipe(
      tap((me) => this.meSubject.next(me))
    );
  }

  create(payload: ClientRequest): Observable<ClientResponse> {
    return this.api.post<ClientResponse>(`/clients`, payload);
  }

  update(id: number, payload: ClientRequest): Observable<ClientResponse> {
    return this.api.put<ClientResponse>(`/clients/${id}`, payload);
  }

  delete(id: number): Observable<any> {
    return this.api.delete(`/clients/${id}`);
  }
}
