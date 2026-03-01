package dev.hellonotion.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

/**
 * CORS for FE development. Allow localhost:3000 (Next.js dev).
 */
@Configuration
class WebConfig {

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val config = CorsConfiguration().apply {
            allowedOrigins = listOf("http://localhost:3000", "http://127.0.0.1:3000")
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
            allowedHeaders = listOf("Authorization", "Content-Type")
        }
        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/api/**", config)
        }
    }
}
