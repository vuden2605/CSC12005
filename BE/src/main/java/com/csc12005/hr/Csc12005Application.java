package com.csc12005.hr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class Csc12005Application {
	public static void main(String[] args) {
		SpringApplication.run(Csc12005Application.class, args);
	}
}
