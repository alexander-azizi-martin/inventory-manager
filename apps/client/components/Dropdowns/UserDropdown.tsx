import React, { useState, useRef } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import { ChevronDown, User, LogOut } from 'react-feather';
import useSWR from 'swr';

import { api, useRequest } from '~/utils/api';
import useSession from '~/utils/useSession';

function UserDropdown() {
  const [open, setOpen] = useState(false);

  const { data } = useSWR(
    '/users/me',
    useRequest(() => api.get('/api/users/me')),
  );

  const handleLogout = async () => {
    const { refreshToken, deleteSession } = useSession.getState();

    await useRequest(() =>
      api.delete('/api/sessions', { data: { refreshToken } }),
    )();

    deleteSession();
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="relative flex items-center">
        <div
          className="flex items-center select-none hover:cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <span className="pr-2">
            <User size={18} />
          </span>
          <span className="w-15 truncate">{data?.username}</span>
          <div className={`ml-1.5 transition ${open ? 'rotate-180' : ''}`}>
            <ChevronDown size={15} />
          </div>
        </div>

        <Fade in={open}>
          <div
            className="card absolute top-7 w-max"
            onClick={() => setOpen(false)}
          >
            <ul className="list-none flex flex-col w-max">
              <li
                className="box-content text-sm pb-2 flex items-center px-3 py-1 hover:bg-[#f6f7f8] hover:rounded hover:cursor-pointer"
                onClick={handleLogout}
              >
                <span className="pr-2">
                  <LogOut size={16} />
                </span>
                Logout
              </li>
            </ul>
          </div>
        </Fade>
      </div>
    </ClickAwayListener>
  );
}

export default UserDropdown;
