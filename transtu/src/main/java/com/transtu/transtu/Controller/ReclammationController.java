package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Path;
import com.transtu.transtu.Document.Reclammation;
import com.transtu.transtu.Service.ReclammationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/reclam")
public class ReclammationController {
    @Autowired
    private ReclammationService reclammationService;
    @PostMapping("/add")
    //@PreAuthorize("hasAuthority('writeTraget')")
    private ResponseEntity<Reclammation> addReclam(@RequestBody Reclammation reclammation){
        this.reclammationService.createReclam(reclammation);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PutMapping("/update/{id}")
    // @PreAuthorize("hasAuthority('updateTraget')")
    private ResponseEntity<Path> updatepath (@PathVariable String id,@RequestBody Reclammation reclammation ){
        this.reclammationService.updateReclammation(id,reclammation);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasAuthority('deleteTraget')")
    private ResponseEntity<?> deletebyid (@PathVariable("id") String id){
        this.reclammationService.deleteReclambyId(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
