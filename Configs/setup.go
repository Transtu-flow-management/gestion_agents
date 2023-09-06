package configs

import (
	"context"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
)


var redisClient *redis.Client

func ConnectDB() {
	
	redisURL := EnvRedisURI()
    options := &redis.Options{
        Addr:     redisURL,
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