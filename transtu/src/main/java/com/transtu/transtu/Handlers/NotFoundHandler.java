package com.transtu.transtu.Handlers;

public class NotFoundHandler extends RuntimeException{
    public NotFoundHandler(String id){
        super("not found in the database: "+id);
    }
}
