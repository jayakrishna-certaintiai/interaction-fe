import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MailIcon from "@mui/icons-material/Mail";
import {
    Box,
    Button,
    IconButton,
    Modal,
    Paper,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { ActivityContext } from "../../context/ActivityContext";
import { BaseURL } from "../../constants/Baseurl";
import { CaseContext } from "../../context/CaseContext";
import SpocUpdateModal from "./SpocUpdateModal";
import SpocAddProjectModal from "./SpocAddProjectModal";

const token = localStorage.getItem("tokens");
const token_obj = JSON.parse(token);

const styles = {
    paperStyle: {
        boxShadow: "0px 3px 6px #0000001F",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "20px",
        margin: "auto",
        maxWidth: "80%",
        width: 1200,
        height: "800",
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

const validationSchema = yup.object({
});

const templateMessages = {
    reconcileHours: "Message for Reconcile Hours.",
    uploadTimesheet: "Message for Upload Timesheet.",
    uploadDocument: "Message for Upload Document.",
    updateDetails: "Message for Update Details.",
};

function SpocModalForm({
    open,
    handleClose,
    handleSendMail,
    updateData,
    updatePurpose,
    projects,
    fetchProjects
}) {
    const { isVisible, setIsVisible } = useContext(ActivityContext);
    const { detailedCase } = React.useContext(CaseContext);
    const [selectedUpdates, setSelectedUpdates] = React.useState([]);
    const [addUpdatesOpen, setAddupdatesOpen] = useState(open);
    const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
    const [confirmationUpdates, setConfirmationUpdates] = React.useState([]);
    const [detailedSelectedUpdates, setDetailedSelectedUpdates] = React.useState([]);
    const [allUpdates, setAllUpdates] = React.useState([]);
    const [feedUpdates, setFeedUpdates] = useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedProjectIds, setSelectedProjectIds] = useState([]);
    const [selectedSpocProjects, setSelectedSpocProjects] = useState([]);
    const [spocEmail, setSpockEmail] = useState("");
    const [spocName, setSpocName] = useState("");

    const handleSelectedProjects = (projectId, checked) => {
        if (checked) {
            setSelectedProjectIds([...selectedProjectIds, projectId]);

        } else {
            const updatedProjects = selectedProjectIds.filter(pr => (pr !== projectId));
            setSelectedProjectIds(updatedProjects);

        }
    }

    const handleSelectAllProjects = (checked) => {
        const allProjectIds = [];
        if (checked) {
            projects.forEach(project => {
                allProjectIds.push(project.projectId);
            })
        }
        setSelectedProjectIds(allProjectIds);

    }

    const getAllSelectedProject = (selectedProjectIds, selectedSpocProjects) => {
        setSelectedProjectIds(selectedProjectIds);
        setSelectedSpocProjects(selectedSpocProjects);
    }

    const getSpoDetails = (spocEmail, spocName) => {
        setSpockEmail(spocEmail);
        setSpocName(spocName);
    };


    const handleConfimationModalOpen = () => {
        setConfirmationModalOpen(true);

    }

    const handleConfimationModalClose = () => {
        setConfirmationModalOpen(false);
    }

    const handleAddClose = () => {
        setAddupdatesOpen(false);
    }


    const handleExpandIconClick = () => {
        setIsVisible(!isVisible);
    };

    const getSelectedUpdates = (selectedUpdates, detailedSelectedProject, updateData = "null") => {
        setSelectedUpdates(selectedUpdates);
        setDetailedSelectedUpdates(detailedSelectedProject);
        setAllUpdates(updateData);
    }

    const getUnsentData = () => {
        const newUpdates = updateData?.filter((i) => {
            return (i.status.toLowerCase() === "not sent")
        })
        setFeedUpdates(newUpdates);
    }

    const getSentData = () => {
        const newUpdates = updateData?.filter((i) => {

            return (i.status.toLowerCase() === "sent")
        })
        setFeedUpdates(newUpdates);
    }

    useEffect(() => {
        if (updatePurpose === "updates") { getUnsentData() }
        else if (updatePurpose === "reminder") { getSentData() }
    }, [updatePurpose]);


    useEffect(() => {
        const UpdatesData = selectedUpdates.map((project) => ({ updateId: project.updateId, projectId: project.projectId }));
        setConfirmationUpdates(UpdatesData);
    }, [selectedUpdates])

    const handleNewSpocUpdates = () => {
        handleNewUpdates({
            purpose: "PROJECT",
            ids: selectedProjectIds,
            spocName: spocName,
            spocEmail: spocEmail
        })
    }

    const handleNewUpdates = async (values) => {
        const tokens = localStorage.getItem('tokens');
        const token_obj = JSON.parse(tokens);
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${BaseURL}/api/v1/contacts/update-spoc`,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token_obj?.accessToken}`
            },
            data: values,
        };
        axios
            .request(config)
            .then((response) => {
                toast.success(response.data.message);
                fetchProjects();
                handleClose();
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.response.data.error.message);
            });
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
                                Update SPOC Details
                            </Typography>
                        </Box>
                        <Box sx={{ padding: "5px 10px" }}>
                            <p>{detailedCase?.companyName}</p>
                        </Box>
                    </Box>
                    <IconButton
                        sx={{ border: "1px solid #E4E4E4" }}
                        onClick={handleExpandIconClick}
                    >
                        <ExpandMoreIcon
                            sx={{
                                color: "#404040",
                                cursor: "pointer",
                                transform: !isVisible ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                            }}
                        />
                    </IconButton>
                </Box>
                <form onSubmit={() => { console.success("submitted"); }}>
                    <Box sx={{ height: '90%' }}>
                        <SpocAddProjectModal open={addUpdatesOpen} getSelectedUpdates={getSelectedUpdates} handleClose={handleClose} confirmationUpdates={confirmationUpdates} interactionData={feedUpdates} projects={projects} handleSelectAllProjects={handleSelectAllProjects} handleSelectedProjects={handleSelectedProjects} getAllSelectedProject={getAllSelectedProject} />
                    </Box>
                    <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "1rem" }}>
                        <Box><Typography>Selected {selectedProjectIds?.length} projects out of {projects?.length}</Typography></Box>
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
                                    handleConfimationModalOpen()
                                }
                                }
                            >
                                Proceed
                            </Button>

                        </Box>
                    </Box>
                </form>
                {confirmationModalOpen && <SpocUpdateModal handleSendMail={handleSendMail} selectedUpdates={selectedUpdates} detailedSelectedUpdates={detailedSelectedUpdates} confirmationModalOpen={confirmationModalOpen} handleConfimationModalClose={handleConfimationModalClose} handleClose={handleClose} updatePurpose={updatePurpose} getSpoDetails={getSpoDetails} handleNewSpocUpdates={handleNewSpocUpdates} />}
                <Toaster />
            </Paper>
        </Modal >
    ) : (
        <>
            {open && (
                <Paper
                    sx={{
                        width: 700,
                        borderRadius: "20px 20px 0px 0px",
                        position: "fixed",
                        bottom: isVisible ? 0 : 25,
                        right: 25,
                        transition: "bottom 0.3s ease",
                    }}
                >
                </Paper>
            )}
        </>
    );
}

export default SpocModalForm;