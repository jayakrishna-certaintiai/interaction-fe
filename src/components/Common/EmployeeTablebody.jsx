import { TableBody, TableCell, TableRow } from '@mui/material'
import React, { useEffect } from 'react'
import FormatDatetime from '../../utils/helper/FormatDatetime'
import CompanyTableCell from './CompanyTableCell'
import { Link } from "react-router-dom";

const styles = {
    cellStyle: {
        whiteSpace: "nowrap",
        borderRight: "1px solid #ddd",
        textAlign: "left",
        fontSize: "13px",
        py: 1.5,
    }
}

const EmployeeTableBody = ({ data, page }) => {
    return (
        <>
            <TableBody>
                {data?.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell sx={{ ...styles.cellStyle, color: "#00A398", textAlign: "center" }}>{row?.sheetId}</TableCell>
                        <TableCell sx={{ ...styles.cellStyle, color: "#00A398" }}>{row?.sheetName}</TableCell>
                        <CompanyTableCell id={row?.companyId} name={row?.companyName} />
                        <TableCell sx={{ ...styles.cellStyle }}> {row?.sheetType
                            ? row?.sheetType
                                .toLowerCase()
                                .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                                .trim()
                            : ""}</TableCell>
                        <TableCell sx={{ ...styles.cellStyle, color: "#FD5707" }}>{row?.uploadedBy}</TableCell>
                        <TableCell sx={{ ...styles.cellStyle }}>{FormatDatetime(row?.uploadedOn) || ""}</TableCell>
                        <TableCell sx={{ ...styles.cellStyle, color: "#FD5707" }}>
                            {row?.status
                                ? row?.status
                                    .toLowerCase()
                                    .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                                    .trim()
                                : ""}
                        </TableCell>
                        <TableCell sx={{ ...styles.cellStyle }}>{row?.notes}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    )
}

export default EmployeeTableBody