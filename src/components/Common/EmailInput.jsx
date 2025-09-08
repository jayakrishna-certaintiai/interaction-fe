// import { Chip, TextField } from "@mui/material";
// import React, { useState } from "react";

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export function EmailInput({ name, formik, defaultValue }) {
//   const [ inputValue, setInputValue ] = useState("");
//   const [ error, setError ] = useState(false);

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && inputValue) {
//       event.preventDefault(); // Prevent form submission on Enter key

//       // Check if the input value matches the email regex
//       if (emailRegex.test(inputValue?.trim())) {
//         const newEmails = formik.values[ name ].includes(inputValue.trim())
//           ? [ ...formik.values[ name ] ]
//           : [ ...formik.values[ name ], inputValue?.trim() ];
//         formik.setFieldValue(name, newEmails);
//         setInputValue(""); // Clear input field on valid input
//         setError(false); // Reset error state on valid input
//       } else {
//         setError(true); // Set error state on invalid input
//       }
//     }
//   };

//   const handleDelete = (emailToDelete) => () => {
//     const newEmails = formik?.values[ name ]?.filter(
//       (email) => email !== emailToDelete
//     );
//     formik.setFieldValue(name, newEmails);
//     setError(false);
//   };

//   return (
//     <TextField
//       variant="outlined"
//       value={inputValue ? inputValue : defaultValue}
//       onChange={(event) => {
//         setInputValue(event.target.value.split(',').map(email => email.trim()));
//         const emails = event.target.value.split(',').map(email => email.trim());
//         formik.setFieldValue(name, emails);
//         setError(false); // Reset error state on change
//       }}
//       onKeyDown={handleKeyDown}
//       fullWidth
//       error={error}
//       helperText={error ? "Please enter a valid email address." : ""}
//       sx={{
//         width: "600px",
//         "& .MuiInputBase-root": {
//           height: "40px",
//           borderRadius: "20px",
//         },
//       }}
//       InputProps={{
//         startAdornment: formik.values[ name ]?.map((email, index) => (
//           <Chip
//             key={index}
//             label={email}
//             onDelete={handleDelete(email)}
//             sx={{ mr: 1 }}
//           />
//         )),
//       }}
//       placeholder="Add email and press Enter..."
//     />
//   );
// }

// new Component here /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { Chip, TextField } from "@mui/material";
// import React, { useState } from "react";

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export function EmailInput({ name, formik, defaultValue }) {
//   const [ inputValue, setInputValue ] = useState("");
//   const [ error, setError ] = useState(false);
//   const [ emails, setEmails ] = useState([]);

//   React.useEffect(() => {
//     if (defaultValue) {
//       const defaultEmails = defaultValue.split(',').map(email => email.trim());
//       setEmails(defaultEmails);
//     }
//   }, [ defaultValue ]);

//   const addEmail = (email) => {
//     const newEmails = formik.values[ name ].includes(email.trim())
//       ? [ ...formik.values[ name ] ]
//       : [ ...formik.values[ name ], email.trim() ];
//     formik.setFieldValue(name, newEmails);
//     setInputValue("");
//     setError(false);
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && inputValue) {
//       event.preventDefault();
//       if (emailRegex.test(inputValue.trim())) {
//         addEmail(inputValue);
//       } else {
//         setError(true);
//       }
//     }
//   };

//   const handleDelete = (emailToDelete) => () => {
//     const newEmails = formik.values[ name ].filter((email) => email !== emailToDelete);
//     formik.setFieldValue(name, newEmails);
//     setError(false);
//   };

//   return (
//     <TextField
//       variant="outlined"
//       value={inputValue}
//       onChange={(event) => setInputValue(event.target.value)}
//       onKeyDown={handleKeyDown}
//       fullWidth
//       error={error}
//       helperText={error ? "Please enter a valid email address." : ""}
//       sx={{
//         width: "600px",
//         "& .MuiInputBase-root": {
//           height: "40px",
//           borderRadius: "20px",
//         },
//       }}
//       InputProps={{
//         startAdornment: formik.values[ name ]?.map((email, index) => (
//           <Chip
//             key={index}
//             label={email}
//             onDelete={handleDelete(email)}
//             sx={{ mr: 1 }}
//           />
//         )),
//       }}
//       placeholder="Add email and press Enter..."
//     />
//   );
// }

////////////////////////////////////////////////////////////////////////// Refactored Code /////////////////////////////////////////////////////////////////////////////////////

import { Chip, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailInput({ name, formik, defaultValue }) {
  const [ inputValue, setInputValue ] = useState("");
  const [ error, setError ] = useState(false);
  const [ emails, setEmails ] = useState([]);

  // Initialize with default emails
  useEffect(() => {
    if (defaultValue) {
      const defaultEmails = defaultValue.split(',').map(email => email.trim());
      setEmails(defaultEmails);
    }
  }, [ defaultValue ]);

  const addEmail = () => {
    if (emailRegex.test(inputValue.trim())) {
      const newEmails = [ ...emails, inputValue.trim() ];
      setEmails(newEmails);
      formik.setFieldValue(name, newEmails);
      setInputValue("");
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleDelete = (emailToDelete) => () => {
    const newEmails = emails.filter((email) => email !== emailToDelete);
    setEmails(newEmails);
    formik.setFieldValue(name, newEmails);
    setError(false);
  };

  return (
    <TextField
      variant="outlined"
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          addEmail();
        }
      }}
      fullWidth
      error={error}
      helperText={error ? "Please enter a valid email address." : ""}
      sx={{
        width: "600px",
        "& .MuiInputBase-root": {
          height: "40px",
          borderRadius: "20px",
        },
      }}
      InputProps={{
        startAdornment: emails.map((email, index) => (
          <Chip
            key={index}
            label={email}
            onDelete={handleDelete(email)}
            sx={{ mr: 1 }}
          />
        )),
      }}
      placeholder="Add email and press Enter..."
    />
  );
}
