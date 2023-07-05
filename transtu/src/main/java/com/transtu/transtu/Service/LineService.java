package com.transtu.transtu.Service;

import com.transtu.transtu.Document.Condition;
import com.transtu.transtu.Document.Line;
import com.transtu.transtu.Document.Warehouse;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.LineRepo;
import com.transtu.transtu.Repositoy.entropotRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class LineService {
    @Autowired
    private LineRepo lineRepo;
    @Autowired
    private entropotRepo entropotRepo;

    public Page<Line> getalllines(Pageable pageable) {
        return lineRepo.findAll(pageable);
    }

    public Line createLine(Line line) {
        if (line.getWarehouse() == null || line.getWarehouse().getId() == null) {
            throw new IllegalArgumentException("Warehouse ID must be provided");
        }
        Optional<Warehouse> warehouseOptional = entropotRepo.findById(line.getWarehouse().getId());
        if (warehouseOptional.isEmpty()) {
            throw new NotFoundExcemptionhandler(line.getWarehouse().getId());
        }
        Warehouse warehouse = warehouseOptional.get();
        line.setWarehouse(warehouse);
        String nameFr = line.getNameFr();
        String nameAr = line.getNameAr();
        if (lineRepo.existsByNameFr(nameFr) || lineRepo.existsByNameAr(nameAr)) {
            throw new IllegalArgumentException("name already exists");
        }
        line.setDateOfInsertion(new Date());
        Line newLine = lineRepo.save(line);
        return line;
    }
    public Line updateLine(String id,Line newline){
    Line line = lineRepo.findById(id).orElseThrow(()-> new NotFoundHandler(id));
        line.setNameAr(newline.getNameAr());
        line.setNameFr(newline.getNameFr());
        line.setStart_fr(newline.getStart_fr());
        line.setStart_ar(newline.getStart_ar());
        line.setEnd_ar(newline.getEnd_ar());
        line.setEnd_fr(newline.getEnd_fr());
        Warehouse newWarehouse = newline.getWarehouse();
        if (newWarehouse != null) {
            Optional<Warehouse> warehouseOptional = entropotRepo.findById(newWarehouse.getId());
            if (warehouseOptional.isPresent()) {
                line.setWarehouse(warehouseOptional.get());
            }
        }
        line.setDateOfModification(new Date());
        return lineRepo.save(line);

    }
    public void  deleteAll(){
        lineRepo.deleteAll();
    }
    public void deleteLinebyId(String id){
        Optional<Line> optionalLine = lineRepo.findById(id);
        if (optionalLine.isPresent()){
            lineRepo.deleteById(id);
        }else {
            throw new NotFoundHandler(id);
        }
    }

}
