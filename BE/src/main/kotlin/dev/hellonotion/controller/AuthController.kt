package dev.hellonotion.controller

import dev.hellonotion.dto.MeResponse
import dev.hellonotion.security.JwtPrincipal
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController {

    private val log = LoggerFactory.getLogger(javaClass)

    /**
     * Returns the current user from the validated Supabase JWT.
     * Requires: Authorization: Bearer &lt;access_token&gt;
     */
    @GetMapping("/me")
    fun me(@AuthenticationPrincipal principal: JwtPrincipal?): ResponseEntity<MeResponse> {
        log.debug("GET /api/v1/auth/me principal={}", if (principal != null) "userId=${principal.userId}" else "null")
        if (principal == null) {
            log.debug("GET /api/v1/auth/me -> 401 (no principal)")
            return ResponseEntity.status(401).build()
        }
        log.debug("GET /api/v1/auth/me -> 200 userId={} email={}", principal.userId, principal.email)
        return ResponseEntity.ok(
            MeResponse(
                id = principal.userId,
                email = principal.email,
                role = principal.role,
            ),
        )
    }
}
