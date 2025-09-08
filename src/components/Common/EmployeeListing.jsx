import { Paper, Table, TableContainer } from '@mui/material'
import React, { useState } from 'react'
import TableHeader from './TableHeader'
import EmployeeTableBody from './EmployeeTablebody';

const tableData = {
    columns: ["Sheet ID", "Sheet Name", "Account", "Related To", "Uploaded By", "Uploaded On", "Status", "Note"],
    rows: [
        {
            sheetID: "SH_0001",
            sheetName: "Employees Sheet",
            relatedTo: "Employees",
            UploadedBy: "Manisha",
            UploadedOn: "19/08/2024 1:06:04",
            Status: "Uploaded",
            Note: "Uploaded successfully"
        },
        {
            sheetID: "SH_0002",
            sheetName: "infotech_Sheet",
            relatedTo: "Wages",
            UploadedBy: "Manisha",
            UploadedOn: "12/08/2024 1:06:04",
            Status: "Uploaded",
            Note: "Uploaded successfully"
        },
    ],
};

const styles = {
    paper: {
        display: "flex",
        width: "98%",
        mx: "auto",
        mt: 2,
        flexDirection: "column",
        borderRadius: "20px",
        mb: 3,
        boxShadow: "0px 3px 6px #0000001F",
    }
}

const EmployeeListing = ({ page, employeesSheets }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filteredRows, setFilteredRows] = useState([]);
    let currentData = filteredRows?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const placeholderRow = {};
    while (currentData?.length < itemsPerPage) {
        currentData.push(placeholderRow);
    }

    return (
        <>
            <Paper sx={styles.paper}>
                <TableContainer>
                  
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHeader tableData={tableData} page={page} />
                        <EmployeeTableBody data={employeesSheets} currentPage={currentPage} itemsPerPage={itemsPerPage} page={page} />
                    </Table>
                </TableContainer>
            </Paper>
        </>
    )
}

export default EmployeeListing