import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import EditableInput from "../../Common/EditableInput";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NonEditableInput from "../../Common/NonEditableInput";

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
    },
};

function ProjectValues({
    getFieldStyles,
    data,
    editMode,
    editedValues,
    handleEditChange,
    errors,
}) {
    const [visibility, setVisibility] = useState(false);

    const toggleVisibility = () => {
        setVisibility((prevVisibility) => !prevVisibility);
    };


    return (
        <Box sx={styles.flexBox}>
            <Typography sx={styles.textStyle} onClick={toggleVisibility}>
                <ExpandMoreIcon
                    sx={{
                        ...styles.expandMoreIcon,
                        transform: visibility ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                />
                Values
            </Typography>
            {visibility && (
                <>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={styles.flexBoxItem}>

                            <EditableInput
                                label="Project Cost - FTE"
                                value={editedValues.s_fte_cost}
                                onChange={(e) => handleEditChange("s_fte_cost", e.target.value)}
                                sx={getFieldStyles("s_fte_cost")}
                                disabled={!editMode}
                                errors={errors.s_fte_cost}
                            />
                            <EditableInput
                                label="Project Cost - Subcon"
                                value={editedValues.s_subcon_cost}
                                onChange={(e) => handleEditChange("s_subcon_cost", e.target.value)}
                                sx={{
                                    ...styles.inputField,
                                    ...getFieldStyles("s_subcon_cost"),
                                }}
                                disabled={!editMode}
                                errors={errors.s_subcon_cost}
                            />
                            <NonEditableInput label="Project Cost - Total" value={data.s_total_project_cost} disabled />
                        </Box>
                        <Box sx={styles.flexBoxItem}>
                            <EditableInput
                                label="Project Hours - FTE"
                                value={editedValues.s_fte_hours}
                                onChange={(e) => handleEditChange("s_fte_hours", e.target.value)}
                                sx={{
                                    ...styles.inputField,
                                    ...getFieldStyles("projectName"),
                                }}
                                disabled={!editMode}
                                errors={errors.s_fte_hours}
                            />
                            <EditableInput
                                label="Project Hours - Subcon"
                                value={editedValues.s_subcon_hours}
                                onChange={(e) => handleEditChange("s_subcon_hours", e.target.value)}
                                sx={{
                                    ...styles.inputField,
                                    ...getFieldStyles("projectName"),
                                }}
                                disabled={!editMode}
                                // required={true}
                                errors={errors.s_subcon_hours}
                            />
                            <NonEditableInput label="Project Hours - Total" value={data.s_total_hours} disabled />
                        </Box>
                        <Box sx={styles.flexBoxItem}>
                            <EditableInput
                                label="QRE - FTE"
                                value={editedValues.s_fte_qre_cost}
                                onChange={(e) => handleEditChange("s_fte_qre_cost", e.target.value)}
                                disabled={!editMode}
                                errors={errors.s_fte_qre_cost}
                            />
                            <EditableInput
                                label="QRE - Subcon"
                                value={editedValues.s_subcon_qre_cost}
                                onChange={(e) => handleEditChange("s_subcon_qre_cost", e.target.value)}
                                disabled={!editMode}
                                // required={true}
                                errors={errors.s_subcon_qre_cost}
                            />
                            <NonEditableInput label="QRE - Total" value={data.s_qre_cost} disabled />
                        </Box>
                        <Box sx={styles.flexBoxItem}>
                            {/* <NonEditableInput label="QRE (%) - Potential" value={data.rndPotential} disabled /> */}
                            <EditableInput
                                label="QRE (%) - Potential"
                                value={editedValues.rndPotential}
                                onChange={(e) => handleEditChange("rndPotential", e.target.value)}
                                disabled={!editMode}
                                errors={errors.rndPotential}
                            />
                            <EditableInput
                                label="QRE (%) - Adjustment"
                                value={editedValues.s_rnd_adjustment}
                                onChange={(e) => handleEditChange("s_rnd_adjustment", e.target.value)}
                                disabled={!editMode}
                                // required={true}
                                errors={errors.s_rnd_adjustment}
                                sx={{ margineLeft: -23 }}
                            />
                            <NonEditableInput label="QRE (%) - Final" value={data.rndFinal} disabled />
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}

export default ProjectValues;
