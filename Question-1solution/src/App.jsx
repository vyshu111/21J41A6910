import React, { useReducer, useState, useEffect } from 'react';
import './App.css';

const WINDOW_SIZE = 10;

const URLS = {
  p: 'http://20.244.56.144/test/primes',
  f: 'http://20.244.56.144/test/fibo',
  e: 'http://20.244.56.144/test/even',
  r: 'http://20.244.56.144/test/rand',
};

// Helper functions
const updateWindow = (window, newNumbers) => {
  const uniqueNumbers = [...new Set([...window, ...newNumbers])].slice(-WINDOW_SIZE);
  return uniqueNumbers;
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  return (numbers.reduce((acc, n) => acc + n, 0) / numbers.length).toFixed(2);
};
const initialState = {
  windowPrevState: [],
  windowCurrState: [],
  numbers: [],
  avg: 0,
  loading: false,
  error: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      const updatedWindow = updateWindow(state.windowCurrState, action.payload.numbers);
      return {
        ...state,
        windowPrevState: [...state.windowCurrState],
        windowCurrState: updatedWindow,
        numbers: action.payload.numbers,
        avg: calculateAverage(updatedWindow),
        loading: false,
      };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedType, setSelectedType] = useState('p');
  const fetchNumbers = async (type) => {
    if (!URLS[type]) {
      console.error('Invalid number type specified');
      return;
    }

    dispatch({ type: 'FETCH_START' });

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 500);
      const response = await fetch(URLS[type], { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: { numbers: data.numbers } });
      } else {
        throw new Error('API request failed with status ' + response.status);
      }
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message || 'Error fetching numbers' });
    }
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    fetchNumbers(type);
  };

  return (
    <div className="App">
      <h1>Average Calculator Microservice</h1>
      <div>
        <button onClick={() => handleTypeChange('p')}>Prime Numbers</button>
        <button onClick={() => handleTypeChange('f')}>Fibonacci Numbers</button>
        <button onClick={() => handleTypeChange('e')}>Even Numbers</button>
        <button onClick={() => handleTypeChange('r')}>Random Numbers</button>
      </div>

      {state.loading && <p>Loading...</p>}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}

      <div>
        <h3>Previous Window State:</h3>
        <pre>{JSON.stringify(state.windowPrevState, null, 2)}</pre>

        <h3>Current Window State:</h3>
        <pre>{JSON.stringify(state.windowCurrState, null, 2)}</pre>

        <h3>Numbers Fetched:</h3>
        <pre>{JSON.stringify(state.numbers, null, 2)}</pre>

        <h3>Average:</h3>
        <p>{state.avg}</p>
      </div>
    </div>
  );
}

export default App;

