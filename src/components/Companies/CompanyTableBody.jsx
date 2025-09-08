import { TableBody, TableCell, TableRow, Tooltip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import React, { useState, useEffect } from 'react'
import { Switch } from '@mui/material';
import { Link } from "react-router-dom";
import CompanyTableCell from "../Common/CompanyTableCell";
import { Authorization_header } from "../../utils/helper/Constant";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import FilterAccountProjectCell from "../Common/FilterAccountProjectCell";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",  // Added
  textAlign: "left",
  fontSize: "13px",
  py: 0,
};

const cellStyle1 = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",  // Added
  textAlign: "center",
  fontSize: "13px",
  py: 0,
};

const currencyCellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",  // Added
  textAlign: "right",
  fontSize: "13px",
  py: 0,
  color: "#FD5707",
};

const cellLinkStyle = {
  ...cellStyle,
  textAlign: "right",
  color: "#00A398",
  borderLeft: "1px solid #ddd",  // Added
};

function CompanyTableBody({ filledRows }) {

  function toCamelCaseWithFirstLetterCapital(str) {
    const camelCaseStr = str
      .toLowerCase()
      .replace(/[-_ ]+(\w)/g, (_, c) => c.toUpperCase());
    return camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1);
  }

  const [toggleStates, setToggleStates] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [companyId, setCurrentCompanyId] = useState(null);
  const [currentToggleState, setCurrentToggleState] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [companyProjects, setCompanyProjects] = useState(null);
  const [arrayCompany, setArrayCompany] = useState([]);

  function formatCurrency(amount, locale, currency) {
    // Create a new Intl.NumberFormat instance
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    let formattedAmount = formatter.format(amount);
    formattedAmount = formattedAmount.replace(/[a-zA-Z]/g, '').trim();
    return formattedAmount;
  }

  useEffect(() => {
    const initialToggleStates = {};
    filledRows.forEach(row => {
      initialToggleStates[row?.companyId] = row?.autoSendInteractions === 1;

    });
    setToggleStates(initialToggleStates);
  }, [filledRows]);

  const handleToggleChange = (companyId) => async (event) => {
    const newState = event.target.checked;
    setCurrentCompanyId(companyId);
    setCurrentToggleState(newState);
    setDialogOpen(true);
    // setToggleStates((prevStates) => ({
    //   ...prevStates,
    //   [companyId]: newState,
    // }));
  };

  const handleDialogClose = async (confirm) => {
    setDialogOpen(false);
    if (confirm) {
      const querryData = {
        toggle: currentToggleState ? "1" : "0",
      };

      try {
        const res = await axios.post(
          `${BaseURL}/api/v1/company/${companyId}/${currentToggleState ? "1" : "0"}/toggle-auto-interactions`,
          querryData,
          Authorization_header()
        );
        setSnackbarMessage(`Automatic interactions turned ${currentToggleState ? "on" : "off"} successfully.`);
        setToggleStates((prevStates) => ({
          ...prevStates,
          [companyId]: currentToggleState,
        }));

      } catch (error) {
        console.error("Error sending interactions:", error);
        setSnackbarMessage("Error sending interactions. Please try again.");
      }
      finally {
        setSnackbarOpen(true);
      }
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <TableBody>
        {filledRows?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <CompanyTableCell id={row?.companyId} name={row?.companyName} sCase={row} />
            <TableCell sx={cellStyle}>{row?.companyIdentifier || ""}</TableCell>
            {/* <TableCell sx={{ ...cellLinkStyle, textAlign: "center" }}>
              <Link to={`/projects?companyId=${row.companyId}`}>
                <span
                  style={{ color: "#00A398", textDecoration: "underline", cursor: "pointer" }}
                >
                  {row?.projectsCount || ""}
                </span>
              </Link>
            </TableCell> */}
            <FilterAccountProjectCell id={row?.companyId ? [row?.companyId] : []} name={row?.projectsCount} sCase={row} />
            <TableCell sx={cellStyle}>{row?.billingCountry || ""}</TableCell>
            <TableCell sx={cellStyle1}>
              {row?.companyId && (
                <Tooltip>
                  <Switch
                    checked={toggleStates[row?.companyId] || false}
                    onChange={handleToggleChange(row?.companyId)}
                    color="warning"
                  />
                </Tooltip>
              )}
            </TableCell>
            <TableCell sx={currencyCellStyle}>
              {row?.totalProjectCost ? formatCurrency(row?.totalProjectCost, "en-US", row?.currency || "USD") : ""}
            </TableCell>
            <TableCell sx={currencyCellStyle}>
              {row?.totalRnDCost ? formatCurrency(row?.totalRnDCost, "en-US", row?.currency || "USD") : ""}
            </TableCell>
            <TableCell sx={cellStyle}>
              <Link to="/employees/info">{row?.primaryContact || ""}</Link>
            </TableCell>
            <TableCell sx={cellStyle}>{row?.phone || ""}</TableCell>
            <TableCell sx={cellStyle}>
              {row?.email || ""}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose(false)}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title"><h6>Confirm Action</h6></DialogTitle>
        <DialogContent>
          Do you want to turn {currentToggleState ? "on" : "off"} auto send interactions for all projects?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDialogClose(false)}
            variant="contained"
            sx={{ color: "white", backgroundColor: "#9F9F9F", "&:hover": { backgroundColor: "#9F9F9F" }, borderRadius: "20px", mr: 2 }}
          >
            No
          </Button>
          <Button
            onClick={() => handleDialogClose(true)}
            variant="contained"
            sx={{ color: "white", backgroundColor: "#00A398", "&:hover": { backgroundColor: "#00A398" }, borderRadius: "20px" }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CompanyTableBody