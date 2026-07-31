import { format, parseISO, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';

export function formatDate(dateString: string | Date, formatPattern = 'dd/MM/yyyy'): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return dateString.toString();
    return format(date, formatPattern, { locale: vi });
  } catch {
    return String(dateString);
  }
}

export function formatTime(timeString: string): string {
  if (!timeString) return '';
  // If time string is HH:mm
  if (timeString.length === 5 && timeString.includes(':')) {
    return timeString;
  }
  try {
    const date = parseISO(timeString);
    if (isValid(date)) {
      return format(date, 'HH:mm');
    }
  } catch {
    // fallback
  }
  return timeString;
}

export function calculateAdherencePercentage(takenCount: number, totalCount: number): number {
  if (totalCount === 0) return 100;
  return Math.round((takenCount / totalCount) * 100);
}
