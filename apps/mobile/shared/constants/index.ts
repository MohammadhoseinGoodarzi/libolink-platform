// Route hrefs mirror the web app's paths so deep links match across platforms.
export const ROUTES = {
  splash: '/',
  welcome: '/welcome',
  login: '/login',
  signup: '/signup',
  verify: '/verify',
  forgot: '/forgot',
  code: '/code',
  newPassword: '/new-password',
  complete: '/complete-profile',
  success: '/success',
  home: '/home',
  messages: '/messages',
  clubs: '/clubs',
  profile: '/profile',
  myProfile: '/me',
  friends: '/friends',
  saved: '/saved',
  settings: '/settings',
  subscription: '/subscription',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
