
import { TableBody, TableCell, TableRow, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { formattedDate } from "../../utils/helper/FormatDatetime";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { BaseURL } from "../../constants/Baseurl";
import { Link } from "react-router-dom";
import axios from "axios";
import { Authorization_header } from "../../utils/helper/Constant";
import CompanyTableCell from "../Common/CompanyTableCell";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  textAlign: "center",
  fontSize: "13px",
  py: 0,
  height: "40px",
  overflowX: "auto",
};

const cellStyle1 = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "center",
  fontSize: "13px",
  py: 0,
  height: "40px",
  color: "#FD5707"
};
const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
};
async function downloadDocument(documentName) {
  function getAccessToken() {
    const tokens = localStorage.getItem('tokens');
    const token_obj = JSON.parse(tokens);
    return token_obj?.accessToken || '';
  }
  try {
    const response = await axios.get(
      `${BaseURL}/api/v1/documents/${localStorage.getItem("userid")}/${documentName}/download`,
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
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      link.remove();
    } else {
      console.error('File download failed: No data in response');
    }
  } catch (error) {
    console.error('Error downloading file:', error.message);
  }
}
function DocumentsTableBody({ data }) {
  const [newData, setNewData] = useState(null)
  const [download, setDownload] = useState(false);
  const isDownload = useHasAccessToFeature("F029", "P000000006");
  const handleDocumentDownload = async (documentName) => {
    setDownload(true);
    await downloadDocument(documentName);
  }

  useEffect(() => {
    if (data && data.length) {
      setNewData([...data, { documentName: "some random and long document name", rd_score: 5.6963, status: "completed", relatedTo: "Account", modifiedTime: "2024-07-25T07:33:40.000Z", modifiedBy: "Ananthakrishnan Velusamy" }]);
    }
  }, [data])
  return (
    <>
      <TableBody>
        {data?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {isDownload ? (
              <TableCell sx={{ ...cellLinkStyle, textAlign: "left" }}>
                {row?.documentName && (<Tooltip title={download ? "Downloaded!" : "Download"}><CloudDownloadOutlinedIcon
                  sx={{ cursor: 'pointer', marginRight: '8px', marginBottom: "-6px" }}
                  onClick={() => handleDocumentDownload(row?.blobName)}
                /></Tooltip>
                )}
                <a
                  onClick={() => handleDocumentDownload(row?.blobName)}
                  style={{ color: "#00A398" }}
                  title={row?.documentName}
                >
                  <span>
                    {row?.documentName?.length > 30
                      ? `${row?.documentName.substring(0, 30)}...`
                      : row?.documentName}
                  </span>
                  {/* <span
                    style={scrollableTextStyle}
                  >
                    {row?.documentName || ""}
                  </span> */}
                </a>
              </TableCell>
            ) : (
              <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
                {row?.documentName.length > 30
                  ? `${row?.documentName.substring(0, 30)}...`
                  : row?.documentName}
                {/* {row?.documentName || ""} */}
              </TableCell>
            )}
            <CompanyTableCell id={row?.companyId} name={row?.companyName} />
            <TableCell sx={cellStyle}>{row?.documentType || ""}</TableCell>
            <TableCell sx={{ ...cellStyle, color: "#FD5707" }}>
              { !isNaN(+row?.rd_score ) && (+row?.rd_score)?.toFixed(2)?.toLocaleString('en-US') || ""}
            </TableCell>
            <TableCell sx={cellStyle}>
              <Link>
                {row?.aistatus
                  ? row?.aistatus
                    .toLowerCase()
                    .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                    .trim()
                  : ""}
              </Link>
            </TableCell>
            <TableCell sx={{ ...cellStyle, color: "#FD5707" }}>
              {row?.projectName || ""}
            </TableCell>
            <TableCell sx={cellStyle}>
              {row?.createdTime ? formattedDate(row?.createdTime) : ""}
            </TableCell>
            <TableCell sx={cellStyle1}>
              {row?.createdBy ? row?.createdBy : ""}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default DocumentsTableBody;
