'use client';

import React from 'react';
import { FileText, Printer, UserCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DoctorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorReportModal: React.FC<DoctorReportModalProps> = ({ isOpen, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Báo Cáo Y Tế Chuyên Sâu (Clinical Medical Record)"
      maxWidth="xl"
    >
      <div className="space-y-6 printable-area">
        {/* Hospital Grade Report Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 text-white space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                🏥
              </div>
              <div>
                <h3 className="text-lg font-extrabold tracking-tight">
                  MEDISAFE CLINICAL REPORT
                </h3>
                <p className="text-xs text-sky-300">
                  Hồ Sơ Đánh Giá Tuân Thủ Điều Trị & Sinh Tồn • Định dạng Bệnh Án
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-300">
              <div>Ngày xuất: <strong className="text-white">31/07/2026</strong></div>
              <div>Mã hồ sơ: <strong className="text-sky-300">#MED-88942-VN</strong></div>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Họ và Tên:</span>
              <div className="font-extrabold text-white text-sm">Nguyễn Văn A</div>
            </div>
            <div>
              <span className="text-slate-400">Tuổi / Giới tính:</span>
              <div className="font-bold text-slate-200">45 tuổi / Nam</div>
            </div>
            <div>
              <span className="text-slate-400">Tiền sử dị ứng:</span>
              <div className="font-bold text-rose-300">Penicillin, Ibuprofen</div>
            </div>
            <div>
              <span className="text-slate-400">Bác sĩ theo dõi:</span>
              <div className="font-bold text-sky-300">TS.BS. Lê Hoàng Nam</div>
            </div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-500">Tỷ Lệ Tuân Thủ (30 Ngày)</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">92%</div>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              Đạt mức an toàn
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-500">Huyết Áp Trung Bình</span>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400">124/82</div>
            <span className="text-[10px] text-slate-400">mmHg (Bình thường)</span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-500">Cảnh Báo Tương Tác (DDI)</span>
            <div className="text-2xl font-black text-rose-600">1</div>
            <span className="text-[10px] text-rose-500 font-semibold">Cần lưu ý DDI L1</span>
          </div>
        </div>

        {/* Prescription List Table */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-600" />
            Danh Sách Thuốc Đang Sử Dụng (Active Prescriptions)
          </h4>

          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3">Tên Thuốc</th>
                  <th className="p-3">Liều Dùng</th>
                  <th className="p-3">Giờ Uống</th>
                  <th className="p-3">Trạng Thái Tuân Thủ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Amlodipine 5mg</td>
                  <td className="p-3">1 viên / ngày</td>
                  <td className="p-3 font-mono">08:00 AM</td>
                  <td className="p-3 text-emerald-600 font-bold">100% Đúng giờ</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Metformin 500mg</td>
                  <td className="p-3">2 viên / ngày</td>
                  <td className="p-3 font-mono">08:00 AM, 08:00 PM</td>
                  <td className="p-3 text-emerald-600 font-bold">95% Đúng giờ</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Methylprednisolone 16mg</td>
                  <td className="p-3">Liều giảm dần (Tapering)</td>
                  <td className="p-3 font-mono">08:00 AM, 01:00 PM</td>
                  <td className="p-3 text-amber-500 font-bold">Đang áp dụng ngày 2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Clinical Notes Field */}
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-2">
          <h5 className="font-extrabold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-amber-600" />
            Nhận Xét & Chỉ Định Của Bác Sĩ Dành Cho Bệnh Nhân:
          </h5>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
            "Bệnh nhân tuân thủ tốt phác đồ điều trị huyết áp. Cần chú ý duy trì chỉ số sinh tồn vào buổi sáng và ngưng tuyệt đối việc dùng chung Aspirin với Ibuprofen tự do."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">
            Báo cáo được xác thực bởi Hệ thống Y tế số MediSafe Clinical AI
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Đóng
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
              In / Xuất PDF Bệnh Án
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
