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
import com.ega.egabank.mapper.ClientMapper;
import com.ega.egabank.repository.ClientRepository;
import com.ega.egabank.repository.UserRepository;
import com.ega.egabank.security.JwtTokenProvider;
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

    @Override
    public AuthResponse register(RegisterRequest request) {
        log.info("Inscription d'un nouvel utilisateur: {}", request.getUsername());

        // Vérifier l'unicité du username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Utilisateur", "username", request.getUsername());
        }

        // Vérifier l'unicité de l'email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Utilisateur", "email", request.getEmail());
        }

        Client client = ensureClientForRegistration(request.getEmail());

        // Créer l'utilisateur
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .enabled(true)
                .client(client)
                .build();

        user = userRepository.save(user);

        // Générer les tokens
        String accessToken = tokenProvider.generateAccessToken(user.getUsername());
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        log.info("Utilisateur créé avec succès: {}", user.getUsername());

        return AuthResponse.of(
                accessToken,
                refreshToken,
                tokenProvider.getExpirationTime(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Tentative de connexion pour: {}", request.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        log.info("Connexion réussie pour: {}", request.getUsername());

        return AuthResponse.of(
                accessToken,
                refreshToken,
                tokenProvider.getExpirationTime(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name());
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
                user.getRole().name());
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
                user.getRole().name());
    }

    private Client ensureClientForRegistration(String email) {
        return clientRepository.findByCourriel(email)
                .orElseGet(() -> clientRepository.save(Client.builder().courriel(email).build()));
    }
}
