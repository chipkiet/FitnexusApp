import React, { useState } from 'react';
import { useAuth } from '../context/auth.context.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import TextInput from '../components/form/TextInput.jsx';
import PasswordInput from '../components/form/PasswordInput.jsx';
import Checkbox from '../components/form/Checkbox.jsx';
import DividerWithText from '../components/common/DividerWithText.jsx';
import SocialAuthButtons from '../components/auth/SocialAuthButtons.jsx';
import Alert from '../components/common/Alert.jsx';
import logo from '../assets/branch/logo.png';

export default function Register() {
  const { register, loading, error } = useAuth();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    agree: false,
  });
  const [success, setSuccess] = useState(null);
  const [localError, setLocalError] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setLocalError(null);
    if (!form.agree) {
      setLocalError('Bạn cần đồng ý với Điều khoản và Chính sách riêng tư.');
      return;
    }
    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        fullName: form.fullName || undefined,
        phone: form.phone || undefined,
      };

      const res = await register(payload);
      setSuccess(res?.message || 'Registered successfully');
    } catch (_) {
      // error handled via context
    }
  };

  return (
    <AuthLayout ratio='1/3'>
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sign up</h1>
            <p className="mt-2 text-sm text-gray-500">Let's get you all set up so you can access your personal account.</p>
          </div>
          <div className="flex items-center gap-2 text-gray-900">
            {/* <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7L12 2z"/></svg> */}
            <div>
                <img src={logo} alt="FITNEXUS" className="object-contain w-36 h-36 rounded-xl" />
            </div>
            <span className="text-lg font-semibold">FITNEXUS</span>
          </div>
        </div>
      </div>

      {success && <Alert type="success">{success}</Alert>}
      {localError && <div className="mt-3"><Alert type="error">{localError}</Alert></div>}
      {error && <div className="mt-3"><Alert type="error">{error.message || 'Registration failed'}</Alert></div>}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <TextInput label="Username" name="username" value={form.username} onChange={onChange} placeholder="johnny" required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput label="Full Name" name="fullName" value={form.fullName} onChange={onChange} placeholder="John Doe" />
          <TextInput label="Phone Number" name="phone" value={form.phone} onChange={onChange} placeholder="0123 456 789" />
          <div className="sm:col-span-2">
            <TextInput label="Email" type="email" name="email" value={form.email} onChange={onChange} placeholder="john.doe@gmail.com" required />
          </div>
        </div>

        <PasswordInput label="Password" name="password" value={form.password} onChange={onChange} placeholder="••••••••••" required />
        <PasswordInput label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} placeholder="••••••••••" required />

        <div className="flex items-center justify-between">
          <Checkbox
            name="agree"
            checked={form.agree}
            onChange={(v) => setForm({ ...form, agree: v })}
            label={<span>Tôi đồng ý với tất cả <a className="text-blue-600 hover:underline" href="#" onClick={(e)=>e.preventDefault()}>Terms</a> and <a className="text-blue-600 hover:underline" href="#" onClick={(e)=>e.preventDefault()}>Privacy Policies</a></span>}
          />
        </div>

        <button disabled={loading} className="w-full py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60">
          {loading ? 'Creating...' : 'Create account'}
        </button>

        <p className="text-sm text-center text-gray-500">Already have an account? <a href="/login" className="font-medium text-blue-600 hover:underline">Login</a></p>

        <DividerWithText>Or Sign up with</DividerWithText>

        <SocialAuthButtons onFacebook={()=>{}} onGoogle={()=>{}} onApple={()=>{}} />
      </form>
    </AuthLayout>
  );
}
