import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

interface PendingUser {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  clientId?: number;
}

@Component({
  selector: 'app-pending-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2">Pending User Activations</h1>
        <p class="text-gray-500">Review and activate new user accounts waiting for approval.</p>
      </div>

      <!-- Stats Card -->
      <div *ngIf="!isLoading" class="card p-4 mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <i class="ri-user-add-line text-2xl text-orange-600"></i>
          </div>
          <div>
            <div class="text-2xl font-bold text-orange-900">{{ pendingUsers.length }}</div>
            <div class="text-sm text-orange-700">Accounts waiting for activation</div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage && !isLoading" class="alert alert-danger mb-4">
        <i class="ri-error-warning-line"></i> {{ errorMessage }}
        <button (click)="loadPendingUsers()" class="btn btn-sm btn-secondary ml-2">
          <i class="ri-refresh-line"></i> Retry
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="space-y-4">
        <div *ngFor="let i of [1,2,3]" class="card p-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="skeleton skeleton-text" style="width: 40%; height: 1.25rem; margin-bottom: 0.5rem;"></div>
              <div class="skeleton skeleton-text" style="width: 60%;"></div>
            </div>
            <div class="skeleton" style="width: 100px; height: 36px; border-radius: 6px;"></div>
          </div>
        </div>
      </div>

      <!-- Pending Users List -->
      <div *ngIf="!isLoading && pendingUsers.length > 0" class="space-y-4">
        <div *ngFor="let user of pendingUsers" class="card p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <i class="ri-user-line text-xl text-gray-600"></i>
                </div>
                <div>
                  <div class="font-semibold text-lg">{{ user.username }}</div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </div>
              </div>
              <div class="flex items-center gap-4 text-sm text-gray-600 ml-13">
                <span class="flex items-center gap-1">
                  <i class="ri-shield-user-line"></i> {{ user.role }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="ri-calendar-line"></i> {{ formatDate(user.createdAt) }}
                </span>
                <span *ngIf="user.clientId" class="flex items-center gap-1">
                  <i class="ri-user-follow-line"></i> Client ID: {{ user.clientId }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                (click)="viewClient(user.clientId)"
                *ngIf="user.clientId"
                class="btn btn-secondary text-sm"
                title="View client details">
                <i class="ri-eye-line"></i> View
              </button>
              <button
                (click)="activateUser(user)"
                class="btn btn-success text-sm">
                <i class="ri-check-line"></i> Activate
              </button>
              <button
                (click)="rejectUser(user)"
                class="btn btn-danger text-sm"
                title="Reject and delete">
                <i class="ri-close-line"></i> Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && pendingUsers.length === 0" class="text-center py-12">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ri-checkbox-circle-line text-4xl text-green-600"></i>
        </div>
        <h3 class="text-xl font-semibold mb-2">All Clear!</h3>
        <p class="text-gray-500">No pending user activations at the moment.</p>
      </div>
    </div>
  `,
  styles: [`
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    .ml-13 {
      margin-left: 3.25rem;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
    .status-badge.pending {
      background-color: #fef3c7;
      color: #92400e;
    }
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s ease-in-out infinite;
    }
    .skeleton-text {
      height: 0.875rem;
      border-radius: 4px;
    }
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class PendingUsersComponent implements OnInit {
  pendingUsers: PendingUser[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getPendingUsers().subscribe({
      next: (users) => {
        this.pendingUsers = users;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load pending users', err);
        this.errorMessage = 'Failed to load pending users. Please try again.';
        this.isLoading = false;
      }
    });
  }

  activateUser(user: PendingUser): void {
    if (!confirm(`Activate account for ${user.username}?`)) return;

    this.userService.activate(user.id).subscribe({
      next: () => {
        alert(`Account activated successfully for ${user.username}`);
        this.loadPendingUsers(); // Reload list
      },
      error: (err) => {
        console.error('Failed to activate user', err);
        alert('Failed to activate account. Please try again.');
      }
    });
  }

  rejectUser(user: PendingUser): void {
    if (!confirm(`Are you sure you want to reject and delete the account for ${user.username}? This action cannot be undone.`)) return;

    // TODO: Implémenter la suppression d'utilisateur si nécessaire
    alert('Rejection feature not yet implemented. Please contact support.');
  }

  viewClient(clientId?: number): void {
    if (!clientId) return;
    this.router.navigate(['/admin/clients/new'], { queryParams: { id: clientId } });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}
