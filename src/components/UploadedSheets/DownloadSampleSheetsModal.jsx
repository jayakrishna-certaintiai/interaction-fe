import {
    Box,
    Button,
    FormHelperText,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    Typography,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { FilterListContext } from "../../context/FiltersListContext";
import { BaseURL } from "../../constants/Baseurl";

const styles = {
    flexBoxItem: {
        // display: "flex",
        // justifyContent: "space-between",
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
        width: "300px",
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
        width: 400,
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

const fileTypes = ["Projects", 'Project Team', 'Employee', 'Wages'];



export const DownloadSampleSheetsModal = ({ open, handleClose }) => {
    const [fileType, setFileType] = useState(null);
    const [fileError, setFileError] = useState(null);

    const handleModalClose = () => {
        setFileType(null);
        setFileError(null);
        handleClose(); // Close the modal
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        let isValid = true;
        if (!fileType) {
            setFileError("Please select a File Type.");
            isValid = false;
        } else {
            setFileError("");
        }

        if (isValid) {
            handleDownload();
        }
    };

    const handleDownload = async () => {
        if (!fileType) {
            toast.error("Please select file type");
            return;
        }

        let url;

        switch (fileType) {
            case "Projects":
                url = `${BaseURL}/api/v1/projects/download-project-sample-sheet`;
                break;
            case "Project Team":
                url = `${BaseURL}/api/v1/contacts/download-team-member-report`;
                break;
            case "Employee":
                url = `${BaseURL}/api/v1/contacts/download-employees-report`;
                break;
            case "Wages":
                url = `${BaseURL}/api/v1/contacts/download-employees-wages-report`;
                break;
            default:
                return toast.error("Invalid file type selected.");
        }
        try {
            const tokensObj = JSON.parse(localStorage.getItem("tokens"));
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokensObj.accessToken}`,
                },
                responseType: "blob",
            });

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(new Blob([response.data]));
            link.setAttribute("download", `${fileType}.xlsx`);
            link.click();
            const successMessage = response.headers["x-success-message"] || "Sample sheet downloaded successfully";
            successMessage && toast.success(successMessage);
            handleModalClose();
        } catch (error) {
            console.error("Error while downloading sample sheet", error);
            toast.error("Error while downloading sample sheet, Please try again.");
        }
    }

    return (
        <Modal open={open} onClose={handleModalClose} sx={styles.modalStyle}>
            <Paper sx={styles.paperStyle}>
                <Typography variant="h6" sx={styles.titleStyle}>
                    Download Sample Sheets
                </Typography>
                <Box sx={{ ...styles.flexBoxItem, mt: 2 }}>
                    <InputLabel sx={styles.label}>File Type</InputLabel>
                    <Select
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        sx={{ ...styles.inputBase }}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            Please select a file type
                        </MenuItem>
                        {fileTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                    {fileError && (
                        <FormHelperText error sx={{ textAlign: "center" }}>
                            {fileError}
                        </FormHelperText>
                    )}
                </Box>
                <Box sx={styles.buttonBox}>
                    <Button
                        variant="contained"
                        sx={styles.buttonStyle}
                        onClick={handleModalClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={styles.uploadButtonStyle}
                        onClick={onFormSubmit}
                    >
                        Download
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};