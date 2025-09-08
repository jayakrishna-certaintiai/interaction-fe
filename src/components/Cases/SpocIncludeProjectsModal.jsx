import { Box, Button, IconButton, Modal, Paper, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CaseContext } from '../../context/CaseContext';
import SpocSelectProjectModal from './SpocSelectProjectModal';
import AddSpocDetails from '../Common/AddSpocDetails';
import { BaseURL } from '../../constants/Baseurl';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Authorization_header } from '../../utils/helper/Constant';


const styles = {
    paperStyle: {
        boxShadow: "0px 3px 6px #0000001F",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "20px",
        margin: "auto",
        maxWidth: "90%",
        width: 1200,
        height: "800",
        position: "absolute",
        transform: "translate(-0%, -0%)",
    },
    titleStyle: {
        mx: -6,
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
        flexDirection: "column",
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

const SpocIncludeProjectsModal = ({ open, handleClose, updatePurpose, projects, postUpdate }) => {
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [spocDetails, setSpocDetails] = useState({ spocName: "", spocEmail: "" });
    const [conformationModalOpen, setConformationModalOpen] = useState(false);
    const { detailedCase } = useContext(CaseContext);
    const [isVisible, setIsVisible] = useState(true);
    const [filteredProjects, setFilteredProjects] = useState([]);



    useEffect(() => {
        setSelectedProjects([]);
    }, [open])

    const handleSelectProjects = (projectId, checked) => {
        if (checked) {
            setSelectedProjects([...selectedProjects, projectId]);
        } else {
            const updateProjects = selectedProjects.filter(pr => pr !== projectId);
            setSelectedProjects(updateProjects);
        }
    }

    const getSpocDetails = (name, email) => {
        setSpocDetails({ spocName: name, spocEmail: email });
    }

    const getFilteredProjects = (filteredProjects) => {
        setFilteredProjects(filteredProjects);
    }

    const handleSelectAllProjects = (checked) => {
        if (checked) {
            const allProjects = filteredProjects.map(pr => (updatePurpose === "Surveys" ? pr?.caseProjectId : updatePurpose === "Interactions" ? pr.interactionId : ""))
            setSelectedProjects(allProjects);
        } else {
            setSelectedProjects([]);
        }
    }

    const handleConfirmationModalOpen = () => {
        setConformationModalOpen(true);
    }

    const handleConfimationModalClose = () => {
        setConformationModalOpen(false);
    }

    const handleExpandIconClick = () => {
        setIsVisible(!isVisible);
    };

    const handleUpdateSpocDetails = async () => {
        const apiUrl = `${BaseURL}/api/v1/contacts/update-spoc`;
        const data = {
            purpose: updatePurpose.slice(0, -1).toUpperCase(),
            ids: selectedProjects,
            spocName: spocDetails.spocName,
            spocEmail: spocDetails.spocEmail,
        };

        toast.promise((async () => {
            const response = await axios.post(apiUrl, data, Authorization_header());
            if (response) {
                postUpdate();
            }
            return response;
        })(),
            {
                loading: "Updating the SPOC details...",
                success: respose => respose?.data?.message || "Spoc details updated successfully",
                error: response => response?.error?.message || "Failed to update SPOC details",
            }
        )


        setSelectedProjects([]);
    }

    return isVisible ? (
        <Modal open={open} onClose={(event) => {
            handleClose();
        }}
            sx={styles.modalStyle}
            id="update-modal"
        >
            <Paper sx={styles.paperStyle}>
                <Box sx={{ ...styles.box1Style, py: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "90%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", fontSize: "30px" }}>
                            <Typography variant='h6' sx={{ ...styles.titleStyle, fontSize: "20px" }}>
                                Update SPOC Details
                            </Typography>
                            <Box sx={{ padding: "5px 10px" }}>
                                <p>{detailedCase?.companyName}</p>
                            </Box>

                            <IconButton sx={{ border: "1px solid #E4E4E4" }} onClick={handleExpandIconClick}>
                                <ExpandMoreIcon sx={{ color: "#404040", cursor: "pointer", transform: !isVisible ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", }} />
                            </IconButton>

                        </Box>
                    </Box>
                    <form>
                        <Box sx={{ height: "90%" }}>
                            <SpocSelectProjectModal projects={projects} handleSelectProjects={handleSelectProjects} handleSelectAllProjects={handleSelectAllProjects} updatePurpose={updatePurpose} getFilteredProjects={getFilteredProjects} />
                        </Box>
                        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "1rem" }}>
                            <Box><Typography>Selected {selectedProjects?.length || 0} {updatePurpose} out of {filteredProjects?.length || 0}</Typography></Box>
                            <Box sx={styles.buttonBox}>
                                <Button variant='contained' sx={styles.buttonStyle} onClick={handleClose}>Cancel</Button>
                                <Button variant='contained' sx={styles.uploadButtonStyle} type='submit' onClick={(e) => {
                                    e.preventDefault();
                                    handleConfirmationModalOpen();
                                }}>Proceed</Button>
                            </Box>
                        </Box>
                    </form>
                    {conformationModalOpen && <AddSpocDetails conformationModalOpen={conformationModalOpen} handleConfimationModalClose={handleConfimationModalClose} handleUpdateSpocDetails={handleUpdateSpocDetails} getSpocDetails={getSpocDetails} handleClose={handleClose} />}
                </Box>
            </Paper>
        </Modal>
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

export default SpocIncludeProjectsModal


// SpocIncludeProjectsModal