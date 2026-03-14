package auth

import "context"

type contextKey string

const claimsKey contextKey = "user_claims"

// ContextWithClaims adds UserClaims to the context.
func ContextWithClaims(ctx context.Context, claims *UserClaims) context.Context {
	return context.WithValue(ctx, claimsKey, claims)
}

// ClaimsFromContext retrieves UserClaims from the context.
func ClaimsFromContext(ctx context.Context) (*UserClaims, bool) {
	claims, ok := ctx.Value(claimsKey).(*UserClaims)
	return claims, ok
}
