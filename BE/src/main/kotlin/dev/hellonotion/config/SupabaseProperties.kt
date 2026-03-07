package dev.hellonotion.config

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * Supabase project URL and service role key for server-side operations (e.g. Storage upload).
 * Do not expose service role key to the client.
 */
@ConfigurationProperties(prefix = "supabase")
data class SupabaseProperties(
    val url: String = "",
    val serviceRoleKey: String = "",
) {
    fun isConfigured(): Boolean = url.isNotBlank() && serviceRoleKey.isNotBlank()
}
