import { TableCell, Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";

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

const ContactTableCell = ({ id, name, nameLength = 30 }) => {
  const navigate = useNavigate();

  const handleClick = (id) => {

    (async () => {
      await postRecentlyViewed(id, "employee");
      navigate(`/employees/info?contactId=${id}`);
    })();
  };

  const hasAccess = useHasAccessToFeature("F033", "P000000004");

  return (
    <TableCell sx={hasAccess ? cellLinkStyle : cellStyle}>
      {hasAccess ? (
        <Tooltip
          style={{ all: "unset", cursor: "pointer" }}
          title={name?.length > nameLength ? name : ''}
          onClick={() => handleClick(id)}
        >
          {name?.length > nameLength ? `${name?.substring(0, nameLength)}...` : name}
        </Tooltip>
      ) : (
        name || ""
      )}
    </TableCell>
  );
};

export default React.memo(ContactTableCell);
