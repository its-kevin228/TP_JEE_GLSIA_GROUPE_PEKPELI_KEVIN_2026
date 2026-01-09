# 🎯 Guide Utilisateur - EGA Bank

## Navigation Principale

L'application EGA Bank dispose de 3 sections principales accessibles via la barre de navigation violette en haut :

### 👥 Clients
### 💳 Comptes  
### 💸 Transactions

---

## 👥 Section Clients

### Page Liste des Clients
**Route**: `/clients`

**Fonctionnalités**:
- Vue tableau de tous les clients
- Bouton "Nouveau Client" en haut à droite
- Actions disponibles pour chaque client:
  - 👁️ **Voir**: Affiche les détails du client
  - ✏️ **Modifier**: Édite les informations du client
  - 🗑️ **Supprimer**: Supprime le client (avec confirmation)

**Colonnes affichées**:
- ID
- Nom complet (Nom + Prénom)
- Date de naissance
- Email
- Téléphone
- Actions

---

### Page Création/Modification Client
**Routes**: `/clients/new` ou `/clients/:id/edit`

**Formulaire**:

**Ligne 1**:
- 📝 **Nom** (2-50 caractères, obligatoire)
- 📝 **Prénom** (2-50 caractères, obligatoire)

**Ligne 2**:
- 📅 **Date de Naissance** (obligatoire)
- ⚧️ **Sexe** (M/F, obligatoire)

**Ligne 3**:
- 🏠 **Adresse** (max 200 caractères, obligatoire)

**Ligne 4**:
- 📞 **Téléphone** (format international, 8-15 chiffres, obligatoire)
- 📧 **Email** (format email valide, obligatoire)

**Boutons**:
- 💾 **Enregistrer**: Sauvegarde le client
- ↩️ **Retour**: Retourne à la liste

**Validation en temps réel**:
- Les champs invalides sont marqués en rouge
- Messages d'erreur sous chaque champ

---

### Page Détails Client
**Route**: `/clients/:id`

**Sections affichées**:

**1. Informations Personnelles**
- Nom complet
- Date de naissance
- Sexe
- Adresse
- Téléphone
- Email

**2. Comptes Bancaires**
- Liste des comptes du client
- Type de compte (Courant/Épargne)
- Numéro de compte
- Solde actuel
- Date de création

**Boutons d'action**:
- ✏️ **Modifier**: Édite le client
- ➕ **Nouveau Compte**: Crée un compte pour ce client
- ↩️ **Retour**: Retourne à la liste

**Actions sur les comptes**:
- 👁️ **Voir**: Affiche les détails du compte
- 🗑️ **Supprimer**: Supprime le compte

---

## 💳 Section Comptes

### Page Liste des Comptes
**Route**: `/comptes`

**Fonctionnalités**:
- Vue tableau de tous les comptes
- Bouton "Nouveau Compte" en haut à droite
- Filtrage possible par type (Courant/Épargne)

**Colonnes affichées**:
- Numéro de compte
- Type (badge coloré)
  - 🔵 Bleu pour COURANT
  - 🟢 Vert pour ÉPARGNE
- Client (nom complet)
- Solde (formaté en devise)
- Date de création
- Actions

**Actions disponibles**:
- 👁️ **Voir**: Détails et transactions
- 🗑️ **Supprimer**: Supprimer le compte

---

### Page Création Compte
**Route**: `/comptes/new`

**Formulaire**:

**Étape 1 - Informations de base**:
- 📋 **Type de Compte** (Courant/Épargne)
- 👤 **Client** (sélection dans une liste déroulante)

**Étape 2 - Paramètres spécifiques**:

**Si Compte Courant**:
- 💰 **Découvert Autorisé** (montant en euros, minimum 0)

**Si Compte Épargne**:
- 📈 **Taux d'Intérêt** (pourcentage, 0-100)

**Boutons**:
- 💾 **Créer le Compte**: Crée le compte
- ↩️ **Retour**: Annule et retourne

**Note**: Le formulaire s'adapte automatiquement au type de compte sélectionné.

---

### Page Détails Compte
**Route**: `/comptes/:id`

**Section 1 - Informations du Compte**
- Numéro de compte
- Type (avec badge coloré)
- Client propriétaire (cliquable)
- Solde actuel (en gros)
- Date de création
- Découvert autorisé (si courant)
- Taux d'intérêt (si épargne)

**Section 2 - Historique des Transactions**
- Tableau des transactions
- Colonnes:
  - Date et heure
  - Type (badge coloré):
    - 🟢 DEPOT (vert)
    - 🔴 RETRAIT (rouge)
    - 🔵 VIREMENT (bleu)
  - Montant
  - Description
  - Solde après transaction

**Boutons d'action**:
- 💸 **Nouvelle Transaction**: Va à la page transactions
- ↩️ **Retour**: Retourne à la liste

