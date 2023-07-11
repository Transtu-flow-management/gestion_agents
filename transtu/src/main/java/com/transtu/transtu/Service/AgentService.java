package com.transtu.transtu.Service;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Conductor;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Repositoy.AgentPageRepo;
import com.transtu.transtu.Repositoy.AgentRepo;
import com.transtu.transtu.Repositoy.RoleRepo;
import com.transtu.transtu.utils.StoregeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
    @Autowired
    private AgentPageRepo agentPageRepo;

    public AgentService() {
    }

    public List<Agent> findAllAgents(){
        List<Agent> agents = agentRepo.findAll();
       return agents;
    }
   /* public Page<AgentDTO> getAllagents(Pageable pageable) {
        return agentRepo.findAll(pageable);
    }*/
   public Page<AgentDTO> getAllagents(Pageable pageable) {
       Page<Agent> agentPage = agentRepo.findAll(pageable);
       List<AgentDTO> agentDTOs = convertDtoToEntity(agentPage.getContent());
       return new PageImpl<>(agentDTOs, pageable, agentPage.getTotalElements());
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
        agent1.setSurname(agent.getSurname());
        //agent1.setRoles(agent.getRoles());
        agent1.setImageUrl(agent.getImageUrl());
        agent1.setPhone(agent.getPhone());
        agent1.setUsername(agent.getUsername());
        agent1.setDateOfBirth(agent.getDateOfBirth());
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
                    Integer roleId;
                    if (value instanceof String) {
                        roleId = Integer.parseInt((String) value);
                    } else if (value instanceof Integer) {
                        roleId = (Integer) value;
                    } else {
                        roleId = null;
                    }
                    if (roleId != null) {
                        Optional<Role> role = roleRepo.findById(roleId);
                        role.ifPresent(agent::setRole);
                    }
                } else {
                    Field field = ReflectionUtils.findField(Agent.class, key);
                    if (field!=null){
                    field.setAccessible(true);
                    ReflectionUtils.setField(field, agent, value);}
                    else {
                        throw new RuntimeException("Field not found or inaccessible: " + key);
                    }
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
        agentDTO.setPhone(agent.getPhone());
        if (agent.getRole() != null) {
            agentDTO.setRoleName(agent.getRole().getRoleName());

        }else {
            agentDTO.setRoleName(null);
        }
        agentDTO.setImageUrl(agent.getImageUrl());
        agentDTO.setSurname(agent.getSurname());
        agentDTO.setUsername(agent.getUsername());
        agentDTO.setDateOfBirth(agent.getDateOfBirth());
        agentDTO.setAddress(agent.getAddress());
        agentDTO.setPhone(agent.getPhone());
        agentDTO.setDateOfModification(agent.getDateOfModification());
        return agentDTO;
    }

// convertion de DTO vers entité normale sur la methode GET seulement
    public  List<AgentDTO> convertDtoToEntity(List<Agent> userList) {
        List<AgentDTO> dtoList = new ArrayList<>();

        for(Agent user2 : userList)
        {
            AgentDTO dto = new AgentDTO();

            dto.setId(user2.getId());
            dto.setName(user2.getName());
            dto.setSurname(user2.getSurname());
            dto.setPhone(user2.getPhone());
            dto.setUsername(user2.getUsername());
            dto.setImageUrl(user2.getImageUrl());
            dto.setAddress(user2.getAddress());
            dto.setDateOfBirth(user2.getDateOfBirth());
            dto.setDateOfInsertion(user2.getDateOfInsertion());
            dto.setDateOfModification(user2.getDateOfModification());
            if (user2.getRole() != null) {
                Role role = user2.getRole();
                dto.setRoleName(role.getRoleName());
            }else {
                dto.setRoleName(null);
            }
            dtoList.add(dto);
        }

        return dtoList;
    }
    public List<Agent> getAllConductorsWithDateFilter(Date date) {
        Calendar startOfDay = Calendar.getInstance();
        startOfDay.setTime(date);
        startOfDay.set(Calendar.HOUR_OF_DAY, 0);
        startOfDay.set(Calendar.MINUTE, 0);
        startOfDay.set(Calendar.SECOND, 0);

        Calendar endOfDay = Calendar.getInstance();
        endOfDay.setTime(date);
        endOfDay.set(Calendar.HOUR_OF_DAY, 23);
        endOfDay.set(Calendar.MINUTE, 59);
        endOfDay.set(Calendar.SECOND, 59);
        return agentRepo.findBydateOfInsertionBetween(startOfDay.getTime(), endOfDay.getTime());
    }

    public void AssignRoleToAgent(Integer agentid, Integer roleid) throws ChangeSetPersister.NotFoundException {
        Agent agent = agentRepo.findById(agentid).orElseThrow(()-> new ChangeSetPersister.NotFoundException());
        Role role = roleRepo.findById(roleid).orElseThrow(() -> new ChangeSetPersister.NotFoundException());
        agent.addRole(role);
        agentRepo.save(agent);
    }
    public void deleteRoleFromAgenta(Integer agentid,Integer roleid){
        Agent agent = agentRepo.findById(agentid).orElseThrow(()-> new NotFoundExcemptionhandler(agentid));
        Role role = roleRepo.findById(roleid).orElseThrow(()-> new NotFoundExcemptionhandler((roleid)));
        agent.deleteRole(role);
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
public Page <AgentDTO> searchAgents(String searchterm, Pageable p){
        List<Agent> allagents = agentRepo.findAll();
        List<Agent> filteredagents = allagents.stream().filter(agent ->containssearchterm(agent,searchterm)).collect(Collectors.toList());
        int startindex = p.getPageNumber() * p.getPageSize();
        int endIndex = Math.min(startindex + p.getPageSize(), filteredagents.size());
    List<Agent> agentsPage = filteredagents.subList(startindex, endIndex);
    List<AgentDTO> agentsDtoPage = convertDtoToEntity(agentsPage);
    long totalCount = filteredagents.size();
    return new PageImpl<>(agentsDtoPage, p, totalCount);
}
    private boolean containssearchterm(Agent agent, String searchTerm) {
        String lowercaseSearchTerm = searchTerm.toLowerCase();
        return agent.getName().toLowerCase().contains(lowercaseSearchTerm)
                || agent.getSurname().toLowerCase().contains(lowercaseSearchTerm)
                || agent.getUsername().toLowerCase().contains(lowercaseSearchTerm);
    }

}