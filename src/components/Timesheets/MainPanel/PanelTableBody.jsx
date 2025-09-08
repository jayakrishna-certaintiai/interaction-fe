import { TableBody, TableCell, TableRow, Tooltip } from "@mui/material";
import React from "react";
import FormatDatetime, {
  formattedDateOnly,
} from "../../../utils/helper/FormatDatetime";
import ContactTableCell from "../../Common/ContactTableCell";
import { BorderLeft } from "@mui/icons-material";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  textAlign: "center",
  px: 0.5,
  fontSize: "12px",
};
const currencyCellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  textAlign: "right",
  px: 0.5,
  fontSize: "12px",
};

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
};

function PanelTableBody({ filledRows }) {

  return (
    <>
      <TableBody>
        {filledRows?.map((row, rowIndex) => (
          <TableRow
            key={rowIndex}
            sx={{
              backgroundColor:
                row?.taskClassification === "Uncertain"
                  ? "rgba(253, 87, 7, 0.1)"
                  : "white",
            }}
          >
            <TableCell sx={{ ...cellStyle, color: "#00A398", }}>
              {row?.projectId ? (
                <Tooltip title={row?.projectId?.length > 15 ? row?.projectId : ''}>
                  <span>{row?.projectId?.length > 15 ? `${row?.projectId?.substring(0, 15)}...` : row?.projectCode}</span>
                </Tooltip>
              ) : (
                ""
              )}
            </TableCell>
            <TableCell sx={{ ...cellStyle, color: "#00A398", textAlign: "left" }}>
              {row?.projectId ? (
                <Tooltip title={row?.projectId?.length > 15 ? row?.projectId : ''}>
                  <span>{row?.projectId?.length > 15 ? `${row?.projectId?.substring(0, 15)}...` : row?.projectName}</span>
                </Tooltip>
              ) : (
                ""
              )}
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textTransform: "capitalize",
                textAlign: "left",
              }}
            >
              {row?.taskDescription && row?.taskDescription.length > 20 ? (
                <Tooltip title={row?.taskDescription}>
                  <span>{row?.taskDescription.substring(0, 20)}...</span>
                </Tooltip>
              ) : (
                row?.taskDescription || ""
              )}
            </TableCell>
            <TableCell sx={cellStyle}>
              {formattedDateOnly(row?.taskDate) || ""}
            </TableCell>
            <TableCell sx={{...cellStyle, textAlign: "left"}}>{row?.name}</TableCell>
            {/* <TableCell sx={cellStyle}>
              {row?.taskClassification || ""}
            </TableCell> */}
            <TableCell sx={{ ...currencyCellStyle, color: "#FD5707" }}>
              {row?.taskHourlyRate && (String.fromCharCode(parseInt(row?.symbol, 16)))}
              {row?.taskHourlyRate
                ? parseFloat(row?.taskHourlyRate)?.toFixed(2)
                : ""}
            </TableCell>
            <TableCell sx={cellStyle}>{row?.taskEffort || ""}</TableCell>
            <TableCell sx={{ ...currencyCellStyle, color: "#FD5707" }}>
              {row?.taskTotalExpense && (String.fromCharCode(parseInt(row?.symbol, 16)))}
              {row?.taskTotalExpense
                ? parseFloat(row?.taskTotalExpense)?.toFixed(2)
                : ""}
            </TableCell>
            <TableCell sx={{ ...currencyCellStyle, color: "#FD5707" }}>
              {row?.RnDExpense && (String.fromCharCode(parseInt(row?.symbol, 16)))}
              {row?.RnDExpense ? parseFloat(row?.RnDExpense)?.toFixed(2) : ""}
            </TableCell>
            {/* <TableCell sx={cellStyle}>{row?.createdBy || ""}</TableCell>
            <TableCell sx={cellStyle}>
              {FormatDatetime(row?.createdTime) || ""}
            </TableCell>
            <TableCell sx={cellStyle}>{row?.modifiedBy || ""}</TableCell>
            <TableCell sx={cellStyle}>
              {FormatDatetime(row?.modifiedTime) || ""}
            </TableCell>
            <TableCell sx={{ ...cellStyle, color: "#00A398" }}>{row?.taskId || ""}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default PanelTableBody;
