import React, { useState } from "react";
import { Box, InputBase, InputLabel } from "@mui/material";

const styles = {
  label: {
    fontWeight: 500,
    color: "#404040",
    fontSize: "13px",
    mb: "3px",
  },
  option: {
    fontSize: "13px",
    border: "1px solid #c4c4c4",
    borderRadius: "20px",
    px: 1.5,
  },
};

function ContactSelector({ contact, setContact }) {
  const [inputValue, setInputValue] = useState(contact);

  const handleInputChange = (event) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
    setContact(newInputValue);
  };

  return (
    <Box>
      <InputLabel sx={styles.label}>Sent To</InputLabel>
      <InputBase
        placeholder="Select Contact"
        value={inputValue}
        onChange={handleInputChange}
        fullWidth
        sx={styles.option}
      />
    </Box>
  );
}

export default ContactSelector;
