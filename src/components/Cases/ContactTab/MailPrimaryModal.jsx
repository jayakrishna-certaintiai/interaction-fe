import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MailIcon from "@mui/icons-material/Mail";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputBase,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Formik, useFormik } from "formik";
import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
// import { BaseURL } from "../../constants/Baseurl";
import { EmailInput } from "../../Common/EmailInput";
import { ActivityContext } from "../../../context/ActivityContext";
import { BaseURL } from "../../../constants/Baseurl";
import { Add, Padding } from "@mui/icons-material";
import { CaseContext } from "../../../context/CaseContext";
// import { ActivityContext } from "../../context/ActivityContext";
import { token_obj } from "../../../constants";

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRadius: "20px 20px 0px 0px",
    margin: "auto",
    maxWidth: "90%",
    width: 700,
    position: "absolute",
    right: "2%",
    bottom: "0%",
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
  labelStyle: { fontSize: "13px", fontWeight: 600, marginRight: "-55%" },
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

const projects = [
  {
    project: "Book Store1",
    To: "Book.srore@gmail.com",
  },
  {
    project: "Restaurant1",
    To: "restaurant@gmail.com",
  },
  {
    project: "Cargo1",
    To: "Cargo@gmail.com",
  },
  {
    project: "mango",
    To: "mango@gmail.com",
  },
];

const validationSchema = yup.object({
  // interactionTo: yup
  //   .string("Enter the mail id you want to send to")
  //   .required("Mail Id is required"),
  // interactionSubject: yup
  //   .string("Insert a subject for the mail")
  //   .required("Subject is required"),
  // interactionDesc: yup
  //   .string("Insert a mail body")
  //   .required("Mail body is required"),
});

const templateMessages = {
  reconcileHours: "Message for Reconcile Hours.",
  uploadTimesheet: "Message for Upload Timesheet.",
  uploadDocument: "Message for Upload Document.",
  updateDetails: "Message for Update Details.",
};

function MailPrimaryModal({
  open,
  handleClose,
  relatedTo,
  relationId,
  relationName,
  recieversEmail,
  handleSendMail,
  handleSurveysMailOpen,
}) {
  const { isVisible, setIsVisible } = useContext(ActivityContext);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [project, setProject] = React.useState(null);
  const { detailedCase } = React.useContext(CaseContext);
  const [selectedProjects, setSelectedProjects] = React.useState([]);

  const addNewInteractionFormik = useFormik({
    initialValues: {
      relatedTo: relatedTo,
      relationId: relationId,
      interactionDesc: null,
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

  const handleExpandIconClick = () => {
    setIsVisible(!isVisible);
  };

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
        console.e(error);
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "60%",
            }}
          >
            <Typography variant="h6" sx={styles.titleStyle}>
              <span style={{ color: "#29B1A8" }}>{detailedCase?.caseCode}</span>
              <p>{detailedCase?.companyName}</p>
            </Typography>
            <Typography sx={styles.labelStyle}>
              Fiscal Year - <span style={{ color: "#29B1A8" }}>2023</span>
            </Typography>
          </Box>

          {/* <Typography sx={styles.selStyle}>{relationName}</Typography> */}
          {/* <p>{detailedCase?.companyName}</p> */}

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
          <Box>
            <div style={styles.divStyle}>
              {/* <div style={styles.divTitleStyle}>
                Project Contact for Project{" "}
              </div> */}
              {/* <Select
                multiple
                sx={{ ...styles.inputBase, border: "none" }}
                placeholder="Select projects"
                value={selectedProjects}
                onChange={(e) => {
                  setSelectedProjects(e.target.value);

                  const selectedTo = e.target.value.map((project) => {
                    const foundProject = projects.find(
                      (p) => p.project === project
                    );
                    return foundProject ? foundProject.To : "";
                  });
                  addNewInteractionFormik.setFieldValue(
                    "interactionTo",
                    selectedTo
                  );
                }} // update selected projects
              >
                {projects?.map((project, index) => (
                  <MenuItem key={index} value={project.project}>
                    {project.project}
                  </MenuItem>
                ))}
              </Select> */}
            </div>
            <div style={styles.divStyle}>
              <div style={styles.divTitleStyle}>To</div>
              <EmailInput
                name="interactionTo"
                defaultValue={addNewInteractionFormik.values.interactionTo.join(
                  ", "
                )}
                formik={addNewInteractionFormik}
                value={addNewInteractionFormik.values.interactionTo.join(", ")}
              />
            </div>
            <div style={styles.divStyle}>
              <div style={styles.divTitleStyle}>CC</div>
              <EmailInput
                name="ccRecipients"
                defaultValue={
                  addNewInteractionFormik.values.ccRecipients
                    ? addNewInteractionFormik.values.ccRecipients.join(", ")
                    : ""
                }
                formik={addNewInteractionFormik}
              />
            </div>
            {/* <div style={styles.divStyle}>
            <div style={styles.divTitleStyle}>BCC</div>
            <InputBase sx={styles.inputBase} />
          </div> */}
            <div style={styles.divStyle}></div>
          </Box>

          <TextField
            multiline
            rows={7}
            placeholder="Write a message"
            variant="outlined"
            fullWidth
            value={addNewInteractionFormik.values.interactionDesc}
            onChange={addNewInteractionFormik.handleChange}
            name="interactionDesc"
            sx={{
              marginTop: 2,
              marginBottom: 2,
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
              width: "95%",
              margin: "auto",
              display: "block",
            }}
          />
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "1rem",
            }}
          >
            <p>date : { }</p>
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
                onClick={() => {
                  handleSendMail(
                    addNewInteractionFormik.values.interactionTo,
                    addNewInteractionFormik.values.interactionDesc,
                    addNewInteractionFormik.values.interactionSubject,
                    addNewInteractionFormik.values.ccRecipients
                  );
                  handleSurveysMailOpen();
                }}
              // onClick={handleAddContact}
              >
                Send
              </Button>
            </Box>
          </Box>
        </form>
        <Toaster />
      </Paper>
    </Modal>
  ) : (
    <>
      {open && (
        <Paper
          sx={{
            width: 700,
            borderRadius: "20px 20px 0px 0px",
            position: "fixed",
            bottom: isVisible ? 0 : 25, // Adjusting bottom position based on visibility
            right: 25,
            transition: "bottom 0.3s ease", // Adding transition for smooth animation
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

export default MailPrimaryModal;
