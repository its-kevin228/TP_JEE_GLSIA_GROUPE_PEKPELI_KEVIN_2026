import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app-sidebar.component.html',
  styles: [`
    :host { display: block; height: 100vh; position: sticky; top: 0; }
  `]
})
export class AppSidebar implements OnInit {
  navItems: NavItem[] = [];
  isAdmin = false;

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.isAdmin = this.auth.isAdmin();
    this.loadNavItems();
  }

  loadNavItems() {
    if (this.isAdmin) {
      // Navigation pour ADMIN
      this.navItems = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: 'ri-dashboard-line' },
        { label: 'Clients', href: '/admin/clients', icon: 'ri-user-line' },
        { label: 'Accounts', href: '/admin/accounts', icon: 'ri-bank-card-line' },
        { label: 'Historique Transaction', href: '/admin/transactions', icon: 'ri-exchange-dollar-line' },
      ];
    } else {
      // Navigation pour CLIENT
      this.navItems = [
        { label: 'Dashboard', href: '/client/dashboard', icon: 'ri-dashboard-line' },
        { label: 'My Accounts', href: '/client/accounts', icon: 'ri-bank-card-line' },
        { label: 'Transactions', href: '/client/transactions', icon: 'ri-exchange-dollar-line' },
      ];
    }
  }

  navigate(href: string) {
    this.router.navigateByUrl(href);
  }

  logout() {
    this.auth.logout();
  }
}
