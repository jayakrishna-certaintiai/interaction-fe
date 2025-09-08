import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  InputLabel,
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
import { BaseURL } from "../../constants/Baseurl";
import InputBox from "../Common/InputBox";
import SelectBox from "../Common/SelectBox";
import { FilterListContext } from "../../context/FiltersListContext";
import { Authorization_header } from "../../utils/helper/Constant";

const validationSchema = yup.object({
  projectName: yup
    .string("Enter your Project Name")
    .required("Project Name is required"),
  companyId: yup
    .string("Enter your Account Id")
    .required("Account Id is required"),
  projectManagerId: yup
    .string("Enter your Project Manager")
    .required("Project Manager is required"),
  accountingYear: yup
    .string("Enter your Fiscal Year")
    .required("Fiscal Year is required"),
});

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "90%",
    width: 700,
    maxHeight: "90vh",
    overflowY: "auto",
    // scrollbarWidth: "none", // For Firefox
    // msOverflowStyle: "none", // For Internet Explorer 10+
    // "&::-webkit-scrollbar": {
    //   display: "none", // For WebKit browsers like Chrome and Safari
    // },
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
  topBoxStyle: {
    borderBottom: "1px solid #E4E4E4",
    px: 2.5,
    textAlign: "left",
    py: 1,
  },
};

const AccYears = [
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "2031",
  "2032",
  "2033",
  "2034",
  "2035",
  "2036",
  "2037",
  "2038",
  "2039",
  "2040",
];

