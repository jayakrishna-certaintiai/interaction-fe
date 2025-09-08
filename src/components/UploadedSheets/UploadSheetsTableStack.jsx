import { useEffect, useState } from 'react'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { postRecentlyViewed } from '../../utils/helper/PostRecentlyViewed';
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import React from 'react';

const styleConstants = {
    filterDownloadStyle: {
        color: "white",
        borderRadius: "50%",
        backgroundColor: "#00A398",
        fontSize: "28px",
        padding: "5px",
        marginRight: "16px",
        cursor: "pointer",
    },
    tableContainerStyle: {
        borderLeft: "1px solid #E4E4E4",
    },
    overlay: {
    },
    containerDimmed: {
    },
};

const headerCellStyle = {
    fontSize: "13px",
    borderRight: "1px solid #ddd",
    borderLeft: "1px solid #ddd",
    whiteSpace: "nowrap",
    py: 0.8,
    textAlign: "left",
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: "#ececec",
    cursor: "pointer",
};
const theme = createTheme({
    components: {
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: '#00A398 !important',
                    height: '-5em',
                },
                checked: {
                    color: '#00A398 !important',

                },
                menu: {
                    sx: {
                        width: '150px',
                        fontSize: '12px',
                        padding: '4px 8px',
                    },
                },
            },
        },
    },
});

const tableData = {
    columns: [
        "Sheet ID", "Sheet Name", "Account Name", "Project ID (Project Code)", "Project Name",
        "Uploaded By", "Uploaded On", "Status", "Total Records", "Processed Records"],
};


