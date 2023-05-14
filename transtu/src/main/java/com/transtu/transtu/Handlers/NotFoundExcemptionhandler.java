package com.transtu.transtu.Handlers;


public class NotFoundExcemptionhandler extends RuntimeException {
    public NotFoundExcemptionhandler(Integer roleid ){
        super("Role not found in the database: "+roleid);
    }
}
