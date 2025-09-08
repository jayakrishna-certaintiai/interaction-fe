import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { GoUpload } from "react-icons/go";

const styles = {
  flexBoxItem: {
    display: "flex",
    justifyContent: "space-between",
    px: 2,
  },
  label: {
    color: "#404040",
    fontSize: "14px",
    fontWeight: 600,
  },
  inputBase: {
    borderRadius: "20px",
    height: "40px",
    border: "1px solid #E4E4E4",
    pl: 1,
    width: "200px",
  },
  iconStyle: { fontSize: "17px", color: "#00A398" },
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    boxShadow: 3,
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "90%",
    width: 700,
  },
  titleStyle: {
    borderBottom: "1px solid #E4E4E4",
    px: 2.5,
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
    py: 1,
  },
  uploadBoxStyle: {
    border: "1px dashed #E4E4E4",
    borderWidth: "2px",
    ml: 2,
    mr: 2,
    borderRadius: "20px",
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
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
  modalStyle: {
    display: "flex",
  },
  innerBox: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    cursor: "pointer",
  },
  buttonBox: {
    mt: 1,
    display: "flex",
    justifyContent: "flex-end",
    px: 2,
    mb: 2,
  },
};

const ModalForm = ({
  open,
  handleClose,
  handleSubmit,
  type,
  data,
  clients,
}) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [company, setCompany] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  //   const [project, setProject] = useState("");

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (type === "upload" && file && year && month && company) {
      handleSubmit({ file, company, month, year });
    } else if (type === "reupload" && file) {
      handleSubmit({
        file,
        company: data?.companyId,
        month: data?.month,
        year: data?.year,
      });
    } else {

    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setFileName("");
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthYearOptions = [];

  for (let year = 2020; year <= 2026; year++) {
    months?.forEach((month) => {
      monthYearOptions.push(`${month.substring(0, 3)} ${year}`);
    });
  }



  const handleFileDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
      setFileName(files[0].name);
    }
  };

  const handleMonthYearChange = (event) => {
    const selectedValue = event.target.value;
    const [selectedMonth, selectedYear] = selectedValue.split(" ");

    const fullMonthName = months.find((month) =>
      month.startsWith(selectedMonth)
    );

    setMonth(fullMonthName);
    setYear(selectedYear);

    setMonthYear(selectedValue);
  };

  return (
    <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Typography variant="h6" sx={styles.titleStyle}>
          Upload Timesheet
        </Typography>
        <Box sx={styles.flexBoxItem}>
          <Box>
            <InputLabel sx={styles.label}>Account</InputLabel>
            <Select
              value={type === "reupload" ? data?.companyId : company}
              onChange={(e) => setCompany(e.target.value)}
              sx={{
                ...styles.inputBase,
                width: "300px",
                border: "none",
              }}
              disabled={type === "reupload"}
            >
              {type === "upload" &&
                clients?.map((client) => (
                  <MenuItem value={client?.companyId} key={client?.companyId}>
                    {client?.companyName}
                  </MenuItem>
                ))}
              {type === "reupload" && (
                <MenuItem value={data?.companyId}>{data?.companyId}</MenuItem>
              )}
            </Select>
          </Box>

          <Box>
            <InputLabel sx={styles.label}>Month/Year</InputLabel>
            <Select
              value={type === "reupload" ? data?.month : monthYear}
              onChange={handleMonthYearChange}
              sx={{ ...styles.inputBase, width: "300px", border: "none" }}
              disabled={type === "reupload"}
            >
              {type === "upload" &&
                monthYearOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              {type === "reupload" && (
                <MenuItem value={data?.month}>
                  {data?.month?.substring(0, 3) + " " + data?.year}
                </MenuItem>
              )}
            </Select>
          </Box>
        </Box>
        <Typography sx={{ px: 2, mb: -2, fontWeight: 600 }}>
          Upload Timesheet
        </Typography>
        <Box
          sx={styles.uploadBoxStyle}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          <Box
            sx={styles.innerBox}
            onClick={() => document.getElementById("file-input").click()}
          >
            <input
              id="file-input"
              type="file"
              hidden
              onChange={handleFileChange}
            />
            <GoUpload style={styles.iconStyle} />
            <Typography sx={{ color: "#00A398" }}>Upload</Typography>
            <Typography sx={{ color: "#9F9F9F" }}>
              (Drag and drop your file)
            </Typography>
            <Typography sx={{ color: "#9F9F9F" }}>
              or{" "}
              <span style={{ color: "#00A398", textDecoration: "underline" }}>
                select a file
              </span>{" "}
              from your computer
            </Typography>
            {fileName && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {fileName}
                </Typography>
              </Box>
            )}
          </Box>
          {fileName && (
            <Button color="error" onClick={handleClearFile}>
              Clear
            </Button>
          )}
        </Box>
        <Box sx={styles.buttonBox}>
          <Button
            variant="contained"
            sx={styles.buttonStyle}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={styles.uploadButtonStyle}
            onClick={onFormSubmit}
          >
            Upload
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ModalForm;
