package com.manageit.manageit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ManageitApplication {

	public static void main(String[] args) {
		SpringApplication.run(ManageitApplication.class, args);
	}

}
