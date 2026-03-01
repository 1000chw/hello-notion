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
import javax.imageio.IIOImage
import javax.imageio.ImageIO
import javax.imageio.ImageWriteParam
import javax.imageio.stream.ImageOutputStream

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
        val webpBytes = convertToWebP(bufferedImage)
        val fileName = "${UUID.randomUUID()}.webp"
        val objectPath = "$userId/$fileName"

        val uploadUrl = "${supabaseProperties.url.trimEnd('/')}/storage/v1/object/$BUCKET/$objectPath"
        webClient.build()
            .post()
            .uri(uploadUrl)
            .header(HttpHeaders.AUTHORIZATION, "Bearer ${supabaseProperties.serviceRoleKey}")
            .header("apikey", supabaseProperties.serviceRoleKey)
            .contentType(MediaType.parseMediaType("image/webp"))
            .body(BodyInserters.fromValue(webpBytes))
            .retrieve()
            .bodyToMono<String>()
            .block() ?: ""

        return "${supabaseProperties.url.trimEnd('/')}/storage/v1/object/public/$BUCKET/$objectPath"
    }

    private fun convertToWebP(image: BufferedImage): ByteArray {
        val out = ByteArrayOutputStream()
        val writerIter = ImageIO.getImageWritersByFormatName("webp")
        val writer = if (writerIter.hasNext()) writerIter.next() else ImageIO.getImageWritersByFormatName("WebP").let { if (it.hasNext()) it.next() else null }
            ?: throw IllegalStateException("WebP ImageWriter not available (check imageio-webp dependency)")
        try {
            val ios = ImageIO.createImageOutputStream(out)
            writer.output = ios
            val param = writer.defaultWriteParam
            if (param is ImageWriteParam) {
                param.compressionMode = ImageWriteParam.MODE_EXPLICIT
                param.compressionQuality = 0.85f
            }
            writer.write(null, IIOImage(image, null, null), param)
            ios.close()
        } finally {
            writer.dispose()
        }
        return out.toByteArray()
    }
}
