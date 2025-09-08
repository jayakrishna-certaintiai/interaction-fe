import { Box, TextField, Typography } from '@mui/material';
import React from 'react';

const styles = {
    textField: {
        fontSize: '0.82rem',
        padding: '2px 0px',
        height: '32px',
        width: '120px',
        borderRadius: '20px',
    },
};

const DateFilterComponent = ({
    sentStartDate,
    sentEndDate,
    handleDateChange,
    startLabel,
    endLabel,
    dateError,
}) => {
    return (
        <Box>
            {/* Date fields */}
            <Box display="flex" gap={3}>
                <TextField
                    type="date"
                    label="start date"
                    value={sentStartDate || ''}
                    onChange={handleDateChange(startLabel, 'min')}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        sx: styles.textField,
                    }}
                    error={!!dateError} // Indicate error in the start date field
                />
                <TextField
                    type="date"
                    label="end date"
                    value={sentEndDate || ''}
                    onChange={handleDateChange(endLabel, 'max')}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        sx: styles.textField,
                    }}
                    error={!!dateError} // Indicate error in the end date field
                />
            </Box>

            {/* Shared error message */}
            {dateError && (
                <Typography
                    variant="body2"
                    color="error"
                    sx={{
                        marginTop: '8px', // Space between the error message and the inputs
                        textAlign: 'left', // Align the error message to the left
                        width: '100%', // Ensure it spans the full width of both inputs
                    }}
                >
                    {dateError}
                </Typography>
            )}
        </Box>
    );
};

export default DateFilterComponent;
