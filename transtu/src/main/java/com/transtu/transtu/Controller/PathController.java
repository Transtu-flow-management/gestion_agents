package com.transtu.transtu.Controller;

import com.transtu.transtu.DTO.PathDTO;
import com.transtu.transtu.Document.Condition;
import com.transtu.transtu.Document.Path;
import com.transtu.transtu.Service.PathService;
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
@CrossOrigin(originPatterns = "*")
@RequestMapping("/api/paths")
public class PathController {
    @Autowired
    private PathService pathService;
    @GetMapping
   // @PreAuthorize("hasAuthority('readTraget')")
    public Page<Path> getal(@RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "5") int size){
        Pageable pageable = PageRequest.of(page,size);
        return pathService.getAllpaths(pageable);
    }
    @GetMapping("/all")
    //@PreAuthorize("hasAuthority('readTraget')")
    public List<Path>getall(){
        return pathService.getall();
    }

    @PostMapping("/add")
    //@PreAuthorize("hasAuthority('writeTraget')")
    public ResponseEntity<Path> addpath(@RequestBody Path path){
        this.pathService.createPath(path);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PutMapping("/update/{id}")
   // @PreAuthorize("hasAuthority('updateTraget')")
    public ResponseEntity<Path> updatepath (@PathVariable String id,@RequestBody Path path ){
        this.pathService.updatePath(id,path);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @DeleteMapping
   // @PreAuthorize("hasAuthority('deleteTraget')")
    public ResponseEntity<?>deleteAll(){
        pathService.deleteAll();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @DeleteMapping("/{id}")
   // @PreAuthorize("hasAuthority('deleteTraget')")
    public ResponseEntity<?> deletebyid (@PathVariable("id") String id){
        pathService.deletePathbyId(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
