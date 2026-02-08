package com.intersify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@org.springframework.scheduling.annotation.EnableAsync
public class IntersifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(IntersifyApplication.class, args);
	}

}
