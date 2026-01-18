# ✅ Logique de Validation par Admin - EGA Bank

## 🎯 Votre Idée : Excellente Approche !

**Flux proposé :**
```
1. Utilisateur s'inscrit → Compte créé mais INACTIF (enabled = false)
2. Admin voit la demande → Valide l'identité
3. Admin active le compte → enabled = true
4. Utilisateur peut maintenant se connecter et utiliser l'app
```

**C'est PARFAIT car :**
- ✅ Combine commodité (inscription publique) + sécurité (validation admin)
- ✅ Réaliste pour une banque moderne
- ✅ Le mécanisme existe déjà dans votre code (`enabled` field)

---

## 📊 Flux Complet Détaillé

### **Étape 1 : Inscription Publique**

```
Utilisateur → /register
  ↓
Remplit : username, email, password
  ↓
Backend crée :
  - Client (avec données minimales)
  - User avec :
    * enabled = false ← COMPTE INACTIF
    * role = ROLE_USER
    * mustChangePassword = false
  ↓
Retourne : Message "Votre compte est en attente de validation"
  ↓
PAS de tokens JWT (pas encore connecté)
```

### **Étape 2 : Admin Voit les Demandes**

```
Admin → /admin/clients
  ↓
Voit la liste avec statut :
  - ✅ Actifs (enabled = true)
  - ⏳ En attente (enabled = false) ← NOUVEAU
  ↓
Admin clique sur "En attente"
  ↓
Voit les détails du client
```

### **Étape 3 : Admin Active le Compte**

```
Admin → Bouton "Activer le compte"
  ↓
Backend : PUT /api/users/{id}/activate
  ↓
Met enabled = true
  ↓
Client peut maintenant se connecter
```

### **Étape 4 : Client Se Connecte**

```
Client → /login
  ↓
Vérifie enabled = true ← Spring Security bloque si false
  ↓
Si activé → Connexion réussie
Si non activé → Erreur "Compte en attente de validation"
```

---

## 🔧 Implémentation Technique

### **1. Modifier le Register**

**Dans `AuthServiceImpl.register()` :**

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
            .enabled(false)  // ← COMPTE INACTIF EN ATTENTE DE VALIDATION
            .mustChangePassword(false)
            .client(client)
            .build();
    
    user = userRepository.save(user);
    
    log.info("Compte créé en attente de validation pour: {}", request.getUsername());
    
    // 4. NE PAS GÉNÉRER DE TOKENS (compte inactif)
    // Retourner une réponse spéciale indiquant que le compte est en attente
    return AuthResponse.of(
            null,  // Pas de token
            null,  // Pas de refresh token
            0L,    // Pas d'expiration
            user.getUsername(),
            user.getEmail(),
            user.getRole().name(),
            false);
}
```

**OU mieux : Créer une réponse spécifique :**

```java
// Dans AuthResponse, ajouter un champ
private Boolean accountPending; // true si en attente de validation

// Dans register()
return AuthResponse.builder()
        .username(user.getUsername())
        .email(user.getEmail())
        .role(user.getRole().name())
        .accountPending(true)  // Indique que le compte est en attente
        .build();
```

---

### **2. Modifier le Login pour Gérer les Comptes Inactifs**

**Dans `AuthServiceImpl.login()` :**

```java
@Override
public AuthResponse login(LoginRequest request) {
    log.info("Tentative de connexion pour: {}", request.getUsername());
    
    // Vérifier d'abord si le compte existe et est activé
    User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BadCredentialsException("Identifiants invalides"));
    
    // Vérifier si le compte est activé
    if (!user.getEnabled()) {
        throw new OperationNotAllowedException(
            "Votre compte est en attente de validation par un administrateur. " +
            "Vous recevrez un email une fois votre compte activé.");
    }
    
    // Authentification normale
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()));
    
    String accessToken = tokenProvider.generateAccessToken(authentication);
    String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());
    
    log.info("Connexion réussie pour: {}", request.getUsername());
    
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

---

### **3. Créer les Endpoints Admin pour Activer/Désactiver**

**Dans `AuthController` ou créer `UserController` :**

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Utilisateurs", description = "Gestion des utilisateurs (Admin)")
public class UserController {
    
    private final UserRepository userRepository;
    
