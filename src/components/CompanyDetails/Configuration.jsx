import { Box } from "@mui/material";
import React from "react";
import UpdationDetails from "../Common/UpdationDetails";

function Configuration() {
  return (
    <>
      <Box
        sx={{
          borderTop: "1px solid #E4E4E4",
          p: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <UpdationDetails />
      </Box>
    </>
  );
}

export default Configuration;
