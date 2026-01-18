# 🏗️ Logique Métier Recommandée - EGA Bank

## 📋 Vue d'Ensemble de l'Architecture

### **Principe Fondamental :**
```
User (Authentification) ←→ Client (Données bancaires) ←→ Account (Comptes) ←→ Transaction (Opérations)
```

**Relation :** Un `User` peut être lié à un `Client` (OneToOne). Un `Client` peut avoir plusieurs `Account`. Un `Account` peut avoir plusieurs `Transaction`.

---

## 🔐 Logique d'Authentification et Inscription

### **1. Inscription Publique (`/api/auth/register`)**

**Contexte :** Un utilisateur s'inscrit via le formulaire public avec seulement username, email, password.

**Logique Recommandée :**

```java
public AuthResponse register(RegisterRequest request) {
    // 1. VALIDATION
    //    - Vérifier que username n'existe pas
    //    - Vérifier que email n'existe pas
    
    // 2. CRÉATION DU CLIENT (avec données minimales)
    //    - Créer un Client avec seulement :
    //      * courriel = email du RegisterRequest
    //      * nom = extrait de l'email ou "À compléter"
    //      * prenom = "À compléter"
    //      * Les autres champs peuvent être null (seront complétés plus tard)
    
    // 3. CRÉATION DU USER
    //    - username, email, password (encodé)
    //    - role = ROLE_USER (client par défaut)
    //    - enabled = true
    //    - mustChangePassword = false (pas besoin de changer au premier login)
    //    - Lier le User au Client créé
    
    // 4. GÉNÉRATION DES TOKENS
    //    - Générer accessToken et refreshToken
    //    - Retourner AuthResponse
}
```

**Points Importants :**
- ✅ Le Client est créé automatiquement avec des données minimales
- ✅ L'utilisateur pourra compléter son profil plus tard (via `/api/clients/me`)
- ✅ Pas de `mustChangePassword` car c'est l'utilisateur qui choisit son mot de passe
- ✅ Transaction atomique : si une étape échoue, tout est annulé

---

### **2. Création Admin (`/api/auth/admin/create-client-user`)**

**Contexte :** Un admin crée un client avec toutes les informations complètes.

**Logique Actuelle (Déjà Implémentée) :**
```java
// 1. Validation complète (username, email, courriel client)
// 2. Création du Client avec TOUTES les données
// 3. Création du User avec :
//    - mustChangePassword = true (l'admin définit un mot de passe temporaire)
// 4. Génération des tokens
```

**Différence clé :**
- Admin : Client complet + mot de passe temporaire
- Register : Client minimal + mot de passe défini par l'utilisateur

---

## 🎯 Logique de Gestion des Comptes

### **Création d'un Compte**

**Flux :**
```
1. Admin sélectionne un Client
2. Admin choisit le TypeCompte (EPARGNE ou COURANT)
3. Backend :
   a. Génère un IBAN unique (vérifie l'unicité)
   b. Crée le compte avec solde = 0
   c. Lie le compte au Client
4. Le compte est immédiatement actif
```

**Règles Métier :**
- ✅ Un compte ne peut pas être créé sans propriétaire
- ✅ Le solde initial est toujours 0
- ✅ L'IBAN doit être unique dans toute la base
- ✅ Un client peut avoir plusieurs comptes du même type

---

## 💰 Logique des Transactions

### **1. Dépôt (Versement)**

**Flux :**
```
1. Vérifier que le compte existe et est actif
2. Créer la transaction :
   - type = DEPOT
   - montant = montant fourni
   - soldeAvant = compte.solde
   - soldeApres = compte.solde + montant
3. Mettre à jour le solde du compte
4. Enregistrer la transaction
```

**Règles :**
- ✅ Pas de limite de montant pour un dépôt
- ✅ Le compte doit être actif
- ✅ Transaction atomique (si échec, rollback)

---

### **2. Retrait**

**Flux :**
```
1. Vérifier que le compte existe et est actif
2. Vérifier que solde >= montant (InsufficientBalanceException si non)
3. Créer la transaction :
   - type = RETRAIT
   - montant = montant fourni
   - soldeAvant = compte.solde
   - soldeApres = compte.solde - montant
4. Mettre à jour le solde du compte
5. Enregistrer la transaction
```

**Règles :**
- ✅ Le solde doit être suffisant
- ✅ Le compte doit être actif
- ✅ Pas de découvert autorisé (sauf si spécifié autrement)

---

### **3. Virement**

