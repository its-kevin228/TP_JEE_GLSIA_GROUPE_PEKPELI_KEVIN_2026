import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class StatementService {
  constructor(private api: ApiService) {}

  downloadStatement(numeroCompte: string, debut: string, fin: string): Observable<Blob> {
    return this.api.getBlob(`/statements/${encodeURIComponent(numeroCompte)}`, {
      debut,
      fin
    });
  }
}
