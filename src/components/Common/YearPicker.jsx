import React from "react";
import { Box, InputLabel, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

export default function YearPicker({
  label = "Fiscal Year",
  startYear = 1900,
  endYear = new Date().getFullYear(),
  name = "",
  formik,
  required = false,
  width = "210px",
  disabled = false,
  disableClearable = false,
}) {
  // Generate a range of years
  const yearOptions = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => ({
      id: startYear + i,
      name: (startYear + i).toString(),
    })
  );

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
        height: "32px",
        width: width,
        borderRadius: "20px",
        "& input": {
          padding: "0 0px",
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
          yearOptions.find((option) => option.id === formik.values[name]) || null
        }
        onChange={handleAutocompleteChange}
        options={yearOptions}
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
