import { CircularProgress, Table, TableContainer, Box, Drawer, Badge } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { ClientContext } from "../../context/ClientContext";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import CustomPagination from "../Common/CustomPagination";
import TableHeader from "../Common/TableHeader";
import TableIntro from "../Common/TableIntro";
import usePinnedData from "../CustomHooks/usePinnedData";
import CompanyModal from "./CompanyModal";
import CompanyTableBody from "./CompanyTableBody";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import { FilterListContext } from "../../context/FiltersListContext";
import { Authorization_header, token_obj } from "../../utils/helper/Constant";
import { HiFilter } from "react-icons/hi";
import AccountFilters from "./AccountFilters";

const tableData = {
  columns: [
    "Account Name",
    "Account ID",
    "Total Projects",
    "Billing Country",
    "Auto Send Interaction",
    "Total Expense",
    "Total QRE Expense",
    "Primary Contact",
    "Phone",
    "Email Address",
  ],
  rows: [
    {
      id: 1,
      companyName: "Apple Inc.",
      projects: 12,
      companySite: "California",
      billingState: "California",
      type: "Parent",
      spoc: "Adam Smith",
      phone: "(336) 222-7000",
      mail: "adam.smith@apple.com",
    },
    {
      id: 2,
      companyName: "Burlington Textiles Corp of America",
      projects: 8,
      companySite: "Texas",
      billingState: "Texas",
      type: "Direct",
      spoc: "Trisha Col",
      phone: "(632) 782-2619",
      mail: "col.trisha@btca.com",
    },
  ],
};
const styleConstants = {
  filterDownloadStyle: {
    color: "white",
    borderRadius: "50%",
    backgroundColor: "#00A398",
    fontSize: "28px",
    padding: "5px",
    marginRight: "16px",
    cursor: "pointer",
    // opacity: opacityValue,
  },
  tableContainerStyle: {
    borderLeft: "1px solid #E4E4E4",
    // backgroundColor: `rgba(255, 255, 255, ${opacityValue})`, 
  },
};

