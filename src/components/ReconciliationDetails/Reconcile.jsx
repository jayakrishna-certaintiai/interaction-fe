import { Box, Button, InputBase, InputLabel, Typography } from "@mui/material";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const styles = {
  label: {
    color: "#404040",
    fontSize: "13px",
    fontWeight: "500",
  },
  inputBase: {
    borderRadius: "20px",
    height: "40px",
    border: "1px solid #E4E4E4",
    pl: 1,
    mb: 0.5,
    width: "100px",
  },
  buttonBox: {
    mt: 1,
    display: "flex",
    justifyContent: "flex-end",
    px: 2,
    mb: 2,
  },
  buttonStyle: {
    mr: 1,
    borderRadius: "20px",
    textTransform: "capitalize",
    backgroundColor: "#9F9F9F",
    "&:hover": { backgroundColor: "#9F9F9F" },
  },
  uploadButtonStyle: {
    borderRadius: "20px",
    textTransform: "capitalize",
    backgroundColor: "#00A398",
    "&:hover": { backgroundColor: "#00A398" },
  },
};

function Reconcile({ data, handleSubmit }) {
  const [rndHours, setRndHours] = useState("");
  const [nonRndHours, setNonRndHours] = useState("");
  const [description, setDescription] = useState("");

  const onFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (rndHours.trim() !== "" && nonRndHours.trim() !== "" && description.trim() !== "") {
        await handleSubmit({ rndHours, nonRndHours, description });

        // Show success toast
        toast.promise(
          handleSubmit({ rndHours, nonRndHours, description }),
          {
            loading: "Submitting...",
            success: "Form submitted successfully",
            error: "Failed to submit form",
          }
        );

        // Clear form fields
        setRndHours("");
        setNonRndHours("");
        setDescription("");
      } else {
        // Show error toast for missing fields
        toast.error("All fields are required");
      }
    } catch (error) {
      // Show error toast for submission failure
      toast.error("Failed to submit form");
    }
  };

  return (
    <Box sx={{ borderTop: "1px solid #E4E4E4" }}>
      <Typography
        sx={{
          color: "#404040",
          fontSize: "13px",
          fontWeight: "500",
          ml: 3,
          mt: 1,
        }}
      >
        Distribute Uncertain Hours:{" "}
        <span style={{ color: "#FD5707" }}>{data}</span>
      </Typography>
      <Box
        sx={{ display: "flex", px: 3, mt: 1, justifyContent: "space-between" }}
      >
        <Box>
          <InputLabel sx={styles.label}>No. of QRE Hours</InputLabel>
          <InputBase
            type="number"
            value={rndHours}
            sx={styles.inputBase}
            onChange={(e) => setRndHours(e.target.value)}
          />
        </Box>
        <Box>
          <InputLabel sx={styles.label}>No. of Non QRE Hours</InputLabel>
          <InputBase
            type="number"
            value={nonRndHours}
            sx={styles.inputBase}
            onChange={(e) => setNonRndHours(e.target.value)}
          />
        </Box>
      </Box>
      <Box sx={{ px: 3, mt: 1 }}>
        <InputLabel sx={styles.label}>QRE Task Description</InputLabel>
        <textarea
          name="task-description"
          id="rnd-task-desc"
          rows="10"
          value={description}
          style={{
            border: "1px solid #E4E4E4",
            borderRadius: "20px",
            padding: "8px",
          }}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </Box>
      <Box sx={styles.buttonBox}>
        <Button variant="contained" sx={styles.buttonStyle}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={styles.uploadButtonStyle}
          onClick={onFormSubmit}
        >
          Reconcile
        </Button>
        <Toaster />
      </Box>
    </Box>
  );
}

export default Reconcile;
