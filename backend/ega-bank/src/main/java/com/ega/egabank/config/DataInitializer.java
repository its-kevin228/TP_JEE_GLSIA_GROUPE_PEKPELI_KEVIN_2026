package com.ega.egabank.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ega.egabank.entity.Client;
import com.ega.egabank.entity.User;
import com.ega.egabank.enums.Role;
import com.ega.egabank.repository.ClientRepository;
import com.ega.egabank.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Configuration pour initialiser les données par défaut de l'application
 * Crée automatiquement un compte administrateur au démarrage si aucun n'existe
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Bean CommandLineRunner qui s'exécute au démarrage de l'application
     * pour créer un compte administrateur par défaut
     */
    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            log.info("🚀 Initialisation de la base de données...");

            // Vérifier si un admin existe déjà
            boolean adminExists = userRepository.existsByRole(Role.ROLE_ADMIN);

            if (!adminExists) {
                log.info("⚠️  Aucun compte administrateur trouvé. Création du compte admin par défaut...");

                // Créer un client pour l'admin
                Client adminClient = Client.builder()
                        .nom("Administrateur")
                        .prenom("Système")
                        .courriel("admin@egabank.com")
                        .build();

                adminClient = clientRepository.save(adminClient);
                log.info("✅ Client admin créé avec ID: {}", adminClient.getId());

                // Créer l'utilisateur admin
                User admin = User.builder()
                        .username("admin")
                        .email("admin@egabank.com")
                        .password(passwordEncoder.encode("Admin123!"))
                        .role(Role.ROLE_ADMIN)
                        .enabled(true)
                        .mustChangePassword(false)
                        .client(adminClient)
                        .build();

                userRepository.save(admin);
                log.info("✅ Compte administrateur créé avec succès!");
                log.info("   📧 Email: admin@egabank.com");
                log.info("   👤 Username: admin");
                log.info("   🔑 Password: Admin123!");
                log.info("   ⚠️  IMPORTANT: Changez le mot de passe par défaut en production!");
            } else {
                log.info("✅ Un compte administrateur existe déjà. Pas de création nécessaire.");
            }

            log.info("🎉 Initialisation terminée!");
        };
    }
}
