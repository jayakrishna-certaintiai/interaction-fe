import React, { useState } from 'react';
import { Box, FormControl, MenuItem, Select, Chip } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

function SurveyStatusSelect({ status = [], statusList, setStatus }) {
    const initialHeight = 30;
    const [selectHeight, setSelectHeight] = useState(initialHeight);

    const updateHeight = (selectedItems) => {
        setSelectHeight(selectedItems.length > 0 ? Math.min(80, initialHeight + selectedItems.length * 20) : initialHeight);
    };

    const handleChange = (event) => {
        const selectedItems = event.target.value || [];
        setStatus(selectedItems);
        updateHeight(selectedItems);
    };

    const handleDelete = (itemToRemove) => () => {
        setStatus((prev) => {
            const updated = prev.filter((name) => name !== itemToRemove);
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
                value={status || []}
                onChange={handleChange}
                renderValue={(selected) => {
                    if (!Array.isArray(selected)) {
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
                            {selected.map((name) => (
                                <Chip
                                    key={name}
                                    label={name}
                                    // onDelete={handleDelete(name)}
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
                {statusList?.map((name) => (
                    <MenuItem key={name} value={name}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default SurveyStatusSelect;
