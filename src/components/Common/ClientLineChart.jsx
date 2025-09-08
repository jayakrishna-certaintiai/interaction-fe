import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";

const ClientLineChart = ({ totalExpense, rndExpenseCumulative, date, symbol }) => {
    const options = {
        chart: {
            type: "spline", // Smooth lines
            zoomType: "x",
            height: "350px",
            zooming: { mouseWheel: { enabled: false } },
        },
        title: {
            text: `Currency in  ${symbol}`,
            align: "left",
            style: {
                fontSize: "13px",
            },
        },
        exporting: {
            enabled: false,
        },
        xAxis: {
            categories: date,
            labels: {
                style: {
                    color: "#404040",
                    fontSize: "10px",
                    fontWeight: "500",
                },
            },
        },
        yAxis: {
            title: {
                text: "",
            },
            labels: {
                style: {
                    color: "#404040",
                    fontSize: "10px",
                    fontWeight: "500",
                },
            },
        },
        plotOptions: {
            series: {

                showInLegend: true,
            },
        },
        tooltip: {
            valueSuffix: "",
            shared: true,
            style: {
                fontSize: "11px",
                fontWeight: "500",
            },
        },
        legend: {
            align: "right",
            verticalAlign: "top",
            layout: "horizontal",
            alignColumns: false,
            itemStyle: {
                fontSize: "11px",
                fontWeight: "500",
            },
        },

        series: [
            {
                name: "Total Expense",
                data: totalExpense,
                type: 'spline',
                color: "#00A398",
                lineWidth: 1.5,

            },
            {
                name: "QRE Expense",
                data: rndExpenseCumulative,
                type: 'spline',
                color: "#FD5707",
                lineWidth: 1.5,

            },
        ],
        credits: {
            enabled: false,
        },
    };

    return (
        <Box
            sx={{ border: "1px solid #E4E4E4", borderRadius: "20px", p: 1, mt: 2 }}
        >
            <HighchartsReact highcharts={Highcharts} options={options} />
        </Box>
    );
};

export default ClientLineChart;
