package controllers

import (
	"context"
	models "e/Models"
	"encoding/json"
	"net/http"
	"time"
)

func storeToRedis(w http.ResponseWriter,r *http.Request){
	c, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var location models.GPS
	defer cancel()
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&location)
	if err != nil{
		http.Error(w,"Invalid Data",http.StatusBadRequest)
		return
	}

	
	
}