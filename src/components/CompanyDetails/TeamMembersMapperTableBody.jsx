import React, { useEffect, useState } from 'react';
import { TableBody, TableCell, TableRow } from '@mui/material';
import InputBox from '../Common/InputBox';
import { BorderRight } from '@mui/icons-material';

const cellStyle = {
    whiteSpace: "nowrap",
    BorderRight: "1px solid #ddd",
    textAlign: "center",
    py: 1,
    fontSize: "12px",
}

const TeamMembersMapperTableBody = ({ editMode, addTeamsFormik, teamsMapperdata = [] }) => {
    let [rows, setRows] = useState([]);

    useEffect(() => {
        if (teamsMapperdata) {
            setRows([...teamsMapperdata]);
        }
    }, [teamsMapperdata]);
    return (
        <TableBody>
            {rows?.map((row, rowIndex) => {
                const currentRow = rows && rows[rowIndex] || {};

                return (
                    <TableRow key={rowIndex}>
                        <TableCell sx={{ ...cellStyle, borderLeft: "1px solid #ddd" }}>
                            {rowIndex + 1}
                        </TableCell>
                        <TableCell sx={cellStyle}>
                            {row?.column || ""}
                        </TableCell>
                        <TableCell sx={{ ...cellStyle, px: "0" }}>
                            {editMode ? (
                                <InputBox
                                    disabled={!editMode}
                                    formik={addTeamsFormik}
                                    name={row?.sheetcolumnName}
                                    label=""
                                    value={row.sheetcolumn || ""}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[rowIndex] = { ...updatedRows[rowIndex], sheetcolumn: e.target.value };
                                        addTeamsFormik.setFieldValue('row', updatedRows);
                                    }}
                                    sx={{ mt: "0px" }}
                                />
                            ) : (
                                row.sheetcolumnName
                            )}
                        </TableCell>
                        <TableCell sx={cellStyle}>
                            {editMode ? (
                                <input
                                    type="checkbox"
                                    checked={currentRow.active || false}
                                    onChange={(e) => {
                                        const updatedRows = [...rows]
                                        updatedRows[rowIndex] = { ...updatedRows[rowIndex], active: e.target.checked }

                                    }}
                                />
                            ) : currentRow.active ? 'Yes' : 'No'}
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
    )
}

export default TeamMembersMapperTableBody
