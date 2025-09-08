import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between'
};

const titleStyle = {
  color: '#404040',
  fontSize: '10px',
  ml: 1,
  mt: 1,
  alignItems: 'center',
  display: 'inline-flex',
  fontWeight: 600
};

const detailsTextStyle = {
  color: '#9F9F9F',
  fontSize: '10px',
  ml: 1,
  mt: 1,
  mr: 0.2,
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'underline',
  cursor: 'pointer',
  '&:hover': {
    color: '#FD5707',
    '& svg': {
      backgroundColor: '#FD5707',
    }
  }
};

const chevronRightIconStyle = {
  backgroundColor: '#9F9F9F',
  borderRadius: '50%',
  color: 'white',
  height: '13px',
  width: '13px',
  ml: '4px'
};

function DonutChart({ title }) {
  const options = {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45,
      },
      height: 250,
      // width: 400,
    },
    exporting: {
      enabled: false
    },
    title: {
      text: null, // Custom title handled by Material-UI Typography
    },
    plotOptions: {
      pie: {
        innerSize: '65%',
        depth: 45,
        dataLabels: {
          enabled: false,
        },
        showInLegend: true
      },
    },
    series: [{
      name: 'QRE Claims',
      data: [
        { name: 'In Progress', y: 11, color: '#FD5707' },
        { name: 'Completed', y: 5, color: '#00A398' },
      ],
    }],
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemMarginTop: 5,
      itemMarginBottom: 5,
      labelFormatter: function () {
        return `${this.name}: ${this.y}`;
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 300
        },
        chartOptions: {
          legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
          }
        }
      }]
    },
    credits: {
      enabled: false
    }
  };

  return (
    <div>
      <div style={headerStyle}>
        <Typography
          sx={titleStyle}
        >
          {title}
        </Typography>
        <Typography
          sx={detailsTextStyle}
        >
          View More Details
          <ChevronRightIcon
            sx={chevronRightIconStyle}
          />
        </Typography>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default DonutChart;
