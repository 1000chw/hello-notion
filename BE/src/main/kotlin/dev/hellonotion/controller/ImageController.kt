package dev.hellonotion.controller

import dev.hellonotion.service.ImageUploadService
import dev.hellonotion.security.JwtPrincipal
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/v1/images")
class ImageController(
    private val imageUploadService: ImageUploadService,
) {

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun upload(
        @RequestParam("file") file: MultipartFile,
        @AuthenticationPrincipal principal: JwtPrincipal?,
    ): ResponseEntity<*> {
        if (principal == null) {
            return ResponseEntity.status(401).body(mapOf("error" to "unauthorized", "message" to "Login required"))
        }
        if (file.isEmpty) {
            return ResponseEntity.badRequest().body(mapOf("error" to "bad_request", "message" to "File is required"))
        }
        val contentType = file.contentType?.takeIf { it.startsWith("image/") }
            ?: return ResponseEntity.badRequest().body(mapOf("error" to "bad_request", "message" to "Content type must be image/*"))
        if (contentType !in ImageUploadService.ALLOWED_CONTENT_TYPES) {
            return ResponseEntity.badRequest().body(mapOf("error" to "bad_request", "message" to "Allowed types: jpeg, png, gif, webp"))
        }
        if (file.size > ImageUploadService.MAX_SIZE_BYTES) {
            return ResponseEntity.status(413).body(mapOf("error" to "payload_too_large", "message" to "File size must not exceed 2MB"))
        }
        return try {
            val bytes = file.bytes
            val url = imageUploadService.uploadToStorage(bytes, contentType, principal.userId)
            ResponseEntity.ok(mapOf("url" to url))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("error" to "bad_request", "message" to (e.message ?: "Invalid image")))
        } catch (e: Exception) {
            ResponseEntity.status(500).body(mapOf("error" to "internal_error", "message" to "Upload failed"))
        }
    }
}
