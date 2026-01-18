package com.ega.egabank.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ega.egabank.dto.request.AdminCreateUserRequest;
import com.ega.egabank.dto.request.LoginRequest;
import com.ega.egabank.dto.request.RegisterRequest;
import com.ega.egabank.dto.response.AuthResponse;
import com.ega.egabank.entity.Client;
import com.ega.egabank.entity.User;
import com.ega.egabank.enums.Role;
import com.ega.egabank.exception.DuplicateResourceException;
import com.ega.egabank.exception.OperationNotAllowedException;
import com.ega.egabank.mapper.ClientMapper;
import com.ega.egabank.repository.ClientRepository;
import com.ega.egabank.repository.UserRepository;
import com.ega.egabank.security.JwtTokenProvider;
import com.ega.egabank.security.SecurityService;
import com.ega.egabank.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implémentation du service d'authentification
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final SecurityService securityService;


    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Tentative de connexion pour: {}", request.getUsername());

        // Vérifier d'abord si le compte existe et est activé
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier si le compte est activé
        if (!user.getEnabled()) {
            log.warn("Tentative de connexion avec un compte inactif: {}", request.getUsername());
            throw new OperationNotAllowedException(
                    "Votre compte est en attente de validation par un administrateur. " +
                    "Vous recevrez un email une fois votre compte activé.");
        }

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

        // 3. CRÉATION DU USER (INACTIF - en attente de validation)
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .enabled(false) // Compte inactif jusqu'à validation par admin
                .mustChangePassword(false)
                .client(client)
                .build();

        user = userRepository.save(user);

        log.info("Compte créé en attente de validation pour: {}", request.getUsername());

        // 4. Retourner une réponse indiquant que le compte est en attente
        return AuthResponse.pending(
                user.getUsername(),
                user.getEmail(),
                user.getRole().name());
    }

    @Override
    public void changePassword(String currentPassword, String newPassword) {
        User user = securityService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Mot de passe actuel incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setMustChangePassword(false);
        userRepository.save(user);
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        log.info("Rafraîchissement du token");

        if (!tokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Token de rafraîchissement invalide");
        }

        String username = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String newAccessToken = tokenProvider.generateAccessToken(username);
        String newRefreshToken = tokenProvider.generateRefreshToken(username);

        log.info("Token rafraîchi avec succès pour: {}", username);

        return AuthResponse.of(
                newAccessToken,
                newRefreshToken,
                tokenProvider.getExpirationTime(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getMustChangePassword());
    }

    @Override
    public AuthResponse createClientUser(AdminCreateUserRequest request) {
        log.info("Création admin d'un client + utilisateur: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Utilisateur", "username", request.getUsername());
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Utilisateur", "email", request.getEmail());
        }

        if (request.getClient().getCourriel() != null
                && clientRepository.existsByCourriel(request.getClient().getCourriel())) {
            throw new DuplicateResourceException("Client", "courriel", request.getClient().getCourriel());
        }

        Client client = clientMapper.toEntity(request.getClient());
        if (client.getCourriel() == null || client.getCourriel().isBlank()) {
            client.setCourriel(request.getEmail());
        }
        client = clientRepository.save(client);

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .enabled(true)
                .mustChangePassword(true)
                .client(client)
                .build();

        user = userRepository.save(user);

        String accessToken = tokenProvider.generateAccessToken(user.getUsername());
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        return AuthResponse.of(
                accessToken,
                refreshToken,
                tokenProvider.getExpirationTime(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getMustChangePassword());
    }

}
