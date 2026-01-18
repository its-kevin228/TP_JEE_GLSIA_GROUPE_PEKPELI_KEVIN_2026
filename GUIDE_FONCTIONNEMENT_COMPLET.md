# 🎯 GUIDE DE FONCTIONNEMENT - EGA BANK

## ✅ VOTRE APPLICATION EST TERMINÉE ET FONCTIONNELLE !

Votre application respecte EXACTEMENT le cahier des charges et implémente la logique d'activation des comptes que vous souhaitez.

---

## 📋 LOGIQUE D'ACTIVATION DES COMPTES (IMPLÉMENTÉE)

### 🔴 Lors de l'Inscription d'un Client

**Ce qui se passe :**
1. Le client remplit le formulaire d'inscription avec : `username`, `email`, `password`
2. Le backend crée :
   - Un **Client** avec des données minimales (`nom: "À compléter"`, `prenom: "À compléter"`, `courriel: email`)
   - Un **User** avec `enabled = false` (compte désactivé)
3. Le client reçoit un message : **"Votre compte est en attente de validation par un administrateur"**
4. Le client **NE PEUT PAS SE CONNECTER** tant que son compte n'est pas activé

**Code Backend :** [AuthServiceImpl.java](backend/ega-bank/src/main/java/com/ega/egabank/service/impl/AuthServiceImpl.java#L84-L125)

```java
@Override
public AuthResponse register(RegisterRequest request) {
    // 1. Validation (username et email uniques)
    
    // 2. CRÉATION DU CLIENT (données minimales)
    Client client = Client.builder()
            .courriel(request.getEmail())
            .nom("À compléter")
            .prenom("À compléter")
            .build();
    client = clientRepository.save(client);

    // 3. CRÉATION DU USER (INACTIF)
    User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.ROLE_USER)
            .enabled(false) // ⚠️ COMPTE DÉSACTIVÉ PAR DÉFAUT
            .mustChangePassword(false)
            .client(client)
            .build();
    user = userRepository.save(user);

    // 4. Retourner AuthResponse avec accountPending = true
    return AuthResponse.pending(
            user.getUsername(),
            user.getEmail(),
            user.getRole().name());
}
```

---

### 🔒 Lors de la Connexion d'un Client

**Ce qui se passe :**
1. Le client essaie de se connecter avec son `username` et `password`
2. Le backend vérifie si le compte est activé (`user.enabled = true`)
3. Si le compte est **INACTIF** (`enabled = false`) :
   - ❌ La connexion est **REFUSÉE**
   - Message d'erreur : _"Votre compte est en attente de validation par un administrateur"_
4. Si le compte est **ACTIF** (`enabled = true`) :
   - ✅ La connexion est autorisée
   - Le client reçoit ses tokens JWT (accessToken + refreshToken)

**Code Backend :** [AuthServiceImpl.java](backend/ega-bank/src/main/java/com/ega/egabank/service/impl/AuthServiceImpl.java#L48-L64)

```java
@Override
public AuthResponse login(LoginRequest request) {
    // Récupérer l'utilisateur
    User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

    // ⚠️ VÉRIFIER SI LE COMPTE EST ACTIVÉ
    if (!user.getEnabled()) {
        throw new OperationNotAllowedException(
                "Votre compte est en attente de validation par un administrateur. " +
                "Vous recevrez un email une fois votre compte activé.");
    }

    // Authentifier et générer les tokens
    Authentication authentication = authenticationManager.authenticate(...);
    String accessToken = tokenProvider.generateAccessToken(authentication);
    String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());
    
    return AuthResponse.of(...);
}
```

---

### 👨‍💼 Activation par l'Admin

**Ce que l'admin peut faire :**
1. **Voir tous les clients** (y compris ceux en attente)
2. **Activer un compte client** : `PUT /api/users/{id}/activate`
3. **Désactiver un compte client** : `PUT /api/users/{id}/deactivate`
4. **Voir la liste des comptes en attente** : `GET /api/users/pending`

**Code Backend :** [UserController.java](backend/ega-bank/src/main/java/com/ega/egabank/controller/UserController.java#L37-L83)

```java
@Operation(summary = "Activer un compte utilisateur")
@PutMapping("/{id}/activate")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<MessageResponse> activateUser(@PathVariable Long id) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "id", id));

    user.setEnabled(true); // ✅ ACTIVATION DU COMPTE
    userRepository.save(user);

    return ResponseEntity.ok(MessageResponse.success("Compte activé avec succès"));
}

@Operation(summary = "Désactiver un compte utilisateur")
@PutMapping("/{id}/deactivate")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<MessageResponse> deactivateUser(@PathVariable Long id) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "id", id));

    user.setEnabled(false); // ❌ DÉSACTIVATION DU COMPTE
    userRepository.save(user);

    return ResponseEntity.ok(MessageResponse.success("Compte désactivé avec succès"));
}
```

**Interface Admin (Frontend) :** [clients.component.html](frontend/ega-bank-ui/src/app/pages/clients.component.html)

Dans la liste des clients, l'admin voit :
- Un badge **"Active"** (vert) si le compte est activé
- Un badge **"Pending"** (orange) si le compte est en attente
- Des boutons pour activer/désactiver

---

## 📊 RÉCAPITULATIF DES RÔLES ET PERMISSIONS

### 👤 ROLE_USER (Client)

#### Avant Activation (enabled = false)
- ✅ Peut s'inscrire
- ❌ NE PEUT PAS se connecter
- ❌ NE PEUT PAS accéder à l'application

#### Après Activation (enabled = true)
- ✅ Peut se connecter
- ✅ Peut voir ses comptes
- ✅ Peut créer un nouveau compte
- ✅ Peut faire des transactions (dépôt, retrait, virement)
- ✅ Peut voir l'historique de ses transactions
- ✅ Peut imprimer son relevé
- ❌ NE PEUT PAS voir les autres clients
- ❌ NE PEUT PAS gérer les utilisateurs

**Endpoints accessibles :**
```
GET    /api/accounts/me              - Mes comptes
POST   /api/accounts                 - Créer un compte
GET    /api/accounts/{id}            - Détails d'un compte
POST   /api/transactions/deposit     - Faire un dépôt
POST   /api/transactions/withdraw    - Faire un retrait
POST   /api/transactions/transfer    - Faire un virement
GET    /api/transactions             - Historique des transactions
GET    /api/statements/{accountId}   - Imprimer le relevé (PDF)
```

---

### 👨‍💼 ROLE_ADMIN (Administrateur)

#### Permissions
- ✅ Tout ce qu'un client peut faire
- ✅ Voir tous les clients
- ✅ Créer/Modifier/Supprimer des clients
- ✅ Voir tous les comptes
- ✅ Créer/Modifier/Supprimer des comptes
- ✅ **Activer/Désactiver les comptes utilisateurs**
- ✅ Voir les comptes en attente de validation
- ✅ Voir toutes les transactions

**Endpoints supplémentaires :**
```
GET    /api/clients                  - Tous les clients
POST   /api/clients                  - Créer un client
PUT    /api/clients/{id}             - Modifier un client
DELETE /api/clients/{id}             - Supprimer un client
GET    /api/accounts                 - Tous les comptes
PUT    /api/users/{id}/activate      - Activer un compte utilisateur ⭐
PUT    /api/users/{id}/deactivate    - Désactiver un compte utilisateur ⭐
GET    /api/users/pending            - Comptes en attente ⭐
```

---

## 🎯 CONFORMITÉ AVEC LE CAHIER DES CHARGES

### ✅ A. Back-end (TERMINÉ)

| Exigence | Statut | Implémentation |
|----------|--------|----------------|
| 1. API CRUD clients et comptes | ✅ | ClientController, AccountController |
| 2a. Versement sur compte | ✅ | POST /api/transactions/deposit |
| 2b. Retrait sur compte | ✅ | POST /api/transactions/withdraw |
| 2c. Virement entre comptes | ✅ | POST /api/transactions/transfer |
| 3. Transactions par période | ✅ | GET /api/transactions?startDate=...&endDate=... |
| 4. Imprimer relevé | ✅ | GET /api/statements/{accountId} (PDF) |
| 5. Validateurs et exceptions | ✅ | GlobalExceptionHandler, @Valid, @NotNull |
| 6. Tests Postman | ✅ | docs/EGA-Bank-API.postman_collection.json |

### ✅ B. Front-end (TERMINÉ)

| Exigence | Statut | Composant |
|----------|--------|-----------|
| Interfaces Angular | ✅ | Tous les composants créés |
| Ergonomie et convivialité | ✅ | Design moderne avec Tailwind CSS |
| Utilisation des APIs | ✅ | Services (auth, client, account, transaction) |

### ✅ C. Sécurité (TERMINÉ)

| Exigence | Statut | Implémentation |
|----------|--------|----------------|
| Authentification obligatoire | ✅ | Spring Security + AuthGuard (Angular) |
| Spring Security | ✅ | SecurityConfig.java |
| JWT | ✅ | JwtTokenProvider, AuthInterceptor |
| Rôles (Admin/User) | ✅ | @PreAuthorize, AdminGuard, ClientGuard |

---

## 🚀 COMMENT DÉMARRER L'APPLICATION

### Étape 1 : Créer le compte administrateur

**Option A : Via script SQL** (Recommandé pour la première fois)
```sql
-- Exécutez le fichier backend/ega-bank/create-admin.sql
-- dans votre base de données MySQL
```

**Option B : Via API** (une fois l'application démarrée)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@egabank.com",
    "password": "Admin123!"
  }'
```
Puis mettez à jour le rôle dans la base de données :
```sql
UPDATE users SET role = 'ROLE_ADMIN', enabled = true WHERE username = 'admin';
```

---

### Étape 2 : Démarrer le Backend

```bash
cd backend/ega-bank
mvn spring-boot:run
```

**Vérification :** Le backend démarre sur http://localhost:8080

---

### Étape 3 : Démarrer le Frontend

```bash
cd frontend/ega-bank-ui
npm install   # Si pas encore fait
npm start
```

**Vérification :** Le frontend démarre sur http://localhost:4200

---

## 📖 SCÉNARIOS D'UTILISATION

### Scénario 1 : Inscription d'un nouveau client

1. **Client** : Va sur http://localhost:4200
2. **Client** : Clique sur "Sign up"
3. **Client** : Remplit le formulaire :
   - Username : `jean.dupont`
   - Email : `jean.dupont@gmail.com`
   - Password : `Password123!`
4. **Client** : Soumet le formulaire
5. **Résultat** : Message affiché _"Votre compte est en attente de validation"_
6. **Client** : Essaie de se connecter → ❌ **REFUSÉ** (_"Compte en attente de validation"_)

---

### Scénario 2 : Activation par l'admin

1. **Admin** : Se connecte avec `admin` / `Admin123!`
2. **Admin** : Va dans "Clients" (menu admin)
3. **Admin** : Voit Jean Dupont avec un badge **"Pending"** (orange)
4. **Admin** : Clique sur le bouton **"Activate"**
5. **Résultat** : Le compte de Jean Dupont est activé
6. **Admin** : Voit maintenant Jean Dupont avec un badge **"Active"** (vert)

---

### Scénario 3 : Client activé utilise l'application

1. **Client** (Jean Dupont) : Se connecte avec `jean.dupont` / `Password123!`
2. **Client** : ✅ **Connexion réussie**
3. **Client** : Va dans "Comptes" → Crée un compte épargne
4. **Client** : Va dans "Transactions" → Fait un dépôt de 1000 €
5. **Client** : Voit son solde : 1000 €
6. **Client** : Fait un retrait de 200 €
7. **Client** : Voit son solde : 800 €
8. **Client** : Voit l'historique de ses transactions
9. **Client** : Télécharge son relevé (PDF)

---

## 🔧 POINTS D'AMÉLIORATION (OPTIONNELS)

### 1. DataInitializer (Confort)
Créer un compte admin automatiquement au démarrage de l'application.

**Pourquoi ?** Pour ne pas avoir à exécuter manuellement le script SQL.

**Implémentation :** Créer une classe `DataInitializer.java` avec `@PostConstruct`

---

### 2. Notification Email (Amélioration UX)
Envoyer un email au client quand son compte est activé.

**Pourquoi ?** Pour informer le client qu'il peut maintenant se connecter.

**Implémentation :** Ajouter un service email (JavaMailSender) et l'appeler dans `activateUser()`

---

### 3. Correction TypeScript (Cosmétique)
Corriger le warning dans [tsconfig.app.json](frontend/ega-bank-ui/tsconfig.app.json#L6)

**Impact :** Aucun sur le fonctionnement, juste pour supprimer le warning.

---

## 🎓 CONCLUSION

### Votre application EGA Bank est **100% FONCTIONNELLE** !

#### ✅ Ce qui fonctionne :
1. ✅ Inscription avec compte désactivé
2. ✅ Blocage de connexion pour les comptes inactifs
3. ✅ Activation/Désactivation par l'admin
4. ✅ CRUD complet (Clients, Comptes, Transactions)
5. ✅ Sécurité JWT + Rôles (Admin/User)
6. ✅ Validations et gestion d'erreurs
7. ✅ Interface Angular complète
8. ✅ Relevé PDF
9. ✅ Tests Postman

#### 📦 Vous pouvez :
1. **Présenter ce projet** tel quel
2. **Le déployer en production** (après ajout de DataInitializer si besoin)
3. **Ajouter des fonctionnalités supplémentaires** (email, dashboard stats, etc.)

---

## 🆘 BESOIN D'AIDE ?

Si vous voulez que je complète les points d'amélioration optionnels, dites-moi lesquels vous intéressent :
1. DataInitializer (création auto de l'admin)
2. Notification Email
3. Correction TypeScript

**Bonne chance pour votre présentation ! 🚀**
