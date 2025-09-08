import {
    Box,
    Button,
    FormHelperText,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    Typography,
} from "@mui/material";
import { GoUpload } from "react-icons/go";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { FilterListContext } from "../../context/FiltersListContext";
import { BaseURL } from "../../constants/Baseurl";

const styles = {
    flexBoxItem: {
        display: "flex",
        justifyContent: "space-between",
        px: 2,
    },
    label: {
        color: "#404040",
        fontSize: "14px",
        fontWeight: 600,
    },
    inputBase: {
        borderRadius: "20px",
        height: "40px",
        border: "1px solid #E4E4E4",
        pl: 1,
        width: "300px",
    },
    iconStyle: { fontSize: "17px", color: "#00A398" },
    paperStyle: {
        boxShadow: "0px 3px 6px #0000001F",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "20px",
        margin: "auto",
        maxWidth: "90%",
        width: 700,
    },
    titleStyle: {
        borderBottom: "1px solid #E4E4E4",
        px: 2.5,
        textAlign: "left",
        fontWeight: 600,
        fontSize: "13px",
        py: 1,
    },
    uploadBoxStyle: {
        border: "1px dashed #E4E4E4",
        borderWidth: "2px",
        ml: 2,
        mr: 2,
        borderRadius: "20px",
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    buttonStyle: {
        mr: 1,
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#9F9F9F",
        "&:hover": { backgroundColor: "#9F9F9F" },
    },
    uploadButtonStyle: {
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#00A398",
        "&:hover": { backgroundColor: "#00A398" },
    },
    modalStyle: {
        display: "flex",
    },
    innerBox: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
    },
    buttonBox: {
        mt: 1,
        display: "flex",
        justifyContent: "flex-end",
        px: 2,
        mb: 2,
    },
};

const fileTypes = ["Projects", 'Project Team', 'Employee', 'Wages'];

