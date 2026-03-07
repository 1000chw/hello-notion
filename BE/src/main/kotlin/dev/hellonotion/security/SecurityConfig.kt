package dev.hellonotion.security

import dev.hellonotion.config.JwtProperties
import dev.hellonotion.config.SupabaseProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfigurationSource

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(JwtProperties::class, SupabaseProperties::class)
class SecurityConfig(
    private val jwtProperties: JwtProperties,
    private val supabaseProperties: SupabaseProperties,
    private val corsConfigurationSource: CorsConfigurationSource,
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain =
        http
            .cors { it.configurationSource(corsConfigurationSource) }
            .csrf { it.disable() }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authorizeHttpRequests {
                it.requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                it.requestMatchers("/api/v1/auth/me").authenticated()
                it.requestMatchers("/api/v1/images/**").authenticated()
                it.anyRequest().permitAll()
            }
            .addFilterBefore(JwtAuthFilter(jwtProperties, supabaseProperties), UsernamePasswordAuthenticationFilter::class.java)
            .build()
}
