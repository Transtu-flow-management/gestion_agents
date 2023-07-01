package com.transtu.transtu.Controller;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Repositoy.AgentPageRepo;
import com.transtu.transtu.Repositoy.AgentRepo;
import com.transtu.transtu.Service.AgentService;
import com.transtu.transtu.Service.AuthenticationService;
import com.transtu.transtu.Service.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;

import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.transtu.transtu.Document.Agent.SEQUENCE_NAME;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private MongoOperations mongoOperations;
    @Autowired
    private AgentService service;
    private AuthenticationService authservice;
    @Autowired
    SequenceGeneratorService mongo;
    @Autowired
    private AgentRepo agentRepo;


    @GetMapping("/p")
   public Page<AgentDTO> getAgents(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "2") int size
                                  ) {
        Pageable pageable = PageRequest.of(page, size);
            return service.getAllagents(pageable);
    }
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
    private ResponseEntity<AgentDTO> patched(@PathVariable int agentid,@RequestParam Map<String, Object> champs, @RequestParam(value = "image",required = false) MultipartFile file) {
        Agent patch = service.patchAgent(agentid, champs,file);
        AgentDTO patchedDTO = service.convertDTOToDocument(patch);
        return ResponseEntity.ok(patchedDTO);
    }


    @DeleteMapping("/deleteAll")
    private ResponseEntity<String> deleteAll() {

        service.DeleteAgents();
        mongo.resetSequence(SEQUENCE_NAME);
        return ResponseEntity.noContent().build();
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
    @DeleteMapping("/{agentid}/role/{roleid}")
    public ResponseEntity<?> DeleteRoleFromAgent(@PathVariable Integer agentid, @PathVariable Integer roleid) throws ChangeSetPersister.NotFoundException {
        service.deleteRoleFromAgenta(agentid, roleid);
        return ResponseEntity.ok(HttpStatus.ACCEPTED);
    }
    @GetMapping("/search")
    public List<AgentDTO> searchAgents(@RequestParam("query") String query) {
        Query searchQuery = new Query()
                .addCriteria(Criteria.where("name").regex(query, "i"));
        List<Agent> agents = mongoOperations.find(searchQuery, Agent.class);
        List<AgentDTO> agentDTOs = service.convertDtoToEntity(agents);
        return  agentDTOs;
    }
    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        return service.getFile(filename);
    }

}