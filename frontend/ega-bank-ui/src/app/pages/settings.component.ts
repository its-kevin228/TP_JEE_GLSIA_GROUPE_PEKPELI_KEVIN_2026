import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientResponse } from '../models/client.model';
import { ClientService, ProfileUpdateRequest } from '../services/client.service';
import { AuthService } from '../services/auth.service';

@Component({
    standalone: true,
    selector: 'app-settings',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-6 max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p class="text-gray-500">Manage your account preferences and security settings.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Sidebar Navigation (within settings) -->
        <div class="md:col-span-1">
          <div class="card p-2 sticky top-24">
            <button
              *ngIf="!isAdmin"
              (click)="activeTab = 'profile'"
              [class.bg-blue-50]="activeTab === 'profile'"
              [class.text-primary]="activeTab === 'profile'"
              class="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors hover:bg-gray-50 mb-1">
              <i class="ri-user-settings-line text-xl"></i>
              <span class="font-medium">Profile Settings</span>
            </button>
            <button
              (click)="activeTab = 'security'"
              [class.bg-blue-50]="activeTab === 'security'"
              [class.text-primary]="activeTab === 'security'"
              class="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors hover:bg-gray-50">
              <i class="ri-shield-key-line text-xl"></i>
              <span class="font-medium">Security</span>
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="md:col-span-2 space-y-6">

          <!-- Profile Tab -->
          <div *ngIf="!isAdmin && activeTab === 'profile'" class="space-y-6 animate-fade-in">

            <!-- Avatar Section Card -->
            <div class="card p-6">
              <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
                <i class="ri-image-line text-primary"></i> Photo de profil
              </h2>

              <div class="flex flex-col sm:flex-row items-center gap-6">
                <!-- Avatar Preview -->
                <div class="relative">
                  <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                    <img *ngIf="avatarPreview" [src]="avatarPreview" alt="Avatar" class="w-full h-full object-cover" />
                    <div *ngIf="!avatarPreview" class="w-full h-full flex items-center justify-center text-gray-400">
                      <i class="ri-user-3-line text-5xl"></i>
                    </div>
                  </div>
                  <button
                    (click)="avatarInput.click()"
                    class="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-600 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                    <i class="ri-camera-line"></i>
                  </button>
                  <input
                    #avatarInput
                    type="file"
                    accept="image/*"
                    class="hidden"
                    (change)="onAvatarSelected($event)" />
                </div>

                <!-- Avatar Actions -->
                <div class="flex-1 text-center sm:text-left">
                  <h3 class="font-semibold text-gray-800">{{ profile?.nomComplet || 'Votre nom' }}</h3>
                  <p class="text-sm text-gray-500 mb-4">{{ profile?.courriel || '---' }}</p>

                  <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button (click)="avatarInput.click()" class="btn btn-primary text-sm">
                      <i class="ri-upload-2-line"></i> Changer la photo
                    </button>
                    <button *ngIf="avatarPreview" (click)="removeAvatar()" class="btn btn-secondary text-sm">
                      <i class="ri-delete-bin-line"></i> Supprimer
                    </button>
                  </div>
                  <p class="text-xs text-gray-400 mt-3">JPG, PNG ou GIF. Max 2MB.</p>
                </div>
              </div>
            </div>

            <!-- Personal Information Card -->
            <div class="card p-6">
              <div *ngIf="isLoading" class="text-sm text-gray-500 mb-4">
                <i class="ri-loader-4-line animate-spin"></i> Chargement du profil...
              </div>
              <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
                <i class="ri-user-line text-primary"></i> Informations personnelles
              </h2>

              <form class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1.5">Prénom</label>
                    <input type="text" class="input w-full" [value]="profile?.prenom || ''" readonly />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1.5">Nom</label>
                    <input type="text" class="input w-full" [value]="profile?.nom || ''" readonly />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1.5">Adresse e-mail</label>
                  <div class="input-icon-wrapper">
                    <i class="ri-mail-line input-icon"></i>
                    <input type="email" class="input-with-icon" [value]="profile?.courriel || ''" readonly />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Contactez le support pour modifier votre e-mail.</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1.5">Numéro de téléphone</label>
                  <div class="input-icon-wrapper">
                    <i class="ri-phone-line input-icon"></i>
                    <input type="tel" class="input-with-icon" [(ngModel)]="phoneNumber" name="phone" placeholder="+228 00 00 00 00" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1.5">Adresse</label>
                  <div class="input-icon-wrapper">
                    <i class="ri-map-pin-line input-icon"></i>
                    <input type="text" class="input-with-icon" [(ngModel)]="address" name="address" placeholder="Votre adresse" />
                  </div>
                </div>

                <div class="pt-4 border-t flex justify-end">
                  <button type="button" class="btn btn-primary" (click)="saveProfile()" [disabled]="isSaving">
                    <i *ngIf="!isSaving" class="ri-save-line"></i>
                    <i *ngIf="isSaving" class="ri-loader-4-line animate-spin"></i>
                    {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Security Tab -->
          <div *ngIf="activeTab === 'security'" class="card p-6 animate-fade-in">
             <h2 class="text-lg font-bold mb-6 flex items-center gap-2">
              <i class="ri-lock-password-line text-primary"></i> Mot de passe & Sécurité
            </h2>

            <form class="space-y-4" (ngSubmit)="updatePassword()">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1.5">Mot de passe actuel</label>
                <div class="input-icon-wrapper">
                  <i class="ri-lock-line input-icon"></i>
                  <input type="password" class="input-with-icon" placeholder="Entrez votre mot de passe actuel" [(ngModel)]="passwordForm.currentPassword" name="currentPassword" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1.5">Nouveau mot de passe</label>
                  <div class="input-icon-wrapper">
                    <i class="ri-lock-password-line input-icon"></i>
                    <input type="password" class="input-with-icon" placeholder="Nouveau mot de passe" [(ngModel)]="passwordForm.newPassword" name="newPassword" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1.5">Confirmer le mot de passe</label>
                  <div class="input-icon-wrapper">
                    <i class="ri-lock-password-line input-icon"></i>
                    <input type="password" class="input-with-icon" placeholder="Confirmez le mot de passe" [(ngModel)]="passwordForm.confirmPassword" name="confirmPassword" />
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg text-sm flex gap-3 items-start my-4">
                <i class="ri-information-line text-lg text-gray-500 mt-0.5"></i>
                <div class="text-gray-600">
                  <p class="font-medium text-gray-700">Exigences du mot de passe :</p>
                  <ul class="list-disc list-inside mt-1 space-y-1">
                    <li>Minimum 8 caractères</li>
                    <li>Au moins une lettre majuscule</li>
                    <li>Au moins un chiffre</li>
                    <li>Au moins un caractère spécial</li>
                  </ul>
                </div>
              </div>

              <div class="pt-2 flex justify-end">
                <button type="submit" class="btn btn-primary">
                  <i class="ri-refresh-line"></i> Mettre à jour
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  `,
    styles: [`
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .input {
      width: 100%;
      padding: 0.625rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      outline: none;
      background: white;
      transition: all 0.2s;
    }
    .input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .input:read-only {
      background: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }
    .input-icon-wrapper {
      display: flex;
      align-items: center;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      background: white;
      overflow: hidden;
      transition: all 0.2s;
    }
    .input-icon-wrapper:focus-within {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .input-icon-wrapper:has(input:read-only) {
      background: #f9fafb;
    }
    .input-icon {
      padding: 0 0.75rem;
      color: #9ca3af;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
    }
    .input-with-icon {
      flex: 1;
      padding: 0.625rem 1rem 0.625rem 0;
      border: none;
      outline: none;
      background: transparent;
      width: 100%;
    }
    .input-with-icon:read-only {
      color: #6b7280;
      cursor: not-allowed;
    }
  `]
})
export class SettingsComponent implements OnInit {
    activeTab: 'profile' | 'security' = 'profile';
    isSaving = false;
    isLoading = false;
    profile: ClientResponse | null = null;
    avatarPreview: string | null = null;
    avatarFile: File | null = null;
    phoneNumber = '';
    address = '';

    passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    constructor(
        private clientService: ClientService,
        private auth: AuthService,
        private cdr: ChangeDetectorRef
    ) {}

    get isAdmin(): boolean {
      return this.auth.isAdmin();
    }

    ngOnInit(): void {
        if (this.isAdmin) {
            this.activeTab = 'security';
        } else {
            this.loadProfile();
        }
    }

    loadProfile() {
        this.isLoading = true;
        this.clientService.getMe().subscribe({
            next: (profile) => {
                this.profile = profile;
                // Charger les données depuis le profil (base de données)
                this.phoneNumber = profile.telephone || '';
                this.address = profile.adresse || '';
                if (profile.avatar) {
                    this.avatarPreview = profile.avatar;
                }
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    onAvatarSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];

            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Le fichier est trop volumineux. Maximum 2MB.');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Veuillez sélectionner une image valide.');
                return;
            }

            this.avatarFile = file;

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                this.avatarPreview = e.target?.result as string;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        }
    }

    removeAvatar() {
        this.avatarPreview = null;
        this.avatarFile = null;
    }

    saveProfile() {
        this.isSaving = true;

        const payload: ProfileUpdateRequest = {
            telephone: this.phoneNumber,
            adresse: this.address,
            avatar: this.avatarPreview || undefined
        };

        this.clientService.updateProfile(payload).subscribe({
            next: (updatedProfile) => {
                this.profile = updatedProfile;
                this.isSaving = false;
                alert('Profil mis à jour avec succès !');
            },
            error: (err) => {
                this.isSaving = false;
                console.error('Profile update failed', err);
                alert(err.error?.message || 'Échec de la mise à jour du profil.');
            }
        });
    }

    updatePassword() {
        if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        this.auth.changePassword({
            currentPassword: this.passwordForm.currentPassword,
            newPassword: this.passwordForm.newPassword
        }).subscribe({
            next: () => {
                localStorage.setItem('mustChangePassword', 'false');
                this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
                alert('Mot de passe mis à jour avec succès !');
            },
            error: (err) => {
                console.error('Password update failed', err);
                alert(err.error?.message || 'Échec de la mise à jour du mot de passe.');
            }
        });
    }
}
