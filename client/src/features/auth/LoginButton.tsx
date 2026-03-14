import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from './useAuth';

export function LoginButton() {
  const { user, loading, handleGoogleSuccess, logout } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
        <span className="text-sm font-medium text-text-h">{user.name}</span>
        <button
          onClick={logout}
          className="rounded border border-border px-3 py-1 text-sm text-text hover:border-accent-border hover:text-accent transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <GoogleLogin
      onSuccess={(response) => {
        if (response.credential) {
          handleGoogleSuccess(response.credential);
        }
      }}
      onError={() => console.error('Google login failed')}
    />
  );
}
