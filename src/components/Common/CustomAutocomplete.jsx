import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const CustomAutocomplete = ({
  label = '',
  placeholder = '',
  options = [],
  value,
  onChange,
  inputValue,
  onInputChange,
  disabled = false,
  freeSolo = false,
}) => {
  return (
    <Autocomplete
      value={value}
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={onInputChange}
      options={options}
      disabled={disabled}
      freeSolo={freeSolo}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          sx={{
            "& .MuiInputBase-root": {
              height: "40px",
              width: "210px",
              borderRadius: "20px",
              "& input": {
                padding: "0 0px",
                mt: -1,
                "&::placeholder": {
                  color: "#404040",
                  opacity: 1,
                },
              },
            },
          }}
        />
      )}
      getOptionLabel={(option) => option ?? ""}
    />
  );
};

export default CustomAutocomplete;
