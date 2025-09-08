import React, { useState, useEffect } from "react";
import { Box, Button, InputBase, InputLabel, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";

const styles = {
  flexBox: {
    display: "flex",
    flexDirection: "column",
    borderBottom: "1px solid #E4E4E4",
    px: 2,
    mt: 1,
  },
  flexBoxItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
    mt: 1,
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
    width: "200px",
  },
  textStyle: {
    fontWeight: 600,
    // mt: 1,
  },
  addButton: {
    color: "#00A398",
    textTransform: "capitalize",
  },
  expandMoreIcon: {
    borderRadius: "50%",
    fontSize: "15px",
    backgroundColor: "#404040",
    color: "white",
    mr: 1,
    transition: "transform 0.3s ease",
  },
  saveButton: {
    borderRadius: "20px",
    backgroundColor: "#00A398",
    color: "white",
    textTransform: "capitalize",
    height: "30px",
    "&:hover": { backgroundColor: "#00A398" },
  },
};
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

function Milestones({ milestones: initialMilestones, onSaveMilestones }) {
  const [visibility, setVisibility] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    // Initialize the milestones state with the formatted initialMilestones
    const formattedMilestones = initialMilestones?.map((milestone) => ({
      ...milestone,
      startDate: formatDate(milestone.startDate),
      endDate: formatDate(milestone.endDate),
    }));
    setMilestones(formattedMilestones);
  }, [initialMilestones]);

  const [showSaveButton, setShowSaveButton] = useState(false);

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const onAddMilestoneClick = () => {
    setIsEditable(true);
    setShowSaveButton(true);
    const newMilestone = {
      milestoneName: null,
      startDate: null,
      endDate: null,
    };
    setMilestones([...milestones, newMilestone]);
  };

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = milestones?.map((milestone, i) => {
      if (i === index) {
        return {
          ...milestone,
          [field]: field.includes("Date") ? formatDate(value) : value,
        };
      }
      return milestone;
    });
    setMilestones(updatedMilestones);
  };

  const onSaveClick = async () => {
    await onSaveMilestones(milestones);
    setIsEditable(false);
    setShowSaveButton(false);
  };

  return (
    <Box sx={styles.flexBox}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={styles.textStyle} onClick={toggleVisibility}>
          <ExpandMoreIcon
            sx={{
              ...styles.expandMoreIcon,
              transform: visibility ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
          Milestones
        </Typography>
        {visibility && (
          <Box>
            <Button
              sx={styles.addButton}
              startIcon={<AddIcon />}
              onClick={onAddMilestoneClick}
            >
              Add Milestone
            </Button>
            {showSaveButton && (
              <Button
                sx={styles.saveButton}
                startIcon={<SaveIcon />}
                onClick={onSaveClick}
              >
                Save
              </Button>
            )}
          </Box>
        )}
      </Box>
      {visibility &&
        milestones?.map((milestone, index) => (
          <Box sx={styles.flexBoxItem} key={index}>
            <Box>
              <InputLabel sx={styles.label}>Milestone Name</InputLabel>
              <InputBase
                type="text"
                sx={styles.inputBase}
                value={milestone.milestoneName}
                onChange={(e) =>
                  handleMilestoneChange(index, "milestoneName", e.target.value)
                }
                disabled={!isEditable}
              />
            </Box>
            <Box>
              <InputLabel sx={styles.label}>Start Date</InputLabel>
              <InputBase
                type="date"
                sx={styles.inputBase}
                value={milestone.startDate}
                onChange={(e) =>
                  handleMilestoneChange(index, "startDate", e.target.value)
                }
                disabled={!isEditable}
              />
            </Box>
            <Box>
              <InputLabel sx={styles.label}>End Date</InputLabel>
              <InputBase
                type="date"
                sx={styles.inputBase}
                value={milestone.endDate}
                onChange={(e) =>
                  handleMilestoneChange(index, "endDate", e.target.value)
                }
                disabled={!isEditable}
              />
            </Box>
          </Box>
        ))}
    </Box>
  );
}

export default Milestones;
