package com.transtu.transtu.Handlers;


public class NotFoundExcemptionhandler extends RuntimeException {
    public NotFoundExcemptionhandler(Integer roleid ){
        super("not found in the database: "+roleid);
    }
}
