import React from "react";
import { useNavigate } from "react-router-dom";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { TableCell } from "@mui/material";

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

const PortfolioTableCell = ({ name }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/portfolios`);
  };

  const hasAccess = useHasAccessToFeature("F032", "P000000003");

  return (
    <TableCell sx={hasAccess ? cellLinkStyle : cellStyle}>
      {hasAccess ? (
        <button
          style={{ all: "unset", cursor: "pointer" }}
          onClick={(e) => handleClick(e)}
        >
          {name}
        </button>
      ) : (
        name || ""
      )}
    </TableCell>
  );
};

export default React.memo(PortfolioTableCell);
