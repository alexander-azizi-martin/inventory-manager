import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import { ChangeEvent, useEffect, useState } from 'react';
import { Plus, X as Close } from 'react-feather';
import useSWR from 'swr';

import { api, useRequest } from '~/utils/api';

interface TagDropdownProps {
  selectedTags: string[];
  onChange: (newTags: string[]) => void;
}

const TagDropdown = ({ selectedTags, onChange }: TagDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [initialTags, setInitialTags] = useState<string[]>([]);

  const { data } = useSWR(
    '/api/tags',
    useRequest(() => api.get('/api/tags')),
  );

  useEffect(() => {
    if (data) {
      const tags = data.map((item: any) => item['tag']);

      setTags(tags);
      setInitialTags(tags);
    }
  }, [data]);

  const handleAddTag = (tag: string) => () => {
    if (selectedTags.includes(tag)) {
      setTextValue('');
      onChange(selectedTags.filter((other) => other != tag));
      setTags(tags.filter((other) => initialTags.includes(other)));
    } else {
      onChange(selectedTags.concat(tag));

      if (!tags.includes(tag)) {
        tags.push(tag);
      }

      setTags(
        tags.filter((other) => initialTags.includes(other) || other == tag),
      );
    }
  };

  const handleRemoveTag = (tag: string) => () => {
    onChange(selectedTags.filter((other) => tag != other));
    setTags(
      tags.filter(
        (other) => initialTags.includes(other) || selectedTags.includes(tag),
      ),
    );
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpen(false);
        setTextValue('');
      }}
    >
      <div>
        <div className="relative">
          <InputLabel htmlFor="tag">Tags</InputLabel>
          <TextField
            id="tag"
            value={textValue}
            variant="outlined"
            size="small"
            fullWidth
            onChange={(event) => {
              setTextValue(event.target.value);
            }}
            onFocus={() => {
              setOpen(true);
            }}
          />
          {open && (
            <div className="absolute card w-full z-50">
              <MenuList style={{ padding: 0 }}>
                {textValue && !tags.includes(textValue) && (
                  <MenuItem onClick={handleAddTag(textValue)}>
                    <Plus size={20} />
                    <span className="font-bold">Add&nbsp;</span>
                    {textValue}
                  </MenuItem>
                )}
                {tags
                  .filter((tag) => tag.match(new RegExp(textValue, 'i')))
                  .map((tag) => (
                    <MenuItem key={tag} onClick={handleAddTag(tag)}>
                      <Radio
                        checked={selectedTags.includes(tag)}
                        style={{ padding: 0 }}
                      />
                      {tag}
                    </MenuItem>
                  ))}
              </MenuList>
            </div>
          )}
        </div>
        <div className="flex flex-wrap max-w-[200px]">
          {selectedTags.map((tag) => (
            <Chip
              icon={
                <Close
                  className="hover:cursor-pointer"
                  onClick={handleRemoveTag(tag)}
                />
              }
              key={tag}
              label={tag}
              className="m-1"
            />
          ))}
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default TagDropdown;