**Flux :**
```
1. Vérifier que compteSource existe et est actif
2. Vérifier que compteDestination existe et est actif
3. Vérifier que compteSource.solde >= montant
4. Créer DEUX transactions :
   a. Transaction RETRAIT sur compteSource :
      - soldeAvant = compteSource.solde
      - soldeApres = compteSource.solde - montant
   b. Transaction DEPOT sur compteDestination :
      - soldeAvant = compteDestination.solde
      - soldeApres = compteDestination.solde + montant
5. Mettre à jour les deux soldes
6. Enregistrer les deux transactions
```

**Règles :**
- ✅ Transaction atomique : si une partie échoue, tout est annulé
- ✅ Les deux comptes doivent être actifs
- ✅ Le compte source doit avoir un solde suffisant
- ✅ Un compte ne peut pas virer vers lui-même (validation à ajouter)

---

## 📊 Logique de Sécurité

### **Hiérarchie des Rôles**

```
ROLE_ADMIN (Personnel bancaire)
  ├─ Peut tout faire
  ├─ Créer/modifier/supprimer des clients
  ├─ Créer/supprimer des comptes
  └─ Voir toutes les transactions

ROLE_USER (Client)
  ├─ Voir uniquement SES comptes
  ├─ Effectuer des transactions sur SES comptes
  ├─ Voir SES transactions uniquement
  └─ Télécharger SES relevés
```

### **Vérification des Permissions**

**Pattern utilisé :**
```java
@PreAuthorize("hasRole('ADMIN') or @securityService.isAccountOwner(#numeroCompte)")
```

**Logique dans SecurityService :**
```java
public boolean isAccountOwner(String numeroCompte) {
    // 1. Récupérer l'utilisateur connecté
    // 2. Récupérer le compte par numéroCompte
    // 3. Vérifier que compte.proprietaire.id == user.client.id
    // 4. Retourner true/false
}
```

---

## 🔄 Logique de Gestion des Erreurs

### **Hiérarchie des Exceptions**

```
Exception (générique)
  ├─ ResourceNotFoundException (404)
  │   └─ Ressource non trouvée (client, compte, etc.)
  ├─ DuplicateResourceException (409)
  │   └─ Ressource déjà existante (username, email, IBAN)
  ├─ InsufficientBalanceException (400)
  │   └─ Solde insuffisant pour retrait/virement
  ├─ OperationNotAllowedException (400)
  │   └─ Opération non autorisée (compte inactif, etc.)
  └─ ValidationException (400)
      └─ Erreurs de validation Bean Validation
```

### **Gestion Globale**

Toutes les exceptions sont capturées par `GlobalExceptionHandler` et transformées en `ApiError` avec :
- Code HTTP approprié
- Message d'erreur clair
- Détails de validation (si applicable)
- Chemin de la requête

---

## 🎨 Logique Frontend

### **Flux d'Authentification**

```
1. Login/Register
   ↓
2. Stockage des tokens dans localStorage
   ↓
3. Redirection selon le rôle :
   - ROLE_ADMIN → /admin/dashboard
   - ROLE_USER → /client/dashboard
   ↓
4. Guards vérifient l'authentification sur chaque route
   ↓
5. Intercepteur ajoute le token JWT à chaque requête
```

### **Gestion des États**

```
AppStore (State Management)
  ├─ User info (username, email, role)
  ├─ Authentification status
  └─ Thème (light/dark)
```

---

## 📝 Logique Recommandée pour les Fonctionnalités Manquantes

### **1. Endpoint Register**

**Implémentation Recommandée :**

```java
@Override
public AuthResponse register(RegisterRequest request) {
    log.info("Inscription d'un nouvel utilisateur: {}", request.getUsername());
    
    // 1. VALIDATION
    if (userRepository.existsByUsername(request.getUsername())) {
        throw new DuplicateResourceException("Utilisateur", "username", request.getUsername());
    }
    
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new DuplicateResourceException("Utilisateur", "email", request.getEmail());
    }
    
    // 2. CRÉATION DU CLIENT (données minimales)
    Client client = Client.builder()
            .courriel(request.getEmail())
            .nom("À compléter")  // Sera complété plus tard
            .prenom("À compléter")
            // Les autres champs restent null
            .build();
    
    client = clientRepository.save(client);
    
    // 3. CRÉATION DU USER
    User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.ROLE_USER)  // Toujours ROLE_USER pour l'inscription publique
            .enabled(true)
            .mustChangePassword(false)  // Pas besoin de changer, c'est lui qui l'a défini
            .client(client)  // Lier au client créé
            .build();
    
    user = userRepository.save(user);
    
    // 4. GÉNÉRATION DES TOKENS
    String accessToken = tokenProvider.generateAccessToken(user.getUsername());
    String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());
    
    log.info("Inscription réussie pour: {}", request.getUsername());
    
    return AuthResponse.of(
            accessToken,
            refreshToken,
            tokenProvider.getExpirationTime(),
            user.getUsername(),
            user.getEmail(),
            user.getRole().name(),
            user.getMustChangePassword());
}
```

