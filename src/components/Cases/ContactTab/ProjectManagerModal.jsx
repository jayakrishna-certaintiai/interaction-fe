import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { BaseURL } from "../../../constants/Baseurl";
import { ClientContext } from "../../../context/ClientContext";
import InputBox from "../../Common/InputBox";
import SelectBox from "../../Common/SelectBox";
import { CaseContext } from "../../../context/CaseContext";
import { Authorization_header } from "../../../utils/helper/Constant";

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
    px: 2.5,
    textAlign: "left",
    py: 1,
  },
  textFiled: {
    width: "530px",
  },
};

const validationSchema = yup.object({
  // primaryContactId: yup
  //   .string("Select Primary Conatct")
  //   .required("Primary Conatct is required"),
  // primaryContactCaseRoleId: yup
  //   .string("Select Primary Conatct Case Role")
  //   .required("Primary Conatct Case Role is required"),
});

const ProjectManagerModal = ({
  open,
  handleClose,
  comId = "",
  handleFetchAllCases,
}) => {
  const [visibility, setVisibility] = useState({
    contact: false,
  });
  const { clientData, fetchClientData } = useContext(ClientContext);
  const [Contacts, setContacts] = useState([]);
  const [caseRoles, setCaseRoles] = useState([]);
  const [projectVal, setProjectVal] = useState(false);
  const [selected, setSelected] = React.useState([]);
  const { detailedCase } = useContext(CaseContext);

  const addProjectFormik = useFormik({
    initialValues: {
      caseTypeId: null,
      primaryContactId: null,
      primaryContactCaseRoleId: null,
      primaryContactEmail: null,
      primaryContactRole: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchClientData();
        const response = await axios.get(
          `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/contacts`
        );
        setContacts(response?.data.data);

        // const response2 = await axios.get(
        //   `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/caseroles`
        // );
        // setCaseRoles(response2?.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleFormSubmit = async () => {
    if (!projectVal) {
      const apiUrl = `${BaseURL}/api/v1/case/${localStorage.getItem(
        "userid"
      )}/contacts/add`;
      const data = {
        contactsId: selected,
        caseId: detailedCase?.caseId,
      };

      toast.promise(
        (async () => {
          const response = await axios.post(apiUrl, data, Authorization_header());
          if (response?.data?.success) {
            // fetchParentData();
            // setPortfolioName("");
            // setCompany("");
            // fetchAddedCaseContacts();
            handleClose();
          }
          return response;
        })(),
        {
          loading: "Adding New Employee to Case...",
          success: (response) =>
            response?.data?.message || "Employee added to Case successfully",
          error: (response) =>
            response?.data?.error?.message ||
            "Failed to adding new Employee to Case.",
        }
      );
    }
    // else {
    //     CheckValidation();
    // }
  };

  const toggleVisibility = (key) => {
    setVisibility((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const companyId = comId !== "" ? comId : addProjectFormik.values?.companyId;

  // const addCase = async (values, isForceAdd) => {
  //   toast.loading("Adding New Case...");
  //   try {
  //     const response = await axios.post(
  //       `${BaseURL}/api/v1/case/${localStorage.getItem(
  //         "userid"
  //       )}/${companyId}/create`,
  //       {
  //         caseDetails: values,
  //         forceCaseCreate: isForceAdd,
  //       }
  //     );
  //     const { caseCompositionExists, casesWithSameComposition, caseData } =
  //       response?.data?.data;
  //   } catch (error) {
  //     toast.dismiss();
  //     toast.error(
  //       error?.response?.data.message ||
  //         "Failed to adding new Primary Contact. Server Error !"
  //     );
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    if (!addProjectFormik.values.primaryContactId) {
      const { primaryContactName } = addProjectFormik.values;
      addProjectFormik.setFieldValue(
        "primaryContactEmail",
        primaryContactName
          ? `${primaryContactName
            .toLowerCase()
            .replace(/\s+/g, ".")}@example.com`
          : ""
      );
      addProjectFormik.setFieldValue(
        "primaryContactTitle",
        primaryContactName ? "Roll for manually entered contact" : ""
      );
    }
    const { primaryContactId } = addProjectFormik.values;
    addProjectFormik.setFieldValue(
      "primaryContactEmail",
      primaryContactId
        ? Contacts.find((contact) => contact.contactId === primaryContactId)
          ?.email
        : null
    );
    addProjectFormik.setFieldValue(
      "primaryContactRole",
      primaryContactId
        ? Contacts.find((contact) => contact.contactId === primaryContactId)
          ?.employeeTitle
        : null
    );
  }, [
    addProjectFormik.values.primaryContactId,
    addProjectFormik.values.primaryContactName,
  ]);

  useEffect(() => { }, [addProjectFormik.values]);

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
            Add Project Manager Contact
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
        <form onSubmit={addProjectFormik.handleSubmit}>
          <Box sx={styles.flexBox}>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              <InputBox
                label="Enter Name"
                name="primaryContactFirstname"
                width={styles.textFiled}
                formik={addProjectFormik}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mt: 1 }}>
              <InputBox
                // disabled={true}
                label="Enter Email"
                name="primaryContactEmail"
                width={styles.textFiled}
                formik={addProjectFormik}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mt: 1 }}>
              <InputBox
                // disabled={true}
                label="Enter Title"
                name="primaryContactTilte"
                width={styles.textFiled}
                formik={addProjectFormik}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              <SelectBox
                label="Choose Role"
                name="primaryContactCaseRoleId"
                width={styles.textFiled}
                formik={addProjectFormik}
                selectOptions={caseRoles?.map((item) => ({
                  id: item.caseRoleId,
                  name: item.caseRoleName,
                }))}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              <SelectBox
                label="Choose Association"
                name="ContactAssociation"
                width={styles.textFiled}
                formik={addProjectFormik}
                selectOptions={caseRoles?.map((item) => ({
                  id: item.caseRoleId,
                  name: item.caseRoleName,
                }))}
              />
            </Box>
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

export default ProjectManagerModal;
