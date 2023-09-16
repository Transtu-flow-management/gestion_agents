package com.transtu.transtu.Service;

import com.transtu.transtu.Document.Car;
import com.transtu.transtu.Document.Reclammation;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.CarRepo;
import com.transtu.transtu.Repositoy.ReclamRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReclammationService {
    @Autowired
    private ReclamRepo reclamRepo;
    @Autowired
    private CarRepo carRepo;
public List<Reclammation>getAllReclams(){
    return  reclamRepo.findAll();
}
public Reclammation createReclam(Reclammation reclammation){
    reclammation.setDateOfCreation(new Date());
    if (reclammation.getCar() == null || reclammation.getCar().getId() == null) {
        throw new IllegalArgumentException("Car ID must be provided");
    }
    Optional<Car> carOptional = carRepo.findById(reclammation.getCar().getId());
    if (carOptional.isEmpty()) {
        throw new NotFoundHandler(reclammation.getCar().getId());
    }
    Car car = carOptional.get();
    reclammation.setCar(car);
    return reclamRepo.save(reclammation);
}

public Reclammation updateReclammation(String id,Reclammation newReclam){
    Reclammation oldReclam = reclamRepo.findById(id).orElseThrow(()->new NotFoundHandler(id));
    oldReclam.setContext(newReclam.getContext());
    oldReclam.setEmail(newReclam.getEmail());
    oldReclam.setType(newReclam.getType());
    oldReclam.setPredifinedContext(newReclam.getPredifinedContext());
    oldReclam.setTimeOfIncident(newReclam.getTimeOfIncident());
    Car newCar = newReclam.getCar();
    if (newCar != null) {
        Optional<Car> carOptional = carRepo.findById(newCar.getId());
        if (carOptional.isPresent()) {
            oldReclam.setCar(carOptional.get());
        }
    }
    return reclamRepo.save(oldReclam);
    }
    public void deleteReclambyId(String id){
        Optional<Reclammation> optionalReclammation = reclamRepo.findById(id);
        if (optionalReclammation.isPresent()){
            reclamRepo.deleteById(id);
        }else {
            throw new NotFoundHandler(id);
        }
    }

}
