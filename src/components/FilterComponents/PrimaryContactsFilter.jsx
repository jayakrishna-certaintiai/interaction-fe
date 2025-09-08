import React, { useState } from 'react';
import { Box, FormControl, MenuItem, Select, Chip } from '@mui/material';

function PrimaryContactsFilter({ primaryContacts = [], primaryContactsList, setPrimaryContacts }) {
    const initialHeight = 30;
    const [selectHeight, setSelectHeight] = useState(initialHeight);

    const updateHeight = (selectedContacts) => {
        setSelectHeight(selectedContacts.length > 0 ? Math.max(20, initialHeight + selectedContacts.length * 20) : initialHeight);
    };

    const handleContactChange = (event) => {
        const selectedContacts = event.target.value || [];
        setPrimaryContacts(selectedContacts);
        updateHeight(selectedContacts);
    };

    const handleDelete = (primaryToRemove) => () => {
        setPrimaryContacts((prev) => {
            const updated = prev.filter((primaryContact) => primaryContact !== primaryToRemove);
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
                value={Array.isArray(primaryContacts) ? primaryContacts : []}  
                onChange={handleContactChange}
                renderValue={(selected) => {
                    if (!Array.isArray(selected)) {  // Ensure the render value handles only arrays
                        selected = [];
                    }
                    return (
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
                            {selected.map((primaryContact) => (
                                <Chip
                                    key={primaryContact}
                                    label={primaryContact}
                                    sx={{
                                        margin: '1.5px',
                                    }}
                                />
                            ))}
                        </Box>
                    );
                }}
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
                {primaryContactsList?.map((primaryContact) => (
                    <MenuItem key={primaryContact} value={primaryContact}>
                        {primaryContact}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default PrimaryContactsFilter;
