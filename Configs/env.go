package configs

import (
    "log"
    "os"
    "github.com/joho/godotenv"
)

func EnvRedisURI() string {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }
    return os.Getenv("REDIS_URL")
}
func EnvMongoURI() string {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }
    return os.Getenv("MONGO_URL")
}

//acces token : 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