package com.ega.egabank.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ega.egabank.dto.response.MessageResponse;
import com.ega.egabank.entity.User;
import com.ega.egabank.exception.ResourceNotFoundException;
import com.ega.egabank.repository.UserRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Contrôleur pour la gestion des utilisateurs (Admin uniquement)
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Utilisateurs", description = "Gestion des utilisateurs (Admin uniquement)")
public class UserController {

    private final UserRepository userRepository;

    @Operation(summary = "Activer un compte utilisateur")
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> activateUser(
            @Parameter(description = "Identifiant de l'utilisateur") @PathVariable Long id) {
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
    public ResponseEntity<MessageResponse> deactivateUser(
            @Parameter(description = "Identifiant de l'utilisateur") @PathVariable Long id) {
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
    public ResponseEntity<List<PendingUserResponse>> getPendingUsers() {
        List<User> pendingUsers = userRepository.findByEnabledFalse();
        List<PendingUserResponse> response = pendingUsers.stream()
                .map(user -> PendingUserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .createdAt(user.getCreatedAt())
                        .clientId(user.getClient() != null ? user.getClient().getId() : null)
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * DTO simple pour les utilisateurs en attente
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    static class PendingUserResponse {
        private Long id;
        private String username;
        private String email;
        private String role;
        private java.time.LocalDateTime createdAt;
        private Long clientId;
    }
}
