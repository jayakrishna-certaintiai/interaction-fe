import React, { useState } from 'react';
import { Box, FormControl, MenuItem, Select, Chip } from '@mui/material';

function DataGatheringSelect({ dataGathering = [], dataGatheringList, setDataGathering }) {
    const initialHeight = 30;
    const [selectHeight, setSelectHeight] = useState(initialHeight);

    const updateHeight = (selectedEmails) => {
        setSelectHeight(selectedEmails.length > 0 ? Math.min(80, initialHeight + selectedEmails.length * 20) : initialHeight);
    };

    const handleEmailChange = (event) => {
        const selectedEmails = event.target.value || [];
        setDataGathering(selectedEmails);
        updateHeight(selectedEmails);
    };

    const handleDelete = (emailToRemove) => () => {
        setDataGathering((prev) => {
            const updated = prev.filter((name) => name !== emailToRemove);
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
                value={dataGathering || []}
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
                {dataGatheringList?.map((name) => (
                    <MenuItem key={name} value={name}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default DataGatheringSelect;
