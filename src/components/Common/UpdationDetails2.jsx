import React from 'react'
import { Box, Typography } from "@mui/material";

const styles = {
    updateInfo: {
      color: "#9F9F9F",
      fontSize: "12px",
    },
    boxStyle: { display: "flex", justifyContent: "space-between" }
  };

function UpdationDetails2({items, latestUpdateTime, modifiedBy}) {
  return (
    <>
        <Box sx={styles.boxStyle}>
          <Box>
            <Typography sx={styles.updateInfo}>
              {items && `${items} items \u2022`} Updated {latestUpdateTime}
            </Typography>
            <Typography sx={styles.updateInfo}>
              Updated by: {modifiedBy}
            </Typography>
          </Box>
        </Box>
    </>
  )
}

export default UpdationDetails2