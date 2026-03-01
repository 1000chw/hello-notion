package dev.hellonotion.config

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * Supabase JWT validation settings.
 * JWT secret from Supabase: Project Settings > API > JWT Secret (legacy).
 * For JWKS-based projects, consider extending to support jwks_uri.
 */
@ConfigurationProperties(prefix = "supabase.jwt")
data class JwtProperties(
    val secret: String = "",
    val issuer: String? = null, // optional: validate iss claim e.g. "https://<project>.supabase.co/auth/v1"
) {
    fun isConfigured(): Boolean = secret.isNotBlank()
}
