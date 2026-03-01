package dev.hellonotion.controller

import dev.hellonotion.dto.MeResponse
import dev.hellonotion.security.JwtPrincipal
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController {

    /**
     * Returns the current user from the validated Supabase JWT.
     * Requires: Authorization: Bearer &lt;access_token&gt;
     */
    @GetMapping("/me")
    fun me(@AuthenticationPrincipal principal: JwtPrincipal?): ResponseEntity<MeResponse> {
        if (principal == null) {
            return ResponseEntity.status(401).build()
        }
        return ResponseEntity.ok(
            MeResponse(
                id = principal.userId,
                email = principal.email,
                role = principal.role,
            ),
        )
    }
}
