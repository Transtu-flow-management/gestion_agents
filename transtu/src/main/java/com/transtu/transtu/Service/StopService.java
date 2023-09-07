package com.transtu.transtu.Service;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.DTO.PathDTO;
import com.transtu.transtu.DTO.StopDTO;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Path;
import com.transtu.transtu.Document.Stop;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.PathRepo;
import com.transtu.transtu.Repositoy.StopRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StopService {
    @Autowired
    private StopRepo stopRepo;
    @Autowired
    private PathRepo pathRepo;

    public Page<StopDTO> getallStops(Pageable pageable){
        Page<Stop> agentPage = stopRepo.findAll(pageable);
        List<StopDTO> stopDTOS = convertToStopDTO(agentPage.getContent());
        return new PageImpl<>(stopDTOS, pageable, agentPage.getTotalElements());
    }
    public List<Stop> findall(){
        return stopRepo.findAll();
    }

    public Stop createStop(Stop stop){
        stop.setDateOfInsertion(new Date());
        String pathid = stop.getPath().getId();
        Optional<Path> pathOptional = pathRepo.findById(pathid);
        if (pathOptional.isPresent()){
            Path path = pathOptional.get();
            PathDTO pathDTO = convertPathToDTO(path);
            stop.setPath(pathDTO);
            Stop savedstop = stopRepo.save(stop);
            path.getStops().add(savedstop);
            pathRepo.save(path);
            return savedstop;
        }else {
            throw new NotFoundHandler(pathid);
        }
    }
    private PathDTO convertPathToDTO(Path path){
        PathDTO pathDTO = new PathDTO();
        pathDTO.setId(path.getId());
        pathDTO.setLine(path.getLine());
        pathDTO.setData(path.getData());
        pathDTO.setStartAr(path.getStartAr());
        pathDTO.setEndFr(path.getEndFr());
        pathDTO.setStartFr(path.getStartFr());
        pathDTO.setEndAr(path.getEndAr());
        pathDTO.setType(path.getType());
        return pathDTO;
    }
    public Stop updateStop(Stop stop,String id){
        Stop newStop = stopRepo.findById(id).orElseThrow(()->new NotFoundHandler(id));
        newStop.setName_ar(stop.getName_ar());
        newStop.setName_fr(stop.getName_fr());
        newStop.setLat(stop.getLat());
        newStop.setLng(stop.getLng());
        newStop.setStopnumber(stop.getStopnumber());
        newStop.setDescription(stop.getDescription());
        newStop.setDateOfModification(new Date());
        return stopRepo.save(newStop);
    }
    public void  deleteAll(){
        stopRepo.deleteAll();
    }

    public void deleteStopbyId(String id){
        Optional<Stop> optionalstop = stopRepo.findById(id);
        if (optionalstop.isPresent()){
            stopRepo.deleteById(id);
            Stop stop = optionalstop.get();
            List<Path> containsStop = pathRepo.findByStopsContaining(stop);
           for (Path path : containsStop){
               path.getStops().remove(containsStop);
               pathRepo.save(path);
           }

        }else {
            throw new NotFoundHandler(id);
        }
    }
    private List<StopDTO> convertToStopDTO(List<Stop> stop) {
        List<StopDTO> dtoList = new ArrayList<>();
        for (Stop stop1 : stop) {
            StopDTO dto = new StopDTO();
            dto.setId(stop1.getId());
            dto.setLat(stop1.getLat());
            dto.setLng(stop1.getLng());
            dto.setDescription(stop1.getDescription());
            dto.setStopnumber(stop1.getStopnumber());
            dto.setName_fr(stop1.getName_fr());
            dto.setName_ar(stop1.getName_ar());
            dtoList.add(dto);

        }
        return dtoList;
    }
    }
