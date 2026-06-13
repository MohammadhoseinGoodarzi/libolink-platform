// Auth state lives in the shared store so both apps observe the same session.
// Feature-local auth atoms (e.g. a transient "remember me" toggle) would be
// declared here.
export { isAuthenticatedAtom, sessionAtom, userAtom } from '@repo/stores';
