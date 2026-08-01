/**
 * FE-01: Responsive Landing Page matching UI reference
 */
import React from 'react';
import Link from 'next/link';
import {
  Bell,
  Calendar,
  TrendingUp,
  Shield,
  Play,
  ArrowRight,
  Pill,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Globe,
  LayoutDashboard,
  User,
  Settings,
  History as HistoryIcon,
  PieChart as PieChartIcon,
  BellRing,
  PackageCheck,
  FileSpreadsheet,
  HeartPulse,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* ----------------- HEADER NAVIGATION ----------------- */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Pill className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MediSafe
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="relative px-4 py-2 rounded-full text-sm font-bold text-blue-600 dark:text-blue-400 transition-all"
            >
              Trang chủ
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" />
            </Link>
            <Link
              href={ROUTES.FEATURES}
              className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              Tính năng
            </Link>
            <Link
              href={ROUTES.BENEFITS}
              className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              Lợi ích
            </Link>
          </nav>

          {/* Right Action Buttons & Utilities */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Đổi ngôn ngữ"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>VI</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </header>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-200/40 via-sky-100/30 to-indigo-100/40 dark:from-blue-900/20 dark:to-indigo-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold border border-blue-100 dark:border-blue-900/60 shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Trợ lý quản lý thuốc thông minh</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                Quản lý thuốc dễ dàng, <br />
                <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 bg-clip-text text-transparent">
                  sống khỏe
                </span>{' '}
                mỗi ngày
              </h1>

              <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                MediSafe Clone giúp bạn theo dõi lịch uống thuốc, nhắc nhở đúng giờ và cung cấp báo cáo chi tiết để chăm sóc sức khỏe tốt hơn.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  Bắt đầu miễn phí ngay
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition-all"
                >
                  <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                  Xem demo
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">100% Bảo mật</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Dữ liệu được mã hóa</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Nhắc nhở thông minh</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Không bỏ lỡ liều thuốc</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Báo cáo chi tiết</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Theo dõi sức khỏe</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive App Mockup Showcase Column */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden p-3 sm:p-5">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      <Pill className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">MediSafe Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-slate-400" />
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      M
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="hidden sm:block sm:col-span-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 space-y-1.5">
                    {[
                      { icon: LayoutDashboard, label: 'Tổng quan', active: true },
                      { icon: Pill, label: 'Thuốc của tôi' },
                      { icon: Bell, label: 'Nhắc nhở' },
                      { icon: Calendar, label: 'Lịch' },
                      { icon: HistoryIcon, label: 'Lịch sử' },
                      { icon: PieChartIcon, label: 'Thống kê' },
                      { icon: User, label: 'Hồ sơ' },
                      { icon: Settings, label: 'Cài đặt' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                          item.active
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <item.icon className="w-3.5 h-3.5" />
                        <span className="truncate">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="col-span-12 sm:col-span-9 space-y-4">
                    <div>
                      <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
                        Xin chào, Minh! 👋
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Hãy uống thuốc đúng giờ để luôn khỏe mạnh nhé.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                          <span>Hôm nay</span>
                          <Pill className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">3</div>
                        <div className="text-[10px] text-slate-500 font-medium">Liều thuốc</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                          <span>Đã uống</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">2</div>
                        <div className="text-[10px] text-slate-500 font-medium">Liều thuốc</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                          <span>Còn lại</span>
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">1</div>
                        <div className="text-[10px] text-slate-500 font-medium">Liều thuốc</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                          <span>Tuân thủ</span>
                          <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                        </div>
                        <div className="text-xl font-black text-purple-600 dark:text-purple-400">85%</div>
                        <div className="text-[10px] text-slate-500 font-medium">Tuyệt vời! 🎉</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-7 space-y-2">
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>Lịch uống hôm nay</span>
                        </div>

                        <div className="space-y-2">
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-8 py-1 rounded-md bg-blue-600 text-white font-bold text-[10px] text-center">
                                08:00
                              </span>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">Amoxicillin 500mg</div>
                                <div className="text-[10px] text-slate-500">1 viên • Sau khi ăn</div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                              Đã uống
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-8 py-1 rounded-md bg-sky-600 text-white font-bold text-[10px] text-center">
                                12:30
                              </span>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">Paracetamol 650mg</div>
                                <div className="text-[10px] text-slate-500">1 viên • Giảm đau</div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px] animate-pulse">
                              Nhắc lại
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-8 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] text-center">
                                20:00
                              </span>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">Vitamin D3 1000IU</div>
                                <div className="text-[10px] text-slate-500">1 viên • Buổi tối</div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-bold text-[10px]">
                              Chờ tới giờ
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">Thống kê tuần này</div>
                          <div className="text-[10px] text-slate-500 mt-1">Đạt 85% tỷ lệ tuân thủ</div>
                        </div>

                        <div className="py-2">
                          <svg className="w-full h-16 stroke-blue-600 fill-none" viewBox="0 0 100 40">
                            <path
                              d="M 0 30 Q 20 10, 40 5 T 80 25 T 100 15"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            <circle cx="40" cy="5" r="3" className="fill-blue-600" />
                            <circle cx="80" cy="25" r="3" className="fill-blue-600" />
                          </svg>
                        </div>

                        <button className="w-full py-1.5 text-[11px] font-bold text-blue-600 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900 rounded-lg text-center hover:bg-blue-50 transition-colors">
                          Xem báo cáo chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 2: TÍNH NĂNG NỔI BẬT ----------------- */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
              TÍNH NĂNG NỔI BẬT
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Tất cả trong một <br />
              <span className="text-blue-600">để chăm sóc sức khỏe của bạn</span>
            </h2>
          </div>

          {/* 6 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-left space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nhắc nhở thông minh đa kênh</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Thông báo PWA, âm thanh và rung nhắc lại linh hoạt giúp bạn không bao giờ bỏ lỡ liều thuốc quan trọng.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-left space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quản lý tồn kho tủ thuốc</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Tự động trừ số lượng sau mỗi lần uống và cảnh báo thông minh khi thuốc trong kho sắp hết.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-left space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Báo cáo tuân thủ trực quan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Biểu đồ phần trăm tuân thủ điều trị theo tuần và tháng, hỗ trợ đánh giá hiệu quả dùng thuốc.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-left space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nhật ký & Xuất báo cáo CSV</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Ghi lại lịch sử uống thuốc chuẩn xác và dễ dàng xuất dữ liệu CSV cung cấp cho bác sĩ điều trị.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-left space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Trực quan dạng bào chế</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Nhận diện thuốc dễ dàng qua hình dáng (viên nén, viên nang, siro, dung dịch) và màu sắc thực tế.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-left space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">An toàn & bảo mật y tế</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Bảo vệ dữ liệu sức khỏe cá nhân theo tiêu chuẩn nghiêm ngặt, mã hóa thông tin an toàn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 3: LỢI ÍCH THỰC TẾ ----------------- */}
      <section id="benefits" className="py-20 bg-[#F8FAFC] dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
              LỢI ÍCH
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Giá trị sức khỏe thực sự <br />
              <span className="text-emerald-600">MediSafe mang lại cho bạn</span>
            </h2>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Giải pháp loại bỏ nỗi lo quên thuốc, giúp bạn và người thân yên tâm tận hưởng cuộc sống khỏe mạnh.
            </p>
          </div>

          {/* 4 Benefits Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left space-y-4 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tránh quên & uống trùng liều</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Giảm 98% nguy cơ bỏ sót hoặc uống nhầm liều, đảm bảo nồng độ thuốc trong cơ thể luôn ổn định.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left space-y-4 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Kiểm soát bệnh mạn tính</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Hỗ trợ đắc lực cho bệnh nhân huyết áp, tiểu đường, tim mạch duy trì kỷ luật điều trị lâu dài.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left space-y-4 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">An tâm cho người thân</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Dễ dàng theo dõi và hỗ trợ lịch dùng thuốc cho ông bà, cha mẹ hoặc con cái ngay trên một ứng dụng.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left space-y-4 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dễ dàng làm việc với bác sĩ</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Cung cấp báo cáo tuân thủ minh bạch và đơn thuốc đầy đủ giúp bác sĩ đưa ra phác đồ chính xác nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <Pill className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm">MediSafe Clone</span>
          </div>

          <div>
            © 2026 MediSafe Enterprise Healthcare Solution. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
