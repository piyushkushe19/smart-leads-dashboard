import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      toast.error(error.response?.data?.message ?? 'Login failed');
    }
  };

  const fillDemo = (role: 'admin' | 'sales') => {
    const creds = {
      admin: { email: 'admin@smartleads.com', password: 'Admin@123' },
      sales: { email: 'sales@smartleads.com', password: 'Sales@123' },
    };
    void login(creds[role]).then(() => navigate('/dashboard')).catch((err: AxiosError<ApiResponse>) => {
      toast.error(err.response?.data?.message ?? 'Login failed');
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-brand-400"
              style={{
                width: Math.random() * 200 + 50 + 'px',
                height: Math.random() * 200 + 50 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.3,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">SmartLeads</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-4">
            {[
              { label: 'Total Leads', value: '2,451', change: '+12%' },
              { label: 'Qualified', value: '847', change: '+8%' },
              { label: 'Conversion', value: '34.5%', change: '+4%' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 text-sm">{stat.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold">{stat.value}</span>
                  <span className="text-emerald-400 text-xs">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              Manage your leads<br />
              <span className="text-brand-400">smarter, faster.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              A professional CRM dashboard built for modern sales teams.
              Track, filter, and convert leads with precision.
            </p>
          </div>
        </div>

        <div className="relative text-xs text-slate-600">
          © 2026 SmartLeads Dashboard By Piyush
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-2.5 mb-8">
              <div className="p-1.5 bg-brand-600 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-base">SmartLeads</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500"
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('password')}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-950 px-3 text-slate-500">Quick demo access</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => fillDemo('admin')}
                className="p-3 rounded-xl border border-slate-800 hover:border-brand-700 hover:bg-brand-950/30 transition-all text-left"
              >
                <p className="text-xs text-slate-400 mb-0.5">Admin Account</p>
                <p className="text-sm font-medium text-brand-400">⭐ Full Access</p>
              </button>
              <button
                onClick={() => fillDemo('sales')}
                className="p-3 rounded-xl border border-slate-800 hover:border-brand-700 hover:bg-brand-950/30 transition-all text-left"
              >
                <p className="text-xs text-slate-400 mb-0.5">Sales Account</p>
                <p className="text-sm font-medium text-slate-300">👤 Limited Access</p>
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
