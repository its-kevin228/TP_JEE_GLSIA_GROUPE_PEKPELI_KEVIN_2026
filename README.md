# ✅ EGA Bank - Projet Complet

## 📦 Contenu du Projet

Ce projet contient une application bancaire complète avec backend Spring Boot et frontend Angular.

---

## 📂 Structure des Dossiers

```
TP_JEE_GLSIA_GROUPE_PEKPELI_KEVIN_2026/
├── ega-bank/                    # Backend Spring Boot
│   ├── src/main/java/           # Code source Java
│   ├── src/main/resources/      # Configuration
│   ├── src/test/                # Tests
│   ├── pom.xml                  # Dépendances Maven
│   └── README-TESTS.md          # Tests Postman
│
├── ega-bank-frontend/           # Frontend Angular
│   ├── src/app/                 # Code source Angular
│   ├── src/environments/        # Configuration
│   ├── angular.json             # Config Angular
│   ├── package.json             # Dépendances npm
│   ├── proxy.conf.json          # Proxy pour l'API
│   └── README.md                # Documentation
│
├── QUICKSTART.md                # Guide de démarrage rapide
├── ARCHITECTURE.md              # Documentation architecture
└── USER_GUIDE.md                # Guide utilisateur
```

---

## 🎯 Fonctionnalités Implémentées

### ✅ Gestion des Clients
- [x] Créer un nouveau client
- [x] Modifier un client existant
- [x] Supprimer un client
- [x] Lister tous les clients
- [x] Rechercher des clients
- [x] Voir les détails d'un client

