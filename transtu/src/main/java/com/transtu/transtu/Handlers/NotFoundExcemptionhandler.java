package com.transtu.transtu.Handlers;


public class NotFoundExcemptionhandler extends RuntimeException {
    public NotFoundExcemptionhandler(Integer id ){
        super("not found in the database: "+id);
    }
}
