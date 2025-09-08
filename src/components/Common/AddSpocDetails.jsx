import React, { useEffect, useState } from 'react'
import { Box, Modal, Typography, Table, Button, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";

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
    buttonBox: {
        mt: 1,
        display: "flex",
        justifyContent: "flex-end",
        px: 2,
        mb: 2,
    },
    uploadButtonStyle: {
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#00A398",
        "&:hover": { backgroundColor: "#00A398" },
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
    
};

const AddSpocDetails = ({ conformationModalOpen, handleConfimationModalClose, handleUpdateSpocDetails, handleClose, getSpocDetails }) => {
    const [spocName, setSpocName] = useState("");
    const [spocEmail, setSpocEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [nameError, setNameError] = useState("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateEmail = (spocEmail) => {
        if (!emailPattern.test(spocEmail)) {
            setEmailError("Please enter a valid email address");
            return false;
        }
        setEmailError("");
        return true;
    }

    const validateName = (name) => {
        if (name.trim() === "") {
            setNameError("Name cannot be empty.");
            return false;
        }
        setNameError("");
        return true;
    }

    useEffect(() => {
        if (validateEmail(spocEmail) && validateName(spocName)) {
            getSpocDetails(spocName, spocEmail);
        }
    }, [spocName, spocEmail])

    const handleEmailChange = (e) => {
        const emailValue = e?.target?.value;
        setSpocEmail(emailValue);
        validateEmail(emailValue);
    }

    const handleNameChange = (e) => {
        const nameValue = e?.target?.value;
        setSpocName(nameValue);
        validateName(nameValue);
    }

    const handleUpdate = () => {
        if (validateEmail(spocEmail) && validateName(spocName)) {
            handleUpdateSpocDetails();
            handleConfimationModalClose();
            handleClose();
        }
    }

    return (
        <Modal open={conformationModalOpen} onClose={(_, reason) => {
            handleConfimationModalClose();
        }}>
            <Box sx={style.modalStyle}>
                <Box sx={{ borderRadius: "10px", overflow: "hidden",  }}>
                    <Typography sx={{ marginLeft: "2%", fontWeight: 800, color: "#00A398" }}>Provide SPOC Name & SPOC Email</Typography>
                    <TableContainer sx={{ borderRadius: "5px", maxHeight: 440 }}>
                        <Table sx={{ minWidth: 450, maxHeight: 400, width: 450, margin: "auto" }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: "rgba(64, 64, 64, 0.1)", bgcolor: 'background.paper', }}>
                                <TableRow>
                                    <TextField
                                        fullWidth
                                        label="SPOC Name"
                                        value={spocName}
                                        onChange={handleNameChange}
                                        margin="normal"
                                        error={!!nameError}
                                        helperText={nameError}
                                    />
                                    <TextField
                                        fullWidth
                                        id="spoc-email"
                                        label="SPOC Email"
                                        value={spocEmail}
                                        onChange={handleEmailChange}
                                        margin="normal"
                                        error={!!emailError}
                                        helperText={emailError}
                                    />
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                    <Box sx={{ mt: "10px" }}><Typography>Would you like to update with SPOC Name & SPOC Mail? </Typography></Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: "space-evenly", maxWidth: "50%", margin: "auto", paddingTop: "2%"}}>
                        <Button variant='contained' style={{ background: "#9F9F9F", mr: "10px", borderRadius: "20px" }} onClick={handleConfimationModalClose}>Cancel</Button>
                        <Button variant='contained' style={{...style.uploadButtonStyle, background: "#00A398", mr: "10px", borderRadius: "20px" }} onClick={handleUpdate}>Update</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}

export default AddSpocDetails;