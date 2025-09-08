import { Box, Modal, Typography, Table, Button, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";
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
    },
    uploadButtonStyle: {
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#00A398",
        "&:hover": { backgroundColor: "#00A398" },
    },
};

const SpocUpdateModal = ({ detailedSelectedUpdates, confirmationModalOpen, handleConfimationModalClose, handleClose, handleUpdate, getSpoDetails, handleNewSpocUpdates }) => {
    const [allUpdates, setAllUpdates] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateEmail = (email) => {
        if (!emailPattern.test(email)) {
            setEmailError("Please enter a valid email address.");
            return false;
        }
        setEmailError('');
        return true;
    };

    const validateName = (name) => {
        if (name.trim() === '') {
            setNameError("Name cannot be empty.");
            return false;
        }
        setNameError('');
        return true;
    };

    const updatesToSend = () => {
        const saveInteractions = detailedSelectedUpdates.map((int) => (int.updateId));
        setAllUpdates(saveInteractions);
    }

    useEffect(() => {
        updatesToSend();
    }, []);

    useEffect(() => {
        if (validateEmail(email) && validateName(name)) {
            getSpoDetails(email, name);
        }
    }, [email, name]);

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        validateEmail(emailValue);
    };

    const handleNameChange = (e) => {
        const nameValue = e.target.value;
        setName(nameValue);
        validateName(nameValue);
    };

    const handleUpdateClick = () => {
        if (validateEmail(email) && validateName(name)) {
            handleNewSpocUpdates();
            handleConfimationModalClose();
            handleClose();
        }
    };

    return (
        <Modal open={confirmationModalOpen} onClose={(_, reason) => {
            handleConfimationModalClose();
        }}>
            <Box sx={style.modalStyle}>
                <Box sx={{ borderRadius: "10px" }}>
                    <Paper sx={{ padding: "10px", overflow: "hidden", }}>
                        <Typography sx={{ marginLeft: "2%", fontWeight: 800, color: "#00A398" }}>Write SPOC Name & SPOC Email</Typography>
                        <TableContainer sx={{ borderRadius: "5px", maxHeight: 440 }}>
                            <Table sx={{ minWidth: 450, maxHeight: 400, width: 450, margin: "auto" }} aria-label="simple table">
                                <TableHead sx={{ backgroundColor: "rgba(64, 64, 64, 0.1)", bgcolor: 'background.paper', }}>
                                    <TableRow>
                                        <TextField
                                            fullWidth
                                            label="SPOC Name"
                                            value={name}
                                            onChange={handleNameChange}
                                            margin="normal"
                                            error={!!nameError}
                                            helperText={nameError}
                                        />
                                        <TextField
                                             fullWidth
                                             id="spoc-email"
                                             label="SPOC Email"
                                             value={email}
                                             onChange={handleEmailChange}
                                             margin="normal"
                                             error={!!emailError}
                                             helperText={emailError}
                                        />
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer>

                        <Box sx={{ marginTop: "10px" }}><Typography>Would you like to update with SPOC Name & SPOC Mail? </Typography></Box>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button variant="contained" style={{ backgroundColor: "#9F9F9F", marginRight: '10px', borderRadius: "20px" }} onClick={handleConfimationModalClose}>Cancel</Button>
                            <Button variant="contained" style={{ ...style.uploadButtonStyle, backgroundColor: '#00A398', marginRight: '10px', borderRadius: "20px" }} onClick={handleUpdateClick}>Update</Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Modal>
    );
};

export default SpocUpdateModal;
