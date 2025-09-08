import React from 'react';
import { Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

const ContentIcon = ({ width = 24, height = 24, className = "", showTechSummary, setShowTechSummary, rowId, setSelectedId }) => {
    const handleClick = () => {
        if (rowId) {
            setSelectedId(rowId);
        }
        setShowTechSummary(!showTechSummary);
    };

    return (
        <Tooltip title="Content" arrow>
            <Box
                component="span"
                className={className}
                onClick={handleClick}
                sx={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    cursor: "pointer",
                    color: "#00A398"
                }}
            >
                <InfoOutlinedIcon sx={{ width, height }} />
            </Box>
        </Tooltip>
    );
};

export default ContentIcon;
