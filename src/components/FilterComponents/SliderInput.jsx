// import React, { useState } from "react";
// import { Slider, FormControl, Box, InputLabel } from "@mui/material";

// function valuetext(value) {
//   return `${value}`;
// }

// const styles = {
//   slider: {
//     color: "#b9e4c9",
//     "& .MuiSlider-thumb": {
//       height: "14px",
//       width: "14px",
//       backgroundColor: "#FFFFFF",
//       border: "2px solid #00A398",
//       "&:focus, &:hover, &.Mui-active": {
//         boxShadow: "inherit",
//       },
//     },
//     "& .MuiSlider-track": {
//       height: "16px",
//       borderRadius: "4px",
//       backgroundColor: "#00A398",
//     },
//     "& .MuiSlider-rail": {
//       height: "16px",
//       borderRadius: "10px",
//       opacity: 0.5,
//       backgroundColor: "#E4E4E4",
//     },
//   },
//   label: {
//     fontWeight: 500,
//     color: "#404040",
//     fontSize: "13px",
//     mb: 1.2,
//     mt: 0.1,
//   },
//   valueBox: {
//     borderRadius: "20px",
//     border: "1px solid #E4E4E4",
//     width: "84px",
//     height: "30px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#404040",
//   },
// };

// const SliderInput = ({ initialMin, initialMax, value = [initialMin, initialMax], onChange, label, minWidth = 120 }) => {
//   const [min, setMin] = useState(initialMin);
//   const [max, setMax] = useState(initialMax);

//   const handleSliderChange = (event, newValue) => {
//     onChange(event, newValue);
//     if (newValue[1] === max) {
//       setMax(initialMax);
//     }
//   };

//   return (
//     <>
//       <InputLabel sx={styles.label}>{label}</InputLabel>
//       <FormControl sx={{ m: 1.5, minWidth: minWidth }}>
//         <Slider
//           min={min}
//           max={max}
//           value={value}
//           onChange={handleSliderChange}
//           onMouseUp={() => setMax(initialMax)}
//           getAriaValueText={valuetext}
//           step={0.1}
//           sx={styles.slider}
//         />
//       </FormControl>
//       {Array.isArray(value) && (
//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Box sx={styles.valueBox}>{value[0]}</Box>
//           <Box sx={styles.valueBox}>{value[1]}</Box>
//         </Box>
//       )}
//     </>
//   );
// };
// export default SliderInput;

import React, { useState } from "react";
import { Slider, FormControl, Box, InputLabel, TextField } from "@mui/material";

function valuetext(value) {
  return `${value}`;
}

const styles = {
  slider: {
    color: "#b9e4c9",
    "& .MuiSlider-thumb": {
      height: "14px",
      width: "14px",
      backgroundColor: "#FFFFFF",
      border: "2px solid #00A398",
      "&:focus, &:hover, &.Mui-active": {
        boxShadow: "inherit",
      },
    },
    "& .MuiSlider-track": {
      height: "16px",
      borderRadius: "4px",
      backgroundColor: "#00A398",
    },
    "& .MuiSlider-rail": {
      height: "16px",
      borderRadius: "10px",
      opacity: 0.5,
      backgroundColor: "#E4E4E4",
    },
  },
  label: {
    fontWeight: 500,
    color: "#404040",
    fontSize: "13px",
    mb: 1.2,
    mt: 0.1,
  },
  input: {
    borderRadius: "20px",
    width: "84px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#404040",
    backgroundColor: "transparent",
    border: "1px solid #b9e4c9",
    // border: "none",
    // outline: "none",
    "& .MuiInputBase-input": {
      padding: 0,
      textAlign: "center",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
};

const SliderInput = ({
  initialMin,
  initialMax,
  value = [initialMin, initialMax],
  onChange,
  label,
  minWidth = 120,
}) => {
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSliderChange = (event, newValue) => {
    setCurrentValue(newValue);
    onChange(event, newValue);
  };

  const handleInputChange = (index) => (event) => {
    let newValue = [...currentValue];
    const inputValue = Number(event.target.value);

    // Ensure values stay within the initial range
    if (inputValue < initialMin) newValue[index] = initialMin;
    else if (inputValue > initialMax) newValue[index] = initialMax;
    else newValue[index] = inputValue;

    // Ensure min value is always less than max value
    if (index === 0 && newValue[0] >= newValue[1]) {
      newValue[0] = Math.min(newValue[1] - 0.1, initialMax);
    } else if (index === 1 && newValue[1] <= newValue[0]) {
      newValue[1] = Math.max(newValue[0] + 0.1, initialMin);
    }

    setCurrentValue(newValue);
    onChange(event, newValue);
  };

  return (
    <>
      <InputLabel sx={styles.label}>{label}</InputLabel>
      <FormControl sx={{ m: 1.5, minWidth: minWidth }}>
        <Slider
          min={min}
          max={max}
          value={currentValue}
          onChange={handleSliderChange}
          getAriaValueText={valuetext}
          step={0.1}
          sx={styles.slider}
        />
      </FormControl>
      {Array.isArray(currentValue) && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
          <TextField
            type="number"
            value={currentValue[0]}
            onChange={handleInputChange(0)}
            variant="outlined"
            size="small"
            inputProps={{ min, max }}
            sx={styles.input}
            InputProps={{
              disableUnderline: true,
            }}
          />
          <TextField
            type="number"
            value={currentValue[1]}
            onChange={handleInputChange(1)}
            variant="outlined"
            size="small"
            inputProps={{ min, max }}
            sx={styles.input}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </Box>
      )}
    </>
  );
};

export default SliderInput;
