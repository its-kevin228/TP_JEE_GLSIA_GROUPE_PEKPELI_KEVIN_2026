package com.ega.egabank.security;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ega.egabank.entity.User;
import com.ega.egabank.enums.Role;
import com.ega.egabank.repository.AccountRepository;
import com.ega.egabank.repository.ClientRepository;
import com.ega.egabank.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service utilitaire pour les vérifications d'appartenance (client/compte).
 */
@Service("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final ClientRepository clientRepository;

    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username);
    }

    public Long getCurrentClientId() {
        return getCurrentUser()
                .map(this::resolveClientId)
                .orElse(null);
    }

    public boolean isAdmin() {
        return getCurrentUser()
                .map(User::getRole)
                .map(role -> role == Role.ROLE_ADMIN)
                .orElse(false);
    }

    public boolean isClientOwner(Long clientId) {
        Long currentClientId = getCurrentClientId();
        return currentClientId != null && currentClientId.equals(clientId);
    }

    public boolean isAccountOwner(String numeroCompte) {
        Long currentClientId = getCurrentClientId();
        if (currentClientId == null) {
            return false;
        }
        return accountRepository.existsByNumeroCompteAndProprietaireId(numeroCompte, currentClientId);
    }

    private Long resolveClientId(User user) {
        if (user.getClient() != null) {
            return user.getClient().getId();
        }
        return clientRepository.findByCourriel(user.getEmail())
                .map(client -> client.getId())
                .orElse(null);
    }
}
