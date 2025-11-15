# ---- Builder: compile & package the app inside Maven image ----
FROM maven:3.9.4-eclipse-temurin-17 AS builder
ARG MAVEN_OPTS="-DskipTests"
WORKDIR /workspace

# OPTIONAL: If you need a custom settings.xml (proxy/mirror), uncomment next line
# COPY settings.xml /root/.m2/settings.xml

# Copy pom first to leverage Docker layer caching for dependencies
COPY pom.xml .
# Now copy source and build
COPY src ./src

# Build: downloads dependencies and produces executable jar via spring-boot-maven-plugin
# Use -T1C to allow parallel threads (optional). Remove if causes instability.
RUN mvn -B -T1C ${MAVEN_OPTS} clean package

# Jar file pattern (Spring Boot default). Set build-arg JAR_FILE if the jar name differs.
ARG JAR_FILE=target/*.jar

# ---- Runtime: small JRE image to run the jar ----
FROM eclipse-temurin:17-jre
WORKDIR /app

# Install curl for optional healthcheck (small size impact)
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy jar from builder (do this before creating non-root user)
ARG JAR_FILE=target/*.jar
COPY --from=builder /workspace/${JAR_FILE} /app/app.jar

# Create non-root user and fix ownership
RUN useradd --create-home --shell /bin/bash appuser \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8080
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Simple healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
