import { Box, Button, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import MultiLineTextField from '../MultiLineTextField';
import axios from 'axios';
import { BaseURL } from '../../../constants/Baseurl';
import TypographyDemo from '../../Common/TypographyDemo';
import { Authorization_header } from '../../../utils/helper/Constant';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TextField } from "@mui/material";
import { toast } from 'react-hot-toast';
import { Tooltip } from '@mui/material';


const styles = {
    buttonStyle: {
        mr: 1,
        ml: 14,
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#29B1A8",
        color: "white",
        "&:hover": { backgroundColor: "#FD5707" }
    }
}




const CaseInteractionDetails = ({ handleShowInteractionListing, interactionId, intrIndentifier }) => {
    const [message, setMessage] = useState("");
    const [questionAnswers, setQuestionAnswers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editableQA, setEditableQA] = useState([]);
    const [isSaving, setIsSaving] = useState(false);


    const [InteractionSentTo, setInteractionSentTo] = useState(null);
    const [interactionStatus, setInteractionStatus] = useState(null);
    const [responseDate, setResponseDate] = useState(null);
    const [lastReminderDate, setLastReminderDate] = useState(null);
    const [projectName, setProjectName] = useState(null);
    const [projectCode, setProjectCode] = useState(null);
    const [interactionSentDate, setInteractionSentDate] = useState(null);


    const getInteractionDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BaseURL}/api/v1/projects/${localStorage?.getItem("userid")}/${interactionId}/interaction`, Authorization_header())
            // const inteactionDetails = res?.data?.data?.surveyDetails;
            setMessage(response?.data?.data?.message);
            setQuestionAnswers(response?.data?.data?.interactionDetails);

            setEditableQA(response?.data?.data?.interactionDetails || []);

            const interactionInformation = response?.data?.data?.interactionInformation || [];
            const sentTo = interactionInformation.map(info => info.sentTo);
            const status = interactionInformation.map(info => info.status);
            const sentDate = interactionInformation.map(info => info.sentDate);
            const responseDate = interactionInformation.map(info => info.responseDate);
            const projectCode = interactionInformation.map(info => info.projectCode);
            const projectName = interactionInformation.map(info => info.projectName);
            setProjectName(projectName);
            setProjectCode(projectCode);
            setResponseDate(responseDate);
            setInteractionSentTo(sentTo);
            setInteractionStatus(status);
            setInteractionSentDate(sentDate);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        getInteractionDetails();
    }, [interactionId]);

    const formatDate = (date) => {
        if (typeof date === "string") {
            return date.replace('T', ' ').replace('Z', '').split('.')[0];
        }
        return date;
    };

    const formattedReminderDate = formatDate(lastReminderDate);
    const formattedResponseDate = formatDate(responseDate);
    const formattedSentDate = formatDate(interactionSentDate);

const handleSave = async () => {
    setIsSaving(true);
    try {
        const userId = localStorage.getItem("userid");
        const companyId = localStorage.getItem("companyid"); // Replace if stored differently
        const payload = {
            interactionDetails: editableQA,
            modifiedBy: userId
        };

    await axios.put(
      `${BaseURL}/api/v1/interactions/${userId}/${companyId}/${interactionId}/questions`,
      payload,
      Authorization_header()
    );

    // Optional: sync local state
    setQuestionAnswers(editableQA);
    setIsEditing(false);
    toast.success("Changes saved successfully!");
  } catch (error) {
    console.error("Failed to save interaction Q&A:", error);
    toast.error("Failed to save. Please try again.");
    alert("Failed to save. Please try again.");
  }
};

const hasAnyAnswer = editableQA.some((qa) => qa?.answer && qa.answer.trim() !== "");



    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row", }}>
                <Box sx={{ width: "100%" }}>
                    <Typography sx={{ fontSize: "1rem", lineHeight: "1.5px", marginLeft: "1.5rem", marginTop: "0.5rem", cursor: "pointer" }} onClick={handleShowInteractionListing}>
                        <ArrowBackIcon
                            style={{
                                verticalAlign: "middle",
                                marginRight: "0rem",
                                cursor: "pointer",
                                color: "#29B1A8",
                            }}
                            onClick={handleShowInteractionListing}
                        />
                        <span
                            style={{ color: "#29B1A8", cursor: "pointer", }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >Interactions{" > "}
                        </span>
                        {intrIndentifier}
                    </Typography>
                    {/* Edit/Save Button */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "0 25px", gap: "10px", marginTop: "10px" }}>
                        {!isEditing ? (
                            <Tooltip title={hasAnyAnswer ? "Cannot edit..." : "Edit questions"}>
                                <span>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={styles.buttonStyle}
                                        onClick={() => setIsEditing(true)}
                                        disabled={hasAnyAnswer}
                                            >
                                        Edit
                                    </Button>
                                </span>
                            </Tooltip>
                        ) : (
                            <Tooltip title={isSaving ? "Saving in progress..." : "Save changes"}>
                                <span>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={styles.buttonStyle}
                                         onClick={handleSave}
                                        disabled={isSaving}
                                    >
                                    {isSaving ? "Saving..." : "Save"}
                                    </Button>
                                </span>
                            </Tooltip>
                        )}
                    </Box>

                    {/* Project Metadata */}
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px" }}>
                            <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Project Name - <span style={{ color: "#FD5707" }}>{projectName}</span></Typography>
                            <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Project ID - <span style={{ color: "#FD5707" }}>{projectCode}</span></Typography>
                            {/* <Typography sx={{ fontSize: "12px", color: "black", fontWeight: "500" }}>Last Reminder Sent Date - <span style={{ color: "#29B1A8" }}>{formattedReminderDate}</span></Typography> */}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px" }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    color: "black",
                                    fontWeight: "500"
                            }}>Interaction sent to -
                                <span
                                    style={{
                                        color: "#29B1A8" }}
                                > {InteractionSentTo}
                                </span>
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    color: "black",
                                    fontWeight: "500"
                            }}>Interaction Responded Date -
                                <span style={{
                                    color: "#29B1A8"
                                }}>{formattedResponseDate}
                                </span>
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 25px" }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    color: "black",
                                    fontWeight: "500"
                            }}>Interaction Status -
                                <span
                                    style={{
                                        color: "#29B1A8" }}>{interactionStatus}
                                </span>
                            </Typography>
                            <Typography sx={{
                                fontSize: "12px",
                                color: "black",
                                fontWeight: "500" }}>Interaction sent Date -
                                <span style={{
                                    color: "#29B1A8" }}>{formattedSentDate}
                                </span>
                            </Typography>
                        </Box>
                    </Box>
                    {/* Q&A Content */}
                    {loading ? <TypographyDemo /> :
                        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px", overflowY: "auto" }}>
                            {editableQA?.map((qn, index) => (
                                <Box
                                    key={qn?.id}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                        marginBottom: "10px",
                                        padding: "10px",
                                        borderRadius: "5px"
                                }}
                                >
                                {/* Question */}
                                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "6px" }}>
                                        <Typography sx={{ minWidth: "24px", fontWeight: 600 }}>{index + 1}.</Typography>
                                        <Box sx={{ flexGrow: 1 }}>
                                        {isEditing ? (
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                value={qn?.question}
                                                onChange={(e) => {
                                                    const updated = [...editableQA];
                                                    updated[index].question = e.target.value;
                                                    setEditableQA(updated);
                                                }}
                                                sx={{
                                                    marginBottom: "8px",
                                                    "& .MuiOutlinedInput-root": {
                                                        backgroundColor: "#fffbea"
                                                    }
                                            }}
                                            />
                                        ) : (
                                            <Typography>{qn?.question}</Typography>
                                        )}
                                        </Box>
                                    </Box>
                                    {/* Answer */}
                                    <Box
                                        width={"97%"}
                                        sx={{ marginLeft: "34px" }}
                                    >
                                        <TextField
                                            multiline
                                            minRows={3}
                                            fullWidth
                                            value={qn?.answer}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        sx={{ backgroundColor: "#f5f5f5" }}
                                      />
                                    </Box>
                                </Box>
                            ))}

                        </Box>
                    }
                </Box>
            </Box>
        </>
    )
}

export default CaseInteractionDetails;
