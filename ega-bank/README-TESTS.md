# 🧪 Guide de Test des APIs EGA Bank

## 📋 Ordre de Tests Recommandé

### ✅ **Phase 1 : Clients**
1. **Créer Client 1** (Kofi KOUASSI)
2. **Créer Client 2** (Aminata TRAORE)
3. **Liste tous les clients** - Vérifier les 2 clients
4. **Récupérer client par ID** - Tester avec ID=1
5. **Modifier un client** - Changer l'adresse du client 1
6. **Rechercher clients** - Rechercher "KOUASSI"

### ✅ **Phase 2 : Comptes**
1. **Créer Compte Courant** pour Client 1 (découvert: 50000)
2. **Créer Compte Épargne** pour Client 1 (taux: 3.5%)
3. **Créer Compte Courant** pour Client 2 (découvert: 30000)
4. **Liste tous les comptes** - Vérifier les 3 comptes
5. **Comptes d'un client** - Voir les 2 comptes du Client 1
6. **Récupérer compte par numéro IBAN** - Utiliser le numéro IBAN reçu

### ✅ **Phase 3 : Transactions**
1. **Dépôt sur compte 1** - 100 000 FCFA
2. **Dépôt sur compte 2** - 50 000 FCFA
3. **Retrait** - 25 000 FCFA du compte 1
4. **Virement** - 15 000 FCFA du compte 1 vers compte 2
5. **Historique d'un compte** - Voir toutes les transactions
6. **Transactions par période** - Filtrer par date
7. **Toutes les transactions** - Vue globale

### ⚠️ **Phase 4 : Tests d'Erreurs**
1. **Email existant** - Doit retourner erreur 409
2. **Solde insuffisant** - Doit retourner erreur 400
3. **Client inexistant** - Doit retourner erreur 404
4. **Email invalide** - Doit retourner erreur de validation

---

## 📝 Notes Importantes

### 🔑 Numéros IBAN
⚠️ **IMPORTANT** : Les numéros IBAN sont générés automatiquement. Après avoir créé un compte :
1. Notez le `numeroCompte` retourné dans la réponse
2. Utilisez ce numéro pour les transactions

**Exemple de réponse après création de compte :**
```json
{
  "id": 1,
  "numeroCompte": "CI93123456789001234567890",  ← Copiez ce numéro !
  "type": "COURANT",
  "solde": 0,
  ...
}
```

### 💡 Données d'Exemple

#### Client 1 - Kofi KOUASSI
- Email: kofi.kouassi@example.com
- Téléphone: +2250708123456
- 2 comptes : Courant + Épargne

#### Client 2 - Aminata TRAORE
- Email: aminata.traore@example.com
- Téléphone: +2250709987654
- 1 compte : Courant

### 🎯 Scénario de Test Complet

```
1. Créer 2 clients
2. Créer 3 comptes (2 pour client 1, 1 pour client 2)
3. Faire un dépôt de 100 000 FCFA sur compte courant client 1
4. Faire un dépôt de 50 000 FCFA sur compte épargne client 1
5. Retirer 25 000 FCFA du compte courant
6. Virer 15 000 FCFA du compte courant vers l'épargne
7. Consulter l'historique

Résultat attendu :
- Compte courant : 60 000 FCFA (100000 - 25000 - 15000)
- Compte épargne : 65 000 FCFA (50000 + 15000)
```

---

## 🚀 Import dans Postman

1. Ouvrir Postman
2. Cliquer sur **Import**
3. Sélectionner le fichier `EGA-Bank-API-Tests.postman_collection.json`
4. La collection apparaîtra avec tous les tests organisés

---

## 🔧 Configuration

**Base URL** : `http://localhost:8080`

Toutes les requêtes utilisent cette URL de base. Assurez-vous que l'application Spring Boot est démarrée.

---

## ✨ Fonctionnalités Testées

✅ CRUD Clients  
✅ CRUD Comptes (Courant & Épargne)  
✅ Dépôt (Versement)  
✅ Retrait  
✅ Virement entre comptes  
✅ Historique des transactions  
✅ Filtrage par période  
✅ Validations (email, téléphone, montants)  
✅ Gestion d'erreurs (404, 400, 409)  
✅ Génération automatique IBAN  
✅ Solde insuffisant  
✅ Découvert autorisé  

Bon test ! 🎉
