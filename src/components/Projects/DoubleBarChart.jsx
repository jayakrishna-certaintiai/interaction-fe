/* eslint-disable react/prop-types */
import { Paper } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useState } from "react";
import BarChartTitle from "../Common/BarChartTitle";
const chartContainerStyle = {
  width: "100%",
  maxWidth: "600px",
};
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const DoubleBarChart = ({
  categories = [
    "Scotia-ET-RPA-FB(Apr to Jun)",
    "sunlife insurance",
    "Rogers DataPricePlanManagement",
    "Scotia-CBT-Pega T&M",
    "Roche PDIX Managed Services",
  ],
  series1Data = [2000000, 100234, 577676, 868653, 543556],
  series2Data = [100020, 10024, 577976, 868653, 543156],
  title,
}) => {
  const [ascending, setAscending] = useState(true);
  const options = {
    chart: {
      type: "bar",
      zoomType: "x",
      height: 250,
    },
    exporting: {
      enabled: false,
    },
    title: {
      text: "",
      align: "left",
      floating: true,
      margin: 0,
    },
    series: [
      {
        data: series1Data,
        type: "bar",
        name: "QRE Expense",
        color: "#00A398",
        tooltip: {
          valuePrefix: "$ ",
        },
      },
      {
        data: series2Data,
        type: "bar",
        name: "Non QRE Expense",
        color: "#FD5707",
        tooltip: {
          valuePrefix: "$ ",
        },
      },
    ],
    legend: {
      align: "right",
      verticalAlign: "top",
      layout: "horizontal",
      alignColumns: false,
      itemStyle: {
        fontSize: "11px",
        fontWeight: "600",
      },
    },
    tooltip: {
      valueSuffix: "",
      shared: true,
      style: {
        fontSize: "11px",
        fontWeight: "600",
      },
    },
    xAxis: {
      categories: categories,
      labels: {
        formatter: function () {
          return this.value.length > 15
            ? this.value.substring(0, 15) + "..."
            : this.value;
        },
        style: {
          color: "#404040",
          fontSize: "10px",
          fontWeight: "600",
        },
      },
    },
    yAxis: {
      labels: {
        format: "$ {text}",
        style: {
          color: "#404040",
          fontSize: "10px",
          fontWeight: "600",
        },
      },
      title: {
        enabled: false,
      },
    },
    credits: {
      enabled: false,
    },
  };
  return (
    <div style={chartContainerStyle}>
      <div style={headerStyle}>
        <BarChartTitle
          title={title}
          onSortClick={() => setAscending(!ascending)}
          ascending={ascending}
          redirect={true}
          icon={false}
        />
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DoubleBarChart;
