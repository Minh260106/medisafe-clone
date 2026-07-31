'use client';

import React from 'react';
import { UserCheck, Building2, MapPin, Calendar, Clock, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Appointment } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (apt: Appointment) => void;
  onDelete?: (apt: Appointment) => void;
  onMarkComplete?: (apt: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete,
  onMarkComplete,
}) => {
  return (
    <Card className="card-hover-effect flex flex-col justify-between space-y-4 p-5 border-slate-200/80 dark:border-slate-800">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                {appointment.doctorName}
              </h3>
              <span className="inline-block text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                {appointment.specialty}
              </span>
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              appointment.status === 'upcoming'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                : appointment.status === 'completed'
                ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
            }`}
          >
            {appointment.status === 'upcoming' ? 'Sắp tới' : appointment.status === 'completed' ? 'Đã khám' : 'Đã hủy'}
          </span>
        </div>

        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-800 dark:text-slate-200">{appointment.clinicName}</span>
          </div>

          {appointment.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{appointment.address}</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-blue-600 dark:text-blue-400 font-bold pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{appointment.appointmentDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{appointment.appointmentTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        {appointment.status === 'upcoming' && onMarkComplete && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onMarkComplete(appointment)}
            className="text-xs font-semibold text-green-600 border-green-200 hover:bg-green-50"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Đã khám
          </Button>
        )}
        {onEdit && (
          <Button size="sm" variant="outline" onClick={() => onEdit(appointment)}>
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
        )}
        {onDelete && (
          <Button size="sm" variant="danger" onClick={() => onDelete(appointment)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
};
