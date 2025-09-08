import { IconButton, TableBody, TableCell, TableRow, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormatDatetime from "../../utils/helper/FormatDatetime";
import CompanyTableCell from "../Common/CompanyTableCell";
import TimesheetTableCell from "../Common/TimesheetTableCell";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "left",
  fontSize: "13px",
  py: 1,
};

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
};
async function downloadTimesheet(originalFileName) {
  function getAccessToken() {
    const tokens = localStorage.getItem('tokens');
    const token_obj = JSON.parse(tokens);
    return token_obj?.accessToken || '';
  }
  try {
    const response = await axios.get(
      `${BaseURL}/api/v1/timesheet/${localStorage.getItem("userid")}/${originalFileName}/download`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        responseType: 'blob',
      }
    );

    if (response.data) {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const blobUrl = window.URL.createObjectURL(blob);
      // const link = timesheet.createElement('a');
      // link.href = blobUrl;
      // link.download = originalFileName;
      // timesheet.body.appendChild(link);
      // link.click();
      // window.URL.revokeObjectURL(blobUrl);
      // link.remove();
    } else {
      console.error('File download failed: No data in response');
    }
  } catch (error) {
    console.error('Error downloading file:', error.message);
  }
}

function TimesheetTableBody({ data }) {

  const [download, setDownload] = useState(false);
  const isDownload = useHasAccessToFeature("F029", "P000000006");
  const handleTimesheetDownload = async (originalFileName) => {
    setDownload(true);
    await downloadTimesheet(originalFileName);
  }
  return (
    <>
      <TableBody>
        {data?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {/* {isDownload ? (
              <TableCell sx={{ ...cellLinkStyle, textAlign: "left" }}>
                {row?.originalFileName && (<Tooltip title={download ? "Downloaded!" : "Download"}><CloudDownloadOutlinedIcon
                  sx={{ cursor: 'pointer', marginBottom: "-6px", width: "0.9em" }}
                  onClick={() => handleTimesheetDownload(row?.blobName)}
                /></Tooltip>
                )}
                <a
                  onClick={() => handleTimesheetDownload(row?.blobName)}
                  style={{ color: "#00A398" }}
                  title={row?.originalFileName}
                >
                </a>
              </TableCell>
            ) : (
              <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
                {row?.originalFileName.length > 30
                  ? `${row?.originalFileName.substring(0, 30)}...`
                  : row?.originalFileName}
              </TableCell>
            )} */}
            <TimesheetTableCell
              name={row?.originalFileName}
              id={row?.timesheetId}

            />
            <TableCell sx={{ ...cellStyle, textAlign: "center" }}>
              {row?.accountingYear ? `FY ${+(row?.accountingYear) - 1}-${row?.accountingYear.slice(-2)}` : ""}
            </TableCell>
            <CompanyTableCell id={row?.companyId} name={row?.companyName} />
            <TableCell sx={cellStyle}>

              {row?.status
                ? row?.status
                  .toLowerCase()
                  .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                  .trim()
                : ""}

            </TableCell>
            <TableCell sx={cellStyle}>
              {FormatDatetime(row?.uploadedOn) || ""}
            </TableCell>
            <TableCell sx={{ ...cellStyle, textAlign: "center" }}>
              <Link>
                <span style={{ color: "#FD5707", cursor: "pointer" }}>{row?.uploadedBy || ""}</span>
              </Link>
            </TableCell>
            <TableCell sx={{ ...cellStyle, textAlign: "right" }}>
              <Link >{row?.totalhours?.toLocaleString('en-US') || ""}</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default TimesheetTableBody;
