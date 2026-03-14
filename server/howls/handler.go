package howls

import (
	"encoding/json"
	"net/http"

	"github.com/howler/server/auth"
	"github.com/howler/server/supabase"
)

// HowlRow represents a row in the howls table.
type HowlRow struct {
	ID          string `json:"id"`
	Content     string `json:"content"`
	AuthorEmail string `json:"author_email"`
	AuthorName  string `json:"author_name"`
	CreatedAt   string `json:"created_at"`
	Likes       int    `json:"likes"`
}

// HowlResponse is the shape returned to the frontend.
type HowlResponse struct {
	ID        string             `json:"id"`
	Author    HowlAuthorResponse `json:"author"`
	Content   string             `json:"content"`
	CreatedAt string             `json:"createdAt"`
	Likes     int                `json:"likes"`
}

type HowlAuthorResponse struct {
	DisplayName string `json:"displayName"`
	Username    string `json:"username"`
}

// Handler holds dependencies for howl HTTP handlers.
type Handler struct {
	db *supabase.Client
}

func NewHandler(db *supabase.Client) *Handler {
	return &Handler{db: db}
}

// HandleGetFeed returns the most recent howls.
func (h *Handler) HandleGetFeed(w http.ResponseWriter, r *http.Request) {
	body, status, err := h.db.Do(
		"GET",
		"/howls?select=*&order=created_at.desc&limit=50",
		nil,
		nil,
	)
	if err != nil {
		http.Error(w, `{"error":"failed to fetch howls"}`, http.StatusInternalServerError)
		return
	}
	if status != http.StatusOK {
		http.Error(w, `{"error":"failed to fetch howls"}`, http.StatusInternalServerError)
		return
	}

	var rows []HowlRow
	if err := json.Unmarshal(body, &rows); err != nil {
		http.Error(w, `{"error":"failed to parse howls"}`, http.StatusInternalServerError)
		return
	}

	// Transform DB rows into the frontend-expected shape.
	result := make([]HowlResponse, len(rows))
	for i, row := range rows {
		username := row.AuthorEmail
		if at := indexOf(username, '@'); at > 0 {
			username = username[:at]
		}
		result[i] = HowlResponse{
			ID:        row.ID,
			Content:   row.Content,
			CreatedAt: row.CreatedAt,
			Likes:     row.Likes,
			Author: HowlAuthorResponse{
				DisplayName: row.AuthorName,
				Username:    username,
			},
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func indexOf(s string, b byte) int {
	for i := range s {
		if s[i] == b {
			return i
		}
	}
	return -1
}

// HandleCreateHowl creates a new howl for the authenticated user.
func (h *Handler) HandleCreateHowl(w http.ResponseWriter, r *http.Request) {
	claims, ok := auth.ClaimsFromContext(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var body struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Content == "" {
		http.Error(w, `{"error":"missing content"}`, http.StatusBadRequest)
		return
	}
	if len([]rune(body.Content)) > 280 {
		http.Error(w, `{"error":"content too long"}`, http.StatusBadRequest)
		return
	}

	insert := map[string]string{
		"content":      body.Content,
		"author_email": claims.Email,
		"author_name":  claims.Name,
	}
	payload, _ := json.Marshal(insert)

	respBody, status, err := h.db.Do(
		"POST",
		"/howls",
		payload,
		map[string]string{"Prefer": "return=representation"},
	)
	if err != nil || status != http.StatusCreated {
		http.Error(w, `{"error":"failed to create howl"}`, http.StatusInternalServerError)
		return
	}

	var rows []HowlRow
	if err := json.Unmarshal(respBody, &rows); err != nil || len(rows) == 0 {
		http.Error(w, `{"error":"failed to parse created howl"}`, http.StatusInternalServerError)
		return
	}

	row := rows[0]
	username := row.AuthorEmail
	if at := indexOf(username, '@'); at > 0 {
		username = username[:at]
	}

	result := HowlResponse{
		ID:        row.ID,
		Content:   row.Content,
		CreatedAt: row.CreatedAt,
		Likes:     row.Likes,
		Author: HowlAuthorResponse{
			DisplayName: row.AuthorName,
			Username:    username,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(result)
}