function CompanyTableStack({
  data,
  latestUpdateTime,
  getData,
  onApplyFilters,
  appliedFilters,
  loading,
  page,
  documentType = "",
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const { clientFilters, setClientFilters, triggerClientClearFilters, setIsClientFilterApplied } = useContext(ClientContext);
  const [filterClicked, setFilterClicked] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const { clientList } = useContext(FilterListContext);
  const { pinnedObject } = usePinnedData();
  const [pinStates, setPinStates] = useState({
    "All Accounts": false,
    "Recently Viewed": false,
  });
  const { fetchUserDetails, fetchClientList } = useContext(FilterListContext);

  const clearFilters = () => {
    if (page === "company") {
      setClientFilters({
        type: "",
        projectsCount: [0, null],
        billingCountry: [],
        totalProjectCost: [0, null],
        totalRnDCost: [0, null],
      });
      onApplyFilters({});
      triggerClientClearFilters();
      setIsClientFilterApplied(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);

  let clientOptions;
  useEffect(() => {
    const shouldFetchWithFiltersClient =
      clientFilters.billingCountry?.length > 0 ||
      clientFilters.projectsCount?.length > 0 ||
      clientFilters.totalProjectCost?.length > 0 ||
      clientFilters.totalRnDCost?.length > 0;
    if (shouldFetchWithFiltersClient) {
      clientOptions = {
        ...(clientFilters.billingCountry && {
          billingCountry: clientFilters.billingCountry,
        }),
        ...(clientFilters.projectsCount && {
          minProjectsCount: clientFilters.projectsCount[0],
        }),
        ...(clientFilters.projectsCount && {
          maxProjectsCount: clientFilters.projectsCount[1],
        }),
        ...(clientFilters.totalProjectCost && {
          minTotalExpense: clientFilters.totalProjectCost[0],
        }),
        ...(clientFilters.totalProjectCost && {
          maxTotalExpense: clientFilters.totalProjectCost[1],
        }),
        ...(clientFilters.totalRnDCost && {
          minTotalRnDExpense: clientFilters.totalRnDCost[0],
        }),
        ...(clientFilters.totalRnDCost && {
          maxTotalRnDExpense: clientFilters.totalRnDCost[1],
        }),
      };
    }
  }, [clientFilters]);

  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeItemsPerPage = (items) => {
    setItemsPerPage(items);
  };

  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const currentData = filteredRows?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  while (currentData?.length < itemsPerPage) {
    currentData?.push({});
  }

  const handleUploadClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSearch = (input) => {
    setSearch(input);
  };

  useEffect(() => {
    if (data) {
      const filteredData = data?.filter(
        (task) => {

          const id = task.companyIdentifier;
          return task?.companyName?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.companyId?.toLowerCase()?.includes(search?.toLowerCase()) ||
            (task?.companyIdentifier + "")?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.companyType?.toLowerCase()?.includes(search?.toLowerCase()) ||
            (task?.projectsCount + "")?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.primaryContact
              ?.toLowerCase()
              ?.includes(search?.toLowerCase()) ||
            (task?.phone + "")?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.billingCity?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.email?.toLowerCase()?.includes(search?.toLowerCase()) ||
            (task?.totalProjectCost + "")?.toLowerCase()?.includes((search)?.toLowerCase()) ||
            (task?.totalRnDCost + "")?.toLowerCase()?.includes((search)?.toLowerCase())
        }
      );
      setFilteredRows(filteredData);
      setCurrentPage(1);
    }
  }, [data, search]);

  const handleSelectedHeaderItem = (item) => {
    // setCurrentState(item);
  };

  useEffect(() => {
    fetchClientList();
    // setCurrentState(
    //   pinnedObject?.TIMESHEETS === "RV" ? "Recently Viewed" : "All Timesheets"
    // );
  }, [Authorization_header]);

  useEffect(() => {
    const updatedPinStates = {
      "All Accounts": (!pinnedObject || !pinnedObject.CLNT || pinnedObject.CLNT === "ALL"),
      "Recently Viewed": pinnedObject.CLNT === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.CLNT]);

  const togglePinState = (selectedHeading) => {
    setPinStates((prevStates) => {
      const resetStates = Object.keys(prevStates).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      const newState = {
        ...resetStates,
        [selectedHeading]: !prevStates[selectedHeading],
      };

      const allFalse = !newState["All Accounts"] && !newState["Recently Viewed"];
      if (allFalse) {
        newState["All Accounts"] = true;
      }

      return newState;
    });
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      CLNT: newState,
    };

    const pinString = Object.entries(newPinnedObject)
      .map(([key, value]) => `${key}:${value}`)
      .join("|");

    const config = {
      method: "put",
      url: `${BaseURL}/api/v1/users/${localStorage.getItem(
        "userid"
      )}/edit-user`,
      headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token_obj.accessToken}` },
      data: JSON.stringify({ pin: pinString }),
    };

    try {
      await axios.request(config);
      fetchUserDetails();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const newState = Object.keys(pinStates).find(
      (key) => pinStates[key] === true
    );

    if (newState) {
      const newStateValue = newState === "All Accounts" ? "ALL" : "RV";

      updatePinState(newStateValue)
        .then(() => {
        })
        .catch((error) => {
          console.error("Failed to update pin state:", error);
        });
    }
  }, [pinStates]);

  const handleFilterClick = () => {
    setFilterClicked(!filterClicked);
    setFilterPanelOpen(!filterPanelOpen);
    setFilterPanelOpen(!filterPanelOpen);
  };

  const handleFilterPanelClose = () => {
    setFilterPanelOpen(false);
    setTimeout(() => {
      setFilterPanelOpen(false);
      setFilterClicked(false);
    }, 0);
  };

  const handleFilterClose = () => {
    setFilterPanelOpen(false);
  };

  const countActiveFilters = (sendInteractions) => {
    let count = 0;

    if (clientFilters?.company?.length > 0 && clientFilters.company[0] !== "ALL") count += 1;
    if (clientFilters?.sendInteractions?.length > 0) count += 1;
    if (clientFilters?.billingCountry?.length > 0) count += 1;
    if (clientFilters?.phones?.some(phone => phone !== "")) count += 1;
    if (clientFilters?.primaryContacts?.some(contact => contact !== "")) count += 1;
    if (clientFilters?.projectsCount?.some(count => count > 0)) count += 1;
    if (clientFilters?.totalProjectCost?.some(cost => cost > 0)) count += 1;
    if (clientFilters?.totalRnDCost?.some(cost => cost > 0)) count += 1;
    if (clientFilters?.emails?.some(email => email !== "")) count += 1;
    if (sendInteractions === 1) {
      count += 1;
    }

    return count;
  };
  return (
    <>
      {filterPanelOpen && <div style={styleConstants.overlay} />}

      <Box
        sx={{
          opacity: filterPanelOpen ? 15 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <TableIntro
          heading={(!pinnedObject || !pinnedObject?.CLNT || pinnedObject?.CLNT?.toUpperCase() === "ALL") ? "All Accounts" : "Recently Viewed"}
          btnName={"New Account"}
          page={"company"}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredRows?.length || 0}
          onUploadClick={handleUploadClick}
          onSearch={handleSearch}
          latestUpdateTime={latestUpdateTime}
          items={["All Accounts", "Recently Viewed"]}
          onApplyFilters={onApplyFilters}
          appliedFilters={appliedFilters}
          createPermission={useHasAccessToFeature("F005", "P000000007")}
          searchPermission={useHasAccessToFeature("F005", "P000000009")}
          onSelectedItem={handleSelectedHeaderItem}
        />
        <CompanyModal
          open={modalOpen}
          handleClose={handleModalClose}
          getData={getData}
        />
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          changePage={handleChangePage}
          changeItemsPerPage={handleChangeItemsPerPage}
        />
        <Box sx={{ display: "flex", pt: 0, pb: page === "activity" ? -1 : 0 }}>
          <Box sx={{ marginLeft: "9px", marginTop: "-120px", display: "flex", alignItems: "center" }}>
            {!(page === "alerts") && (
              <Badge
                badgeContent={countActiveFilters()}
                color="error"
                overlap="circular"
                sx={{
                  zIndex: 2,
                  marginRight: "0px",
                  '& .MuiBadge-badge': {
                    minWidth: '10px',
                    height: '16px',
                    fontSize: '10px',
                    paddingLeft: '5',
                    transform: 'translate(25%, -25%)',
                    backgroundColor: '#FD5707',
                  },
                }}
              >
                <HiFilter
                  style={styleConstants.filterDownloadStyle}
                  onClick={handleFilterClick}
                />
              </Badge>
            )}
          </Box>
          <Drawer
            anchor="left"
            open={filterPanelOpen}
            onClose={handleFilterPanelClose}
            sx={{
              width: '300px',
              flexShrink: 0,
            }}
            variant="persistent"
          >
            {/* <AccountFilters /> */}
            {filterPanelOpen && (
              <AccountFilters
                handleClose={handleFilterPanelClose}
                open={filterPanelOpen}
                page={page}
                documentType={documentType}
                onApplyFilters={onApplyFilters}
                style={{ position: 'absolute', left: 0 }}
              />
            )}
          </Drawer>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: filterPanelOpen ? '300px' : '0',
            mt: "-1px"
          }}
        >
          <TableContainer
            sx={{
              maxHeight: "82vh",
              overflowY: "auto",
              borderTopLeftRadius: "20px",
            }}>
            <Table sx={{ minWidth: 60 }} aria-label="simple table">
              <TableHeader tableData={tableData} page="accounts" />
              {!loading && <CompanyTableBody
                filledRows={currentData}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />}
            </Table>
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "50px",
                  minHeight: "380px",
                }}
              >
                <CircularProgress sx={{ color: "#00A398" }} />
              </div>
            )}
            {currentData.length === 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "50px",
                  minHeight: "380px",
                }}
              >
                No Account found.
              </div>
            )}
          </TableContainer>
        </Box>
      </Box>

    </>
  );
}

export default CompanyTableStack;