const UploadSheetsTableStack = () => {
    const [search, setSearch] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [sheets, setSheets] = useState([]);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);

    const fieldNameMapping = {
        sheetid: "sheet_id",
        sheetName: "sheet_name",
        accountName: "account_name",
        projectId: "project_code",
        projectName: "project_name",
        UploadedBy: "uploaded_by",
        uploadedOn: "uploaded_on",
        status: "status",
        totalRecords: "total_records",
        processedRecords: "processed_records"
    }

    useEffect(() => {
        if (!Array.isArray(sheets)) {
            setFilteredRows([]);
            return;
        }

        const lowerCaseSearch = search?.toLowerCase();

        const filteredData = sheets
            .map((row) => {
                const mappedRow = {
                    id: row.projectId || `generated-id-${Math.random()}`,
                    ...Object.fromEntries(
                        Object.entries(fieldNameMapping).map(([field, mappedField]) => [
                            field,
                            mappedField === "uploaded_by"
                                ? row[mappedField]?.replaceAll("Z", "").replaceAll("T", " ") || ""
                                : row[mappedField] || "",
                        ])
                    ),
                };
                return mappedRow;
            })
            .filter((row) =>
                search
                    ? Object.values(row)
                        .filter(Boolean) // Exclude null/undefined values
                        .some((value) => value.toString().toLowerCase().includes(lowerCaseSearch))
                    : true
            );

        setFilteredRows(filteredData);
    }, [search, sheets]);

    const removeSpecialCharsAndLowerCase = (str) => {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "");
    };

    const mappedRows = Array.isArray(filteredRows)
        ? filteredRows.map((row) => {
            const mappedRow = {};
            Object.keys(fieldNameMapping).forEach((field) => {
                const mappedField = fieldNameMapping[field];
                mappedRow[field] = row[mappedField] || "";
            });
            mappedRow.id = row?.sheetid;
            return mappedRow;
        })
        : [];
    const [rows, setRows] = useState(mappedRows);

    const handleColumnClick = (col) => {
        const fieldName = removeSpecialCharsAndLowerCase(col);
        const mappedField = fieldNameMapping[fieldName];
        if (sortField === mappedField) {
            if (sortOrder === "asc") {
                setSortOrder("dsc");
            } else if (sortOrder === "dsc") {
                setSortOrder(null);
                setSortField(null);
            } else {
                setSortOrder("asc");
            }
        } else {
            setSortField(mappedField);
            setSortOrder("asc");
        }
    };

    const renderSortIcons = (column, index) => {
        const fieldName = removeSpecialCharsAndLowerCase(column);
        const mappedField = fieldNameMapping[fieldName];
        let upColor = activeColor;
        let downColor = activeColor;
        let upOpacity = 0.6;
        let downOpacity = 0.6;
        if (sortField === mappedField) {
            if (sortOrder === "asc") {
                upColor = "#FD5707";
                downColor = inactiveColor;
                upOpacity = 10.8;
                downOpacity = 0.8;
            } else if (sortOrder === "dsc") {
                upColor = inactiveColor;
                downColor = "#FD5707";
                upOpacity = 0.2;
                downOpacity = 0.8;
            }
        }

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StraightIcon
                    fontSize="small"
                    style={{
                        color: upColor,
                        opacity: upOpacity,
                        marginRight: -5,
                        fontSize: "17px",
                    }}
                    onClick={() => handleColumnClick(column)}
                />
                <StraightIcon
                    fontSize="small"
                    style={{
                        color: downColor,
                        opacity: downOpacity,
                        marginLeft: -5,
                        fontSize: "17px",
                        transform: "rotate(180deg)",
                    }}
                    onClick={() => handleColumnClick(column)}
                />
            </Box>
        );
    };

    const columns = tableData.columns.map((col) => {
        const fieldName = removeSpecialCharsAndLowerCase(col);
        const mappedField = fieldNameMapping[fieldName];
        const isCentered = ["processedRecords", "status", "uploadedon"].includes(fieldName);
        const isRightAligned = ["totalRecords"].includes(fieldName);
        const alignmentStyle = isCentered
            ? { justifyContent: "center", textAlign: "center" }
            : isRightAligned
                ? { justifyContent: "flex-end", textAlign: "right" }
                : { justifyContent: "flex-start", textAlign: "left" };

        return {
            field: fieldName,
            headerName: col,
            width: 270,
            sortable: false,
            headerAlign: "center",
            renderHeader: () => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {col}
                    {renderSortIcons(col, mappedField)}
                </Box>
            ),
            renderCell: (params) => {
                const handleDownloadClick = async (sheetName) => {
                    setDownloaded(true);
                    await downloadDocument(sheetName);
                };

                let displayValue = params.value;
                if (fieldName === "qrepotential" && displayValue !== "") {
                    displayValue = parseFloat(displayValue).toFixed(2);
                }
                if (fieldName === "accountName" || fieldName === "projectName" || fieldName === "projectId") {
                    return (
                        <Typography
                            className="value-text"
                            sx={{
                                textDecoration: "underline",
                                color: "#00A398",
                                fontSize: "13px",
                                lineHeight: 2.5,
                                padding: "0 10px",
                            }}
                            title={params.value}
                        >
                            {params.value}
                        </Typography>
                    );
                }
                const isSpecialField = fieldName === "sheetName";
                return (
                    <Typography
                        className="value-text"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                            width: "100%",
                            padding: "0 10px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            fontSize: "13px",
                            lineHeight: 2.5,
                            marginBottom: "0",
                            color: isSpecialField ? "#00A398" : "inherit",
                            textDecoration: isSpecialField ? "underline" : "none",
                            ...alignmentStyle,
                        }}
                        title={displayValue}
                    >
                        {isSpecialField && (

                            <Tooltip title={downloaded ? "Downloaded!" : "Download"}>
                                <CloudDownloadOutlinedIcon
                                    style={{
                                        fontSize: "20px",
                                        marginRight: "5px",
                                        marginLeft: "-5px",
                                        color: "#00A398",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleDownloadClick(params.row.blobname)}
                                />
                            </Tooltip>
                        )}
                        {displayValue}
                    </Typography>
                );
            },
        };
    });
    const activeColor = "#404040";
    const inactiveColor = "#ccc";
    let upColor = activeColor;
    let downColor = activeColor;
    if (sortField === columns) {
        if (sortOrder === "asc") {
            downColor = "#FD5707";
            upColor = inactiveColor;
        } else if (sortOrder === "dsc") {
            upColor = "#FD5707";
            downColor = inactiveColor;
        }
    }

    const handleCompanyClick = (companyId) => {
        (async () => {
            await postRecentlyViewed(companyId, "company");
            navigate(`/accounts/info?companyId=${encodeURIComponent(companyId)}`);
        })();
    };

    const handleProjectClick = (projectId) => {
        (async () => {
            await postRecentlyViewed(projectId, "project");
            navigate(`/projects/info?projectId=${encodeURIComponent(projectId)}`);
        })()
    }

    const handleRowClick = (params) => {
        if (params.field === "accountName") {
            handleCompanyClick(params?.row?.companyId);
        } else if (params.field === "projectName") {
            handleProjectClick(params?.row?.projectId);
        }
    }

    const processRowUpdate = (newRow, oldRow) => {
        const { id } = newRow;
        const editedFields = Object.keys(newRow).filter(
            (key) => newRow[key] !== oldRow[key]
        );
        if (editedFields.length > 0) {
            const updatedFields = {};

            editedFields.forEach((field) => {
                const backendField = fieldNameMapping[field];
                if (backendField) {
                    updatedFields[backendField] = newRow[field];
                }
            });
            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.id === id ? { ...row, ...newRow } : row
                )
            );
        }
        return newRow;
    };

    const CustomToolbar = () => {
        return (
            <Box
                className="custom-toolbar"
                sx={{
                    position: 'absolute',
                    top: '10px',
                    left: '5px',
                    zIndex: 2,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    p: 0.5,
                }}
            >
                <GridToolbarColumnsButton
                    componentsProps={{
                        menu: {
                            sx: {
                                height: "10px",
                                width: '150px',
                                fontSize: '12px',
                                padding: '4px 8px',
                            },
                        },
                    }}
                    sx={{
                        '& .MuiCheckbox-root': {
                            color: 'red !important',
                            height: '16px',
                            width: '16px',
                            padding: 0,
                        },
                        '& .Mui-checked': {
                            color: 'red !important',
                        },
                    }}
                />
            </Box>
        );
    };

    useEffect(() => {
        document.body.style.overflow = filterPanelOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [filterPanelOpen]);

    const handleFilterClick = () => {
        setFilterPanelOpen(!filterPanelOpen);
        if (!filterPanelOpen) {
            setFilterPanelOpen(true);
        }
    };

    const handleFilterPanelClose = () => {
        setFilterPanelOpen(false);
        setFilterPanelOpen(false);
    };

    return (
        <div>UploadSheetsTableStack</div>
    )
}

export default UploadSheetsTableStack