package com.transtu.transtu.Controller;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Permissions;
import com.transtu.transtu.Repositoy.AgentRepo;
import com.transtu.transtu.Service.AgentService;
import com.transtu.transtu.Service.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

import static com.transtu.transtu.Document.Agent.SEQUENCE_NAME;


@RestController
@RequestMapping("/api/agents")
public class AgentController {

@Autowired
private AgentService service;
@Autowired
    SequenceGeneratorService mongo;
    @Autowired
    private AgentRepo agentRepo;

    @GetMapping
   private List<AgentDTO>getall(){

        return service.findAllAgents();
    }
    /*@PutMapping("/update/{id}")
    private ResponseEntity<Agent> updateAgent (@PathVariable String id,@Valid @RequestBody Agent agent){
        return service.updateAgent(id,agent);
    }
    @DeleteMapping("/delete/{id}")
    private ResponseEntity<Agent> deleteAgent(@PathVariable String id){
        return service.deleteAgent(id);
    }*/
    @PostMapping("/add")
    private ResponseEntity<Agent> createAgent(@RequestBody Agent agent){
        agent.setId(mongo.generateSequence(SEQUENCE_NAME));
        Agent addagent = service.createAgent(agent);
        return ResponseEntity.ok(addagent);
    }
@DeleteMapping("/deleteAll")
    private ResponseEntity<String> deleteAll(){

       service.DeleteAgents();
       mongo.resetSequence(SEQUENCE_NAME);
       return ResponseEntity.ok("all agents are gone");
    }
    @PostMapping("/{agentid}/role/{roleid}")
    public ResponseEntity<String>AssignRoleToAgent(@PathVariable Integer agentid, @PathVariable Integer roleid) throws ChangeSetPersister.NotFoundException {
        service.AssignRoleToAgent(agentid,roleid);
        return ResponseEntity.ok("Roles are assigned");
    }
}
