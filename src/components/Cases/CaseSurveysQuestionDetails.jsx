import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import MultiLineTextField from './MultiLineTextField';
import { CaseContext } from '../../context/CaseContext';
import { BaseURL } from '../../constants/Baseurl';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import TypographyDemo from '../Common/TypographyDemo';
import { Authorization_header } from '../../utils/helper/Constant';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const styles = {
    buttonStyle: {
        mr: 4,
        ml: 14,
        mb: -3,
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#9F9F9F",
        color: "white",
        "&:hover": { backgroundColor: "#9F9F9F" }
    }
};

const CaseSurveysQuestionDetails = ({ handleShowSurveyDetails, selectedSurveyId, reminderStatusId }) => {
    const [answers, setAnswers] = useState([]);
    const { detailedCase } = useContext(CaseContext);
    const [surveySentTo, setSurveySentTo] = useState(null);
    const [surveySentOn, setSurveySentOn] = useState(null);
    const [surveyStatus, setSurveyStatus] = useState(null);
    const [surveyResponseDate, setSurveyResponseDate] = useState(null);
    const [lastReminderDate, setLastReminderDate] = useState(null);
    const [questionAnswer, setQuestionAnswer] = useState([]);
    const [surveyCode, setSurveyCode] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [projectName, setProjectName] = useState(null);
    const [projectCode, setProjectCode] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnswerChange = (e, index) => {
        const newAnswers = [...answers];
        newAnswers[index].ans = e.target.value;
        setAnswers(newAnswers);
    };

    useEffect(() => {
        const getCaseDetailsByCaseAndSurveyId = async () => {
            setLoading(true);
            try {
                const caseId = detailedCase.caseId;
                const surveyId = selectedSurveyId;
                const res = await axios.get(`${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${surveyId}/surveydetails`, Authorization_header());
                const surveyDetails = res?.data?.data?.surveyDetails;
                setSurveySentTo(surveyDetails?.sentTo);
                setSurveySentOn(surveyDetails?.sendOn);
                setSurveyStatus(surveyDetails?.status);
                setSurveyResponseDate(surveyDetails?.responseDate);
                setLastReminderDate(surveyDetails?.lastReminderDate);
                setSurveyCode(surveyDetails?.surveyCode);
                setProjectId(surveyDetails?.projectId);
                setProjectName(surveyDetails?.projectName);
                setProjectCode(surveyDetails?.projectCode);
                setQuestionAnswer(res?.data?.data?.questionAnswer);
                setAnswers(res?.data?.data?.questionAnswer.map(q => ({ ans: q.answer })));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (detailedCase && selectedSurveyId) {
            getCaseDetailsByCaseAndSurveyId();
        }
    }, [detailedCase, selectedSurveyId]);

    const handleSendReminder = async () => {
        toast.loading("Sending reminder...")
        try {
            const res = await axios.post(
                `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${selectedSurveyId}/updatesurvey`,
                {
                    surveyStatusId: reminderStatusId,
                },
                Authorization_header()
            );
            // fetchSurveyList();
            toast.dismiss();
            toast.success("Reminder send successfully")
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to send reminder")
            console.error(err);
        }
    }

    const formattedReminderDate = lastReminderDate?.replace(/Z$/, "");
    const formattedResponseDate = surveyResponseDate?.replace(/Z$/, "");
    const formattedSentDate = surveySentOn?.replace(/Z$/, "");


    return (
        loading ? (
            <TypographyDemo />
        ) : (
            <>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Box sx={{ margin: "10px 0" }}>
                        <Typography
                            sx={{
                                fontFamily: "Poppins",
                                fontWeight: "500",
                                fontSize: "1rem",
                                lineHeight: "1.5px",
                                marginLeft: "1.5rem",
                                marginTop: "1rem",
                                marginBottom: "0rem",
                            }}
                        >
                            <ArrowBackIcon
                                style={{
                                    verticalAlign: "middle",
                                    marginRight: "0rem",
                                    cursor: "pointer",
                                    color: "#29B1A8",
                                }}
                                onClick={handleShowSurveyDetails}
                            />
                            <span
                                onClick={handleShowSurveyDetails}
                                style={{ color: "#29B1A8", cursor: "pointer" }}
                                onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                            >
                                Surveys
                            </span>
                            {">"}
                            {surveyCode}
                        </Typography>
                    </Box>
                    <Box>
                        {surveyStatus?.toLowerCase() !== "revoked" && <Button sx={{ ...styles.buttonStyle, backgroundColor: '#29B1A8' }} onClick={handleSendReminder}>Send Reminder</Button>}
                    </Box>
                </Box>
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px" }}>
                        <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Project Code - <span style={{ color: "#FD5707" }}>{projectCode}</span></Typography>
                        <Typography sx={{ fontSize: "15px", color: "black", fontWeight: "500" }}>Project Name - <span style={{ color: "#FD5707" }}>{projectName}</span></Typography>
                        <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Last Reminder Sent Date - <span style={{ color: "#29B1A8" }}>{formattedReminderDate}</span></Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px" }}>
                        <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Survey sent to - <span style={{ color: "#29B1A8" }}> {surveySentTo} </span></Typography>
                        <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Survey Responded Date - <span style={{ color: "#29B1A8" }}>{formattedResponseDate}</span></Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px" }}>
                        <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Survey Status - <span style={{ color: "#29B1A8" }}>{surveyStatus}</span></Typography>
                        <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Survey sent on - <span style={{ color: "#29B1A8" }}>{formattedSentDate}</span></Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px", maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
                    {questionAnswer.map((qn, index) => (
                        <Box sx={{ display: "flex", flexDirection: "row", boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", marginBottom: "10px", padding: "10px", borderRadius: "5px" }} key={qn.questionId}>
                            <Box width={"50%"} sx={{ margin: "10px" }}>{index + 1}. {qn.question}</Box>
                            <Box width={"50%"}>
                                <MultiLineTextField
                                    value={answers[index].ans}
                                    onChange={(e) => handleAnswerChange(e, index)}
                                    width="10rem"
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Toaster />
            </>
        )
    );
};

export default CaseSurveysQuestionDetails;

// sx = {{ '&:hover': { textDecoration: "underlined" } }}