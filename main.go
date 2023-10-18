package main

import (
	configs "e/Configs"
	routes "e/Routes"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-openapi/runtime/middleware"
	"github.com/gorilla/mux"
)

func main() {

//db connect
configs.ConnectDB()
	router := mux.NewRouter()
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST,OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	port := getPortFromArgsOrEnv()
	routes.Gpsroute(router)

	router.PathPrefix("/swagger.yaml").Handler(http.FileServer(http.Dir("./")))

	//Serve Swagger UI at /docs
	opts := middleware.RedocOpts{SpecURL: "/swagger.yaml"}
	docsHandler := middleware.Redoc(opts, nil)
	router.Handle("/docs", docsHandler)

	log.Printf("Listening on port %s...", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
	
	
}
func getPortFromArgsOrEnv() string {
	if len(os.Args) > 1 {
		return os.Args[1]
	}
	var port string
	fmt.Print("Enter the port to listen on (e.g., 5000): ")
	fmt.Scan(&port)
	if port != "" {
		return port
	}
	return "5600"
}