**Tri**: Transactions triées par date décroissante (plus récente en haut)

---

## 💸 Section Transactions

### Page Opérations Bancaires
**Route**: `/transactions`

**3 Onglets disponibles**:

#### 1️⃣ Dépôt
**Pour**: Ajouter de l'argent sur un compte

**Champs**:
- 🔢 **Numéro de Compte** (obligatoire)
- 💰 **Montant** (minimum 0.01€, obligatoire)
- 📝 **Description** (optionnel)

**Bouton**: 💾 **Effectuer le Dépôt**

**Résultat**: 
- Message de succès avec le nouveau solde
- Redirection automatique après 2 secondes

---

#### 2️⃣ Retrait
**Pour**: Retirer de l'argent d'un compte

**Champs**:
- 🔢 **Numéro de Compte** (obligatoire)
- 💰 **Montant** (minimum 0.01€, obligatoire)
- 📝 **Description** (optionnel)

**Validation**:
- Vérifie que le solde est suffisant
- Prend en compte le découvert autorisé (comptes courants)

**Bouton**: 💾 **Effectuer le Retrait**

**Erreurs possibles**:
- ❌ Solde insuffisant
- ❌ Compte non trouvé
- ❌ Montant invalide

---

#### 3️⃣ Virement
**Pour**: Transférer de l'argent entre deux comptes

**Champs**:
- 🔢 **Compte Source** (numéro, obligatoire)
- 🔢 **Compte Destinataire** (numéro, obligatoire)
- 💰 **Montant** (minimum 0.01€, obligatoire)
- 📝 **Description** (optionnel)

**Validation**:
- Les deux comptes doivent exister
- Les comptes doivent être différents
- Le compte source doit avoir un solde suffisant

**Bouton**: 💾 **Effectuer le Virement**

**Résultat**:
- Débite le compte source
- Crédite le compte destinataire
- Crée une transaction de type VIREMENT

---

## 🎨 Interface et Design

### Palette de Couleurs
- **Navigation**: Dégradé violet (#667eea → #764ba2)
- **Succès**: Vert (#10b981)
- **Erreur**: Rouge (#ef4444)
- **Info**: Bleu (#3b82f6)
- **Warning**: Orange (#f59e0b)

### Badges de Status
- **COURANT**: Badge bleu clair
- **EPARGNE**: Badge vert clair
- **DEPOT**: Badge vert
- **RETRAIT**: Badge rouge
- **VIREMENT**: Badge bleu

### Feedback Utilisateur
- ✅ **Messages de succès**: Fond vert clair
- ❌ **Messages d'erreur**: Fond rouge clair
- ⏳ **Loading**: Indicateur de chargement
- ⚠️ **Validation**: Champs en rouge avec message

### Responsive
- **Desktop**: Vue complète avec tableau
- **Tablette**: Adaptation des colonnes
- **Mobile**: Vue en cartes, navigation simplifiée

---

## 🔔 Notifications

### Types de Messages

**Succès** (vert):
- "Client créé avec succès"
- "Dépôt effectué avec succès"
- "Virement effectué avec succès"

**Erreur** (rouge):
- "Erreur lors de la création du client"
- "Solde insuffisant pour effectuer le retrait"
- "Compte non trouvé"

**Validation** (orange):
- "Ce champ est obligatoire"
- "Email invalide"
- "Le montant doit être supérieur à 0"

---

## ⌨️ Raccourcis et Astuces

### Navigation Rapide
- Clic sur le nom du client → Détails du client
- Clic sur le numéro de compte → Détails du compte
- Bouton "Retour" toujours présent en haut à droite

### Formulaires
- **Tab**: Naviguer entre les champs
- **Enter**: Soumettre le formulaire
- **Esc**: Peut annuler certaines modales

### Création Rapide
- Depuis les détails d'un client → Créer un compte directement
- Depuis les détails d'un compte → Faire une transaction directement

---

## 📱 Compatibilité

### Navigateurs Supportés
- ✅ Chrome (recommandé)
- ✅ Firefox
- ✅ Edge
- ✅ Safari

### Appareils
- ✅ Desktop (1920x1080 et +)
- ✅ Laptop (1366x768 et +)
- ✅ Tablette (768px et +)
- ✅ Mobile (320px et +)

---

## 🆘 Aide et Support

### Problèmes Courants

**"Erreur de connexion API"**
→ Vérifiez que le backend est démarré sur le port 8080

**"Compte non trouvé"**
→ Vérifiez le numéro de compte (sensible à la casse)

**"Solde insuffisant"**
→ Vérifiez le solde et le découvert autorisé

**"Email invalide"**
→ Utilisez un format email valide (exemple@domaine.com)

---

**Guide utilisateur - EGA Bank v1.0**
