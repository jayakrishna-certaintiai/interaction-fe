import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  InputAdornment,
  InputBase,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BaseURL } from "../../constants/Baseurl";
import CancelIcon from "@mui/icons-material/Cancel";
import { FilterListContext } from "../../context/FiltersListContext";
import ProjectTableCell from "../Common/ProjectTableCell";
import { Authorization_header } from "../../utils/helper/Constant";

const styles = {
  flexBoxItem: {
    display: "flex",
    justifyContent: "space-between",
    px: 2,
  },
  label: {
    color: "#404040",
    fontSize: "14px",
    fontWeight: 600,
  },
  inputBase: {
    borderRadius: "20px",
    height: "40px",
    border: "1px solid #E4E4E4",
    pl: 1,
    width: "200px",
  },
  iconStyle: { fontSize: "17px", color: "#00A398" },
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    boxShadow: 3,
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "90%",
    width: 750,
    height: 660,
  },
  titleStyle: {
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
  },
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
  modalStyle: {
    display: "flex",
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
  topBoxStyle: {
    borderBottom: "1px solid #E4E4E4",
    px: 2.5,
    textAlign: "left",
    py: 1,
  },
};
const columns = [
  { field: "projectName", headerName: "Project Name", width: 200 },
  { field: "projectId", headerName: "Project ID" },
];
const AddPortfolioModal = ({ open, handleClose, fetchParentData }) => {
  const { clientList } = useContext(FilterListContext);
  const [search, setSearch] = useState("");
  const [filteredProject, setFilteredProject] = useState([]);
  const [portfolioName, setPortfolioName] = useState("");
  const [company, setCompany] = useState(null);
  const [companyProjects, setCompanyProjects] = useState(null);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = useState(false);
  const [nameVal, setNameVal] = useState(false);
  const [companyVal, setCompanyVal] = useState(false);
  const [projectVal, setProjectVal] = useState(false);



  const fetchData = async () => {
    setLoading(true);
    setCompanyProjects([]);
    try {
      if (company) {
        const response3 = await axios.get(
          `${BaseURL}/api/v1/company/${localStorage.getItem(
            "userid"
          )}/${company}/get-projects-by-company`
        );
        setCompanyProjects(response3.data.data);
        setSelected([]);
        setLoading(false);
        setCompanyVal(false);
        setPage(0);
      } else {
        console.error("companyId not available in data object");
        setLoading(false);
        setCompanyProjects([]);
        setPage(0);
        // setCompanyVal(true);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setCompanyProjects([]);
      setCompanyVal(true);
      setPage(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [company]);

  useEffect(() => {
    if (companyProjects) {
      const filteredData = companyProjects?.filter(
        (task) =>
          task?.projectName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.projectId?.toString()?.includes(search)
        // Add more conditions as needed
      );
      setFilteredProject(filteredData);
    }
  }, [companyProjects, search]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredProject.map((n) => n.projectId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleFormSubmit = async () => {
    if (!nameVal && !companyVal && !projectVal) {
      const apiUrl = `${BaseURL}/api/v1/portfolios/${localStorage.getItem(
        "userid"
      )}/${company}/create-portfolio`;
      const data = {
        projects: JSON.stringify(selected),
        portfolioName: portfolioName,
      };

      toast.promise(
        (async () => {
          const response = await axios.post(apiUrl, data, Authorization_header());
          if (response.data.success) {
            fetchParentData();
            setPortfolioName("");
            setCompany("");
            handleClose();
          }
          return response;
        })(),
        {
          loading: "Adding New Portfolio...",
          success: (response) =>
            response.data.message || "Portfolio added successfully",
          error: (response) =>
            response.data.error.message || "Failed to adding new portfolio.",
        }
      );
    } else {
      CheckValidation();
    }
  };
  const CheckValidation = () => {
    if (portfolioName === "") {
      setNameVal(true);
    }
    if (portfolioName !== "") {
      setNameVal(false);
    }
    if (company === null) {
      setCompanyVal(true);
    }
    if (company !== null) {
      setCompanyVal(false);
    }
    if (selected.length === 0) {
      setProjectVal(true);
    }
    if (selected.length !== 0) {
      setProjectVal(false);
    }
  };
  useEffect(() => {
    if (selected.length === 0) {
      setProjectVal(true);
    }
    if (selected.length !== 0) {
      setProjectVal(false);
    }
  }, [selected]);

  return (
    <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Box
          sx={{
            ...styles.topBoxStyle,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={styles.titleStyle}>
            Add New Portfolio
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
        <Box sx={styles.flexBoxItem}>
          <Box>
            <InputLabel sx={styles.label}>
              Portfolio Name<span style={{ color: "#FD5707" }}>*</span>
            </InputLabel>
            <InputBase
              type="text"
              required
              sx={{
                ...styles.inputBase,
                width: "330px",
              }}
              name="portfolioName"
              value={portfolioName}
              onChange={(e) => {
                setPortfolioName(e.target.value);
                if (portfolioName === "") {
                  setNameVal(true);
                }
                if (portfolioName !== "") {
                  setNameVal(false);
                }
              }}
              onBlur={() => {
                if (portfolioName === "") {
                  setNameVal(true);
                }
                if (portfolioName !== "") {
                  setNameVal(false);
                }
              }}
            />
            {nameVal && <div style={{ color: "#FD5707" }}>Required</div>}
          </Box>
          <Box>
            <InputLabel sx={styles.label}>
              Account<span style={{ color: "#FD5707" }}>*</span>
            </InputLabel>
            <Select
              required
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                if (company === null) {
                  setCompanyVal(true);
                }
                if (company !== null) {
                  setCompanyVal(false);
                }
              }}
              onBlur={() => {
                if (company === null) {
                  setCompanyVal(true);
                }
                if (company !== null) {
                  setCompanyVal(false);
                }
              }}
              sx={{
                ...styles.inputBase,
                width: "330px",
                border: "none",
              }}
            >
              {clientList?.map((client) => (
                <MenuItem value={client?.companyId} key={client?.companyId}>
                  {client?.companyName}
                </MenuItem>
              ))}
            </Select>
            {companyVal && <div style={{ color: "#FD5707" }}>Required</div>}
          </Box>
        </Box>
        <Box sx={{ px: 2 }}>
          <InputLabel sx={styles.label}>
            Projects<span style={{ color: "#FD5707" }}>*</span>
          </InputLabel>
          <InputBase
            type="text"
            value={search}
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={styles.searchIconStyle} />
              </InputAdornment>
            }
            sx={{
              ...styles.inputBase,
              width: "100%",
            }}
          />
        </Box>
        <Box sx={{ px: 2 }}>
          {projectVal && (
            <span style={{ color: "#FD5707" }}>Project is required</span>
          )}
          <TableContainer sx={{ height: 300 }}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow sx={styles?.headerRowStyle}>
                  <TableCell
                    padding="checkbox"
                    sx={{ backgroundColor: "#ECECEC" }}
                  >
                    <Checkbox
                      color="primary"
                      onChange={(e) => {
                        handleSelectAllClick(e);
                      }}
                      inputProps={{
                        "aria-label": "select all desserts",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "left",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    Project Name
                  </TableCell>
                  <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "left",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    Project ID
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProject
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((row, index) => {
                    const isItemSelected = isSelected(row.projectId);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => {
                          handleClick(event, row.projectId);
                        }}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          id={labelId}
                          sx={{ ...styles?.cellStyle, textAlign: "left" }}
                        >
                          {row?.projectName || ""}
                        </TableCell>
                        <ProjectTableCell id={row?.projectId} name={row?.projectId || ""} />
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>

            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "50px",
                  minHeight: "380px",
                }}
              >
                <CircularProgress sx={{ color: "#00A398" }} />
              </div>
            )}
            {filteredProject.length === 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "50px",
                  minHeight: "380px",
                }}
              >
                No projects found
              </div>
            )}
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProject.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        <Box sx={styles.buttonBox}>
          <Button
            variant="contained"
            sx={styles.buttonStyle}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={styles.uploadButtonStyle}
            onClick={() => handleFormSubmit()}
          >
            Add Portfolio
          </Button>
        </Box>
        <Toaster />
      </Paper>
    </Modal>
  );
};

export default AddPortfolioModal;