const UploadSheetsModal = ({ open, handleClose, fetchSheets }) => {
    const [file, setFile] = useState(null);
    const [client, setClient] = useState(null);
    const [fileError, setFileError] = useState(null);
    const { fetchClientList, clientList } = useContext(FilterListContext);
    const [fileType, setFileType] = useState(null);

    useEffect(() => {
        fetchClientList();
    }, []);

    const validateFileType = (file) => {
        const validTypes = [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
        ];
        return validTypes.includes(file.type);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (validateFileType(selectedFile)) {
                setFile(selectedFile);
                setFileError("");
            } else {
                setFile(null);
                setFileError("Please select a valid Excel or CSV file.");
            }
        }
    };
    const handleClearFile = () => {
        setFile(null);
        setFileError(null);
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            if (validateFileType(files[0])) {
                setFile(files[0]);
                setFileError("");
            } else {
                setFile(null);
                setFileError("Please select a valid Excel or CSV file.");
            }
        }
    };

    const handleSubmit = async (payload) => {
        if (!fileType) {
            return toast.error("Please select a file type.");
        }

        const { file, companyId } = payload;
        const userId = localStorage.getItem("userid");

        let apiUrl;
        switch (fileType.toLowerCase()) {
            case "project team":
                apiUrl = `${BaseURL}/api/v1/contacts/${userId}/${companyId}/upload-project-team-sheet`;
                break;
            case "projects":
                apiUrl = `${BaseURL}/api/v1/projects/${userId}/${companyId}/projects-upload`;
                break;
            case "employee":
                apiUrl = `${BaseURL}/api/v1/contacts/${userId}/${companyId}/upload-employee-sheet`;
                break;
            case "wages":
                apiUrl = `${BaseURL}/api/v1/contacts/${userId}/${companyId}/upload-payroll-sheet`;
                break;
            default:
                return toast.error("Invalid file type selected.");
        }

        const formData = new FormData();
        if (fileType.toLowerCase() === "project team") {
            formData.append("projectTeam", file);
            toast.loading("Uploading team sheet...");
        } else if (fileType.toLowerCase() === "projects") {
            formData.append("projects", file);
            toast.loading("Uploading projects sheet...");
        } else if (fileType.toLowerCase() === "employee") {
            formData.append("employees", file);
            toast.loading("Uploading employee sheet...");
        } else if (fileType.toLowerCase() === "wages") {
            formData.append("payroll", file);
            toast.loading("Uploading wages sheet...");
        }
        if (fileType) {
            formData.append("companyId", companyId);
        }

        try {
            const tokens = localStorage.getItem("tokens");
            const tokenObj = JSON.parse(tokens);

            const response = await axios.post(apiUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${tokenObj?.accessToken}`,
                },
            });

            // Call the rnd_calculate API for each project that received new information
            // if (response?.data?.data) {
            //     try {
            //         let projectsToProcess = [];
            //
            //         // Handle different response structures based on file type
            //         if (fileType.toLowerCase() === "projects") {
            //             // For projects file type, we might get a single projectId or an array of projects
            //             if (response.data.data.projectId) {
            //                 projectsToProcess.push({ projectId: response.data.data.projectId });
            //             } else if (Array.isArray(response.data.data.projects)) {
            //                 projectsToProcess = response.data.data.projects;
            //             }
            //         } else if (fileType.toLowerCase() === "project team") {
            //             // For project team file type, we might get project information in a different format
            //             if (response.data.data.projectId) {
            //                 projectsToProcess.push({ projectId: response.data.data.projectId });
            //             } else if (Array.isArray(response.data.data.projectTeams)) {
            //                 // Extract unique project IDs from project teams
            //                 const uniqueProjectIds = new Set();
            //                 response.data.data.projectTeams.forEach(team => {
            //                     if (team.projectId) uniqueProjectIds.add(team.projectId);
            //                 });
            //                 projectsToProcess = Array.from(uniqueProjectIds).map(id => ({ projectId: id }));
            //             }
            //         }
            //
            //         // Process each project
            //         for (const project of projectsToProcess) {
            //             const projectId = project.projectId || project.project_id;
            //             if (projectId) {
            //                 const rndCalculateUrl = `${BaseURL}/api/v1/projects/${projectId}/rnd_calculate`;
            //
            //                 await axios.post(rndCalculateUrl, {}, {
            //                     headers: {
            //                         Authorization: `Bearer ${tokenObj?.accessToken}`,
            //                     },
            //                 });
            //
            //                 console.log("QRE potential calculation initiated for project:", projectId);
            //             }
            //         }
            //     } catch (rndError) {
            //         console.error("Error calculating QRE potential:", rndError);
            //         // We don't want to block the main flow if this fails
            //     }
            // }


            handleModalClose();
            fetchSheets();
            toast.dismiss();
            toast.success(response?.data?.message || "Sheet uploaded successfully!");
        } catch (error) {
            console.error("Error uploading sheet:", error);
            toast.dismiss();
            toast.error(error?.response?.data?.message || "Failed to upload sheet.");
        }
    };


    const onFormSubmit = (e) => {
        e.preventDefault();
        let isValid = true;

        if (!file) {
            setFileError("Please select a file to upload.");
            isValid = false;
        } else if (!validateFileType(file)) {
            setFileError("Please select a valid Excel or CSV file.");
            isValid = false;
        } else {
            setFileError("");
        }

        if (isValid) {
            const payload = { file, companyId: client };
            handleSubmit(payload);
        }
    };

    const handleModalClose = () => {
        setFile(null);
        setClient(null);
        setFileType(null);
        setFileError(null);
        handleClose(); // Close the modal
    };

    return (
        <Modal open={open} onClose={handleModalClose} sx={styles.modalStyle}>
            <Paper sx={styles.paperStyle}>
                <Typography variant="h6" sx={styles.titleStyle}>
                    Upload Sheets
                </Typography>
                <Box sx={styles.flexBoxItem}>
                    <Box>
                        <InputLabel sx={styles.label}>File Type</InputLabel>
                        <Select
                            value={fileType}
                            onChange={(e) => setFileType(e.target.value)}
                            sx={{ ...styles.inputBase }}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Please select a file type
                            </MenuItem>
                            {fileTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box>
                        <InputLabel sx={styles.label}>Client</InputLabel>
                        <Select
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            sx={{ ...styles.inputBase }}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Please select a client
                            </MenuItem>
                            {clientList.map((client) => (
                                <MenuItem key={client.companyId} value={client.companyId}>
                                    {client.companyName}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                </Box>
                <Typography sx={{ px: 2, mb: "-2", fontWeight: 600 }}>Upload File</Typography>
                <Box
                    sx={styles.uploadBoxStyle}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                >
                    <Box sx={styles.innerBox}
                        onClick={() => document.getElementById("filer-inputer").click()}
                    >
                        <input
                            id="filer-inputer"
                            type="file"
                            hidden
                            onChange={handleFileChange}
                        />
                        <GoUpload style={styles.iconStyle} />
                        <Typography sx={{ color: "#00A398" }}>Upload</Typography>
                        <Typography sx={{ color: "#9F9F9F" }}>
                            (Drag and drop your file)
                        </Typography>
                        <Typography sx={{ color: "#9F9F9F" }}>
                            or{" "}
                            <span style={{ color: "#00A398", textDecoration: "underline" }}>
                                select a file
                            </span>{" "}
                            from your computer
                        </Typography>
                        {file && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                    {file.name}
                                </Typography>
                            </Box>
                        )}
                        {file && (
                            <Button color="error" onClick={handleClearFile}>
                                Clear
                            </Button>
                        )}
                    </Box>
                    {fileError && (
                        <FormHelperText error sx={{ textAlign: "center" }}>
                            {fileError}
                        </FormHelperText>
                    )}
                </Box>
                <Box sx={styles.buttonBox}>
                    <Button
                        variant="contained"
                        sx={styles.buttonStyle}
                        onClick={handleModalClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={styles.uploadButtonStyle}
                        onClick={onFormSubmit}
                    >
                        Upload
                    </Button>
                </Box>
            </Paper>
        </Modal>
    )
}

export default UploadSheetsModal;
