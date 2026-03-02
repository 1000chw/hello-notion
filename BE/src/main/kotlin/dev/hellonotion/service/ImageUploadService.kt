package dev.hellonotion.service

import dev.hellonotion.config.SupabaseProperties
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.bodyToMono
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.util.UUID
import javax.imageio.ImageIO
import javax.imageio.spi.IIORegistry

@Service
class ImageUploadService(
    private val supabaseProperties: SupabaseProperties,
    private val webClient: WebClient.Builder,
) {

    companion object {
        const val BUCKET = "widget-images"
        const val MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2MB
        val ALLOWED_CONTENT_TYPES = setOf(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        )
        @Volatile
        private var webPSpiRegistered = false
        private val webPSpiLock = Any()
    }

    fun uploadToStorage(
        imageBytes: ByteArray,
        contentType: String,
        userId: String,
    ): String {
        require(supabaseProperties.isConfigured()) { "Supabase URL and service role key must be set" }
        require(imageBytes.size <= MAX_SIZE_BYTES) { "File size must not exceed 2MB" }
        require(contentType in ALLOWED_CONTENT_TYPES) { "Content type $contentType is not allowed" }

        val bufferedImage = ImageIO.read(imageBytes.inputStream())
            ?: throw IllegalArgumentException("Unsupported or invalid image format")

        val (bodyBytes, contentTypeToUse, ext) = try {
            ensureWebPSpiRegistered()
            val out = ByteArrayOutputStream()
            if (ImageIO.write(bufferedImage, "webp", out)) {
                Triple(out.toByteArray(), MediaType.parseMediaType("image/webp"), "webp")
            } else {
                useOriginal(imageBytes, contentType)
            }
        } catch (_: Exception) {
            useOriginal(imageBytes, contentType)
        }

        val fileName = "${UUID.randomUUID()}.$ext"
        val objectPath = "$userId/$fileName"
        val uploadUrl = "${supabaseProperties.url.trimEnd('/')}/storage/v1/object/$BUCKET/$objectPath"
        webClient.build()
            .post()
            .uri(uploadUrl)
            .header(HttpHeaders.AUTHORIZATION, "Bearer ${supabaseProperties.serviceRoleKey}")
            .header("apikey", supabaseProperties.serviceRoleKey)
            .contentType(contentTypeToUse)
            .body(BodyInserters.fromValue(bodyBytes))
            .retrieve()
            .bodyToMono<String>()
            .block() ?: ""

        return "${supabaseProperties.url.trimEnd('/')}/storage/v1/object/public/$BUCKET/$objectPath"
    }

    private fun useOriginal(imageBytes: ByteArray, contentType: String): Triple<ByteArray, MediaType, String> {
        val (mediaType, ext) = when {
            contentType.contains("jpeg") || contentType.contains("jpg") ->
                MediaType.parseMediaType("image/jpeg") to "jpg"
            contentType.contains("png") -> MediaType.parseMediaType("image/png") to "png"
            contentType.contains("gif") -> MediaType.parseMediaType("image/gif") to "gif"
            contentType.contains("webp") -> MediaType.parseMediaType("image/webp") to "webp"
            else -> MediaType.parseMediaType("image/png") to "png"
        }
        return Triple(imageBytes, mediaType, ext)
    }

    private fun ensureWebPSpiRegistered() {
        if (webPSpiRegistered) return
        synchronized(webPSpiLock) {
            if (webPSpiRegistered) return
            try {
                val spiClass = Class.forName("com.twelvemonkeys.imageio.plugins.webp.WebPImageWriterSpi")
                val spi = spiClass.getDeclaredConstructor().newInstance() as javax.imageio.spi.ImageWriterSpi
                IIORegistry.getDefaultInstance().registerServiceProvider(spi)
            } catch (_: Exception) { }
            webPSpiRegistered = true
        }
    }
}
