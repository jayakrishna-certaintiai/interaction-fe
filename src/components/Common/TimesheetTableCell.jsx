import { TableCell, Tooltip, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
import { TimesheetContext } from "../../context/TimesheetContext";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  textAlign: "center",
  fontSize: "13px",
  // py: 1.5,
  py: 1,
  overflowX: "auto",
};

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
  textAlign: "left",
};

const scrollableTextStyle = {
  display: "inline-block",
  maxWidth: "290px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflowX: "hidden",
};

const TimesheetTableCell = ({ id, name }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { getSlectedTimeSheetId } = useContext(TimesheetContext);

  const handleClick = (e, id) => {
    e.stopPropagation();
    getSlectedTimeSheetId(id);
    (async () => {
      await postRecentlyViewed(id, "timesheet");
      navigate(`/timesheets/details?timesheetId=${encodeURIComponent(id)}`);
    })();
  };

  const hasAccess = useHasAccessToFeature("F018", "P000000004");

  const copyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(name || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <TableCell sx={hasAccess ? cellLinkStyle : cellStyle}>
      {hasAccess ? (
        <button
          style={{ all: "unset", cursor: "pointer" }}
          onClick={(e) => handleClick(e, id)}
        >
          {name}
        </button>
      ) : (
        name || ""
      )}
      {/* {hasAccess ? (
        <button
          style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={(e) => handleClick(e, id)}
        >
        
          {name && (
            <Tooltip title={copied ? "Copied!" : "Copy full name"}>
              <IconButton
                size="small"
                aria-label="copy"
                onClick={copyToClipboard}
                sx={{ marginRight: "5px", marginLeft: "-7px" }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
       
          <Tooltip title={name || ""}>
            <span style={scrollableTextStyle}>{name || ""}</span>
          </Tooltip>
        </button>
      ) : (
        <span style={scrollableTextStyle}>{name || ""}</span>
      )} */}
    </TableCell>
  );
};

export default React.memo(TimesheetTableCell);
