import { LoginButton } from './features/auth';
import { HowlFeed } from './features/howls';

function App() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Howler</h1>
        <LoginButton />
      </header>
      <HowlFeed />
    </div>
  );
}

export default App;
