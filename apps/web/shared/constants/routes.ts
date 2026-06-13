export const ROUTES = {
  landing: '/',
  login: '/login',
  signup: '/signup',
  home: '/home',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
