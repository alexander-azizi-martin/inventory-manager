import create from 'zustand';
import { persist } from 'zustand/middleware';

import type { Session } from '~/types';

const useSession = create(
  persist(
    (set) => ({
      accessToken: '',
      refreshToken: '',
      setSession(session: Session) {
        set(session);
      },
      deleteSession() {
        set({ accessToken: '', refreshToken: '' });
      },
    }),
    {
      name: 'session',
    },
  ),
);

export default useSession;
