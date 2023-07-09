package com.transtu.transtu;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class TranstuApplication {

	public static void main(String[] args) {
		SpringApplication.run(TranstuApplication.class, args);
	}
	// mongo db path := mongod --port 27030 --dbpath "C:\mongo\testmongo"
}
