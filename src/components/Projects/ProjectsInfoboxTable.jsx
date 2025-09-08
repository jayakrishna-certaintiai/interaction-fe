import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CompanyTableCell from "../Common/CompanyTableCell";
import { Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BaseURL } from "../../constants/Baseurl";
import { PortfolioContext } from "../../context/PortfolioContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Authorization_header } from "../../utils/helper/Constant";
import { CaseContext } from "../../context/CaseContext";
const styles = {
  boxStyle: {
    p: 1,
    borderTop: "1px solid #E4E4E4",
  },
  tableStyle: {
    minWidth: 650,
  },
  tableHeadCell: {
    border: "none",
    paddingBottom: 0,
    fontWeight: 600,
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  tableRow: {
    "&:last-child td, &:last-child th": { border: 0 },
  },
  tableCell: {
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  iconStyle: {
    backgroundColor: "#FD5707",
    borderRadius: "50%",
    color: "white",
    fontSize: "13px",
    ml: 1,
  },
  cellLinkStyle: {
    fontSize: "13px",
    whiteSpace: "nowrap",
    color: "#00A398",
    textDecoration: "underline",
    cursor: "pointer",
  },
  flexBox: {
    display: "flex",
    justifyContent: "space-between",
    overflowX: "auto",
    mt: "-30px",
    ml: "20px",
    mb: 1
  },
  paddingLeftBox: {
    p: -6,
    pt: -10
  },
  companyTypography: {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    textTransform: "capitalize",
    fontWeight: 600,
  },
  appleSpan: {
    fontSize: "17px",
    color: "#00A398",
  },
  appleIncTypography: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  lanIcon: {
    borderRadius: "50%",
    border: "1px solid black",
    padding: "5px",
    fontSize: "30px",
    cursor: "pointer",
    ml: 2,
    "&:hover": {
      color: "#FD5707",
      border: "1px solid #FD5707",
    },
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    mt: -3,
    p: 1,
  },
  buttonStyle: {
    textTransform: "capitalize",
    borderRadius: "20px",
    backgroundColor: "#00A398",
    mr: 2,
    "&:hover": {
      backgroundColor: "#00A398",
    },
    whiteSpace: "nowrap",
    mt: 2.1
  },
  goDownloadIcon: {
    color: "white",
    borderRadius: "50%",
    backgroundColor: "#00A398",
    fontSize: "33px",
    padding: "5px",
    marginRight: "16px",
  },
  optionalIdentifierStyle: {
    color: "#FD5707",
    marginRight: "5px",
  },

  itemBox: (isSelected) => ({
    // display: "flex",
    // flexDirection: "column",
    // p: 1,
    // backgroundColor: isSelected ? "rgba(0, 163, 152, 0.1)" : "white",
    // borderBottom: "1px solid #E4E4E4",
    // cursor: "pointer",
  }),
  detailBox: {
    justifyContent: "space-between",
    display: "flex",
  },
  detailText: {
    fontSize: "13px",
  },
};

function ProjectsInfoboxTable({ info, onSelectedChange,
  page,
  projectId,
  comId,
  fetchCompanyContacts,
  data, onItemSelected }) {

  const formatCurrency = (amount, locale = 'en-US', currencySymbol = 'USD') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencySymbol,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [interactionModal, setInteractionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleSelectedCase } = React.useContext(CaseContext);
  const specificId = useMemo(() => searchParams.get(page + "Id"), [searchParams, page]);

  const itemRefs = useRef([]);

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

  // useEffect(() => {
  //     if (data && data.length > 0 && selectedIndex >= 0 && onItemSelected) {
  //         onItemSelected(data[selectedIndex]);
  //     }
  // }, [selectedIndex, data, onItemSelected]);

  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedIndex]);

  const handleContainerScroll = (event) => {
    event.stopPropagation();
  };
  const { portfolioFilters, setPortfolioFilters, setIsPortfolioFilterApplied } =
    useContext(PortfolioContext);

  // const handleModalClose = () => {
  //   setModalOpen(false);
  // };

  // const handleNoteModalClose = () => {
  //   setNoteModal(false);
  // };

  // const handleInteractionModalClose = () => {
  //   setInteractionModal(false);
  // };

  const handleTriggerAi = async () => {
    try {
      setLoading(true);
      loading && toast.loading("Triggering Ai")
      let api;
      if (page === "projects") {
        api = `${BaseURL}/api/v1/projects/${projectId}/trigger-ai`;

      } else if (page === "companies") {

        api = `${BaseURL}/api/v1/company/${comId}/trigger-ai`;

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

  const addContact = async (contactInfo) => {
    const apiUrl = `${BaseURL}/api/v1/contacts/${localStorage.getItem(
      "userid"
    )}/${comId}/create-contact`;

    try {
      const response = await axios.post(apiUrl, contactInfo, Authorization_header());
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // const handleAddContact = async (contactInfo) => {
  //   toast
  //     .promise(addContact(contactInfo), {
  //       loading: "Adding New Employee...",
  //       success: (data) => data?.message || "Employee added successfully",
  //       error: (error) =>
  //         error.response?.data?.error?.message || "Failed to add Employee.",
  //     })
  //     .then(() => {
  //       fetchCompanyContacts();
  //     })
  //     .catch((error) => {
  //       console.error("Employee addition failed:", error);
  //     });
  // };

  useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (data && data?.length > 0 && selectedIndex >= 0 && onItemSelected) {
      onItemSelected(data[selectedIndex]);
    }
  }, [selectedIndex, onItemSelected, data]);
  return (
    <>

      <Box sx={styles.containerBox} onScroll={handleContainerScroll}>
        {data?.map((item, index) => (
          <Box
            ref={(el) => (itemRefs.current[index] = el)}
            sx={styles.itemBox(selectedIndex === index)}
            key={index}
            onClick={() => handleSelect(index)}
          >
          </Box>
        ))}
      </Box>
      <Box sx={styles.flexBox}>
        <Box sx={styles.paddingLeftBox}>
          <Typography sx={{ ...styles.appleIncTypography, color: "#FD5707", fontSize: "20px", }}>
            <span style={styles.appleSpan}>{`${info?.projectCode?.toLocaleString('en-US') || ""}`} <ChevronRightIcon sx={{ fontSize: "22px", mb: -0.5 }} /> </span>
            {projectId && (
              <span style={{ ...styles.optionalIdentifierStyle }}>{projectId} - </span>
            )}
            {`${info?.projectName?.toLocaleString('en-US') || ""}`}
          </Typography>
        </Box>
      </Box >
      <Box sx={styles.boxStyle}>
        <TableContainer>
          <Table sx={styles.tableStyle} aria-label="simple table">
            <TableHead>
              <TableRow>
                {/* <TableCell sx={styles.tableHeadCell}>QRE Potential(%)</TableCell> */}
                <TableCell sx={styles.tableHeadCell}>Accounts</TableCell>
                <TableCell sx={styles.tableHeadCell}>QRE (%) - Final</TableCell>
                {/* <TableCell sx={styles.tableHeadCell}>Total hours</TableCell> */}
                <TableCell sx={styles.tableHeadCell}>Total Cost</TableCell>
                <TableCell sx={styles.tableHeadCell}>QRE Expense</TableCell>
                <TableCell sx={styles.tableHeadCell}>Survey Status</TableCell>
                <TableCell sx={styles.tableHeadCell}>Interaction Status</TableCell>
                <TableCell sx={styles.tableHeadCell}>SPOC Name</TableCell>
                <TableCell sx={styles.tableHeadCell}>Fiscal Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={styles.tableRow}>
                <CompanyTableCell id={info?.companyId} name={info?.companyName} />
                {/* <TableCell sx={{ ...styles.tableCell, color: "#FD5707" }}>
                  {info?.rndPotential?.toFixed(2).toLocaleString('en-US') || ""}
                </TableCell> */}
                <TableCell sx={{ ...styles.tableCell, color: "#FD5707" }}>
                  {info?.rndFinal}
                </TableCell>
                {/* <TableCell sx={{ ...styles.tableCell, color: "#FD5707" }}>
                  {typeof info?.rndFinal === "number" && !isNaN(info?.rndFinal)
                    ? info.rndFinal.toFixed(2).toLocaleString('en-US')
                    : ""}
                </TableCell> */}
                {/* <TableCell sx={styles.tableCell}>
                  {`${info?.totalEfforts?.toLocaleString('en-US') || ""}`}
                </TableCell> */}
                <TableCell sx={{ ...styles.tableCell, color: "#FD5707" }}>
                  {info?.s_total_project_cost !== undefined ? formatCurrency(info?.s_total_project_cost, 'en-US') : ""}
                </TableCell>
                <TableCell sx={{ ...styles.tableCell, color: "#FD5707" }}>
                  {info?.s_qre_cost !== undefined ? formatCurrency(info?.s_qre_cost, 'en-US') : ""}
                </TableCell>
                {/* <TableCell sx={styles.tableCell}>
                  {`${info?.s_total_hours?.toLocaleString('en-US') || ""}`}
                </TableCell>
                <TableCell sx={{ ...styles.tableCell, color: "#FD5707" }}>
                  {info?.s_total_project_cost !== undefined ? formatCurrency(info?.s_total_project_cost, 'en-US') : ""}
                </TableCell>
                <TableCell sx={{ ...styles.tableCell, color: "#FD5707" }}>
                  {info?.s_qre_cost !== undefined ? formatCurrency(info?.s_qre_cost, 'en-US') : ""}
                </TableCell> */}
                <TableCell sx={styles.tableCell}>
                  {info?.surveyStatus
                    ? info.surveyStatus
                      .toLowerCase()
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                    : ""}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.s_interaction_status || ""}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.spocName || ""}
                </TableCell>
                <TableCell sx={{ ...styles.tableCell, color: "#FD5707" }}>
                  {info?.fiscalYear ? `FY ${+(info?.fiscalYear) - 1}-${info?.fiscalYear.slice(-2)}` : ""}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default ProjectsInfoboxTable;