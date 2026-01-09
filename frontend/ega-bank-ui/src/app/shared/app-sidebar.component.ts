import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app-sidebar.component.html',
  styles: [`
    :host { display: block; height: 100vh; position: sticky; top: 0; }
  `]
})
export class AppSidebar {
  navItems = [
    { label: 'Dashboard', href: '/', icon: 'ri-dashboard-line' },
    { label: 'Clients', href: '/clients', icon: 'ri-user-line' },
    { label: 'Accounts', href: '/accounts', icon: 'ri-bank-card-line' },
    { label: 'Transactions', href: '/transactions', icon: 'ri-exchange-dollar-line' },
  ];

  constructor(private router: Router, private auth: AuthService) { }

  navigate(href: string) {
    this.router.navigateByUrl(href);
  }

  logout() {
    this.auth.logout();
  }
}
