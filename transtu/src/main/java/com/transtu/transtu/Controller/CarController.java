package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Car;
import com.transtu.transtu.Service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/cars")
public class CarController {
@Autowired
    private CarService carService;
    @GetMapping
   // @PreAuthorize("hasAuthority('readCar')")
    private Page<Car> getAll(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "5") int size){
        Pageable pageable = PageRequest.of(page, size);
        return carService.getallCars(pageable);
    }
    @GetMapping("/all")
    // @PreAuthorize("hasAuthority('readCar')")
    private List<Car>findll(){
        return carService.findallCars();
    }
@PostMapping("/add")
//@PreAuthorize("hasAuthority('writeCar')")
    private ResponseEntity<Car> newcar (@RequestBody Car car){
   Car createdcar = carService.CreateCar(car);
    return ResponseEntity.ok(createdcar);
}
    @DeleteMapping("/{id}")
   // @PreAuthorize("hasAuthority('deleteCar')")
    private ResponseEntity<?> deletebyid (@PathVariable("id") String id){
        carService.deleteCarbyid(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @PutMapping("/update/{id}")
    //@PreAuthorize("hasAuthority('updateCar')")
    private ResponseEntity<Car> updatecar(@PathVariable String id, @RequestBody Car car){
        Car updated = carService.updateCar(id,car);
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping
    private ResponseEntity<?>deletelaal(){
        carService.Deleteall();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
