import {
  Box,
  Button,
  Modal,
  Paper,
  Typography,
  TableContainer,
  Table,
} from "@mui/material";
import React, { useEffect, useContext, useState } from "react";
// import SelectBox from "../Common/SelectBox";
import { useFormik } from "formik";
import axios from "axios";
import { BaseURL } from "../../../constants/Baseurl";
import Mail from "../../Cases/ContactTab/img/mail.png";
import AddDataModal from "./AddDataModal";
import toast, { Toaster } from "react-hot-toast";
import MailPrimaryModal from "./MailPrimaryModal";
import { CaseContext } from "../../../context/CaseContext";
import { Authorization_header } from "../../../utils/helper/Constant";

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "90%",
    width: 300,
    height: "30%",
  },
  flexBoxItem: {
    mt: 4,
    gap: 0.5,
    px: 2,
  },
  textFiled: {
    width: "265px",
  },
  titleStyle: {
    borderBottom: "1px solid #E4E4E4",
    px: 2.5,
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
    py: 1,
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
    width: "62%",
    height: "35px",
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
  sectionStyle: { fontWeight: 600, px: 2, cursor: "pointer" },
};

const tableData = {
  columns: [
    "Primary Contact",
    "Email Address",
    "Title",
    "Role",
    "Phone Number",
    "Association",
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

const CaseContactModal = ({
  comId,
  open,
  handleClose,
  fetchCompanyContacts,
  primaryContact
}) => {
  const [contactData, setContactData] = useState({
    email: "",
  });
  const [interactionOpen, setinteractionOpen] = React.useState(false);
  const [selectedEmail, setSelectedEmail] = React.useState("");
  const [clientsData, setClientsData] = useState(null);
  const { detailedCase } = useContext(CaseContext);

  const addProjectFormik = useFormik({
    initialValues: {
      caseTypeId: null,
      primaryContactId: null,
      primaryContactCaseRoleId: null,
      primaryContactEmail: null,
      primaryContactRole: null,
    },
  });
  const handleSendMail = async (recieversEmail, description, subject, cc) => {

    handleModalClose("abc");
    try {
      toast.loading("Sending an Email...");
      const res = await axios.post(
        `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/mail`,
        {
          toMail: recieversEmail,
          subject: subject,
          message: description,
          ccMails: cc,
        }
      );
      toast.dismiss();
      toast.success("Email has been sent...");
    } catch (error) {
      toast.dismiss();
      toast.error(error?.message || "Failed to send Email. Server error!");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const [modalOpen, setModalOpen] = useState(false);

  const addContact = async (contactInfo) => {
    const apiUrl = `${BaseURL}/api/v1/contacts/${localStorage.getItem(
      "userid"
    )}/${comId}/create-contact`;

    try {
      const response = await axios.post(apiUrl, contactInfo, Authorization_header);
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
  const handleModalClose1 = (value) => {
    setinteractionOpen(false);
    // handleClose();
  };

  const fetchData = async () => {
    try {
      const response1 = await axios.get(
        `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${detailedCase?.caseId
        }/contacts`
      );
      setClientsData(response1?.data.data);

    } catch (error) {
      console.error(error);
    }
  };


  const { caseData } = useContext(CaseContext);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  // const handleModalClose = () => {
  //   setModalOpen(false);
  // };

  return (
    <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Typography variant="h6" sx={styles.titleStyle}>
          Add Primary Case Contact
        </Typography>
        <Box sx={styles.flexBox}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
              ...styles.flexBoxItem,
            }}
          >
            Already have information?
            <Typography
              variant="body1"
              sx={{
                color: "#29B1A8",
                fontSize: "13px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => setModalOpen(!modalOpen)}
            >
              Add Data
            </Typography>
          </Box>
          <AddDataModal
            open={modalOpen}
            handleClose={handleModalClose}
            onAddContact={handleAddContact}
            clients={clientsData}
            primaryContact={primaryContact}
          />
          {/* <Box>
            <TableContainer>
              <Table sx={{ minWidth: 60 }} aria-label="simple table">
                <TableHeader tableData={tableData} />
                <CaseContactDetails
                  data={clientsData}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                />
              </Table>
            </TableContainer>
          </Box> */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
              ...styles.flexBoxItem,
            }}
          >
            Fetch Information
            <Typography
              variant="body2"
              sx={{
                color: "#29B1A8",
                fontSize: "13px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => setinteractionOpen(!interactionOpen)}
            >
              <img
                src={Mail}
                alt="Mail Logo"
                height="25rem"
                style={{ cursor: "pointer" }}
              />
            </Typography>
          </Box>
          <MailPrimaryModal
            open={interactionOpen}
            handleClose={handleModalClose1}
            recieversEmail={selectedEmail}
            handleSendMail={handleSendMail}
          />
        </Box>
      </Paper>
    </Modal>
  );
};

export default CaseContactModal;
