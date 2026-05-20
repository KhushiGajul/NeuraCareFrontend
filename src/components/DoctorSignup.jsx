import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight, Stethoscope, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
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
      
      const response = await axios.post('http://localhost:5000/api/doctors/signup', payload);
      console.log('Doctor Signup Success:', response.data);
      alert('Clinical account created successfully!');
      navigate('/doctor-login');
      
    } catch (error) {
      console.error('Doctor Signup Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'An error occurred during clinical signup');
    }
  };

  return (
    <div className="flex flex-1 w-full items-center justify-center bg-[#f4f7fb] p-2 relative overflow-hidden min-h-[calc(100vh-80px)]">
      {/* Decorative background elements to simulate the clinical environment blur */}
      <div className="absolute inset-0 w-full h-full opacity-40">
         <div className="absolute right-1/4 top-0 w-1/3 h-full bg-blue-100/50 skew-x-12 transform blur-3xl"></div>
         <div className="absolute left-1/4 top-0 w-1/4 h-full bg-slate-200/50 -skew-x-12 transform blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-[420px] bg-white p-8 rounded-xl shadow-sm border border-gray-100 z-10">
        
        {/* Doctor Icon Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-50">
            <Stethoscope className="w-8 h-8" />
          </div>
        </div>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Clinical Workspace
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Clinical Account</h1>
          <p className="text-gray-500 text-sm">Join the professional health network</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-800 text-left">
              Professional Name
            </label>
            <input
              type="text"
              placeholder="Dr. John Doe"
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
              <p className="text-xs text-red-500 text-left">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-800 text-left">
              Clinical Email Address
            </label>
            <input
              type="email"
              placeholder="doctor@clinic.com"
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
              <p className="text-xs text-red-500 text-left">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-gray-800 text-left">
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
              <p className="text-xs text-red-500 text-left">{errors.password.message}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start pt-1">
            <div className="flex h-5 items-center">
              <input
                id="terms"
                type="checkbox"
                {...register('terms', {
                  required: 'You must agree to the professional terms',
                })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
              />
            </div>
            <div className="ml-2 text-sm text-left">
              <label htmlFor="terms" className="text-gray-600 font-medium">
                I agree to the{' '}
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
                  Professional Terms
                </a>{' '}
                and{' '}
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
                .
              </label>
              {errors.terms && (
                <p className="text-xs text-red-500 mt-1 text-left">{errors.terms.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0057b7] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Create Clinical Account
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className='text-sm text-gray-600'>Already registered? <Link to="/doctor-login" className="text-blue-600 hover:text-blue-700 font-medium">Doctor Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorSignup;