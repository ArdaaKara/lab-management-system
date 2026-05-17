# ── Stage 1: Build ────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# pom.xml ayrı kopyalanır; bağımlılıklar yalnızca pom.xml değişince yeniden indirilir.
COPY pom.xml .
RUN mvn dependency:go-offline -B -q

COPY src ./src
ARG APP_VERSION=dev
RUN mvn clean package -DskipTests -q

# ── Stage 2: Run ──────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Konteyner non-root kullanıcıyla çalışır (güvenlik gereği).
RUN addgroup -S clms && adduser -S clms -G clms

COPY --from=builder /app/target/*.jar app.jar
RUN chown clms:clms app.jar

USER clms
EXPOSE 8080

# -Djava.security.egd: /dev/urandom kullanarak Spring Boot başlangıç gecikmesini önler.
ENTRYPOINT ["java", \
            "-Djava.security.egd=file:/dev/./urandom", \
            "-jar", "app.jar"]
