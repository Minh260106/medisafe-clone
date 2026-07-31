'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pill, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/services/auth.api';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Họ và tên phải ít nhất 2 ký tự'),
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
  const { setAuth } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    try {
      const result = await authApi.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      setAuth(result.user, result.token);
      router.push(ROUTES.DASHBOARD.OVERVIEW);
    } catch {
      setErrorMessage('Đăng ký thất bại. Email có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 p-8 space-y-6">
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Họ và Tên"
            type="text"
            placeholder="Nguyễn Văn A"
            leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
            error={errors.fullName?.message}
            {...register('fullName')}
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
