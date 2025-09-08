import CancelIcon from "@mui/icons-material/Cancel";
import MailIcon from "@mui/icons-material/Mail";
import { Box, Modal, Paper, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { ActivityContext } from "../../context/ActivityContext";
import { FilterListContext } from "../../context/FiltersListContext";
import SelectBox from "../Common/SelectBox";
import FilledButton from "../button/FilledButton";
import NewInteractionModal from "../Common/NewInteractionModal";

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "90%",
    width: 250,
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
  box1Style: {
    display: "flex",
    justifyContent: "space-between",
    p: 2,
    borderBottom: "1px solid #E4E4E4",
    alignItems: "center",
  },
  inputStyle: {
    borderRadius: "20px",
    width: "30%",
    height: "32px",
    border: "1px solid #9F9F9F",
    mr: 2,
  },
  toggleButton: {
    borderRadius: "20px",
    height: "32px",
    textTransform: "capitalize",
  },
  transitionStyles: {
    transition: "opacity 0.1s ease-in",
  },
};

const validationSchema = yup.object({
  relatedTo: yup.string("Select Related To").required("Related To is required"),
  relationId: yup
    .string("Select Relation Id")
    .required("Relation Id is required"),
});

const relTo = [
  "Accounts",
  "Projects",
  "Activity",
  "Timesheets",
  "Workbench",
  "Documents",
];

function ActivityModal({ open, handleClose }) {
  const { interactionModalOpen, setInteractionModalOpen, activityData } =
    useContext(ActivityContext);
  const [data, setData] = useState([]);
  const {
    clientList,
    timesheetList,
    workbenchList,
    documentList,
    projectList,
  } = useContext(FilterListContext);
  const [selectOptions, setSelectOptions] = useState([]);

  const addNewActivityFormik = useFormik({
    initialValues: {
      relatedTo: null,
      relationId: null,
      relationName: null,
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      //   addNewContact(submitValues)
      //     .then(() => {
      //       addNewActivityFormik.resetForm();
      //     })
      //     .catch((error) => {
      //       console.error("Error adding user:", error);
      //     });
    },
  });

  useEffect(() => {
    switch (addNewActivityFormik.values.relatedTo) {
      case "Accounts":
        setData(clientList);
        break;
      case "Projects":
        setData(projectList);
        break;
      case "Activity":
        setData(activityData);
        break;
      case "Timesheets":
        setData(timesheetList);
        break;
      case "Workbench":
        setData(workbenchList);
        break;
      case "Documents":
        setData(documentList);
        break;
      default:
        setData([]);
    }
  }, [
    addNewActivityFormik.values.relatedTo,
    clientList,
    projectList,
    activityData,
    timesheetList,
    workbenchList,
    documentList,
  ]);

  function transformDataForSelect(data, relatedTo) {
    switch (relatedTo) {
      case "Accounts":
        return data?.map((item) => ({
          id: item?.companyId,
          name: item?.companyName,
        }));
      case "Projects":
        return data?.map((item) => ({
          id: item?.projectId,
          name: item?.projectName,
        }));
      case "Activity":
        return data?.map((item) => ({
          id: item?.interactionID,
          name: item?.interactionSubject,
        }));
      case "Timesheets":
        return data?.map((item) => ({
          id: item?.timesheetId,
          name: item?.timesheetIdentifier,
        }));
      case "Workbench":
        return data?.map((item) => ({
          id: item?.reconcileId,
          name: item?.reconciliationIdentifier,
        }));
      case "Documents":
        return data?.map((item) => ({
          id: item?.documentId,
          name: item?.documentName,
        }));
      default:
        return [];
    }
  }

  useEffect(() => {
    const transformedData = transformDataForSelect(
      data,
      addNewActivityFormik.values.relatedTo
    );
    setSelectOptions(transformedData);

  }, [data, addNewActivityFormik.values.relatedTo]);

  useEffect(() => { }, [addNewActivityFormik.values.relationId]);

  const handleUploadClick = () => {
    setInteractionModalOpen(true);
  };

  const handleModalClose = () => {
    setInteractionModalOpen(false);
    // handleClose();
  };

  const getName = (val) => {
    addNewActivityFormik.setFieldValue("relationName", val?.name);
  };

  useEffect(() => {
    addNewActivityFormik.setFieldValue("relationId", null);
    addNewActivityFormik.setFieldValue("relationName", null);
    handleModalClose();
  }, [addNewActivityFormik.values.relatedTo]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={styles.modalStyle}
      id="activity-modal"
    >
      <Paper sx={styles.paperStyle}>
        <Box sx={{ ...styles.box1Style, py: 1 }}>
          <Typography variant="h6" sx={styles.titleStyle}>
            New Activity
          </Typography>
          <CancelIcon
            sx={{
              color: "#9F9F9F",
              cursor: "pointer",
              "&: hover": { color: "#FD5707" },
              transition: "",
            }}
            onClick={handleClose}
          />
        </Box>
        <form onSubmit={addNewActivityFormik.handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              mt: 1,
              gap: "10px",
              mb: 2,
            }}
          >
            <SelectBox
              label="Related To"
              name="relatedTo"
              formik={addNewActivityFormik}
              selectOptions={relTo?.map((item) => ({
                id: item,
                name: item,
              }))}
              required={true}
              width="240px"
              disableClearable={true}
            />
            <SelectBox
              label="Relation Id"
              name="relationId"
              formik={addNewActivityFormik}
              selectOptions={selectOptions}
              required={true}
              width="240px"
              getName={getName}
              disableClearable={true}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-evenly",
                mt: 1,
                gap: "10px",
              }}
            >
              <FilledButton
                btnname={"Create an Interaction"}
                width="240px"
                Icon={<MailIcon />}
                onClick={handleUploadClick}
                type="submit"
                disabled={
                  addNewActivityFormik.values.relatedTo === null ||
                    addNewActivityFormik.values.relatedTo?.trim() === "" ||
                    addNewActivityFormik.values.relationId?.trim() === "" ||
                    addNewActivityFormik.values.relationId === null
                    ? true
                    : false
                }
              />
              <NewInteractionModal
                open={interactionModalOpen}
                handleClose={handleModalClose}
                relatedTo={addNewActivityFormik.values.relatedTo}
                relationName={addNewActivityFormik.values.relationName}
                relationId={addNewActivityFormik.values.relationId}
              />
              <FilledButton
                btnname={"Cancel"}
                onClick={handleClose}
                color={"#9F9F9F"}
                Icon={<></>}
                width="240px"
              />
            </Box>
          </Box>
        </form>
      </Paper>
    </Modal>
  );
}

export default ActivityModal;
