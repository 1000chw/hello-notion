package dev.hellonotion.security

import com.auth0.jwk.JwkProviderBuilder
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.DecodedJWT
import com.nimbusds.jose.jwk.ECKey
import com.nimbusds.jose.jwk.JWKSet
import dev.hellonotion.config.JwtProperties
import dev.hellonotion.config.SupabaseProperties
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter
import java.net.URL
import java.security.interfaces.ECPublicKey
import java.security.interfaces.RSAPublicKey
import java.util.concurrent.TimeUnit

/**
 * Validates Supabase JWT and sets Authentication for protected routes.
 * Expects: Authorization: Bearer &lt;access_token&gt;
 * Supports HS256 (JWT secret), RS256 and ES256 (JWKS from Supabase).
 */
class JwtAuthFilter(
    private val jwtProperties: JwtProperties,
    private val supabaseProperties: SupabaseProperties,
) : OncePerRequestFilter() {

    private val log = LoggerFactory.getLogger(javaClass)

    private val jwkProvider by lazy {
        val jwksUrl = "${supabaseProperties.url.trimEnd('/')}/auth/v1/.well-known/jwks.json"
        JwkProviderBuilder(URL(jwksUrl))
            .cached(10, 24, TimeUnit.HOURS)
            .build()
    }

    /** ES256용: jwks-rsa는 EC 미지원이라 Nimbus로 JWKS 파싱 (캐시 24h) */
    @Volatile
    private var es256JwkSetCache: Pair<JWKSet, Long>? = null

    private fun getEs256PublicKey(keyId: String): ECPublicKey {
        val jwksUrl = "${supabaseProperties.url.trimEnd('/')}/auth/v1/.well-known/jwks.json"
        val now = System.currentTimeMillis()
        val cached = es256JwkSetCache
        val jwkSet = if (cached != null && (now - cached.second) < 24 * 60 * 60 * 1000) {
            cached.first
        } else {
            val set = JWKSet.load(URL(jwksUrl))
            es256JwkSetCache = set to now
            set
        }
        val jwk = jwkSet.keys.firstOrNull { it.keyID == keyId }
            ?: throw IllegalStateException("JWK not found for kid=$keyId")
        val ecKey = jwk as? ECKey ?: throw IllegalStateException("JWK is not an EC key")
        return ecKey.toECPublicKey()
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val token = extractToken(request)
        val path = request.requestURI

        if (token != null && (jwtProperties.isConfigured() || supabaseProperties.url.isNotBlank())) {
            try {
                val decoded = verifyToken(token)
                val userId = decoded.subject
                val email = decoded.getClaim("email")?.asString()
                val role = decoded.getClaim("role")?.asString() ?: "authenticated"

                val principal = JwtPrincipal(userId, email, role)
                SecurityContextHolder.getContext().authentication =
                    UsernamePasswordAuthenticationToken(principal, null, emptyList())
                log.debug("JWT valid path={} userId={}", path, userId)
            } catch (e: Exception) {
                log.debug("JWT invalid path={} error={} (token length={} parts={})", path, e.message, token.length, token.count { it == '.' })
                log.trace("JWT verify failure", e)
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token")
                return
            }
        } else if (token != null && !jwtProperties.isConfigured() && !supabaseProperties.url.isNotBlank()) {
            log.debug("JWT skipped (no secret and no supabase url) path={}", path)
        } else if (token == null) {
            log.trace("No Authorization header path={}", path)
        }

        filterChain.doFilter(request, response)
    }

    private fun verifyToken(token: String): DecodedJWT {
        val unverified = JWT.decode(token)
        val alg = unverified.algorithm ?: ""

        return when {
            alg.equals("HS256", ignoreCase = true) && jwtProperties.isConfigured() -> {
                val algorithm = Algorithm.HMAC256(jwtProperties.secret)
                JWT.require(algorithm).apply {
                    jwtProperties.issuer?.let { withIssuer(it) }
                }.build().verify(token)
            }
            alg.equals("RS256", ignoreCase = true) && supabaseProperties.url.isNotBlank() -> {
                val keyId = unverified.keyId ?: throw IllegalStateException("JWT has no kid (key id)")
                val jwk = jwkProvider.get(keyId)
                val rsaPublicKey = jwk.publicKey as? RSAPublicKey
                    ?: throw IllegalStateException("JWK is not an RSA public key")
                val algorithm = Algorithm.RSA256(rsaPublicKey, null)
                JWT.require(algorithm).build().verify(token)
            }
            alg.equals("ES256", ignoreCase = true) && supabaseProperties.url.isNotBlank() -> {
                val keyId = unverified.keyId ?: throw IllegalStateException("JWT has no kid (key id)")
                val ecPublicKey = getEs256PublicKey(keyId)
                val algorithm = Algorithm.ECDSA256(ecPublicKey, null)
                JWT.require(algorithm).build().verify(token)
            }
            else -> throw IllegalArgumentException("Unsupported or missing algorithm: $alg (configure JWT secret for HS256 or Supabase URL for RS256/ES256)")
        }
    }

    private fun extractToken(request: HttpServletRequest): String? {
        val header = request.getHeader("Authorization") ?: return null
        if (!StringUtils.startsWithIgnoreCase(header, "Bearer ")) return null
        val raw = header.substring(7).trim()
        return raw.replace("\r", "").replace("\n", "").replace(" ", "").takeIf { it.isNotBlank() }
    }
}
