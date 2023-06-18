package com.transtu.transtu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;


@SpringBootApplication
public class TranstuApplication {
 	// mongo db path := mongod --port 27030 --dbpath "C:\mongo\testmongo"
	public static void main(String[] args) {
		SpringApplication.run(TranstuApplication.class, args);
	}

}
