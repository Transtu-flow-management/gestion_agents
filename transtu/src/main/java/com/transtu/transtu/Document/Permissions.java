package com.transtu.transtu.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@Getter
public enum Permissions {
    UPDATE("update"),
    READ("read"),
    WRITE("write"),
    DELETE("delete permission"),
    DELETE_USER("delete a user");
    private final String permissionName;

  public static Permissions fromstring(String str){
      for (Permissions p: Permissions.values()){
          if(p.getPermissionName().equals(str))
              return p;
      }
      return null;
  }
}
