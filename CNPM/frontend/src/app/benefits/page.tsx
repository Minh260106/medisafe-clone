'use client';

import React from 'react';
import Link from 'next/link';
import {
  Pill,
  HeartPulse,
  Clock,
  Users,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function BenefitsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* ----------------- HEADER NAVIGATION ----------------- */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Pill className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MediSafe
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <Link
              href={ROUTES.HOME}
              className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              Trang chủ
            </Link>
            <Link
              href={ROUTES.FEATURES}
              className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              Tính năng
            </Link>
            <Link
              href={ROUTES.BENEFITS}
              className="relative px-4 py-2 rounded-full text-sm font-bold text-emerald-600 dark:text-emerald-400 transition-all"
            >
              Lợi ích
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-600 rounded-full" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Đăng nhập
            </Link>
            <Link
              href={ROUTES.AUTH.REGISTER}
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </header>

      {/* ----------------- HERO HEADER ----------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Back Link */}
        <div>
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-400 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>

        {/* Hero Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            LỢI ÍCH SỨC KHỎE Y TẾ
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Giá trị thực sự mà MediSafe <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 bg-clip-text text-transparent">
              mang lại cho cuộc sống của bạn
            </span>
          </h1>
          <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Giải pháp loại bỏ hoàn toàn rủi ro quên thuốc, tối ưu hóa quá trình điều trị và đem lại sự an tâm tuyệt đối cho cả gia đình.
          </p>
        </div>

        {/* ----------------- 4 DETAILED BENEFIT CARDS ----------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Tránh quên liều & Uống trùng liều</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Giảm 98% nguy cơ bỏ sót thuốc hoặc uống lặp liều do quên. Giúp duy trì nồng độ dược chất ổn định trong máu, tối đa hóa hiệu quả điều trị bệnh mạn tính.
              </p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 font-semibold space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500" /> Giảm rủi ro dị ứng hoặc quá liều do quên</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-500" /> Đảm bảo uống đúng thời điểm trước/sau bữa ăn</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
              <Clock className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Kiểm soát bệnh mạn tính lâu dài</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Hỗ trợ kỷ luật dùng thuốc nghiêm ngặt cho bệnh nhân cao huyết áp, tiểu đường, tim mạch hay hen suyễn. Ngăn ngừa nguy cơ biến chứng nguy hiểm.
              </p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 font-semibold space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Giữ chỉ số huyết áp & đường huyết ổn định</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Tăng tỷ lệ điều trị thành công lên đến 95%</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <Users className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">An tâm cho người thân & gia đình</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Cho phép người chăm sóc theo dõi sát sao việc uống thuốc của ông bà, cha mẹ hoặc trẻ nhỏ. Đem lại sự an tâm tuyệt đối dù ở xa.
              </p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 font-semibold space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Theo dõi trạng thái đã uống theo thời gian thực</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Giảm bớt gánh nặng lo âu cho người chăm sóc</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Minh bạch thông tin với Bác sĩ</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Cung cấp báo cáo tuân thủ rõ ràng và danh mục thuốc chính xác trong mỗi đợt tái khám. Giúp bác sĩ đưa ra phác đồ điều trị chuẩn xác nhất.
              </p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 font-semibold space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Xuất dữ liệu báo cáo chuyên nghiệp</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hỗ trợ trao đổi y tế chính xác, minh bạch</li>
            </ul>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-left">
            <h3 className="text-2xl font-black">Bắt đầu bảo vệ sức khỏe ngay hôm nay!</h3>
            <p className="text-xs text-emerald-100 font-medium">
              Trải nghiệm ứng dụng quản lý thuốc hàng đầu dành cho bạn và gia đình.
            </p>
          </div>
          <Link
            href={ROUTES.AUTH.REGISTER}
            className="px-7 py-3.5 rounded-2xl bg-white text-emerald-600 hover:bg-emerald-50 font-extrabold text-sm shadow-md transition-all hover:scale-105 shrink-0"
          >
            Đăng ký tài khoản miễn phí
          </Link>
        </div>
      </main>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <Pill className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm">MediSafe Clone</span>
          </div>

          <div>© 2026 MediSafe Enterprise Healthcare Solution. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
