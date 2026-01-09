package com.ega.egabank.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ega.egabank.dto.request.OperationRequest;
import com.ega.egabank.dto.request.TransferRequest;
import com.ega.egabank.dto.response.TransactionResponse;
import com.ega.egabank.service.TransactionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Contrôleur pour les opérations bancaires
 */
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Opérations bancaires (dépôt, retrait, virement)")
public class TransactionController {

    private final TransactionService transactionService;

    @Operation(summary = "Effectuer un dépôt sur un compte")
    @PostMapping("/{numeroCompte}/deposit")
    public ResponseEntity<TransactionResponse> deposit(
            @Parameter(description = "Numéro de compte (IBAN)") @PathVariable String numeroCompte,
            @Valid @RequestBody OperationRequest request) {
        TransactionResponse response = transactionService.deposit(numeroCompte, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Effectuer un retrait sur un compte")
    @PostMapping("/{numeroCompte}/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(
            @Parameter(description = "Numéro de compte (IBAN)") @PathVariable String numeroCompte,
            @Valid @RequestBody OperationRequest request) {
        TransactionResponse response = transactionService.withdraw(numeroCompte, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Effectuer un virement entre deux comptes")
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(@Valid @RequestBody TransferRequest request) {
        TransactionResponse response = transactionService.transfer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Récupérer toutes les transactions de tous les comptes")
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @Operation(summary = "Récupérer l'historique des transactions d'un compte sur une période")
    @GetMapping("/{numeroCompte}/history")
    public ResponseEntity<List<TransactionResponse>> getTransactionHistory(
            @Parameter(description = "Numéro de compte (IBAN)") @PathVariable String numeroCompte,
            @Parameter(description = "Date de début (format: yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @Parameter(description = "Date de fin (format: yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(transactionService.getTransactionHistory(numeroCompte, debut, fin));
    }

    @Operation(summary = "Récupérer toutes les transactions d'un compte")
    @GetMapping("/{numeroCompte}")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions(
            @PathVariable String numeroCompte) {
        return ResponseEntity.ok(transactionService.getAllTransactionsByAccount(numeroCompte));
    }
}
