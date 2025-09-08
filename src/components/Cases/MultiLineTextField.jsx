import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


const MultiLineTextField = ({ onChange, value }) => {
    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off">
            <TextField
                id="outlined-multiline-static"
                multiline
                rows={4}
                value={value}
                onChange={onChange}
                width="100%"
                sx={{ backgroundColor: "#29B1A81A", color: "black" }}
                disabled={true}
                InputProps={{
                    style: {
                        color: "black", // Text color
                    },
                }}
                InputLabelProps={{
                    style: {
                        color: "black", // Label color (if needed)
                    },
                }}
            />
        </Box>
    )
}

export default MultiLineTextField
