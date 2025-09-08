import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const SurveyAnswer = ({ answer }) => {
    const [formattedAnswer, setFormattedAnswer] = useState("");
    const [fullAnswer, setFullAnswer] = useState(false);

    const formatAnswer = () => {
        if (fullAnswer) {
            setFormattedAnswer(answer);
        } else if (answer.length > 200) {
            const newAnswer = answer.slice(0,200);
            setFormattedAnswer(newAnswer);
        } else {
            setFormattedAnswer(answer);
        }
    }

    useEffect(() => {
        formatAnswer();
    }, [answer,fullAnswer]);

    return (
        <>
            <Typography variant="body2" gutterBottom><strong>Answer:</strong> {fullAnswer ? <span>{formattedAnswer} </span>: <span>{formattedAnswer}{answer.length > 200 && (<span style={{color:'blue', cursor:'pointer'}} onClick={()=>{setFullAnswer(true)}}>...read more</span>)}</span>}</Typography>
        </>
    )
}

export default SurveyAnswer;