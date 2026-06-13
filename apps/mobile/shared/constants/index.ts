// Route hrefs mirror the web app's paths so deep links match across platforms.
export const ROUTES = {
  landing: '/',
  login: '/login',
  signup: '/signup',
  home: '/home',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
