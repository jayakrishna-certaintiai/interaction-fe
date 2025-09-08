import { Paper, Table, TableContainer, useScrollTrigger } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TableHeader from './TableHeader'
import TimesheetTableBody from '../Timesheets/TimesheetTableBody';
import CommonTableBody from './CommonTableBody';
import CustomPagination from './CustomPagination';
import TableHeaderNonSort from './TableHeaderNonSort';

const tableData = {
    columns: ["Sheet ID", "Sheet Name", "Account Name", " Sheet Type", "Uploaded By", "Uploaded On", "Status", "Acceptance"],
    rows: [
        {
            sheetID: "SH_0001",
            sheetName: "Project Sheet",
            UploadedBy: "Satyanarayan Patra",
            UploadedOn: "13/08/2024 18:58:13",
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

const SheetsListing = ({ page, projectsSheets, itemsPerPage }) => {
    const [currentPage, setCurrentPage] = useState(1);
    // const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sheetsToShow, setSheetsToShow] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        let newSheetsList = [];
        let i = 0;
        for (; i < projectsSheets.length; i++) {
            newSheetsList.push(projectsSheets[i]);
        }
        for (; i < itemsPerPage; i++) {
            let obj = {};
            for (let key in projectsSheets[0]) {
                obj[key] = "";
            }
            newSheetsList.push(obj);
        }
        setSheetsToShow(newSheetsList);
    }, [itemsPerPage, projectsSheets])

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeItemsPerPage = (items) => {
        // setItemsPerPage(items);
        setCurrentPage(1);
    };

    return (
        <>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHeaderNonSort tableData={tableData} />
                    <CommonTableBody data={sheetsToShow} currentPage={currentPage} itemsPerPage={itemsPerPage} page={page} />
                </Table>
            </TableContainer>
            {/* <CustomPagination currentPage={currentPage} totalPages={totalPages} changePage={handleChangePage} changeItemsPerPage={handleChangeItemsPerPage} minRows={20} /> */}
        </>
    )
}

export default SheetsListing