import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  InputAdornment,
  InputBase,
  Table,
  TableContainer,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { BaseURL } from "../../../constants/Baseurl";
import { userRoleTableData } from "../../../constants/userRoleTableData";
import { useRoleContext } from "../../../context/UserRoleManagementContext";
import { useHasAccessToFeature } from "../../../utils/helper/HasAccessToFeature";
import {
  flattenAddRolesData,
  flattenRolesData,
} from "../../../utils/helper/UserRoleUtils";
import SelectBox from "../../Common/SelectBox";
import TableHeader2 from "../../Common/TableHeader2";
import FilledButton from "../../button/FilledButton";
import UserRoleManagementModal from "./UserRoleManagementModal";
import UserRoleManagementTableBody from "./UserRoleManagementTableBody";

const validationSchema = yup.object({
  userRole: yup
    .string("Select Your User Role")
    .required("User Role is required"),
});

const styles = {
  box1Style: {
    display: "flex",
    justifyContent: "space-between",
    px: 2,
    py: 1,
    borderBottom: "1px solid #E4E4E4",
    alignItems: "center",
  },
  newCompanyButtonStyle: {
    textTransform: "capitalize",
    borderRadius: "20px",
    backgroundColor: "#00A398",
    mr: 2,
    "&:hover": {
      backgroundColor: "#00A398",
    },
  },
  iconStyle: { fontSize: "17px", marginRight: "3px" },
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
    height: "40px",
    border: "1px solid #9F9F9F",
    mr: 2,
  },
};

function UserRoleManagement() {
  const {
    fetchUserRolesInfo,
    userRolesInfo,
    changedPermission,
    setselectedEditRoleState,
    setChangedPermission,
    setselectedAddRoleState,
  } = useRoleContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setChangedPermission([]);
  };

  useEffect(() => {
    fetchUserRolesInfo();
  }, [localStorage?.getItem("keys")]);

  const handleSaveChangesClick = async () => {
    toast.promise(
      (async () => {
        try {
          const response = await axios.post(
            `${BaseURL}/api/v1/users/settings/${localStorage.getItem(
              "userid"
            )}/edit-role-feature`,
            {
              body: changedPermission,
            }
          );
          setIsEditMode(false);
          setChangedPermission([]);
          fetchUserRolesInfo();
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
        loading: "Updating role...",
        success: (response) =>
          response.data.message || "Role updated successfully",
        error: (response) =>
          response.data?.error?.message || "Failed to update role.",
      }
    );
  };

  const handleUploadClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const selectRoleFormik = useFormik({
    initialValues: {
      userRole: userRolesInfo[0]?.roleId,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {

    },
  });

  const isCreate = useHasAccessToFeature("F002", "P000000007");
  const isUpdate = useHasAccessToFeature("F002", "P000000001");
  const isSearch = useHasAccessToFeature("F002", "P000000009");

  useEffect(() => {
    if (userRolesInfo.length > 0) {
      const selectedRoleInfo = userRolesInfo?.find(
        (item) => item?.roleId === selectRoleFormik.values.userRole
      );
      setSelectedRole(selectedRoleInfo ? selectedRoleInfo?.roleFeatures : []);
      setselectedEditRoleState(flattenRolesData(selectedRoleInfo));
      setChangedPermission([]);
    }
  }, [selectRoleFormik.values.userRole]);

  useEffect(() => {
    if (userRolesInfo.length > 0) {
      const selectedRoleInfo = userRolesInfo?.find(
        (item) => item?.roleId === "R00000001"
      );
      setselectedAddRoleState(flattenAddRolesData(selectedRoleInfo));
    }
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    if (selectedRole) {
      const filteredData = selectedRole?.filter(
        (task) =>
          task?.feature?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.description?.toLowerCase()?.includes(search?.toLowerCase())
        // Add more conditions as needed
      );
      setFilteredRows(filteredData);
    }
  }, [selectedRole, search]);

  return (
    <>
      <Box sx={styles.box1Style}>
        <Typography sx={{ fontSize: "23px", fontWeight: "500" }}>
          User Role Management
        </Typography>
        {isCreate && (
          <FilledButton
            btnname={"Create New User Role"}
            onClick={handleUploadClick}
            width="200px"
          />
        )}
        <UserRoleManagementModal
          open={modalOpen}
          handleClose={handleModalClose}
          selectedRole={selectedRole}
        />
      </Box>
      <Box sx={styles.box1Style}>
        {useHasAccessToFeature("F002", "P000000008") && (
          <SelectBox
            width="300px"
            label="User Role"
            name="userRole"
            formik={selectRoleFormik}
            selectOptions={userRolesInfo?.map((item) => ({
              id: item.roleId,
              name: item.role,
            }))}
          />
        )}
        {isUpdate && (
          <>
            {!isEditMode ? (
              <FilledButton
                btnname={"Edit"}
                onClick={handleEditClick}
                Icon={<EditIcon />}
              />
            ) : (
              <>
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <FilledButton
                    btnname={"Cancel"}
                    onClick={handleCancelClick}
                    color="#9F9F9F"
                    Icon={<></>}
                  />
                  <FilledButton
                    btnname={"Save Changes"}
                    onClick={handleSaveChangesClick}
                    Icon={<></>}
                    width="130px"
                  />
                </Box>
              </>
            )}
          </>
        )}
      </Box>
      <Box>
        <Box sx={{ ...styles.box1Style, py: 1 }}>
          <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
            Modify Access
          </Typography>
          {isSearch && (
            <InputBase
              type="text"
              placeholder="Search Feature..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={styles.searchIconStyle} />
                </InputAdornment>
              }
              sx={styles.inputStyle}
            />
          )}
        </Box>
        {useHasAccessToFeature("F002", "P000000008") && (
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
                <UserRoleManagementTableBody
                  edit={isEditMode}
                  selectedRole={filteredRows}
                  roleId={selectRoleFormik.values.userRole}
                />
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
      <Toaster />
    </>
  );
}

export default UserRoleManagement;
