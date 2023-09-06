package main

import (
    "log"
    "e/configs"
    "net/http"
    "e/routes"
    "github.com/gorilla/mux"
    "github.com/go-openapi/runtime/middleware"
)



func main() {

 //db connect  
configs.ConnectDB()

    router := mux.NewRouter()
    router.Use(func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Access-Control-Allow-Origin", "*")
            w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
            if r.Method == http.MethodOptions {
                w.WriteHeader(http.StatusNoContent)
                return
            }
            next.ServeHTTP(w, r)
        })
    })

    routes.CarRoute(router)

    router.PathPrefix("/swagger.yaml").Handler(http.FileServer(http.Dir("./")))

    // Serve Swagger UI at /docs
    opts := middleware.RedocOpts{SpecURL: "/swagger.yaml"}
    docsHandler := middleware.Redoc(opts, nil)
    router.Handle("/docs", docsHandler)

    log.Fatal(http.ListenAndServe(":5500", router))
}
