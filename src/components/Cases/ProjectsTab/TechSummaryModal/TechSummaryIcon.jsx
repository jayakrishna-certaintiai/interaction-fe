import { Box } from '@mui/material'
import React from 'react'
import dashboardIcon from '../../../../assets/dashboard-report-icon.svg';
import Tooltip from "@mui/material/Tooltip";

const TechSummaryIcon = ({ width = 24, height = 24, className = "", showTechSummary, setShowTechSummary }) => {
  const handleClick = () => {
    setShowTechSummary(!showTechSummary);
  };
  return (
    <Tooltip title="Technical summary" arrow>
      <Box
        component="img"
        src={dashboardIcon}
        alt="Dashboard Icon"
        width={width}
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

export default TechSummaryIcon