import { Box, IconButton, Modal, Paper, Typography } from "@mui/material";
import EditMultiLineText from "../../TechnicalSummaryTab/EditMultiLineText";
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import SummaryInfoboxTable from "../../TechnicalSummaryTab/SummaryInfoboxTable";
import axios from "axios";
import { BaseURL } from "../../../../constants/Baseurl";
import { Authorization_header } from "../../../../utils/helper/Constant";
import TypographyDemo from "../../../Common/TypographyDemo";
import noTechSummary from "../../../../assets/No tech summary (2).webp";

const styles = {
    paperStyle: {
        borderRadius: "20px",
        maxWidth: "80%",
        maxHeight: "100vh",
        position: "absolute",
        transform: "translate(-0%, -0%)",
    },
    titleStyle: {
        mx: -0,
        textAlign: "left",
        fontWeight: 600,
        fontSize: "13px",
        p: 1
    },
    modalStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    box1Style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderBottom: "1px solid #E4E4E4",
        alignItems: "center",
    },
    noTechSummaryImage: {
        maxWidth: "60%",
        width: "100%",
        margin: "0 auto",
        display: "block",
        borderRadius: "20px",
    },
    noTechSummaryContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        textAlign: "center",
        padding: "20px",
    },
};

const TechSummaryModal = ({ open, handleClose, projectId, textFieldRef }) => {
    const [isVisible, setIsVisible] = useState(open);
    const [isLoading, setIsLoading] = useState(false);
    const [showTechSummary, setShowTechSummary] = useState(false);
    const [textValue, setTextValue] = useState("");
    const [summaryDetails, setSummaryDetails] = useState({});

    useEffect(() => {
        setIsVisible(open);
    }, [open]);

    const handleTextChange = () => {
        console.warn("Text changed");
    }

    const getSummaryDetails = async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            queryParams.append("projectId", projectId);

            const response = await axios.get(
                `${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/dummy/summary?${queryParams}`,
                Authorization_header()
            );

            const responseData = response?.data?.data;

            if (responseData && responseData.length > 0) {
                setSummaryDetails(responseData[0]);
                setTextValue(responseData[0]?.TechnicalSummary || "");
                setShowTechSummary(true);
            } else {
                setSummaryDetails({});
                setTextValue("");
                setShowTechSummary(false);
            }

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };


    useEffect(() => {
        if (isVisible) {
            getSummaryDetails();
        }
    }, [projectId, isVisible]);

    return (
        isVisible && (
            <Modal
                open={open}
                onClose={handleClose}
                sx={styles.modalStyle}
                id="update-modal"
            >
                <Paper sx={styles.paperStyle}>
                    <Box sx={{ ...styles.box1Style, py: 1 }}>
                        <IconButton
                            onClick={handleClose}
                            sx={{ position: "absolute", top: "5px", right: "5px" }}
                            aria-label="close"
                        >
                            <Close />
                        </IconButton>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "90%",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    fontSize: "30px",
                                    height: "100%"
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{ ...styles.titleStyle, fontSize: "20px" }}
                                >
                                    Technical Summary
                                </Typography>
                            </Box>
                            {isLoading ? (
                                <TypographyDemo />
                            ) : showTechSummary ? (
                                <>
                                    <SummaryInfoboxTable
                                        summaryDetails={summaryDetails}
                                    />
                                    <Box
                                        sx={{
                                            width: "98%",
                                            marginLeft: "15px",
                                            border: "none",
                                            maxHeight: "60%"
                                        }}
                                    >
                                        <EditMultiLineText
                                            width="20rem"
                                            editable={false}
                                            value={textValue}
                                            onChange={handleTextChange}
                                            inputRef={textFieldRef}
                                        />
                                    </Box>
                                </>
                            ) : (
                                <Box sx={styles.noTechSummaryContainer}>
                                    {/* <Typography variant="body1" sx={{ mb: 2 }}>
                                        No technical summary is available.
                                    </Typography> */}
                                    <img
                                        src={noTechSummary}
                                        alt="No Technical Summary"
                                        style={styles.noTechSummaryImage}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Modal>
        )
    );
};

export default TechSummaryModal;