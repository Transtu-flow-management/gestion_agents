package com.transtu.transtu.Service;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Document.Warehouse;
import com.transtu.transtu.Repositoy.AgentRepo;
import com.transtu.transtu.Repositoy.RoleRepo;
import com.transtu.transtu.Repositoy.entropotRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.*;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Field;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AgentService  {
    @Autowired
    public AgentRepo agentRepo;
    @Autowired
    private RoleRepo roleRepo;
    @Autowired
    private entropotRepo entropotRepo;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private StoregeService storegeService;

    public List<Agent> findAllAgents(){
        List<Agent> agents = agentRepo.findAll();
       return agents;
    }

   //@Cacheable(cacheNames = "cachedAgents", key = "'Agents_' + #pageable.pageNumber")
   public Page<AgentDTO> getAllagents(Pageable pageable) {
       Page<Agent> agentPage = agentRepo.findAll(pageable);
       List<AgentDTO> agentDTOs = convertDtoToEntity(agentPage.getContent());
       return new PageImpl<>(agentDTOs, pageable, agentPage.getTotalElements());
   }
    private Sort.Order currentOrder = Sort.Order.asc("name");
    private Sort.Order currentOrderDate = Sort.Order.asc("dateOfInsertion");
    public Page<AgentDTO> getAllAgentsSorted(Pageable pageable) {
        currentOrder = (currentOrder.isAscending()) ? Sort.Order.desc("name") : Sort.Order.asc("name");
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),  Sort.by(currentOrder));
        Page<Agent> agentPage = agentRepo.findAll(sortedPageable);
        List<AgentDTO> agentDTOs = convertDtoToEntity(agentPage.getContent());
        return new PageImpl<>(agentDTOs, sortedPageable, agentPage.getTotalElements());
    }
    public Page<AgentDTO> getAllAgentsSortedDate(Pageable pageable) {
        currentOrder = (currentOrderDate.isAscending()) ? Sort.Order.desc("dateOfInsertion") : Sort.Order.asc("dateOfInsertion");
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),  Sort.by(currentOrder));
        Page<Agent> agentPage = agentRepo.findAll(sortedPageable);
        List<AgentDTO> agentDTOs = convertDtoToEntity(agentPage.getContent());
        return new PageImpl<>(agentDTOs, sortedPageable, agentPage.getTotalElements());
    }
    public void DeleteAgents(){
        agentRepo.deleteAll();
    }


    public Agent updateAgent(int id,Agent agent){
        Optional<Agent> isExisting = agentRepo.findById(id);
        Agent agentexist = isExisting.get();
        String username = agentexist.getUsername();
        Agent user = agentRepo.findByUsername(username);
            if (!agent.getNewPassword().isEmpty() && agent.getNewPassword() != null  && agent.getPassword() != null && !agent.getPassword().isEmpty())
            if (passwordEncoder.matches(agent.getPassword(), user.getPassword())) {
               agentexist.setPassword(passwordEncoder.encode(agent.getNewPassword()));
            }else {
                throw new IllegalArgumentException("Password missmatch");
            }

        agentexist.setName(agent.getName());
        agentexist.setPhone(agent.getPhone());
        agentexist.setSurname(agent.getSurname());
        agentexist.setDateOfBirth(agent.getDateOfBirth());
        agentexist.setAddress(agent.getAddress());
        agentexist.setUsername(agent.getUsername());
        return agentRepo.save(agentexist);
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
                } else if (key.equals("warehouse") && value != null) {
                    Integer whID;
                    if (value instanceof String) {
                        whID = Integer.parseInt((String) value);
                    } else if (value instanceof Integer) {
                        whID = (Integer) value;
                    } else {
                        whID = null;
                    }
                    if (whID != null) {
                        Optional<Warehouse> warehouseOptional = entropotRepo.findById(whID);
                        warehouseOptional.ifPresent(agent::setWarehouse);
                    }
                }
                else if (key.equals("password") && value !=null){
                    String password = (String) value;
                    if (password!=null){
                    String hashedNewPassword = passwordEncoder.encode(password);
                    agent.setPassword(hashedNewPassword);}
                }
                else
                {
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
        if (agent.getWarehouse() != null){
            agentDTO.setWarehouseName(agent.getWarehouse().getName());
        }
        else {
            agentDTO.setWarehouseName(null);
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
            if (user2.getWarehouse() != null){
                Warehouse warehouse = user2.getWarehouse();
                dto.setWarehouseName(warehouse.getName());
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

    public ResponseEntity<Resource> getFile(String filename) {
        Resource file = storegeService.loadFile(filename);
        HttpHeaders headers = new HttpHeaders();
        if (!file.getFilename().equals(null)){
        headers.setContentDisposition(ContentDisposition.inline().filename(file.getFilename()).build());}
        return ResponseEntity.ok()
                .headers(headers)
                .body(file);
    }



}