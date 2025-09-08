// import { TableCell, Tooltip, IconButton } from "@mui/material";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import React, { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
// import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
// import { ClientContext } from "../../context/ClientContext";

// const cellStyle = {
//   whiteSpace: "nowrap",
//   borderRight: "1px solid #ddd",
//   borderLeft: "1px solid #ddd",
//   textAlign: "center",
//   fontSize: "13px",
//   py: 2,
//   overflowX: "auto",
//   // maxWidth: "10%",
// };

// const cellLinkStyle = {
//   ...cellStyle,
//   color: "#00A398",
//   textDecoration: "underline",
//   cursor: "pointer",
//   textAlign: "left",
// };
// const scrollableTextStyle = {
//   display: "inline-block",
//   maxWidth: "290px",
//   whiteSpace: "nowrap",
//   textOverflow: "ellipsis",
//   overflowX: "hidden",
// };

// const CompanyTableCell = ({ id, name, sCase }) => {
//   const navigate = useNavigate();
//   const [copied, setCopied] = useState(false);
//   const { handleSelectedItem, fetchCompanyDetails } = React.useContext(ClientContext);
//   const [searchParams] = useSearchParams();
//   const companyId = searchParams.get("companyId");

//   const handleClick = (e, id) => {
//     e.stopPropagation();
//     handleSelectedItem(sCase);
//     fetchCompanyDetails(sCase.companyId);
//     (async () => {
//       await postRecentlyViewed(id, "company");
//       navigate(`/accounts/info?companyId=${encodeURIComponent(id)}`);
//     })();
//   };

//   const hasAccess = useHasAccessToFeature("F005", "P000000004");

//   const copyToClipboard = (e) => {
//     e.stopPropagation();
//     navigator.clipboard.writeText(name || "").then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   return (
//     <TableCell sx={hasAccess ? cellLinkStyle : cellStyle}>
//       {/* {hasAccess ? (
//         <button
//           style={{ all: "unset", cursor: "pointer" }}
//           onClick={(e) => handleClick(e, id, sCase)}
//         >
//           {name}
//         </button>
//       ) : (
//         name || ""
//       )} */}
//       {hasAccess ? (
//         <button
//           style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center" }}
//           onClick={(e) => handleClick(e, id)}
//         >
//           {/* Tooltip for copy functionality */}
//           <Tooltip title={copied ? "Copied!" : "Copy full name"}>
//             {/* <IconButton
//               size="small"
//               aria-label="copy"
//               onClick={copyToClipboard}
//               sx={{ marginRight: "5px", marginLeft: "-7px" }}
//             >
//               <ContentCopyIcon fontSize="small" />
//             </IconButton> */}
//           </Tooltip>
//           {/* Project name with scrollable style */}
//           <Tooltip title={name || ""}>
//             <span style={scrollableTextStyle}>{name || ""}</span>
//           </Tooltip>
//         </button>
//       ) : (
//         <span style={scrollableTextStyle}>{name || ""}</span>
//       )}
//     </TableCell>
//   );
// };

// export default React.memo(CompanyTableCell);

import { TableCell } from "@mui/material";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
import { ClientContext } from "../../context/ClientContext";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  borderTop: "1px solid #ddd",
  textAlign: "center",
  fontSize: "13px",
  py: 1,
};

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
  textAlign: "left",
};

const CompanyTableCell = ({ id, name, sCase }) => {
  const navigate = useNavigate();
  const { handleSelectedItem, fetchCompanyDetails } = React.useContext(ClientContext);
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");

  const handleClick = (e, id, sCase) => {
    e.stopPropagation();
    handleSelectedItem(sCase);
    fetchCompanyDetails(sCase?.companyId);
    (async () => {
      await postRecentlyViewed(id, "company");
      navigate(`/accounts/info?companyId=${encodeURIComponent(id)}`);
    })();
  };

  const hasAccess = useHasAccessToFeature("F005", "P000000004");

  return (
    <TableCell sx={hasAccess ? cellLinkStyle : cellStyle}>
      {hasAccess ? (
        <button
          style={{ all: "unset", cursor: "pointer" }}
          onClick={(e) => handleClick(e, id, sCase)}
        >
          {name}
        </button>
      ) : (
        name || ""
      )}
    </TableCell>
  );
};

export default React.memo(CompanyTableCell);
