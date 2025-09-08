
import { Close } from '@mui/icons-material';
import { Box, IconButton, Modal, Paper, TableContainer, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseURL } from '../../../../constants/Baseurl';
import { Authorization_header } from '../../../../utils/helper/Constant';
import TypographyDemo from '../../../Common/TypographyDemo';
import MiniTableHeader2 from '../../../Common/MiniTableHeader2';
import InteractionModalTableBody from './InteractionModalTableBody';
import InteractionDetailsBody from './InteractionDetailsBody';
import toast from 'react-hot-toast';

const styles = {
    paperStyle: {
        borderRadius: "20px",
        // margin: "auto",
        maxWidth: "59%",
        maxHeight: "100vh",
        position: "absolute",
    },
    titleStyle: {
        textAlign: "left",
        fontWeight: 600,
        fontSize: "18px",
        color: "#333",
        mx: 5
    },
    buttonStyle: {
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#9F9F9F",
        color: "#fff",
        "&:hover": { backgroundColor: "#7F7F7F" },
    },
    modalStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    buttonBox: {
        marginTop: "16px",
        display: "flex",
        justifyContent: "flex-end",
        padding: "16px",
    },
    flexBox: {
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid #E4E4E4",
        padding: "16px",
    },
    tableContainerStyle: {
        maxHeight: "500px",
        overflowY: "auto",
        borderRadius: "20px",
        marginTop: "2px",
        border: "1px solid #ddd",
        p: 5,
        borderLeft: "1px solid #ddd"
    },
};

const columns = [
    "Interaction ID",
    "Status",
    "Sent Date",
    "Response Date",
    "Sent To",
];

const InteractionsListModal = ({ open, handleClose, projectId }) => {
    const [isVisible, setIsVisible] = useState(open);
    const [interactions, setInteractions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedInteractionID, setSelectedInteractionID] = useState("");
    const [openInteractionDetails, setOpenInteractionDetails] = useState(false);

    useEffect(() => {
        if (open) {
            getInteractions();
        }
        setIsVisible(open);
    }, [open]);

    function getSelectedInteractiondetails(id) {
        setSelectedInteractionID(id);
        setOpenInteractionDetails(true);
    }

    function handleInteractionDetailsClose() {
        setOpenInteractionDetails(false);
    }

    const getInteractions = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                projectIdentifier: projectId,
            });
            const res = await axios.get(
                `${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/interaction-list?${queryParams}`,
                Authorization_header()
            );
            setInteractions(res?.data?.data || []);

        } catch (error) {
            console.error("Error fetching interactions:", error);
            toast("Error fetching interactions");
        } finally {
            setLoading(false);
        }
    };

    const tableData = {
        columns: columns,
    };

    return (
        <>
            {openInteractionDetails && <InteractionDetailsBody open={openInteractionDetails} handleClose={handleInteractionDetailsClose} interactionId={selectedInteractionID} />}
            <Modal open={isVisible} onClose={handleClose} sx={styles.modalStyle}>
                <Paper sx={styles.paperStyle}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px", height: "100%", width: "100%" }}>
                        <Typography variant="h6" sx={styles.titleStyle}>
                            Interactions
                        </Typography>
                        <IconButton onClick={handleClose} aria-label="close">
                            <Close />
                        </IconButton>
                    </Box>
                    {loading ? (
                        <TypographyDemo />
                    ) : (
                        <TableContainer sx={styles.tableContainerStyle}>
                            <MiniTableHeader2 tableData={tableData} />
                            <InteractionModalTableBody rowData={interactions} getSelectedInteractiondetails={getSelectedInteractiondetails} />
                        </TableContainer>
                    )}
                </Paper>
            </Modal>
        </>
    );
};

export default InteractionsListModal;


