package com.ega.egabank.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ega.egabank.dto.request.ClientRequest;
import com.ega.egabank.dto.response.ClientResponse;
import com.ega.egabank.dto.response.MessageResponse;
import com.ega.egabank.dto.response.PageResponse;
import com.ega.egabank.service.ClientService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Contrôleur pour la gestion des clients
 */
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@Tag(name = "Clients", description = "CRUD des clients")
public class ClientController {

    private final ClientService clientService;

    @Operation(summary = "Récupérer tous les clients avec pagination")
    @GetMapping
    public ResponseEntity<PageResponse<ClientResponse>> getAllClients(
            @Parameter(description = "Numéro de page (commence à 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de la page") @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(clientService.getAllClients(page, size));
    }

    @Operation(summary = "Rechercher des clients")
    @GetMapping("/search")
    public ResponseEntity<PageResponse<ClientResponse>> searchClients(
            @Parameter(description = "Terme de recherche (nom, prénom, courriel)") @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(clientService.searchClients(q, page, size));
    }

    @Operation(summary = "Récupérer un client par son ID")
    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getClientById(
            @Parameter(description = "Identifiant du client") @PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @Operation(summary = "Récupérer un client avec ses comptes")
    @GetMapping("/{id}/details")
    public ResponseEntity<ClientResponse> getClientWithAccounts(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientWithAccounts(id));
    }

    @Operation(summary = "Créer un nouveau client")
    @PostMapping
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest request) {
        ClientResponse response = clientService.createClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Mettre à jour un client")
    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(clientService.updateClient(id, request));
    }

    @Operation(summary = "Supprimer un client")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok(MessageResponse.success("Client supprimé avec succès"));
    }
}
