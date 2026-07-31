'use client';

import React, { useState } from 'react';
import { User as UserIcon, ShieldAlert, Phone, Save, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || 'Nguyễn Văn A');
  const [height, setHeight] = useState(user?.heightCm || 172);
  const [weight, setWeight] = useState(user?.weightKg || 68);
  const [allergies, setAllergies] = useState(user?.allergies?.join(', ') || 'Penicillin, Aspirin');
  const [contactName, setContactName] = useState(user?.emergencyContactName || 'Nguyễn Thị B (Vợ)');
  const [contactPhone, setContactPhone] = useState(user?.emergencyContactPhone || '0901234567');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      fullName,
      heightCm: Number(height),
      weightKg: Number(weight),
      allergies: allergies.split(',').map((a) => a.trim()).filter(Boolean),
      emergencyContactName: contactName,
      emergencyContactPhone: contactPhone,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hồ Sơ Y Tế Cá Nhân</h1>
          <p className="text-xs text-slate-500">Quản lý chỉ số cơ thể, dị ứng thuốc và thông tin liên hệ khẩn cấp</p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Cập nhật thông tin hồ sơ sức khỏe thành công!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Main User Card */}
          <Card className="flex flex-col sm:flex-row items-center gap-6 p-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-600 to-teal-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg">
              {fullName ? fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{fullName}</h2>
              <p className="text-xs text-slate-500">{user?.email || 'user@medisafe.vn'}</p>
              <span className="inline-block px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px] font-semibold mt-1">
                Tài khoản Bệnh nhân Chăm sóc Sức khỏe
              </span>
            </div>
          </Card>

          {/* Form Details */}
          <Card className="space-y-5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-sky-600" />
              Thông Tin Sinh Trắc Học
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Họ và Tên (*)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Chiều cao (cm)"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
              <Input
                label="Cân nặng (kg)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
          </Card>

          {/* Allergies Card */}
          <Card className="space-y-5 border-rose-200 dark:border-rose-900">
            <h3 className="font-bold text-base text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Dị Ứng Thuốc (Quan Trọng)
            </h3>

            <Input
              label="Danh sách dị ứng (phân cách bằng dấu phẩy)"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="VD: Penicillin, Aspirin"
            />
          </Card>

          {/* Emergency Contact Card */}
          <Card className="space-y-5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              Liên Hệ Khẩn Cấp (Emergency Contact)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tên người liên hệ"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="VD: Nguyễn Thị B (Vợ)"
              />
              <Input
                label="Số điện thoại khẩn cấp"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="0901234567"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
              Lưu thay đổi hồ sơ
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
