import { Box } from '@mui/material'
import React from 'react'
import dashboardIcon from '../../../../assets/surveyo (1).svg';
import Tooltip from "@mui/material/Tooltip";

const SurveysIcon = ({ width = 24, height = 16, className = "", showSurvey, setShowSurvey }) => {
  const handleClick = () => {
    setShowSurvey(!showSurvey);
  };
  return (
    <Tooltip title="Surveys" arrow>
      <Box
        component="img"
        src={dashboardIcon}
        alt="Surveys Icon"
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

export default SurveysIcon