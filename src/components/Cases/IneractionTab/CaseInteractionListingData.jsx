
import { TableBody, TableCell, TableRow } from '@mui/material'
import React from 'react';
import ProjectTableCell from '../../Common/ProjectTableCell';
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import NavigationWithId from '../../Common/NavigationWithId';
import FormatDatetime from '../../../utils/helper/FormatDatetime';
import DataProjectTableCell from '../../Common/DataProjectTableCell';

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
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

const iconStyle = { fontSize: "20px", color: "#9F9F9F" };

const CaseInteractionListingData = ({ rowData, handleShowInteractionListing, handleInteractionId, usedfor }) => {
    return (
        <>
            <TableBody>

                {rowData?.map((row) => (
                    <TableRow key={row?.interactionsIdentifier}>
                        <TableCell sx={cellLinkStyle} onClick={() => {
                            handleShowInteractionListing();
                            handleInteractionId(row?.interactionId || "", row?.interactionsIdentifier);
                        }}>{row?.interactionsIdentifier || ""}</TableCell>
                        {usedfor == 'case' && <TableCell sx={cellStyle}>
                            <NavigationWithId route={`/projects/info?projectId=${row.projectId}&tabName=Interactions`}><OpenInNewIcon style={iconStyle} /></NavigationWithId>
                        </TableCell>}
                        <DataProjectTableCell id={row.projectId} name={row?.projectId} tabName={""} />
                        <ProjectTableCell id={row.projectId} name={row?.projectName || ""} />
                        <DataProjectTableCell id={row.projectId} name={row?.projectCode} tabName={""} />
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
                        {/* <TableCell sx={cellStyle}>{FormatDatetime(row?.lastUpdated) || ""}</TableCell> */}
                        <TableCell sx={{ ...cellStyle, textAlign: 'left' }}>{row?.spocEmail}</TableCell>
                        <TableCell sx={cellLinkStyle}>
                            {row?.externalLink && <a href={row?.externalLink} target='blank'>Link</a>}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    )
}

export default CaseInteractionListingData