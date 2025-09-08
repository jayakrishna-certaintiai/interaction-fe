import { TableBody, TableCell, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import InputBox from '../Common/InputBox';

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "center",
    py: 1,
    fontSize: "12px",
};

const WagesMapperTableBody = ({ editMode, addWagesFormik, wagesMapperData = [] }) => {
    let [rows, setRows] = useState([]);

    useEffect(() => {
        if (wagesMapperData) {
            setRows([...wagesMapperData]);
        }
    }, [wagesMapperData])

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
                            {row.column || ""}
                        </TableCell>
                        <TableCell sx={{ ...cellStyle, px: "0" }}>

                            {editMode ? (
                                <InputBox
                                    disabled={!editMode}
                                    formik={addWagesFormik}
                                    name={row?.sheetColumnName}
                                    label=""
                                    value={row.sheetColumn || ""}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[rowIndex] = { ...updatedRows[rowIndex], sheetColumn: e.target.value };
                                        addWagesFormik.setFieldValue('rows', updatedRows);
                                    }}
                                    sx={{ mx: "0" }}
                                />
                            ) : (
                                row.sheetColumnName
                            )}
                        </TableCell>
                        <TableCell sx={cellStyle}>
                            {editMode ? (
                                <input
                                    type="checkbox"
                                    checked={currentRow.active || false}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[rowIndex] = { ...updatedRows[rowIndex], active: e.target.checked };
                                        setRows(updatedRows);
                                        addWagesFormik.setFieldValue('rows', updatedRows);
                                    }}
                                />
                            ) : currentRow.active ? 'Yes' : 'No'}
                        </TableCell>
                    </TableRow>
                );
            })}
        </TableBody>
    );
};

export default WagesMapperTableBody;
