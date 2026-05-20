import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const resetForgotState = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotEmail('');
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotError('');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
        setForgotError('Please enter your email.');
        return;
    }
    setForgotError('');
    setForgotLoading(true);
    try {
        await axios.post('https://neuracarebackend.onrender.com/api/email/send-otp', { email: forgotEmail, role: 'user' });
        setForgotStep(2);
    } catch (error) {
        setForgotError(error.response?.data?.error || 'Failed to send OTP.');
    } finally {
        setForgotLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!forgotOtp) {
        setForgotError('Please enter the OTP.');
        return;
    }
    setForgotError('');
    setForgotLoading(true);
    try {
        await axios.post('https://neuracarebackend.onrender.com/api/email/verify-otp', { email: forgotEmail, otp: forgotOtp });
        setForgotStep(3);
    } catch (error) {
        setForgotError(error.response?.data?.error || 'Invalid OTP.');
    } finally {
        setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotNewPassword) {
        setForgotError('Please enter a new password.');
        return;
    }
    // simple validation
    const regex = /^(?=[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!regex.test(forgotNewPassword)) {
        setForgotError('Must start with capital letter, include a number, special character, and be at least 6 characters.');
        return;
    }

    setForgotError('');
    setForgotLoading(true);
    try {
        await axios.post('https://neuracarebackend.onrender.com/api/email/reset-password', { 
            email: forgotEmail, 
            otp: forgotOtp, 
            newPassword: forgotNewPassword, 
            role: 'user' 
        });
        alert('Password reset successfully! You can now log in.');
        resetForgotState();
    } catch (error) {
        setForgotError(error.response?.data?.error || 'Failed to reset password.');
    } finally {
        setForgotLoading(false);
    }
  };

  const onSubmit = async(data) => {
    try {
      const response = await axios.post('https://neuracarebackend.onrender.com/api/users/login', data);
      const user = response.data.user;
      
      // Save session info
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', user.role);
      
      // Redirect based on role
      if (user.role === 'doctor' || user.role === 'admin') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'An error occurred during login');
    }
  };

  return (
    <div className="flex flex-1 w-full items-center justify-center bg-[#f4f7fb] p-2 relative overflow-hidden">
      {/* Decorative background elements to simulate the office/clinical environment blur in the image */}
      <div className="absolute inset-0 w-full h-full opacity-40">
         <div className="absolute right-1/4 top-0 w-1/3 h-full bg-blue-100/50 skew-x-12 transform blur-3xl"></div>
         <div className="absolute left-1/4 top-0 w-1/4 h-full bg-slate-200/50 -skew-x-12 transform blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-[420px] bg-white p-8 rounded-xl shadow-sm border border-gray-100 z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Access your personalized health insights</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-800 text-left">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
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
                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 text-left">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-gray-800">
                Password
              </label>
              <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                    message:
                      'Must start with capital letter, include a number, special character, and be at least 6 characters',
                  },
                })}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 text-left">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0057b7] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Sign In
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        
        <p className='text-center text-sm text-gray-600 mt-6'>Don't have account? <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">Signup</Link></p>
        
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-gray-500">
            Are you a medical professional? <Link to="/doctor-login" className="text-blue-600 hover:text-blue-700 font-semibold">Doctor Portal</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 relative">
              <button 
                onClick={resetForgotState}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Reset Password</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {forgotStep === 1 && "Enter your email to receive an OTP."}
                  {forgotStep === 2 && "Enter the OTP sent to your email."}
                  {forgotStep === 3 && "Create a new secure password."}
                </p>
              </div>

              {forgotError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                  {forgotError}
                </div>
              )}

              {forgotStep === 1 && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-gray-800 text-left">Email Address</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full rounded-full bg-[#0057b7] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-70"
                  >
                    {forgotLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-gray-800 text-left">Enter OTP</label>
                    <input
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="e.g. 1234"
                      className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600 tracking-widest text-center"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full rounded-full bg-[#0057b7] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-70"
                  >
                    {forgotLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
              )}

              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-gray-800 text-left">New Password</label>
                    <input
                      type="password"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">Must start with capital letter, include a number, special character, and be at least 6 characters.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-70"
                  >
                    {forgotLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;