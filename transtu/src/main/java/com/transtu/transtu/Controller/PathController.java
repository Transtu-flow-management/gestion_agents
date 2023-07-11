package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Condition;
import com.transtu.transtu.Document.Path;
import com.transtu.transtu.Service.PathService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/paths")
public class PathController {
    @Autowired
    private PathService pathService;
    @GetMapping
    private Page<Path> getal(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "5") int size){
        Pageable pageable = PageRequest.of(page,size);
        return pathService.getAllpaths(pageable);
    }
    @PostMapping("/add")
    private ResponseEntity<Path> addcondition(@RequestBody Path path){
        this.pathService.createPath(path);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Path> updatepath (@PathVariable String id,@RequestBody Path path ){
        this.pathService.updatePath(id,path);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @DeleteMapping
    private ResponseEntity<?>deleteAll(){
        pathService.deleteAll();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @DeleteMapping("/{id}")
    private ResponseEntity<?> deletebyid (@PathVariable("id") String id){
        pathService.deletePathbyId(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
