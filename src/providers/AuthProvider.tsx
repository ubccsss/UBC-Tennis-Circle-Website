'use client';
import {useCallback, useState, useEffect, useMemo} from 'react';
import {useRouter} from 'next/navigation';
import {User} from 'lucia';
import {getClientSession} from '@utils';
import {AuthContext} from '@contexts';
import {authBroadcast} from '@broadcasts';

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getSession = useCallback(async () => {
    setUser(null);
    setLoading(true);

    const session = await getClientSession();

    if (session) {
      setUser(session.user);
    }

    setLoading(false);
  }, []);

  const router = useRouter();

  authBroadcast.addEventListener('message', msg => {
    if (msg === 'reload-auth') {
      getSession();
      router.push('/');
    }
  });

  useEffect(() => {
    getSession();
  }, [getSession]);

  const value = useMemo(() => {
    return {
      user,
      loading,
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
