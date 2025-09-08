import { TableCell, Tooltip, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    borderLeft: "1px solid #ddd",
    textAlign: "center",
    fontSize: "13px",
    py: 1.5,
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

const DataProjectTableCell = ({ id, name, tabName = "" }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const handleClick = (e, id) => {
        e.stopPropagation();
        (async () => {
            await postRecentlyViewed(id, "projects");
            navigate(`/projects/info?projectId=${encodeURIComponent(id)}&tabName=${tabName}`);
        })();
    };

    const hasAccess = useHasAccessToFeature("F013", "P000000004");

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
                    style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center" }}
                    onClick={(e) => handleClick(e, id)}
                >
                    {/* Tooltip for copy functionality */}
                    {name && (<Tooltip title={copied ? "Copied!" : "Copy Field"}>
                        {/* <IconButton
                            size="small"
                            aria-label="copy"
                            onClick={copyToClipboard}
                            sx={{ marginRight: "5px", marginLeft: "-7px", color: "rgba(94, 94, 94, 0.5)" }}
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton> */}
                    </Tooltip>
                    )}
                    {/* Project name with scrollable style */}
                    <Tooltip title={name || ""}>
                        <span style={scrollableTextStyle}>{name || ""}</span>
                    </Tooltip>
                </button>
            ) : (
                <span style={scrollableTextStyle}>{name || ""}</span>
            )}
        </TableCell>
    );
};

export default React.memo(DataProjectTableCell);
