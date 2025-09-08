import React from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const OpenIconButton = () => {
  return (
    <OpenInNewIcon
      sx={{
        ml: 1,
        fontSize: "18px",
        color: "#9F9F9F",
        cursor: "pointer",
        "&:hover": { color: "#FD5707" },
      }}
    />
  );
};

export default OpenIconButton;
