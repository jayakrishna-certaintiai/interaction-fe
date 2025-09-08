import { Box, Button, Typography } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import FilledButton from "../button/FilledButton";

const styles = {
  newCompanyButtonStyle: {
    textTransform: "capitalize",
    borderRadius: "20px",
    backgroundColor: "#00A398",
    mr: 2,
    "&:hover": {
      backgroundColor: "#00A398",
    },
  },
  iconStyle: { fontSize: "17px", marginRight: "3px" },
};

function CompanyProfileManagement() {
  return (
    <>
      <Box>
        <Typography>User Role Management</Typography>
        <FilledButton btnname={"Create New User Role"} width="180px"/>
      </Box>
    </>
  );
}

export default CompanyProfileManagement;
