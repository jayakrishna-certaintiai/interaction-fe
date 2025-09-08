import { Box, Table, TableContainer } from "@mui/material";
import React, { useState } from "react";
import UpdationDetails2 from "../Common/UpdationDetails2";
import PanelTableHeader from "../Timesheets/MainPanel/PanelTableHeader";
import FilledButton from "../button/FilledButton";
import CompanyUsersTableBody from "./CompanyUsersTableBody";
import UserManagementModal from "../Settings/UserManagement/UserManagementModal";

const tableData = {
  columns: [
    "Name",
    "Title",
    "User Role",
    "Status",
    "Email Address",
    "Actions",
  ],
  rows: [
    {
      id: 1,
      name: "Adam Smith",
      title: "Finance Head",
      role: "Admin",
      status: "Active",
      email: "Adam.smith @apple.com",
      lastLogin: "Logged out 18/11/2023 12:34:26",
    },
  ],
};

function CompanyUsers({ userList, latestUpdateTime, modifiedBy, fetchUsers, companyId }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleUploadClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          borderTop: "1px solid #E4E4E4",
          p: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <UpdationDetails2
            items={userList?.length}
            latestUpdateTime={latestUpdateTime}
            modifiedBy={modifiedBy}
          />
          <FilledButton
            btnname={"New User"}
            onClick={handleUploadClick}
            width="130px"
          />
        </Box>
        <UserManagementModal
          open={modalOpen}
          handleClose={handleModalClose}
          fetchUsersList={fetchUsers}
          companyId={companyId}
        />
      </Box>
      <Box>
        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
            maxHeight: "50vh",
            // scrollbarWidth: "none",
            // msOverflowStyle: "none",
            // "&::-webkit-scrollbar": {
            //   display: "none",
            // },
          }}
        >
          <Table stickyHeader aria-label="simple table">
            <PanelTableHeader tableData={tableData} />
            <CompanyUsersTableBody
              filledRows={userList}
              fetchUsers={fetchUsers}
            />
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default CompanyUsers;
