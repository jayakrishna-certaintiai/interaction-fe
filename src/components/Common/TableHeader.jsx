// import React, { useContext, useEffect, useState } from "react";
// import {
//   TableCell,
//   TableHead,
//   TableRow,
//   IconButton,
//   Box,
// } from "@mui/material";
// import { ClientContext } from "../../context/ClientContext";
// import { ProjectContext } from "../../context/ProjectContext";
// import { TimesheetContext } from "../../context/TimesheetContext";
// import { CaseContext } from "../../context/CaseContext";
// import StraightIcon from '@mui/icons-material/Straight';
// import { ContactContext } from "../../context/ContactContext";
// import { ProjectTeammemberContext } from "../../context/ProjectTeammemberContext";
// import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
// import ContactsTableBody from "../Contacts/ContactsTableBody";
// import usePinnedData from "../CustomHooks/usePinnedData";
// import { FilterListContext } from "../../context/FiltersListContext";
// import { EmployeeContext } from "../../context/EmployeeContext";

// const headerCellStyle = {
//   fontSize: "13px",
//   borderRight: "1px solid #ddd",
//   borderLeft: "1px solid #ddd",
//   whiteSpace: "nowrap",
//   py: 0.8,
//   textAlign: "left",
//   position: "sticky",
//   top: 0,
//   zIndex: 10,
//   backgroundColor: "#ececec",
//   cursor: "pointer",
// };

// const headerRowStyle = {
//   backgroundColor: "rgba(64, 64, 64, 0.1)",
//   position: "sticky",
//   top: 0,
//   zIndex: 10,
//   borderLeft: "1px solid #E4E4E4",
// };

// const activeColor = "#404040";
// const inactiveColor = "#ccc";
// function CustomToolbar({ onColumnsClick }) {
//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 1 }}>
//       <GridToolbarColumnsButton onClick={onColumnsClick} />
//     </Box>
//   );
// }

// function TableHeader({ tableData, tableData2, page, data }) {
//   const [sortField, setSortField] = useState(null);
//   const [sortOrder, setSortOrder] = useState(null);
//   const { getAccountsSortParams } = useContext(ClientContext);
//   const { getProjectsSortParams, fetchProjects } = useContext(ProjectContext);
//   const { getTimeSheetsortParams, selectedTimeSheetId } = useContext(TimesheetContext);
//   const { getCaseSortParams, contactData } = useContext(CaseContext);
//   const { getEmployeeSortParams } = useContext(ContactContext);
//   const { getProjectTeamSortParams } = useContext(ProjectTeammemberContext);
//   const { pinnedObject } = usePinnedData();
//   const { clientList, fetchUserDetails } = useContext(FilterListContext);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(20);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [filteredRows, setFilteredRows] = useState([]);
//   const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
//   const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
//   const { fetchEmployeesSheets, employeesSheets } = useContext(EmployeeContext);
//   // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
//   const [filterClicked, setFilterClicked] = useState(false);
//   const [filterPanelOpen, setFilterPanelOpen] = useState(false);

//   useEffect(() => {
//     if (page === "accounts") getAccountsSortParams({ sortField, sortOrder });
//     if (page === "projects") getProjectsSortParams({ sortField, sortOrder });
//     if (page === "timeSheet") getTimeSheetsortParams({ sortField, sortOrder });
//     if (page === "cases") getCaseSortParams({ sortField, sortOrder });
//     if (page === "contacts") getEmployeeSortParams({ sortField, sortOrder });
//     if (page === "projectTeam") getProjectTeamSortParams({ sortField, sortOrder });
//     if (page === "project_details") {
//       const options = {};
//       if (selectedTimeSheetId) {
//         options.timesheetId = selectedTimeSheetId;
//         options.sortField = sortField;
//         options.sortOrder = sortOrder;
//       }
//       fetchProjects(options);
//     }
//   }, [sortField, sortOrder, page]);
//   let currentData = filteredRows?.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   let currentSheetData = employeesSheets?.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   useEffect(() => {
//     if (contactData) {
//       const filteredData = contactData?.filter(
//         (task) => {

