export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
  },
  medications: {
    all: ['medications'] as const,
    detail: (id: string) => ['medications', id] as const,
    lowStock: ['medications', 'lowStock'] as const,
  },
  schedule: {
    byDate: (date: string) => ['schedule', date] as const,
    stats: ['schedule', 'stats'] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    detail: (id: string) => ['appointments', id] as const,
  },
  vitals: {
    all: ['vitals'] as const,
    history: ['vitals', 'history'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    unread: ['notifications', 'unread'] as const,
  },
} as const;
