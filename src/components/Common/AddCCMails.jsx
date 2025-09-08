import React, { useState } from 'react'
import CancelIcon from "@mui/icons-material/Cancel";
import {
    Box,
    Button,
    IconButton,
    InputLabel,
    Modal,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Add } from '@mui/icons-material';
import { BaseURL } from '../../constants/Baseurl';
import { Authorization_header } from '../../utils/helper/Constant';

const styles = {
    paperStyle: {
        boxShadow: "0px 3px 6px #0000001F",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "20px",
        margin: "auto",
        maxWidth: "90%",
        width: "34rem",
        maxHeight: "90vh",
        overflowY: "auto",
    },
    titleStyle: {
        textAlign: "left",
        fontWeight: 600,
        fontSize: "13px",
    },
    buttonStyle: {
        mr: 1,
        color: 'white',
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#9F9F9F",
        "&:hover": { backgroundColor: "#9F9F9F" },
    },
    uploadButtonStyle: {
        color: 'white',
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#00A398",
        "&:hover": { backgroundColor: "#00A398" },
    },
    modalStyle: {
        display: "flex",
    },
    buttonBox: {
        mt: 1,
        display: "flex",
        justifyContent: "flex-end",
        px: 2,
        mb: 2,
    },
    flexBox: {
        display: "flex",
        flexDirection: "column",
    },
    flexBoxItem: {
        display: "flex",
        justifyContent: "space-between",
        mt: 1,
        gap: 2,
        px: 2,
    },
    label: {
        color: "#404040",
        fontSize: "14px",
    },
    inputBase: {
        borderRadius: "20px",
        height: "40px",
        border: "1px solid #E4E4E4",
        pl: 1,
        mb: 0.5,
    },
    topBoxStyle: {
        borderBottom: "1px solid #E4E4E4",
        px: 2.5,
        textAlign: "left",
        py: 1,
    },
    textFiled: {
        width: "15rem",
        ml: "19px",
        borderRadius: "20px",
    },
    caseExitsModal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },
    emailItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0 1rem',
    },
    emailList: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '1rem'
    }
};

const AddCCMails = ({ ccMails, handleModalClose, Id, open, tab, subTab }) => {
    const [addedMails, setAddedMails] = useState([]);
    const [email, setEmail] = useState("");

    const handleRemoveEmail = (emailToRemove) => {
        setAddedMails((prev) => prev.filter((mail) => mail !== emailToRemove));
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleAddEmail = () => {
        if (!email) {
            toast.error("Please enter an email.");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Invalid email format.");
            return;
        }

        if ([...ccMails, ...addedMails].includes(email)) {
            toast.error("Email already added.");
            return;
        }

        setAddedMails((prev) => [...prev, email]);
        setEmail("");
    };

    const handleSave = async () => {
        // Ensure all emails are valid before saving
        const invalidEmails = addedMails.filter(mail => !validateEmail(mail));
    
        if (invalidEmails.length > 0) {
            toast.error(`Invalid email(s): ${invalidEmails.join(", ")}`);
            return;
        }

        let url;
        if (tab === 'Account') {
            url = `${BaseURL}/api/v1/company/${Id}/update-ccmails?purpose=${subTab.toUpperCase()}`;
        } else {
            url = `${BaseURL}/api/v1/project/${Id}/update-ccmails?purpose=${subTab.toUpperCase()}`;
        }
    
        const updatedMails = [...ccMails, ...addedMails];
        const data = {emails: updatedMails};
    
        try {
            const response = await axios.put(url, data, Authorization_header());
            toast.success("CC Recipents added successfully!");
            handleModalClose();
        } catch (error) {
            toast.error("Failed to save CC Recipents.");
        }
    };
    


    return (
        <>
            <Modal open={open} onClose={handleModalClose} sx={styles.modalStyle}>
                <Paper sx={styles.paperStyle}>
                    <Box
                        sx={{
                            ...styles.topBoxStyle,
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                        <Typography variant="h6" sx={styles.titleStyle}>
                            Add CC Recipents
                        </Typography>
                        <CancelIcon
                            sx={{
                                color: "#9F9F9F",
                                cursor: "pointer",
                                "&: hover": { color: "#FD5707" },
                            }}
                            onClick={handleModalClose}
                        />
                    </Box>
                    <Box sx={styles.inputContainer}>
                        <TextField
                            label="Enter email"
                            variant="outlined"
                            size="small"
                            value={email}
                            sx={{ ...styles.textFiled, margin: '1rem', width: "85%" }}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <IconButton sx={{ mt: '15px' }} onClick={handleAddEmail}>
                            <Add />
                        </IconButton>
                    </Box>

                    {addedMails.length ? <Box sx={{ ...styles.emailList, maxHeight: "120px", overflowY: "auto" }}>
                        {addedMails.map((mail, index) => (
                            <Box key={index} sx={styles.emailItem}>
                                <Typography variant="body2">{mail}</Typography>
                                <IconButton size="small" onClick={() => handleRemoveEmail(mail)}>
                                    <CancelIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box> : <></>}
                    <Box sx={styles.buttonBox}>
                        <Button onClick={handleModalClose} sx={styles.buttonStyle}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} sx={styles.uploadButtonStyle}>
                            Save
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </>
    )
}

export default AddCCMails;