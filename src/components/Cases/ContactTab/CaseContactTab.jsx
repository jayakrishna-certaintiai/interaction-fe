import AddIcon from "@mui/icons-material/Add";
import { Box, Button, CircularProgress, Table, TableContainer, TablePagination } from "@mui/material";
import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BaseURL } from "../../../constants/Baseurl";
import { useHasAccessToFeature } from "../../../utils/helper/HasAccessToFeature";
import AddDataModal from "./AddDataModal";
import TableHeader from "../../Common/TableHeader";
import { CaseContext } from "../../../context/CaseContext";
import CaseContactDetails from "./CaseContactDetails";

const tableData = {
  columns: [
    "Contact Name",
    "Email Address",
    "Title",
    "Role",
    // "Phone Number",
    "Association Project",
    "Survey",
  ],
  rows: [
    {
      id: 1,
      name: "Adam Smith",
      email: "adam.smith@apple.com",
      employeeTitle: "Finance Head",
      roleId: "project manager",
      phone: "(336) 222-7000",
      associationIds: "sdf",
      sendSurvey: "yes",
    },
  ],
};

function CaseContactTab({ data, comId, caseId, fetchCompanyContacts }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [contactList, setContactList] = useState(null);
  const { detailedCase } = useContext(CaseContext);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filteredContact, setFilterContact] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response1 = await axios.get(
        `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${detailedCase?.caseId
        }/contacts`
      );
      setContactList(response1?.data.data);
      setFilterContact(response1?.data?.data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
      setLoading(false);
    } catch (error) {
      setLoading(false)
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [detailedCase?.caseId]);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    setFilterContact(contactList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          <Box sx={{ mt: "10px" }}>
            <b>Case Employees :</b>
          </Box>
          {useHasAccessToFeature("F011", "P000000007") && (
            <Button
              sx={{
                textTransform: "capitalize",
                borderRadius: "20px",
                backgroundColor: "#00A398",
                color: "white",
                mr: 2,
                "&:hover": {
                  backgroundColor: "#00A398",
                },
              }}
              onClick={() => setModalOpen(!modalOpen)}
            >
              <AddIcon style={{ fontSize: "17px", marginRight: "3px" }} />
              New Case Contact
            </Button>
          )}
          <AddDataModal
            open={modalOpen}
            handleClose={handleModalClose}
            clients={contactList}
            handleFetchAllContacts={fetchData}
          />
        </Box>
      </Box>
      <Box>
        <TableContainer
          sx={{ height: 300 }}
        >
          <Table aria-label="simple table">
            <TableHeader tableData={tableData} />
            <CaseContactDetails
              data={filteredContact}
            />
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
          {contactList?.length === 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
                minHeight: "380px",
              }}
            >
              No contact found. Please add conatct.
            </div>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={contactList?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <Toaster />
    </>
  );
}

export default CaseContactTab;
