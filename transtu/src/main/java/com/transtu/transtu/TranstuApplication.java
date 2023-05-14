package com.transtu.transtu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class TranstuApplication {
 	// mongo db path := mongod --port 27030 --dbpath "C:\mongo\testmongo"
	public static void main(String[] args) {
		SpringApplication.run(TranstuApplication.class, args);
	}

}
