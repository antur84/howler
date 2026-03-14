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
        <span className="text-sm font-medium">{user.name}</span>
        <button onClick={logout} className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300">
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
