package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Car;
import com.transtu.transtu.Service.CarService;
import lombok.RequiredArgsConstructor;
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
@CrossOrigin(originPatterns = "*",allowCredentials = "true")
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {
@Autowired
    private CarService carService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('readCar','defaultPermission')")
    public Page<Car> getAll(@RequestParam(name = "agentId") Integer agentId,@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "5") int size){
        Pageable pageable = PageRequest.of(page, size);
        return carService.getallCars(agentId,pageable);
    }
    @GetMapping("/sorted")
    @PreAuthorize("hasAnyAuthority('readCar','defaultPermission')")
    public Page<Car> getAllSorted(@RequestParam(name = "agentId") Integer agentId
            ,@RequestParam(defaultValue = "0") int page,
                            @RequestParam(defaultValue = "5") int size){
        Pageable pageable = PageRequest.of(page, size);
        return carService.getallCarsSorted(agentId,pageable);
    }
    @GetMapping("/all")
    public List<Car>findall(){
        return carService.findallCars();
    }
@PostMapping("/add")
    @PreAuthorize("hasAuthority('writeCar')")
public ResponseEntity<Car> newcar (@RequestBody Car car){
   Car createdcar = carService.CreateCar(car);
    return ResponseEntity.ok(createdcar);
}
    @DeleteMapping("/{id}")
     @PreAuthorize("hasAuthority('deleteCar')")
    public ResponseEntity<?> deletebyid (@PathVariable("id") String id){
        carService.deleteCarbyid(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('updateCar')")
    public ResponseEntity<Car> updatecar(@PathVariable String id, @RequestBody Car car){
        Car updated = carService.updateCar(id,car);
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping
    public ResponseEntity<?>deletelaal(){
        carService.Deleteall();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
