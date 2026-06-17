export const AUTH_ROUTES = {
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
} as const;

export const SOCIAL_PROVIDERS = ['apple', 'google'] as const;

export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];
