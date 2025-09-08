import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BaseURL } from "../../constants/Baseurl";
import { FilterListContext } from "../../context/FiltersListContext";
import AdditionalDetails from "./Details/AdditionalDetails";
import BasicDetails from "./Details/BasicDetails";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { token_obj } from "../../utils/helper/Constant";
import ProjectValues from "./Details/ProjectValues";
import ProjectStatus from "./Details/ProjectStatus";
import SurveyStatus from "./Details/SurveyStatus";

const styles = {
  mainBox: {
    display: "flex",
    justifyContent: "space-between",
    px: 2,
    py: 1,
    borderTop: "1px solid #E4E4E4",
  },
  updateInfo: {
    color: "#00A398",
    fontSize: "12px",
  },
  editButton: {
    borderRadius: "20px",
    backgroundColor: "#00A398",
    color: "white",
    textTransform: "capitalize",
    height: "30px",
    "&:hover": { backgroundColor: "#00A398" },
    mr: 2,
    mt: 1
  },
  cancelButton: {
    borderRadius: "20px",
    backgroundColor: "#9F9F9F",
    color: "white",
    textTransform: "capitalize",
    height: "30px",
    "&:hover": { backgroundColor: "#9F9F9F" },
    mt: 1
  },
  editIcon: {
    fontSize: "20px",
    mr: 1,
  },
};

