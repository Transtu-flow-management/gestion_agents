//  Comapany Api:
//   version: 0.0.1
//   title: Comapany Api
//  Schemes: http, https
//  Host: localhost:5000
//  BasePath: /
//  Produces:
//    - application/json
//
// securityDefinitions:
//  apiKey:
//    type: apiKey
//    in: header
//    name: authorization
// swagger:meta

package controllers

import (
	"context"

	"e/Models"
	"e/Responses"
	"e/configs"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var carCollection *mongo.Collection = configs.GetCollection(configs.DB, "Cars")
var validate = validator.New()

func CreateCar() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var car models.Car
		defer cancel()
		if err := json.NewDecoder(r.Body).Decode(&car); err != nil {
			w.WriteHeader(http.StatusBadRequest)

			response := responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: map[string]interface{}{"data": err.Error()}}
			json.NewEncoder(w).Encode(response)
			return
		}
		if validationErr := validate.Struct(&car); validationErr != nil {
			w.WriteHeader(http.StatusBadRequest)
			response := responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: map[string]interface{}{"data": validationErr.Error()}}
			json.NewEncoder(w).Encode(response)
			return
		}
		newcar := models.Car{

			Name:      car.Name,
			Matricule: car.Matricule,
			Mode:      car.Mode,
		}
		res, err := carCollection.InsertOne(c, newcar)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			resp := responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}}
			json.NewEncoder(w).Encode(resp)
			return
		}
		w.WriteHeader(http.StatusCreated)
		resp := responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: map[string]interface{}{"data": res}}
		json.NewEncoder(w).Encode(resp)
	}

}
func GetaCar() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c := context.TODO()
		vars := mux.Vars(r)
		objectID, err := primitive.ObjectIDFromHex(vars["carid"])
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			response := responses.UserResponse{Status: http.StatusBadRequest, Message: "Invalid ID", Data: nil}
			json.NewEncoder(w).Encode(response)
			return
		}

		var car models.Car

		err = carCollection.FindOne(c, bson.M{"_id": objectID}).Decode(&car)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				w.WriteHeader(http.StatusNotFound)
				response := responses.UserResponse{Status: http.StatusNotFound, Message: "Car not found", Data: nil}
				json.NewEncoder(w).Encode(response)
				return
			}

			w.WriteHeader(http.StatusInternalServerError)
			response := responses.UserResponse{Status: http.StatusInternalServerError, Message: "Internal server error", Data: map[string]interface{}{"data": err.Error()}}
			json.NewEncoder(w).Encode(response)
			return
		}

		w.WriteHeader(http.StatusOK)
		response := responses.UserResponse{Status: http.StatusOK, Message: "success", Data: map[string]interface{}{"data": car}}
		json.NewEncoder(w).Encode(response)
	}
}

func EditaCar() http.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
	c, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	params := mux.Vars(r)
	carid := params["carid"]
	var car models.Car
	defer cancel()
	
		objId, _ := primitive.ObjectIDFromHex(carid)
	
		//validate the request body
		if err := json.NewDecoder(r.Body).Decode(&car); err != nil {
			rw.WriteHeader(http.StatusBadRequest)
			response := responses.UserResponse{Status: http.StatusBadRequest, Message: "error request body", Data: map[string]interface{}{"data": err.Error()}}
			json.NewEncoder(rw).Encode(response)
			return
		}
	
		//use the validator library to validate required fields
		if validationErr := validate.Struct(&car); validationErr != nil {
			rw.WriteHeader(http.StatusBadRequest)
			response := responses.UserResponse{Status: http.StatusBadRequest, Message: "error struct", Data: map[string]interface{}{"data": validationErr.Error()}}
			json.NewEncoder(rw).Encode(response)
			return
		}
	
		update := bson.M{"name": car.Name, "matricule": car.Matricule, "mode": car.Mode}
	
		result, err := carCollection.UpdateOne(c, bson.M{"_id": objId}, bson.M{"$set": update})
		if err != nil {
			rw.WriteHeader(http.StatusInternalServerError)
			response := responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}}
			json.NewEncoder(rw).Encode(response)
			return
		}
		if result.MatchedCount == 0 {
			rw.WriteHeader(http.StatusNotFound)
			response := responses.UserResponse{Status: http.StatusNotFound, Message: "Car not found", Data: nil}
			json.NewEncoder(rw).Encode(response)
			return
		}
//update car
		var updatedCar models.Car
		if result.MatchedCount == 1 {
			err := carCollection.FindOne(c, bson.M{"_id": objId}).Decode(&updatedCar)
	
			if err != nil {
				rw.WriteHeader(http.StatusInternalServerError)
				response := responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}}
				json.NewEncoder(rw).Encode(response)
				return
			}
		}
	
		rw.WriteHeader(http.StatusOK)
		response := responses.UserResponse{Status: http.StatusOK, Message: "success", Data: map[string]interface{}{"data": updatedCar}}
		json.NewEncoder(rw).Encode(response)
	}
	}
