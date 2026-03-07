import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile

plugins {
    kotlin("jvm") version "2.2.21"
    kotlin("plugin.spring") version "2.2.21"
    id("org.springframework.boot") version "3.4.5"
    id("io.spring.dependency-management") version "1.1.6"
}

java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    // JWT validation (Supabase: HS256 with JWT secret, RS256/ES256 with JWKS)
    implementation("com.auth0:java-jwt:4.4.0")
    implementation("com.auth0:jwks-rsa:0.23.0")
    implementation("com.nimbusds:nimbus-jose-jwt:10.6")

    // WebP image encoding for widget background uploads
    implementation("com.twelvemonkeys.imageio:imageio-webp:3.13.0")

    // Netty native DNS on macOS (silences MacOSDnsServerAddressStreamProvider fallback warning)
    runtimeOnly("io.netty:netty-resolver-dns-native-macos:4.1.104.Final:osx-aarch_64")
    runtimeOnly("io.netty:netty-resolver-dns-native-macos:4.1.104.Final:osx-x86_64")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<KotlinJvmCompile>().configureEach {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

// Load BE/env.txt into environment when running bootRun (Spring Boot does not load env.txt by default)
tasks.named<org.springframework.boot.gradle.tasks.run.BootRun>("bootRun") {
    val envFile = layout.projectDirectory.file("env.txt")
    if (envFile.asFile.exists()) {
        envFile.asFile.readLines().forEach { line ->
            val trimmed = line.trim()
            if (trimmed.isNotEmpty() && !trimmed.startsWith("#") && trimmed.contains("=")) {
                val idx = trimmed.indexOf('=')
                val key = trimmed.substring(0, idx).trim()
                var value = trimmed.substring(idx + 1).trim()
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.drop(1).dropLast(1)
                }
                environment(key, value)
            }
        }
    }
}
