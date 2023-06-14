package com.transtu.transtu.Service;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Permissions;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Repositoy.AgentRepo;
import com.transtu.transtu.Repositoy.RoleRepo;
import com.transtu.transtu.utils.StoregeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AgentService implements UserDetailsService {
    @Autowired
    private AgentRepo agentRepo;
    @Autowired
    private RoleRepo roleRepo;
    @Autowired
    private StoregeService storegeService;

    public List<AgentDTO> findAllAgents(){
        List<Agent> agents = agentRepo.findAll();
        return convertDtoToEntity(agents);
    }
    public Page<Agent> getAllagents(Pageable pageable) {
        return agentRepo.findAll(pageable);
    }
    /*public Agent createAgent(Agent agent){
        String username = agent.getUsername();
        if (agentRepo.existsByUsername(username)){
            throw new IllegalArgumentException("username deja existant");
        }
        return agentRepo.save(agent);
    }*/
    public void DeleteAgents(){
        agentRepo.deleteAll();
    }
    public Agent updateAgent(Integer id,Agent agent){
        Agent agent1 = agentRepo.findById(id).orElseThrow(()->new NoSuchElementException(("Agent introuvable")));
        agent1.setName(agent.getName());
        agent1.setPrenom(agent.getPrenom());
        //agent1.setRoles(agent.getRoles());
        agent1.setEmail(agent.getEmail());
        agent1.setImageUrl(agent.getImageUrl());
        agent1.setPhone(agent.getPhone());
        agent1.setUsername(agent.getUsername());
        agent1.setPassword(agent.getPassword());
        agent1.setDateOfModification(new Date());
    return agentRepo.save(agent1);
    }
    public Agent patchAgent(int id, Map<String, Object> champs, MultipartFile file) {
        Optional<Agent> isExisting = agentRepo.findById(id);
        if (isExisting.isPresent()) {
            Agent agent = isExisting.get();
            champs.forEach((key, value) -> {
                if (key.equals("dateOfModification")) {
                    agent.setDateOfModification((Date) value);
                } else if (key.equals("roles") && value != null) {
                    agent.getRoles().clear();
                    Integer roleId = (Integer) value;
                    Optional<Role> role = roleRepo.findById(roleId);
                    role.ifPresent(agent.getRoles()::add);
                }else {
                    Field champ = ReflectionUtils.findField(Agent.class, key);
                    champ.setAccessible(true);
                    ReflectionUtils.setField(champ, agent, value);
                }
            });
            if (file != null && !file.isEmpty()) {
                String filename = storegeService.CreateNameImage(file);
                storegeService.store(file, filename);
                agent.setImageUrl(filename);}
            agent.setDateOfModification(new Date());
            return agentRepo.save(agent);
        }
        return null;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
    public AgentDTO convertDTOToDocument(Agent agent){
        AgentDTO agentDTO = new AgentDTO();
        agentDTO.setId(agent.getId());
        agentDTO.setName(agent.getName());
        agentDTO.setEmail(agent.getEmail());
        agentDTO.setPhone(agent.getPhone());
        if (!agent.getRoles().isEmpty()) {
            Role role = agent.getRoles().iterator().next();
            agentDTO.setRoleName(role.getRoleName());
        }
        agentDTO.setImageUrl(agent.getImageUrl());
        agentDTO.setPrenom(agent.getPrenom());
        agentDTO.setUsername(agent.getUsername());
        agentDTO.setDateOfModification(agent.getDateOfModification());
        return agentDTO;
    }

// convertion de DTO vers entité normale sur la methode GET seulement
    private static List<AgentDTO> convertDtoToEntity(List<Agent> userList) {
        List<AgentDTO> dtoList = new ArrayList<>();

        for(Agent user2 : userList)
        {
            AgentDTO dto = new AgentDTO();

            dto.setId(user2.getId());
            dto.setName(user2.getName());
            dto.setPrenom(user2.getPrenom());
            dto.setEmail(user2.getEmail());
            dto.setUsername(user2.getUsername());
            dto.setImageUrl(user2.getImageUrl());
            dto.setDateOfInsertion(user2.getDateOfInsertion());
            dto.setDateOfModification(user2.getDateOfModification());
            if (!user2.getRoles().isEmpty()) {
                Role role = user2.getRoles().iterator().next();
                dto.setRoleName(role.getRoleName());
            }
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

    public ResponseEntity<Resource> getFile(String filename) {
        Resource file = storegeService.loadFile(filename);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.inline().filename(file.getFilename()).build());
        return ResponseEntity.ok()
                .headers(headers)
                .body(file);
    }



}