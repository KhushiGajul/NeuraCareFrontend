import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = async(data) => {
    try {
      // Map fullName to name to match the backend expectations
      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password
      };
      
      const response = await axios.post('http://localhost:5000/api/users/signup', payload);
      console.log('Signup Success:', response.data);
      alert('Signup successful!');
      
    } catch (error) {
      console.error('Signup Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'An error occurred during signup');
    }
  };

  return (
    <div className="flex flex-1 w-full items-center justify-center bg-white p-2">
      <div className="w-full max-w-[400px]">
        <div className="mb-6">
            <h1 className="text-5xl font-bold text-center text-blue-600">NeuraCare</h1>
        </div>
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600 text-sm">Start your clinical-grade health experience today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-800">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register('fullName', {
                required: 'Full name is required',
                pattern: {
                  value: /^[A-Z]/,
                  message: 'Full name must start with a capital letter',
                },
              })}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                errors.fullName ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-800">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-gray-800">
                Password
              </label>
              <span className="text-xs font-semibold text-gray-500">
                Min. 6 characters
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                    message:
                      'Must start with capital letter, include a number, special character, and be at least 6 characters',
                  },
                })}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start pt-1">
            <div className="flex h-5 items-center">
              <input
                id="terms"
                type="checkbox"
                {...register('terms', {
                  required: 'You must agree to the terms',
                })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="terms" className="text-gray-600 font-medium">
                I agree to the{' '}
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
                .
              </label>
              {errors.terms && (
                <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0057b7] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Create Account
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className='text-center text-sm text-gray-600'>Already have account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;