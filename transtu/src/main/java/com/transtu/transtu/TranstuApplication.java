package com.transtu.transtu;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TranstuApplication {

	public static void main(String[] args) {
		SpringApplication.run(TranstuApplication.class, args);
	}
	// mongo db path := mongod --port 27030 --dbpath "C:\mongo\testmongo"
}

//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