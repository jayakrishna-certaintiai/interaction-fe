import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  Button,
  Modal,
  Paper,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BaseURL } from "../../../constants/Baseurl";
import InputBox from "../../Common/InputBox";
import SelectBox from "../../Common/SelectBox";
import { CaseContext } from "../../../context/CaseContext";
import * as yup from "yup";

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "70%",
    width: "35rem",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  titleStyle: {
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
    color: "white",
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
    // borderBottom: "1px solid #E4E4E4",
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
  topBoxStyle: {
    borderBottom: "1px solid #E4E4E4",
    px: 2.0,
    textAlign: "left",
    py: 1,
    marginLeft: "12px",
    marginRight: "12px",
    borderRadius: "15px",
    height: "35px",
  },
  textFiled: {
    width: "530px",
  },
  textFiled1: {
    width: "255px",
  },
};
const validationSchema = yup.object({
  sendSurvey: yup
    .string("Select Survey Participation")
    .required("Survey Participation is required"),
});


const AddDataModal = ({
  open,
  handleClose,
  comId = "",
  handleFetchAllContacts,
  primaryContact = false,
  projectid = null
}) => {
  const { detailedCase } = useContext(CaseContext);
  const { selectedProject } = useContext(CaseContext);
  const [caseRoles, setCaseRoles] = useState([]);
  const [companyProjects, setCompanyProjects] = useState(null);
  const [companyContacts, setCompanyContacts] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([projectid]);

  const addProjectFormik = useFormik({
    initialValues: {
      caseId: detailedCase?.caseId,
      caseProjectId: selectedProject?.caseProjectId,
      contactId: null,
      firstName: null,
      lastName: null,
      email: null,
      roleId: null,
      sendSurvey: null,
      associationIds: null,
      employeeTitle: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addContact(values, false);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(
          `${BaseURL}/api/v1/contacts/${localStorage.getItem(
            "userid"
          )}/${detailedCase?.companyId}/get-contacts?clientContacts=true`
        );
      
        setCompanyContacts(response1?.data.data?.list);

        const response2 = await axios.get(
          `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/caseroles`
        );
        setCaseRoles(response2?.data.data);

        const response3 = await axios.get(
          `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${detailedCase?.caseId
          }/projects`
        );
        setCompanyProjects(response3?.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [detailedCase?.caseId]);

  const addContact = async (values, isForceAdd) => {
    toast.loading("Adding New Case Contact...");
    try {
      const response = await axios.post(
        `${BaseURL}/api/v1/case/${localStorage.getItem(
          "userid"
        )}/casecontact/add`,
        {
          ...values,
          addNewContact:
            values.contactId == null || values?.contactId?.length < 1
              ? true
              : false,
          sendSurvey: values.sendSurvey == "yes" ? true : false,
          primaryCaseContact: primaryContact
        },
      );
      addProjectFormik.resetForm();
      toast.dismiss();
      toast.success(`Case Contact added successfully`);
      handleFetchAllContacts();
      handleClose();
      return response;
    } catch (error) {
      toast.dismiss();
      handleClose();
      toast.error(
        error?.response?.data?.message ||
        "Failed to adding case Contact. Server Error !"
      );
    }
  };

  useEffect(() => {
    const { contactId } = addProjectFormik.values;
    addProjectFormik.setFieldValue("email", contactId ? companyContacts.find(contact => contact.contactId === contactId)?.email : null);
    addProjectFormik.setFieldValue("employeeTitle", contactId ? companyContacts.find(contact => contact.contactId === contactId)?.employeeTitle : null);
  }, [addProjectFormik.values.contactId]);

  const handleModalClose = () => {
    addProjectFormik.resetForm();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleModalClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Box
          sx={{
            ...styles.topBoxStyle,
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#00A398",
            marginTop: "16px",
            marginBottom: "-0.5rem",
          }}
        >
          <Typography variant="h6" sx={styles.titleStyle}>
            Add Employee into Case
          </Typography>
          <CancelIcon
            sx={{
              color: "#9F9F9F",
              marginTop: "-3px",
              cursor: "pointer",
              "&: hover": { color: "#FD5707" },
            }}
            onClick={handleModalClose}
          />
        </Box>
        <form onSubmit={addProjectFormik.handleSubmit}>
          <Box sx={styles.flexBox}>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              <SelectBox
                label="Choose from existing Employees"
                name="contactId"
                width={styles.textFiled}
                formik={addProjectFormik}
                selectOptions={companyContacts?.map((item) => ({
                  id: item.contactId,
                  name: item?.firstName + " " + item?.lastName,
                }))}
              />
            </Box>
            {!addProjectFormik.values.contactId && (
              <>
                <Box sx={{ ...styles.flexBoxItem, mt: 1 }}>For Add new case contact:</Box>
                <Box sx={{ ...styles.flexBoxItem, mt: 1 }}>
                  <InputBox
                    label="First Name"
                    name="firstName"
                    width={styles.textFiled}
                    formik={addProjectFormik}
                  />
                </Box>
                <Box sx={{ ...styles.flexBoxItem, mt: 1 }}>
                  <InputBox
                    label="Last Name"
                    name="lastName"
                    width={styles.textFiled}
                    formik={addProjectFormik}
                  />
                </Box>
              </>
            )}
            <Box sx={{ ...styles.flexBoxItem, mt: 1 }}>
              <InputBox
                label="Contact Email"
                name="email"
                disabled={addProjectFormik.values?.contactId?.length > 0 ? true : false}
                width={styles.textFiled}
                formik={addProjectFormik}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mt: 1 }}>
              <InputBox
                required={true}
                label="Contact Title"
                name="employeeTitle"
                width={styles.textFiled}
                formik={addProjectFormik}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mb: 1, width: "20px" }}>
              <SelectBox
                required={true}
                label="Choose Role"
                name="roleId"
                width={styles.textFiled1}
                formik={addProjectFormik}
                selectOptions={caseRoles?.map((item) => ({
                  id: item.caseRoleId,
                  name: item.caseRoleName,
                }))}
              />
              <SelectBox
                required={true}
                label="Survey Participation"
                name="sendSurvey"
                width={styles.textFiled1}
                formik={addProjectFormik}
                selectOptions={[
                  { id: "yes", name: "Yes" },
                  { id: "no", name: "No" },
                ]}
              />
            </Box>
            {!projectid &&
              <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
                <Box sx={{ width: "100%" }} required={true}>
                  Choose Project<span style={{ color: 'red' }}>*</span>

                  <Select
                    multiple
                    sx={{ ...styles.inputBase, border: "none", width: "100%" }}
                    placeholder="Select projects"
                    value={selectedProjects}
                    onChange={(e) => {
                      setSelectedProjects(e.target.value);
                      addProjectFormik.setFieldValue(
                        "associationIds",
                        e.target.value
                      );
                    }}
                  >
                    {companyProjects?.map((project, index) => (
                      <MenuItem key={index} value={project.caseProjectId}>
                        {project.projectName}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
            }
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
              type="submit"
            >
              Add Employee
            </Button>
          </Box>
        </form>
        <Toaster />
      </Paper>
    </Modal>
  );
};

export default AddDataModal;