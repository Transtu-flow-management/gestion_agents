package com.transtu.transtu.Controller;

import com.transtu.transtu.DTO.StopDTO;
import com.transtu.transtu.Document.Path;
import com.transtu.transtu.Document.Stop;
import com.transtu.transtu.Service.StopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/stops")
public class StopController {
    @Autowired
    private StopService stopService;
    @GetMapping
   // @PreAuthorize("hasAuthority('readArrêt')")
    private Page<StopDTO> getal(@RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "5") int size){

        Pageable pageable = PageRequest.of(page,size);
        return stopService.getallStops(pageable);
    }
    @GetMapping("/all")
    private List<Stop> getall(){
        return stopService.findall();
    }
    @PostMapping("/add")
   // @PreAuthorize("hasAuthority('writeArrêt')")
    private ResponseEntity<Path> addStop(@RequestBody Stop stop){
        this.stopService.createStop(stop);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PutMapping("/update/{id}")
   // @PreAuthorize("hasAuthority('updateArrêt')")
    private ResponseEntity<Stop> updateStop (@RequestBody Stop stop,@PathVariable String id ){
        this.stopService.updateStop(stop,id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @DeleteMapping
   // @PreAuthorize("hasAuthority('deleteArrêt')")
    private ResponseEntity<?>deleteAll(){
        stopService.deleteAll();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @DeleteMapping("/{id}")
   // @PreAuthorize("hasAuthority('deleteArrêt')")
    private ResponseEntity<?> deletebyid (@PathVariable("id") String id){
        stopService.deleteStopbyId(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
