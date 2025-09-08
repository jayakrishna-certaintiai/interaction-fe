import { TableCell } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
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

const ReconciliationTableCell = ({ id, name }) => {
  const navigate = useNavigate();

  const handleClick = (e, id) => {
    e.stopPropagation();

    navigate(`/workbench/details?workbenchId=${encodeURIComponent(id)}`);
  };

  const hasAccess = useHasAccessToFeature("F030", "P000000004");

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
    </TableCell>
  );
};

export default React.memo(ReconciliationTableCell);
