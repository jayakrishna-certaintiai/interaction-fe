import { Box, TextField, Typography } from '@mui/material';
import React from 'react';

const styles = {
    textField: {
        fontSize: '0.82rem',
        padding: '2px 0px',
        height: '32px',
        width: '100px',
        borderRadius: '20px',
    },
};

const MinMaxFilter = ({
    minName,
    maxName,
    type,
    minValue,
    maxValue,
    handleFilterChange,
    minPlaceholder,
    maxPlaceholder,
    positiveNumberError,
    field,
}) => {
    return (
        <Box>
            {/* Input Fields */}
            <Box display="flex" gap={3}>
                {/* Min Value Input */}
                <TextField
                    name={minName}
                    type={type}
                    value={minValue || ''} // Ensure value is controlled (fallback to empty string)
                    onChange={(e) =>
                        handleFilterChange({ field, scale: 'min', value: e.target.value })
                    } // Pass the actual value
                    placeholder={minPlaceholder}
                    fullWidth
                    InputProps={{
                        sx: styles.textField,
                    }}
                    InputLabelProps={{
                        style: { width: '100%', marginTop: '-10px' },
                    }}
                    sx={{ padding: '0px' }}
                />

                {/* Max Value Input */}
                <TextField
                    name={maxName}
                    type={type}
                    value={maxValue || ''} // Ensure value is controlled (fallback to empty string)
                    onChange={(e) =>
                        handleFilterChange({ field, scale: 'max', value: e.target.value })
                    } // Pass the actual value
                    placeholder={maxPlaceholder}
                    fullWidth
                    sx={{ marginRight: '10px' }}
                    InputProps={{
                        sx: styles.textField,
                    }}
                />
            </Box>

            {/* Combined Error Message */}
            {positiveNumberError && (
                <Typography
                    sx={{
                        textAlign: 'left',
                        padding: '4px 0',
                        margin: '4px 0 0',
                        fontSize: '0.8rem',
                        color: 'red',
                        width: '100%', // Ensures it spans across the entire container
                    }}
                >
                    {positiveNumberError}
                </Typography>
            )}
        </Box>
    );
};

export default MinMaxFilter;
