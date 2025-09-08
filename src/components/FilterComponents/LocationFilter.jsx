import React, { useState } from 'react';
import { Box, FormControl, MenuItem, Select, Chip } from '@mui/material';

function LocationFilter({ billingCountry = [], billingCountryList, setBillingCountry }) {
  const initialHeight = 30;
  const [selectHeight, setSelectHeight] = useState(initialHeight);

  const updateHeight = (selectedCountries) => {
    setSelectHeight(selectedCountries.length > 0 ? Math.min(80, initialHeight + selectedCountries.length * 20) : initialHeight);
  };

  const handleCountryChange = (event) => {
    const selectedCountries = event.target.value || [];
    setBillingCountry(selectedCountries);
    updateHeight(selectedCountries);
  };

  const handleDelete = (countryToRemove) => () => {
    setBillingCountry((prev) => {
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
        value={billingCountry || []}
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
            {selected?.map((value) => (
              <Chip
                key={value}
                label={value}
                // onDelete={handleDelete(value)}
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
      >
        {billingCountryList?.map((country) => (
          <MenuItem key={country} value={country}>
            {country}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LocationFilter;
