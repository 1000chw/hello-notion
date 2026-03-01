package dev.hellonotion.dto

/**
 * Current user info from Supabase JWT.
 */
data class MeResponse(
    val id: String,
    val email: String?,
    val role: String,
)
