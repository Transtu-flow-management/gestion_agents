package configs

import (
	"context"
	"fmt"
	"log"
	"net/url"

	"github.com/redis/go-redis/v9"
)


var redisClient *redis.Client

func ConnectDB() {
	
	
	redisURL := EnvRedisURI()
	parsedURL, err := url.Parse(redisURL)
    if err != nil {
        log.Fatalf("Failed to parse Redis URI: %v", err)
    }

    redisHost := parsedURL.Hostname()
    redisPort := parsedURL.Port()
    options := &redis.Options{
        Addr:     redisHost + ":" + redisPort,
        Password: "",
        DB:       0, 
    }
    redisClient = redis.NewClient(options)

    // Test the connection
    ctx := context.Background()
    pong, err := redisClient.Ping(ctx).Result()
    if err != nil {
        log.Fatal("Error connecting to Redis:", err)
    }
    fmt.Println("Connected to Redis:", pong)
}

// GetRedisClient returns the Redis client instance.
func GetRedisClient() *redis.Client {
    return redisClient
}