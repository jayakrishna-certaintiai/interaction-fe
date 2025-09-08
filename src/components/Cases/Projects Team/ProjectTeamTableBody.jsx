import { TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";
import ContactTableCell from "../../Common/ContactTableCell";
import ProjectTableCell from "../../Common/ProjectTableCell";
import { formatCurrency } from "../../../utils/helper/FormatCurrency";
import CompanyTableCell from "../../Common/CompanyTableCell";

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "left",
    py: 1,
    fontSize: "12px",
};

const cellLinkStyle = {
    ...cellStyle,
    color: "#00A398",
    textDecoration: "underline",
    cursor: "pointer",
};

const currencyCellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "right",
    fontSize: "13px",
    py: 1,
    color: "#FD5707",
};

const ProjectTeamTableBody = ({ filledRows, rowsPerPage }) => {
    const rows =
        filledRows?.length > rowsPerPage
            ? filledRows
            : Array.from({ length: rowsPerPage }, (_, index) => filledRows?.[index] || null);

    return (
        <>
        <TableBody>
            {rows?.map((row, rowIndex) =>(
                <TableRow id={rowIndex}>
                    <ContactTableCell id={row?.teamMemberId} name={row?.employeeId} />
                    <ContactTableCell id={row?.teamMemberId} name={row?.firstName || row?.lastName ? row?.firstName + " " + row?.lastName : ""} />
                    <TableCell sx={{ ...cellStyle, textAlign: "left" }} id={row?.teamMemberId} > {row?.employementType || ""} </TableCell>
                    <TableCell sx={{ ...cellStyle, textAlign: "left" }} id={row?.teamMemberId}>{row?.employeeTitle}</TableCell>
                    <CompanyTableCell id={row?.companyId} name={row?.companyName} />
                    <ProjectTableCell id={row?.projectId} name={row?.projectCode} />
                    <ProjectTableCell id={row?.projectId} name={row?.projectName} />
                    <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.totalHours}</TableCell>
                    <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.hourlyRate ? formatCurrency(row?.hourlyRate, "en-US", row?.currency || "USD") : ""}</TableCell>
                    <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.totalCost ? formatCurrency(row?.totalCost, "en-US", row?.currency || "USD") : ""}</TableCell>
                    <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.rndPotential}</TableCell>
                    <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.rndCredits ? formatCurrency(row?.rndCredits, "en-US", row?.currency || "USD") : ""}</TableCell>
                    <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.qreCost ? formatCurrency(row?.qreCost, "en-US", row?.currency || "USD") : ""}</TableCell>
                </TableRow>
            ))}
        </TableBody>
        </>
    );
};

export default ProjectTeamTableBody;