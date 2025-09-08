import { IconButton, TableBody, TableCell, TableRow, TextField } from '@mui/material';
import { GridDeleteIcon } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'


const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "center",
    py: 1,
    flex: 1,
    fontSize: "12px",
};

const CCTableBody = ({ editMode, filledRows, getUpdatedMails }) => {
    const [rows, setRows] = useState(filledRows);

    useEffect(() => {
        setRows(filledRows);
    }, [filledRows]);

    const handleUpdateMail = (index, mail) => {
        const newRows = [...rows];
        newRows[index] = mail;
        setRows(newRows);
        getUpdatedMails(newRows);
    }

    return (
        <>
            <TableBody>
                {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell sx={{ width: "30rem", textAlign: "center", flexGrow: 1, borderRight: "1px solid #ddd" }}>
                            {rowIndex + 1}
                        </TableCell>
                        <TableCell sx={{ width: "90rem", textAlign: "center", flexGrow: 1, borderRight: "1px solid #ddd" }}>
                            {editMode ? (
                                <TextField
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                    value={row}
                                    onChange={(e) => {
                                        handleUpdateMail(rowIndex, e.target.value)
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '20px',
                                            margin: 0,
                                            height: '32px',
                                            border: '0.1px solid #E4E4E4',
                                            pl: 1,
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E4E4E4', // Ensures the border color remains the same on hover
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E4E4E4', // Prevents color change when the field is focused
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E4E4E4', // Sets the initial border color
                                            },
                                        },
                                    }}
                                />
                            ) : row}
                        </TableCell>
                        {/* {editMode && (
                            <TableCell sx={{ minWidth: 50, textAlign: "center", flexGrow: 1, borderRight: "1px solid #ddd" }}>
                                <IconButton
                                    onClick={() => {
                                        const newRows = rows.filter((_, index) => index !== rowIndex);
                                        setRows(newRows);
                                        setUpdatedMails(newRows);
                                    }}
                                >
                                    <GridDeleteIcon />
                                </IconButton>
                            </TableCell>
                        )} */}
                    </TableRow>
                ))}
            </TableBody>
        </>
    )
}

export default CCTableBody;