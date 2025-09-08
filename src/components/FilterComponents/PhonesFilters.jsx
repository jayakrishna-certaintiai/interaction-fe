import React, { useState } from 'react';
import { Box, FormControl, MenuItem, Select, Chip } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

function PhonesFilter({ phones = [], phonesList, setPhones }) {
    const initialHeight = 30;
    const [selectHeight, setSelectHeight] = useState(initialHeight);

    const updateHeight = (selectedEmails) => {
        setSelectHeight(selectedEmails.length > 0 ? Math.min(80, initialHeight + selectedEmails.length * 20) : initialHeight);
    };

    const handleEmailChange = (event) => {
        const selectedEmails = event.target.value || [];
        setPhones(selectedEmails);
        updateHeight(selectedEmails);
    };

    const handleDelete = (phoneToRemove) => () => {
        setPhones((prev) => {
            const updated = prev.filter((phone) => phone !== phoneToRemove);
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
                value={phones || []}
                onChange={handleEmailChange}
                renderValue={(selected) => {
                    if (!Array?.isArray(selected)) {
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
                            {selected.map((phone) => (
                                <Chip
                                    key={phone}
                                    label={phone}
                                    // onDelete={handleDelete(phone)}
                                    // deleteIcon={<CancelIcon />}
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
                {phonesList?.map((phone) => (
                    <MenuItem key={phone} value={phone}>
                        {phone}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default PhonesFilter;
