import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Box, Typography, Paper } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import ClientSelect from "./ModalComponents/ClientSelect";
import ProjectSelect from "./ModalComponents/ProjectSelect";
import DocumentTypeSelect from "./ModalComponents/DocumentSelect";
import FileUploadBox from "./ModalComponents/FileUploadBox ";
import { Authorization_header } from "../../utils/helper/Constant";

const styles = {
  fileListContainer: {
    maxHeight: "150px",
    overflowY: "auto",
    width: "100%",
    padding: "0 16px",
  },
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
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
  },
  topBoxStyle: {
    borderBottom: "1px solid #E4E4E4",
    px: 2.5,
    textAlign: "left",
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
  headerCheckboxStyle: {
    color: "#00A398",
    "&.Mui-checked": { color: "#00A398" },
  },
};

const DocumentsModal = ({
  open,
  handleClose,
  handleSubmit,
  type,
  clients,
  docType,
  page,
  comId = "",
  comName = "",
  projId = "",
  projName = "",
}) => {
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [company, setCompany] = useState(comName);
  const [companyId, setCompanyId] = useState(comId || null);
  const [project, setProject] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [doc, setDoc] = useState("");
  const [isProjectEnabled, setIsProjectEnabled] = useState(false);
  const [companyProjects, setCompanyProjects] = useState(null);
  const [clientError, setClientError] = useState("");
  const [docTypeError, setDocTypeError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const company_ref = useRef();
  const project_ref = useRef();


  company_ref.current = comName;
  project_ref.current = projName;


  const isValidFileType = (file) => {
    const lowerCaseFileName = file.name.toLowerCase();
    return [".xlsx", ".pdf", ".docx", ".msg", ".ppt", ".pptx"].some((type) => lowerCaseFileName.endsWith(type));
  };

  const onFormSubmit = (e) => {

    e.preventDefault();
    setClientError("");
    setDocTypeError("");

    let isValid = true;
    if (!company) {
      setClientError("Account is required");
      isValid = false;
    }
    if (!doc) {
      setDocTypeError("Document Type is required");
      isValid = false;
    }

    if (isValid && type === "upload" && files.length > 0 && companyId && doc) {
      let relatedTo;
      if (page === "project") {
        relatedTo = "projects";
      } else if (page === "account") {
        relatedTo = "accounts";
      } else {
        relatedTo = isProjectEnabled && projectId ? "projects" : "accounts";
      }

      let relationId;
      if (page === "project") {
        relationId = projId;
      } else if (page === "account") {
        relationId = comId;
      } else {
        relationId = isProjectEnabled && projectId ? projectId : companyId;
      }
      const submissionData = {
        files,
        companyId: page === "account" || page === "project" ? comId : companyId,
        doc,
        relatedTo,
        relationId,
      };

      handleSubmit(submissionData)
        .then(() => {
          resetForm();
          handleClose();
        })
        .catch((error) => {
          console.error("Submission error", error);
        });
    } else {

    }
  };

  const resetForm = () => {
    setFiles([]);
    setFileNames([]);
    setCompany(comName || company);
    setCompanyId(comId || companyId);
    setProject("");
    setProjectId(null);
    setDoc("");
    setIsProjectEnabled(false);
    setClientError("");
    setDocTypeError("");
    setUploadError("");
  };


  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    if (storedCompanyId) {
      const selectedClient = clients.find(client => client.companyId === storedCompanyId);
      if (selectedClient) {
        setCompanyId(selectedClient.companyId);
        setCompany(selectedClient.companyName);
      }
    }
  }, [clients]);

  const handleSelectClient = (name) => {
    const selectedClient = clients.find(c => c.companyName === name);
    if (selectedClient) {
      localStorage.setItem("companyId", selectedClient.companyId);
      setCompanyId(selectedClient.companyId);
      setCompany(name);
    }
  }

  const handleCheckboxChange = (event) => {
    setIsProjectEnabled(event.target.checked);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(isValidFileType);
    const hasInvalidFiles = selectedFiles.length !== validFiles.length;

    if (hasInvalidFiles) {
      setUploadError("Only .xlsx, .pdf, .msg, .ppt, .pptx and .docx files are allowed.");
    } else {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      setFileNames((prevNames) => [...prevNames, ...validFiles.map((file) => file.name)]);
      setUploadError("");
    }
  };

  const handleClearFile = () => {
    setFiles([]);
    setFileNames([]);
    document.getElementById("file-input").value = "";
  };
  const removeFile = (index) => {
    setFileNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearFiles = () => {
    setFiles([]);
    setFileNames([]);
    setCompany([]);
    setProject([]);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const validFiles = droppedFiles.filter(isValidFileType);
    const hasInvalidFiles = droppedFiles.length !== validFiles.length;

    if (hasInvalidFiles) {
      setUploadError("Only .xlsx, .pdf, and .docx files are allowed.");
    } else {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      setFileNames((prevNames) => [...prevNames, ...validFiles.map((file) => file.name)]);
      setUploadError("");
    }
  };

  useEffect(() => {
    setCompanyId(
      clients?.find((client) => client?.companyName === company)?.companyId
    );
    setProjectId(
      companyProjects?.find((proj) => proj?.projectName === project)?.projectId
    );
  }, [company, project]);

  useEffect(() => {
  }, [companyId]);

  const fetchProjects = async (id) => {
    try {
      const response = await axios.get(
        `${BaseURL}/api/v1/company/${localStorage.getItem(
          "userid"
        )}/${id}/get-projects-by-company`, Authorization_header()
      );
      setCompanyProjects(response?.data?.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    if (page === "account" || page === "project") {
      setCompany(comName);
    }
    if (page === "project") {
      setProject(projName);
    }
  }, [comName, projName]);

  useEffect(() => {
    if (comId && comId != undefined) {
      fetchProjects(comId);
    } else if (companyId && companyId != undefined) {
      fetchProjects(companyId);
    } else if (company_ref) {
      fetchProjects(company_ref);
    }
  }, [comId, companyId, company_ref]);

  const isClientSelectDisabled = !!comName || !!comId || type === "reupload";

  const isProjectSelectDisabled =
    !!projName || !!projId || !isProjectEnabled || type === "reupload";

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };
  return (
    <Modal open={open} onClose={handleModalClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Box
          sx={{
            ...styles.topBoxStyle,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={styles.titleStyle}>
            Upload Document
          </Typography>
          <CancelIcon
            sx={{
              color: "#9F9F9F",
              cursor: "pointer",
              "&: hover": { color: "#FD5707" },
            }}
            onClick={handleClose}
          />
        </Box>
        <Box sx={styles.flexBoxItem}>
          <ClientSelect
            clients={clients}
            company={page === "project" ? company_ref.current : company}
            setCompany={handleSelectClient}
            disabled={isClientSelectDisabled}
            error={clientError}
            purpose="documents"
          />
          {!(page === "account") && (
            <ProjectSelect
              isProjectEnabled={isProjectEnabled}
              handleCheckboxChange={handleCheckboxChange}
              companyProjects={companyProjects}
              project={page === "project" ? project_ref.current : project}
              setProject={setProject}
              disabled={isProjectSelectDisabled}
              page={page}
              purpose="documents"
            />
          )}
          <DocumentTypeSelect
            docType={docType}
            doc={doc}
            setDoc={setDoc}
            disabled={type === "reupload"}
            error={docTypeError}
          />
        </Box>
        <Typography sx={{ px: 2, mb: -2, fontWeight: 600 }}>
          Upload Document
        </Typography>
        <FileUploadBox
          fileNames={fileNames}
          handleFileChange={handleFileChange}
          handleFileDrop={handleFileDrop}
          handleClearFile={handleClearFile}
          uploadError={uploadError}
          removeFile={removeFile}
        />
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
  );
};

export default DocumentsModal;
