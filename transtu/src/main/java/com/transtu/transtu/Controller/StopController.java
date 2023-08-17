package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Path;
import com.transtu.transtu.Document.Stop;
import com.transtu.transtu.Service.StopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/stops")
public class StopController {
    @Autowired
    private StopService stopService;
    @GetMapping
    private Page<Stop> getal(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "5") int size){
        Pageable pageable = PageRequest.of(page,size);
        return stopService.getallStops(pageable);
    }
    @PostMapping("/add")
    private ResponseEntity<Path> addStop(@RequestBody Stop stop){
        this.stopService.createStop(stop);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Path> updateStop (@PathVariable String id,@RequestBody Stop stop ){
        this.stopService.updateStop(id,stop);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @DeleteMapping
    private ResponseEntity<?>deleteAll(){
        stopService.deleteAll();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @DeleteMapping("/{id}")
    private ResponseEntity<?> deletebyid (@PathVariable("id") String id){
        stopService.deleteStopbyId(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
