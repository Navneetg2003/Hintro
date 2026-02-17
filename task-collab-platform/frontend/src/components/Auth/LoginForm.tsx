import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { login, clearError } from '../../store/slices/authSlice';
import { Button, Input } from '../Common';
import { Mail, Lock, Layers, ArrowRight, Sparkles, Eye, EyeOff, CheckCircle2, Zap, Users, BarChart3, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Animation on mount
  useEffect(() => {
    setMounted(true);
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(login({ email, password })).unwrap();
      toast.success('Welcome back!', {
        icon: '👋',
        duration: 3000,
      });
      navigate('/');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Login failed');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@taskcollab.com');
    setPassword('Demo123!');
    toast.success('Demo credentials filled!', {
      icon: '✨',
      duration: 2000,
    });
  };

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Boost productivity with instant task updates' },
    { icon: Users, title: 'Team Collaboration', description: 'Work together seamlessly in real-time' },
    { icon: BarChart3, title: 'Analytics', description: 'Track progress with powerful insights' },
    { icon: Shield, title: 'Secure', description: 'Enterprise-grade security for your data' },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 6s ease infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        /* Glow effect */
        .glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .glow-hover:hover {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.7);
        }
      `}</style>

      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary-300/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
          
          {/* Spinning gradient circles */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-primary-400/30 to-transparent rounded-full animate-spin-slow" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-l from-primary-300/30 to-transparent rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        </div>

        {/* Main Container - Horizontal Layout */}
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 h-full flex items-center py-4 sm:py-6 lg:py-8">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[52%_48%] gap-6 lg:gap-12 xl:gap-16 items-center max-h-[95vh]">
            
            {/* Left Side - Branding & Features */}
            <div className={`text-white space-y-6 lg:space-y-8 hidden lg:block ${mounted ? 'animate-fade-in-left' : 'opacity-0'}`}>
              {/* Logo */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 lg:p-3.5 rounded-2xl shadow-2xl glow-hover transform transition-all hover:scale-110 hover:rotate-6">
                    <Layers className="w-7 h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">TaskCollab</h1>
                    <p className="text-primary-100 text-sm lg:text-base xl:text-lg mt-0.5 lg:mt-1">Collaborate smarter, achieve faster</p>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4 mt-6 lg:mt-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <feature.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white mb-2.5 lg:mb-3" />
                    <h3 className="text-white font-semibold text-sm lg:text-base xl:text-lg mb-1">{feature.title}</h3>
                    <p className="text-primary-100 text-xs lg:text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className={`flex gap-6 lg:gap-8 xl:gap-10 pt-3 lg:pt-4 ${mounted ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-white">10K+</div>
                  <div className="text-primary-100 text-[10px] lg:text-xs mt-1">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-white">50K+</div>
                  <div className="text-primary-100 text-[10px] lg:text-xs mt-1">Tasks Completed</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-white">99.9%</div>
                  <div className="text-primary-100 text-[10px] lg:text-xs mt-1">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className={`${mounted ? 'animate-fade-in-right' : 'opacity-0'}`}>
              {/* Mobile-only logo */}
              <div className="lg:hidden text-center mb-6">
                <div className="inline-flex items-center gap-3 mb-3">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-white">TaskCollab</span>
                </div>
                <p className="text-white/80 text-sm">Collaborate smarter, achieve faster</p>
              </div>

              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 lg:p-7 xl:p-8 border border-white/30 transform transition-all hover:shadow-3xl glow max-h-[85vh] overflow-y-auto">
                <div className="text-center mb-5 lg:mb-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5">Welcome back</h2>
                  <p className="text-xs lg:text-sm text-gray-600">Sign in to continue your journey</p>
                </div>

                {/* Form */}
                <form className="space-y-3.5 lg:space-y-4" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 text-red-700 px-3 py-2.5 rounded-xl text-xs lg:text-sm flex items-start gap-2.5 border border-red-200 animate-shake">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="flex-1">{error}</span>
                    </div>
                  )}

                  <div className="space-y-3 lg:space-y-3.5">
                    {/* Email Input */}
                    <div className="relative">
                      <label className="block text-[11px] lg:text-xs font-semibold text-gray-700 mb-1.5">
                        Email address
                      </label>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) dispatch(clearError());
                          }}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          required
                          icon={<Mail className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'email' ? 'text-primary-600' : 'text-gray-400'}`} />}
                          className={`transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-primary-500 shadow-lg' : ''}`}
                        />
                        {email && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none animate-scale-in" />
                        )}
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] lg:text-xs font-semibold text-gray-700">
                          Password
                        </label>
                        <button 
                          type="button" 
                          className="text-[11px] lg:text-xs text-primary-600 hover:text-primary-700 font-semibold transition-all duration-300 hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) dispatch(clearError());
                          }}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          required
                          icon={<Lock className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'password' ? 'text-primary-600' : 'text-gray-400'}`} />}
                          className={`pr-12 transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-primary-500 shadow-lg' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-300 p-1 rounded-lg hover:bg-gray-100 transform hover:scale-110"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remember me checkbox */}
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3.5 w-3.5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer transition-all duration-300"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-[11px] lg:text-xs text-gray-700 cursor-pointer select-none">
                      Remember me for 30 days
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full justify-center group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    isLoading={isLoading}
                  >
                    <span className="relative z-10 flex items-center text-sm lg:text-base">
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>

                  {/* Demo credentials */}
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="w-full flex items-center justify-center gap-2 py-2 lg:py-2.5 px-3 border-2 border-dashed border-primary-200 rounded-xl text-[11px] lg:text-xs font-medium text-primary-700 bg-primary-50/50 hover:border-primary-400 hover:bg-primary-100 transition-all duration-300 group transform hover:scale-105"
                  >
                    <Sparkles className="w-3 h-3 lg:w-3.5 lg:h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Try demo account</span>
                    <span className="text-[10px] text-primary-600 ml-1">(Quick start)</span>
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-4 lg:my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-[11px] lg:text-xs text-gray-500 font-medium">New to TaskCollab?</span>
                  </div>
                </div>

                {/* Sign up link */}
                <Link
                  to="/signup"
                  className="block w-full text-center py-2 lg:py-2.5 px-3 border-2 border-gray-300 rounded-xl text-[11px] lg:text-xs font-semibold text-gray-700 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
                >
                  Create an account
                </Link>
              </div>

              {/* Footer */}
              <div className="text-center mt-4 lg:mt-6 space-y-2">
                <p className="text-[10px] lg:text-xs text-white/70">
                  By signing in, you agree to our{' '}
                  <button className="underline hover:text-white transition-colors duration-300">Terms of Service</button>
                  {' '}and{' '}
                  <button className="underline hover:text-white transition-colors duration-300">Privacy Policy</button>
                </p>
                <p className="text-[10px] lg:text-xs text-white/50">
                  © 2024 TaskCollab. All rights reserved.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};