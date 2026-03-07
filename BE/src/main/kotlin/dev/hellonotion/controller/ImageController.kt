package dev.hellonotion.controller

import dev.hellonotion.service.ImageUploadService
import dev.hellonotion.security.JwtPrincipal
import org.slf4j.LoggerFactory
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

    private val log = LoggerFactory.getLogger(javaClass)

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun upload(
        @RequestParam("file") file: MultipartFile,
        @AuthenticationPrincipal principal: JwtPrincipal?,
    ): ResponseEntity<*> {
        log.debug("POST /api/v1/images principal={} file.isEmpty={} size={} contentType={}", principal?.userId, file.isEmpty, file.size, file.contentType)
        if (principal == null) {
            log.debug("POST /api/v1/images -> 401 (no principal)")
            return ResponseEntity.status(401).body(mapOf("error" to "unauthorized", "message" to "Login required"))
        }
        if (file.isEmpty) {
            log.debug("POST /api/v1/images -> 400 (empty file)")
            return ResponseEntity.badRequest().body(mapOf("error" to "bad_request", "message" to "File is required"))
        }
        val contentType = file.contentType?.takeIf { it.startsWith("image/") }
            ?: run {
                log.debug("POST /api/v1/images -> 400 (invalid contentType={})", file.contentType)
                return ResponseEntity.badRequest().body(mapOf("error" to "bad_request", "message" to "Content type must be image/*"))
            }
        if (contentType !in ImageUploadService.ALLOWED_CONTENT_TYPES) {
            log.debug("POST /api/v1/images -> 400 (contentType not allowed)")
            return ResponseEntity.badRequest().body(mapOf("error" to "bad_request", "message" to "Allowed types: jpeg, png, gif, webp"))
        }
        if (file.size > ImageUploadService.MAX_SIZE_BYTES) {
            log.debug("POST /api/v1/images -> 413 (size={} > max)", file.size)
            return ResponseEntity.status(413).body(mapOf("error" to "payload_too_large", "message" to "File size must not exceed 2MB"))
        }
        return try {
            val bytes = file.bytes
            val url = imageUploadService.uploadToStorage(bytes, contentType, principal.userId)
            log.info("POST /api/v1/images -> 200 userId={} url={}", principal.userId, url)
            ResponseEntity.ok(mapOf("url" to url))
        } catch (e: IllegalArgumentException) {
            log.warn("POST /api/v1/images -> 400 {}", e.message)
            ResponseEntity.badRequest().body(mapOf("error" to "bad_request", "message" to (e.message ?: "Invalid image")))
        } catch (e: Exception) {
            log.error("POST /api/v1/images -> 500", e)
            ResponseEntity.status(500).body(mapOf("error" to "internal_error", "message" to "Upload failed"))
        }
    }
}
