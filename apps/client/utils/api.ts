import axios, { AxiosResponse, AxiosError, Axios } from 'axios';

import type { ProductForm, AccessToken, Session } from '~/types';
import useSession from '~/utils/useSession';

const isDev = process.env.NODE_ENV == 'development';

export const apiURL = isDev ? 'http://localhost:5000' : '';

export const api = axios.create({
  baseURL: apiURL,
});

api.interceptors.request.use(async (config) => {
  const { accessToken } = useSession.getState();

  if (accessToken) {
    config.headers = { Authorization: `bearer ${accessToken}` };
  }

  return config;
});

let refreshSession: null | Promise<Session> = null;

export const useRequest = (makeRequest: () => Promise<AxiosResponse>) => {
  return async () => {
    try {
      // Tries to make request
      const { data } = await makeRequest();
      return data;
    } catch (error) {
      const { refreshToken, setSession, deleteSession } = useSession.getState();

      if ((error as AxiosError)?.response?.status === 401 && refreshToken) {
        try {
          // Checks if the session is already being updated
          if (!refreshSession) {
            // Tries to update session
            refreshSession = new Promise(async (resolve, reject) => {
              try {
                const {
                  data: newSession,
                } = await api.post('/api/sessions/refresh', { refreshToken });
  
                setSession(newSession);
  
                resolve(newSession);
              } catch (error) {
                reject();
              }
            });
          }

          await refreshSession;
          refreshSession = null;

          // Remakes request
          const { data } = await makeRequest();
          return data;
        } catch (error) {
          deleteSession();
        }
      } else {
        throw error;
      }
    }
  };
};
