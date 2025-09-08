import React, { useContext, useEffect, useState, useMemo } from 'react';
import {
    Modal,
    Button,
    Select,
    MenuItem,
    InputLabel,
    Box,
    Typography,
    Paper,
    FormHelperText,
} from "@mui/material";
import { GoUpload } from "react-icons/go";
import { FilterListContext } from '../../context/FiltersListContext';
import useFormValidation from '../../hooks/useFormValidations';
import DocumentTypeSelect from '../Documents/ModalComponents/DocumentSelect';

const styles = {
    flexBoxItem: { display: "flex", justifyContent: "space-between", px: 2 },
    label: { color: "#404040", fontSize: "14px", fontWeight: 600, mb: "5px" },
    inputBase: { borderRadius: "20px", height: "40px", border: "1px solid #E4E4E4", pl: 1, width: "200px" },
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
    titleStyle: { borderBottom: "1px solid #E4E4E4", px: 2.5, textAlign: "left", fontWeight: 600, fontSize: "13px", py: 1 },
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
    buttonStyle: { mr: 1, borderRadius: "20px", textTransform: "capitalize", backgroundColor: "#9F9F9F", "&:hover": { backgroundColor: "#9F9F9F" } },
    uploadButtonStyle: { borderRadius: "20px", textTransform: "capitalize", backgroundColor: "#00A398", "&:hover": { backgroundColor: "#00A398" } },
    modalStyle: { display: "flex" },
    innerBox: { display: "flex", alignItems: "center", flexDirection: "column", cursor: "pointer" },
    buttonBox: { mt: 1, display: "flex", justifyContent: "flex-end", px: 2, mb: 2 },
};

// Utility function to validate file type
const validateFileType = (file) => {
    const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
    ];
    return validTypes.includes(file?.type);
};

const ContactAddModal = ({ open, handleClose, handleSubmit, type, data }) => {
    const { fetchClientList, clientList } = useContext(FilterListContext);
    const [formData, setFormData] = useState({ client: '', file: null, });
    const [doc, setDoc] = useState("");
    const [docTypeError, setDocTypeError] = useState("");
    const docType = ["Employees", "Wages"];

    useEffect(() => { fetchClientList(); }, []);

    // Form validation rules
    const validationRules = useMemo(() => ({
        client: {
            required: type === 'upload',
            message: 'Please select a account.',
        },
        file: {
            required: true,
            validate: (file) => validateFileType(file),
            message: 'Please select a valid Excel or CSV file.',
        },
    }), [type]);

    const { errors, validateField, validateAll, setErrors } = useFormValidation(validationRules);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        validateField(field, value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        handleChange('file', selectedFile);
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        handleChange('file', droppedFile);
    };

    const handleClearFile = () => {
        setFormData(prev => ({ ...prev, file: null }));
        setErrors(prev => ({ ...prev, file: '' }));
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        const isValid = validateAll(formData);
        if (isValid) {
            const payload = {
                file: formData.file,
                companyId: type === "upload" ? formData.client : data?.companyId,
                documentType: doc,
            };
            handleSubmit(payload);
        }
    };

    return (
        <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
            <Paper sx={styles.paperStyle}>
                <Typography variant='h6' sx={styles.titleStyle}>Upload Documents</Typography>
                <Box sx={styles.flexBoxItem}>
                    <Box>
                        <InputLabel sx={styles.label}>Account</InputLabel>
                        <Select
                            value={type === "reupload" ? data?.companyId : formData.client}
                            onChange={(e) => handleChange('client', e.target.value)}
                            sx={{ ...styles.inputBase, width: "250px", border: "none" }}
                            displayEmpty
                            disabled={type === "reupload"}
                        >
                            <MenuItem value="" disabled>Please select a account</MenuItem>
                            {type === "upload" && clientList?.map(client => (
                                <MenuItem value={client?.companyId} key={client?.companyId}>
                                    {client?.companyName}
                                </MenuItem>
                            ))}
                            {type === "reupload" && (
                                <MenuItem value={data?.companyId}>{data?.companyId}</MenuItem>
                            )}
                        </Select>
                        {errors.client && <FormHelperText error>{errors.client}</FormHelperText>}
                    </Box>
                    <Box>
                        <DocumentTypeSelect
                            docType={docType}
                            doc={doc}
                            setDoc={setDoc}
                            disabled={false}
                            error={docTypeError}
                        />
                    </Box>
                </Box>
                <Typography sx={{ px: 2, mb: "-2", fontWeight: 600 }}>Upload Employees sheet</Typography>
                <Box
                    sx={styles.uploadBoxStyle}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                >
                    <Box sx={styles.innerBox} onClick={() => document.getElementById("file-input").click()}>
                        <input id="file-input" type="file" hidden onChange={handleFileChange} />
                        <GoUpload style={styles.iconStyle} />
                        <Typography sx={{ color: "#00A398" }}>Upload</Typography>
                        <Typography sx={{ color: "#9F9F9F" }}>(Drag and drop your file)</Typography>
                        {formData.file && <Typography variant="body2">{formData.file.name}</Typography>}
                    </Box>
                    {errors.file && <FormHelperText error sx={{ textAlign: 'center' }}>{errors.file}</FormHelperText>}
                </Box>
                {formData.file && (
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                        <Button variant="outlined" color="error" onClick={handleClearFile}>
                            Clear File
                        </Button>
                    </Box>
                )}
                <Box sx={styles.buttonBox}>
                    <Button
                        variant="contained"
                        sx={styles.buttonStyle}
                        onClick={() => {
                            setFormData({ client: '', file: null });
                            setDoc("");
                            setDocTypeError("");
                            setErrors({});
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

export default ContactAddModal;
