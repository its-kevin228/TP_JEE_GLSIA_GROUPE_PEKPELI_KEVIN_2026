import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Clients } from './pages/clients/clients';
import { ClientCreate } from './pages/clients/client-create';
import { Comptes } from './pages/comptes/comptes';
import { CompteCreate } from './pages/comptes/compte-create';
import { Transactions } from './pages/transactions/transactions';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'clients', component: Clients },
  { path: 'clients/create', component: ClientCreate },
  { path: 'comptes', component: Comptes },
  { path: 'comptes/create', component: CompteCreate },
  { path: 'transactions', component: Transactions },
];