//           return task?.firstName?.toLowerCase()?.includes(search?.toLowerCase()) ||
//             task?.lastName?.toLowerCase()?.includes(search?.toLowerCase()) ||
//             // task.employeeTitle.toLowerCase().includes(search.toLowerCase()) ||
//             task?.email?.toLowerCase()?.includes(search?.toLowerCase()) ||
//             task?.companyIds?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
//             task?.companyName?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
//             task?.employeeTitle?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
//             task?.employeeId?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
//             task?.employementType?.toString()?.toLowerCase()?.includes(search.toLowerCase())
//         }
//       );
//       setFilteredRows(filteredData);
//       setCurrentPage(1);
//     }
//   }, [contactData, search]);
//   // Ensuring currentData always has 20 items
//   const placeholderRow = {};
//   while (currentData?.length < itemsPerPage) {
//     currentData.push(placeholderRow);
//   }
//   const handleColumnClick = (column) => {
//     if (sortField === column) {
//       if (sortOrder === "asc") {
//         setSortOrder("dsc");
//       } else if (sortOrder === "dsc") {
//         setSortOrder(null);
//         setSortField(null);
//       } else {
//         setSortOrder("asc");
//       }
//     } else {
//       setSortField(column);
//       setSortOrder("asc");
//     }
//   };

//   const columns = tableData?.columns?.map((column, index) => ({
//     field: column,
//     headerName: column,
//     width: 250,  // Set appropriate width
//     sortable: true,
//     onClick: () => handleColumnClick(column),
//   }));

//   const renderSortIcons = (column) => {
//     let upColor = activeColor;
//     let downColor = activeColor;

//     // Check if the current column is being sorted
//     if (sortField === column) {
//       if (sortOrder === "asc") {
//         downColor = "#FD5707";
//         upColor = inactiveColor;
//       } else if (sortOrder === "dsc") {
//         upColor = "#FD5707";
//         downColor = inactiveColor;
//       }
//     }

//     return (
//       <>
//         <StraightIcon
//           fontSize="small"
//           style={{ color: upColor, opacity: 0.6, marginRight: -5, fontSize: "17px" }}
//         />
//         <StraightIcon
//           fontSize="small"
//           style={{
//             color: downColor,
//             opacity: 0.6,
//             marginLeft: -5,
//             fontSize: "17px",
//             transform: "rotate(180deg)",
//           }}
//         />
//       </>
//     );
//   };

//   // Ensure that each row has a unique id
//   const rows = data?.map((item, index) => ({
//     id: item.id || index,
//     ...item,
//   }));
// 

//   return (
//     <>
//       <TableHead>
//         <TableRow sx={headerRowStyle}>
//           {/* <div style={{
//             ...headerCellStyle,
//             textAlign: "center", height: 250, width: '100%'
//           }}>
//             <DataGrid
//               columns={columns}
//               rows={rows || []}
//               hideFooter
//               loading={false}
//               slots={{
//                 toolbar: () => <CustomToolbar onColumnsClick={handleColumnClick} />,
//               }}
//               components={{
//                 NoRowsOverlay: () => <div />
//               }}
//               rowCount={data?.length || 0}
//               rowsPerPageOptions={[100]}
//               getRowId={(row) => row.id}
//             />
//           </div> */}
//           {tableData2?.columns?.map((column, index) => (
//             <TableCell
//               key={index}
//               sx={{
//                 ...headerCellStyle,
//                 textAlign: index === 0 ? "left" : "center",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//               onClick={() => handleColumnClick(column)}
//             >
//               {/* {column} */}

//               <IconButton size="small">
//                 {renderSortIcons(column)}
//               </IconButton>

//             </TableCell>
//           ))}
//           <div style={{
//             ...headerCellStyle,
//             textAlign: "center", height: 250, width: '100%'
//           }}>
//             <DataGrid
//               columns={columns}
//               rows={rows || []}
//               hideFooter
//               loading={false}
//               slots={{
//                 toolbar: () => <CustomToolbar onColumnsClick={handleColumnClick} />,
//               }}
//               components={{
//                 NoRowsOverlay: () => <div />
//               }}
//               rowCount={data?.length || 0}
//               rowsPerPageOptions={[100]}
//               getRowId={(row) => row.id}
//             />
//           </div>
//         </TableRow>
//       </TableHead>
//       <ContactsTableBody
//         data={currentData}
//         currentPage={currentPage}
//         itemsPerPage={itemsPerPage}
//       />
//     </>
//   );
// }

// export default TableHeader;





