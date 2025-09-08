import React, { useState } from 'react';
import { Box, FormControl, MenuItem, Select, Chip } from '@mui/material';

function CompanySelector({ company = [], clientList = [], setCompany }) {
  const initialHeight = 30;
  const [selectHeight, setSelectHeight] = useState(initialHeight);

  const companyArray = Array.isArray(company) ? company : [];

  const updateHeight = (selectedCompanies) => {
    setSelectHeight(selectedCompanies.length > 0 ? Math.min(80, initialHeight + selectedCompanies.length * 20) : initialHeight);
    //   : initialHeight
    //   ? Math.min(80, initialHeight + selectedCompanies.length * 20)
    //   : initialHeight;
    // setSelectHeight(newHeight);
  };

  const handleCompanyChange = (event) => {
    const selectedCompanies = event.target.value || [];
    setCompany(selectedCompanies);
    updateHeight(selectedCompanies);
  };

  const handleDelete = (companyToRemove) => () => {
    setCompany((prev) => {
      const updated = prev.filter((comp) => comp !== companyToRemove);
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
        value={companyArray}
        onChange={handleCompanyChange}
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
            {selected.map((company) => (
              <Chip
                key={company.companyName}
                label={company.companyName || 'Unknown'}
                // onDelete={handleDelete(company)}
                // deleteIcon={<AiOutlineClose />}
                sx={{
                  margin: '1.5px',
                  width: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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
              maxHeight: 250,
              overflowY: 'auto',
              overflowX: 'auto',
              marginTop: "-10px",
              maxWidth: 230,
            },
          },
        }}
      >
        {clientList.map((company) => (
          <MenuItem key={company.companyName} value={company} sx={{ fontSize: "0.9rem", paddingLeft: 1 }} >
            {company.companyName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CompanySelector;
