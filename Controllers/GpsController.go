package controllers

import (
	"context"
	configs "e/Configs"
	models "e/Models"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"

)

var ctx = context.Background()

func GetGpsData(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	vehicleID := params["VehiculeID"]

	// Query Redis for the latest location data for the specified vehicle ID
	locationJSON, err := configs.GetRedisClient().HGet(context.Background(), "vehicle_locations", vehicleID).Result()
	if err != nil {
		http.Error(w, "Failed to retrieve location data", http.StatusInternalServerError)
		return
	}

	var location models.GPS
	if err := json.Unmarshal([]byte(locationJSON), &location); err != nil {
		http.Error(w, "Failed to fetch location data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(location)

}


func StoreLocation(w http.ResponseWriter, r *http.Request) {
    var location models.GPS

    err := json.NewDecoder(r.Body).Decode(&location)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    key := "location:" + location.VehiculeID
    data, err := json.Marshal(location)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Check if the vehicle has a previous location stored
    prevLocation, err := configs.GetRedisClient().Get(ctx, key).Result()
    if err != nil && err != redis.Nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    if prevLocation != "" {
        // Calculate the distance between the new and previous locations using GEODIST
        distance, err := configs.GetRedisClient().GeoDist(ctx, "GeoADDlocations", "vehicule:location:"+location.VehiculeID, key, "m").Result()
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        // Check if the bus has moved 50 meters or more
        if distance >= 50.0 {
            // Store new location data
            if err := configs.GetRedisClient().Set(ctx, key, data, 0).Err(); err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }

            // Update the last known location
            _, err := configs.GetRedisClient().GeoAdd(ctx, "GeoADDlocations", &redis.GeoLocation{
                Name:      "vehicule:location:" + location.VehiculeID,
                Latitude:  location.Lat,
                Longitude: location.Lang,
            }).Result()
            if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
        }
    } else {
        // If no previous location is found, store the new location unconditionally
        if err := configs.GetRedisClient().Set(ctx, key, data, 0).Err(); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        // Update the last known location
        _, err := configs.GetRedisClient().GeoAdd(ctx, "GeoADDlocations", &redis.GeoLocation{
            Name:      "vehicule:location:" + location.VehiculeID,
            Latitude:  location.Lat,
            Longitude: location.Lang,
        }).Result()
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        fmt.Printf("Received POST request data1: %+v\n", location)
    }

    w.WriteHeader(http.StatusOK)
    fmt.Fprintln(w, "Location data stored successfully")
}
