import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import { ChangeEvent, useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import useSWR from 'swr';

import api from '~/utils/api';

interface CollectionDropdownProps {
  title: string;
  id: string;
  collection: string;
  value: string;
  onChange: (newValue: string) => void;
}

const CollectionDropdown = ({
  title,
  id,
  collection,
  value,
  onChange,
}: CollectionDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    api.request.get(collection).then((res) => {
      const data = res.data.map((item: any) => item[id]);

      setOptions(data);
    });
  }, []);

  const handleSelect = (option: string) => () => {
    if (!options.includes(option)) {
      setOptions(options.concat(option));
    }

    onChange(option);
    setOpen(false);
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpen(false);
      }}
    >
      <div className="relative">
        <InputLabel htmlFor={id}>{title}</InputLabel>
        <TextField
          id={id}
          value={value}
          variant="outlined"
          size="small"
          fullWidth
          onChange={(event) => {
            onChange(event.target.value);
          }}
          onFocus={() => {
            setOpen(true);
          }}
        />
        {open && (
          <div className="absolute card w-full z-50">
            <MenuList style={{ padding: 0 }}>
              {value && !options.includes(value) && (
                <MenuItem onClick={handleSelect(value)}>
                  <Plus size={20} />
                  <span className="font-bold">Add&nbsp;</span>
                  {value}
                </MenuItem>
              )}
              {options
                .filter((option) => option.match(new RegExp(value, 'i')))
                .map((option) => (
                  <MenuItem key={option} onClick={handleSelect(option)}>
                    {option}
                  </MenuItem>
                ))}
            </MenuList>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default CollectionDropdown;
