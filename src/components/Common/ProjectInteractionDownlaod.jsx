import { Box, Button, Modal, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ProjectDownDataModal from "./ProjectDownDataModal"
import { BaseURL } from '../../constants/Baseurl';
import toast from 'react-hot-toast';
import axios from 'axios';
import DocumentFormatSelect from '../Documents/DocumentFormatSelect';
import ProjectInteractionDataModal from './ProjectInteractionDataDownModal';
import ProjectInteractionDataDownModal from './ProjectInteractionDataDownModal';

const styles = {
    paperStyle: {
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "20px",
        margin: "auto",
        width: 550,
        height: "800",
        position: "absolute",
        transform: "translate(-0%, -0%)",
        border: "none",
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
    },
    inputBase: {
        borderRadius: "20px",
        height: "40px",
        border: "1px solid #c4c4c4",
        pl: 1,
        mb: 0.5,
        width: "600px",
    },
    box1Style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        borderBottom: "1px solid #E4E4E4",
        alignItems: "center",
    },
};
const documentType = ["pdf", "docx",];
const ProjectInteractionDownlaod = ({ open, usedfor, handleClose, updatePurpose, projects, postUpdate }) => {
    const [selectedInteraction, setSelectedInteraction] = useState([]);
    const [InteractionError, setInteractionError] = useState("");
    const [filteredInteraction, setFilteredInteraction] = useState([]);
    const [docTypeError, setDocTypeError] = useState("");
    const [selectedDocumentType, setSelectedDocumentType] = useState(documentType[0]);

    useEffect(() => {
        setSelectedDocumentType([]);
        setSelectedInteraction([]);
    }, [open]);
    useEffect(() => {
        if (selectedInteraction.length > 0) {
            setInteractionError("");
        }
    }, [selectedInteraction]);
    const handleSelectInteraction = (projectId, checked) => {
        if (checked) {
            setSelectedInteraction([...selectedInteraction, projectId]);
            setInteractionError("");
        } else {
            const updateInteraction = selectedInteraction.filter(pr => pr !== projectId);
            setSelectedInteraction(updateInteraction);
        }
    }
    const getFilteredInteraction = (filteredInteraction) => {
        setFilteredInteraction(filteredInteraction);
    }
    const handleSelectAllInteraction = (checked) => {
        if (checked) {
            const allInteraction = filteredInteraction.map(pr => (updatePurpose === "Surveys" ? pr?.caseProjectId : updatePurpose === "Interactions" ? pr.interactionId : ""))
            setSelectedInteraction(allInteraction);
            setInteractionError("");
        } else {
            setSelectedInteraction([]);
        }
    }
    const handleDownload = async () => {
        let isValid = true;
        if (!selectedDocumentType || selectedDocumentType?.length === 0) {
            setDocTypeError("Please select document format!");
            isValid = false;
        } else {
            setDocTypeError("");
        }
        if (selectedInteraction?.length === 0) {
            setInteractionError("Please select at least one Interaction to download.");
            isValid = false;
        } else {
            setInteractionError("");
        }
        if (!isValid) return;

        try {
            const token = localStorage.getItem("tokens");
            const token_obj = JSON.parse(token);
            const currentDocumentType = selectedDocumentType;
            const response = await axios.get(
                `${BaseURL}/api/v1/projects/download-interactions-report`,
                {
                    headers: {
                        Authorization: `Bearer ${token_obj?.accessToken}`,
                    },
                    params: {
                        interactionsIds: JSON.stringify(selectedInteraction),
                        format: currentDocumentType,
                    },
                    responseType: "blob",
                }
            );
            if (response.data) {
                const blob = new Blob([response.data], {
                    type: "application/zip",
                });
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;

                const contentDisposition = response.headers["content-disposition"];
                let fileName = "interaction-report.zip";
                if (contentDisposition) {
                    fileName = contentDisposition
                        .split("filename=")[1]?.replace(/"/g, "") || fileName;
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
        setInteractionError("");
        setSelectedDocumentType(documentType[0]);
        setSelectedInteraction([]);
        handleClose();
    };

    return (
        <Modal open={open} onClose={() => {
            handleCloseModal();
            setSelectedDocumentType(documentType[0]);
        }}
            sx={styles.modalStyle}
            id="update-modal"
        >
            <Paper sx={styles.paperStyle}>
                <Box sx={{ ...styles.box1Style, py: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", py: 1, width: "100%", alignItems: "left", justifyContent: "flex-start", mb: -2, }}>
                        <Typography variant="h6" sx={{ ...styles.titleStyle, fontSize: "15px", mb: 0, borderBottom: "1px solid #E4E4E4", width: "100%", }}>Download Interaction</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", ml: 6, mt: 1 }}>
                        <DocumentFormatSelect docType={documentType} error={docTypeError} selectedDocumentType={selectedDocumentType} setSelectedDocumentType={handleDocumentTypeChange} sx={{ marginBottom: 20 }} usedfor={usedfor} />
                    </Box>
                    <form>
                        <Box sx={{ height: "90%" }}>
                            <ProjectInteractionDataDownModal projects={projects} handleSelectInteraction={handleSelectInteraction} handleSelectAllInteraction={handleSelectAllInteraction} updatePurpose={updatePurpose} getFilteredInteraction={getFilteredInteraction} documentType={documentType} />
                            {InteractionError && (
                                <Typography color="error" sx={{ mt: 1 }}>{InteractionError}</Typography>
                            )}
                        </Box>
                        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "1rem" }}>
                            <Box><Typography>Selected {selectedInteraction?.length || 0} {updatePurpose} out of {filteredInteraction?.length || 0}</Typography></Box>
                            <Box sx={styles.buttonBox}><Button variant='contained' sx={styles.buttonStyle} onClick={handleCloseModal}>Cancel</Button>
                                <Button variant='contained' sx={styles.uploadButtonStyle} type='submit' onClick={(e) => { e.preventDefault(); handleDownload(); }}>Download</Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Paper>
        </Modal>
    );
}

export default ProjectInteractionDownlaod
