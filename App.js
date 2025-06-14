
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io();

function App() {
  const [playerName, setPlayerName] = useState('');
  const [team, setTeam] = useState('redTeam');
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState({});
  const [board, setBoard] = useState([]);
  const [clue, setClue] = useState('');
  const [clueLog, setClueLog] = useState([]);

  useEffect(() => {
    socket.on('updatePlayers', setPlayers);
    socket.on('gameStarted', setBoard);
    socket.on('newClue', (newClue) => setClueLog((prev) => [...prev, newClue]));
    socket.on('imageSelected', handleImageSelection);
  }, []);

  const joinGame = () => {
    socket.emit('joinGame', { playerName, team });
    setJoined(true);
  };

  const startGame = () => {
    socket.emit('startGame');
  };

  const sendClue = () => {
    socket.emit('sendClue', clue);
    setClue('');
  };

  const selectImage = (index) => {
    socket.emit('selectImage', index);
  };

  const handleImageSelection = (index) => {
    alert(`Image ${index} selected!`);
  };

  if (!joined) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-4 text-indigo-600">Image Codenames</h1>
        <input
          className="border p-2 rounded mb-2 w-60"
          placeholder="Player Name"
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <select className="border p-2 rounded mb-4 w-60" onChange={(e) => setTeam(e.target.value)}>
          <option value="redTeam">Red Team</option>
          <option value="blueTeam">Blue Team</option>
        </select>
        <button
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          onClick={joinGame}
        >
          Join Game
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Welcome, {playerName} ({team})</h2>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          onClick={startGame}
        >
          Start Game
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {board.map((img, idx) => (
          <div
            key={idx}
            onClick={() => selectImage(idx)}
            className="border border-gray-300 rounded overflow-hidden cursor-pointer hover:scale-105 transition"
          >
            <img src={`./images/${img}`} alt={img} className="w-full h-auto" />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <input
          className="border p-2 rounded w-60 mr-2"
          value={clue}
          onChange={(e) => setClue(e.target.value)}
          placeholder="Enter clue..."
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={sendClue}
        >
          Send Clue
        </button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Clue Log:</h3>
        <div className="bg-gray-100 p-2 rounded">
          {clueLog.map((c, i) => <p key={i}>{c}</p>)}
        </div>
      </div>
    </div>
  );
}

export default App;
