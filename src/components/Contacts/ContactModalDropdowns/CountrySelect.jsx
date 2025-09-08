import React, { useState } from 'react';
import { Box, FormControl, MenuItem, Select, Chip } from '@mui/material';

function CountrySelect({ countryName = [], countryNameList = [], setCountryName }) {
  const initialHeight = 30;
  const [selectHeight, setSelectHeight] = useState(initialHeight);

  const countryArray = Array.isArray(countryName) ? countryName : [];

  const updateHeight = (selectedCountries) => {
    const newHeight = selectedCountries.length > 0
      ? Math.min(80, initialHeight + selectedCountries.length * 20)
      : initialHeight;
    setSelectHeight(newHeight);
  };

  const handleCountryChange = (event) => {
    const selectedCountries = event.target.value || [];
    setCountryName(selectedCountries);
  
    updateHeight(selectedCountries);
  };

  const handleDelete = (countryToRemove) => () => {
    setCountryName((prev) => {
      const updated = prev.filter((country) => country !== countryToRemove);
      updateHeight(updated);
      return updated;
    });
  };

  return (
    <FormControl
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #E4E4E4',
        height: `${selectHeight}px`,
        position: 'relative',
      }}
      fullWidth
    >
      <Select
        multiple
        value={countryArray}
        onChange={handleCountryChange}
        renderValue={(selected) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              maxHeight: 80,
              overflowY: 'auto',
              padding: '0',
            }}
          >
            {selected.map((country) => (
              <Chip
                key={country}
                label={country}
                // onDelete={handleDelete(country)}
                sx={{
                  margin: '1.5px',
                }}
              />
            ))}
          </Box>
        )}
        sx={{
          '& .MuiSelect-select': {
            padding: '8px',
            borderRadius: '20px',
            border: 'none',
            '&:focus': {
              border: 'none',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
              overflowY: 'auto',
              marginTop: "-10px",
            },
          },
        }}
      >
        {countryNameList.map((country) => (
          <MenuItem key={country} value={country} sx={{ fontSize: "0.875rem", width: "20px", paddingLeft: 1 }}>
            {country}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CountrySelect;
