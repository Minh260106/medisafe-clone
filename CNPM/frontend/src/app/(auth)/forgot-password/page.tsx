'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pill, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/services/auth.api';
import { ROUTES } from '@/constants/routes';

const forgotSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập Email').email('Email không hợp lệ'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setLoading(true);
    setSuccessMessage(null);
    try {
      const result = await authApi.forgotPassword(data.email);
      setSuccessMessage(result.message);
    } catch {
      setSuccessMessage('Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-slate-50 to-emerald-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
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

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-600/30">
            <Pill className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Quên Mật Khẩu?</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nhập email của bạn để nhận liên kết khôi phục mật khẩu
          </p>
        </div>

        {successMessage ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs space-y-2 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
            <p className="font-semibold">{successMessage}</p>
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="inline-block mt-2 font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Địa chỉ Email khôi phục"
              type="email"
              placeholder="example@medisafe.vn"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Button type="submit" variant="primary" className="w-full py-3" isLoading={loading}>
              Gửi liên kết khôi phục
            </Button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-600"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại trang Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
