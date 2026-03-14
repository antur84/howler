import { LoginButton, useAuth } from './features/auth';
import { HowlFeed } from './features/howls';

function App() {
  const { user } = useAuth();

  return (
    <div style={{ width: 'min(600px, 100%)' }} className="mx-auto p-4">
      <header className="mb-6 flex items-center justify-between">
        <a href="/">
          <h1 className="text-2xl font-bold text-nowrap">Howler 🐺</h1>
        </a>
        <LoginButton />
      </header>
      <HowlFeed user={user} />
    </div>
  );
}

export default App;
