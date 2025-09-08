import React, { useEffect, useState } from 'react';
import { TableBody, TableCell, TableRow, TextField } from '@mui/material';
import { debounce } from 'lodash';

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "center",
  py: 1,
  fontSize: "12px",
};

const validateSheetColumnName = (value) => {
  // const regex = /^[A-Za-z]+[A-Za-z0-9 _-]*$/;
  // if (!value.match(regex)) {
  //   return "Invalid format. Must start with a letter and can only contain letters, numbers, spaces, hyphens, and underscores.";
  // }
  return null;
};

const ProjectsMapperTableBody = ({ editMode, filledRows, onUpdateRows, getUpdateColumns }) => {
  const [rows, setRows] = useState(filledRows);
  const [updateColumns, setUpdateColumns] = useState([]);

  useEffect(() => {
    setRows(filledRows);
  }, [filledRows]);

  useEffect(() => {
    getUpdateColumns(rows);
  }, [updateColumns])

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    if (field === 'sheetColumnName') {
      const error = validateSheetColumnName(value);
      newRows[index].error = error;
    }

    setRows(newRows);
    onUpdateRows(newRows);

    const debounceUpdateColumns = debounce(() => {
      const newColumn = {
        columnName: newRows[index]?.columnName,
        sheetColumnName: newRows[index]?.sheetColumnName,
        status: newRows[index]?.status
      };
      setUpdateColumns(prevUpdateColumns => [...prevUpdateColumns, newColumn]);
    }, 2000); // 1 second delay

    debounceUpdateColumns();
  };

  return (
    <TableBody>
      {rows.map((row, rowIndex) => (
        row.sequence !== -1 && <TableRow key={rowIndex}>
          <TableCell sx={{ ...cellStyle, borderLeft: "1px solid #ddd" }}>
            {row.sequence}
          </TableCell>
          <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
            {row.columnName || ""}
          </TableCell>
          <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
            {editMode ? (
              <TextField
                variant="outlined"
                width="20rem"
                size="small"
                value={row.sheetColumnName}
                onChange={(e) => {
                  handleInputChange(rowIndex, 'sheetColumnName', e.target.value);
                }}
                error={!!row.error}
                helperText={row.error}
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
            ) : (
              row.sheetColumnName
            )}
          </TableCell>
          <TableCell sx={cellStyle}>
            {editMode ? (
              <input
                type="checkbox"
                style={{ accentColor: 'green' }}
                checked={row?.status === "active" || row?.status === "mandatory"}
                disabled={row?.status === "mandatory"}
                onChange={(e) => handleInputChange(rowIndex, 'status', e.target.checked ? "active" : "inactive")}
              />
            ) : row.status === "active" || row?.status === "mandatory" ? 'Yes' : 'No'}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ProjectsMapperTableBody;
