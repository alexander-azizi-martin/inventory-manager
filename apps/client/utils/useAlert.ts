import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';

type UseAlertType = () => [string, Dispatch<SetStateAction<string>>];

const useAlert: UseAlertType = () => {
  const [alert, setAlert] = useState('');

  useEffect(() => {
    let timeoutID: any = null;

    if (alert) {
      timeoutID = setTimeout(() => {
        setAlert('');
      }, 10000);
    }

    return () => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
    };
  }, [alert]);

  return [alert, setAlert];
};

export default useAlert;
