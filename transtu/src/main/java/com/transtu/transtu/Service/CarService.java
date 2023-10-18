package com.transtu.transtu.Service;

import com.transtu.transtu.Document.*;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CarService {
@Autowired
private CarRepo carRepo;
@Autowired
private  PathRepo pathRepo;
@Autowired
private  LineRepo lineRepo;
@Autowired
private  ConditionRepo conditionRepo;
@Autowired
private  ConductorRepo conductorRepo;
@Autowired
private  BrandRepo brandRepo;
@Autowired
private AgentRepo agentRepo;
@Autowired
private  entropotRepo entropotRepo;

    public Page<Car> getallCars(Integer agentId, Pageable pageable) {
        Agent agent = agentRepo.findById(agentId).orElseThrow(()-> new NotFoundExcemptionhandler(agentId));
        boolean hasAllWarehousesPrivilege = hasAllWarehousesPrivilege(agent.getId());
        if (agent != null ) {
            if (agent.getWarehouse() != null){
                Integer warehouseId = agent.getWarehouse().getId();
                if (warehouseId !=null){
                    return carRepo.findBywarehouseId(warehouseId, pageable);}
            }
            if (hasAllWarehousesPrivilege){
                return carRepo.findAll(pageable);}

        }
        return Page.empty();
    }

    private Sort.Order currentOrder = Sort.Order.asc("matricule");
    private Sort.Order currentOrderbrand = Sort.Order.asc("brand");

    public Page<Car> getallCarsSorted(Integer agentId, Pageable pageable) {
        Agent agent = agentRepo.findById(agentId).orElseThrow(()-> new NotFoundExcemptionhandler(agentId));
        currentOrder = (currentOrder.isAscending()) ? Sort.Order.desc("matricule") : Sort.Order.asc("matricule");
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),  Sort.by(currentOrder));
        boolean hasAllWarehousesPrivilege = hasAllWarehousesPrivilege(agent.getId());
        if (agent != null ) {
            if (agent.getWarehouse() != null){
                Integer warehouseId = agent.getWarehouse().getId();
                if (warehouseId !=null){
                    return carRepo.findBywarehouseId(warehouseId, pageable);}
            }
            if (hasAllWarehousesPrivilege){
                return carRepo.findAll(sortedPageable);}

        }
        return Page.empty();
    }



    private boolean hasAllWarehousesPrivilege(Integer agentId) {
        Agent user = agentRepo.findById(agentId).orElseThrow(()-> new NotFoundExcemptionhandler(agentId));
        if (user!=null){
            Role userrole = user.getRole();
            if (userrole!=null &&userrole.getPermissions().contains(Permissions.DEFAULT_PERMISSION)){
                return true;
            }
        }
        return false;
    }
    public List<Car>findallCars(){
        return carRepo.findAll();
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
    Car savedcar = carRepo.save(car);
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
        newcar.setMatricule(oldcar.getMatricule());
        newcar.setSelectedNetwork(oldcar.getSelectedNetwork());
        newcar.setStopcount(oldcar.getStopcount());
        newcar.setMode(oldcar.getMode());
        Line oldLine = oldcar.getLine();


        Conductor olddriver = oldcar.getDriver();
        Condition oldcondt = oldcar.getState();
        Brand oldbrand = oldcar.getBrand();
        Warehouse oldhouse = oldcar.getWarehouse();

        if (oldLine != null){
            Optional<Line> lineOptional = lineRepo.findById(oldLine.getId());
            if (lineOptional.isPresent()){
                newcar.setLine(lineOptional.get());
            }
        }
        Optional<Path> newPath = pathRepo.findByLine(oldLine);
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

    public void Deleteall() {
        carRepo.deleteAll();
    }
}
