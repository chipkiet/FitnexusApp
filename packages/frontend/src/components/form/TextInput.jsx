import React from 'react';

export default function TextInput({ label, name, value, onChange, type = 'text', placeholder, required = false }) {
  return (
    <label className="block text-sm">
      {label && <span className="block mb-1 font-medium text-gray-700">{label}</span>}
      <input
        className="w-full px-3 py-2 transition-colors bg-white border rounded outline-none border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete="on"
      />
    </label>
  );
}

