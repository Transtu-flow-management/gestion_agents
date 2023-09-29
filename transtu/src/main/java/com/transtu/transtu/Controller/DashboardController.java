package com.transtu.transtu.Controller;

import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final RestTemplate restTemplate;
    private final String apiKey = "20af3f125f82b8fa15880e891ae30f5e";
public DashboardController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/weather")
    public ResponseEntity<String> GetWeather( @RequestParam("lat") String lat,
                                              @RequestParam("lon") String lon){
        String apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+apiKey;
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(apiUrl, String.class);
        return responseEntity;
    }
}
