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

const SingleBarChart = ({
  categories = [
    "Scotia-ET-RPA-FB(Apr to Jun)",
    "sunlife insurance",
    "Rogers DataPricePlanManagement",
    "Scotia-CBT-Pega T&M",
    "Roche PDIX Managed Services",
  ],
  seriesData = [100, 20, 57, 86, 53],
  title,
  suffix = "%",
  seriesTitle = "",
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
        data: seriesData,
        type: "bar",
        name: seriesTitle,
        color: "#00A398",
        tooltip: {
          valueSuffix: suffix,
        },
        showInLegend: false,
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
        // format: "{text}",
        formatter: function () {
          return this.value + suffix;
        },
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

export default SingleBarChart;
