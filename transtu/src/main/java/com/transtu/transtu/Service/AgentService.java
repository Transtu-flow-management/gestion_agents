package com.transtu.transtu.Service;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Permissions;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Repositoy.AgentRepo;
import com.transtu.transtu.Repositoy.RoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AgentService implements UserDetailsService {
    @Autowired
    private AgentRepo agentRepo;
    @Autowired
    private RoleRepo roleRepo;

    public List<AgentDTO> findAllAgents(){
        List<Agent> agents = agentRepo.findAll();
        return convertDtoToEntity(agents);
    }

    public Agent createAgent(Agent agent){
        String username = agent.getUsername();
        if (agentRepo.existsByUsername(username)){
            throw new IllegalArgumentException("username deja existant");
        }
        return agentRepo.save(agent);
    }
    public void DeleteAgents(){
        agentRepo.deleteAll();
    }
    public Agent updateAgent(Integer id,AgentDTO agent){
        Agent agent1 = agentRepo.findById(id).orElseThrow(()->new NoSuchElementException(("Agent introuvable")));
        agent1.setUsername(agent.getUsername());
        agent1.setPassword(agent.getPassword());
    return agentRepo.save(agent1);
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
    public AgentDTO convertDTOToDocument(Agent agent){
        AgentDTO agentDTO = new AgentDTO();
        agentDTO.setId(agent.getId());
        agentDTO.setUsername(agent.getUsername());
        agentDTO.setPassword(agent.getPassword());
        return agentDTO;
    }

// convertion de DTO vers entité normale sur la methode GET seulement
    private static List<AgentDTO> convertDtoToEntity(List<Agent> userList) {
        List<AgentDTO> dtoList = new ArrayList<>();

        for(Agent user2 : userList)
        {
            AgentDTO dto = new AgentDTO();

            dto.setId(user2.getId());
            dto.setUsername(user2.getUsername());
            Set<String> roleNames = user2.getRoles().stream()
                    .map(Role::getRoleName)
                    .collect(Collectors.toSet());
            dto.setRoleName(roleNames);
            dtoList.add(dto);
        }

        return dtoList;
    }


    public void AssignRoleToAgent(Integer agentid, Integer roleid) throws ChangeSetPersister.NotFoundException {
        Agent agent = agentRepo.findById(agentid).orElseThrow(()-> new ChangeSetPersister.NotFoundException());
        Role role = roleRepo.findById(roleid).orElseThrow(() -> new ChangeSetPersister.NotFoundException());
        agent.addRole(role);
        agentRepo.save(agent);
    }



}