function Details({
  data,
  fetchData,
  surveyDetails,
  sureveyQuestions,
  sentToEmail,
}) {
  const [editMode, setEditMode] = useState(false);
  const { clientList } = useContext(FilterListContext);
  const [errors, setErrors] = useState({});
  const [highlightedFields, setHighlightedFields] = useState({
    s_fte_cost: false,
    s_subcon_cost: false,
    s_total_project_cost: false,
    s_fte_hours: false,
    s_subcon_hours: false,
    s_total_hours: false,
    s_fte_qre_cost: false,
    s_subcon_qre_cost: false,
    s_qre_cost: false,
    rndPotential: false,
    s_rnd_adjustment: false,
    s_project_status: false,
    s_fte_cost_status: false,
    s_subcon_cost_status: false,
    surveyStatus: false,
    s_interaction_status: false,
    s_technical_interview_status: false,
    s_technical_summary_status: false,
    s_financial_summary_status: false,
    s_claims_form_status: false,
    s_final_review_status: false,
    s_timesheet_status: false,
    s_pending_data: false,
    s_data_gathering: false,
    notes: false,
    description: false,
  });

  const [editedValues, setEditedValues] = useState({
    //details
    companyId: null,
    projectName: null,
    companyName: null,
    fiscalYear: null,
    projectCode: null,

    //numeric values
    s_fte_cost: null,
    s_subcon_cost: null,
    // s_total_project_cost: null,
    s_fte_hours: null,
    s_subcon_hours: null,
    // s_total_hours: null,
    s_fte_qre_cost: null,
    s_subcon_qre_cost: null,
    s_qre_cost: null,
    rndPotential: null,
    s_rnd_adjustment: null,

    //status
    s_project_status: null,
    s_fte_cost_status: null,
    s_subcon_cost_status: null,
    surveyStatus: null,
    s_interaction_status: null,
    s_technical_interview_status: null,
    s_technical_summary_status: null,
    s_financial_summary_status: null,
    s_claims_form_status: null,
    s_final_review_status: null,
    s_timesheet_status: null,

    //date
    surveySentDate: null,
    reminderSentDate: null,
    surveyResponseDate: null,
    s_last_updated_timestamp: null,

    //text
    s_pending_data: null,
    s_data_gathering: null,
    notes: null,
    description: null,
  });

  useEffect(() => {
    setEditedValues({

      //details
      companyId: data?.companyId || null,
      companyName: data?.companyName || null,
      projectName: data?.projectName || null,
      fiscalYear: data?.fiscalYear || null,
      projectCode: data?.projectCode || null,

      //values
      s_fte_cost: data?.s_fte_cost || null,
      s_subcon_cost: data?.s_subcon_cost || null,
      // s_total_project_cost: data?.s_total_project_cost || null,
      s_fte_hours: data?.s_fte_hours || null,
      s_subcon_hours: data?.s_subcon_hours || null,
      // s_total_hours: data?.s_total_hours || null,
      s_fte_qre_cost: data?.s_fte_qre_cost || null,
      s_subcon_qre_cost: data?.s_subcon_qre_cost || null,
      s_qre_cost: data?.s_qre_cost || null,
      rndPotential: data?.rndPotential || null,
      s_rnd_adjustment: data?.s_rnd_adjustment || null,

      //status
      s_project_status: data?.s_project_status || null,
      s_fte_cost_status: data?.s_fte_cost_status || null,
      s_subcon_cost_status: data?.s_subcon_cost_status || null,
      surveyStatus: data?.surveyStatus || null,
      s_interaction_status: data?.s_interaction_status || null,
      s_technical_interview_status: data?.s_technical_interview_status || null,
      s_technical_summary_status: data?.s_technical_summary_status || null,
      s_financial_summary_status: data?.s_financial_summary_status || null,
      s_claims_form_status: data?.s_claims_form_status || null,
      s_final_review_status: data?.s_final_review_status || null,
      s_timesheet_status: data?.s_timesheet_status || null,

      //date
      surveySentDate: data?.surveySentDate || null,
      reminderSentDate: data?.reminderSentDate || null,
      surveyResponseDate: data?.surveyResponseDate || null,
      s_last_updated_timestamp: data?.s_last_updated_timestamp || null,

      //text
      s_pending_data: data?.s_pending_data || null,
      s_data_gathering: data?.s_data_gathering || null,
      notes: data?.notes || null,
      description: data?.description || null,
    });
  }, [data]);

  const handleEditChange = (field, value) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));

    setHighlightedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };


  const getFieldStyles = (field) => {
    const isHighlighted = highlightedFields[field];
    return isHighlighted
  };


  const handleEditClick = async () => {
    let newErrors = {};

    // Validate required fields
    if (!editedValues.projectName?.trim()) {
      newErrors.projectName = "Project Name is required";
    }
    if (!editedValues.companyId?.trim()) {
      newErrors.companyId = "Account is required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editMode) {
      const tokens = localStorage.getItem("tokens");
      const token_obj = JSON.parse(tokens);
      const apiUrl = `${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/${data?.projectId}/edit-project`;

      // Construct editFields payload
      const editFields = Object.keys(editedValues).reduce((acc, key) => {
        if (editedValues[key] !== data[key]) {
          const projectId = data?.projectId; // Adjust based on your unique identifier
          if (!acc[projectId]) acc[projectId] = {};
          acc[projectId][key] = editedValues[key];
        }
        return acc;
      }, {});

      if (Object.keys(editFields).length === 0) {
        toast.info("No changes made to save.");
        setEditMode(false);
        return;
      }

      try {
        const response = await toast.promise(
          axios.post(
            apiUrl,
            { editFields }, // Send the payload in the desired format
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token_obj?.accessToken}`,
              },
            }
          ),
          {
            success: "Project details edited successfully",
            error: "Failed to edit project details.",
          }
        );

        if (response?.data?.success) {
          setErrors({});
          fetchData();
        } else {
          console.error("API call unsuccessful:", response?.data);
        }
      } catch (error) {
        console.error("Error updating data:", error);
        setErrors({
          apiError: error.response?.data?.message || "An unexpected error occurred.",
        });
      } finally {
        setEditMode(false);
        setHighlightedFields((prev) => {
          const reset = {};
          Object.keys(prev).forEach((key) => {
            reset[key] = false; // Reset highlight on entering edit mode
          });
          return reset;
        });
      }
    } else {
      setEditMode(true);
    }
  };


  const handleSaveMilestones = async (newMilestones) => {
    for (const milestone of newMilestones) {
      try {
        const response = await axios.post(
          `${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/${data?.overview?.[0]?.companyId
          }/${data?.overview?.[0]?.projectId}/add-new-milestone`,
          milestone,
          {
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token_obj.accessToken}`

            }
          }
        );
        fetchData();
      } catch (error) {
        console.error("Error adding milestone:", error);
      }
    }
  };
  return (
    <>
      <Box sx={styles.mainBox}>
        <Box>
          <Typography sx={styles.updateInfo}>
            Last Updated Date: <span style={{ color: '#FD5707' }}> {data?.s_last_updated_timestamp?.split('T')[0]}</span>
          </Typography>
          <Typography sx={styles.updateInfo}>
            Last Updated by: <span style={{ color: '#FD5707' }}>{data?.s_last_updated_by}</span>
          </Typography>
        </Box>

        {useHasAccessToFeature("F015", "P000000001") && (
          <>
            {editMode ? (
              <div style={{ display: "flex", gap: "20px" }}>
                <Button
                  variant="contained"
                  sx={styles.cancelButton}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={styles.editButton}
                  onClick={() => handleEditClick()}
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button
                variant="contained"
                startIcon={<EditIcon sx={styles.editIcon} />}
                sx={styles.editButton}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
          </>
        )}
      </Box>
      <BasicDetails
        data={data}
        editMode={editMode}
        editedValues={editedValues}
        handleEditChange={handleEditChange}
        clientData={clientList}
        errors={errors}
      />
      <ProjectValues
        data={data}
        editMode={editMode}
        editedValues={editedValues}
        handleEditChange={handleEditChange}
        clientData={clientList}
        errors={{
          s_fte_cost: errors.s_fte_cost,
          s_subcon_cost: errors.s_subcon_cost,
          s_qre_cost: errors.s_qre_cost,
          rndPotential: errors.rndPotential,
          // Add any other fields specific to ProjectValues
        }}
        getFieldStyles={getFieldStyles}
      />
      <ProjectStatus
        data={data}
        editMode={editMode}
        editedValues={editedValues}
        handleEditChange={handleEditChange}
        clientData={clientList}
        errors={errors}
      />
      <SurveyStatus
        surveyDetails={surveyDetails}
        sureveyQuestions={sureveyQuestions}
        sentToEmail={sentToEmail}
        editMode={editMode}
        editedValues={editedValues}
        handleEditChange={handleEditChange}
        clientData={clientList}
        errors={errors}
        getFieldStyles={getFieldStyles}
      />
      <AdditionalDetails
        data={data}
        editMode={editMode}
        editedValues={editedValues}
        handleEditChange={handleEditChange}
      />
      <Toaster />
    </>
  );
}

export default Details;
