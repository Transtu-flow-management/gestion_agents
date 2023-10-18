package controllers

import (
	"context"
	configs "e/Configs"
	models "e/Models"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()
var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	clients = make(map[*websocket.Conn]string)
)

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer conn.Close()

	currentVehicleID := ""

	for {
		var location models.GPS
		if err := conn.ReadJSON(&location); err != nil {
			fmt.Println("Error reading data:", err)
			return
		}
		if location.Matricule != currentVehicleID {
			fmt.Println("Switching to vehicle ID:", location.Matricule)
			currentVehicleID = location.Matricule
		}

		go func(vehicleID string) {
			for {
				if vehicleID != currentVehicleID {
					fmt.Println("Stopping updates for old vehicle ID:", vehicleID)
					return
				}
				fullData, lat, lang, err := GetLocationData(vehicleID)
				if err != nil {
					fmt.Println("Error starting updates:", err)

				}

				//codeBy oussama omrani
				response := struct {
					FullData  string  `json:"fullData"`
					Latitude  float64 `json:"lat"`
					Longitude float64 `json:"lang"`
				}{
					FullData:  fullData,
					Latitude:  lat,
					Longitude: lang,
				}

				if err := conn.WriteJSON(response); err != nil {
					fmt.Println("Error sending to client:", err)
					return
				}

				time.Sleep(2 * time.Second)
			}
		}(currentVehicleID)
	}
}
func GetLocationData(vehicleID string) (string, float64, float64, error) {
	fullDataKey := "location:" + vehicleID
	fullData, err := configs.GetRedisClient().Get(ctx, fullDataKey).Result()
	if err != nil {
		return "", 0.0, 0.0, err
	}
	geoLocationKey := "vehicule:location:" + vehicleID
	results, err := configs.GetRedisClient().GeoPos(ctx, "locations", geoLocationKey).Result()
	if err != nil {
		return "", 0.0, 0.0, err
	}
	var lat, lang float64
	if len(results) > 0 {
		lat = results[0].Latitude
		lang = results[0].Longitude
	}

	return fullData, lat, lang, nil
}

func StoreLocation(w http.ResponseWriter, r *http.Request) {
	var location models.GPS

	err := json.NewDecoder(r.Body).Decode(&location)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	key := "location:" + location.Matricule
	data, err := json.Marshal(location)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	prevLocation, err := configs.GetRedisClient().Get(ctx, key).Result()
	if err != nil && err != redis.Nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if prevLocation != "" {
		// Calculate the distance between the new and previous locations using GEODIST
		distance, err := configs.GetRedisClient().GeoDist(ctx, "GeoADDlocations", "vehicule:location:"+location.Matricule, key, "m").Result()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if distance >= 50.0 {
			// Store new location data
			if err := configs.GetRedisClient().Set(ctx, key, data, 0).Err(); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			_, err := configs.GetRedisClient().GeoAdd(ctx, "GeoADDlocations", &redis.GeoLocation{
				Name:      "vehicule:location:" + location.Matricule,
				Latitude:  location.Lat,
				Longitude: location.Lang,
			}).Result()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	} else {

		if err := configs.GetRedisClient().Set(ctx, key, data, 0).Err(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		_, err := configs.GetRedisClient().GeoAdd(ctx, "GeoADDlocations", &redis.GeoLocation{
			Name:      "vehicule:location:" + location.Matricule,
			Latitude:  location.Lat,
			Longitude: location.Lang,
		}).Result()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Printf("Received POST request data: %+v\n", location)
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Location data stored successfully")
}

func StoreLocationwithoutCond(w http.ResponseWriter, r *http.Request) {
	var location models.GPS

	err := json.NewDecoder(r.Body).Decode(&location)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	key := "location:" + location.Matricule
	formattedData := fmt.Sprintf(
		"{Matricule:%s, Lat:%f, Lang:%f, Alt:%f, Speed:%f, Bearing:%f, Acc:%f, Addr:%s, RunningTime:%s, VersionAndroid:%s}",
		location.Matricule,
		location.Lat,
		location.Lang,
		location.Alt,
		location.Speed,
		location.Bearing,
		location.Acc,
		location.Addr,
		location.RunningTime,
		location.VersionAndroid,
	)
	go func() {
		if err := configs.GetRedisClient().Set(ctx, key, formattedData, 0).Err(); err != nil {
			fmt.Printf("Error storing data in Redis: %s\n", err)
		}
	}()

	lat := location.Lat
	lang := location.Lang
	go func() {
		_, err := configs.GetRedisClient().GeoAdd(ctx, "locations", &redis.GeoLocation{
			Name:      "vehicule:location:" + location.Matricule,
			Latitude:  lat,
			Longitude: lang,
		}).Result()
		if err != nil {
			fmt.Printf("Error adding data to Redis geo set: %s\n", err)
		}
	}()

	go func() {
		collectionName := "vehicule_" + location.Matricule
		collection := configs.GetMongoClient().Database(configs.GetDbname()).Collection(collectionName)
		_, err = collection.InsertOne(ctx, location)
		if err != nil {
			fmt.Printf("Error storing data in MongoDB: %s\n", err)
		}
	}()
	fmt.Printf("Received POST request data: %+v\n", location)

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Location data stored successfully")
}
