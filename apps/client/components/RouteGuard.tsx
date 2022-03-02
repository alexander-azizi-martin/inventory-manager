import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import parseUrl from 'url-parse';

import useSession from '~/utils/useSession';

interface RouteGuardProps {
  children: ReactNode;
}

const publicPaths = ['/login', '/signup'];

const RouteGuard = ({ children }: RouteGuardProps) => {
  const [authorized, setAuthorized] = useState(false);
  const accessToken = useSession((state) => state.accessToken);

  const router = useRouter();
  useEffect(() => {
    authCheck(router.asPath);

    const hideContent = () => setAuthorized(false);

    router.events.on('routeChangeStart', hideContent);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [accessToken]);

  function authCheck(url: string) {
    const { accessToken } = useSession.getState();

    const parsedUrl = parseUrl(url);
    if (!accessToken && !publicPaths.includes(parsedUrl.pathname)) {
      setAuthorized(false);

      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }

  if (authorized)
    return children;

  return <></>
};

export default RouteGuard;
