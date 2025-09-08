import { Box, Table, TableContainer } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BaseURL } from "../../../constants/Baseurl";
import CaseContactModal from "./CaseContactModal";
import { useHasAccessToFeature } from "../../../utils/helper/HasAccessToFeature";
import MailLogo2 from "../../Cases/ContactTab/img/npc.png";
import { Authorization_header } from "../../../utils/helper/Constant";

function PrimaryContactModal({ comId, fetchCompanyContacts }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [clientsData, setClientsData] = useState(null);

  const addContact = async (contactInfo) => {
    const apiUrl = `${BaseURL}/api/v1/contacts/${localStorage.getItem(
      "userid"
    )}/${comId}/create-contact`;

    try {
      const response = await axios.post(apiUrl, contactInfo, Authorization_header());
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddContact = async (contactInfo) => {
    toast
      .promise(addContact(contactInfo), {
        loading: "Adding New Case Employee...",
        success: (data) =>
          data?.message || "Primary Case Employee added successfully",
        error: (error) =>
          error.response?.data?.error?.message ||
          "Failed to add Primary Case Employee.",
      })
      .then(() => {
        fetchCompanyContacts();
      })
      .catch((error) => {
        console.error("Primary Case Employee addition failed:", error);
      });
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  return (
    <>
      <Box
        sx={{
          //   borderTop: "1px solid #E4E4E4",
          p: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {useHasAccessToFeature("F011", "P000000007") && (
            <Box sx={{ paddingRight: "-10px" }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "left",
                  color: "#FD5707",
                  fontWeight: 600,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => setModalOpen(!modalOpen)}
              >
                {/* No Primary Contact assigned */}

                <Box
                  sx={{
                    color: "#FD5707",
                    marginLeft: "7px",
                    marginTop: "-30px",
                  }}
                >
                  No primary contact assigned.
                </Box>
              </span>
            </Box>
          )}
          <CaseContactModal
            open={modalOpen}
            handleClose={handleModalClose}
            onAddContact={handleAddContact}
            client={clientsData}
            primaryContact={true}
          />
        </Box>
      </Box>
      <Box>
        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
            maxHeight: "50vh",
          }}
        >
          <Table aria-label="simple table" stickyHeader></Table>
        </TableContainer>
      </Box>
      <Toaster />
    </>
  );
}

export default PrimaryContactModal;