const ProjectModal = ({ open, handleClose, comId = "", fetchProjectData }) => {
  const [visibility, setVisibility] = useState({
    contact: false,
    additionalDetails: false,
    milestones: false,
  });
  const { clientList, fetchClientList } = useContext(FilterListContext);
  const [Contacts, setContacts] = useState([]);
  const [Portfolios, setPortfolios] = useState([]);

  const [companyContacts, setCompanyContacts] = useState(null);


  useEffect(() => {
    fetchClientList();
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BaseURL}/api/v1/contacts/${localStorage.getItem(
            "userid"
          )}/1/get-contacts`, Authorization_header()
        );
        // const response1 = await axios.get(
        //   `${BaseURL}/api/v1/portfolios/${localStorage.getItem(
        //     "userid"
        //   )}/get-portfolios`, Authorization_header()
        // );

        setContacts(response?.data?.data?.list);
        // setPortfolios(response1?.data?.data);
      } catch (error) {
        console.error(error);
      }
    };
    // fetchData();
  }, [localStorage?.getItem("keys")]);

  const toggleVisibility = (key) => {
    setVisibility((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const addProjectFormik = useFormik({
    initialValues: {
      companyId: null,
      projectName: null,
      projectManagerId: null,
      projectType: null,
      projectPortfolio: null,
      accountingYear: null,
      startDate: null,
      endDate: null,
      plannedDuration: null,
      actualStartDate: null,
      actualEndDate: null,
      actualDuration: null,
      projectsIndustry: null,
      natureofProject: null,
      EmpBlendedRatePerHour: null,
      successCriteria: null,
      techStack: null,
      projectStatus: null,
      description: null,
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      addProject(values);
    },
  });

  const fetchCompanyContacts = async () => {
    try {

      const response2 = await axios.get(
        `${BaseURL}/api/v1/company/${localStorage.getItem(
          "userid"
        )}/${addProjectFormik.values.companyId}/get-contacts-by-company`, Authorization_header()
      );

      setCompanyContacts(response2.data.data);
    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    // fetchCompanyContacts();


  }, [addProjectFormik.values.companyId])

  const addMilestoneFormik = useFormik({
    initialValues: {
      milestones: [{ milestoneName: "", startDate: "", endDate: "" }],
    },
    onSubmit: (values) => {

    },
  });

  const addMilestone = () => {
    const newMilestone = { milestoneName: "", startDate: "", endDate: "" };
    addMilestoneFormik.setFieldValue("milestones", [
      ...addMilestoneFormik.values.milestones,
      newMilestone,
    ]);
  };
  const companyId = comId !== "" ? comId : addProjectFormik.values?.companyId;



  const addProject = async (values) => {
    toast.promise(
      (async () => {
        try {
          const response = await axios.post(
            `${BaseURL}/api/v1/projects/${localStorage.getItem(
              "userid"
            )}/${companyId}/add-project`,
            {
              projectDetails: values,
              milestones: addMilestoneFormik.values,
            }, Authorization_header()
          );
          if (response.data.success) {
            handleClose();
            fetchProjectData();
          }
          return response;
        } catch (error) {
          throw error.response
            ? error.response
            : new Error("Network or server error");
        }
      })(),
      {
        loading: "Adding New Project...",
        success: (response) =>
          response.data.message || "Project added successfully",
        error: (response) =>
          response.data.error.message || "Failed to adding new project.",
      }
    );
  };


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
            Add New Project
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

        <form onSubmit={addProjectFormik?.handleSubmit}>


          <Box sx={styles.flexBox}>
            <Typography sx={{ fontWeight: 600, px: 2 }}>
              Basic Details
            </Typography>
            <Box sx={styles.flexBoxItem}>
              <InputBox
                label="Project Name"
                name="projectName"
                formik={addProjectFormik}
                required={true}
              />
              <InputBox
                label="Employee Blended Rate Per Hour"
                name="EmpBlendedRatePerHour"
                formik={addProjectFormik}
                type="number"
              />
              {/* <InputBox
                label="Status"
                name="projectStatus"
                formik={addProjectFormik}
              /> */}

              <SelectBox
                label="Status"
                name="projectStatus"
                formik={addProjectFormik}
                selectOptions={["Active", "Inactive"]?.map((item) => ({
                  id: item,
                  name: item,
                }))}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              <SelectBox
                label="Account"
                name="companyId"
                formik={addProjectFormik}

                required={true}

                selectOptions={clientList?.map((item) => ({
                  id: item.companyId,
                  name: item.companyName,
                }))}
              />
              {/* <InputLabel>Accounts</InputLabel> */}
              {/* <Select
                label="Account"
                name="companyId"
                formik={addProjectFormik}
                required={true}
                onChange={(e) => {
                  setClient(e.target.value);
                }}
                sx={{ outline: "none" }}
                selectOptions={clientList?.map((item) => ({
                  id: item.companyId,
                  name: item.companyName,
                }))} >
                {clientList.map((client, index) => (<MenuItem value={client.companyName}>{client.companyName}</MenuItem>))}


              </Select> */}
              <SelectBox
                label="Portfolio"
                name="projectPortfolio"
                formik={addProjectFormik}
                selectOptions={Portfolios?.map((item) => ({
                  id: item.portfolioId,
                  name: item.name,
                }))}
              />
              <SelectBox
                label="Project Manager"
                name="projectManagerId"
                formik={addProjectFormik}
                selectOptions={companyContacts?.map((item) => ({
                  id: item.contactId,
                  name: item.firstName + " " + item.lastName,
                }))}
              />
              {/* <Select
                label="Project Manager"
                name="projectManagerId"
                formik={addProjectFormik}
                required={true}
                onChange={(e) => {
            
                  setContacts(e.target.value);
                }}
                sx={{ outline: "none" }}
                selectOptions={contactList?.map((item) => ({
                  id: item.contactId,
                  name: item.firstName + " " + item.lastName,
                }))} >
                {contactList.map((Contacts, index) => (<MenuItem value={Contacts.companyName}>{Contacts.companyName}</MenuItem>))}


              </Select> */}
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              <SelectBox
                label="Project Type"
                name="projectType"
                formik={addProjectFormik}
                selectOptions={[
                  "Software Development",
                  "Software Testing",
                ]?.map((item) => ({
                  id: item,
                  name: item,
                }))}
              />
              <SelectBox
                label="Industry"
                name="projectsIndustry"
                formik={addProjectFormik}
                selectOptions={["Software", "Telecom"]?.map((item) => ({
                  id: item,
                  name: item,
                }))}
              />
              <SelectBox
                type="number"
                label="Fiscal Year"
                name="accountingYear"
                formik={addProjectFormik}
                required={true}
                selectOptions={AccYears?.map((item) => ({
                  id: item,
                  name: item,
                }))}
              />
            </Box>
          </Box>

          {/* Contact */}
          <Box sx={styles.flexBox}>
            <Typography
              sx={{ fontWeight: 600, px: 2 }}
              onClick={() => toggleVisibility("Employees")}
            >
              <ExpandMoreIcon
                sx={{
                  ...styles.expandMoreIcon,
                  transform: visibility.contact
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
              Project Timeline
            </Typography>
            {visibility.contact && (
              <>
                <Box sx={styles.flexBoxItem}>
                  <InputBox
                    type="date"
                    label="Kickoff"
                    name="startDate"
                    formik={addProjectFormik}
                  />
                  <InputBox
                    type="date"
                    label="Deadline"
                    name="endDate"
                    formik={addProjectFormik}
                  />
                  <InputBox
                    type="number"
                    label="Planned Duration"
                    name="plannedDuration"
                    formik={addProjectFormik}
                  />
                </Box>
                <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
                  <InputBox
                    type="date"
                    label="Actual Start Date"
                    name="actualStartDate"
                    formik={addProjectFormik}
                  />
                  <InputBox
                    type="date"
                    label="Actual End Date"
                    name="actualEndDate"
                    formik={addProjectFormik}
                  />
                  <InputBox
                    type="number"
                    label="Actual Duration"
                    name="actualDuration"
                    formik={addProjectFormik}
                  />
                </Box>
              </>
            )}
          </Box>

          {/* Additional Details */}
          <Box sx={{ ...styles.flexBox }}>
            <Typography
              sx={{ fontWeight: 600, px: 2 }}
              onClick={() => toggleVisibility("additionalDetails")}
            >
              <ExpandMoreIcon
                sx={{
                  ...styles.expandMoreIcon,
                  transform: visibility.additionalDetails
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
              Additional Details
            </Typography>
            {visibility.additionalDetails && (
              <Box sx={{ px: 2, mt: 1 }}>
                <InputLabel sx={styles.label}>Description</InputLabel>
                <TextField
                  multiline
                  rows={1}
                  sx={{ width: "100%", mb: 1 }}
                  InputProps={{
                    style: {
                      borderRadius: "20px",
                    },
                  }}
                  name="description"
                  type="text"
                  value={addProjectFormik.values.description}
                  onChange={addProjectFormik.handleChange}
                />
                <InputLabel sx={styles.label}>Nature of Project</InputLabel>
                <TextField
                  multiline
                  rows={1}
                  sx={{ width: "100%", mb: 1 }}
                  InputProps={{
                    style: {
                      borderRadius: "20px",
                    },
                  }}
                  name="natureofProject"
                  type="text"
                  value={addProjectFormik.values.natureofProject}
                  onChange={addProjectFormik.handleChange}
                />
                <InputLabel sx={styles.label}>
                  Technologies to be used
                </InputLabel>
                <TextField
                  multiline
                  rows={1}
                  sx={{ width: "100%", mb: 1 }}
                  InputProps={{
                    style: {
                      borderRadius: "20px",
                    },
                  }}
                  name="techStack"
                  type="text"
                  value={addProjectFormik.values.techStack}
                  onChange={addProjectFormik.handleChange}
                />
                <InputLabel sx={styles.label}>
                  Accomplishment Criteria
                </InputLabel>
                <TextField
                  multiline
                  rows={1}
                  sx={{ width: "100%", mb: 1 }}
                  InputProps={{
                    style: {
                      borderRadius: "20px",
                    },
                  }}
                  name="successCriteria"
                  type="text"
                  value={addProjectFormik.values.successCriteria}
                  onChange={addProjectFormik.handleChange}
                />
              </Box>
            )}
          </Box>
          <Box sx={{ ...styles.flexBox, border: "none" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontWeight: 600, px: 2 }}
                onClick={() => toggleVisibility("milestones")}
              >
                <ExpandMoreIcon
                  sx={{
                    ...styles.expandMoreIcon,
                    transform: visibility.milestones
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
                Milestones
              </Typography>
              {visibility.milestones && (
                <Button
                  sx={{ color: "#00A398", textTransform: "capitalize" }}
                  onClick={addMilestone}
                >
                  <AddIcon style={styles.iconStyle} />
                  Add Milestone
                </Button>
              )}
            </Box>
            {visibility.milestones && (
              <>
                {addMilestoneFormik?.values?.milestones?.map(
                  (milestone, index) => (
                    <Box key={index} sx={styles.flexBoxItem}>
                      <InputBox
                        label="Milestone Name"
                        name={`milestones[${index}].milestoneName`}
                        formik={addMilestoneFormik}
                      />
                      <InputBox
                        type="date"
                        label="Start Date"
                        name={`milestones[${index}].startDate`}
                        formik={addMilestoneFormik}
                      />
                      <InputBox
                        type="date"
                        label="End Date"
                        name={`milestones[${index}].endDate`}
                        formik={addMilestoneFormik}
                      />
                    </Box>
                  )
                )}
              </>
            )}
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
              Add Project
            </Button>
          </Box>
        </form>
        <Toaster />
      </Paper>
    </Modal>
  );
};

export default ProjectModal;
