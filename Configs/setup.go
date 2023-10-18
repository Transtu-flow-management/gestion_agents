package configs

import (
	"context"
	"fmt"
	"log"
	"net/url"

	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)


var redisClient *redis.Client
var mongoClient *mongo.Client
func ConnectDB() {
    // Connect to MongoDB
    mongoURL := EnvMongoURI()
    log.Printf("Listening on mongo : %s", mongoURL)
    clientOptions := options.Client().ApplyURI(mongoURL)
    client, err := mongo.Connect(context.Background(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }
    ctx := context.Background()
    err = client.Ping(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }
    //defer client.Disconnect(ctx)

    err = client.Ping(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Connected to MongoDB")
    mongoClient = client

 //connect to redis
    redisURL := EnvRedisURI()
    log.Printf("Listening on Redis : %s...", redisURL)
    parsedURL, err := url.Parse(redisURL)
   redisHost := parsedURL.Hostname()
    redisPort := parsedURL.Port()

    options := &redis.Options{
        Addr:     redisHost + ":" + redisPort,
        Password: "",
        DB:       0,
    }
    redisClient = redis.NewClient(options)
    // Test connection vers Redis
    pong, err := redisClient.Ping(ctx).Result()
    if err != nil {
        log.Fatal("Error connecting to Redis:", err)
    }
    fmt.Println("Connected to Redis:", pong)
}

func GetRedisClient() *redis.Client {
    return redisClient
}
func GetMongoClient() *mongo.Client {
    return mongoClient
}