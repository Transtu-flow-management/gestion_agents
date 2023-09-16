package com.transtu.transtu.Service;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.DTO.PathDTO;
import com.transtu.transtu.DTO.StopDTO;
import com.transtu.transtu.Document.*;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.LineRepo;
import com.transtu.transtu.Repositoy.PathRepo;
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
public class PathService {
    @Autowired
    private PathRepo pathRepo;
    @Autowired
    private LineRepo lineRepo;

    public Page<Path> getAllpaths(Pageable pageable) {
        return pathRepo.findAll(pageable);

    }

    public List<Path> getall() {
        return pathRepo.findAll();
    }

    public Path createPath(Path path) {
        if (path.getLine() == null || path.getLine().getId() == null) {
            throw new IllegalArgumentException("Line id must be provided");
        }
        String nameFr = path.getStartFr();
        String nameAr = path.getStartAr();
        String endAr = path.getEndAr();
        String endFr = path.getEndFr();
        if (((pathRepo.existsByStartFr(nameFr) || pathRepo.existsByStartAr(nameAr))
                && (pathRepo.existsByEndAr(endAr) || pathRepo.existsByEndFr(endFr)))) {
            throw new IllegalArgumentException("start path and end path should be different");
        }
        path.setDateOfInsertion(new Date());
        Path savedpath = pathRepo.save(path);
        return savedpath;
    }

    public Path updatePath(String id, Path newpath) {
        Path path = pathRepo.findById(id).orElseThrow(() -> new NotFoundHandler(id));
        path.setStartAr(newpath.getStartAr());
        path.setStartFr(newpath.getStartFr());
        path.setEndAr(newpath.getEndAr());
        path.setEndFr(newpath.getEndFr());
        path.setType(newpath.getType());
        path.setData(newpath.getData());
        Line newline = newpath.getLine();
        if (newline != null) {
            Optional<Line> lineOptional = lineRepo.findById(newline.getId());
            if (lineOptional.isPresent()) {
                path.setLine(lineOptional.get());
            }
        }
        path.setDateOfModification(new Date());
        return pathRepo.save(path);
    }

    public void deleteAll() {
        pathRepo.deleteAll();
    }

    public void deletePathbyId(String id) {
        Optional<Path> optionalpath = pathRepo.findById(id);
        if (optionalpath.isPresent()) {
            pathRepo.deleteById(id);
        } else {
            throw new NotFoundHandler(id);
        }
    }
}
