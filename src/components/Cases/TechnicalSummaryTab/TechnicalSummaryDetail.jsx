import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import EditMultiLineText from "./../TechnicalSummaryTab/EditMultiLineText";
import SummaryInfoboxTable from "../TechnicalSummaryTab/SummaryInfoboxTable"
import axios from 'axios';
import { BaseURL } from '../../../constants/Baseurl';
import TypographyDemo from '../../Common/TypographyDemo';
import { Authorization_header } from '../../../utils/helper/Constant';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TechnicalSummaryDetail = ({ handleShowSummaryListing, TechnicalSummaryId, usedfor, projectId, caseId }) => {
    const [isEditable, setIsEditable] = useState(false);
    const [textValue, setTextValue] = useState("");
    const [savedText, setSavedText] = useState("");
    const textFieldRef = useRef(null);
    const [summaryDetails, setSummaryDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const getSummaryDetails = async () => {
        setLoading(true);
        let url_suffix;
        // if (usedfor == 'case') {
        //     url_suffix = `caseId=${caseId}`;
        // } else if (usedfor == 'project') {
        //     url_suffix = `projectId=${projectId}`;
        // }
        try {
            const response = await axios.get(`${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/${TechnicalSummaryId}/summary?${url_suffix}`, Authorization_header());
            setTextValue(response?.data?.data[0].TechnicalSummary);
            setSavedText(response?.data?.data[0].TechnicalSummary);
            setSummaryDetails(response?.data?.data[0]);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error(err);
        }
    }

    useEffect(() => {
        getSummaryDetails();
    }, [TechnicalSummaryId, caseId, projectId]);

    useEffect(() => {
        if (isEditable && textFieldRef.current) {
            textFieldRef.current.focus();
        }
    }, [isEditable]);


    // const handleEditClick = () => {
    //     setIsEditable(true);
    // };

    const handleTextChange = (event) => {
        setTextValue(event.target.value);
    };

    // const handleSaveClick = () => {
    //     setSavedText(textValue);
    //     setIsEditable(false);
    // };

    return (
        <>
            {loading ? <TypographyDemo /> :
                <>
                    <Box sx={{ margin: "10px 0" }}>
                        <Typography sx={{ fontFamily: "Poppins", fontWeight: "500", fontSize: "1rem", lineHeight: "1.5px", marginLeft: "1.5rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                            <ArrowBackIcon
                                style={{
                                    verticalAlign: "middle",
                                    marginRight: "0rem",
                                    cursor: "pointer",
                                    color: "#29B1A8",
                                }}
                                onClick={handleShowSummaryListing}
                            />
                            <span onClick={handleShowSummaryListing} style={{ color: "#29B1A8", cursor: "pointer" }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>Technical Summary{" > "}</span>{summaryDetails?.TechnicalSummaryId}
                        </Typography>
                    </Box>
                    <Box>
                        <SummaryInfoboxTable summaryDetails={summaryDetails} />
                    </Box>
                    <Box sx={{ width: "96%", marginLeft: "15px", border: "none" }}>
                        <EditMultiLineText
                            width="20rem"
                            editable={isEditable}
                            value={textValue}
                            onChange={handleTextChange}
                            inputRef={textFieldRef}
                        />
                    </Box>
                </>
            }
            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: '50%', marginTop: '5px', marginLeft: "40px", marginBottom: "8px" }}>
                {isEditable ? (
                    <Button variant="contained" onClick={handleSaveClick} sx={{
                        backgroundColor: "#29B1A8",
                        '&:hover': {
                            backgroundColor: "#29B1A8",
                        },
                    }}>
                        Save
                    </Button>
                ) : (
                    <Button variant="contained" onClick={handleEditClick} sx={{
                        backgroundColor: "#29B1A8",
                        '&:hover': {
                            backgroundColor: "#29B1A8",
                        },
                    }}>
                        Edit
                    </Button>
                )}
            </Box> */}
        </>
    );
};

export default TechnicalSummaryDetail;