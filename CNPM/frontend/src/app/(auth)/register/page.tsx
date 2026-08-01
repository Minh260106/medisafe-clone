'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pill, Mail, Lock, User as UserIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/services/auth.api';
import { ROUTES } from '@/constants/routes';

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username phải ít nhất 3 ký tự'),
    email: z.string().min(1, 'Vui lòng nhập Email').email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự'),
    confirmPassword: z.string().min(8, 'Xác nhận mật khẩu ít nhất 8 ký tự'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Bạn cần đồng ý với Điều khoản dịch vụ',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: true,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
      });
      setSuccessMessage('Đăng ký thành công. Hãy đăng nhập bằng tài khoản vừa tạo.');
      router.push(ROUTES.AUTH.LOGIN);
    } catch (error) {
      setErrorMessage((error as { message?: string })?.message || 'Đăng ký thất bại. Username hoặc email có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 p-8 space-y-6">
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

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
            <Pill className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Tạo Tài Khoản Mới</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bắt đầu trải nghiệm quản lý sức khỏe cùng MediSafe
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username"
            type="text"
            placeholder="nguyenvana"
            leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
            error={errors.username?.message}
            {...register('username')}
          />

          <Input
            label="Địa chỉ Email"
            type="email"
            placeholder="example@medisafe.vn"
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Xác nhận Mật khẩu"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {/* Terms checkbox */}
          <div className="space-y-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                {...register('acceptTerms')}
              />
              <span>
                Tôi đồng ý với{' '}
                <span className="font-bold text-blue-600 dark:text-blue-400">Điều khoản sử dụng</span> &{' '}
                <span className="font-bold text-blue-600 dark:text-blue-400">Chính sách bảo mật</span> của MediSafe.
              </span>
            </label>
            {errors.acceptTerms?.message && (
              <p className="text-[11px] text-red-500">{errors.acceptTerms.message}</p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20" isLoading={loading}>
            Tạo tài khoản ngay
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          Đã có tài khoản?{' '}
          <Link href={ROUTES.AUTH.LOGIN} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
