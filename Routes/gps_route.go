package routes

import (
	controllers "e/Controllers"

	"github.com/gorilla/mux"
)


func Gpsroute(router *mux.Router){
	router.HandleFunc("/track/{VehiculeID}",controllers.GetGpsData).Methods("GET")
	router.HandleFunc("/",controllers.StoreLocation).Methods("POST")
}

