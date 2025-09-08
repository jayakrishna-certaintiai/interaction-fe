import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MailIcon from "@mui/icons-material/Mail";
import {
    Box,
    Button,
    IconButton,
    MenuItem,
    Modal,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { ActivityContext } from "../../context/ActivityContext";
import { BaseURL } from "../../constants/Baseurl";
import { CaseContext } from "../../context/CaseContext";
import SurveysAddProjectModal from "../Cases/surveysTab/SurveysAddProjectModal";
import SurveysMailSendModal from "../Cases/CaseModalComponets/SurveysMailSendModal";
import { Authorization_header } from "../../utils/helper/Constant";
import { token_obj } from "../../utils/helper/Constant";


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

function NewSurveysInteractionModal({
    open,
    handleClose,
    relatedTo,
    relationId,
    relationName,
    recieversEmail,
    handleSendMail,
    handleSurveysMailOpen,
    caseProjects,
    company,
    purpose,
    fetchSurveyList,
    caseSurveysList
}) {
    const { isVisible, setIsVisible } = useContext(ActivityContext);
    const { detailedCase } = React.useContext(CaseContext);
    const [selectedProjects, setSelectedProjects] = React.useState([]);
    const [addProjectsOpen, setAddProjectsOPen] = useState(open);
    const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
    const [confirmationProjects, setConfirmationProjects] = React.useState([]);
    const [detailedSelectedProjects, setDetailedSelectedProjects] = React.useState([]);
    const [allProjects, setAllProjects] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [detailedSelectedSurveyIds, setDetailedSelectedSurveyIds] = useState([]);
    const [allReminderSurveys, setAllReminderSurveys] = useState([]);


    const handleAllReminderSurveys = (value) => {
        setAllReminderSurveys(value);
    }

    const addNewInteractionFormik = useFormik({
        initialValues: {
            relatedTo: relatedTo,
            relationId: relationId,
            interactionDesc: "We trust this email finds you well.As we progress with the application for R&D Credits for project Auto generation of health records, we require additional information from your end to ensure comprehensive documentation. To facilitate this process, we have prepared a brief survey designed to gather essential data related to the project. Your input will greatly assist us in accurately assessing the project's eligibility for R&D Credits.Please take a moment to complete the survey by clicking theSURVEY LINK. Your responses are invaluable to us and will contribute significantly to our efforts.Upon completion, simply submit the survey, and your responses will be securely forwarded to us for further processing.",
            interactionSubject: null,
            interactionActivityType: "Interactions",
            ccRecipients: [],
            interactionTo: [],
            companyId: relatedTo === "Accounts" ? relationId : null,
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values) => {

            newInteraction(values)
                .then(() => {
                    addNewInteractionFormik.resetForm();
                })
                .catch((error) => {
                    console.error("Error adding user:", error);
                });
        },
    });

    const fetchData = async () => {
        setLoading(true);
        setAllProjects([]);
        try {
            if (detailedCase?.caseId) {

                const response = await axios.get(
                    `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${detailedCase?.caseId
                    }/projects`, Authorization_header()
                );

                const filterCaseProject = await response?.data?.data?.filter((task) => {
                    return task?.already_added === 0;
                });
                setAllProjects(filterCaseProject);
                // setFilteredProject(filterCaseProject);
                setSelectedProjects([]);
                setLoading(false);
                // setPage(0);
            } else {
                setLoading(false);
                setAllProjects([]);
                // setPage(0);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
            setAllProjects([]);
            // setPage(0);
        }
    };

    useEffect(() => {
        fetchData();
    }, [detailedCase?.caseId]);


    const handleConfimationModalOpen = () => {
        setConfirmationModalOpen(true);
    }

    const handleConfimationModalClose = () => {
        setConfirmationModalOpen(false);
    }

    const handleAddClose = () => {
        setAddProjectsOPen(false);
    }


    const handleExpandIconClick = () => {
        setIsVisible(!isVisible);
    };

    const getSelectedProjects = (selectedProjects, detailedSelectedProject, detailedSelectedSurveyIds = []) => {
        setSelectedProjects(selectedProjects);
        setDetailedSelectedProjects(detailedSelectedProject);
        if (purpose === "Reminder") {
            setDetailedSelectedSurveyIds(detailedSelectedSurveyIds);
        }
        // setAllProjects(companyProjects);
    }

    useEffect(() => {
        const ProjectsData = selectedProjects.map((project) => ({ projectName: project.projectName, projectId: project.projectId }));
        setConfirmationProjects(ProjectsData);
    }, [selectedProjects])

    const newInteraction = async (values) => {
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${BaseURL}/api/v1/interactions/${localStorage.getItem(
                "userid"
            )}/1/create-activity`,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token_obj.accessToken}`
            },
            data: values,
            // Authorization_header()
        };

        axios
            .request(config)
            .then((response) => {

                toast.success("Mail sent Successfully!");
                handleClose();
            })
            .catch((error) => {
                console.error(error);
                toast.error("Error sending the mail!");
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
            id="interaction-modal"
        >
            <Paper sx={styles.paperStyle}>
                <Box sx={{ ...styles.box1Style, py: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "90%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", fontSize: "30px" }}>

                            <Typography variant="h6" sx={{ ...styles.titleStyle, fontSize: "20px" }}>
                                Send {purpose} - <span style={{ color: "#29B1A8" }}>{detailedCase?.caseCode}</span>
                            </Typography>
                            <Typography sx={{ ...styles.labelStyle, fontSize: "20px" }}>Fiscal Year - <span style={{ color: "#29B1A8" }}>2023</span></Typography>
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
                <form onSubmit={addNewInteractionFormik.handleSubmit}>
                    <Box sx={{ height: '90%' }}>
                        <SurveysAddProjectModal open={addProjectsOpen} company={company} getSelectedProjects={getSelectedProjects} handleClose={handleAddClose} confirmationProjects={confirmationProjects} purpose={purpose} fetchSurveyList={fetchSurveyList} caseSurveysList={caseSurveysList} handleAllReminderSurveys={handleAllReminderSurveys} />
                    </Box>

                    <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "1rem" }}>
                        <Box><Typography>Selected {selectedProjects.length} projects out of {purpose === "Survey" ? allProjects.length : purpose === "Reminder" ? allReminderSurveys.length : 0}</Typography></Box>
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
                    {/* </form> */}
                </form>

                {confirmationModalOpen && <SurveysMailSendModal handleSendMail={handleSendMail} selectedProjects={selectedProjects} detailedSelectedProjects={detailedSelectedProjects} addNewInteractionFormik={addNewInteractionFormik} confirmationModalOpen={confirmationModalOpen} handleConfimationModalClose={handleConfimationModalClose} handleClose={handleClose} detailedSelectedSurveyIds={detailedSelectedSurveyIds} purpose={purpose} />}
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
                    <Box sx={{ ...styles.box1Style, py: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                            <MailIcon />
                            <Typography variant="h6" sx={styles.titleStyle}>
                                New Interaction - Email
                            </Typography>
                        </Box>

                        <Typography sx={styles.selStyle}>{relatedTo}</Typography>
                        <Typography sx={styles.selStyle}>{relationName}</Typography>

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
                </Paper>
            )}
        </>
    );
}

export default NewSurveysInteractionModal;

// handleSendMail(addNewInteractionFormik.values.interactionTo, addNewInteractionFormik.values.interactionDesc, addNewInteractionFormik.values.ccRecipients, selectedProjects);