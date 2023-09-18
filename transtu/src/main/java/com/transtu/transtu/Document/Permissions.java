package com.transtu.transtu.Document;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@Getter
public enum Permissions implements Serializable {
    WRITE("write","manage agents"),
    UPDATE("update","manage agents"),
    READ("read","manage agents"),
    DELETE_USER("delete","manage agents"),
    Assign_ROLE("assign_Role","manage agents"),
    Delete_ROLE("Delete_Role","manage agents"),
    READ_PERM("showPermission","manage agents"),
    DELETE_BRAND("deleteBrand","manage brands (marques)"),
    ADD_BRAND("addBrand","manage brands (marques)"),
    READ_BRAND("readBrand","manage brands (marques)"),
    UPDATE_BRAND("update_brand","manage brands (marques)"),

    DELETE_DEPOT("deleteDepot","manage depot "),
    UPDATE_DEPOT("updateDepot","manage depot"),
    READ_DEPOT("readDepot","manage depot"),
    WRITE_DEPOT("writeDepot","manage depot"),


    UPDATE_CAR("updateCar","manage Vehicules"),
    READ_CAR("readCar","manage Vehicules"),
    WRITE_CAR("writeCar","manage Vehicules"),
    Del_CAR("deleteCar","manage Vehicules"),

    Del_Con("deleteCondition","manage Conditions "),
    UCond("updateCondition","manage Conditions"),
    RCond("readCondition","manage Conditions"),
    WCond("writeCondition","manage Conditions"),

    DConductor("deleteChauffeur","manage Chauffeurs "),
    UConductor("updateChauffeur","manage Chauffeurs"),
    RConductor("readChauffeur","manage Chauffeurs"),
    WConductor("writeChauffeur","manage Chauffeurs"),


    ULINE("updateLigne","manage lignes"),
    DLINE("deleteLigne","manage lignes "),
    RLINE("readLigne","manage lignes"),
    WLINE("writeLigne","manage lignes"),

    DPATH("deleteTraget","manage iténiraire "),
    UPATH("updateTraget","manage iténiraire"),
    RPATH("readTraget","manage iténiraire"),
    WPATH("writeTraget","manage iténiraire"),

    DROLE("deleteRole","manage Roles "),
    UROLE("updateRole","manage Roles"),
    RROLE("readRole","manage Roles"),
    WROLE("writeRole","manage Roles"),
    AssignPERM("AssignPermissions","manage Roles"),

    DSTOP("deleteArrêt","manage Arrêts "),
    USTOP("updateArrêt","manage Arrêts"),
    RSTOP("readArrêt","manage Arrêts"),
    WSTOP("writeArrêt","manage Arrêts"),
    PCRR("pcr_read","PCR"),
    PCRW("pcr_write","PCR"),
    PCRD("pcr_Delete","PCR"),


    DEFAULT_PERMISSION("defaultPermission", "defaultGroup");
    private final String permissionName;
    private final String group;

  public static Permissions fromstring(String str){
      for (Permissions p: Permissions.values()){
          if(p.getPermissionName().equals(str))
              return p;
      }
      return null;
  }
}
