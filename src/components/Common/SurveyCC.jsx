import { Box, Button, InputAdornment, InputBase, TableContainer } from "@mui/material";
import MiniTableHeader2 from "./MiniTableHeader2";
import CCTableBody from "./CCTableBody";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import { useEffect, useState } from "react";
import { Authorization_header } from "../../utils/helper/Constant";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import AddCCMails from "./AddCCMails";
import RemoveCCMails from "./RemoveCCMails";
import SearchIcon from "@mui/icons-material/Search";

const styles = {
    upperBox: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        alignItems: "center",
        px: 3,
        py: 1,
        borderTop: "1px solid #E4E4E4",
    },
    updateInfo: {
        color: "#9F9F9F",
        fontSize: "12px",
    },
    editButton: {
        borderRadius: "20px",
        backgroundColor: "#00A398",
        color: "white",
        textTransform: "capitalize",
        height: "30px",
        "&:hover": { backgroundColor: "#00A398" },
    },
    tableContainer: {
        // width: "100%",
        flex: 1,
        overflowX: "auto",
        maxHeight: "30rem",
        overflowY: "auto",
    },
    addRowButton: {
        borderRadius: "20px",
        backgroundColor: "#00A398",
        color: "white",
        textTransform: "capitalize",
        height: "30px",
        marginLeft: "10px",
        "&:hover": { backgroundColor: "#00A398" },
    },
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    },
    formControl: {
        width: '100%',
        mt: 2
    },
    searchIconStyle: {
        color: "#9F9F9F",
        ml: "3px",
        mr: "-3px",
        width: "20px",
        height: "20px",
    },
    inputStyle: {
        borderRadius: "20px",
        width: "30%",
        height: "33px",
        border: "1px solid #9F9F9F",
        mr: 5,
        ml: 10
    },
};

const tableData = {
    columns: ["Sr.No", "CC Mails"],
    rows: [],
}

const SurveyCC = ({ tab, subTab, companyId, projectId }) => {
    const [editMode, setEditMode] = useState(false);
    const [rows, setRows] = useState([]);
    const [backupRows, setBackupRows] = useState([]); // Store original rows
    const [updatedMails, setUpdatedMails] = useState([]);
    const [showAddCCModal, setShowAddCCModal] = useState(false);
    const [showRemoveCCModal, setShowRemoveCCModal] = useState(false);
    const [search, setSearch] = useState('');
    const [filteredRows, setFilteredRows] = useState([]);

    useEffect(() => {
        const filteredData = rows.filter((row) => row?.toString()?.toLowerCase()?.includes(search?.toString().toLowerCase()))
        setFilteredRows(filteredData);
    }, [search, rows])

    useEffect(() => {
        getMails();
    }, [subTab, showAddCCModal, showRemoveCCModal]);

    const getUpdatedMails = (mails) => {
        setUpdatedMails(mails);
    };

    async function getMails() {
        let url;
        if (tab === "Account") {
            url = `${BaseURL}/api/v1/company/${companyId}/ccmails?purpose=${subTab.toUpperCase()}`;
        } else {
            url = `${BaseURL}/api/v1/project/${projectId}/ccmails?purpose=${subTab.toUpperCase()}`;
        }
        try {
            const response = await axios.get(url, Authorization_header());
            setRows(response?.data?.data?.ccmails);
            setBackupRows(response?.data?.data?.ccmails);
        } catch (error) {
            console.error(error);
        }
    }

    const validateEmails = (emails) => {
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
        return emails.every(email => email === "" || regex.test(email));
    };

    const handleSave = async () => {
        if (!validateEmails(updatedMails)) {
            toast.error("Invalid email format detected. Please check and correct them.");
            return;
        }

        let url;
        if (tab === "Account") {
            url = `${BaseURL}/api/v1/company/${companyId}/update-ccmails?purpose=${subTab.toUpperCase()}`;
        } else {
            url = `${BaseURL}/api/v1/project/${projectId}/update-ccmails?purpose=${subTab.toUpperCase()}`;
        }

        try {
            await axios.put(url, { emails: updatedMails }, Authorization_header());
            toast.success("Emails updated successfully.");
            getMails(); // Refresh table
            setEditMode(false);
        } catch (error) {
            console.error("Error updating emails:", error);
            toast.error("Failed to update emails. Please try again.");
        }
    };

    const handleCancel = () => {
        setRows(backupRows); // Restore original rows
        setEditMode(false);
    };

    function handleAdd() {
        setShowAddCCModal(true);
    }

    function handleAddClose() {
        setShowAddCCModal(false);
    }

    function handleShowRemove() {
        setShowRemoveCCModal(true);
    }

    function handleCloseRemove() {
        setShowRemoveCCModal(false);
    }

    const handleSearchInputChange = (event) => {
        setSearch(event?.target?.value);
    }

    return (
        <>
            {showAddCCModal && <AddCCMails ccMails={rows} handleModalClose={handleAddClose} Id={tab === 'Account' ? companyId : projectId} tab={tab} subTab={subTab} open={showAddCCModal} />}
            {showRemoveCCModal && <RemoveCCMails ccmails={rows} handleClose={handleCloseRemove} id={tab === 'Account' ? companyId : projectId} tab={tab} subTab={subTab} open={showRemoveCCModal} />}
            <Box sx={styles.upperBox}>
                <InputBase type="text" placeholder="Search..." onChange={handleSearchInputChange} startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon sx={styles.searchIconStyle} />
                        
                    </InputAdornment>
                }
                sx={styles.inputStyle} />
                <Button
                    variant="contained"
                    sx={styles.editButton}
                    onClick={handleAdd}
                >
                    <Add />
                </Button>
                <Button
                    variant="contained"
                    sx={styles.editButton}
                    onClick={handleShowRemove}
                >
                    <GridDeleteIcon />
                </Button>

            </Box>
            <TableContainer sx={{ ...styles.tableContainer }}>
                <MiniTableHeader2 tableData={tableData} />
                <CCTableBody editMode={editMode} filledRows={filteredRows} getUpdatedMails={getUpdatedMails} />
            </TableContainer>
            {editMode && <Box sx={{
                display: "flex",
                gap: "10px",
                padding: "20px"
            }}>
                <Button
                    variant="contained"
                    sx={styles.editButton}
                    onClick={handleCancel}>Cancel</Button>
                <Button
                    variant="contained"
                    sx={styles.editButton}
                    onClick={handleSave}>Save</Button>
            </Box>}
            <Toaster />
        </>
    )
}

export default SurveyCC;