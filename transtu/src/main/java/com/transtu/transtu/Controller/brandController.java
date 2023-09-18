package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Brand;
import com.transtu.transtu.Document.CarBuilder;
import com.transtu.transtu.Document.Conductor;
import com.transtu.transtu.Repositoy.BrandRepo;
import com.transtu.transtu.Service.brandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/api/brand")
public class brandController {

    @Autowired
    private brandService brandService;
    @Autowired
    private BrandRepo brandRepo;

@GetMapping("/all")
//@PreAuthorize("hasAuthority('readBrand')")
public List<Brand> getall(){
    return brandRepo.findAll();
}
    @PostMapping("/create")
   // @PreAuthorize("hasAuthority('addBrand')")
    public ResponseEntity<EntityModel<Brand>> addBrand(@RequestBody Brand brand){

        EntityModel<Brand> createdbrand = brandService.createMarque(brand);
        return ResponseEntity.created(createdbrand.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(createdbrand);
    }
    @DeleteMapping
  //  @PreAuthorize("hasAuthority('deleteBrand')")
    public ResponseEntity<?>DeleteAll(){
        brandService.Deleteall();
        return ResponseEntity.status(HttpStatus.GONE).build();
    }
    @DeleteMapping("/all")
   // @PreAuthorize("hasAuthority('deleteBrand')")
    public ResponseEntity<?>DeleteAllmakers(){
        brandService.Deleteallmakers();
        return ResponseEntity.status(HttpStatus.GONE).build();
    }
    @GetMapping
   // @PreAuthorize("hasAuthority('readBrand')")
    public Page<Brand> getBrands(@RequestParam (defaultValue = "0")int page,
                                          @RequestParam(defaultValue = "2")int size
    ){
        Pageable pageable = PageRequest.of(page,size);
        return brandService.getAllbrands(pageable);
    }
    @PutMapping("/update/{id}")
    //@PreAuthorize("hasAuthority('update_brand')")
    public ResponseEntity<Brand> updatebrand(@PathVariable String id, @RequestBody Brand brand){
        Brand updated = brandService.updatebrand(id, brand);
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/{id}")
   // @PreAuthorize("hasAuthority('readBrand')")
    private ResponseEntity<Brand> getcurrent(@PathVariable String id){
        Brand currentbrand = brandService.getCurrent(id);
        return ResponseEntity.ok(currentbrand);
    }
    @DeleteMapping("/{id}")
   // @PreAuthorize("hasAuthority('deleteBrand')")
    public ResponseEntity<Brand> deletebrand(@PathVariable String id){
        return brandService.deleteMarque(id);
    }

    @GetMapping("/fabriquants")
   // @PreAuthorize("hasAuthority('readBrand')")
    public ResponseEntity<List<CarBuilder>> getAllfab(){
        List<CarBuilder> CarBuilders = brandService.getallfabriquants();
        return ResponseEntity.ok(CarBuilders);
    }

}