    @Operation(summary = "Activer un compte utilisateur")
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> activateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "id", id));
        
        user.setEnabled(true);
        userRepository.save(user);
        
        log.info("Compte activé pour: {}", user.getUsername());
        return ResponseEntity.ok(MessageResponse.success("Compte activé avec succès"));
    }
    
    @Operation(summary = "Désactiver un compte utilisateur")
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "id", id));
        
        user.setEnabled(false);
        userRepository.save(user);
        
        log.info("Compte désactivé pour: {}", user.getUsername());
        return ResponseEntity.ok(MessageResponse.success("Compte désactivé avec succès"));
    }
    
    @Operation(summary = "Récupérer les comptes en attente de validation")
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getPendingUsers() {
        List<User> pendingUsers = userRepository.findByEnabledFalse();
        return ResponseEntity.ok(userMapper.toResponseList(pendingUsers));
    }
}
```

**Dans `UserRepository` :**

```java
List<User> findByEnabledFalse();
List<User> findByEnabledTrue();
```

---

### **4. Modifier l'Interface Admin**

**Dans `clients.component.html` :**

```html
<!-- Afficher le statut -->
<div class="status-badge" [class.pending]="!client.enabled">
  <span *ngIf="client.enabled">✅ Actif</span>
  <span *ngIf="!client.enabled">⏳ En attente</span>
</div>

<!-- Bouton d'activation -->
<button *ngIf="!client.enabled" 
        (click)="activateClient(client.id)"
        class="btn btn-success btn-sm">
  Activer le compte
</button>
```

**Dans `clients.component.ts` :**

```typescript
activateClient(userId: number) {
  this.userService.activate(userId).subscribe({
    next: () => {
      this.loadClients(); // Recharger la liste
      this.showSuccess('Compte activé avec succès');
    },
    error: (err) => {
      this.showError('Erreur lors de l\'activation');
    }
  });
}
```

---

### **5. Modifier la Page Register**

**Dans `register.component.ts` :**

```typescript
submit() {
  if (this.form.invalid) return;
  
  this.isLoading = true;
  this.errorMessage = '';
  
  this.auth.register(this.form.value).subscribe({
    next: (res: any) => {
      this.isLoading = false;
      
      // Vérifier si le compte est en attente
      if (res.accountPending) {
        this.successMessage = 
          'Votre compte a été créé avec succès ! ' +
          'Il est en attente de validation par un administrateur. ' +
          'Vous recevrez un email une fois votre compte activé.';
        
        // Rediriger vers login après 3 secondes
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 3000);
      } else {
        // Compte activé directement (normalement pas le cas)
        this.router.navigateByUrl('/client/dashboard');
      }
    },
    error: (err: any) => {
      this.isLoading = false;
      // Gestion des erreurs...
    }
  });
}
```

---

## 📋 Modifications Nécessaires

### **Backend :**

1. ✅ **Modifier `AuthService.register()`**
   - Créer User avec `enabled = false`
   - Ne pas générer de tokens
   - Retourner une réponse indiquant l'attente

2. ✅ **Modifier `AuthService.login()`**
   - Vérifier `enabled` avant l'authentification
   - Lancer exception si compte inactif

3. ✅ **Créer `UserController`**
   - `PUT /api/users/{id}/activate`
   - `PUT /api/users/{id}/deactivate`
   - `GET /api/users/pending`

4. ✅ **Ajouter méthodes dans `UserRepository`**
   - `findByEnabledFalse()`
   - `findByEnabledTrue()`

5. ✅ **Créer `UserResponse` DTO**
   - Inclure `enabled` dans la réponse

### **Frontend :**

1. ✅ **Modifier `register.component.ts`**
   - Afficher message "En attente de validation"
   - Rediriger vers login

2. ✅ **Modifier `clients.component.ts/html`**
   - Afficher statut (Actif/En attente)
   - Bouton "Activer"

3. ✅ **Créer `user.service.ts`**
   - Méthodes `activate()` et `deactivate()`

---

## 🎯 Avantages de Cette Approche

### ✅ **Sécurité**
- Validation par admin avant activation
- Contrôle total sur qui peut utiliser l'app

### ✅ **Conformité Bancaire**
- Processus de validation réaliste
- Traçabilité (qui a activé quel compte)

### ✅ **Expérience Utilisateur**
- Inscription simple pour l'utilisateur
- Message clair sur l'attente

### ✅ **Flexibilité**
- Admin peut activer/désactiver à tout moment
- Peut désactiver un compte suspect

---

## 🔄 Comparaison avec Votre Approche Actuelle

| Aspect | Actuel (Admin crée) | Nouveau (Register + Validation) |
|--------|---------------------|--------------------------------|
| Inscription | ❌ Seulement admin | ✅ Public |
| Validation | ✅ Immédiate | ✅ Par admin |
| Sécurité | ✅ Maximale | ✅ Contrôlée |
| Commodité | ⚠️ Moins pratique | ✅ Plus pratique |
| Réalisme | ✅ Traditionnel | ✅ Moderne |

**Les deux approches sont valides !** La nouvelle est plus moderne et pratique.

---

## 🚀 Prochaines Étapes

1. **Implémenter le register avec `enabled = false`**
2. **Créer les endpoints d'activation**
3. **Modifier l'interface admin pour voir les comptes en attente**
4. **Tester le flux complet**

**Voulez-vous que je vous aide à implémenter tout ça ?** 🎯
