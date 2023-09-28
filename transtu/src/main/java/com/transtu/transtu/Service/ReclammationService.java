package com.transtu.transtu.Service;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Car;
import com.transtu.transtu.Document.Reclammation;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.CarRepo;
import com.transtu.transtu.Repositoy.ReclamRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReclammationService {
    @Autowired
    private ReclamRepo reclamRepo;
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private CarRepo carRepo;
public List<Reclammation>getAlltypes(){
    return  reclamRepo.findAll();
}
    public Page<Reclammation> getallReclams(Pageable pageable){
        return  reclamRepo.findAll(pageable);
    }

public Reclammation createReclam(Reclammation reclammation){
    reclammation.setDateOfCreation(new Date());
    if (reclammation.getCar() == null ) {
        throw new IllegalArgumentException("Car ID must be provided");
    }


    return reclamRepo.save(reclammation);
}

public Reclammation updateReclammation(String id,Reclammation newReclam){
    Reclammation oldReclam = reclamRepo.findById(id).orElseThrow(()->new NotFoundHandler(id));
    oldReclam.setContext(newReclam.getContext());
    oldReclam.setEmail(newReclam.getEmail());
    oldReclam.setType(newReclam.getType());
    oldReclam.setPredifinedContext(newReclam.getPredifinedContext());
    oldReclam.setTimeOfIncident(newReclam.getTimeOfIncident());

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
    public void sendMail(String context,String text,String sender){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(sender);
        message.setSubject(context);
        message.setText(text);
        javaMailSender.send(message);

    }

}
