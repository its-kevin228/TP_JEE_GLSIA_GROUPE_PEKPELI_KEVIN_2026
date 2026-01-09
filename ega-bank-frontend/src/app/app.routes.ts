import { Routes } from '@angular/router';
import { ClientListComponent } from './features/clients/client-list/client-list.component';
import { ClientFormComponent } from './features/clients/client-form/client-form.component';
import { ClientDetailComponent } from './features/clients/client-detail/client-detail.component';
import { CompteListComponent } from './features/comptes/compte-list/compte-list.component';
import { CompteFormComponent } from './features/comptes/compte-form/compte-form.component';
import { CompteDetailComponent } from './features/comptes/compte-detail/compte-detail.component';
import { TransactionOperationComponent } from './features/transactions/transaction-operation/transaction-operation.component';

export const routes: Routes = [
  { path: '', redirectTo: '/clients', pathMatch: 'full' },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/new', component: ClientFormComponent },
  { path: 'clients/:id', component: ClientDetailComponent },
  { path: 'clients/:id/edit', component: ClientFormComponent },
  { path: 'comptes', component: CompteListComponent },
  { path: 'comptes/new', component: CompteFormComponent },
  { path: 'comptes/:id', component: CompteDetailComponent },
  { path: 'transactions', component: TransactionOperationComponent },
  { path: '**', redirectTo: '/clients' }
];