**Dans AuthController :**
```java
@PostMapping("/register")
public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    AuthResponse response = authService.register(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

**Dans AuthService interface :**
```java
AuthResponse register(RegisterRequest request);
```

---

### **2. DataInitializer**

**Implémentation Recommandée :**

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @PostConstruct
    @Transactional
    public void init() {
        // Vérifier si un admin existe déjà
        if (userRepository.existsByRole(Role.ROLE_ADMIN)) {
            log.info("Un administrateur existe déjà. Aucune initialisation nécessaire.");
            return;
        }
        
        // Créer l'admin par défaut
        User admin = User.builder()
                .username("admin")
                .email("admin@egabank.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .mustChangePassword(false)
                .build();
        
        userRepository.save(admin);
        
        log.info("==================================================================================");
        log.info("✅ Compte administrateur créé avec succès !");
        log.info("   Username : admin");
        log.info("   Password : admin123");
        log.info("   Email    : admin@egabank.com");
        log.info("⚠️  IMPORTANT : Changez ce mot de passe en production !");
        log.info("==================================================================================");
    }
}
```

**Note :** Il faut ajouter la méthode `existsByRole` dans `UserRepository` :
```java
boolean existsByRole(Role role);
```

---

## 🎯 Principes de Design Recommandés

### **1. Séparation des Responsabilités**

```
Controller → Service → Repository → Database
   ↓          ↓          ↓
  HTTP      Métier    Accès DB
```

### **2. Transactions Atomiques**

- Utiliser `@Transactional` sur les méthodes qui modifient plusieurs entités
- Exemple : Virement (2 comptes + 2 transactions) doit être atomique

### **3. Validation en Cascade**

```
DTO Validation → Service Validation → Entity Validation
```

### **4. Gestion d'Erreurs Centralisée**

- Une seule classe `GlobalExceptionHandler`
- Messages d'erreur cohérents
- Codes HTTP appropriés

### **5. Sécurité par Défaut**

- Tous les endpoints sont protégés sauf `/api/auth/login` et `/api/auth/register`
- Vérification du propriétaire pour chaque ressource
- Tokens JWT avec expiration

---

## 📋 Checklist de Logique Métier

### **Inscription**
- [x] Validation username/email unique
- [x] Création automatique du Client
- [x] Création du User avec ROLE_USER
- [x] Génération des tokens JWT
- [ ] **À AJOUTER :** Endpoint `/api/auth/register`

### **Authentification**
- [x] Login avec username/password
- [x] Génération de tokens JWT
- [x] Refresh token
- [x] Gestion de l'expiration

### **Gestion Clients**
- [x] CRUD complet
- [x] Recherche
- [x] Pagination
- [x] Validation des données

### **Gestion Comptes**
- [x] Création avec IBAN unique
- [x] Types de comptes (EPARGNE, COURANT)
- [x] Solde initial à 0
- [x] Activation/Désactivation

### **Transactions**
- [x] Dépôt
- [x] Retrait avec vérification solde
- [x] Virement atomique
- [x] Historique avec période
- [ ] **À AMÉLIORER :** Vérifier qu'un compte ne vire pas vers lui-même

### **Relevés**
- [x] Génération PDF
- [x] Filtrage par période
- [x] Téléchargement

### **Sécurité**
- [x] Spring Security configuré
- [x] JWT implémenté
- [x] Rôles et permissions
- [x] Guards Angular
- [ ] **À AJOUTER :** DataInitializer pour admin

---

## 🚀 Prochaines Étapes Recommandées

1. **Implémenter `/api/auth/register`** (30 min)
2. **Créer DataInitializer** (15 min)
3. **Ajouter validation : compte ne peut pas virer vers lui-même** (10 min)
4. **Tester l'inscription complète** (15 min)
5. **Documenter les changements** (10 min)

**Total estimé : ~1h30**

---

## 💡 Bonnes Pratiques Appliquées

✅ **Architecture en couches** (Controller → Service → Repository)  
✅ **DTOs pour l'API** (séparation Entity/DTO)  
✅ **Mappers** (conversion Entity ↔ DTO)  
✅ **Transactions atomiques** (`@Transactional`)  
✅ **Validation complète** (Bean Validation)  
✅ **Gestion d'erreurs centralisée** (`GlobalExceptionHandler`)  
✅ **Sécurité par défaut** (Spring Security + JWT)  
✅ **Logging structuré** (Slf4j)  
✅ **Tests unitaires** (JUnit + Mockito)  
✅ **Documentation API** (Swagger/OpenAPI)

---

Cette logique garantit une application robuste, sécurisée et maintenable ! 🎯
