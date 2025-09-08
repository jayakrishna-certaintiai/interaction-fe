import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

const styles = {
  updateInfo: {
    color: "#9F9F9F",
    fontSize: "12px",
  },
  editButton: {
    borderRadius: "20px",
    backgroundColor: "#00A398",
    color: "white",
    textTransform: "capitalize",
    height: "30px",
    "&:hover": { backgroundColor: "#00A398" },
  },
  editIcon: {
    fontSize: "20px",
    mr: 1,
  },
};

function UpdationDetails({
  handleEditClick,
  edit,
  latestUpdateTime,
  modifiedBy,
  isAuth = true,
}) {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
        <Box>
          <Typography sx={styles.updateInfo}>
            Updated {latestUpdateTime}
          </Typography>
          <Typography sx={styles.updateInfo}>
            Updated by: {modifiedBy}
          </Typography>
        </Box>
        {isAuth && (
          <>
            {edit ? (
              <div style={{ display: "flex", gap: "20px" }}>
                <Button
                  variant="contained"
                  sx={styles.editButton}
                  onClick={handleEditClick}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={styles.editButton}
                  onClick={handleEditClick}
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button
                variant="contained"
                startIcon={<EditIcon sx={styles.editIcon} />}
                sx={styles.editButton}
                onClick={handleEditClick}
              >
                Edit
              </Button>
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default UpdationDetails;
