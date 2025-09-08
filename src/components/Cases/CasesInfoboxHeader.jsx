import React, { useContext } from "react";
import { Typography, Box } from "@mui/material";
// import ConstructionIcon from "@mui/icons-material/Construction";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import { CaseContext } from "../../context/CaseContext";
import { token_obj } from "../../utils/helper/Constant";

const styles = {
  flexBox: {
    display: "flex",
    justifyContent: "space-between",
    background: "#29B1A8",
    color: "white",
    fontWeight: 700,
    paddingTop: "0.1%",
    borderRadius: "5px",
    marginTop: "0.5%",
    ml: "10px",
    mr: "10px",
    pr: "10px",
  },
  paddingLeftBox: {},
  companyTypography: {
    display: "flex",
    alignItems: "center",
    fontSize: "20px",
    m: "0 8px",
  },
};

function CaseInfoboxHeader({ head }) {
  const { caseData, detailedCase } = useContext(CaseContext);

  const handleFormSubmit = async (formData) => {
    const apiUrl = `${BaseURL}/api/v1/timesheets/001/1/${head}/timesheet-reupload`;
    const data = {
      companyId: 1,
      timesheet: formData.file,
    };

    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token_obj.accessToken}`
        },
      });
    } catch (error) {
      console.error("Error uploading timesheet:", error);
    }
  };

  return (
    <>
      <Box sx={styles.flexBox}>
        <Typography sx={styles.companyTypography}>
          {detailedCase?.caseCode}
        </Typography>
        <Typography sx={{ textDecoration: "underline" }}>
          {detailedCase?.companyName}
        </Typography>
      </Box>
    </>
  );
}

export default CaseInfoboxHeader;
