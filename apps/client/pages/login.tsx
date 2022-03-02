import type { NextPage } from 'next';
import type { ChangeEvent, FocusEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Container,
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';

import { api } from '~/utils/api';
import useAlert from '~/utils/useAlert';
import useSession from '~/utils/useSession';

const validateUsername = (username: string) => {
  if (!(3 <= username.length && username.length <= 20))
    return 'Username must be between 3 and 20 characters';

  return '';
};

const Login: NextPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [error, setError] = useAlert();
  const setSession = useSession((state) => state.setSession);

  const handleChange = (setState: (newValue: string) => void) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setState(event.target.value);
    };
  };

  const handleBlur = (
    validator: (value: string) => string,
    setError: (error: string) => void,
  ) => {
    return (event: FocusEvent<HTMLInputElement>) => {
      const error = validator(event.target.value);

      if (error) {
        setError(error);
      } else {
        setError('');
      }
    };
  };

  const router = useRouter();
  const handleSubmit = async () => {
    const usernameError = validateUsername(username);
    if (usernameError) {
      setUsernameError(usernameError);
      return;
    }

    try {
      const { data } = await api.post('/api/sessions', { username, password });
      setSession(data);

      router.push('/');
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="w-full h-full flex justify-center pt-[10%]">
      {error && (
        <Alert
          severity="error"
          onClose={() => {
            setError('');
          }}
          className="fixed bottom-8"
        >
          {error}
        </Alert>
      )}
      <form>
        <Stack spacing={2}>
          <Typography variant="h4" gutterBottom component="div">
            Login
          </Typography>
          <div>
            <TextField
              className="w-[400px]"
              label="Username"
              value={username}
              onChange={handleChange(setUsername)}
              error={!!usernameError}
              helperText={usernameError}
              onBlur={handleBlur(validateUsername, setUsernameError)}
            />
          </div>
          <div>
            <TextField
              className="w-[400px]"
              label="Password"
              type="password"
              value={password}
              onChange={handleChange(setPassword)}
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outlined" onClick={handleSubmit}>
              Login
            </Button>
            <Link href="/signup" passHref>
              <Button component="a" variant="text">Sign Up</Button>
            </Link>
          </div>
        </Stack>
      </form>
    </div>
  );
};

export default Login;
