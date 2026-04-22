package io.squid.cynapse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class}) //cause we don't have UserDetailService
public class CynapseApplication {

	public static void main(String[] args) {
		SpringApplication.run(CynapseApplication.class, args);
	}

}
