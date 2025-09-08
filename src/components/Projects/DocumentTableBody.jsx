import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TableBody, TableRow, TableCell, Tooltip } from "@mui/material";
import { formattedDate } from "../../utils/helper/FormatDatetime";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  textAlign: "center",
  py: 2,
  fontSize: "12px",
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
function DocumentTableBody({ filledRows, data }) {
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
  const rows =
    filledRows?.length > 10
      ? filledRows
      : Array.from({ length: 10 }, (_, index) => filledRows?.[index] || null);

  return (
    <>
      <TableBody>
        {rows?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {/* <TableCell sx={cellStyle}>
              {getType(row?.documentName) &&
                iconMapping[getType(row?.documentName)?.toLowerCase()]}
            </TableCell> */}
            {/* <TableCell sx={{ ...cellLinkStyle, textAlign: "left" }}> */}
            {/* <a
                href={row?.documentPath}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00A398" }}
              > */}
            {/* {row?.documentName || ""} */}
            {/* </a> */}
            {/* </TableCell> */}
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
                    {row?.documentName?.length > 100
                      ? `${row?.documentName.substring(0, 100)}...`
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
                {row?.documentName.length > 100
                  ? `${row?.documentName.substring(0, 100)}...`
                  : row?.documentName}
                {/* {row?.documentName || ""} */}
              </TableCell>
            )}
            <TableCell sx={{ ...cellStyle }}>{row?.documentType || ""}</TableCell>
            {/* <TableCell sx={{ ...cellStyle, color: "#FD5707" }}>{row?.aistatus || ""}</TableCell> */}
            <TableCell sx={{ ...cellStyle, color: "#FD5707" }}>
              <Link>
                {row?.aistatus
                  ? row?.aistatus
                    .toLowerCase()
                    .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                    .trim()
                  : ""}
              </Link>
            </TableCell>
            <TableCell sx={cellStyle}>
              {row?.createdTime ? formattedDate(row?.createdTime) : ""}
            </TableCell>
            <TableCell sx={{ ...cellStyle, color: "#FD5707" }}>{row?.createdBy || ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default DocumentTableBody;