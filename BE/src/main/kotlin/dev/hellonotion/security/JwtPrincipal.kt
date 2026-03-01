package dev.hellonotion.security

import java.security.Principal

/**
 * Principal extracted from validated Supabase JWT.
 * sub = user id, email/role from claims.
 */
data class JwtPrincipal(
    val userId: String,
    val email: String?,
    val role: String,
) : Principal {
    override fun getName(): String = userId
}
