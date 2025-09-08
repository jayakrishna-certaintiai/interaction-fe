import { Box, InputLabel, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import React from "react";

// const styles = {
//   label: {
//     color: "#404040",
//     fontSize: "13px",
//     fontWeight: "400",
//   },
//   boxStyle: { display: "flex", flexDirection: "column" },
//   inputBase: (width) => ({
//     "& .MuiInputBase-root": {
//       height: "32px",
//       width: width,
//       borderRadius: "20px",
//       "& input": {
//         padding: "0 0px",
//         mt: -0.5,
//         "&::placeholder": {
//           color: "#bbbbbb",
//           opacity: 1,
//         },
//       },
//     },
//     "& .MuiAutocomplete-inputRoot": {
//       padding: "0 !important",
//     },
//   }),
// };

export default function SelectBox({
  label,
  selectOptions = [],
  name = "",
  formik,
  required = false,
  width = "210px",
  disabled = false,

  disableClearable = false,
}) {
  const handleAutocompleteChange = (event, newValue) => {
    formik.setFieldValue(name, newValue ? newValue.id : "");
    
  };

  const styles = {
    label: {
      color: "#404040",
      fontSize: "13px",
      fontWeight: "400",
    },
    boxStyle: { display: "flex", flexDirection: "column" },
    inputBase: {
      "& .MuiInputBase-root": {
        // border: "0rem solid black",
        outline: "0rem solid",
        height: "32px",
        width: width,
        borderRadius: "20px",
        "& input": {
          padding: "0 0px",
          mt: -0.5,
          "&::placeholder": {
            color: "#bbbbbb",
            opacity: 1,
          },
        },
      },
      "& .MuiAutocomplete-inputRoot": {
        padding: "0 !important",
      },
    },
    menuPaper: {
      maxHeight: "250px",
      width: width - "10px",
      overflow: "auto",
    },
  };

  return (
    <Box sx={styles.boxStyle}>
      <InputLabel>
        <span style={styles.label}>{label}</span>
        {required && (
          <span style={{ ...styles.label, color: "#FD5707" }}>*</span>
        )}
      </InputLabel>
      <Autocomplete
      
        value={
          selectOptions.find((option) => option.id === formik.values[name]) ||
          null
        }
        onChange={handleAutocompleteChange}
        options={selectOptions}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        disableClearable={disableClearable}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            sx={styles.inputBase}
            placeholder={`Select ${label}`}
          />
        )}
        name={name}
        disabled={disabled}
      />
      {formik.touched[name] && Boolean(formik.errors[name]) ? (
        <p style={{ color: "red" }}>
          {formik.touched[name] && formik.errors[name]}
        </p>
      ) : null}
    </Box>
  );
}
