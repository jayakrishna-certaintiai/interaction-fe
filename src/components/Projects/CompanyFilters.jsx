import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import { ProjectContext } from "../../context/ProjectContext";
import AccYearSelector from "../FilterComponents/AccYearSelector";
import CompanySelector from "../FilterComponents/CompanySelector";
import ActionButton from "../FilterComponents/ActionButton";
import { ClientContext } from "../../context/ClientContext";
// import PortfolioSelector from "../FilterComponents/PortfolioSelector";

function CompanyFilters({ clientData, getCompanySortParams, companySort }) {
  const {
    projectFilterState,
    setProjectFilterState,
    clearProjectFilterTrigger,
  } = useContext(ProjectContext);
  const [company, setCompany] = useState(projectFilterState.company);
  const [project, setProject] = useState(projectFilterState.project);
  const [accYear, setAccYear] = useState(projectFilterState.accYear);
  const [portfolioList, setPortfolioList] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");


  useEffect(() => {
    getCompanySortParams({ sortField: sortField, sortOrder: sortOrder })
  }, [sortField, sortOrder])

  useEffect(() => {
    setProjectFilterState({
      ...projectFilterState,
      companyId: [
        clientData?.find((client) => client?.companyName === company)
          ?.companyId,
      ],
      company: company,
    });
  }, [company]);

  useEffect(() => {
    setProjectFilterState({
      ...projectFilterState,
      portfolioId: [
        portfolioList?.find((proj) => proj?.name === project)?.portfolioId,
      ],
      project: project,
    });
  }, [project]);

  useEffect(() => {
    setProjectFilterState({
      ...projectFilterState,
      accountingYear: accYear === "" ? [] : [accYear],
      accYear: accYear,
    });
  }, [accYear]);

  const fetchPortfolioList = async () => {
    let url;
    if (projectFilterState.companyId.length > 0) {
      url = `${BaseURL}/api/v1/portfolios/${localStorage.getItem(
        "userid"
      )}/get-portfolios?companyIds=${JSON.stringify(
        projectFilterState.companyId
      )}`;
    } else {
      url = `${BaseURL}/api/v1/portfolios/${localStorage.getItem(
        "userid"
      )}/get-portfolios`;
    }

    try {
      const response = await axios.get(url);
      setPortfolioList(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPortfolioList();
  }, [projectFilterState.companyId]);

  useEffect(() => {
    if (clearProjectFilterTrigger) {
      setCompany("");
      setProject("");
      setAccYear("");
      setSortField("");
      setSortOrder("");
      setProjectFilterState({
        companyId: [],
        portfolioId: [],
        accountingYear: [],
        accYear: "",
        company: "",
        project: "",
      });
    }
  }, [clearProjectFilterTrigger]);

  return (
    <Box>
      <CompanySelector
        clients={clientData}
        company={company}
        setCompany={setCompany}
      />

      <AccYearSelector accountingYear={accYear} setAccountingYear={setAccYear} />

      {/* Expandable Sorts Section */}
      <Accordion sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Sorts</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ overflowX: 'hidden' }}>
          {/* Sort Field Selector */}
          <FormControl
            fullWidth
            margin="normal"
          // variant="outlined" // To match existing MUI styling of similar dropdowns
          >
            <InputLabel>Sort Field</InputLabel>
            <Select
              sx={{ width: '100%' }}
              label="Sort Field"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              {/* <MenuItem value="fiscalYear">Fiscal Year</MenuItem>
              <MenuItem value="accountingYear">Accounting Year</MenuItem> */}
              <MenuItem value="totalExpense">Total Expense</MenuItem>
              <MenuItem value="rndExpense">QRE Expense</MenuItem>
              <MenuItem value="rndPotential">QRE Potential</MenuItem>
              <MenuItem value="totalProjects">Total Projects</MenuItem>
            </Select>
          </FormControl>

          {/* Sort Order Selector */}
          <FormControl
            fullWidth
            margin="normal"
            variant="outlined" // To match existing MUI styling of similar dropdowns
          >
            <InputLabel>Sort Order</InputLabel>
            <Select
              label="Sort Order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              sx={{ width: '100%' }}
            >
              <MenuItem value="ascending">Ascending</MenuItem>
              <MenuItem value="descending">Descending</MenuItem>
            </Select>
          </FormControl>
          {/* <Box sx={{display: "flex", justifyContent: "flex-end", padding: "0%"}}>
          <ActionButton 
              label="Apply"
              color="#00A398"
              onClick={companySort} />
        </Box> */}
        </AccordionDetails>

      </Accordion>
    </Box>
  );
}

export default CompanyFilters;

