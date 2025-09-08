import { Box, Button, Modal, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Certainityaiicon from '../../../assets/Certainityai-icon.png';
import { useEffect } from "react";



const style = {
    modalStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 850,
        bgcolor: 'background.paper',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
        borderRadius: '12px',
    },
    caseIds: {
        backgroundColor: '#808080',
        color: '#ffffff'
    },
    cellStyle: {
        whiteSpace: "nowrap",
        borderRight: "1px solid #ddd",
        textAlign: "left",
        fontSize: "13px",
        py: 1,
    }

};



const SurveysMailSendModal = ({ handleSendMail, selectedProjects, detailedSelectedProjects, addNewInteractionFormik, confirmationModalOpen, handleConfimationModalClose, handleClose, detailedSelectedSurveyIds, purpose }) => {
    useEffect(() => {
    }, [detailedSelectedSurveyIds])

    return (
        <Modal
            open={confirmationModalOpen}
            onClose={(_, reason) => {
                handleConfimationModalClose();
            }}
        >

            <Box sx={style.modalStyle}>
                <Box sx={{ borderRadius: "20px" }}><img src={Certainityaiicon} alt="image-certainity" width="60px" style={{ borderRadius: "12px" }} /></Box>

                <Box sx={{ marginTop: "10px" }}>
                    <Paper sx={{ padding: "10px", overflow: "hidden" }}>
                        <Typography sx={{ marginLeft: "2%", fontWeight: 800, color: "#00A398" }}>Total Projects : {selectedProjects.length}</Typography>
                        <TableContainer sx={{ borderRadius: "5px", maxHeight: 440 }}>
                            <Table sx={{ minWidth: 450, width: 450, margin: "auto" }} aria-label="simple table">
                                <TableHead sx={{ backgroundColor: "rgba(64, 64, 64, 0.1)" }}>
                                    <TableRow>
                                        <TableCell align="center">Project Id</TableCell>
                                        <TableCell align="center">Project Name</TableCell>
                                        <TableCell align="center">Project Code</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ marginLeft: "10%" }}>
                                    {detailedSelectedProjects?.map((row, index) => (
                                        <TableRow
                                            key={row?.projectId}
                                        >
                                            <TableCell align="left" sx={{ ...style.cellStyle, borderLeft: "1px solid #ddd" }}>
                                                {row?.projectId || ""}
                                            </TableCell>
                                            <TableCell align="right" sx={{ ...style.cellStyle }}>{row?.projectName || 0}</TableCell>
                                            <TableCell align="left" sx={{ ...style.cellStyle, borderLeft: "1px solid #ddd" }}>
                                                {row?.projectCode || ""}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
                <Box sx={{ marginTop: "10px" }}><Typography>Would you like to proceed with sending the surveys ? </Typography></Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" style={{ backgroundColor: '#9F9F9F', marginRight: '10px', borderRadius: "20px" }} onClick={handleConfimationModalClose}>Cancel</Button>
                    <Button variant="contained" style={{ backgroundColor: '#00A398', marginRight: '10px', borderRadius: "20px" }} onClick={() => {
                        if (purpose === "Reminder") {
                            handleSendMail(addNewInteractionFormik.values.interactionTo, addNewInteractionFormik.values.interactionDesc, addNewInteractionFormik.values.ccRecipients, selectedProjects, detailedSelectedSurveyIds);
                        } else {
                            handleSendMail(addNewInteractionFormik.values.interactionTo, addNewInteractionFormik.values.interactionDesc, addNewInteractionFormik.values.ccRecipients, selectedProjects);
                        }
                        handleConfimationModalClose();
                        handleClose();
                    }}>Send</Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default SurveysMailSendModal;
