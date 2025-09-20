import React, { useState } from 'react';
import { useAuth } from '../context/auth.context.jsx';

export default function Register() {
  const { register, loading, error } = useAuth(); // lien ket toi auth.context.js
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [success, setSuccess] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  /* form object lúc này có dạng 
    value={form.username} ,
    value={form.email}, 
    value={form.password}, 
    value={form.confirmPassword}, 
    value={form.fullname} 
  
    Các dữ liệu được nhập trong return. 
  */

  const onSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    try {

      // Gửi form object cho context
      const res = await register(form);

      setSuccess(res?.message || 'Registered successfully');
    } catch (_) {
      // error handled via context
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-900">
      <div className="w-full max-w-md p-6 text-white border rounded-lg bg-white/5 backdrop-blur border-white/10">
        <h1 className="mb-4 text-xl font-semibold">Create your account</h1>
        {success && <p className="mb-3 text-green-400">{success}</p>}
        {error && <p className="mb-3 text-red-400">{error.message || 'Registration failed'}</p>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full p-2 border rounded bg-slate-800 border-slate-700" name="username" placeholder="Username" value={form.username} onChange={onChange} required />
          <input className="w-full p-2 border rounded bg-slate-800 border-slate-700" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input className="w-full p-2 border rounded bg-slate-800 border-slate-700" name="fullName" placeholder="Full name (optional)" value={form.fullName} onChange={onChange} />
          <input className="w-full p-2 border rounded bg-slate-800 border-slate-700" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
          <input className="w-full p-2 border rounded bg-slate-800 border-slate-700" name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={onChange} required />
          <button disabled={loading} className="w-full py-2 rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-60">{loading ? 'Creating...' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
}

