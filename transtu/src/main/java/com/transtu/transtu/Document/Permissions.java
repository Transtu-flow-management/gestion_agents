package com.transtu.transtu.Document;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@Getter
public enum Permissions {

    UPDATE("update","manage agents"),

    READ("read","manage agents"),

    WRITE("write","manage agents"),
    UPDATE_DEPOT("update entropot","manage warehouse"),

    DELETE("delete","manage agents"),

    DELETE_Agent("delete Agent","manage agents"),

    DELETE_BRAND("delete a brand","manage brands"),

    DELETE_USER("delete a user","manage agents"),
    DELETE_DEPOT("delete entropot","manage warehouse"),
    READ_LINES("read line","manage lines"),
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
