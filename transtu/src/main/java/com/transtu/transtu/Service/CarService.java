package com.transtu.transtu.Service;

import com.transtu.transtu.Document.*;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class CarService {

@Autowired
    private CarRepo carRepo;
@Autowired
private PathRepo pathRepo;
@Autowired
private LineRepo lineRepo;
@Autowired
private ConditionRepo conditionRepo;
@Autowired
private ConductorRepo conductorRepo;
@Autowired
private BrandRepo brandRepo;
@Autowired
private entropotRepo entropotRepo;
public Page<Car> getallCars(Pageable pageable){
    return  carRepo.findAll(pageable);
}
public Car CreateCar(Car car){
    if (carRepo.existsByMatricule(car.getMatricule())){
        throw new IllegalArgumentException("matricule must be unique");
    }
    if (car.getDriver()==null || car.getDriver().getId() == null){
        throw new IllegalArgumentException("driver must be provided");
    }
    if (car.getBrand()==null || car.getBrand().getId() ==null ){
        throw new IllegalArgumentException("brand must be provided");
    }
    if (car.getPath() == null || car.getPath().getId() ==null){
        throw new IllegalArgumentException("Path must be provided");
    }
    if (car.getLine() == null || car.getLine().getId() ==null){
        throw new IllegalArgumentException("Line must be provided");
    }
    if (car.getState()== null || car.getState().getId() == null){
        throw new IllegalArgumentException("Condition must be provided");
    }
    if (car.getWarehouse()== null || car.getWarehouse().getId()== null){
        throw new IllegalArgumentException("Warehouse must be provided");
    }
    car.setDateOfInsertion(new Date());
    Car savedcar = carRepo.save((car));
    return savedcar;
}
    public void deleteCarbyid(String id){
        Optional<Car> optcar = carRepo.findById(id);
        if (optcar.isPresent()){
            carRepo.deleteById(id);
        }else {
            throw new NotFoundHandler(id);
        }
    }
    public Car updateCar(String id, Car oldcar){
    Car newcar = carRepo.findById(id).orElseThrow(()->new NotFoundHandler(id));
        newcar.setName(oldcar.getName());
        newcar.setMatricule(oldcar.getMatricule());
        newcar.setSelectedNetwork(oldcar.getSelectedNetwork());
        newcar.setStopcount(oldcar.getStopcount());
        newcar.setMode(oldcar.getMode());
        Path oldPath = oldcar.getPath();
        Line oldLine = oldcar.getLine();
        Conductor olddriver = oldcar.getDriver();
        Condition oldcondt = oldcar.getState();
        Brand oldbrand = oldcar.getBrand();
        Warehouse oldhouse = oldcar.getWarehouse();
        if (oldPath!= null){
            Optional<Path> pathOptional = pathRepo.findById(oldPath.getId());
            if (pathOptional.isPresent()){
                newcar.setPath(pathOptional.get());
            }
        }
        if (oldLine != null){
            Optional<Line> lineOptional = lineRepo.findById(oldLine.getId());
            if (lineOptional.isPresent()){
                newcar.setLine(lineOptional.get());
            }
        }
        if (oldbrand != null){
            Optional<Brand> brandOptional = brandRepo.findById(oldbrand.getId());
            if (brandOptional.isPresent()){
                newcar.setBrand(brandOptional.get());
            }
        }
        if (oldcondt != null){
            Optional<Condition> cndtOptional = conditionRepo.findById(oldcondt.getId());
            if (cndtOptional.isPresent()){
                newcar.setState(cndtOptional.get());
            }
        }
        if (olddriver != null){
            Optional<Conductor> cnductOptional = conductorRepo.findById(olddriver.getId());
            if (cnductOptional.isPresent()){
                newcar.setDriver(cnductOptional.get());
            }
        }
        if (oldhouse != null){
            Optional<Warehouse> housetOptional = entropotRepo.findById(oldhouse.getId());
            if (housetOptional.isPresent()){
                newcar.setWarehouse(housetOptional.get());
            }
        }
        newcar.setDateOfModification(new Date());
        return carRepo.save(newcar);



    }


}
