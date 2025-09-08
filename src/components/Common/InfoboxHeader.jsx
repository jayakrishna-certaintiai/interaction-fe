import AddIcon from "@mui/icons-material/Add";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GoDownload } from "react-icons/go";
import { BaseURL } from "../../constants/Baseurl";
import { PortfolioContext } from "../../context/PortfolioContext";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import ContactModal from "../Contacts/ContactModal";
import AddNoteModal from "../Projects/AddNoteModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import NewInteractionModal from "./NewInteractionModal";
import { Authorization_header } from "../../utils/helper/Constant";
import { Add } from "@mui/icons-material";
// import NewInteractionModal from "../Activity/NewInteractionModal";

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "white",
          color: "black",
          border: "1px solid black",
        },
      },
    },
  },
});

const styles = {
  flexBox: {
    display: "flex",
    justifyContent: "space-between",
    overflowX: "auto",
  },
  paddingLeftBox: {
    p: 1,
  },
  companyTypography: {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    textTransform: "capitalize",
  },
  appleSpan: {
    fontSize: "17px",
    color: "#00A398",
  },
  appleSpan2: {
    fontSize: "20px",
    color: "#FD5707",
    padding: 10,
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
    mt: -0,
    p: 1,
    borderRadius: "20px"
  },
  buttonStyle: {
    textTransform: "capitalize",
    borderRadius: "10px",
    height: "2.2em",
    backgroundColor: "#00A398",
    mr: 2,
    "&:hover": {
      backgroundColor: "#00A398",
    },
    whiteSpace: "nowrap",
  },
  buttonStyle2: {
    width: "0.5em",
    height: "2.5em",
    fontSize: "12px",
    minWidth: "unset",
    // padding: "10px 20px !important",
    textTransform: "capitalize",
    borderRadius: "10px",
    backgroundColor: "#00A398",
    mr: 1.5,
    "&:hover": {
      backgroundColor: "#00A398",
    },
    whiteSpace: "nowrap",
  },
  addIconStyle: {
    fontSize: "25px",
    fontWeight: "bold",
    strokeWidth: "10px",
    color: "#FFFFFF",
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

function InfoboxHeader({
  head,
  head1,
  page,
  projectId,
  comId,
  fetchCompanyContacts,
  relatedTo,
  relationName,
  relationId,
  data, fieldMapping, onItemSelected
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [interactionModal, setInteractionModal] = useState(false);
  const [clientsData, setClientsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { portfolioFilters, setPortfolioFilters, setIsPortfolioFilterApplied } =
    useContext(PortfolioContext);
  const navigate = useNavigate();

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleNoteModalClose = () => {
    setNoteModal(false);
  };

  const handleInteractionModalClose = () => {
    setInteractionModal(false);
  };

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

  const fetchCompanyData = async () => {
    try {
      const response1 = await axios.get(
        `${BaseURL}/api/v1/company/${localStorage.getItem(
          "userid"
        )}/get-company-list`, Authorization_header()
      );
      setClientsData(response1?.data?.data?.list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [localStorage?.getItem("keys")]);

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

  const handleAddContact = async (contactInfo) => {
    toast
      .promise(addContact(contactInfo), {
        loading: "Adding New Employee...",
        success: (data) => data?.message || "Employee added successfully",
        error: (error) =>
          error.response?.data?.error?.message || "Failed to add Employee.",
      })
      .then(() => {
        fetchCompanyContacts();
      })
      .catch((error) => {
        console.error("Employee addition failed:", error);
      });
  };

  const RedirectToPortfolio = async (val) => {
    setPortfolioFilters({
      ...portfolioFilters,
      companyId: [val?.companyId],
      company: val?.companyName,
    });
    setIsPortfolioFilterApplied(true);
    navigate(`/portfolios`);
  };

  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");

  // Calculate the initial index with useMemo
  const initialIndex = useMemo(() => {
    return data?.findIndex((item) => item?.companyId === companyId) ?? 0;
  }, [data, companyId]);

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [initialIndex]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    if (data && data?.length > 0 && selectedIndex >= 0 && onItemSelected) {
      onItemSelected(data[selectedIndex]);
    }
  }, [selectedIndex, onItemSelected, data]);

  return (
    <>
      {data?.map((item, index) => (
        <Box
          sx={styles.itemBox(selectedIndex === index)}
          key={index}
          onClick={() => handleSelect(index)}
        >
          {/* <Typography sx={styles.companyTypography}>
            {item[fieldMapping.Field0] || ""}
          </Typography>
          <Box sx={styles.detailBox}>
            <span style={styles.detailText}>
              {item[fieldMapping.Field1] || ""}
            </span>
            <span style={styles.detailText}>
              {item[fieldMapping.Field2] || ""}
            </span>
          </Box> */}
        </Box>
      ))}
      <Box sx={styles.flexBox}>
        <Box sx={styles.paddingLeftBox}>
          <Typography sx={styles.companyTypography}>
            {/* {page === "companies" ? "Accounts" : page}{" "} */}
            {/* <ChevronRightIcon sx={{ fontSize: "17px" }} /> */}
            <span style={styles.appleSpan2}>
              {/* {projectId && (
                <span style={{ ...styles.optionalIdentifierStyle, }}>{projectId} - </span>
              )}
              {head1} */}
              {/* <ThemeProvider theme={theme}>

              {page === "companies" && (
                <Tooltip
                  title="Portfolio"
                  onClick={() => RedirectToPortfolio(data)}
                >
                  <BusinessCenterIcon sx={styles.lanIcon} />
                </Tooltip>
              )}
            </ThemeProvider> */}
            </span>
          </Typography>
          <Typography sx={{ ...styles.appleIncTypography, color: "#FD5707" }}>
            {head && (
              <span style={{ ...styles.optionalIdentifierStyle, }}>{head} - </span>
            )}
            {head1}
            {/* <ThemeProvider theme={theme}>

              {page === "companies" && (
                <Tooltip
                  title="Portfolio"
                  onClick={() => RedirectToPortfolio(data)}
                >
                  <BusinessCenterIcon sx={styles.lanIcon} />
                </Tooltip>
              )}
            </ThemeProvider> */}
          </Typography>
        </Box>
        <Box sx={styles.buttonGroup}>
          {/* {page === "projects" && (
            <Button variant="contained" sx={styles.buttonStyle}>
              Summary
            </Button>
          )} */}
          {useHasAccessToFeature("F033", "P000000007") &&
            page === "companies" && (
              <Tooltip title="New Employee">
                <Button
                  variant="contained"
                  sx={styles.buttonStyle2}
                  onClick={() => setModalOpen(!modalOpen)}
                >
                  <Add style={styles.addIconStyle} />
                </Button>
              </Tooltip>
            )}
          {useHasAccessToFeature("F033", "P000000007") &&
            (page === "companies" || page === "projects") && (
              <Button
                variant="contained"
                sx={styles.buttonStyle}
                onClick={() => {
                  handleTriggerAi();
                }}
              >
                Trigger AI
              </Button>
            )}
          <ContactModal
            open={modalOpen}
            handleClose={handleModalClose}
            onAddContact={handleAddContact}
            clients={clientsData}
          />
          {useHasAccessToFeature("F023", "P000000007") &&
            page === "reconciliations" && (
              <Button
                variant="contained"
                sx={styles.buttonStyle}
                onClick={() => setInteractionModal(!interactionModal)}
              >
                <AddIcon /> New Interaction
              </Button>
            )}
          <NewInteractionModal
            open={interactionModal}
            handleClose={handleInteractionModalClose}
            relatedTo={relatedTo}
            relationId={relationId}
            relationName={relationName}
          />
          {/* {downloadPermission && <GoDownload style={styles.goDownloadIcon} />} */}
        </Box>
        <Toaster />
      </Box>
    </>
  );
}

export default InfoboxHeader;
