import { useState } from 'react';
import { Modal, Paper, Box, Typography, Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import toast, { Toaster } from 'react-hot-toast';
import { BaseURL } from '../../constants/Baseurl';
import axios from 'axios';
import { Authorization_header } from '../../utils/helper/Constant';

const styles = {
    paperStyle: {
        boxShadow: "0px 3px 6px #0000001F",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "20px",
        margin: "auto",
        width: "50%", // Set max width to 50% of screen width
        height: "50vh", // Set max height to 50% of screen height
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        overflow: "hidden",
    },
    topBoxStyle: {
        borderBottom: "1px solid #E4E4E4",
        paddingLeft: 7,
        paddingRight: 2,
        textAlign: "left",
        py: 1,
    },
    titleStyle: {
        mx: -6,
        textAlign: "left",
        fontWeight: 600,
        fontSize: "13px",
    },
    buttonStyle: {
        mr: 1,
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#9F9F9F",
        "&:hover": { backgroundColor: "#9F9F9F" },
    },
    uploadButtonStyle: {
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#00A398",
        "&:hover": { backgroundColor: "#00A398" },
    },
    modalStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        borderBottom: "1px solid #E4E4E4",
    },
    flexBoxItem: {
        display: "flex",
        justifyContent: "space-between",
        mt: 1,
        gap: 2,
        px: 2,
    },

    inputBase: {
        borderRadius: "20px",
        height: "40px",
        border: "1px solid #E4E4E4",
        pl: 1,
        mb: 0.5,
    },
    expandMoreIcon: {
        borderRadius: "50%",
        fontSize: "15px",
        backgroundColor: "#404040",
        color: "white",
        mr: 1,
        transition: "transform 0.3s ease",
    },
    sectionStyle: { fontWeight: 600, px: 2, cursor: "pointer" },
    box1Style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        borderBottom: "1px solid #E4E4E4",
        alignItems: "center",
    },
    radioStyle: {
        "& .MuiSvgIcon-root": {
            fontSize: 20,
            color: "#00A398",
        },
    },
    labelStyle: { fontSize: "13px", fontWeight: 600 },
    divStyle: {
        display: "flex",
        padding: "0 20px",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
    },
    divTitleStyle: { fontSize: "13px", fontWeight: "600" },
    selStyle: {
        border: "1px solid #E4E4E4",
        px: 2,
        py: 0.5,
        borderRadius: "20px",
        fontSize: "13px",
        width: "180px",
        textAlign: "center",
    },

    label: {
        color: "#404040",
        fontSize: "14px",
        fontWeight: 600,
    },

    iconStyle: { fontSize: "17px", color: "#00A398" },
    tableContainer: { maxHeight: "200px", overflowY: "auto" },

    uploadBoxStyle: {
        border: "1px dashed #E4E4E4",
        borderWidth: "2px",
        ml: 2,
        mr: 2,
        borderRadius: "20px",
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    buttonStyle: {
        mr: 1,
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#9F9F9F",
        "&:hover": { backgroundColor: "#9F9F9F" },
    },
    uploadButtonStyle: {
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#00A398",
        "&:hover": { backgroundColor: "#00A398" },
    },

    innerBox: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
    },
    buttonBox: {
        mt: 1,
        display: "flex",
        justifyContent: "flex-end",
        px: 2,
        mb: 2,
    },
    searchIconStyle: {
        color: "#9F9F9F",
        ml: "3px",
        mr: "-3px",
        width: "20px",
        height: "20px",
    },
    cellStyle: {
        whiteSpace: "nowrap",
        borderRight: "1px solid #ddd",
        textAlign: "center",
        fontSize: "13px",
        py: 1,
    },
    headerRowStyle: {
        backgroundColor: "rgba(64, 64, 64, 0.1)",
    },

};

const RemoveCCMails = ({ ccmails, open, handleClose, tab, subTab, id }) => {
    const [selectedMails, setSelectedMails] = useState([]);

    function handleSelectMails(mail, checked) {
        if (checked) {
            setSelectedMails([...selectedMails, mail]);
        } else {
            const updatedMails = selectedMails.filter(m => m !== mail);
            setSelectedMails(updatedMails);
        }
    }

    function handleSelectAllMails(checked) {
        if (checked) {
            setSelectedMails(ccmails);
        } else {
            setSelectedMails([]);
        }
    }

    async function handleSendMail() {
        let URL;
        if (tab === 'Account') {
            URL = `${BaseURL}/api/v1/company/${id}/update-ccmails?purpose=${subTab.toUpperCase()}`;
        } else {
            URL = `${BaseURL}/api/v1/project/${id}/update-ccmails?purpose=${subTab.toUpperCase()}`;
        }

        const updatedMails = ccmails.filter(mail => !selectedMails.includes(mail));
        const data = { emails: updatedMails };

        try {
            const response = await axios.put(URL, data, Authorization_header());
            toast.success("CC Mails deleted successfully!");
            handleClose();
        } catch (error) {
            toast.error("Failed to update CC Mails");
        }
    }

    return (
        <>
            <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
                <Paper sx={styles.paperStyle}>
                    <Box
                        sx={{
                            ...styles.topBoxStyle,
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                        <Typography variant="h6" sx={styles.titleStyle}>
                            Remove CC Mails
                        </Typography>
                        <CancelIcon
                            sx={{
                                color: "#9F9F9F",
                                cursor: "pointer",
                                "&: hover": { color: "#FD5707" },
                            }}
                            onClick={handleClose}
                        />
                    </Box>
                    <TableContainer sx={{ height: 300 }}>
                        <Table stickyHeader aria-label="simple table">
                            <TableHead >
                                <TableRow sx={styles.headerRowStyle}>
                                    <TableCell padding="checkbox" sx={{ ...styles?.cellStyle, backgroundColor: "#ECECEC" }}>
                                        <Checkbox
                                            color="success"
                                            checked={selectedMails.length === ccmails.length && ccmails.length > 0}
                                            indeterminate={selectedMails.length > 0 && selectedMails.length < ccmails.length}
                                            onChange={(e) => handleSelectAllMails(e.target.checked)}
                                            inputProps={{ "aria-label": "select all desserts" }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "center",
                                        backgroundColor: "#ECECEC",
                                    }}>Email Address</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ccmails.map((mail, index) => (
                                    <TableRow key={index}>
                                        <TableCell padding="checkbox">
                                            <div style={{ ...styles?.cellStyle }}>
                                                <Checkbox
                                                    color="success"
                                                    checked={selectedMails.includes(mail)}
                                                    onChange={(e) => handleSelectMails(mail, e.target.checked)}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "center", color: "#00A398", }}>{mail}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "1rem" }}>
                        <Box><Typography>Selected {selectedMails?.length || 0} {"Mails"} out of {ccmails?.length || 0}</Typography></Box>
                        <Box sx={styles.buttonBox}>
                            <Button variant="contained" sx={styles.buttonStyle} onClick={handleClose}>Cancel</Button>
                            <Button variant="contained" sx={styles.uploadButtonStyle} onClick={handleSendMail}>Save</Button>
                        </Box>
                    </Box>
                </Paper>
            </Modal>
        </>
    )
}

export default RemoveCCMails;