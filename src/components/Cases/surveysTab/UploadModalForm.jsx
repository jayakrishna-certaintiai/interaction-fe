import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
    Modal,
    Button,
    Box,
    Typography,
    Paper,
    Divider,
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
        width: 500,
    },
    titleStyle: {
        borderBottom: "1px solid #E4E4E4",
        px: 2.5,
        textAlign: "left",
        fontWeight: 600,
        fontSize: "13px",
        py: 2,
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

const UploadModalForm = ({
    open,
    handleClose,
    handleFormSubmit,
    type,
    data,
    caseId
}) => {
    const [files, setFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    // const [caseId, setCaseId] = useState("");

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (type === "upload" && files?.length && caseId) {
            handleFormSubmit({ files, caseId });
            setTimeout(() => {
                handleClearFiles();
                handleClose();
            }, 3000);
        } else if (type === "reupload" && files?.length) {
            handleFormSubmit({
                files,
                caseId: data?.caseId,
            });
            setTimeout(() => {
                handleClearFiles();
                handleClose();
            }, 3000);
        } else {
            setErrorMessage("Please upload a valid file.");
        }
    };
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const validFiles = selectedFiles.filter((file) =>
            file.name.endsWith(".xlsx")
        );

        if (validFiles.length !== selectedFiles.length) {
            setErrorMessage("Upload valid file please (only .xlsx allowed).");
            return;
        }

        setFiles([...files, ...validFiles]);
        setFileNames([...fileNames, ...validFiles.map((file) => file.name)]);
        setErrorMessage("");
    };

    const handleRemoveFile = (index, event) => {
        event.stopPropagation();
        event.preventDefault();
        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedFileNames = fileNames.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        setFileNames(updatedFileNames);
    };

    const handleClearFiles = () => {
        setFiles([]);
        setFileNames([]);
        setErrorMessage([]);
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        const validFiles = droppedFiles.filter((file) =>
            file.name.endsWith(".xlsx")
        );

        if (validFiles.length !== droppedFiles.length) {
            setErrorMessage("Upload valid file please (only .xlsx allowed).");
            return;
        }

        setFiles([...files, ...validFiles]);
        setFileNames([...fileNames, ...validFiles.map((file) => file.name)]);
        setErrorMessage("");  // Clear error message on valid file
    };
    return (
        // <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
        <Modal
            open={open}
            onClose={() => {
                handleClearFiles();
                handleClose();
            }}
            sx={styles.modalStyle}
            id="update-modal"
        >
            <Paper sx={styles.paperStyle}>
                <Typography variant="h6" sx={styles.titleStyle}>
                    Upload Survey
                </Typography>
                <Box
                    sx={styles.uploadBoxStyle}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                >
                    <Box
                        sx={styles.innerBox}
                        onClick={() => document.getElementById("file-input").click()}
                    >
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            hidden
                            onChange={handleFileChange}
                        />
                        <GoUpload style={styles.iconStyle} />
                        <Typography sx={{ color: "#00A398" }}>Select Files </Typography>
                        <Typography sx={{ color: "#9F9F9F" }}>
                            (Drag and drop your files)
                        </Typography>
                        {fileNames.length > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    mt: 2,
                                    maxHeight: "150px",
                                    overflowY: fileNames.length > 5 ? "auto" : "hidden",
                                    border: "1px solid #E4E4E4",
                                    borderRadius: "10px",
                                    padding: "8px",
                                }}
                            >
                                {fileNames.map((fileName, index) => (
                                    <Box key={index}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                mb: 1,
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                                {fileName}
                                            </Typography>
                                            <AiOutlineClose
                                                style={{ cursor: "pointer", color: "#FF0000" }}
                                                onClick={(event) => handleRemoveFile(index, event)}
                                            />
                                        </Box>
                                        {index < fileNames.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                    {errorMessage && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {errorMessage}
                        </Typography>
                    )}
                    {fileNames.length > 0 && (
                        <Button color="error" onClick={handleClearFiles}>
                            Clear All
                        </Button>
                    )}
                </Box>
                <Box sx={styles.buttonBox}>
                    <Button
                        variant="contained"
                        sx={styles.buttonStyle}
                        onClick={() => {
                            handleClose();
                            handleClearFiles();
                        }}
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

export default UploadModalForm;
