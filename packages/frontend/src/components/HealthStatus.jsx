import React, { useEffect, useState } from 'react';
import { api, endpoints } from '../lib/api.js';

export default function HealthStatus() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    api
      .get(endpoints.health)
      .then((res) => {
        setMessage(res?.data?.message || 'OK');
      })
      .catch((err) => {
        setMessage('Error connecting to backend: ' + (err?.message || 'Unknown error'));
      });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-pink-300">
      <h1 className="text-3xl font-bold text-sky-400">{message}</h1>
      <h1 className='font-mono text-3xl text-pretty text-slate-300'>Anh chip dep zai so 1 Viet Nam</h1>
    </div>
  );
}

