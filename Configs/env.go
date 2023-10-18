package configs

import (
	"fmt"
)
var dbname string
func EnvRedisURI() string {
	var input string
	fmt.Print("Enter the Redis URL (Exemple, redis://localhost:6379): ")
	fmt.Scan(&input)

	if input != "" {
		return input
	}
	// default URL
	return "redis://localhost:6379"
}
func EnvMongoURI() string {
	var input string
	/*err := godotenv.Load()
	if err != nil {
		log.Fatal("Error finding for mongo .env file")
	}*/

	fmt.Print("Enter the MongoDB URL (Exemple, mongodb://localhost:27030/): ")
	fmt.Scan(&input)

	fmt.Print("Enter the database name: ")
    fmt.Scan(&dbname)

	if input != "" {
		return input + dbname
	}
	if dbname !="" {
		return dbname
	}
	return input +"/"+ dbname
}
func GetDbname() string{
	return dbname
}
