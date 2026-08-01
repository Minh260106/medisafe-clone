'use client';

/**
 * FE-02: Separate Features Page with dedicated navigation
 */
import React from 'react';
import Link from 'next/link';
import {
  Pill,
  Bell,
  PackageCheck,
  TrendingUp,
  FileSpreadsheet,
  Calendar,
  Shield,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function FeaturesPage() {
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
              className="relative px-4 py-2 rounded-full text-sm font-bold text-blue-600 dark:text-blue-400 transition-all"
            >
              Tính năng
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" />
            </Link>
            <Link
              href={ROUTES.BENEFITS}
              className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              Lợi ích
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>

        {/* Hero Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-500" />
            TÍNH NĂNG TOÀN DIỆN
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Bộ tính năng quản lý y tế <br />
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 bg-clip-text text-transparent">
              thông minh & chuẩn lâm sàng
            </span>
          </h1>
          <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Khám phá đầy đủ các công cụ hiện đại giúp bạn làm chủ lịch uống thuốc, theo dõi tồn kho và tối ưu hóa liệu trình chăm sóc sức khỏe.
          </p>
        </div>

        {/* ----------------- 6 FEATURE CARDS GRID ----------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
              <Bell className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nhắc nhở thông minh đa kênh</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Cảnh báo chính xác qua thông báo PWA, âm thanh và rung nhắc lại linh hoạt. Hỗ trợ hoãn giờ uống khi bận mà không sợ bỏ quên liều.
              </p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 font-semibold space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Thông báo PWA tức thì</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Tùy chỉnh chế độ Nhắc lại (Snooze)</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-inner">
              <PackageCheck className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quản lý tồn kho tủ thuốc</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Tự động trừ số lượng còn lại sau mỗi lần uống và đưa ra cảnh báo kịp thời khi thuốc trong kho sắp hết dưới ngưỡng an toàn.
              </p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 font-semibold space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Cảnh báo kho sắp hết</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Theo dõi hạn dùng & đơn thuốc</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Báo cáo tuân thủ trực quan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Biểu đồ tỷ lệ uống đúng giờ, uống muộn hoặc bỏ qua theo tuần và tháng, giúp bạn và bác sĩ đánh giá chính xác mức độ tuân thủ.
              </p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 font-semibold space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Biểu đồ tròn & biểu đồ cột</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tính điểm % tuân thủ điều trị</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nhật ký & Xuất báo cáo CSV</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Ghi lại lịch sử uống thuốc chuẩn xác từng giây. Xuất toàn bộ nhật ký ra tập tin CSV chỉ với một cú nhấp chuột.
              </p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 font-semibold space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Xuất tập tin CSV dễ dàng</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Lưu trữ mốc thời gian thực</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Trực quan dạng bào chế</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Nhận diện thuốc dễ dàng qua hình dáng thực tế (viên nén, viên nang, siro, dung dịch) kết hợp màu sắc tùy chỉnh.
              </p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 font-semibold space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Mô phỏng viên thuốc 3D/Vector</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Đánh dấu thời điểm uống trước/sau ăn</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">An toàn & bảo mật y tế</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Dữ liệu sức khỏe cá nhân được bảo vệ nghiêm ngặt, chuẩn REST API sẵn sàng kết nối Backend an toàn.
              </p>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 font-semibold space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Mã hóa dữ liệu người dùng</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Chuẩn REST API backend-ready</li>
            </ul>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-left">
            <h3 className="text-2xl font-black">Sẵn sàng làm chủ lịch uống thuốc của bạn?</h3>
            <p className="text-xs text-blue-100 font-medium">
              Bắt đầu miễn phí ngay hôm nay và trải nghiệm sự tiện lợi vượt trội.
            </p>
          </div>
          <Link
            href={ROUTES.AUTH.REGISTER}
            className="px-7 py-3.5 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-extrabold text-sm shadow-md transition-all hover:scale-105 shrink-0"
          >
            Tạo tài khoản miễn phí
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
