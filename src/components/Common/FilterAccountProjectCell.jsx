
import { TableCell } from "@mui/material";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
import { ClientContext } from "../../context/ClientContext";
import { ProjectContext } from "../../context/ProjectContext";

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

const FilterAccountProjectCell = ({ id, name, sCase }) => {
    const navigate = useNavigate();
    const { handleSelectedItem, fetchCompanyDetails } = React.useContext(ClientContext);
    const { fetchProjects } = React.useContext(ProjectContext);
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get("companyId");

    const handleClick = (e, id, sCase) => {
        e.stopPropagation();
        fetchProjects(sCase, id);
        navigate(`/projects?companyId=${id}`);
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

export default React.memo(FilterAccountProjectCell);
