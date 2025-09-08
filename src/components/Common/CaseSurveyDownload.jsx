import { Box, Button, Modal, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { BaseURL } from '../../constants/Baseurl';
import toast from 'react-hot-toast';
import axios from 'axios';
import DocumentFormatSelect from '../Documents/DocumentFormatSelect';
import SurveyDownloadDataModal from './SurveyDownloadDataModal';
// import DownloadDataModal from './DownloadDataModal';
const styles = {
    paperStyle: {
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "20px",
        margin: "auto",
        width: 700,
        height: "800",
        position: "absolute",
        transform: "translate(-0%, -0%)",
        border: "none",
        borderBottom: "1px solid #E4E4E4",
    },
    titleStyle: {
        textAlign: "left",
        fontWeight: 600,
        fontSize: "110px",
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
        alignItems: "center",
        justifyContent: "center",
    },
    buttonBox: {
        mt: 1,
        display: "flex",
        justifyContent: "flex-end",
        px: 2,
        mb: 2,
    },
    label: {
        color: "#404040",
        fontSize: "14px",
    },
    inputBase: {
        borderRadius: "20px",
        height: "40px",
        border: "1px solid #E4E4E4",
        pl: 1,
        mb: 0.5,
        width: "600px",
    },
    box1Style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        pl: -15,
        borderBottom: "1px solid #E4E4E4",
        alignItems: "center",
    },
};
const documentType = ["pdf", "docx",];
const CaseSurveyDownload = ({ open, usedfor, handleClose, updatePurpose, projects, postUpdate, }) => {
    const [selectedSurvey, setselectedSurvey] = useState([]);
    const [SurveyError, setSurveyError] = useState("");
    const [filteredSurvey, setfilteredSurvey] = useState([]);
    const [docTypeError, setDocTypeError] = useState("");
    const [selectedDocumentType, setSelectedDocumentType] = useState(documentType[0]);
    useEffect(() => {
        setSelectedDocumentType([]);
        setselectedSurvey([]);
    }, [open]);
    useEffect(() => {
        if (selectedSurvey.length > 0) {
            setSurveyError("");
        }
    }, [selectedSurvey]);
    const handleSelectSurvey = (projectId, checked) => {
        if (checked) {
            setselectedSurvey([...selectedSurvey, projectId]);
            setSurveyError("");
        } else {
            const updateSurvey = selectedSurvey.filter(pr => pr !== projectId);
            setselectedSurvey(updateSurvey);
        }
    }
    const getfilteredSurvey = (filteredSurvey) => {
        setfilteredSurvey(filteredSurvey);
    }
    const handleSelectAllSurveys = (checked) => {
        if (checked) {
            const allSurveys = filteredSurvey.map(pr => (updatePurpose === "Surveys" ? pr?.surveyId : updatePurpose === "Surveys" ? pr.surveyId : ""))
            setselectedSurvey(allSurveys);
            setSurveyError("");
        } else {
            setselectedSurvey([]);
        }
    }
    const handleDownload = async () => {
        let isValid = true;

        // Validate selectedDocumentType
        if (!selectedDocumentType || selectedDocumentType?.length === 0) {
            setDocTypeError("Please select document format!");
            isValid = false;
        } else {
            setDocTypeError("");
        }

        // Validate selectedSurvey
        if (!selectedSurvey || selectedSurvey?.length === 0) {
            setSurveyError("Please select at least one Survey to download.");
            isValid = false;
        } else {
            setSurveyError("");
        }

        if (!isValid) return;

        try {
            const token = localStorage.getItem("tokens");
            const token_obj = JSON.parse(token);
            const currentDocumentType = selectedDocumentType;

            const response = await axios.get(
                `${BaseURL}/api/v1/case/download-survey`,
                {
                    headers: {
                        Authorization: `Bearer ${token_obj?.accessToken}`,
                    },
                    params: {
                        surveyIds: JSON.stringify(selectedSurvey),
                        format: currentDocumentType,
                    },
                    responseType: "blob", // Ensure the response is received as a Blob
                }
            );

            if (response.data) {
                // MIME types for pdf and docx
                const mimeTypeMap = {
                    pdf: "application/pdf",
                    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                };
                const mimeType = mimeTypeMap[currentDocumentType] || "application/octet-stream";

                const blob = new Blob([response.data], { type: mimeType });
                const blobUrl = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = blobUrl;

                // Extract file name from Content-Disposition or use a default
                const contentDisposition = response.headers["content-disposition"];
                let fileName = `survey-report.${currentDocumentType}`;
                if (contentDisposition) {
                    fileName =
                        contentDisposition
                            .split("filename=")[1]
                            ?.replace(/"/g, "")
                            ?.trim() || fileName;
                }

                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                link.remove();

                toast.success("File downloaded successfully.");
                handleClose();
                postUpdate();
            } else {
                toast.error("Failed to download. No data received.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error downloading file.");
        }
    };

    const handleDocumentTypeChange = (type) => {
        setSelectedDocumentType(type);
        if (type) {
            setDocTypeError("");
        }
    };
    const handleCloseModal = () => {
        setDocTypeError("");
        setSurveyError("");
        setSelectedDocumentType(documentType[0]);
        setselectedSurvey([]);
        handleClose();
    };

    return (
        <Modal open={open} onClose={(event) => {
            handleCloseModal();
            setSelectedDocumentType(documentType[0]);
        }}
            sx={styles.modalStyle}
            id="update-modal"
        >
            <Paper sx={styles.paperStyle}>
                <Box sx={{ ...styles.box1Style, py: 1, }}>
                    <Box sx={{ display: "flex", flexDirection: "column", py: 1, ml: 3, width: "96%", alignItems: "left", justifyContent: "flex-start", mb: -2, }}>
                        <Typography variant="h6" sx={{ ...styles.titleStyle, fontSize: "15px", mb: 0, borderBottom: "1px solid #E4E4E4", width: "100%", }}>
                            Download Survey
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", ml: 6, mt: 1 }}>
                        <DocumentFormatSelect
                            docType={documentType}
                            error={docTypeError}
                            selectedDocumentType={selectedDocumentType}
                            setSelectedDocumentType={handleDocumentTypeChange}
                            sx={{ marginBottom: 20 }}
                            usedfor={usedfor}
                        />
                    </Box>
                    <form>
                        <Box sx={{ height: "90%" }}>
                            <SurveyDownloadDataModal
                                projects={projects}
                                handleSelectSurvey={handleSelectSurvey}
                                handleSelectAllSurveys={handleSelectAllSurveys}
                                updatePurpose={updatePurpose}
                                getfilteredSurvey={getfilteredSurvey}
                                documentType={documentType}
                            />
                            {SurveyError && (<Typography color="error" sx={{ mt: 1 }}>{SurveyError}</Typography>)}
                        </Box>
                        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "1rem" }}>
                            <Box><Typography>Selected {selectedSurvey?.length || 0} {updatePurpose} out of {filteredSurvey?.length || 0}</Typography></Box>
                            <Box sx={styles.buttonBox}>
                                <Button variant='contained' sx={styles.buttonStyle} onClick={handleCloseModal}>Cancel</Button>
                                <Button variant='contained' sx={styles.uploadButtonStyle} type='submit' onClick={(e) => { e.preventDefault(); handleDownload(); }}>Download</Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Paper>
        </Modal>
    );
}

export default CaseSurveyDownload
