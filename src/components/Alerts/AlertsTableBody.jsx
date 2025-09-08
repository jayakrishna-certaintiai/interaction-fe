import React from "react";
import { TableBody, TableCell, TableRow } from "@mui/material";
import { getDateWithTime } from "../../utils/helper/UpdateTimeDifference";
import OpenIconButton from "../button/OpenIconButton";
import { formattedDate } from "../../utils/helper/FormatDatetime";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "center",
  fontSize: "13px",
  py: 1,
  height: "40px",
};

const timestampCellStyle = {
  ...cellStyle,
  textAlign: "left", // Align timestamp cell to the left
};

function AlertsTableBody({ data }) {
  return (
    <TableBody>
      {data?.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          {row?.modifiedTime ? (
            <TableCell sx={timestampCellStyle}>
              {formattedDate(row?.modifiedTime)}
            </TableCell>
          ) : (
            <TableCell sx={cellStyle} />
          )}
          <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
            {row?.alertDesc || ""}
          </TableCell>
          {/* <TableCell sx={cellStyle}>
            {row?.modifiedTime && <OpenIconButton />}
          </TableCell> */}
        </TableRow>
      ))}
    </TableBody>
  );
}

export default AlertsTableBody;
