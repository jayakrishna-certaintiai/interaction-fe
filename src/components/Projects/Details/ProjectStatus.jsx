import React, { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import EditableInput from "../../Common/EditableInput";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ProjectContext } from "../../../context/ProjectContext"

const styles = {
    flexBox: {
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid #E4E4E4",
        px: 2,
    },
    flexBoxItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 2,
        mt: 2,
    },
    flexBoxItem2: {
        display: "flex",
        flexDirection: "column",
        mt: 2,
    },
    textStyle: {
        fontWeight: 600,
        mt: 1,
        mb: 1,
        cursor: "pointer",
    },
    expandMoreIcon: {
        borderRadius: "50%",
        fontSize: "15px",
        backgroundColor: "#404040",
        color: "white",
        mr: 1,
        transition: "transform 0.3s ease",
    },
    label: {
        mb: 1,
        color: "#404040",
        fontSize: "14px",
        ml: 6
    },
    inputStyle: {
        mb: 2,
        "& .MuiInputBase-root": {
            borderRadius: "20px",
        },
        width: "100%"
    },
};

function ProjectStatus({
    data,
    editMode,
    editedValues,
    handleEditChange,
    errors,
}) {
    const [visibility, setVisibility] = useState(false);
    const [dataGatheringOptions, setDataGatheringOptions] = useState([]);
    const [projectStatusOptions, setProjectStatusOptions] = useState([]);
    const [timesheetStatusOptions, setTimesheetStatusOptions] = useState([]);
    const [fteSalaryStatusOptions, setFTESalaryStatusOptions] = useState([]);
    const [subconSalaryStatusOptions, setSubconSalaryStatusOptions] = useState([]);
    const [technicalInterviewStatusOptions, setTechnicalInterviewStatusOptions] = useState([]);
    const [technicalSummaryStatusOptions, setTechnicalSummaryStatusOptions] = useState([]);
    const [financialSummaryStatusOptions, setFinancialSummaryStatusOptions] = useState([]);
    const [claimsFormStatusOptions, setClaimsFormStatusOptions] = useState([]);
    const [finalReviewStatusOptions, setFinalReviewStatusOptions] = useState([]);
    const [interactionStatusOptions, setInteractionStatusOptions] = useState([]);
    const toggleVisibility = () => {
        setVisibility((prevVisibility) => !prevVisibility);
    };
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const url = `${BaseURL}/api/v1/projects/get-project-field-options`;
    //             const response = await axios.get(url, Authorization_header());
    //             if (response?.data?.success) {
    //                 const data = response.data.data;
    //                 setClaimsFormStatusOptions(data?.s_claims_form_status || []);
    //                 setFinalReviewStatusOptions(data?.s_final_review_status || []);
    //                 setFinancialSummaryStatusOptions(data?.s_financial_summary_status || []);
    //                 setTechnicalSummaryStatusOptions(data?.s_technical_summary_status || []);
    //                 setDataGatheringOptions(data?.s_data_gathering || []);
    //                 setProjectStatusOptions(data?.s_project_status || []);
    //                 setTimesheetStatusOptions(data?.s_timesheet_status || []);
    //                 setFTESalaryStatusOptions(data?.s_fte_cost_status || []);
    //                 setSubconSalaryStatusOptions(data?.s_subcon_cost_status || []);
    //                 setTechnicalInterviewStatusOptions(data?.s_technical_interview_status || []);
    //                 setInteractionStatusOptions(data?.s_interaction_status || []);
    //             
    //             } else {
    //                 console.error('Failed to fetch project field options:', response?.data?.message || 'Unknown error');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching project field options:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = {
                success: true,
                "message": "Projects field options fetched successfully.",
                "data": {
                    "s_claims_form_status": ["Not generated", "Review in-progress", "Review complete", "Not Applicable", "To be determined"],
                    "s_data_gathering": ["Complete", "Not Complete", "Not Applicable"],
                    "s_final_review_status": ["Not started", "In-Progress", "Complete", "Not Applicable", "To be determined"],
                    "s_financial_summary_status": ["Not generated", "Review in-progress", "Review complete", "Not Applicable", "To be determined"],
                    "s_fte_cost_status": ["Not received", "Received", "Review Complete", "Not Applicable", "To be Reviewed"],
                    "s_project_status": ["Received", "SPOC pending", "Not qualified-Low Cost", "Not qualified-Duplicate", "Not qualified-Merged", "Not qualified-Ineligible", "Not qualified-Insufficient Data", "Loaded to system",
                        "Survey - In Progress", "Not qualified-Survey Response", "Not qualified-Technical Deep Dive", "Technical Deep Dive - In Progress", "Documentation - In Progress", "Review - In Progress", "Complete", "HVT-Re-Engage SPOC", "LVT-Re-Engage SPOC Optional", "Base Data Pending"],
                    "s_subcon_cost_status": ["Not received", "Received", "Review Complete", "Not Applicable", "To be Reviewed"],
                    "s_technical_interview_status": ["To be Scheduled", "Scheduled", "Completed", "Not Applicable", "To be determined"],
                    "s_technical_summary_status": ["Not generated", "Review in-progress", "Review complete", "Not Applicable", "To be determined"],
                    "s_timesheet_status": ["Not received", "Received", "Review complete", "Not Applicable", "To be Reviewed"],
                    "s_interaction_status": ["Not Sent", "Sent", "Response Received", "Review Complete", "Not Applicable", "To Be Determined"],
                }
            }
            if (response?.success) {
                setClaimsFormStatusOptions(response?.data?.s_claims_form_status);
                setFinalReviewStatusOptions(response?.data?.s_final_review_status);
                setFinancialSummaryStatusOptions(response?.data?.s_financial_summary_status);
                setTechnicalSummaryStatusOptions(response?.data?.s_technical_summary_status);
                setDataGatheringOptions(response?.data?.s_data_gathering);
                setProjectStatusOptions(response?.data?.s_project_status);
                setTimesheetStatusOptions(response?.data?.s_timesheet_status);
                setFTESalaryStatusOptions(response?.data?.s_fte_cost_status);
                setSubconSalaryStatusOptions(response?.data?.s_subcon_cost_status);
                setTechnicalInterviewStatusOptions(response?.data?.s_technical_interview_status);
                setInteractionStatusOptions(response?.data?.s_interaction_status);
            }
        };
        fetchData();
    }, []);


    return (
        <Box sx={styles.flexBox}>
            <Typography sx={styles.textStyle} onClick={toggleVisibility}>
                <ExpandMoreIcon
                    sx={{
                        ...styles.expandMoreIcon,
                        transform: visibility ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                />
                Status
            </Typography>
            {visibility && (
                <><Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={styles.flexBoxItem}>
                        <EditableInput
                            label="Project Status"
                            value={editedValues.s_project_status}
                            onChange={(e) => handleEditChange("s_project_status", e.target.value)}
                            disabled={!editMode}
                            type="select"
                            selectOptions={projectStatusOptions.map((status) => ({
                                id: status,
                                name: status,
                            }))}
                            sx={{
                                width: '10%',
                                '& .MuiInputBase-root': {
                                    height: '10px',
                                    borderRadius: '50px',
                                },
                            }}
                            errors={errors.s_project_status}
                        />
                        <EditableInput
                            label="Employee Cost Status"
                            value={editedValues.s_fte_cost_status}
                            onChange={(e) => handleEditChange("s_fte_cost_status", e.target.value)}
                            disabled={!editMode}
                            type="select"
                            selectOptions={fteSalaryStatusOptions.map((status) => ({
                                id: status,
                                name: status,
                            }))}
                            errors={errors.s_fte_cost_status}
                        />
                        <EditableInput
                            label="Subcon Cost Status"
                            value={editedValues.s_subcon_cost_status}
                            onChange={(e) => handleEditChange("s_subcon_cost_status", e.target.value)}
                            disabled={!editMode}
                            type="select"
                            selectOptions={subconSalaryStatusOptions.map((status) => ({
                                id: status,
                                name: status,
                            }))}
                            errors={errors.s_subcon_cost_status}
                        />
                    </Box>
                    <Box sx={styles.flexBoxItem}>

                        <EditableInput
                            label="Survey Status"
                            value={editedValues.surveyStatus}
                            onChange={(e) => handleEditChange("surveyStatus", e.target.value)}
                            disabled={!editMode}
                            errors={errors.surveyStatus}
                        />
                        <EditableInput
                            label="Interaction Status"
                            value={editedValues.s_interaction_status}
                            onChange={(e) => handleEditChange("s_interaction_status", e.target.value)}
                            disabled={!editMode}
                            type="select"
                            selectOptions={interactionStatusOptions.map((status) => ({
                                id: status,
                                name: status,
                            }))}
                            errors={errors.s_interaction_status}
                        />
                        <EditableInput
                            label="Technical Interview Status"
                            value={editedValues.s_technical_interview_status}
                            onChange={(e) => handleEditChange("s_technical_interview_status", e.target.value)}
                            disabled={!editMode}
                            type="select"
                            selectOptions={technicalInterviewStatusOptions.map((status) => ({
                                id: status,
                                name: status,
                            }))}
                            errors={errors.s_technical_interview_status}
                        />
                    </Box>
                    <Box sx={styles.flexBoxItem}>
                        <EditableInput
                            label="Technical Summary Status"
                            value={editedValues.s_technical_summary_status}
                            onChange={(e) => handleEditChange("s_technical_summary_status", e.target.value)}
                            disabled={!editMode}
                            type="select"
                            selectOptions={technicalSummaryStatusOptions.map((status) => ({
                                id: status,
                                name: status,
                            }))}
                            errors={errors.s_technical_summary_status}
                        />
                        <EditableInput
                            label="Financial Summary Status"
                            value={editedValues.s_financial_summary_status}
                            onChange={(e) => handleEditChange("s_financial_summary_status", e.target.value)}
                            disabled={!editMode}
                            type="select"
                            selectOptions={financialSummaryStatusOptions.map((status) => ({
                                id: status,
                                name: status,
                            }))}
                            errors={errors.s_financial_summary_status}
                        />
                        <EditableInput
                            label="Claims Form Status"
                            value={editedValues.s_claims_form_status}
                            onChange={(e) => handleEditChange("s_claims_form_status", e.target.value)}
                            disabled={!editMode}
                            type="select"
                            selectOptions={claimsFormStatusOptions.map((status) => ({
                                id: status,
                                name: status,
                            }))}
                            errors={errors.s_claims_form_status}
                        />
                    </Box>
                    <Box sx={styles.flexBoxItem}>

                        <EditableInput
                            label="Final Review Status"
                            value={editedValues.s_final_review_status}
                            onChange={(e) => handleEditChange("s_final_review_status", e.target.value)}
                            disabled={!editMode}
                            type="select"
                            selectOptions={finalReviewStatusOptions.map((status) => ({
                                id: status,
                                name: status,
                            }))}
                            errors={errors.s_fte_hours}
                        />
                        <EditableInput
                            label="Timesheet Status"
                            value={editedValues.s_timesheet_status}
                            onChange={(e) => handleEditChange("s_timesheet_status", e.target.value)}
                            disabled={!editMode}
                            type="select"
                            selectOptions={timesheetStatusOptions.map((status) => ({
                                id: status,
                                name: status,
                            }))}
                            errors={errors.s_timesheet_status}
                        />
                    </Box>

                </Box>
                </>
            )}
        </Box>
    );
}

export default ProjectStatus;
