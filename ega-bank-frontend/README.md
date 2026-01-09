# EGA Bank Frontend

Application Angular moderne pour la gestion bancaire EGA Bank System.

## 🚀 Fonctionnalités

- **Gestion des Clients**: Créer, modifier, visualiser et supprimer des clients
- **Gestion des Comptes**: Créer des comptes courants et d'épargne
- **Transactions**: Effectuer des dépôts, retraits et virements
- **Interface moderne**: Design responsive et intuitif
- **Navigation fluide**: Routing Angular avec navigation claire

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)
- Backend EGA Bank API en cours d'exécution sur `http://localhost:8080`

## 🛠️ Installation

1. Installer les dépendances:
```bash
npm install
```

## 🚀 Démarrage

### Mode Développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

Le proxy Angular redirigera automatiquement les appels API vers le backend sur `http://localhost:8080`.

### Build Production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## 📁 Structure du Projet

```
src/
├── app/
│   ├── api/                    # Services et modèles API
│   │   ├── models/             # Modèles TypeScript (Client, Compte, Transaction)
│   │   └── services/           # Services HTTP (ClientService, CompteService, TransactionService)
│   ├── features/               # Composants par fonctionnalité
│   │   ├── clients/            # Gestion des clients
│   │   │   ├── client-list/
│   │   │   ├── client-form/
│   │   │   └── client-detail/
│   │   ├── comptes/            # Gestion des comptes
│   │   │   ├── compte-list/
│   │   │   ├── compte-form/
│   │   │   └── compte-detail/
│   │   └── transactions/       # Opérations bancaires
│   │       └── transaction-operation/
│   ├── layout/                 # Composants de mise en page
│   │   └── navbar/             # Barre de navigation
│   ├── app.routes.ts           # Configuration des routes
│   └── app.ts                  # Composant racine
├── environments/               # Configuration par environnement
└── styles.css                  # Styles globaux
```

## 🎨 Composants Principaux

### Clients

- **ClientListComponent**: Liste tous les clients avec recherche et filtres
- **ClientFormComponent**: Formulaire de création/modification de client
- **ClientDetailComponent**: Affiche les détails d'un client et ses comptes

### Comptes

- **CompteListComponent**: Liste tous les comptes bancaires
- **CompteFormComponent**: Formulaire de création de compte (Courant/Épargne)
- **CompteDetailComponent**: Détails du compte et historique des transactions

### Transactions

- **TransactionOperationComponent**: Interface pour effectuer:
  - Dépôts
  - Retraits
  - Virements entre comptes

## 🔗 API Backend

L'application communique avec le backend Spring Boot via les endpoints suivants:

- `GET/POST /api/clients` - Gestion des clients
- `GET/POST /api/comptes` - Gestion des comptes
- `POST /api/transactions/depot` - Dépôt
- `POST /api/transactions/retrait` - Retrait
- `POST /api/transactions/virement` - Virement

## 🎯 Routes de l'Application

- `/` - Redirige vers `/clients`
- `/clients` - Liste des clients
- `/clients/new` - Nouveau client
- `/clients/:id` - Détails d'un client
- `/clients/:id/edit` - Modifier un client
- `/comptes` - Liste des comptes
- `/comptes/new` - Nouveau compte
- `/comptes/:id` - Détails d'un compte
- `/transactions` - Opérations bancaires

## 🎨 Styles et Design

- **Design moderne**: Gradients, ombres et animations
- **Responsive**: Compatible mobile, tablette et desktop
- **Palette de couleurs**: Violets et blues pour une apparence professionnelle
- **Feedback utilisateur**: Messages de succès/erreur clairs

## 🔧 Configuration

### Environnements

Modifiez les fichiers dans `src/environments/` pour configurer l'URL de l'API:

- `environment.ts` - Développement
- `environment.prod.ts` - Production

### Proxy

Le fichier `proxy.conf.json` configure le proxy pour éviter les problèmes CORS en développement.

## 🔐 Sécurité

- Validation des formulaires côté client
- Messages d'erreur utilisateur-friendly
- Gestion des erreurs API

## 🤝 Intégration Backend

Assurez-vous que le backend Spring Boot est démarré avant de lancer le frontend:

```bash
cd ../ega-bank
./mvnw spring-boot:run
```

## 🐛 Débogage

Si vous rencontrez des problèmes de connexion API:

1. Vérifiez que le backend est démarré
2. Vérifiez l'URL dans `environment.ts`
3. Vérifiez la configuration du proxy dans `proxy.conf.json`
4. Consultez la console du navigateur pour les erreurs

---

Développé avec ❤️ en Angular

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
