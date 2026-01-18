package com.ega.egabank.service;

import com.ega.egabank.dto.request.LoginRequest;
import com.ega.egabank.dto.request.RegisterRequest;
import com.ega.egabank.dto.request.AdminCreateUserRequest;
import com.ega.egabank.dto.response.AuthResponse;

/**
 * Service pour l'authentification
 */
public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(String refreshToken);

    AuthResponse createClientUser(AdminCreateUserRequest request);
}
