package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Brand;
import com.transtu.transtu.Document.Condition;
import com.transtu.transtu.Service.ConditionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/conditions")
public class ConditionController {
    @Autowired
   ConditionService conditionService;
    @GetMapping
    private Page<Condition> getal(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "5") int size){
        Pageable pageable = PageRequest.of(page,size);
        return conditionService.getAll(pageable);
    }
    @GetMapping("/all")
    private List<Condition> getall(){
        return conditionService.getAllc();
    }

    @PostMapping("/add")
    private ResponseEntity<Condition> addcondition(@RequestBody Condition condition){
      this.conditionService.addCondition(condition);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Condition> updateCondtion (@PathVariable String id,@RequestBody Condition condition ){
        this.conditionService.updateCondition(id,condition);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @DeleteMapping("/deleteall")
    private ResponseEntity<?> deleteall(){
        this.conditionService.DeleteAll();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @DeleteMapping("/{id}")
    private ResponseEntity<?> deletebrand(@PathVariable String id){
        this.conditionService.deleteByCondId(id);
        return ResponseEntity.status(HttpStatus.GONE).build();
    }


}
