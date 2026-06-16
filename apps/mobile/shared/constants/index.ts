// Route hrefs mirror the web app's paths so deep links match across platforms.
export const ROUTES = {
  splash: '/',
  welcome: '/welcome',
  login: '/login',
  signup: '/signup',
  success: '/success',
  home: '/home',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
