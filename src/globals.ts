import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export const isProduction =
  (() => process.env.NODE_ENV == 'production')()
;

export type EmailRecipients = 'ethan'|'jason';

export const emailRecipients: EmailRecipients[] = [
  'ethan',
  'jason',
];

export const isDevelopment = !isProduction;
export const isMobile = () => window.outerWidth <= 511;

export const isAuthed = () => {
  if (!navigator.cookieEnabled) return false;
  return !!(
       localStorage.getItem('userid')
    && localStorage.getItem('passcode') == 'yes'
  );
};

export function isAuthedGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  if (!isAuthed()) return next('/red33m/login');
  next();
}


export function getEmail(name: EmailRecipients) {
  return name + ['.org','x','e','-','v','e','@'].reverse().join('');
}


