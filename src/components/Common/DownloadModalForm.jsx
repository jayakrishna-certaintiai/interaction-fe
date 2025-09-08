
import {
    Box,
    Button,
    Modal,
    Paper,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ActivityContext } from "../../context/ActivityContext";
import { BaseURL } from "../../constants/Baseurl";
import DownloadAccountModal from "./DownloadAccountModal";

const styles = {
    paperStyle: {
        boxShadow: "0px 3px 6px #0000001F",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "20px",
        margin: "auto",
        maxWidth: "50%",
        width: 1200,
        height: "500",
        position: "absolute",
        transform: "translate(-0%, -0%)",
    },
    titleStyle: {
        px: 1,
        textAlign: "left",
        fontWeight: 600,
        fontSize: "13px",
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
    flexBox: {
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid #E4E4E4",
    },
    flexBoxItem: {
        display: "flex",
        justifyContent: "space-between",
        mt: 1,
        gap: 2,
        px: 2,
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
    expandMoreIcon: {
        borderRadius: "50%",
        fontSize: "15px",
        backgroundColor: "#404040",
        color: "white",
        mr: 1,
        transition: "transform 0.3s ease",
    },
    sectionStyle: { fontWeight: 600, px: 2, cursor: "pointer" },
    box1Style: {
        display: "flex",
        justifyContent: "space-between",
        p: 2,
        borderBottom: "1px solid #E4E4E4",
        alignItems: "center",
    },
    radioStyle: {
        "& .MuiSvgIcon-root": {
            fontSize: 20,
            color: "#00A398",
        },
    },
    labelStyle: { fontSize: "13px", fontWeight: 600 },
    divStyle: {
        display: "flex",
        padding: "0 20px",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
    },
    divTitleStyle: { fontSize: "13px", fontWeight: "600" },
    selStyle: {
        border: "1px solid #E4E4E4",
        px: 2,
        py: 0.5,
        borderRadius: "20px",
        fontSize: "13px",
        width: "180px",
        textAlign: "center",
    },
};

function DownloadModalForm({
    open,
    handleClose,
    updateData,
    updatePurpose,
    projects,
    company,
    fetchProjects
}) {
    const { isVisible, setIsVisible } = useContext(ActivityContext);
    const [selectedUpdates, setSelectedUpdates] = React.useState([]);
    const [summaryError, setSummaryError] = useState("");
    const [addUpdatesOpen, setAddupdatesOpen] = useState(open);
    const [detailedSelectedUpdates, setDetailedSelectedUpdates] = React.useState([]);
    const [allUpdates, setAllUpdates] = React.useState([]);
    const [feedUpdates, setFeedUpdates] = useState([]);
    const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);

    const handleSelectedCompany = (company, checked) => {
        if (checked) {
            setSelectedCompanyIds(prevIds => [...prevIds, company.companyId]);
            setSummaryError("");
        } else {
            setSelectedCompanyIds(prevIds => prevIds.filter(id => id !== company.companyId));
        }
    }

    const handleSelectAllProjects = (checked) => {
        const allProjectIds = [];
        if (checked) {
            company.forEach(project => {
                allProjectIds.push(project.company);
            })
        }
        setSelectedCompanyIds(allProjectIds);
        setSummaryError("");
    }

    const getAllSelectedProject = (selectedCompanyIds, selectedSpocProjects) => {
        setSelectedCompanyIds(selectedCompanyIds);
        setSummaryError("");
    }
    const getSelectedUpdates = (selectedUpdates, detailedSelectedProject, updateData = "null") => {
        setSelectedUpdates(selectedUpdates);
        setDetailedSelectedUpdates(detailedSelectedProject);
        setAllUpdates(updateData);
    }

    const handleDownload = async (event) => {
        let isValid = true;
        if (selectedCompanyIds?.length === 0) {
            setSummaryError("Please select at least one summary to download.");
            isValid = false;
        } else {
            setSummaryError("");
        }
        if (!isValid) return;
        if (selectedCompanyIds.length === 0) {
            toast.error("Please select at least one project to download.");
            return;
        }

        try {
            const token = localStorage.getItem("tokens");
            const token_obj = JSON.parse(token);

            const response = await axios.get(
                `${BaseURL}/api/v1/projects/download-project-report`,
                {
                    headers: {
                        Authorization: `Bearer ${token_obj?.accessToken}`,
                    },
                    params: { companyIds: JSON.stringify(selectedCompanyIds) },
                    responseType: "blob",
                }
            );

            if (response.data) {
                const blob = new Blob([response.data], {
                    type: response.headers["content-type"],
                });
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;

                const contentDisposition = response.headers["content-disposition"];
                let fileName = "projects-report";

                if (contentDisposition) {
                    fileName = contentDisposition.split("filename=")[1]?.replace(/"/g, "");
                }

                // Get the file extension from the content-type header
                const contentType = response.headers["content-type"];
                let fileExtension = ".xlsx"; // Default extension
                if (contentType) {
                    if (contentType.includes("csv")) {
                        fileExtension = ".csv";
                    } else if (contentType.includes("pdf")) {
                        fileExtension = ".pdf";
                    } else if (contentType.includes("msword")) {
                        fileExtension = ".docx";
                    }
                }

                link.download = `${fileName}${fileExtension}`;
                document.body.appendChild(link);
                link.click();
                link.remove();

                toast.success("File downloaded successfully.");
                fetchProjects();
                handleClose();
            } else {
                toast.error("Failed to download. No data received.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error downloading file.");
        }
    };
    return isVisible ? (
        <Modal
            open={open}
            onClose={(event, reason) => {
                if (reason !== "backdropClick") {
                    handleClose();
                }
            }}
            disableEscapeKeyDown={true}
            sx={styles.modalStyle}
            id="update-modal"
        >
            <Paper sx={styles.paperStyle}>
                <Box sx={{ ...styles.box1Style, py: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "90%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", fontSize: "30px" }}>
                            <Typography variant="h6" sx={{ ...styles.titleStyle, fontSize: "20px" }}>
                                Download Projects
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <form onSubmit={() => { console.success("submitted"); }}>
                    <Box sx={{ height: '90%' }}>
                        <DownloadAccountModal open={addUpdatesOpen} getSelectedUpdates={getSelectedUpdates} handleClose={handleClose} interactionData={feedUpdates} projects={projects} handleSelectAllProjects={handleSelectAllProjects} handleSelectedCompany={handleSelectedCompany} getAllSelectedProject={getAllSelectedProject} />
                        {summaryError && (<Typography color="error" sx={{ mt: 1, ml: 2 }}>{summaryError}</Typography>)}
                    </Box>
                    <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "1rem" }}>
                        <Box><Typography>Selected {selectedCompanyIds?.length} comapany out of {projects?.length}</Typography></Box>
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
                                type="submit"
                                onClick={(e) => {

                                    e.preventDefault();
                                    handleDownload()
                                }
                                }
                            >
                                Download
                            </Button>

                        </Box>
                    </Box>
                </form>
                <Toaster />
            </Paper>
        </Modal >
    ) : null;
}

export default DownloadModalForm;