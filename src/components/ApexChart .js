import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const ApexChart = ({mapVal,cat}) => {
  const [chartState, setChartState] = useState({
    series: [{
      name: 'Estadisticas',
      data: mapVal
    }],
    options: {
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
          tools: {
            download: false,
            resetZoom: false,
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'category',
        categories:cat,
        labels: {
          style: {
            colors: '#d0d5db',
            fontSize: '14px',
          },
          offsetY: 5
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      grid: {
        borderColor: '#dee2e62a',
        opacity: 0.1,
        yaxis: {
          lines: {
            show: true,
            interval: 1
          }
        },
        row: {
          colors: ['transparent', 'transparent'], // Optional: set background colors for rows
          opacity: 0.5
        }
      },
      yaxis: {
        show: false,
        tickAmount: 5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: ['0,0,0']
        }
      },
      colors: ['#008FFB']
    },
  });

 
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
        .apexcharts-gridline:last-of-type {
            display: none;
        }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const [analysis, setAnalysis] = useState('');
  const [isProgressing, setIsProgressing] = useState(null);
  useEffect(() => {
    setChartState(prevState => ({
      ...prevState,
      series: [{ data: mapVal }],
      options: { ...prevState.options, xaxis: { ...prevState.options.xaxis, categories: cat } }
    }));
    generateAnalysis(mapVal);
  }, [mapVal, cat]);

  const generateAnalysis = (data) => {
    const initial = data[0];
    const final = data[data.length - 1];
    const percentageChange = ((final - initial) / initial) * 100;

    setIsProgressing(percentageChange >= 0);
    const analysisText = ` ${Math.abs(percentageChange).toFixed(2)}% `;

    setAnalysis(analysisText);
  };



  return (
    <div style={{ position: 'relative' }} className='py-3 j-table-chart me-0'>
      <div id="chart" className='m_chart'>
        <ReactApexChart options={chartState.options} series={chartState.series} type="area" height={350} />
      </div>
      <div
        id="analysis"
        style={{
          position: 'absolute',
          top: '5px',
          right: '20px',
          fontSize: '16px',
          color: isProgressing ? 'green' : 'red',
          fontWeight: 700
        }}
      >
        {analysis}  {isProgressing ? <FaArrowUp /> : <FaArrowDown />}
      </div>
    </div>
  );
};

export default ApexChart;
