import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";

const headerCellStyle = {
  fontSize: "13px",
  borderRight: "1px solid #ddd",
  whiteSpace: "nowrap",
  py: 0.5,
  textAlign: "left",
};

const headerRowStyle = {
  backgroundColor: "rgba(64, 64, 64, 0.1)",
};

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "left",
  fontSize: "13px",
  py: 0.5,
  height: "30px",
};

const tableContainerStyle = {
  borderRadius: "20px",
  overflow: "auto",
  border: "1px solid #ddd",
  mt: 2,
};

const spanStyle = {
  color: "#00A398",
  cursor: "pointer",
  textDecoration: "underline",
  fontSize: "13px",
};

function PastRevisions({ columns, data }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const rows = Array.from({ length: 10 }, (_, index) => data?.[index] || null);

  return (
    <Box sx={{ px: 1.5, borderTop: "1px solid #E4E4E4" }}>
      <Box sx={tableContainerStyle}>
        <Table>
          <TableHead>
            <TableRow sx={headerRowStyle}>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  sx={{
                    ...headerCellStyle,
                    ...(index === 0 && { borderTopLeftRadius: "20px" }),
                    ...(index === columns.length - 1 && {
                      borderTopRightRadius: "20px",
                      borderRight: "none",
                    }),
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={cellStyle}>{item?.timestamp || ""}</TableCell>
                <TableCell sx={cellStyle}>{item?.modifiedBy || ""}</TableCell>
                <TableCell sx={cellStyle}>{item?.rndHours || ""}</TableCell>
                <TableCell
                  sx={{
                    ...cellStyle,
                    borderRight: "none",
                    whiteSpace: showFullDescription ? "normal" : "nowrap",
                  }}
                >
                  {item?.taskDescription ? (
                    <>
                      {showFullDescription ? (
                        <>
                          {item.taskDescription}
                          <span
                            style={spanStyle}
                            onClick={() => setShowFullDescription(false)}
                          >
                            {" "}
                            ...read less
                          </span>
                        </>
                      ) : (
                        <>
                          {item.taskDescription.substring(0, 15)}
                          {item.taskDescription.length > 15 && (
                            <span
                              style={spanStyle}
                              onClick={() => setShowFullDescription(true)}
                            >
                              {" "}
                              ...read more
                            </span>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

export default PastRevisions;
