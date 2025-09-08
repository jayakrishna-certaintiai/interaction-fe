import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoDownload, GoUpload } from "react-icons/go";
import { Typography, Box, Button, Tooltip } from "@mui/material";
// import ConstructionIcon from "@mui/icons-material/Construction";
import ModalForm from "./ModalForm";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import { Authorization_header, token_obj } from "../../utils/helper/Constant";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CaseContext } from "../../context/CaseContext";
import { color } from "highcharts";
import { FileUpload, Height } from "@mui/icons-material";

const styles = {
  flexBox: {
    display: "flex",
    justifyContent: "space-between",
    mb: -0
  },
  paddingLeftBox: {
    p: 1,
  },
  companyTypography: {
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
  },
  appleSpan: {
    // fontSize: "17px",
    color: "#00A398",
    padding: 10
  },
  appleIncTypography: {
    display: "flex",
    alignItems: "center",
    fontSize: "23px",
    fontWeight: 600,
    color: "#FD5707",
    mt: -2,
    // mb: -50
  },
  lanIcon: {
    borderRadius: "50%",
    border: "1px solid black",
    padding: "5px",
    fontSize: "30px",
    ml: 2,
    "&:hover": {
      color: "#FD5707",
      border: "1px solid #FD5707",
    },
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    mt: -2,
    p: 1,
    pb: -5,
  },
  buttonStyle: {
    textTransform: "capitalize",
    borderRadius: "10px",
    height: "2.3em",
    backgroundColor: "#00A398",
    mr: 2,
    "&:hover": {
      backgroundColor: "#00A398",
    },
    mt: 1.5
  },
  goDownloadIcon: {
    color: "white",
    borderRadius: "50%",
    backgroundColor: "#00A398",
    fontSize: "33px",
    padding: "5px",
    marginRight: "16px",
  },
  itemBox: (isSelected) => ({
    display: "flex",
    flexDirection: "column",
    padding: "3px",
    // backgroundColor: isSelected ? "rgba(0, 163, 152, 0.1)" : "white",
    // borderBottom: "1px solid #E4E4E4",
    // cursor: "pointer",
  }),
  projectTypography: {
    fontWeight: 600,
    fontSize: "15px",
  },
  detailBox: {
    justifyContent: "space-between",
    display: "flex",
  },
  detailText: {
    fontSize: "15px",
  },

};

function TimesheetInfoboxHeader({
  head,
  head1,
  data,
  timesheetId,
  downloadPermission = true,
  uploadPermission = true,
  fieldMapping, onItemSelected, page
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleSelectedCase } = React.useContext(CaseContext);
  const specificId = useMemo(() => searchParams.get(page + "Id"), [searchParams, page]);

  const itemRefs = useRef([]); // Use ref to track list items

  const handleSelect = (index) => {
    const idKey =
      page === "workbench"
        ? "reconcileId"
        : page === "activity"
          ? "interactionID"
          : page === "cases"
            ? "caseId"
            : `${page}Id`;
    const selectedId = data?.[index]?.[idKey];
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(page + "Id", selectedId);
    navigate(`?${newSearchParams.toString()}`, { replace: true });
    setSelectedIndex(index);
    const sCase = data.filter((item, i) => i === index);
    handleSelectedCase(sCase[0]);
  };

  const initialIndex = useMemo(() => {
    if (!data || data.length === 0) return -1;
    const idKey =
      page === "workbench"
        ? "reconcileId"
        : page === "activity"
          ? "interactionID"
          : page === "cases"
            ? "caseId"
            : `${page}Id`;
    if (specificId) {
      return data.findIndex((item) => item?.[idKey] === specificId);
    }
    return 0;
  }, [data, specificId, page]);

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (data && data.length > 0) {
      if (specificId) {
        const idKey =
          page === "workbench"
            ? "reconcileId"
            : page === "activity"
              ? "interactionID"
              : page === "cases"
                ? "caseId"
                : `${page}Id`;
        const newIndex = data.findIndex((item) => item[idKey] === specificId);
        setSelectedIndex(newIndex >= 0 ? newIndex : 0);
      } else {
        setSelectedIndex(0);
      }
    }
  }, [data, specificId, page]);

  useEffect(() => {
    if (data && data.length > 0 && selectedIndex >= 0 && onItemSelected) {
      onItemSelected(data[selectedIndex]);
    }
  }, [selectedIndex, data, onItemSelected]);

  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedIndex]);

  // Prevent scroll event from bubbling up
  const handleContainerScroll = (event) => {
    event.stopPropagation();
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    const apiUrl = `${BaseURL}/api/v1/timesheets/${localStorage.getItem(
      "userid"
    )}/1/${data?.timesheetId}/timesheet-reupload`;
    const dataToBeSent = {
      companyId: data?.companyId,
      timesheet: formData.file,
    };

    try {
      const response = await axios.post(apiUrl, dataToBeSent, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token_obj.accessToken}`
        },
      });


      handleModalClose();
    } catch (error) {
      console.error("Error uploading timesheet:", error);

      // Revert optimistic update in case of an error
      // setTsData((prevData) =>
      //   prevData.filter((item) => item.id !== optimisticData.id)
      // );
    }
  };

  const handleTriggerAi = async () => {
    setLoading(true);
    loading && toast.loading("Triggering AI", { position: "top-center" });
    try {
      let api;
      if (true) {
        api = `${BaseURL}/api/v1/timesheets/${timesheetId}/trigger-ai`;
      }
      const response = await axios.post(api, {}, Authorization_header());
      response && setLoading(false);
      if (!loading) {
        toast.dismiss();
        toast.success(response?.data?.message || "Ai triggered Successfully");
      }
    } catch (err) {
      console.error(JSON.stringify(err));
      err && setLoading(false);
      if (!loading) {
        toast.dismiss();
        toast.error("Error in Triggering AI");
      }
    }
  }

  return (
    <>
      {/* <Box sx={styles.containerBox} onScroll={handleContainerScroll}>
        {data?.map((item, index) => (
          <Box
            ref={(el) => (itemRefs.current[index] = el)}
            sx={styles.itemBox(selectedIndex === index)}
            key={index}
            onClick={() => handleSelect(index)}
          >
          </Box>
        ))}
      </Box> */}
      <Box sx={styles.flexBox}>
        <Box sx={styles.paddingLeftBox}>
          <Typography sx={styles.appleIncTypography}>
            <span style={styles.appleSpan}>{head1} -  </span>
            <span sx={{ ...styles.appleIncTypography, color: "#FD5707", mr: 8 }}>{head}</span>
          </Typography>
          {/* <Typography sx={styles.appleIncTypography}>{head}</Typography> */}
        </Box>
        <Box sx={styles.buttonGroup}>

          {uploadPermission && (
            <><Tooltip title="Reupload File">
              {/* <Button
                variant="contained"
                sx={styles.buttonStyle}
                onClick={openModal}
              >
                <FileUpload style={{ fontSize: "20px" }} />
              </Button> */}
            </Tooltip>
              <Button
                variant="contained"
                sx={styles.buttonStyle}
                onClick={() => {
                  handleTriggerAi();
                }}
              >
                Trigger AI
              </Button>
            </>
          )}
          <ModalForm
            open={isModalOpen}
            handleClose={handleModalClose}
            type={"reupload"}
            data={data}
            handleSubmit={handleFormSubmit}
          />
          {/* {downloadPermission && <GoDownload style={styles.goDownloadIcon} />} */}
        </Box>
      </Box>
    </>
  );
}

export default TimesheetInfoboxHeader;
