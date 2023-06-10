package com.transtu.transtu.Controller;

import com.transtu.transtu.Auth.AuthenticationResponse;
import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Repositoy.AgentRepo;
import com.transtu.transtu.Service.AgentService;
import com.transtu.transtu.Service.AuthenticationService;
import com.transtu.transtu.Service.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static com.transtu.transtu.Document.Agent.SEQUENCE_NAME;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/agents")
public class AgentController {
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private AgentService service;
    private AuthenticationService authservice;
    @Autowired
    SequenceGeneratorService mongo;
    @Autowired
    private AgentRepo agentRepo;

    @GetMapping
    private List<AgentDTO> getall() {

        return service.findAllAgents();
    }

    @PutMapping("/update/{agentid}")
    private ResponseEntity<AgentDTO> updateagent(@PathVariable Integer agentid, @RequestBody Agent agentDTO) {

        Agent updated = service.updateAgent(agentid, agentDTO);
        AgentDTO updatedtDTO = service.convertDTOToDocument(updated);
        return ResponseEntity.ok(updatedtDTO);
    }

    @PatchMapping("/update/{agentid}")
    private ResponseEntity<Agent> patched(@PathVariable int agentid, @RequestBody Map<String, Object> champs) {
        Agent patch = service.patchAgent(agentid, champs);
        //AgentDTO patchedDTO = service.convertDTOToDocument(patch);
        return ResponseEntity.ok(patch);
    }


    @DeleteMapping("/deleteAll")
    private ResponseEntity<String> deleteAll() {

        service.DeleteAgents();
        mongo.resetSequence(SEQUENCE_NAME);
        return ResponseEntity.ok("all agents are gone");
    }

    @DeleteMapping("/delete/{agentid}")
    public ResponseEntity<?> deleteUserById(@PathVariable("agentid") Integer agentid) {
        // Check if the user exists
        Optional<Agent> userOptional = agentRepo.findById(agentid);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        agentRepo.deleteById(agentid);

        return ResponseEntity.accepted().build();
    }

    @PostMapping("/{agentid}/role/{roleid}")
    public ResponseEntity<String> AssignRoleToAgent(@PathVariable Integer agentid, @PathVariable Integer roleid) throws ChangeSetPersister.NotFoundException {
        service.AssignRoleToAgent(agentid, roleid);
        return ResponseEntity.ok("Role is assigned to agent");
    }

    @PostMapping("/{agentId}/uploadimg")
    public ResponseEntity<?> uploadImage(@PathVariable Integer agentId, @RequestParam("imageFile") MultipartFile imageFile) {
        Optional<Agent> optionalAgent = agentRepo.findById(agentId);
        if (!optionalAgent.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Agent agent = optionalAgent.get();
        try {
            agent.setImagedata(imageFile.getBytes());
            agentRepo.save(agent);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}