
import { Box, Button, Container, Paper, Table, TableContainer, Typography, Modal } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import WagesContext from '../../context/WagesContext';
import EditIcon from "@mui/icons-material/Edit";
import InputBox from '../Common/InputBox';
import { useFormik } from 'formik';
import MiniTableHeader from '../Common/MiniTableHeader';
import ProjectsMapperTableBody from './ProjectsMapperTableBody';
import EmployeesMapperTableBody from './EmployeesMapperTableBody';

const styles = {
    upperBox: {
        display: "flex",
        justifyContent: "space-between",
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
    editIcon: {
        fontSize: "20px",
        mr: 1,
    },
    tableContainer: {
        width: "100%",
        overflowX: "auto",
        maxHeight: "20rem",
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
};

const EmployeesMapper = ({ companyId, selectedTab }) => {
    const [editMode, setEditMode] = useState(false);
    const [newRows, setNewRows] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const { employeesMapperData, fetchEmployeesMapperAttributes, postEmployeesMapperAttributes } = useContext(WagesContext);
    const addEmployeesFormik = useFormik({ initialValues: employeesMapperData });

    const tableData = {
        columns: ["Sheet ID", "Employee Name", "Employee Title", "Employee Email", "Employee Phone"],
        rows: [{
            attribute: "projectname",
            sheetColumn: "Project Name",
            active: true,
        }]
    };

    useEffect(() => {
        fetchEmployeesMapperAttributes(companyId);
    }, [companyId, selectedTab]);

    const handleAddRow = () => {
        const newRow = { attribute: "", sheetColumn: "", active: false };
        setNewRows(prevRows => [...prevRows, newRow]);
    };

    const handleSaveChanges = () => {
        setOpenModal(false);
        const updatedRows = [...tableData.rows, ...newRows];
        postEmployeesMapperAttributes(companyId, { ...addEmployeesFormik.values, rows: updatedRows });
        setEditMode(false);
        setNewRows([]);
    };

    return (
        <>
            <Paper>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setOpenModal(true);
                }}>
                    <Box sx={styles.upperBox}>
                        <Box>
                            <Typography sx={styles.updateInfo}>
                                Updated { }
                            </Typography>
                            <Typography sx={styles.updateInfo}>
                                Updated by: { }
                            </Typography>
                        </Box>
                        <Box style={{ display: "flex", gap: "10px" }}>
                            {editMode ? (
                                <>
                                    <Button
                                        variant="contained"
                                        sx={styles.editButton}
                                        onClick={handleAddRow}
                                    >
                                        Add Row
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={styles.editButton}
                                        onClick={() => setEditMode(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={styles.editButton}
                                        type="submit"
                                    >
                                        Save Changes
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="contained"
                                    startIcon={<EditIcon sx={styles.editIcon} />}
                                    sx={styles.editButton}
                                    onClick={() => setEditMode(true)}
                                >Edit</Button>
                            )}
                        </Box>
                    </Box>

                    <Container>
                        <TableContainer sx={styles.tableContainer}>
                            <Table>
                                <MiniTableHeader tableData={tableData} />
                                <EmployeesMapperTableBody filledRows={[...tableData.rows, ...newRows]} editMode={editMode} addEmployeesFormik={addEmployeesFormik} employeesMapperData={employeesMapperData} />
                            </Table>
                        </TableContainer>
                    </Container>
                </form>
            </Paper>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <Box sx={styles.modalBox}>
                    <Typography variant="h6" component="h2">
                        Confirm Changes
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to save these changes?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            sx={styles.editButton}
                            onClick={() => setOpenModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            sx={styles.editButton}
                            onClick={handleSaveChanges}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default EmployeesMapper;
