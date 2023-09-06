package routes

import (
	 "e/Controllers"

	"github.com/gorilla/mux"
)
// swagger:route GET /admin/company/ admin listCompany
// Get cars list
//
// security:
// - apiKey: []
// responses:
//  401: CommonError
//  200: Getcars
func CarRoute(router *mux.Router)  {
	// swagger:route POST /create create a new car
	//  201: newCar created
	router.HandleFunc("/create", controllers.CreateCar()).Methods("POST")
	router.HandleFunc("/car/{carid}", controllers.GetaCar()).Methods("GET")
	router.HandleFunc("/car/{carid}", controllers.EditaCar()).Methods("PUT")
}