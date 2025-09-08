import React from "react";
import { Autocomplete, InputLabel, TextField, Typography } from "@mui/material";

const styles = {
  label: {
    fontWeight: 500,
    color: "#404040",
    fontSize: "13px",
    mb: "3px",
  },
  option: {
    fontSize: "13px",
  },
};

const FilterCustomAutocomplete = ({
  label = "",
  placeholder = "",
  options = [],
  value,
  onChange,
  inputValue,
  onInputChange,
  disabled = false,
  freeSolo = false,
  heading,
}) => {
  return (
    <>
      <InputLabel sx={styles.label}>{heading}</InputLabel>
      <Autocomplete
        value={value}
        onChange={onChange}
        inputValue={inputValue}
        onInputChange={onInputChange}
        options={options}
        disabled={disabled}
        freeSolo={freeSolo}
        disableClearable={true}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            sx={{
              "& .MuiInputBase-root": {
                height: "30px",
                width: "240px",
                mb: 1,
                borderRadius: "20px",
                "& input": {
                  padding: "0 5px",
                  mt: 0,
                  fontSize: "13px",
                  "&::placeholder": {
                    color: "#9F9F9F",
                    fontSize: "13px",
                    opacity: 1,
                  },
                },
              },
            }}
          />
        )}
        getOptionLabel={(option) => option ?? ""}
        renderOption={(props, option) => (
          <li {...props}>
            <Typography sx={styles.option}>{option}</Typography>
          </li>
        )}
      />
    </>
  );
};

export default FilterCustomAutocomplete;
