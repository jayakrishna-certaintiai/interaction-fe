/*******************************************************NewInteractionModal.jsx*****************************************************/
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MailIcon from "@mui/icons-material/Mail";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { ActivityContext } from "../../context/ActivityContext";
import { BaseURL } from "../../constants/Baseurl";
import { CaseContext } from "../../context/CaseContext";
import SurveysAddProjectModal from "../Cases/surveysTab/SurveysAddProjectModal";
import SurveysMailSendModal from "../Cases/CaseModalComponets/SurveysMailSendModal";
import InteractionsAddProjectModal from "../Cases/IneractionTab/InteractionsAddProjectModal";
import InteractionMailSendModal from "../Cases/IneractionTab/InteractionMailSendModal";
import { token_obj } from "../../utils/helper/Constant";


const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "80%",
    width: 1200,
    height: "800",
    position: "absolute",
    transform: "translate(-0%, -0%)",
  },
  titleStyle: {
    px: 1,
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
    alignItems: "center",
    justifyContent: "center",
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
    gap: 2,
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
  inputBase: {
    borderRadius: "20px",
    height: "40px",
    border: "1px solid #c4c4c4",
    pl: 1,
    mb: 0.5,
    width: "600px",
  },
  box1Style: {
    display: "flex",
    justifyContent: "space-between",
    p: 2,
    borderBottom: "1px solid #E4E4E4",
    alignItems: "center",
  },
  radioStyle: {
    "& .MuiSvgIcon-root": {
      fontSize: 20,
      color: "#00A398",
    },
  },
  labelStyle: { fontSize: "13px", fontWeight: 600 },
  divStyle: {
    display: "flex",
    padding: "0 20px",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  divTitleStyle: { fontSize: "13px", fontWeight: "600" },
  selStyle: {
    border: "1px solid #E4E4E4",
    px: 2,
    py: 0.5,
    borderRadius: "20px",
    fontSize: "13px",
    width: "180px",
    textAlign: "center",
  },
};

const validationSchema = yup.object({
});

const templateMessages = {
  reconcileHours: "Message for Reconcile Hours.",
  uploadTimesheet: "Message for Upload Timesheet.",
  uploadDocument: "Message for Upload Document.",
  updateDetails: "Message for Update Details.",
};

function NewInteractionModal({
  open,
  handleClose,
  relatedTo,
  relationId,
  relationName,
  handleSendMail,
  handleSurveysMailOpen,
  interactionData,
  tableColumn,
  interactionPurpose
}) {
  const { isVisible, setIsVisible } = useContext(ActivityContext);
  const { detailedCase } = React.useContext(CaseContext);
  const [selectedInteractions, setSelectedInteractions] = React.useState([]);
  const [addInteractionsOpen, setAddInteractionsOpen] = useState(open);
  const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
  const [confirmationInteractions, setConfirmationInteractions] = React.useState([]);
  const [detailedSelectedInteractions, setDetailedSelectedInteractions] = React.useState([]);
  const [allInteractions, setAllInteractions] = React.useState([]);
  const [feedInteractions, setFeedInteractions] = useState([]);
  const [loading, setLoading] = React.useState(false);

  const addNewInteractionFormik = useFormik({
    initialValues: {
      relatedTo: relatedTo,
      relationId: relationId,
      interactionDesc: "We trust this email finds you well.As we progress with the application for R&D Credits for project Auto generation of health records, we require additional information from your end to ensure comprehensive documentation. To facilitate this process, we have prepared a brief survey designed to gather essential data related to the project. Your input will greatly assist us in accurately assessing the project's eligibility for R&D Credits.Please take a moment to complete the survey by clicking theSURVEY LINK. Your responses are invaluable to us and will contribute significantly to our efforts.Upon completion, simply submit the survey, and your responses will be securely forwarded to us for further processing.",
      interactionSubject: null,
      interactionActivityType: "Interactions",
      ccRecipients: [],
      interactionTo: [],
      companyId: relatedTo === "Accounts" ? relationId : null,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {

      newInteraction(values)
        .then(() => {
          addNewInteractionFormik.resetForm();
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });
    },
  });

  const handleConfimationModalOpen = () => {
    setConfirmationModalOpen(true);
  }

  const handleConfimationModalClose = () => {
    setConfirmationModalOpen(false);
  }

  const handleAddClose = () => {
    setAddInteractionsOpen(false);
  }


  const handleExpandIconClick = () => {
    setIsVisible(!isVisible);
  };

  const getSelectedInteractions = (selectedInteractions, detailedSelectedProject, interactionData = "null") => {
    setSelectedInteractions(selectedInteractions);
    setDetailedSelectedInteractions(detailedSelectedProject);
    setAllInteractions(interactionData);
  }

  const getUnsentData = () => {
    const newInteractions = interactionData?.filter((i) => {
      return (i.status.toLowerCase() === "not sent")
    })
    setFeedInteractions(newInteractions);
  }

  const getSentData = () => {
    const newInteractions = interactionData?.filter((i) => {

      return (i.status.toLowerCase() === "sent")
    })
    setFeedInteractions(newInteractions);
  }

  useEffect(() => {
    if (interactionPurpose === "interactions") { getUnsentData() }
    else if (interactionPurpose === "reminder") { getSentData() }
  }, [interactionPurpose, interactionData]);


  useEffect(() => {
    const InteractionsData = selectedInteractions.map((project) => ({ interactionId: project.interactionId, projectId: project.projectId }));
    setConfirmationInteractions(InteractionsData);
  }, [selectedInteractions])

  const newInteraction = async (values) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BaseURL}/api/v1/interactions/${localStorage.getItem(
        "userid"
      )}/1/create-activity`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token_obj.accessToken}`
      },
      data: values,
    };
    axios
      .request(config)
      .then((response) => {
        toast.success("Mail sent Successfully!");
        handleClose();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error sending the mail!");
      });
  };

  return isVisible ? (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
      disableEscapeKeyDown={true}
      sx={styles.modalStyle}
      id="interaction-modal"
    >

      <Paper sx={styles.paperStyle}>
        <Box sx={{ ...styles.box1Style, py: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "90%" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", fontSize: "30px" }}>

              <Typography variant="h6" sx={{ ...styles.titleStyle, fontSize: "20px" }}>
                Send {interactionPurpose?.charAt(0)?.toUpperCase() + interactionPurpose?.slice(1)}  <span style={{ color: "#29B1A8" }}></span>
              </Typography>
              {/* <Typography sx={{ ...styles.labelStyle, fontSize: "20px" }}>Fiscal Year - <span style={{ color: "#29B1A8" }}>2023</span></Typography> */}
            </Box>
            <Box sx={{ padding: "5px 10px" }}>
              <p>{detailedCase?.companyName}</p>
            </Box>
          </Box>
          <IconButton
            sx={{ border: "1px solid #E4E4E4" }}
            onClick={handleExpandIconClick}
          >
            <ExpandMoreIcon
              sx={{
                color: "#404040",
                cursor: "pointer",
                transform: !isVisible ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </IconButton>
        </Box>
        <form onSubmit={addNewInteractionFormik.handleSubmit}>
          <Box sx={{ height: '90%' }}>
            <InteractionsAddProjectModal open={addInteractionsOpen} getSelectedInteractions={getSelectedInteractions} handleClose={handleClose} confirmationInteractions={confirmationInteractions} interactionData={feedInteractions} />
          </Box>
          <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "1rem" }}>
            <Box><Typography>Selected {selectedInteractions?.length} projects out of {interactionData?.length}</Typography></Box>
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
                type="submit"
                onClick={(e) => {

                  e.preventDefault();
                  handleConfimationModalOpen()
                }
                }
              >
                Proceed
              </Button>
            </Box>
          </Box>
        </form>
        {confirmationModalOpen && <InteractionMailSendModal handleSendMail={handleSendMail} selectedInteractions={selectedInteractions} detailedSelectedInteractions={detailedSelectedInteractions} addNewInteractionFormik={addNewInteractionFormik} confirmationModalOpen={confirmationModalOpen} handleConfimationModalClose={handleConfimationModalClose} handleClose={handleClose} interactionPurpose={interactionPurpose} />}
        <Toaster />
      </Paper>
    </Modal >
  ) : (
    <>
      {open && (
        <Paper
          sx={{
            width: 700,
            borderRadius: "20px 20px 0px 0px",
            position: "fixed",
            bottom: isVisible ? 0 : 25,
            right: 25,
            transition: "bottom 0.3s ease",
          }}
        >
          <Box sx={{ ...styles.box1Style, py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <MailIcon />
              <Typography variant="h6" sx={styles.titleStyle}>
                New Interaction - Email
              </Typography>
            </Box>

            <Typography sx={styles.selStyle}>{relatedTo}</Typography>
            <Typography sx={styles.selStyle}>{relationName}</Typography>

            <IconButton
              sx={{ border: "1px solid #E4E4E4" }}
              onClick={handleExpandIconClick}
            >
              <ExpandMoreIcon
                sx={{
                  color: "#404040",
                  cursor: "pointer",
                  transform: !isVisible ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}

export default NewInteractionModal;
