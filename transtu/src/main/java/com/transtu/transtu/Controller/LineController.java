package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Line;
import com.transtu.transtu.Service.LineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/lines")
public class LineController {
    @Autowired
    private LineService lineService;
    @GetMapping
    private Page<Line> getallLines(@RequestParam (defaultValue = "0")int page,
                                   @RequestParam(defaultValue = "4")int size){
        Pageable pageable = PageRequest.of(page,size);

        return lineService.getalllines(pageable);
    }
    @PostMapping("/add")
    private ResponseEntity<Line> create(@RequestBody Line line){
        Line created = this.lineService.createLine(line);
        return ResponseEntity.ok(created);
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Line> updateline(@PathVariable String id,@RequestBody Line line){
        Line updated = lineService.updateLine(id,line);
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping
    private ResponseEntity<?>deleteAll(){
       lineService.deleteAll();
       return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @DeleteMapping("/{id}")
    private ResponseEntity<?> deletebyid (@PathVariable("id") String id){
        lineService.deleteLinebyId(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
