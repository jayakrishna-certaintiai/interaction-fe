import { Close } from '@mui/icons-material';
import { Box, IconButton, Modal, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import MultiLineTextField from '../../MultiLineTextField';
import TypographyDemo from '../../../Common/TypographyDemo';
import axios from 'axios';
import { BaseURL } from '../../../../constants/Baseurl';
import { Authorization_header } from '../../../../utils/helper/Constant';
import noSurveys from '../../../../assets/No surveys (2).webp';

const styles = {
    paperStyle: {
        // boxShadow: "0px 3px 6px #0000001F",
        // display: "flex",
        // flexDirection: "column",
        // gap: 2,
        borderRadius: "20px",
        margin: "auto",
        maxWidth: "90%",
        width: 1200,
        maxHeight: "100vh",
        position: "absolute",
        transform: "translate(-0%, -0%)",
    },
    titleStyle: {
        mx: 1.5,
        p: 1,
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

const SurveyModal = ({ open, handleClose, projectId }) => {
    const [isVisible, setIsVisible] = useState(open);
    const [questionAnswer, setQuestionAnswer] = useState([]);
    const [showSurveyDetail, setShowSurveyDetail] = useState(false);
    const [surveyDetails, setSurveyDetails] = useState({
        surveySentTo: "",
        surveySentOn: "",
        surveyStatus: "",
        surveyResponseDate: "",
        lastReminderDate: "",
        questionAnswer: "",
        surveyCode: "",
        projectName: "",
        projectIdentifier: "",
    });

    useEffect(() => {
        setIsVisible(open);
    }, [open]);
    const formattedReminderDate = surveyDetails.lastReminderDate?.replace(/Z$/, "");
    const formattedResponseDate = surveyDetails.surveyResponseDate?.replace(/Z$/, "");
    const formattedSentDate = surveyDetails.surveySentOn?.replace(/Z$/, "");
    const [loading, setLoading] = useState(false);

    const handleAnswerChange = (e, index) => {
        const newAnswers = [];
        newAnswers[index].ans = e.target.value;
    };

    const getSurveyDetails = async () => {
        setLoading(true);
        const queryParams = new URLSearchParams();
        try {
            queryParams.append("projectId", projectId);
            const res = await axios.get(`${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/dummy/surveydetails?${queryParams}`, Authorization_header());
            if (!res?.data?.data) {
                setLoading(false);
                setShowSurveyDetail(false);
                return;
            } else {
                setShowSurveyDetail(true);
            }
            const surveyDetails = res?.data?.data?.surveyDetails;
            setSurveyDetails({
                surveySentTo: surveyDetails?.sentTo,
                surveySentOn: surveyDetails?.sendOn,
                surveyStatus: surveyDetails?.status,
                surveyResponseDate: surveyDetails?.responseDate,
                lastReminderDate: surveyDetails?.lastReminderDate,
                surveyCode: surveyDetails?.surveyCode,
                projectName: surveyDetails?.projectName,
                projectIdentifier: surveyDetails?.projectIdentifier,
                questionAnswer: res?.data?.data?.questionAnswer,
            });
            setQuestionAnswer(res?.data?.data?.questionAnswer)
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isVisible) {
            getSurveyDetails();
        }
    }, [projectId, isVisible]);

    return isVisible && (
        <Modal open={open} onClose={handleClose}
            sx={styles.modalStyle}
            id="update-modal" >
            <Paper sx={showSurveyDetail ? { ...styles.paperStyle } : { ...styles.paperStyle, width: "800px" }}>
                <Box sx={{ ...styles.box1Style, py: 1 }}>
                    <IconButton onClick={handleClose} sx={{ position: "absolute", top: "5px", right: "5px" }} aria-label="close">
                        <Close />
                    </IconButton>
                    <Box sx={showSurveyDetail ? { display: "flex", flexDirection: "column", width: "98%", height: "100%" } : { display: "flex", flexDirection: "column", height: "100%", width: "98%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", fontSize: "30px", borderBottom: "1px solid #E4E4E4", }}>
                            <Typography variant="h6" sx={{ ...styles.titleStyle, fontSize: "20px" }}>
                                Survey
                            </Typography>
                        </Box>
                        {loading ? <TypographyDemo /> : !showSurveyDetail ? (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px", flexDirection: "column", marginTop: "30px" }}>
                                <img src={noSurveys} alt="No Surveys Available" style={{ width: "50%", borderRadius: "20px" }} />

                            </Box>
                        ) : <>
                            <Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px", paddingTop: "1rem" }}>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Project ID - <span style={{ color: "#FD5707" }}>{surveyDetails.projectIdentifier}</span></Typography>
                                    <Typography sx={{ fontSize: "15px", color: "black", fontWeight: "500" }}>Project Name - <span style={{ color: "#FD5707" }}>{surveyDetails.projectName}</span></Typography>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Last Reminder Sent Date - <span style={{ color: "#29B1A8" }}>{formattedReminderDate}</span></Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px" }}>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Survey sent to - <span style={{ color: "#29B1A8" }}> {surveyDetails.surveySentTo} </span></Typography>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Survey Responded Date - <span style={{ color: "#29B1A8" }}>{formattedResponseDate}</span></Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px" }}>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Survey Status - <span style={{ color: "#29B1A8" }}>{surveyDetails.surveyStatus}</span></Typography>
                                    <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Survey sent on - <span style={{ color: "#29B1A8" }}>{formattedSentDate}</span></Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px", maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
                                {questionAnswer.map((qn, index) => (
                                    <Box sx={{ display: "flex", flexDirection: "column", boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", marginBottom: "10px", padding: "10px", borderRadius: "5px" }} key={qn.questionId}>
                                        <Box width={"95%"} sx={{ margin: "10px" }}>{index + 1}. {qn.question}</Box>
                                        <Box width={"95%"}>
                                            <MultiLineTextField
                                                value={qn.answer}
                                                onChange={(e) => handleAnswerChange(e, index)}
                                                width="10rem"
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </>}
                    </Box>
                </Box>
            </Paper>
        </Modal>
    )
}

export default SurveyModal