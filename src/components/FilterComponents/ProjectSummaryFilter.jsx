import {
    Box,
    Accordion,
    AccordionDetails,
    Typography,
    Drawer,
    FormControlLabel,
    Checkbox,
    Collapse,
    TextField,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import ActionButton from "../FilterComponents/ActionButton";
import { Authorization_header } from "../../utils/helper/Constant";
import StatusFilter from "./StatusFilter";
import { ProjectContext } from "../../context/ProjectContext";

const styles = {
    drawerPaper: {
        "& .MuiDrawer-paper": {
            height: "37%",
            display: "flex",
            flexDirection: "column",
            marginTop: "21.5rem",
            marginLeft: "20px",
            borderBottom: "1px solid #E4E4E4",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            borderLeft: "1px solid #E4E4E4",
        },
    },
    drawerContainer: {
        display: "flex",
        flexDirection: "column",
        flex: 10,
        marginTop: "-0%",
        width: "17rem",
        
    },
    header: {
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #E4E4E4",
        borderTop: "1px solid #E4E4E4",
        px: 2,
        height: "45px",
        justifyContent: "space-between",
        backgroundColor: "#ececec",
    },
    title: {
        fontWeight: "500",
        textTransform: "capitalize",
        marginRight: "-10px",
        color: "black",
        fontSize: "16px",
        position: "sticky",
        backgroundColor: "#ececec",
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "16px",
        borderTop: "1px solid #E4E4E4",
        marginTop: "1px",
        gap: 1,
    },
    textField: {
        fontSize: "0.82rem",
        padding: "2px 0px",
        height: "32px",
        width: "120px",
        borderRadius: "20px",
    },
};

function ProjectSummaryFilter({ open, handleClose, projectId, onApplyFilters }) {
    const {
        projectFilterState,
        setProjectFilterState,
        clearProjectFilterTrigger,
        setIsProjectFilterApplied,
        triggerProjectClearFilters,
    } = useContext(ProjectContext);

    // Temporary state for filters
    const [tempCreatedOnStartDate, setTempCreatedOnStartDate] = useState("");
    const [tempCreatedOnEndDate, setTempCreatedOnEndDate] = useState("");
    const [tempSummaryStatus, setTempSummaryStatus] = useState([]);

    const [statusList, setStatusList] = useState([]);
    const [showCreatedOn, setShowCreatedOn] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [dateError, setDateError] = useState("");

    useEffect(() => {
        const fetchFilterSummaryList = async () => {
            try {
                const url = `${BaseURL}/api/v1/projects/get-summary-filter-values?projectIdentifier=${projectId}`;
                const response = await axios.get(url, Authorization_header());
                const data = response?.data?.data || {};
                setStatusList(data?.summaryStatus || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFilterSummaryList();
    }, [projectId]);

    useEffect(() => {
        if (clearProjectFilterTrigger) {
            setTempCreatedOnStartDate("");
            setTempCreatedOnEndDate("");
            setTempSummaryStatus([]);
            setDateError("");
            triggerProjectClearFilters();
            setShowCreatedOn(false);
            setShowStatus(false);
        }
    }, [clearProjectFilterTrigger, triggerProjectClearFilters]);

    const handleDateChange = (dateType) => (event) => {
        const value = event.target.value;
        if (dateType === "createdOnStartDate") {
            setTempCreatedOnStartDate(value);
            if (tempCreatedOnEndDate && new Date(value) > new Date(tempCreatedOnEndDate)) {
                setDateError("Start date cannot be after end date");
            } else {
                setDateError("");
            }
        } else if (dateType === "createdOnEndDate") {
            setTempCreatedOnEndDate(value);
            if (tempCreatedOnStartDate && new Date(value) < new Date(tempCreatedOnStartDate)) {
                setDateError("End date cannot be before start date");
            } else {
                setDateError("");
            }
        }
    };

    const clearFilters = () => {
        setTempCreatedOnStartDate("");
        setTempCreatedOnEndDate("");
        setTempSummaryStatus([]);
        setDateError("");
        onApplyFilters({});
        triggerProjectClearFilters();
        setIsProjectFilterApplied(false);
        setShowCreatedOn(false);
        setShowStatus(false);
    };

    const applyFilters = () => {
        const filters = {
            ...(tempCreatedOnStartDate && { createdOnStartDate: tempCreatedOnStartDate }),
            ...(tempCreatedOnEndDate && { createdOnEndDate: tempCreatedOnEndDate }),
            ...(tempSummaryStatus.length > 0 && { summaryStatus: tempSummaryStatus }),
        };

        setProjectFilterState((prevState) => ({
            ...prevState,
            ...filters,
        }));

        onApplyFilters(filters);
        setIsProjectFilterApplied(true);
    };

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={handleClose}
            variant="persistent"
            sx={styles.drawerPaper}
        >
            <Box sx={styles.drawerContainer}>
                <Box sx={styles.header}>
                    <Typography sx={styles.title}>Summary Filter</Typography>
                </Box>
                <Box sx={{px: "5%"}}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showStatus}
                                onChange={(e) => setShowStatus(e.target.checked)}
                                sx={{
                                    color: "#9F9F9F",
                                    "&.Mui-checked": {
                                        color: "#00A398",
                                    },
                                }}
                            />
                        }
                        label="Status"
                    />
                    <Collapse in={showStatus}>
                        <StatusFilter
                            status={tempSummaryStatus}
                            statusList={statusList}
                            setStatus={setTempSummaryStatus}
                        />
                    </Collapse>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showCreatedOn}
                                onChange={(e) => setShowCreatedOn(e.target.checked)}
                                sx={{
                                    color: "#9F9F9F",
                                    "&.Mui-checked": {
                                        color: "#00A398",
                                    },
                                }}
                            />
                        }
                        label="Created On"
                    />
                    <Collapse in={showCreatedOn}>
                        <Box display="flex" gap={3}>
                            <TextField
                                type="date"
                                label="Start Date"
                                value={tempCreatedOnStartDate || ""}
                                onChange={handleDateChange("createdOnStartDate")}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    sx: {...styles.textField},
                                    
                                }}
                                error={!!dateError}
                                helperText={dateError}
                            />
                            <TextField
                                type="date"
                                label="End Date"
                                value={tempCreatedOnEndDate || ""}
                                onChange={handleDateChange("createdOnEndDate")}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    sx: {...styles.textField},
                                }}
                            />
                        </Box>
                    </Collapse>
                </Box>
                <Box sx={styles.footer}>
                    <ActionButton
                        label="Clear"
                        color="#9F9F9F"
                        onClick={clearFilters}
                    />
                    <ActionButton
                        label="Apply"
                        color="#00A398"
                        onClick={applyFilters}
                    />
                </Box>
            </Box>
        </Drawer>
    );
}

export default ProjectSummaryFilter;
