import { TableBody, TableCell, TableRow } from '@mui/material'
import React from 'react';
import FormatDatetime from '../../../../utils/helper/FormatDatetime';

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    borderLeft: "1px solid #ddd",
    textAlign: "center",
    py: 1,
    fontSize: "12px",
};

const cellLinkStyle = {
    ...cellStyle,
    color: "#00A398",
    textDecoration: "underline",
    cursor: "pointer",
    textAlign: "left"
};

const InteractionModalTableBody = ({ rowData, getSelectedInteractiondetails }) => {
    const handleClick = (interactionId) => {
        getSelectedInteractiondetails(interactionId, true);
    }
    return (
        <>
            <TableBody>
                {rowData?.map((row) => (
                    <TableRow key={row?.interactionsIdentifier}>
                        <TableCell sx={cellLinkStyle} onClick={() => handleClick(row.interactionId)}>
                            {row?.interactionsIdentifier || ""}
                        </TableCell>
                        <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
                            {row?.status
                                ? row?.status
                                    .toLowerCase()
                                    .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                                    .trim()
                                : ""}
                        </TableCell>
                        <TableCell sx={cellStyle}>{FormatDatetime(row?.sentDate) || ""}</TableCell>
                        <TableCell sx={cellStyle}>{FormatDatetime(row?.responseDate) || ""}</TableCell>
                        <TableCell sx={{ ...cellStyle, textAlign: 'left' }}>{row?.spocEmail}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    )
}

export default InteractionModalTableBody;