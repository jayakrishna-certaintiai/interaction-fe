import { useContext, useEffect, useState } from "react";
import { FilterListContext } from "../../context/FiltersListContext";
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
        width: "200px",
    },
    iconStyle: { fontSize: "17px", color: "#00A398" },
    paperStyle: {
        boxShadow: "0px 3px 6px #0000001F",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: 3,
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

export const AddTeamModal = ({ open, handleClose, type, data }) => {
    const [file, setFile] = useState(null);
    const [client, setClient] = useState(null);
    const [fileError, setFileError] = useState("");
    const { fetchClientList, clientList } = useContext(FilterListContext);

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
        setFileError("");
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
        const { file, companyId } = payload;

        const userId = localStorage.getItem("userid");
        const apiUrl = `${BaseURL}/api/v1/contacts/${userId}/${companyId}/upload-project-team-sheet`;

        const formData = new FormData();
        formData.append("projectTeam", file);
        formData.append("companyId", companyId);

        toast.loading("Uploading team sheet...");
        try {
            const tokens = localStorage.getItem("tokens");
            const tokenObj = JSON.parse(tokens);

            const response = await axios.post(apiUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${tokenObj?.accessToken}`,
                },
            });

            handleClose();
            fetchClientList();
            toast.dismiss();
            toast.success(response?.data?.message || "Team sheet uploaded successfully!");
        } catch (error) {
            console.error("Error uploading team sheet:", error);
            toast.dismiss();
            toast.error(error?.response?.data?.message || "Failed to upload team sheet.");
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
            const payload = { file, companyId: type === "upload" ? client : data?.companyId };
            handleSubmit(payload);
        }
    };

    return (
        <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
            <Paper sx={styles.paperStyle}>
                <Typography variant="h6" sx={styles.titleStyle}>
                    Upload Team Members
                </Typography>
                <Box sx={styles.flexBoxItem}>
                    <Box>
                        <InputLabel sx={styles.label}>Account</InputLabel>
                        <Select
                            value={type === "reupload" ? data?.companyId : client || ""}
                            onChange={(e) => setClient(e.target.value)}
                            sx={{ ...styles.inputBase, width: "650px", border: "none" }}
                            displayEmpty
                            disabled={type === "reupload"}
                        >
                            <MenuItem value="" disabled>
                                Please select a account
                            </MenuItem>
                            {type === "upload" &&
                                clientList?.map((client) => (
                                    <MenuItem value={client?.companyId} key={client?.companyId}>
                                        {client?.companyName}
                                    </MenuItem>
                                ))}
                            {type === "reupload" && (
                                <MenuItem value={data?.companyId}>{data?.companyId}</MenuItem>
                            )}
                        </Select>
                    </Box>
                </Box>
                <Typography sx={{ px: 2, mb: "-2", fontWeight: 600 }}>
                    Upload Team File
                </Typography>
                <Box
                    sx={styles.uploadBoxStyle}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                >
                    <Box
                        sx={styles.innerBox}
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
                        onClick={() => {
                            setClient("");
                            setFile(null);
                            handleClose();
                        }}
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
    );
};
