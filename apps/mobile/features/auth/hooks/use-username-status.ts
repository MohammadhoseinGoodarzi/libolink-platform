import { useEffect, useState } from 'react';
import { checkUsername, type UsernameStatus } from '../services/username-availability';

// Debounced live username availability for the sign-up form (handoff §6.1).
export function useUsernameStatus(username: string): UsernameStatus {
  const [status, setStatus] = useState<UsernameStatus>('idle');

  useEffect(() => {
    if (username.trim().length < 3) {
      setStatus('idle');
      return;
    }
    const id = setTimeout(() => setStatus(checkUsername(username)), 400);
    return () => clearTimeout(id);
  }, [username]);

  return status;
}
