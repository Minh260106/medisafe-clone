export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: {
    OVERVIEW: '/dashboard',
    MEDICATIONS: '/medications',
    SCHEDULE: '/schedule',
    HISTORY: '/history',
    APPOINTMENTS: '/appointments',
    HEALTH_TRACKER: '/health-tracker',
    NOTIFICATIONS: '/notifications',
    STATISTICS: '/statistics',
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },
} as const;

export type RouteValue = typeof ROUTES[keyof typeof ROUTES] | string;
