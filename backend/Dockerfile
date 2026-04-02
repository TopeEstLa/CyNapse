FROM eclipse-temurin:25-jre

RUN mkdir /app && mkdir /app/config

WORKDIR /app
COPY build/libs/CyNapse-*.jar /app/CyNapse.jar
ENV TZ="Europe/Paris"

EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "/app/CyNapse.jar" ]