package com.transtu.transtu.Service;

import com.transtu.transtu.Document.Path;
import com.transtu.transtu.Document.Stop;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.StopRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class StopService {
    @Autowired
    private StopRepo stopRepo;
    public Page<Stop> getallStops(Pageable pageable){
        return stopRepo.findAll(pageable);
    }
    public Stop createStop(Stop stop){
       stop.setDateOfInsertion(new Date());
       Stop savedstop = stopRepo.save(stop);
return savedstop;
    }
    public Stop updateStop(String id,Stop newStop){
        Stop stop = stopRepo.findById(id).orElseThrow(()->new NotFoundHandler(id));
        stop.setName_ar(newStop.getName_ar());
        stop.setName_fr(newStop.getName_ar());
        stop.setLat(newStop.getLat());
        stop.setLat(newStop.getLat());
        stop.setDescription(newStop.getDescription());
        stop.setDateOfModification(new Date());
        return stopRepo.save(stop);
    }
    public void  deleteAll(){
        stopRepo.deleteAll();
    }

    public void deleteStopbyId(String id){
        Optional<Stop> optionalstop = stopRepo.findById(id);
        if (optionalstop.isPresent()){
            stopRepo.deleteById(id);
        }else {
            throw new NotFoundHandler(id);
        }
    }
    }
