import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import {
  Box,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl.jsx";
import { getDateWithTime } from "../../utils/helper/UpdateTimeDifference.jsx";
import NavigationWithId from "../Common/NavigationWithId.jsx";
import OpenIconButton from "../button/OpenIconButton.jsx";
import { Link } from "react-router-dom";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "left",
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

const iconStyle = { color: "#FD5707", fontSize: "23px" };

function ActivityTabTableBody({ data, tab }) {
  const [starredInteractions, setStarredInteractions] = useState(new Set());

  useEffect(() => {
    const initialStarredInteractions = new Set();
    data?.forEach((row) => {
      if (row?.isStarred === 1) {
        initialStarredInteractions.add(row?.interactionID);
      }
    });
    setStarredInteractions(initialStarredInteractions);
  }, [data]);

  const handleStarClick = async (
    interactionID,
    companyId,
    isCurrentlyStarred
  ) => {
    const newStarredStatus = !isCurrentlyStarred;
    const apiUrl = `${BaseURL}/api/v1/interactions/${localStorage.getItem(
      "userid"
    )}/${companyId}/${interactionID}`;

    try {
      await axios.put(apiUrl, {
        IsStarred: newStarredStatus ? 1 : 0,
      });

      setStarredInteractions((prev) => {
        const updated = new Set(prev);
        if (newStarredStatus) {
          updated.add(interactionID);
        } else {
          updated.delete(interactionID);
        }
        return updated;
      });
    } catch (error) {
      console.error("Failed to update starred status:", error);
    }
  };

  return (
    <>
      <TableBody>
        {data?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell sx={cellStyle}>
              {row?.interactionID && (
                <IconButton
                  onClick={() =>
                    handleStarClick(
                      row?.interactionID,
                      row?.companyId,
                      starredInteractions.has(row?.interactionID)
                    )
                  }
                >
                  {starredInteractions?.has(row?.interactionID) ? (
                    <StarIcon sx={iconStyle} />
                  ) : (
                    <StarOutlineIcon sx={iconStyle} />
                  )}
                </IconButton>
              )}
            </TableCell>
            <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
              {(row?.interactionID && getDateWithTime(row?.interactionTime)) ||
                ""}
            </TableCell>
            <TableCell
              sx={{
                ...cellLinkStyle,
                textAlign: "left",
              }}
            >
              <NavigationWithId
                route={`/activity/info?activityId=${encodeURIComponent(
                  row?.interactionID
                )}`}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {row?.EmailSent === 0 && (
                    <Typography
                      sx={{
                        color: "white",
                        backgroundColor: "#00A398",
                        width: "30px",
                        textAlign: "center",
                        borderRadius: "10px",
                        fontSize: "10px",
                        mr: "5px",
                      }}
                    >
                      New
                    </Typography>
                  )}
                  <span style={{ color: "#00A398" }}>
                    {row?.interactionSubject || ""}
                  </span>
                </Box>
              </NavigationWithId>
            </TableCell>
            {/* <TableCell sx={cellStyle}>
              {row?.interactionID ? (
                <Tooltip title={row?.interactionID}>
                  <span>
                    {row?.interactionID.substring(0, 12)}
                    {row?.interactionID.length > 12 && "..."}
                  </span>
                </Tooltip>
              ) : (
                ""
              )}
            </TableCell> */}
            <TableCell sx={cellStyle}>
              {row?.interactionActivityType || ""}
            </TableCell>
            <TableCell sx={cellStyle}>
              <Link>
                {row?.status
                  ? row?.status
                    .toLowerCase()
                    .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                    .trim()
                  : ""}
              </Link>
            </TableCell>
            <TableCell sx={cellStyle}>{row?.relatedTo || ""}</TableCell>
            {/* <TableCell sx={cellLinkStyle}>{row?.relationId || ""}</TableCell> */}
            <TableCell sx={{ ...cellLinkStyle, textAlign: "left" }}>
              {row?.interactionTo &&
                JSON.parse(row?.interactionTo?.replace(/'/g, '"'))?.join(" ")}
            </TableCell>
            <TableCell sx={{ ...cellLinkStyle, textAlign: "left" }}>
              {row?.interactionFrom || ""}
            </TableCell>
            <TableCell align="center" sx={cellLinkStyle}>
              <NavigationWithId
                route={`/activity/info?activityId=${encodeURIComponent(
                  row?.interactionID
                )}`}
              >
                {row?.interactionID && <OpenIconButton />}
              </NavigationWithId>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default ActivityTabTableBody;
