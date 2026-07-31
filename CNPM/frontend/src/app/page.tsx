import Link from 'next/link';
import { Pill, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
      {/* Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30">
            <Pill className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
            MediSafe
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl font-medium bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 transition-all hover:scale-105 active:scale-95"
          >
            Đăng ký miễn phí
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 flex flex-col justify-center py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-sm font-medium border border-sky-200 dark:border-sky-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Trợ lý Quản lý Thuốc Chuyên Nghiệp #1
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Không bao giờ bỏ lỡ <br />
              <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                liều thuốc nào nữa
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl">
              MediSafe Clone giúp bạn theo dõi lịch uống thuốc, cảnh báo lượng tồn kho, nhắc nhở thông minh và báo cáo tỉ lệ tuân thủ điều trị trực quan theo thời gian thực.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Vào Dashboard Ngay
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all"
              >
                Trang Đăng Nhập
              </Link>
            </div>

            {/* Micro Feature Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">99.8%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Chính xác nhắc nhở</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Đồng bộ PWA</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">100%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bảo mật thông tin</div>
              </div>
            </div>
          </div>

          {/* Graphical Mockup / Feature Showcase */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-3xl blur-2xl opacity-20 dark:opacity-30"></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Lịch Uống Hôm Nay</h3>
                    <p className="text-xs text-slate-500">3 trên 4 liều đã hoàn thành</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full">
                  Tuân thủ: 85%
                </span>
              </div>

              {/* Sample Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                      08:00
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100">Amoxicillin 500mg</div>
                      <div className="text-xs text-slate-500">1 Viên • Sau khi ăn</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Đã uống
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                      12:30
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100">Paracetamol 650mg</div>
                      <div className="text-xs text-slate-500">1 Viên • Giảm đau</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-600 text-white animate-pulse">
                    Nhắc lại
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700 opacity-80">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                      20:00
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100">Vitamin C 1000mg</div>
                      <div className="text-xs text-slate-500">1 Viên sủi • Buổi tối</div>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    Chờ tới giờ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-500">
        © 2026 MediSafe Clone Enterprise Healthcare Solution.
      </footer>
    </div>
  );
}
