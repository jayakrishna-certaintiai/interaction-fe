import { TableCell } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
import { CaseContext } from "../../context/CaseContext";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
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

const CasesTableCell = ({ id, name, sCase }) => {
  const navigate = useNavigate();
  const { handleSelectedCase, getCaseById } = React.useContext(CaseContext);

  const handleClick = (e, id) => {

    e.stopPropagation();
    handleSelectedCase(sCase);
    getCaseById(sCase.caseId);
    (async () => {
      await postRecentlyViewed(id, "cases");
      navigate(`/cases/details?caseId=${encodeURIComponent(id)}`);
    })();
  };

  const hasAccess = useHasAccessToFeature("F018", "P000000004");

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

export default React.memo(CasesTableCell);
