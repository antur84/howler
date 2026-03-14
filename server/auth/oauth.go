package auth

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/howler/server/config"
)

const authCookieName = "auth_token"

// GoogleTokenInfo represents the response from Google's tokeninfo endpoint.
type GoogleTokenInfo struct {
	Email         string `json:"email"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	EmailVerified string `json:"email_verified"`
	Aud           string `json:"aud"`
}

// Handler holds dependencies for auth HTTP handlers.
type Handler struct {
	cfg *config.Config
}

func NewHandler(cfg *config.Config) *Handler {
	return &Handler{cfg: cfg}
}

// HandleGoogleVerify accepts a Google credential (ID token) from the frontend,
// verifies it with Google, creates a session JWT, and sets it as an HTTP-only cookie.
func (h *Handler) HandleGoogleVerify(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Credential string `json:"credential"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Credential == "" {
		http.Error(w, `{"error":"missing credential"}`, http.StatusBadRequest)
		return
	}

	// Verify the Google ID token with Google's tokeninfo endpoint.
	tokenInfo, err := verifyGoogleIDToken(body.Credential)
	if err != nil {
		http.Error(w, `{"error":"invalid google token"}`, http.StatusUnauthorized)
		return
	}

	// Ensure the token was issued for our client ID.
	if tokenInfo.Aud != h.cfg.GoogleClientID {
		http.Error(w, `{"error":"token audience mismatch"}`, http.StatusUnauthorized)
		return
	}

	if tokenInfo.EmailVerified != "true" {
		http.Error(w, `{"error":"email not verified with Google"}`, http.StatusForbidden)
		return
	}

	// Create a JWT for our application.
	jwtToken, err := CreateToken(h.cfg.JWTSecret, tokenInfo.Email, tokenInfo.Name, tokenInfo.Picture)
	if err != nil {
		http.Error(w, `{"error":"failed to create session"}`, http.StatusInternalServerError)
		return
	}

	// Set the JWT as an HTTP-only cookie.
	http.SetCookie(w, &http.Cookie{
		Name:     authCookieName,
		Value:    jwtToken,
		Path:     "/",
		MaxAge:   int(TokenDuration.Seconds()),
		HttpOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: http.SameSiteLaxMode,
		Domain:   h.cfg.CookieDomain,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"email":   tokenInfo.Email,
		"name":    tokenInfo.Name,
		"picture": tokenInfo.Picture,
	})
}

// HandleLogout clears the auth cookie.
func (h *Handler) HandleLogout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     authCookieName,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: http.SameSiteLaxMode,
		Domain:   h.cfg.CookieDomain,
	})
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, `{"message":"logged out"}`)
}

// HandleMe returns the current user's info from the JWT.
func (h *Handler) HandleMe(w http.ResponseWriter, r *http.Request) {
	claims, ok := ClaimsFromContext(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"email":   claims.Email,
		"name":    claims.Name,
		"picture": claims.Picture,
	})
}

// verifyGoogleIDToken verifies a Google ID token using Google's tokeninfo endpoint.
func verifyGoogleIDToken(idToken string) (*GoogleTokenInfo, error) {
	resp, err := http.Get("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken)
	if err != nil {
		return nil, fmt.Errorf("failed to call Google tokeninfo API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("Google tokeninfo API returned %d: %s", resp.StatusCode, body)
	}

	var info GoogleTokenInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, fmt.Errorf("failed to decode tokeninfo response: %w", err)
	}
	return &info, nil
}

// AuthCookieName returns the cookie name used for auth tokens (for use in middleware).
func AuthCookieName() string {
	return authCookieName
}
