package config

import (
	"crypto/rand"
	"encoding/hex"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	GoogleClientID string
	JWTSecret      []byte
	FrontendURL    string
	CookieDomain   string
	CookieSecure   bool
	AllowedOrigins []string
}

func Load() *Config {
	// Load .env file if present (ignored in production)
	_ = godotenv.Load()

	port := getEnv("PORT", "8080")
	frontendURL := getEnv("FRONTEND_URL", "http://localhost:5173")
	cookieDomain := getEnv("COOKIE_DOMAIN", "localhost")
	cookieSecure := getEnv("COOKIE_SECURE", "false") == "true"

	clientID := mustGetEnv("GOOGLE_CLIENT_ID")

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Println("WARNING: JWT_SECRET not set, generating a random one (sessions won't survive restarts)")
		b := make([]byte, 32)
		if _, err := rand.Read(b); err != nil {
			log.Fatal("failed to generate JWT secret: ", err)
		}
		jwtSecret = hex.EncodeToString(b)
	}

	return &Config{
		Port:           port,
		FrontendURL:    frontendURL,
		CookieDomain:   cookieDomain,
		CookieSecure:   cookieSecure,
		GoogleClientID: clientID,
		JWTSecret:      []byte(jwtSecret),
		AllowedOrigins: []string{frontendURL},
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func mustGetEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("required environment variable %s is not set", key)
	}
	return v
}
