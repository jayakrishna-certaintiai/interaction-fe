import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, TableBody, TableCell, TableRow } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../../context/ProjectContext";
import { formattedDate } from "../../utils/helper/FormatDatetime";
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
import CompanyTableCell from "../Common/CompanyTableCell";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "center",
  fontSize: "13px",
  py: 0,
  height: "40px",
};

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
};

function PortfoliosTableBody({ data }) {
  const navigate = useNavigate();
  const { projectFilterState, setProjectFilterState } =
    useContext(ProjectContext);

  const RedirectToProject = async (val) => {
    await postRecentlyViewed(val.portfolioId, "portfolio");

    setProjectFilterState({
      ...projectFilterState,
      portfolioId: [val.portfolioId],
      project: val.name,
    });
    navigate(`/projects`);
  };

  return (
    <>
      <TableBody>
        {data?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell
              onClick={() => RedirectToProject(row)}
              sx={{ ...cellLinkStyle, textAlign: "left" }}
            >
              <span>{row?.name || ""}</span>
            </TableCell>
            <TableCell sx={cellStyle}>{row?.projects || ""}</TableCell>
            <CompanyTableCell id={row?.clientId} name={row?.client} />
            <TableCell sx={cellStyle}>
              {row?.createdOn ? formattedDate(row?.createdOn) : ""}
            </TableCell>
            <TableCell sx={cellStyle}>
              {row?.contactFirstName && row?.contactLastName
                ? row?.contactFirstName + " " + row?.contactLastName
                : ""}
            </TableCell>
            <TableCell sx={cellStyle}>{row?.RnDExpenseCumulative ? "$" : ""}
              {row?.RnDExpenseCumulative || ""}
            </TableCell>
            {/* <TableCell sx={cellStyle}>
              {row?.name && (
                <IconButton>
                  <MoreVertIcon sx={{ color: "#9F9F9F" }} />
                </IconButton>
              )}
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default PortfoliosTableBody;
