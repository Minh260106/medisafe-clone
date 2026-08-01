/**
 * FE-03: Enhance Auth UX with Realtime Zod Validation & Back-to-Home Navigation
 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pill, Mail, Lock, AlertCircle, ShieldCheck, Heart, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/services/auth.api';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập username hoặc email'),
  password: z.string().min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'nguyenvana',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await authApi.login({ username: data.username, password: data.password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('medisafe_token', result.access_token);
      }
      const profile = await authApi.getProfile();
      setAuth(profile, result.access_token);
      router.push(ROUTES.DASHBOARD.OVERVIEW);
    } catch (error) {
      setErrorMessage((error as { message?: string })?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Left Column: Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200/80 dark:border-slate-700/80 space-y-6">
          {/* Back to Home Button */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-750 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang chủ</span>
            </Link>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Pill className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Đăng Nhập</h2>
            <p className="text-xs text-slate-500">
              Quản lý và nhắc nhở lịch uống thuốc cá nhân thông minh
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username hoặc Email"
              type="text"
              placeholder="nguyenvana hoặc nguyenvana@medisafe.vn"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 font-medium">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                Ghi nhớ đăng nhập
              </label>
              <Link href={ROUTES.AUTH.FORGOT_PASSWORD} className="text-blue-600 font-bold hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3.5 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30" isLoading={loading}>
              Đăng nhập ngay
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-700/60">
            Chưa có tài khoản?{' '}
            <Link href={ROUTES.AUTH.REGISTER} className="font-bold text-blue-600 hover:underline">
              Đăng ký tài khoản mới
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Split-Screen Healthcare Illustration Showcase */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-sky-600 to-teal-500 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30">
            <ShieldCheck className="w-4 h-4 text-emerald-300" /> MediSafe Healthcare App
          </span>
          <h1 className="text-4xl font-black leading-tight tracking-tight">
            Chăm sóc sức khỏe gia đình <br />
            mỗi ngày với sự an tâm tuyệt đối
          </h1>
        </div>

        {/* Feature Cards Showcase */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-400 text-slate-900 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Nhắc nhở chuẩn xác 100%</h4>
              <p className="text-xs text-blue-100">Đồng bộ đa thiết bị PWA không bỏ lỡ liều nào</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Báo cáo tuân thủ thông minh</h4>
              <p className="text-xs text-blue-100">Theo dõi tỉ lệ uống thuốc trực quan theo tuần & tháng</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-100 font-medium">
          © 2026 MediSafe Health Technology Solutions. All rights reserved.
        </div>
      </div>
    </div>
  );
}
