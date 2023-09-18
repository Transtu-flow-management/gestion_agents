package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Car;
import com.transtu.transtu.Document.Path;
import com.transtu.transtu.Document.Reclammation;
import com.transtu.transtu.Service.ReclammationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/api/reclam")
public class ReclammationController {
    @Autowired
    public ReclammationService reclammationService;

    @GetMapping
    @PreAuthorize("hasAuthority('pcr_read')")
    public Page<Reclammation> getAll(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "5") int size){
        Pageable pageable = PageRequest.of(page, size);
        return reclammationService.getallReclams(pageable);
    }
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('pcr_write')")
    public ResponseEntity<Reclammation> addReclam(@RequestBody Reclammation reclammation){
        this.reclammationService.createReclam(reclammation);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
     @PreAuthorize("hasAuthority('pcr_Delete')")
    public ResponseEntity<?> deletebyid (@PathVariable("id") String id){
        this.reclammationService.deleteReclambyId(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
