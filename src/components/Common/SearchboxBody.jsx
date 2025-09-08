import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CaseContext } from "../../context/CaseContext";

const styles = {
  containerBox: {
    maxHeight: "800px", // Adjust as needed for your layout
    overflowY: "auto",
    border: "1px solid #E4E4E4", // Optional: Add some styling to the container
    scrollbarWidth: "none", // For Firefox
    msOverflowStyle: "none", // For Internet Explorer and Edge
    '&::-webkit-scrollbar': {
      display: 'none', // For Chrome, Safari, and Opera
    },
  },
  itemBox: (isSelected) => ({
    display: "flex",
    flexDirection: "column",
    padding: "8px",
    backgroundColor: isSelected ? "rgba(0, 163, 152, 0.1)" : "white",
    borderBottom: "1px solid #E4E4E4",
    cursor: "pointer",
  }),
  projectTypography: {
    fontWeight: 600,
    fontSize: "15px",
  },
  detailBox: {
    justifyContent: "space-between",
    display: "flex",
  },
  detailText: {
    fontSize: "15px",
  },
};

function SearchboxBody({ data, fieldMapping, onItemSelected, page }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleSelectedCase } = React.useContext(CaseContext);
  const specificId = useMemo(() => searchParams.get(page + "Id"), [searchParams, page]);

  const itemRefs = useRef([]); // Use ref to track list items

  const handleSelect = (index) => {
    const idKey =
      page === "workbench"
        ? "reconcileId"
        : page === "activity"
        ? "interactionID"
        : page === "cases"
        ? "caseId"
        : `${page}Id`;
    const selectedId = data?.[index]?.[idKey];
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(page + "Id", selectedId);
    navigate(`?${newSearchParams.toString()}`, { replace: true });
    setSelectedIndex(index);
    const sCase = data.filter((item, i) => i === index);
    handleSelectedCase(sCase[0]);
  };

  const initialIndex = useMemo(() => {
    if (!data || data.length === 0) return -1;
    const idKey =
      page === "workbench"
        ? "reconcileId"
        : page === "activity"
        ? "interactionID"
        : page === "cases"
        ? "caseId"
        : `${page}Id`;
    if (specificId) {
      return data.findIndex((item) => item?.[idKey] === specificId);
    }
    return 0;
  }, [data, specificId, page]);

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (data && data.length > 0) {
      if (specificId) {
        const idKey =
          page === "workbench"
            ? "reconcileId"
            : page === "activity"
            ? "interactionID"
            : page === "cases"
            ? "caseId"
            : `${page}Id`;
        const newIndex = data.findIndex((item) => item[idKey] === specificId);
        setSelectedIndex(newIndex >= 0 ? newIndex : 0);
      } else {
        setSelectedIndex(0);
      }
    }
  }, [data, specificId, page]);

  useEffect(() => {
    if (data && data.length > 0 && selectedIndex >= 0 && onItemSelected) {
      onItemSelected(data[selectedIndex]);
    }
  }, [selectedIndex, data, onItemSelected]);

  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "start", // Positions the selected item at the top of the container
      });
    }
  }, [selectedIndex]);

  // Prevent scroll event from bubbling up
  const handleContainerScroll = (event) => {
    event.stopPropagation();
  };

  return (
    <Box sx={styles.containerBox} onScroll={handleContainerScroll}>
      {data?.map((item, index) => (
        <Box
          ref={(el) => (itemRefs.current[index] = el)} // Attach ref to each list item
          sx={styles.itemBox(selectedIndex === index)}
          key={index}
          onClick={() => handleSelect(index)}
        >
          <Box sx={styles.detailBox}>
            {fieldMapping?.Field1 && (
              <span style={styles.projectTypography}>
                {typeof item?.[fieldMapping?.Field1] === "string"
                  ? item[fieldMapping.Field1].substring(0, 15) +
                    (page === "workbench" || page === "cases"
                      ? ""
                      : item?.lastName && page !== "timesheet"
                      ? " " + item.lastName
                      : "")
                  : ""}
              </span>
            )}
            {!(page === "project") && fieldMapping?.Field2 && (
              <span style={styles.detailText}>
                {typeof item?.[fieldMapping?.Field2] === "string"
                  ? item[fieldMapping.Field2] +
                    (page === "workbench" ? " hours" : "")
                  : ""}
              </span>
            )}
            {page === "project" && <span style={styles.detailText}>{""}</span>}
            {!fieldMapping?.Field2 && (
              <span style={styles.detailText}>
                {item?.month && item?.year
                  ? typeof item.month === "string"
                    ? item.month.substring(0, 3) + " " + item.year
                    : ""
                  : ""}
              </span>
            )}
          </Box>
          {fieldMapping?.Field3 && (
            <Typography sx={styles.detailText}>
              {typeof item?.[fieldMapping?.Field3] === "string"
                ? item[fieldMapping.Field3]
                : ""}
            </Typography>
          )}
          <Typography sx={styles.detailText}>
            {typeof item?.[fieldMapping?.Field0] === "string"
              ? item[fieldMapping.Field0]
              : ""}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default SearchboxBody;