import React from "react";
import { Box, InputLabel, TextField, Checkbox } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function MultiSelectBox({
  label,
  selectOptions = [],
  name = "",
  formik,
  required = false,
  width = "210px",
  disabled = false,
}) {
  const handleAutocompleteChange = (event, newValue) => {
    // Adjust this to set the value as an array of ids
    formik?.setFieldValue(
      name,
      newValue?.map((item) => item?.id)
    );
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
        minHeight: "32px",
        width: width,
        minWidth: "210px",
        borderRadius: "20px",
        "& input": {
          padding: "0 0px",
          mt: 0,
          "&::placeholder": {
            color: "#bbbbbb",
            opacity: 1,
          },
        },
      },
      "& .MuiAutocomplete-inputRoot[class*='MuiInput-root']": {
        padding: "0 !important",
      },
      "& .MuiAutocomplete-tag": {
        height: "25px",
        //   marginTop: "-8px",
      },
      "& .MuiOutlinedInput-root": {
        padding: "0 !important",
      },
    },
    menuPaper: {
      maxHeight: "250px",
      minWidth: "200px",
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
        multiple
        value={selectOptions.filter((option) =>
          formik?.values[name]?.includes(option?.id)
        )}
        onChange={handleAutocompleteChange}
        options={selectOptions}
        disableCloseOnSelect
        getOptionLabel={(option) => option?.name || ""}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              checked={selected}
            />
            {option?.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            sx={styles.inputBase}
            placeholder={disabled ? "" : `Select ${label}`}
          />
        )}
        disabled={disabled}
        name={name}
      />
      {formik.touched[name] && Boolean(formik.errors[name]) ? (
        <p style={{ color: "red" }}>
          {formik.touched[name] && formik.errors[name]}
        </p>
      ) : null}
    </Box>
  );
}
