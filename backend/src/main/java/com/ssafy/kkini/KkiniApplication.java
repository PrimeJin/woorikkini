package com.ssafy.kkini;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing  //BaseEntity JPA Auditing 기능 활성화
public class KkiniApplication {

	public static void main(String[] args) {
		SpringApplication.run(KkiniApplication.class, args);
	}

}
