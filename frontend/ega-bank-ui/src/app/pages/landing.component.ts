import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Navigation -->
      <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div class="max-w-6xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <a routerLink="/" class="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
            <img src="/assets/logoega.png" alt="EGA Bank" class="h-12 md:h-16 w-auto" />
            <span class="text-lg md:text-xl font-semibold text-slate-800">Ega Bank</span>
          </a>

          <div class="flex items-center gap-4 md:gap-6">
            <span class="hidden lg:inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">v1.0.0</span>

            <div class="flex items-center gap-3">
              <span class="px-4 py-2 text-slate-600 text-sm font-medium">
                Contactez un administrateur
              </span>
              <button
                (click)="goToLogin()"
                class="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 overflow-hidden bg-white">
        <div class="absolute inset-0 hero-glow"></div>

        <!-- Geometric Patterns -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <!-- Grid Pattern -->
          <div class="absolute inset-0 opacity-[0.02]">
            <div class="absolute inset-0" style="background-image: linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px); background-size: 50px 50px;"></div>
          </div>

          <!-- Circles -->
          <div class="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
          <div class="absolute top-1/2 -right-32 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-16 left-1/3 w-64 h-64 bg-gradient-to-br from-cyan-50/40 to-blue-50/40 rounded-full blur-2xl"></div>

          <!-- Geometric Shapes -->
          <svg class="absolute top-20 left-10 w-24 h-24 text-cyan-200/20" fill="none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="2" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" stroke-width="2" />
          </svg>

          <svg class="absolute bottom-32 right-20 w-32 h-32 text-blue-200/20" fill="none" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" stroke="currentColor" stroke-width="2" transform="rotate(45 50 50)" />
          </svg>

          <svg class="absolute top-1/3 right-1/4 w-20 h-20 text-purple-200/20" fill="none" viewBox="0 0 100 100">
            <polygon points="50,10 90,90 10,90" stroke="currentColor" stroke-width="2" />
          </svg>

          <!-- Dots Pattern -->
          <div class="absolute top-40 left-1/4 flex gap-3">
            <div class="w-2 h-2 bg-cyan-300/30 rounded-full"></div>
            <div class="w-2 h-2 bg-blue-300/30 rounded-full"></div>
            <div class="w-2 h-2 bg-cyan-300/30 rounded-full"></div>
          </div>

          <div class="absolute bottom-40 right-1/3 flex gap-3 rotate-90">
            <div class="w-2 h-2 bg-blue-300/30 rounded-full"></div>
            <div class="w-2 h-2 bg-purple-300/30 rounded-full"></div>
            <div class="w-2 h-2 bg-blue-300/30 rounded-full"></div>
          </div>
        </div>

        <div class="max-w-6xl mx-auto relative text-center">
          <div class="flex justify-center mb-10">
            <span class="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-300/40 text-cyan-600 text-sm font-semibold rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
              </svg>
              <span class="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">TP Java EE • Année 2025-2026</span>
            </span>
          </div>

          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4 md:mb-6 leading-tight">
            Gestion bancaire<br class="hidden md:block">nouvelle génération.
          </h1>

          <p class="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed px-4">
            Une architecture distribuée robuste pour la gestion des comptes clients, transactions sécurisées et conformité bancaire. Propulsé par Java EE, Spring Boot et Angular.
          </p>

          <div class="flex flex-wrap gap-4 justify-center">
            <div
              class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Accès sur invitation admin
            </div>
            <button
              (click)="goToLogin()"
              class="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Se connecter
            </button>
            <a
              href="https://github.com/its-kevin228/TP_JEE_GLSIA_GROUPE_PEKPELI_KEVIN_2026"
              target="_blank"
              class="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Code source
            </a>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="fonctionnalites" class="relative py-16 md:py-20 px-4 md:px-6 bg-white overflow-hidden">
        <!-- Subtle Background Pattern -->
        <div class="absolute inset-0 opacity-[0.015]">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle, #64748b 1px, transparent 1px); background-size: 30px 30px;"></div>
        </div>

        <div class="max-w-6xl mx-auto relative">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-slate-900 mb-4">Fonctionnalités</h2>
            <p class="text-slate-600">Système bancaire complet et sécurisé</p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="group p-8 bg-white rounded-xl border border-slate-200 hover:border-cyan-400 hover:shadow-lg transition-all duration-300">
              <div class="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-3">Comptes & Clients</h3>
              <p class="text-slate-600 leading-relaxed">
                Gestion centralisée des profils clients (KYC) et structure multi-comptes (Épargne & Courant) avec historique détaillé.
              </p>
            </div>

            <div class="group p-8 bg-white rounded-xl border border-slate-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-3">Sécurité</h3>
              <p class="text-slate-600 leading-relaxed">
                Authentification JWT robuste, rôles ADMIN/CLIENT, validation des comptes par administrateur, validation des contraintes métier et auditabilité complète.
              </p>
            </div>

            <div class="group p-8 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-3">Transactions</h3>
              <p class="text-slate-600 leading-relaxed">
                Opérations RETRAIT, VERSEMENT et VIREMENT avec traçabilité, validation des soldes et gestion des erreurs en temps réel.
              </p>
            </div>

            <div class="group p-8 bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300">
              <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-3">Reporting</h3>
              <p class="text-slate-600 leading-relaxed">
                Tableaux de bord dynamiques, statistiques en temps réel, pagination et filtres avancés pour analyses métier.
              </p>
            </div>

            <div class="group p-8 bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300">
              <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-3">Validation Sécurisée</h3>
              <p class="text-slate-600 leading-relaxed">
                Inscription publique avec validation par administrateur. Les comptes sont créés en attente et activés après vérification pour garantir la sécurité.
              </p>
            </div>

            <div class="group p-8 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-3">Relevés PDF</h3>
              <p class="text-slate-600 leading-relaxed">
                Génération automatique de relevés bancaires en PDF avec historique des transactions, filtrage par période et téléchargement sécurisé.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Tech Specs Section -->
      <section id="specifications" class="relative py-16 md:py-20 px-4 md:px-6 bg-white overflow-hidden">
        <!-- Geometric Accents -->
        <div class="absolute top-10 right-10 w-32 h-32 border-2 border-slate-100 rounded-full"></div>
        <div class="absolute bottom-20 left-10 w-40 h-40 border-2 border-slate-100 rounded-full"></div>
        <svg class="absolute top-1/2 left-20 w-16 h-16 text-slate-100" fill="none" viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" stroke="currentColor" stroke-width="3" />
        </svg>

        <div class="max-w-6xl mx-auto relative">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-slate-900 mb-4">Spécifications Techniques</h2>
            <p class="text-slate-600">Stack moderne et performante</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <!-- Spring Boot -->
            <div class="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 hover:border-green-300 hover:shadow-lg transition-all">
              <div class="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <img src="/spring.jpg" alt="Spring Boot" class="w-full h-full object-contain rounded-lg">
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-2">Backend</h3>
              <p class="text-green-600 font-medium mb-4">Spring Boot 3.2.1</p>
              <ul class="text-sm text-slate-500 space-y-1.5">
                <li>• Spring Data JPA</li>
                <li>• Spring Security</li>
                <li>• Validation API</li>
                <li>• Lombok</li>
              </ul>
            </div>

            <!-- Angular -->
            <div class="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all">
              <div class="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <img src="/angular.jpg" alt="Angular" class="w-full h-full object-contain rounded-lg">
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-2">Frontend</h3>
              <p class="text-red-600 font-medium mb-4">Angular 21 + Tailwind</p>
              <ul class="text-sm text-slate-500 space-y-1.5">
                <li>• TypeScript 5.9</li>
                <li>• Standalone Components</li>
                <li>• Reactive Forms</li>
                <li>• Guards & Interceptors</li>
              </ul>
            </div>

            <!-- PostgreSQL -->
            <div class="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div class="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <img src="/pg.jpg" alt="PostgreSQL" class="w-full h-full object-contain rounded-lg">
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-2">Base de données</h3>
              <p class="text-blue-600 font-medium mb-4">PostgreSQL</p>
              <ul class="text-sm text-slate-500 space-y-1.5">
                <li>• Relations JPA</li>
                <li>• Indexes optimisés</li>
                <li>• Transactions ACID</li>
                <li>• Génération IBAN</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- GitHub Section -->
      <section id="depot" class="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl font-bold text-slate-900 mb-6">Dépôt GitHub</h2>
          <p class="text-lg text-slate-600 mb-8">
            Code source disponible avec historique Git complet, branches feature et protocole de contribution.
          </p>

          <div class="inline-flex flex-col gap-4 p-8 bg-white rounded-xl border-2 border-slate-200">
            <div class="flex items-center gap-3 text-slate-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span class="font-mono text-sm">its-kevin228/TP_JEE_GLSIA_GROUPE_PEKPELI_KEVIN_2026</span>
            </div>

            <div class="flex gap-4 text-sm text-slate-500">
              <span>Janvier 2026</span>
              <span>•</span>
              <span> Groupe PEKPELI KEVIN</span>
              <span>•</span>
              <span> GLSI-A</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-white text-slate-600 py-8 md:py-12 px-4 md:px-6 border-t border-slate-200">
        <div class="max-w-6xl mx-auto text-center">
          <p class="mb-2">© 2026 EGA Bank - Projet Académique</p>
          <p class="text-sm text-slate-500">Développé dans le cadre du TP Java EE • GLSI-A 2025-2026</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    /* Gradient Text */
    .text-gradient {
      background: linear-gradient(to bottom right, #1e293b, #64748b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Hero Glow */
    .hero-glow {
      background: radial-gradient(circle at center, rgba(14, 165, 233, 0.08) 0%, rgba(0, 0, 0, 0) 70%);
    }

    /* Smooth scroll */
    html {
      scroll-behavior: smooth;
    }
  `]
})
export class LandingComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
