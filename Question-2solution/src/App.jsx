import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <header className="app-header">
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" aria-label="Learn more about Vite">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer" aria-label="Learn more about React">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </header>
      <main>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount(count + 1)} className="count-button">
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test Hot Module Replacement (HMR)
          </p>
        </div>
      </main>
      <footer>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </footer>
    </div>
  );
}

export default App;

