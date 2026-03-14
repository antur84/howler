package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/howler/server/auth"
	"github.com/howler/server/config"
	"github.com/howler/server/howls"
	"github.com/howler/server/middleware"
	"github.com/howler/server/supabase"
)

func main() {
	cfg := config.Load()

	mux := http.NewServeMux()
	authHandler := auth.NewHandler(cfg)
	db := supabase.NewClient(cfg.SupabaseURL, cfg.SupabaseKey)
	howlsHandler := howls.NewHandler(db)

	// --- Public routes ---
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"status":"ok"}`)
	})

	mux.HandleFunc("GET /howls", howlsHandler.HandleGetFeed)

	// --- Auth routes (public) ---
	mux.HandleFunc("POST /auth/google/verify", authHandler.HandleGoogleVerify)
	mux.HandleFunc("POST /auth/logout", authHandler.HandleLogout)

	// --- Protected routes ---
	protected := http.NewServeMux()
	protected.HandleFunc("GET /auth/me", authHandler.HandleMe)
	protected.HandleFunc("POST /howls", howlsHandler.HandleCreateHowl)

	// Wrap protected routes with auth middleware.
	mux.Handle("/auth/me", middleware.RequireAuth(cfg.JWTSecret)(protected))
	mux.Handle("POST /howls", middleware.RequireAuth(cfg.JWTSecret)(protected))

	// Apply CORS to all routes.
	handler := middleware.CORS(cfg.AllowedOrigins)(mux)

	addr := ":" + cfg.Port
	log.Printf("Server starting on %s", addr)
	log.Printf("Frontend URL: %s", cfg.FrontendURL)

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal("server failed: ", err)
	}
}