### ✅ Gestion des Comptes
- [x] Créer un compte courant (avec découvert)
- [x] Créer un compte épargne (avec taux d'intérêt)
- [x] Lister tous les comptes
- [x] Voir les détails d'un compte
- [x] Supprimer un compte
- [x] Lister les comptes d'un client

### ✅ Opérations Bancaires
- [x] Effectuer un dépôt
- [x] Effectuer un retrait (avec vérification du solde)
- [x] Effectuer un virement entre comptes
- [x] Consulter l'historique des transactions
- [x] Afficher le solde après chaque transaction

---

## 🛠️ Technologies Utilisées

### Backend
- **Framework**: Spring Boot 3.x
- **Langage**: Java 21
- **ORM**: Spring Data JPA / Hibernate
- **Base de données**: H2 (en mémoire)
- **Build**: Maven
- **API**: RESTful
- **Validation**: Bean Validation
- **Sécurité**: CORS configuré

### Frontend
- **Framework**: Angular 21
- **Langage**: TypeScript
- **Architecture**: Standalone Components
- **Réactivité**: Angular Signals
- **Formulaires**: Reactive Forms
- **Routing**: Angular Router
- **HTTP**: HttpClient
- **Styles**: CSS moderne avec animations

---

## 🚀 Comment Démarrer

### Prérequis
- Java 21 ou supérieur
- Node.js 18 ou supérieur
- npm 9 ou supérieur

### Étape 1: Démarrer le Backend
```bash
cd ega-bank
./mvnw spring-boot:run
```
Backend disponible sur: http://localhost:8080

### Étape 2: Démarrer le Frontend
```bash
cd ega-bank-frontend
npm install
npm start
```
Frontend disponible sur: http://localhost:4200

**Voir [QUICKSTART.md](QUICKSTART.md) pour plus de détails**

---

## 📚 Documentation Disponible

### [QUICKSTART.md](QUICKSTART.md)
Guide de démarrage en 3 étapes avec commandes et dépannage

### [ARCHITECTURE.md](ARCHITECTURE.md)
Documentation technique complète:
- Architecture backend et frontend
- Modèles de données
- API Endpoints
- Flux de données
- Configuration

### [USER_GUIDE.md](USER_GUIDE.md)
Guide utilisateur détaillé:
- Navigation dans l'application
- Utilisation de chaque fonctionnalité
- Captures d'écran et explications
- Astuces et raccourcis

### Backend: [ega-bank/README-TESTS.md](ega-bank/README-TESTS.md)
Tests API avec Postman

### Frontend: [ega-bank-frontend/README.md](ega-bank-frontend/README.md)
Documentation spécifique Angular

---

## 📋 API Endpoints

### Clients
```
POST   /api/clients              # Créer
GET    /api/clients              # Lister tous
GET    /api/clients/{id}         # Obtenir par ID
PUT    /api/clients/{id}         # Modifier
DELETE /api/clients/{id}         # Supprimer
GET    /api/clients/search       # Rechercher
```

### Comptes
```
POST   /api/comptes              # Créer
GET    /api/comptes              # Lister tous
GET    /api/comptes/{id}         # Obtenir par ID
DELETE /api/comptes/{id}         # Supprimer
GET    /api/comptes/numero/{num} # Par numéro
GET    /api/comptes/client/{id}  # Par client
```

### Transactions
```
POST   /api/transactions/depot     # Dépôt
POST   /api/transactions/retrait   # Retrait
POST   /api/transactions/virement  # Virement
GET    /api/transactions           # Toutes
GET    /api/transactions/compte/{id} # Par compte
```

---

## 🎨 Captures d'Écran

### Interface Principale
- Barre de navigation violette moderne
- 3 sections: Clients, Comptes, Transactions
- Design responsive (mobile, tablette, desktop)

### Fonctionnalités Visuelles
- Tableaux triables
- Formulaires avec validation en temps réel
- Messages de succès/erreur
- Badges colorés pour les types
- Animations fluides

---

## 🧪 Tests

### Backend
Collection Postman disponible: `EGA-Bank-API-Tests.postman_collection.json`

### Frontend
```bash
cd ega-bank-frontend
npm test
```

---

## 📊 Base de Données

### Configuration H2 (Développement)
- **Type**: En mémoire
- **URL**: jdbc:h2:mem:egabank
- **Console H2**: http://localhost:8080/h2-console
- **Username**: sa
- **Password**: (vide)

### Schéma
```sql
Tables:
- client           # Clients
- compte           # Comptes (table parent)
- compte_courant   # Comptes courants
- compte_epargne   # Comptes épargne
- transaction      # Transactions
```

---

## 🔧 Configuration

### Backend (application.properties)
```properties
server.port=8080
spring.datasource.url=jdbc:h2:mem:egabank
spring.jpa.hibernate.ddl-auto=create-drop
```

### Frontend (environment.ts)
```typescript
apiUrl: 'http://localhost:8080/api'
```

### Proxy (proxy.conf.json)
Redirige `/api` vers `http://localhost:8080`

---

## ✨ Points Forts du Projet

### Architecture
- ✅ Séparation claire backend/frontend
- ✅ Architecture RESTful
- ✅ Modèle de données cohérent
- ✅ Gestion d'erreurs robuste

### Code Quality
- ✅ Code propre et commenté
- ✅ Validation des données
- ✅ Gestion des exceptions
- ✅ DTOs pour l'API

### UX/UI
- ✅ Interface moderne et intuitive
- ✅ Feedback utilisateur clair
- ✅ Design responsive
- ✅ Navigation fluide

### Documentation
- ✅ Documentation complète
- ✅ Guides de démarrage
- ✅ Architecture documentée
- ✅ Guide utilisateur détaillé

---

## 🚀 Évolutions Possibles

### Fonctionnalités
- [ ] Authentification JWT
- [ ] Gestion des rôles (admin, user)
- [ ] Dashboard avec graphiques
- [ ] Export PDF des relevés
- [ ] Notifications email
- [ ] Multi-devise

### Technique
- [ ] PostgreSQL en production
- [ ] Cache avec Redis
- [ ] Tests automatisés (JUnit, Cypress)
- [ ] CI/CD avec GitHub Actions
- [ ] Conteneurisation Docker
- [ ] Monitoring et logs

---

## 👥 Auteurs

**Groupe**: PEKPELI KEVIN
**Année**: 2026
**Formation**: GLSIA - JEE

---

## 📞 Support

### Problèmes Courants

**Backend ne démarre pas**
- Vérifier Java 21: `java -version`
- Vérifier le port 8080 est libre

**Frontend ne démarre pas**
- Vérifier Node.js: `node -v`
- Réinstaller: `npm install`
- Vérifier le port 4200 est libre

**Erreur de connexion API**
- Backend doit être démarré
- Vérifier l'URL dans environment.ts
- Vérifier proxy.conf.json

---

## 📄 Licence

Projet académique - TP JEE GLSIA 2026

---

## 🎓 Objectifs Pédagogiques Atteints

- ✅ Maîtrise de Spring Boot et JPA
- ✅ Architecture REST
- ✅ Développement frontend Angular
- ✅ Intégration frontend/backend
- ✅ Gestion de base de données
- ✅ Validation et gestion d'erreurs
- ✅ Documentation technique

---

**Projet EGA Bank - Version 1.0 - Janvier 2026**

🎉 **Application complète et fonctionnelle!**