import React, { useContext, useEffect, useState } from "react";
import {
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { ClientContext } from "../../context/ClientContext";
import { ProjectContext } from "../../context/ProjectContext";
import { TimesheetContext } from "../../context/TimesheetContext";
import { CaseContext } from "../../context/CaseContext";
import StraightIcon from '@mui/icons-material/Straight';
import { ContactContext } from "../../context/ContactContext";
import { ProjectTeammemberContext } from "../../context/ProjectTeammemberContext";

const headerCellStyle = {
  fontSize: "13px",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  whiteSpace: "nowrap",
  py: 0.8,
  textAlign: "left",
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: "#ececec",
  cursor: "pointer",
};

const headerRowStyle = {
  backgroundColor: "rgba(64, 64, 64, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: 10,
  borderLeft: "1px solid #E4E4E4",
};

const activeColor = "#404040";
const inactiveColor = "#ccc";

function TableHeader({ tableData, tableData2, page }) {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const { getAccountsSortParams } = useContext(ClientContext);
  const { getProjectsSortParams, fetchProjects } = useContext(ProjectContext);
  const { getTimeSheetsortParams, selectedTimeSheetId } = useContext(TimesheetContext);
  const { getCaseSortParams } = useContext(CaseContext);
  const { getEmployeeSortParams } = useContext(ContactContext);
  const { getProjectTeamSortParams } = useContext(ProjectTeammemberContext);


  useEffect(() => {
    if (page === "accounts") getAccountsSortParams({ sortField, sortOrder });
    if (page === "projects") getProjectsSortParams({ sortField, sortOrder });
    if (page === "timeSheet") getTimeSheetsortParams({ sortField, sortOrder });
    if (page === "cases") getCaseSortParams({ sortField, sortOrder });
    if (page === "contacts") getEmployeeSortParams({ sortField, sortOrder });
    if (page === "projectTeam") getProjectTeamSortParams({ sortField, sortOrder });
    if (page === "project_details") {
      const options = {};
      if (selectedTimeSheetId) {
        options.timesheetId = selectedTimeSheetId;
        options.sortField = sortField;
        options.sortOrder = sortOrder;
      }
      fetchProjects(options);
    }
  }, [sortField, sortOrder, page]);

  const handleColumnClick = (column) => {
    if (sortField === column) {
      if (sortOrder === "asc") {
        setSortOrder("dsc");
      } else if (sortOrder === "dsc") {
        setSortOrder(null);
        setSortField(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortField(column);
      setSortOrder("asc");
    }
  };

  const renderSortIcons = (column, index) => {

    {/* hide sort icon in timesheet download field */ }
    // if (page === "timeSheet" && index === 0) {
    //   return null;
    // }
    let upColor = activeColor;
    let downColor = activeColor;

    // Check if the current column is being sorted
    if (sortField === column) {
      if (sortOrder === "asc") {
        downColor = "#FD5707";
        upColor = inactiveColor;
      } else if (sortOrder === "dsc") {
        upColor = "#FD5707";
        downColor = inactiveColor;
      }
    }

    return (
      <>
        <StraightIcon
          fontSize="small"
          style={{ color: upColor, opacity: 0.6, marginRight: -5, fontSize: "17px" }}
        />
        <StraightIcon
          fontSize="small"
          style={{
            color: downColor,
            opacity: 0.6,
            marginLeft: -5,
            fontSize: "17px",
            transform: "rotate(180deg)",
          }}
        />
      </>
    );
  };



  return (
    <TableHead>
      <TableRow sx={headerRowStyle}>
        {tableData?.columns?.map((column, index) => (
          <TableCell
            key={index}
            sx={{
              ...headerCellStyle,
              textAlign: index === 0 ? "left" : "center",
            }}
            onClick={() => handleColumnClick(column)}
          >
            {column}
            {/* hide sort icon in timesheet download field */}
            {/* {page !== "timeSheet" || index !== 0 ? (
              <IconButton size="small">
                {renderSortIcons(column, index)}
              </IconButton>
            ) : null} */}
            <IconButton size="small">
              {renderSortIcons(column, index)}
            </IconButton>
          </TableCell>
        ))}
        {tableData2?.columns?.map((column, index) => (
          <TableCell
            key={index}
            sx={{
              ...headerCellStyle,
              textAlign: index === 0 ? "left" : "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onClick={() => handleColumnClick(column)}
          >
            {column}

            <IconButton size="small">
              {renderSortIcons(column)}
            </IconButton>

          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default TableHeader;



