package io.squid.cynapse.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author TopeEstLa
 */
@Configuration
//@EnableWebMvc
public class CorsWebConfig implements WebMvcConfigurer {

    @Value("${cynapse.cors.allowed-origins}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println("Configuring CORS with allowed origins: " + String.join(", ", this.allowedOrigins));
        registry.addMapping("/**")
                .allowedMethods("GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedOrigins(this.allowedOrigins)
                .allowedHeaders("*")
                .allowCredentials(true);
    }

}