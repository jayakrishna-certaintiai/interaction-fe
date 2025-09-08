import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { GoUpload } from "react-icons/go";

const FileUploadBox = ({
  fileNames,
  handleFileChange,
  handleFileDrop,
  handleClearFile,
  uploadError
}) => {
  return (
    <Box
      sx={{
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
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
      onDrop={handleFileDrop}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          cursor: "pointer",
        }}
        onClick={() => {
          const fileInput = document.getElementById("file-input");
          fileInput.value = "";
          fileInput.click();
        }}
      >
        <input
          id="file-input"
          type="file"
          hidden
          multiple
          onChange={handleFileChange}
          accept=".xlsx,.pdf,.Pdf,.PDF,.pDf,.pdF,.docx,.msg, .ppt, .pptx"
        />
        <GoUpload style={{ fontSize: "17px", color: "#00A398" }} />
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
        <Typography sx={{ color: "#FD5707", fontSize: "13px" }}>
          Supported formats(".pdf", ".docx", ".xlsx", ".msg", ".ppt", ".pptx")
        </Typography>
        {fileNames?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              border: "1px solid #E4E4E4",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
              maxHeight: "134px",
              overflowY: "auto",
              width: "45em"
            }}
          >
            {fileNames?.map((name, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {name}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      {fileNames?.length > 0 && (
        <Button color="error" onClick={handleClearFile}>
          Clear
        </Button>
      )}

      {uploadError && <Typography color="error">{uploadError}</Typography>}
    </Box>
  );
};

export default FileUploadBox;