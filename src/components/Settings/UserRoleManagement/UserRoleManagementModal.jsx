import {
  Box,
  InputAdornment,
  InputBase,
  Modal,
  Paper,
  TableContainer,
  Typography,
  Table,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FilledButton from "../../button/FilledButton";
import * as yup from "yup";
import { useFormik } from "formik";
import SearchIcon from "@mui/icons-material/Search";
import TableHeader2 from "../../Common/TableHeader2";
import { userRoleTableData } from "../../../constants/userRoleTableData";
import InputBox from "../../Common/InputBox";
import AddUserRoleTableBody from "./AddUserRoleTableBody";
import axios from "axios";
import { BaseURL } from "../../../constants/Baseurl";
import { useRoleContext } from "../../../context/UserRoleManagementContext";
import toast, { Toaster } from "react-hot-toast";

const validationSchema = yup.object({
  userRole: yup
    .string("Select Your User Role")
    .required("User Role is required"),
});

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "90%",
    minHeight: "90.5%",
    width: 1111,
  },
  titleStyle: {
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
    justifyContent: "space-between",
    p: 2,
    borderBottom: "1px solid #E4E4E4",
    alignItems: "center",
  },
  inputStyle: {
    borderRadius: "20px",
    width: "30%",
    height: "32px",
    border: "1px solid #9F9F9F",
    mr: 2,
  },
};

const UserRoleManagementModal = ({ open, handleClose }) => {
  const { fetchUserRolesInfo, selectedAddRoleState } = useRoleContext();
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");
  const addUserRoleFormik = useFormik({
    initialValues: {
      userRole: null,
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {

      handleAdduserRole(values);
    },
  });

  const handleAdduserRole = async (values) => {
    
    toast.promise(
      (async () => {
        try {
          const response = await axios.post(
            `${BaseURL}/api/v1/users/${localStorage.getItem(
              "userid"
            )}/company/create-role`,
            {
              roleName: values.userRole,
              description: "Description for new role.",
              featurePermissions: selectedAddRoleState,
            }
          );
          fetchUserRolesInfo();
          handleClose();
          return response;
        } catch (error) {
          console.error(
            "server error",
            error.response?.data || "Something went wrong"
          );
          throw error.response
            ? error.response
            : new Error("Network or server error");
        }
      })(),
      {
        loading: "Creating role...",
        success: (response) =>
          response.data.message || "Role created successfully",
        error: (response) =>
          response.data?.error?.message || "Failed to create role.",
      }
    );
  };
  useEffect(() => {
    if (userRoleTableData.rows) {
      const filteredData = userRoleTableData.rows?.filter(
        (task) =>
          task?.feature?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.description?.toLowerCase()?.includes(search?.toLowerCase())
        // Add more conditions as needed
      );
      setFilteredRows(filteredData);
    }
  }, [userRoleTableData.rows, search]);

  return (
    <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <form onSubmit={addUserRoleFormik.handleSubmit}>
          <Box sx={{ ...styles.box1Style, py: 1 }}>
            <Typography variant="h6" sx={styles.titleStyle}>
              Create New User Role
            </Typography>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <FilledButton
                btnname={"Cancel"}
                color="#9F9F9F"
                Icon={<></>}
                onClick={handleClose}
              />
              <FilledButton
                btnname={"Create User Role"}
                type="submit"
                width="150px"
                Icon={<></>}
              />
            </Box>
          </Box>
          <Box sx={{ ...styles.box1Style, py: 1 }}>
            <InputBox
              label={"User Role"}
              name="userRole"
              formik={addUserRoleFormik}
            />
          </Box>
        </form>
        <Box>
          <Box sx={{ ...styles.box1Style, py: 1 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
              Modify Access
            </Typography>
            <InputBase
              type="text"
              placeholder="Search Feature..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              sx={styles.inputStyle}
            />
          </Box>
          <Box>
            <TableContainer
              sx={{
                width: "100%",
                maxHeight: "66.5vh",
                overflowX: "auto",
              }}
            >
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                stickyHeader
              >
                <TableHeader2 tableData={userRoleTableData} />
                <AddUserRoleTableBody selectedRole={filteredRows} />
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Toaster />
      </Paper>
    </Modal>
  );
};

export default UserRoleManagementModal;
