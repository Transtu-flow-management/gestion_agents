package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Conductor;
import com.transtu.transtu.Service.ConductorService;
import com.transtu.transtu.Service.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

import static com.transtu.transtu.Document.Conductor.SEQUENCE_Cond_NAME;

@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/api/conductors")
public class ConductorController {
    @Autowired
    private com.transtu.transtu.Service.ConductorService conductorService;

    @GetMapping
    @PreAuthorize("hasAuthority('readChauffeur')")
    public Page<Conductor> getConductors(@RequestParam (defaultValue = "0")int page,
                                          @RequestParam(defaultValue = "5")int size
                                         ){
        Pageable pageable = PageRequest.of(page,size);
            return conductorService.getAllConductors(pageable);
    }
    @GetMapping("/all")
   // @PreAuthorize("hasAuthority('read')")
    public ResponseEntity<List<Conductor>> getall(){
       List<Conductor> all = this.conductorService.getall();
        return ResponseEntity.ok(all);
    }
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('writeChauffeur')")
    public ResponseEntity<EntityModel<Conductor>> addConductor(@RequestBody Conductor conductor){
        EntityModel<Conductor> createdConductor = conductorService.create(conductor);
        return ResponseEntity.created(createdConductor.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(createdConductor);
    }
    @GetMapping("/datesearch")
    public List<Conductor>filterbydate( @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dateFilter){
        return conductorService.getAllConductorsWithDateFilter(dateFilter);
    }

    @PutMapping("/update/{id}")
   // @PreAuthorize("hasAuthority('update')")
    public ResponseEntity<Conductor> updateConductor(@PathVariable Integer id,@RequestBody Conductor conductor){
        Conductor updated = conductorService.updateConductor(id,conductor);
        return ResponseEntity.ok().body(updated);
    }
    @DeleteMapping("/deleteAll")
   // @PreAuthorize("hasAuthority('delete')")
    public ResponseEntity<?> deleteall (){
        conductorService.deleteAll();

        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/{id}")
   // @PreAuthorize("hasAuthority('delete')")
    public ResponseEntity<?> deletebyid (@PathVariable("id") Integer id){
        conductorService.deleteByCondId(id);
        return ResponseEntity.accepted().build();
    }
}
