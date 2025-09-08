import { Box, Button, Modal, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Certainityaiicon from '../../../assets/Certainityai-icon.png';
import { useEffect, useState } from "react";

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

const InteractionMailSendModal = ({ handleSendMail, selectedInteractions, detailedSelectedInteractions, addNewInteractionFormik, confirmationModalOpen, handleConfimationModalClose, handleClose, interactionPurpose }) => {
    const [allInteractions, setAllInteractions] = useState([]);
    const interactionsToSend = () => {
        const saveInteractiobs = detailedSelectedInteractions.map((int) => (int.interactionId))
        setAllInteractions(saveInteractiobs);
    }
    useEffect(() => {
        interactionsToSend();
    }, [])
    return (
        <Modal open={confirmationModalOpen} onClose={(_, reason) => {
            handleConfimationModalClose();
        }}>
            <Box sx={style.modalStyle}>
                <Box sx={{ borderRadius: "10px" }}>
                    <Paper sx={{ padding: "10px", overflow: "hidden", }}>
                        <Typography sx={{ marginLeft: "2%", fontWeight: 800, color: "#00A398" }}>Total Projects : {selectedInteractions.length}</Typography>
                        <TableContainer sx={{ borderRadius: "5px", maxHeight: 440 }}>
                            <Table sx={{ minWidth: 450, maxHeight: 400, width: 450, margin: "auto" }} aria-label="simple table">
                                <TableHead sx={{ backgroundColor: "rgba(64, 64, 64, 0.1)" }}>
                                    <TableRow>
                                        <TableCell align="center">Project Id</TableCell>
                                        <TableCell align="center">Project Name</TableCell>
                                        <TableCell align="center">Project Code</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ marginLeft: "10%" }}>
                                    {detailedSelectedInteractions?.map((row, index) => (
                                        <TableRow
                                            key={row?.interactionId}
                                        > <TableCell align="right" sx={{ ...style.cellStyle }}>{row?.projectId || 0}</TableCell>
                                            <TableCell align="left" sx={{ ...style.cellStyle, borderLeft: "1px solid #ddd" }}>
                                                {row?.projectName || ""}
                                            </TableCell>
                                            <TableCell align="right" sx={{ ...style.cellStyle }}>{row?.projectCode || 0}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ marginTop: "10px" }}><Typography>Would you like to proceed with sending the {interactionPurpose} ? </Typography></Box>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button variant="contained" style={{ backgroundColor: '#9F9F9F', marginRight: '10px', borderRadius: "20px" }} onClick={handleConfimationModalClose}>Cancel</Button>
                            <Button variant="contained" style={{ backgroundColor: '#00A398', marginRight: '10px', borderRadius: "20px" }} onClick={() => {
                                handleSendMail({
                                    interactionIds: [...allInteractions],
                                    sendInteraction: true
                                });
                                handleConfimationModalClose();
                                handleClose();
                            }}>Send</Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Modal>
    )
};

export default InteractionMailSendModal;