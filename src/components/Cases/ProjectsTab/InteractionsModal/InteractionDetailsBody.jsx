import { Close } from '@mui/icons-material';
import { Box, IconButton, Modal, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseURL } from '../../../../constants/Baseurl';
import { Authorization_header } from '../../../../utils/helper/Constant';
import TypographyDemo from '../../../Common/TypographyDemo';
import MultiLineTextField from '../../MultiLineTextField';

const styles = {
    paperStyle: {
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        borderRadius: "16px",
        margin: "10% auto",
        padding: "20px",
        maxWidth: "80%",
        height: "auto",
        position: "relative",
        backgroundColor: "#fff",
        minWidth: "800px", // Ensures a minimum width
    },
    titleStyle: {
        fontWeight: 600,
        fontSize: "18px",
        color: "#333",
    },
    modalStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    headerBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    infoBox: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "20px",
    },
    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "0 20px",
    },
    infoText: {
        fontSize: "14px",
        color: "#333",
        fontWeight: "500",
    },
    highlightText: {
        color: "#29B1A8",
        fontWeight: "600",
    },
    questionBox: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px",
        overflowY: "auto",
        maxHeight: "300px",
    },
    questionCard: {
        display: "flex",
        flexDirection: "column",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
    },
    questionText: {
        fontWeight: "500",
        marginBottom: "8px",
    },
};


const InteractionDetailsBody = ({ open, handleClose, interactionId }) => {
    const [isVisible, setIsVisible] = useState(open);
    const [interactionDetails, setInteractionDetails] = useState({});
    const [interactionDetail, setInteractionDetail] = useState({});
    const [loading, setLoading] = useState(false);

    const getInteractionDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/${interactionId}/interaction`, Authorization_header());
            setInteractionDetails(response?.data?.data);
        } catch (error) {
            console.error("error :", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setInteractionDetail(interactionDetails?.interactionInformation ? interactionDetails?.interactionInformation[0] : {})
    }, [interactionDetails])

    useEffect(() => {
        getInteractionDetails();
        setIsVisible(open);
    }, [])
    return (
        <Modal open={isVisible} onClose={handleClose} sx={styles.modalStyle}>
            <Paper sx={styles.paperStyle}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px" }}>
                    <Typography variant="h6" sx={styles.titleStyle}>
                        {`Interaction ${interactionDetail?.interactionIdentifier ? `: IN0${interactionDetail?.interactionIdentifier}` : ""} `}
                    </Typography>
                    <IconButton onClick={handleClose} aria-label="close">
                        <Close />
                    </IconButton>
                </Box>
                {loading ? (
                    <TypographyDemo />
                ) : (
                    <>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px" }}>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Project Name -{" "}<span style={{ color: "#FD5707" }}>{interactionDetail?.projectName}</span></Typography>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Project ID -{" "}<span style={{ color: "#FD5707" }}>{interactionDetail?.projectCode}</span></Typography>
                                    {/* <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Last Reminder Sent Date - <span style={{ color: "#29B1A8" }}>{formattedReminderDate}</span></Typography> */}
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px" }}>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Interaction sent to -{" "}<span style={{ color: "#29B1A8" }}> {interactionDetail?.sentTo} </span></Typography>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Interaction Responded Date -{" "}<span style={{ color: "#29B1A8" }}>{interactionDetail?.responseDate}</span></Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px" }}>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Interaction Status -{" "}<span style={{ color: "#29B1A8" }}>{interactionDetail?.status?.toLowerCase()}</span></Typography>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Interaction sent Date -{" "}<span style={{ color: "#29B1A8" }}>{interactionDetail?.sentDate}</span></Typography>
                                </Box>
                            </Box>
                            <Box sx={styles.questionBox}>
                                {interactionDetails?.interactionDetails?.map((qn, index) => (
                                    <Box sx={{ display: "flex", flexDirection: "column", boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", marginBottom: "10px", padding: "10px", borderRadius: "5px" }} key={qn?.id}>
                                        <Box width={"97%"}>{index + 1}. {qn?.question}</Box>
                                        <Box width={"97%"}>
                                            <MultiLineTextField value={qn?.answer} />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </>
                )}
            </Paper>
        </Modal>
    )
}

export default InteractionDetailsBody;