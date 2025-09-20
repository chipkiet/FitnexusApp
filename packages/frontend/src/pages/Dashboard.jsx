import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {

  const navigate = useNavigate();

  const goToRegister = () => {
    navigate('/register');
  }

  return (
    <div>
      <div>
        <button onClick={goToRegister}
          className="px-6 py-3 text-white transition-colors duration-200 rounded-lg bg-sky-500 hover:bg-sky-600"
          >
          Register
        </button>
      </div>
      <div className="flex items-center justify-center min-h-screen bg-pink-100">
        <h1 className="text-3xl text-green-400 text-pretty">Khung sườn vĩ đại</h1>
      </div>
      
    </div>
  );
}

