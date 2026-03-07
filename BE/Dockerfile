# Stage 1: Build JAR with Gradle
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Gradle wrapper + project config (캐시 활용)
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts gradle.properties ./

# 의존성만 다운로드 (소스 없이, 레이어 캐시용)
RUN ./gradlew dependencies --no-daemon || true

# 소스 복사 후 JAR 빌드 (bootJar → build/libs/*.jar)
COPY src src
RUN ./gradlew bootJar --no-daemon

# Stage 2: Run JAR
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# builder에서 생성한 JAR만 복사 (hello-notion-backend-*.jar)
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
