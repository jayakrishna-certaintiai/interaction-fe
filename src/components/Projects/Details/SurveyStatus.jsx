import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MultiLineTextField from "../../Cases/MultiLineTextField";
import NonEditableInput from "../../Common/NonEditableInput";
import { formattedDateOnly } from "../../../utils/helper/FormatDatetime";

const styles = {
    flexBox: {
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid #E4E4E4",
        px: 2,
    },
    flexBoxItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 2,
        mt: 2,
    },
    flexBoxItem2: {
        display: "flex",
        flexDirection: "column",
        mt: 0,
    },
    textStyle: {
        fontWeight: 600,
        mt: 1,
        mb: 1,
        cursor: "pointer",
    },
    expandMoreIcon: {
        borderRadius: "50%",
        fontSize: "15px",
        backgroundColor: "#404040",
        color: "white",
        mr: 1,
        transition: "transform 0.3s ease",
    },
    label: {
        mb: 1,
        color: "#404040",
        fontSize: "14px",
    },
    inputStyle: {
        mb: 2,
        "& .MuiInputBase-root": {
            borderRadius: "20px",
        },
        width: "100%",
    },
    questionsContainer: {
        maxHeight: "100px",
        overflowY: "auto",
        marginTop: "16px",
    },
};

function SurveyStatus({
    surveyDetails,
    sureveyQuestions,
    editedValues,
    sentToEmail,
}) {
    const [visibility, setVisibility] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [questionAnswer, setQuestionAnswer] = useState([]);

    const toggleVisibility = () => {
        setVisibility((prevVisibility) => !prevVisibility);
    };

    const handleAnswerChange = (e, index) => {
        const newAnswers = [...answers];
        newAnswers[index].ans = e.target.value;
        setAnswers(newAnswers);
    };

    return (
        <Box sx={styles.flexBox}>
            <Typography sx={styles.textStyle} onClick={toggleVisibility}>
                <ExpandMoreIcon
                    sx={{
                        ...styles.expandMoreIcon,
                        transform: visibility ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                />
                Survey Response
            </Typography>
            {visibility && (
                <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", padding: "-4px", height: "40px" }}>
                        <NonEditableInput
                            label="Survey - Sent Date"
                            value={formattedDateOnly(editedValues.surveySentDate)}
                            disabled
                        />
                        <NonEditableInput
                            label="Survey - Sent To"
                            value={(sentToEmail)}
                            disabled
                        />
                        <NonEditableInput
                            label="Survey - Response Date"
                            value={formattedDateOnly(editedValues.surveyResponseDate)}
                            disabled
                        />
                        <NonEditableInput
                            label="Reminder Sent Date"
                            value={formattedDateOnly(editedValues.reminderSentDate)}
                            disabled
                        />
                    </Box>
                    <Box sx={{
                        maxHeight: "430px",
                        overflowY: "auto",
                        marginTop: "16px",
                        border: "1px solid #E4E4E4",
                        borderRadius: "5px",
                        padding: "10px",
                    }}>
                        {sureveyQuestions && sureveyQuestions.length > 0 ? (
                            sureveyQuestions.map((questionObj, index) => (
                                <Box key={questionObj.questionId} sx={{ mb: 2 }}>
                                    <Typography sx={{ color: "#00A398" }}>
                                        <strong>Q{index + 1}:</strong> {questionObj.question}
                                    </Typography>
                                    <Typography>
                                        <em style={{ color: "#FD5707" }}>Answer:</em> {questionObj.answer || "No answer provided"}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography>No survey questions available.</Typography>
                        )}
                    </Box>
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
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={styles.questionsContainer}>
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
                </Box>

            )}
        </Box>
    );
}

export default SurveyStatus;
