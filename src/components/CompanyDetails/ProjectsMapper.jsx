import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableContainer,
  Typography,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import MapperContext from '../../context/MapperContext';
import EditIcon from "@mui/icons-material/Edit";
import MiniTableHeader from '../Common/MiniTableHeader';
import ProjectsMapperTableBody from './ProjectsMapperTableBody';
import MiniTableHeader2 from '../Common/MiniTableHeader2';

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
  }
};

const ProjectsMapper = ({ companyId, selectedTab }) => {
  const [editMode, setEditMode] = useState(false);
  const [rows, setRows] = useState([]);
  const [newRows, setNewRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newRowData, setNewRowData] = useState({ sheetColumnName: '', status: 'active' });
  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [updateColumns, setUpdateColumns] = useState([]);
  const { projectsMapperData, fetchProjectsMapperAttributes, postProjectsMapperAttributes } = useContext(MapperContext);

  useEffect(() => {
    if (selectedTab === "Projects") {
      fetchProjectsMapperAttributes(companyId);
    }
  }, [companyId, selectedTab]);

  useEffect(() => {
    setRows(projectsMapperData);
  }, [projectsMapperData]);

  const handleAddRow = () => {
    setShowAddRowModal(true);
  };

  const getUpdateColumns = (updateColumns) => {
    setUpdateColumns(updateColumns);
  }

  const handleAddRowSubmit = () => {
    if (newRowData.sheetColumnName.trim()) {
      setNewRows((prevRows) => [
        ...prevRows,
        { ...newRowData, columnName: `Column ${prevRows.length + 1}` }
      ]);
      setShowAddRowModal(false);
      setNewRowData({ sheetColumnName: '', status: 'inactive' });
    }
  };

  const handleSaveChanges = () => {
    setOpenModal(false);
  
    // Fetch current data from context or state
    const currentData = [...projectsMapperData];
  
    // Initialize arrays for new and updated columns
    const updatedRows = [];
    const newColumns = [];
  
    // Check for updated rows
    newRows.forEach((newRow) => {
      const matchingRow = currentData.find(row => row.columnName === newRow.columnName);
  
      if (matchingRow) {
        // If matching row found, check if any value has changed
        if (matchingRow.sheetColumnName !== newRow.sheetColumnName || matchingRow.status !== newRow.status) {
          updatedRows.push({
            columnName: matchingRow.columnName,
            sheetColumnName: newRow.sheetColumnName,
            status: newRow.status,
          });
        }
      } else {
        // If no matching row is found, it's a new column
        newColumns.push(newRow.sheetColumnName);
      }
    });
  
    // Prepare post data
    const postData = {
      newColumns,
      updateColumns: updateColumns
    };
  
    // Send post request with updated data
    postProjectsMapperAttributes(companyId, postData);
    // Reset state after saving
    setEditMode(false);
    setNewRows([]);
  };
  
  

  return (
    <>
      <Paper>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOpenModal(true);
          }}
        >
          <Box sx={styles.upperBox}>
            <Box>
              {/* <Typography sx={styles.updateInfo}>Updated {}</Typography>
              <Typography sx={styles.updateInfo}>Updated by: {}</Typography> */}
            </Box>
            <Box style={{ display: "flex", gap: "10px" }}>
              {editMode ? (
                <>
                  <Button
                    variant="contained"
                    sx={styles.addRowButton}
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
                >
                  Edit
                </Button>
              )}
            </Box>
          </Box>

          <>
            <TableContainer sx={styles.tableContainer}>
              <Table>
                <MiniTableHeader2
                  tableData={{
                    columns: ["Sr.No", "Attributes", "Sheet Columns", "Active"],
                    rows: [],
                  }}
                />
                <ProjectsMapperTableBody
                  filledRows={rows}
                  editMode={editMode}
                  onUpdateRows={setRows}
                  getUpdateColumns={getUpdateColumns}
                />
              </Table>
            </TableContainer>
          </>
        </form>
      </Paper>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="save-changes-modal"
        aria-describedby="save-changes-modal-description"
      >
        <Box sx={styles.modalBox}>
          <Typography id="save-changes-modal-title" variant="h6" component="h2">
            Confirm Changes
          </Typography>
          <Typography id="save-changes-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to save the changes?
          </Typography>
          <Button
            onClick={handleSaveChanges}
            sx={styles.editButton}
            style={{ marginTop: "10px" }}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>

      <Modal
        open={showAddRowModal}
        onClose={() => setShowAddRowModal(false)}
        aria-labelledby="add-row-modal"
        aria-describedby="add-row-modal-description"
      >
        <Box sx={styles.modalBox}>
          <Typography id="add-row-modal-title" variant="h6" component="h2">
            Add New Row
          </Typography>
          <FormControl sx={styles.formControl}>
            <TextField
              label="Sheet Column Name"
              value={newRowData.sheetColumnName}
              onChange={(e) =>
                setNewRowData({ ...newRowData, sheetColumnName: e.target.value })
              }
            />
          </FormControl>
          <FormControl sx={styles.formControl}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newRowData.status}
              onChange={(e) =>
                setNewRowData({ ...newRowData, status: e.target.value })
              }
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handleAddRowSubmit}
            sx={styles.editButton}
            style={{ marginTop: "10px" }}
          >
            Add Row
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ProjectsMapper;
