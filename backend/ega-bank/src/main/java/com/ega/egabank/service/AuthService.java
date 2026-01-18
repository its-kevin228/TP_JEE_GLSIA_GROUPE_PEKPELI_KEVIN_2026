package com.ega.egabank.service;

import com.ega.egabank.dto.request.LoginRequest;
import com.ega.egabank.dto.request.RegisterRequest;
import com.ega.egabank.dto.request.AdminCreateUserRequest;
import com.ega.egabank.dto.response.AuthResponse;

/**
 * Service pour l'authentification
 */
public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    AuthResponse refreshToken(String refreshToken);

    AuthResponse createClientUser(AdminCreateUserRequest request);

    void changePassword(String currentPassword, String newPassword);
}
