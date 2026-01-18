import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ClientGuard } from './guards/client.guard';
import { AuthService } from './services/auth.service';
import { AccountCreateComponent } from './pages/account-create.component';
import { AccountsComponent } from './pages/accounts.component';
import { ClientCreateComponent } from './pages/client-create.component';
import { ClientsComponent } from './pages/clients.component';
import { DashboardComponent } from './pages/dashboard.component';
import { LoginComponent } from './pages/login.component';
import { SettingsComponent } from './pages/settings.component';
import { TransactionFormComponent } from './pages/transaction-form.component';
import { TransactionsComponent } from './pages/transactions.component';
import { LandingComponent } from './pages/landing.component';

export const routes: Routes = [
	// Routes publiques
	{ path: '', component: LandingComponent },
	{ path: 'login', component: LoginComponent },

	// Routes ADMIN uniquement (gestion des clients et comptes pour tous)
	{
		path: 'admin',
		canActivate: [AdminGuard],
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'clients', component: ClientsComponent },
			{ path: 'clients/new', component: ClientCreateComponent },
			{ path: 'accounts', component: AccountsComponent },
			{ path: 'accounts/new', component: AccountCreateComponent },
			{ path: 'transactions', component: TransactionsComponent },
			{ path: 'settings', component: SettingsComponent },
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
		]
	},

	// Routes CLIENT uniquement (consultation et transactions propres)
	{
		path: 'client',
		canActivate: [ClientGuard],
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'accounts', component: AccountsComponent },
			{ path: 'transactions', component: TransactionsComponent },
			{ path: 'transactions/new', component: TransactionFormComponent },
			{ path: 'settings', component: SettingsComponent },
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
		]
	},

	// Route wildcard vers landing
	{ path: '**', redirectTo: '', pathMatch: 'full' },
];
