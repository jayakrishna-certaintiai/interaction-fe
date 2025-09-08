
import { TableBody, TableCell, TableRow } from '@mui/material'
import React from 'react';
import SummaryHistoryList from '../TechnicalSummaryTab/SummaryHistoryList';
import NavigationWithId from '../../Common/NavigationWithId';
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ProjectTableCell from '../../Common/ProjectTableCell';
import { Link } from "react-router-dom";
import FormatDatetime from '../../../utils/helper/FormatDatetime';
import DataProjectTableCell from '../../Common/DataProjectTableCell';

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "center",
    py: 1.2,
    fontSize: "12px",
};

const cellLinkStyle = {
    ...cellStyle,
    color: "#00A398",
    textDecoration: "underline",
    cursor: "pointer",
    textAlign: "center"
};

const iconStyle = { fontSize: "20px", color: "#9F9F9F" };

const CaseSummaryListing = ({ rowData, handleShowSummaryListing, getTechnicalSummaryId, usedfor }) => {
    return (
        <>
            <TableBody>
                {rowData?.map((row, index) => (
                    <TableRow key={row?.TechnicalSummaryId}>
                        <TableCell sx={cellLinkStyle} onClick={() => {
                            handleShowSummaryListing();
                            getTechnicalSummaryId(row?.TechnicalSummaryId || "");
                        }}>{row?.TechnicalSummaryIdentifier || ""}
                        </TableCell>
                        {usedfor == 'case' && <TableCell sx={cellStyle}>
                            <NavigationWithId route={`/projects/info?projectId=${row?.projectId}&tabName=Technical Summary`}>
                                <OpenInNewIcon sx={iconStyle} />
                            </NavigationWithId>
                        </TableCell>}
                        <DataProjectTableCell
                            id={row?.projectId}
                            name={`${row?.projectId}`}
                        />
                        <ProjectTableCell
                            id={row?.projectId}
                            name={`${row?.ProjectName}`}
                        />
                        <DataProjectTableCell
                            id={row?.projectId}
                            name={`${row?.projectCode}`}
                        />
                        <TableCell sx={cellStyle}>

                            {row?.Status
                                ? row?.Status
                                    .toLowerCase()
                                    .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                                    .trim()
                                : ""}
                        </TableCell>

                        <TableCell sx={cellStyle}>{FormatDatetime(row?.GeneratedOn) || ""}</TableCell>
                        <TableCell sx={cellStyle}>{row?.GeneratedBy}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    )
}

export default CaseSummaryListing