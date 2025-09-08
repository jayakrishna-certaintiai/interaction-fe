import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const styles = {
  itemBox: (isSelected) => ({
    display: "flex",
    flexDirection: "column",
    p: 1,
    backgroundColor: isSelected ? "rgba(0, 163, 152, 0.1)" : "white",
    borderBottom: "1px solid #E4E4E4",
    cursor: "pointer",
  }),
  companyTypography: {
    fontWeight: 600,
  },
  detailBox: {
    justifyContent: "space-between",
    display: "flex",
  },
  detailText: {
    fontSize: "13px",
  },
};

function CompanySearchboxBody({ data, fieldMapping, onItemSelected }) {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");

  // Calculate the initial index with useMemo
  const initialIndex = useMemo(() => {
    return data?.findIndex((item) => item?.companyId === companyId) ?? 0;
  }, [data, companyId]);

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [initialIndex]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    if (data && data?.length > 0 && selectedIndex >= 0 && onItemSelected) {
      onItemSelected(data[selectedIndex]);
    }
  }, [selectedIndex, onItemSelected, data]);

  return (
    <>
      {data?.map((item, index) => (
        <Box
          sx={styles.itemBox(selectedIndex === index)}
          key={index}
          onClick={() => handleSelect(index)}
        >
          <Typography sx={styles.companyTypography}>
            {item[fieldMapping.Field0] || ""}
          </Typography>
          <Box sx={styles.detailBox}>
            <span style={styles.detailText}>
              {item[fieldMapping.Field1] || ""}
            </span>
            <span style={styles.detailText}>
              {item[fieldMapping.Field2] || ""}
            </span>
          </Box>
        </Box>
      ))}
    </>
  );
}

export default CompanySearchboxBody;
