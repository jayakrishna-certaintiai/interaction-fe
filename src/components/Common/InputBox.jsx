import React from "react";
import { Box, InputBase, InputLabel } from "@mui/material";

function InputBox({
  label,
  disabled = false,
  display,
  name = "",
  formik,
  required = false,
  type = "text",
  inputProps="",
  width= "210px",
  value = "",
}) {

  const styles = {
    inputBase: {
      borderRadius: "20px",
      height: "32px",
      border: "0.1px solid #E4E4E4",
      pl: 1,
      mb: 0.5,
      width: width,
      mx: 0,
    },
    inputBase2: {
      // borderRadius: "20px",
      borderStyle: "hidden",
      height: "32px",
      // border: "0.1px solid #E4E4E4",
      // pl: 1,
      mb: 0.5,
      width: width,
    },
    label: {
      color: "#404040",
      fontSize: "13px",
      fontWeight: "400",
      marginBottom: "4px",
    },
    boxStyle: { display: "flex", flexDirection: "column" },
  };

  return (
    <Box sx={{ ...styles.boxStyle, display: display || "auto" }}>
      <InputLabel>
        {" "}
        <span style={styles.label}>{label}</span>
        {required && (
          <span style={{ ...styles.label, color: "#FD5707" }}>*</span>
        )}
      </InputLabel>
     
    
      <InputBase
        type={type}
        sx={{...(formik?.values[name] ? styles.inputBase2 : styles.inputBase), textTransform: "none"}}
        disabled={disabled}
        value={formik?.values[name] || value}
        onChange={formik?.handleChange}
        inputProps={inputProps}
        placeholder={
          // label.length > 13
          //   ? `Enter ${label.slice(0, 13)}...`
          //   : `Enter ${label}`
          ""
        }
        name={name}
      />
      {formik?.touched[name] && Boolean(formik?.errors[name]) ? (
        <p style={{ color: "red" }}>
          {formik?.touched[name] && formik?.errors[name]}
        </p>
      ) : null}
    </Box>
  );
}

export default InputBox;
