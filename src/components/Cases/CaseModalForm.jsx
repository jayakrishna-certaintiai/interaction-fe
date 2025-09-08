import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  Button,
  InputLabel,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { BaseURL } from "../../constants/Baseurl";
import { ClientContext } from "../../context/ClientContext";
import SelectBox from "../Common/SelectBox";
import CaseExitsModal from "./CaseModalComponets/CaseExistsModal";
import { Authorization_header } from "../../utils/helper/Constant";

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "90%",
    width: "34rem",
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
    width: "535px",
    ml: "19px",
    borderRadius: "20px",
  },
  caseExitsModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }
};

const validationSchema = yup.object({
  caseTypeId: yup
    .string("Select Case Type")
    .required("Case Type is required"),
  companyId: yup
    .string("Select Account Name")
    .required("Account Name is required"),
});

const CaseModalForm = ({ open, handleClose, comId = "", handleFetchAllCases }) => {
  const [visibility, setVisibility] = useState({});
  const { clientData, fetchClientData } = useContext(ClientContext);
  const [caseType, setCaseType] = useState([]);
  const [existingCases, setExistingCases] = useState([]);
  const [isCaseExist, setIsCaseExist] = useState(false);

  const addProjectFormik = useFormik({
    initialValues: {
      caseTypeId: null,
      companyId: null,
      caseDescription: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addCase(values, false);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchClientData();
        const response3 = await axios.get(
          `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/casetypes`, Authorization_header()
        );
        setCaseType(response3?.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const toggleVisibility = (key) => {
    setVisibility((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const companyId = comId !== "" ? comId : addProjectFormik.values?.companyId;

  const addCase = async (values, isForceAdd) => {
    toast.loading('Adding New Case...');
    try {
      const response = await axios.post(
        `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${companyId}/create`,
        {
          caseDetails: values,
          forceCaseCreate: isForceAdd,
        },
        Authorization_header()
      );
      const { caseCompositionExists, casesWithSameComposition, caseData } = response?.data?.data;
      if (caseCompositionExists && !isForceAdd) {
        setExistingCases(casesWithSameComposition);
        setIsCaseExist(true);
        toast.dismiss();
      } else {
        handleClose();
        handleFetchAllCases();
        addProjectFormik.resetForm();
        toast.dismiss();
        toast.success(`Your Case is successfully Created. Case ID- ${caseData?.caseid}`);
      }
      return response;
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data.message || 'Failed to adding new Case. Server Error !');
      console.error(error);
    }
  };

  const forceCaseAdd = () => {
    setIsCaseExist(false);
    addCase(addProjectFormik.values, true);
  }

  const handleCaseExistModal = (view) => {
    setIsCaseExist(view);
  }

  const handleModalClose = () => {
    addProjectFormik.resetForm();
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleModalClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Box
          sx={{
            ...styles.topBoxStyle,
            display: "flex",
            justifyContent: "space-between",
          }}>
          <Typography variant="h6" sx={styles.titleStyle}>
            Create Case
          </Typography>
          <CancelIcon
            sx={{
              color: "#9F9F9F",
              cursor: "pointer",
              "&: hover": { color: "#FD5707" },
            }}
            onClick={handleModalClose}
          />
        </Box>
        <form onSubmit={addProjectFormik.handleSubmit}>
          <Box sx={styles.flexBox}>
            <InputLabel sx={{ ...styles.label, marginLeft: "15px", fontWeight: 520 }}>
              Case Owner:
              <Box sx={{ color: "#00A398", mt: "-20px", ml: "95px" }}>{localStorage.getItem("userName")}</Box>
            </InputLabel>
            <Box sx={styles.flexBoxItem}>
              <SelectBox
                label="Case Type"
                name="caseTypeId"
                width="515px"
                formik={addProjectFormik}
                required={true}
                selectOptions={caseType?.map((item) => ({
                  id: item.caseTypeId,
                  name: item.caseType,
                }))}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              <SelectBox
                label="Account"
                name="companyId"
                width="515px"
                formik={addProjectFormik}
                required={true}
                selectOptions={clientData?.map((item) => ({
                  id: item.companyId,
                  name: item?.companyName,
                }))}
              />
            </Box>
          </Box>
          <Box sx={{ ...styles.flexBox }}>
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
                name="caseDescription"
                type="text"
                value={addProjectFormik.values.caseDescription}
                onChange={addProjectFormik.handleChange}
              />
            </Box>
          </Box>
          <CaseExitsModal
            forceCaseAdd={forceCaseAdd}
            isCaseExist={isCaseExist}
            existCases={existingCases}
            handleCaseExistModal={handleCaseExistModal}
          />
          <Box sx={styles.buttonBox}>
            <Button
              variant="contained"
              sx={styles.buttonStyle}
              onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={styles.uploadButtonStyle}
              type="submit">
              Create Case
            </Button>
          </Box>
        </form>
        <Toaster position="top-center" />
      </Paper>
    </Modal>
  );
};

export default CaseModalForm;
