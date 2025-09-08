import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import MultiLineTextField from '../MultiLineTextField';

const questions = [
    { qn: "Please provide an overview of the project's purpose with regard to what you were trying to accomplish in terms of features and/or functionalities. Who was the primary user, overall goals, etc." },
    { qn: "How is this project intended to ELIMINATE UNCERTAINTY? (Refer to the diagram to assist you in answering this question.)" },
    { qn: "How is this project TECHNOLOGICAL IN NATURE? (Refer to the diagram to assist you in answering this question.)" },
    { qn: "Please describe the PROCESS OF EXPERIMENTATION implemented throughout this project. - (Refer to the diagram to assist you in answering this question.)" }
];

const answerTemplate = [
    { ans: "" },
    { ans: "" },
    { ans: "" },
    { ans: "" }
];

const styles = {
    buttonStyle: {
        mr: 1,
        ml: 14,
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#9F9F9F",
        color: "white",
        "&:hover": { backgroundColor: "#9F9F9F" }
    }
}

const CaseDetailQuestionsTab = () => {
    const [ answers, setAnswers ] = React.useState(answerTemplate);

    const handleAnswerChange = (e, index) => {
        const newAnswers = [ ...answers ]; // Create a copy of answers array
        newAnswers[ index ].ans = e.target.value;
        setAnswers(newAnswers);
    };

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <Typography sx={{ fontFamily: "Poppins", fontWeight: "400", fontSize: "1rem", lineHeight: "1.5px", marginLeft: "1.5rem", marginTop: "0.5rem" }}>Surveys{">"}SURINFIUK23024</Typography>
                    <Typography sx={{ fontFamily: "Poppins", fontWeight: "400", fontSize: "0.7rem", marginLeft: "1.5rem", marginTop: "0.5rem" }}>Project {">"} Proj0003 {" "} Auto-generation of Health Records</Typography>
                </Box>
                <Box>
                    <Button sx={styles.buttonStyle}>Send Reminder</Button>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px", maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
                {questions.map((qn, index) => (
                    <Box sx={{ display: "flex", flexDirection: "row", boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", marginBottom: "10px", padding: "10px", borderRadius: "5px" }} key={index}>
                        <Box width={"50%"}>{qn.qn}</Box>
                        <Box width={"50%"}>
                            <MultiLineTextField value={answers[ index ].ans} onChange={(e) => handleAnswerChange(e, index)} width="10rem" />
                        </Box>
                    </Box>
                ))}
            </Box>
        </>
    );
};

export default CaseDetailQuestionsTab;
