import { Box, IconButton, Modal, Paper, Typography } from "@mui/material";
import EditMultiLineText from "../Cases/TechnicalSummaryTab/EditMultiLineText";
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import SummaryInfoboxTable from "../Cases/TechnicalSummaryTab/SummaryInfoboxTable";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import { Authorization_header } from "../../utils/helper/Constant";
import TypographyDemo from "../Common/TypographyDemo";
import { useLocation } from "react-router-dom";
import noTechSummary from "../../assets/No tech summary (2).webp";

const styles = {
    paperStyle: {
        boxShadow: "0px 3px 6px #0000001F",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "20px",
        margin: "auto",
        maxWidth: "90%",
        width: 800,
        maxHeight: "80vh",
        position: "absolute",
    },
    titleStyle: {
        mt: 2,
        mb: -4,
        textAlign: "center",
        fontWeight: 600,
        fontSize: "13px",
    },
    modalStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    contentContainer: {
        flex: 1,
        padding: "18px",
    },
    box1Style: {},
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


const ContentModal = ({ open, handleClose, selectedId, id, textFieldRef }) => {
    const [isVisible, setIsVisible] = useState(open);
    const [isLoading, setIsLoading] = useState(false);
    const [showTechSummary, setShowTechSummary] = useState(false);
    const [textValue, setTextValue] = useState("");

    useEffect(() => {
        setIsVisible(open);
    }, [open]);

    const handleTextChange = () => {
        console.warn("Text changed");
    };

    const getSummaryDetails = async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            queryParams.append("id", selectedId);
            const response = await axios.get(
                `${BaseURL}/api/v1/projects/getRnDContentBySequence?${queryParams}`,
                Authorization_header()
            );
            const responseData = response?.data?.content;
            console.log("API Response Data:", response.data);
            console.log("Content Data Type:", typeof responseData);
            console.log("Content Value:", responseData);

            // Handle different response formats
            if (responseData) {
                if (Array.isArray(responseData) && responseData.length > 0) {
                    // Handle array response (like in the commented-out version)
                    const content = responseData[0]?.TechnicalSummary || responseData[0] || "";
                    if (typeof content === 'string' && content.trim().length > 0) {
                        const formattedContent = content
                            .replace(/\n/g, "<br />")
                            .replace(
                                /(Q\).*?)(?=<br \/>)/g,
                                '<span style="color: #FD5707; display: block; margin-top: 1px;">$1</span>'
                            )
                            .replace(
                                /(Ans\).*?)(?=<br \/>|$)/g,
                                '<span style="display: block; margin-top: -19px;">$1</span>'
                            );

                        setTextValue(formattedContent);
                        setShowTechSummary(true);
                    } else {
                        setTextValue("");
                        setShowTechSummary(false);
                    }
                } else if (typeof responseData === 'string' && responseData.trim().length > 0) {
                    // Handle string response (like in the current version)
                    const formattedContent = responseData
                        .replace(/\n/g, "<br />")
                        .replace(
                            /(Q\).*?)(?=<br \/>)/g,
                            '<span style="color: #FD5707; display: block; margin-top: 1px;">$1</span>'
                        )
                        .replace(
                            /(Ans\).*?)(?=<br \/>|$)/g,
                            '<span style="display: block; margin-top: -19px;">$1</span>'
                        );

                    setTextValue(formattedContent);
                    setShowTechSummary(true);
                } else if (typeof responseData === 'object' && responseData !== null) {
                    // Handle object response
                    const content = responseData.TechnicalSummary || responseData.content || JSON.stringify(responseData);
                    if (content && content.trim().length > 0) {
                        const formattedContent = content
                            .replace(/\n/g, "<br />")
                            .replace(
                                /(Q\).*?)(?=<br \/>)/g,
                                '<span style="color: #FD5707; display: block; margin-top: 1px;">$1</span>'
                            )
                            .replace(
                                /(Ans\).*?)(?=<br \/>|$)/g,
                                '<span style="display: block; margin-top: -19px;">$1</span>'
                            );

                        setTextValue(formattedContent);
                        setShowTechSummary(true);
                    } else {
                        setTextValue("");
                        setShowTechSummary(false);
                    }
                } else {
                    setTextValue("");
                    setShowTechSummary(false);
                }
            } else {
                setTextValue("");
                setShowTechSummary(false);
            }

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.error("Error fetching data:", err);
            console.error("Error details:", {
                message: err.message,
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data
            });
            setTextValue("");
            setShowTechSummary(false);
        }
    };
    useEffect(() => {
        if (isVisible && selectedId) {
            console.log("Fetching content for selectedId:", selectedId);
            getSummaryDetails();
        }
    }, [selectedId, isVisible]);

    return (
        isVisible && (
            <Modal open={open} onClose={handleClose} sx={styles.modalStyle} id="update-modal">
                <Paper sx={styles.paperStyle}>
                    <Box sx={{ py: 1 }}>
                        <IconButton
                            onClick={handleClose}
                            sx={{ position: "absolute", top: "5px", right: "5px" }}
                            aria-label="close"
                        >
                            <Close />
                        </IconButton>
                        <Box sx={{ width: "100%" }}>
                            <Typography variant="h6" sx={{ ...styles.titleStyle, fontSize: "20px" }}>
                                Project Content
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={styles.contentContainer}>
                        {isLoading ? (
                            <TypographyDemo />
                        ) : showTechSummary ? (
                            <EditMultiLineText
                                width="20rem"
                                editable={false}
                                value={textValue}
                                onChange={handleTextChange}
                                inputRef={textFieldRef}
                            />
                        ) : (
                            <Box sx={styles.noTechSummaryContainer}>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    No Content Available
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Modal>
        )
    );
};

export default ContentModal;






// import { Box, IconButton, Modal, Paper, Typography } from "@mui/material";
// import EditMultiLineText from "../Cases/TechnicalSummaryTab/EditMultiLineText";
// import { useEffect, useState } from "react";
// import { Close } from "@mui/icons-material";
// import SummaryInfoboxTable from "../Cases/TechnicalSummaryTab/SummaryInfoboxTable";
// import axios from "axios";
// import { BaseURL } from "../../constants/Baseurl";
// import { Authorization_header } from "../../utils/helper/Constant";
// import TypographyDemo from "../Common/TypographyDemo";
// import { useLocation } from "react-router-dom";
// import noTechSummary from "../../assets/No tech summary (2).webp";

// const styles = {
//     paperStyle: {

//         boxShadow: "0px 3px 6px #0000001F",
//         display: "flex",
//         flexDirection: "column",
//         gap: 2,
//         borderRadius: "20px",
//         margin: "auto",
//         maxWidth: "90%",
//         width: 1200,
//         maxHeight: "80vh", // Limit height to 80% of the viewport height
//         overflowY: "auto", // Enable scrolling for the modal content
//         position: "absolute",
//         transform: "translate(-0%, -0%)",
//     },
//     titleStyle: {
//         mx: -6,
//         textAlign: "left",
//         fontWeight: 600,
//         fontSize: "13px",
//     },
//     modalStyle: {
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     box1Style: {
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         p: 2,
//         borderBottom: "1px solid #E4E4E4",
//         alignItems: "center",
//     },
//     noTechSummaryImage: {
//         maxWidth: "60%",
//         width: "100%",
//         margin: "0 auto",
//         display: "block",
//         borderRadius: "20px",
//     },
//     noTechSummaryContainer: {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         width: "100%",
//         height: "100%",
//         textAlign: "center",
//         padding: "20px",
//     },
// };

// const ContentModal = ({ open, handleClose, projectId, textFieldRef }) => {
//     const [isVisible, setIsVisible] = useState(open);
//     const [isLoading, setIsLoading] = useState(false);
//     const [showTechSummary, setShowTechSummary] = useState(false);
//     const [textValue, setTextValue] = useState("");
//     const [summaryDetails, setSummaryDetails] = useState({});

//     useEffect(() => {
//         setIsVisible(open);
//     }, [open]);

//     const handleTextChange = () => {
//         console.warn("Text changed");
//     }

//     const getSummaryDetails = async () => {
//         setIsLoading(true);
//         try {
//             const queryParams = new URLSearchParams();
//             queryParams.append("id", projectId);

//             const response = await axios.get(
//                 `${BaseURL}/api/v1/projects/getRnDContentBySequence?${queryParams}`,
//                 Authorization_header()
//             );

//             const responseData = response?.data?.content;
//             if (responseData && responseData.length > 0) {
//                 setSummaryDetails(responseData[0]);
//                 setTextValue(responseData[0]?.TechnicalSummary || "");
//                 setShowTechSummary(true);
//             } else {
//                 setSummaryDetails({});
//                 setTextValue("");
//                 setShowTechSummary(false);
//             }

//             setIsLoading(false);
//         } catch (err) {
//             setIsLoading(false);
//             console.error(err);
//         }
//     };


//     useEffect(() => {
//         if (isVisible) {
//             getSummaryDetails();
//         }
//     }, [projectId, isVisible]);

//     return (
//         isVisible && (
//             <Modal
//                 open={open}
//                 onClose={handleClose}
//                 sx={styles.modalStyle}
//                 id="update-modal"
//             >
//                 <Paper sx={styles.paperStyle}>
//                     <Box sx={{ ...styles.box1Style, py: 1 }}>
//                         <IconButton
//                             onClick={handleClose}
//                             sx={{ position: "absolute", top: "5px", right: "5px" }}
//                             aria-label="close"
//                         >
//                             <Close />
//                         </IconButton>
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 width: "90%",
//                             }}
//                         >
//                             <Box
//                                 sx={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "space-between",
//                                     width: "100%",
//                                     fontSize: "30px",
//                                 }}
//                             >
//                                 <Typography
//                                     variant="h6"
//                                     sx={{ ...styles.titleStyle, fontSize: "20px" }}
//                                 >
//                                     Technical Summary
//                                 </Typography>
//                             </Box>
//                             {isLoading ? (
//                                 <TypographyDemo />
//                             ) : showTechSummary ? (
//                                 <>
//                                     <SummaryInfoboxTable
//                                         summaryDetails={summaryDetails}
//                                     />
//                                     <Box
//                                         sx={{
//                                             width: "96%",
//                                             marginLeft: "15px",
//                                             border: "none",
//                                             maxHeight: "60%"
//                                         }}
//                                     >
//                                         <EditMultiLineText
//                                             width="20rem"
//                                             editable={false}
//                                             value={textValue}
//                                             onChange={handleTextChange}
//                                             inputRef={textFieldRef}
//                                         />
//                                     </Box>
//                                 </>
//                             ) : (
//                                 <Box sx={styles.noTechSummaryContainer}>
//                                     {/* <Typography variant="body1" sx={{ mb: 2 }}>
//                                         No technical summary is available.
//                                     </Typography> */}
//                                     <img
//                                         src={noTechSummary}
//                                         alt="No Technical Summary"
//                                         style={styles.noTechSummaryImage}
//                                     />
//                                 </Box>
//                             )}
//                         </Box>
//                     </Box>
//                 </Paper>
//             </Modal>
//         )
//     );
// };

// export default ContentModal;
