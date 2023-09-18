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
@CrossOrigin(originPatterns = "*")
@RequestMapping("/api/stops")
public class StopController {
    @Autowired
    private StopService stopService;
    @GetMapping
   // @PreAuthorize("hasAuthority('readArrêt')")

    public List<StopDTO> getall(){
        return stopService.gAtallStops();
    }
    @PostMapping("/add")
   // @PreAuthorize("hasAuthority('writeArrêt')")
    public ResponseEntity<Path> addStop(@RequestBody Stop stop){
        this.stopService.createStop(stop);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PutMapping("/update/{id}")
   // @PreAuthorize("hasAuthority('updateArrêt')")
    public ResponseEntity<Stop> updateStop (@RequestBody Stop stop,@PathVariable String id ){
        this.stopService.updateStop(stop,id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @DeleteMapping
   // @PreAuthorize("hasAuthority('deleteArrêt')")
    public ResponseEntity<?>deleteAll(){
        stopService.deleteAll();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @DeleteMapping("/{id}")
   // @PreAuthorize("hasAuthority('deleteArrêt')")
    public ResponseEntity<?> deletebyid (@PathVariable("id") String id){
        stopService.deleteStopbyId(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
