import React, { useState, useEffect } from 'react';
import { Box, FormControl, MenuItem, Select, Chip } from '@mui/material';
import PropTypes from 'prop-types';

function ProjectRolesSelector({ projectRoles = [], projectRolesList = [], setProjectRoles }) {
    const initialHeight = 30;
    const [selectHeight, setSelectHeight] = useState(initialHeight);

    const safeEmployeeRolesList = Array.isArray(projectRolesList) ? projectRolesList : [];

    const updateHeight = (selectedRoles) => {
        setSelectHeight(selectedRoles.length > 0 ? Math.min(80, initialHeight + selectedRoles.length * 20) : initialHeight);
    };

    const handleRoleChange = (event) => {
        const selectedRoles = event.target.value || [];
        setProjectRoles(selectedRoles);
        updateHeight(selectedRoles);
    };

    const handleDelete = (roleToRemove) => () => {
        setProjectRoles((prev) => {
            const updated = prev.filter((role) => role !== roleToRemove);
            updateHeight(updated);
            return updated;
        });
    };

    useEffect(() => {
        updateHeight(projectRoles);
    }, [projectRoles]);

    return (
        <FormControl
            sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid #E4E4E4',
                height: `${selectHeight}px`,
                position: 'relative',
            }}
            fullWidth
        >
            <Select
                multiple
                value={projectRoles}
                onChange={handleRoleChange}
                renderValue={(selected) => (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0,
                            maxHeight: 80,
                            overflowY: 'auto',
                            padding: '0',
                        }}
                    >
                        {selected.map((value) => (
                            <Chip
                                key={value}
                                label={value}
                                // onDelete={handleDelete(value)}
                                sx={{ margin: '1.5px' }}
                            />
                        ))}
                    </Box>
                )}
                sx={{
                    '& .MuiSelect-select': {
                        padding: '8px',
                        borderRadius: '20px',
                        border: 'none',
                        '&:focus': {
                            border: 'none',
                        },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                }}
            >
                {safeEmployeeRolesList.map((role) => (
                    <MenuItem key={role} value={role}>
                        {role}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

ProjectRolesSelector.propTypes = {
    projectRoles: PropTypes.arrayOf(PropTypes.string),
    projectRolesList: PropTypes.arrayOf(PropTypes.string),
    setProjectRoles: PropTypes.func.isRequired,
};

export default ProjectRolesSelector;
