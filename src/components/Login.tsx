import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PIN = '1234'; // In a real app, this would be securely stored

function Login() {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
      
      if (index === 3 && value) {
        validatePin(newPin.join(''));
      }
    }
  };

  const validatePin = (enteredPin: string) => {
    if (enteredPin === PIN) {
      login();
      navigate('/dashboard');
    } else {
      setError('Incorrect PIN');
      setPin(['', '', '', '']);
      setTimeout(() => setError(''), 2000);
      document.getElementById('pin-0')?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter PIN to continue
          </h2>
        </div>
        <div className="mt-8">
          <div className="flex justify-center space-x-2">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                className={`w-12 h-12 text-center text-xl border-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            ))}
          </div>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;