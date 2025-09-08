import { Box } from '@mui/material'
import React from 'react'
import dashboardIcon from '../../../../assets/interactions.png';
import Tooltip from "@mui/material/Tooltip";

const InteractionIcon = ({ width = 24, height = 16, className = "", showInteractions, setShowInteractions }) => {
  const handleClick = () => {
    setShowInteractions(!showInteractions);
  };
  return (
    <Tooltip title="Interactions" arrow>
      <Box
        component="img"
        src={dashboardIcon}
        alt="Interactions Icon"
        // width={width}
        height={height}
        className={className}
        onClick={handleClick}
        sx={{
          display: "inline-block",
          verticalAlign: "middle",
        }}
      />
    </Tooltip>
  )
}

export default InteractionIcon