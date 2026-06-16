export const AUTH_ROUTES = {
  splash: '/',
  welcome: '/welcome',
  login: '/login',
  signup: '/signup',
  success: '/success',
} as const;

export const SOCIAL_PROVIDERS = ['apple', 'google'] as const;

export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];
