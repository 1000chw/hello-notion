package dev.hellonotion.security

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import dev.hellonotion.config.JwtProperties
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter

/**
 * Validates Supabase JWT and sets Authentication for protected routes.
 * Expects: Authorization: Bearer &lt;access_token&gt;
 */
class JwtAuthFilter(private val jwtProperties: JwtProperties) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val token = extractToken(request)

        if (token != null && jwtProperties.isConfigured()) {
            try {
                val algorithm = Algorithm.HMAC256(jwtProperties.secret)
                val verifier = JWT.require(algorithm).apply {
                    jwtProperties.issuer?.let { withIssuer(it) }
                }.build()
                val decoded = verifier.verify(token)

                val userId = decoded.subject
                val email = decoded.getClaim("email")?.asString()
                val role = decoded.getClaim("role")?.asString() ?: "authenticated"

                val principal = JwtPrincipal(userId, email, role)
                SecurityContextHolder.getContext().authentication =
                    UsernamePasswordAuthenticationToken(principal, null, emptyList())
            } catch (e: Exception) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token")
                return
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun extractToken(request: HttpServletRequest): String? {
        val header = request.getHeader("Authorization") ?: return null
        if (!StringUtils.startsWithIgnoreCase(header, "Bearer ")) return null
        return header.substring(7).trim().takeIf { it.isNotBlank() }
    }
}
