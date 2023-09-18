package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Brand;
import com.transtu.transtu.Document.Condition;
import com.transtu.transtu.Service.ConditionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/api/conditions")
public class ConditionController  {
    @Autowired
   ConditionService conditionService;
    @GetMapping
   // @PreAuthorize("hasAuthority('readCondition')")
    public Page<Condition> getal(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "5") int size){
        Pageable pageable = PageRequest.of(page,size);
        return conditionService.getAll(pageable);
    }
    @GetMapping("/all")
   // @PreAuthorize("hasAuthority('readCondition')")
    public List<Condition> getall(){
        return conditionService.getAllc();
    }

    @PostMapping("/add")
  //  @PreAuthorize("hasAuthority('writeCondition')")
    public ResponseEntity<Condition> addcondition(@RequestBody Condition condition){
      this.conditionService.addCondition(condition);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PutMapping("/update/{id}")
  //  @PreAuthorize("hasAuthority('updateCondition')")
    public ResponseEntity<Condition> updateCondtion (@PathVariable String id,@RequestBody Condition condition ){
        this.conditionService.updateCondition(id,condition);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @DeleteMapping("/deleteall")
  //  @PreAuthorize("hasAuthority('deleteCondition')")
    public ResponseEntity<?> deleteall(){
        this.conditionService.DeleteAll();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasAuthority('deleteCondition')")
    public ResponseEntity<?> deletebrand(@PathVariable String id){
        this.conditionService.deleteByCondId(id);
        return ResponseEntity.status(HttpStatus.GONE).build();
    }


}
