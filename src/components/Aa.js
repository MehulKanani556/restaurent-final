import React, { useEffect } from "react";
import ApexCharts from "apexcharts"; // Make sure to install ApexCharts
// import "bootstrap/dist/css/bootstrap.min.css"; // Ensure you have bootstrap installed

export default function Aa({ data }) {
  // console.log(data);
  
  const getChartOptions = () => {
    return {
      series: [
        data?.cash || 0,
        data?.debit || 0,
        data?.credit || 0,
        data?.transfer || 0
      ],
      colors: ["#147BDE", "#16BDCA", "#9061F9", "#FDBA8C"],
      chart: {
        height: 320,
        width: "100%",
        type: "donut"
      },
      stroke: {
        colors: ["transparent"],
        lineCap: ""
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 12
              },
              total: {
                showAlways: true,
                show: true,
                label: (data?.cash == 0 &&  data?.debit == 0 && data?.credit == 0 && data?.transfer == 0) ? "Sin Datos" : "Datos",
                fontSize: 22,
                color: "white",
                fontFamily: "Inter, sans-serif",
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  return sum.toFixed(1);
                }
              },
              value: {
                show: false,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value) {
                  return Number(value).toFixed(1);
                }
              }
            },
            size: "80%"
          }
        }
      },
      // grid: {
      //   padding: {
      //     top: -2
      //   }
      // },
      // labels: [ "Direct", "Sponsor", "Affiliate", "Email marketing" ],
      // dataLabels: {
      //   enabled: false
      // },
      // legend: {
      //   position: "bottom",
      //   fontFamily: "Inter, sans-serif"
      // },
      grid: {
        show: false, // Hide grid lines
        padding: {
          top: -2
        }
      },
      labels: [], // Remove labels from the chart itself
      dataLabels: {
        enabled: false // Disable data labels
      },
      legend: {
        show: false, // Hide legend
        position: "bottom",
        fontFamily: "Inter, sans-serif"
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return Number(value).toFixed(1);
          }
        }
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return Number(value).toFixed(1);
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      }
    };
  };

  useEffect(() => {
    if (
      document.getElementById("donut-chart") &&
      typeof ApexCharts !== "undefined"
    ) {
      const chart = new ApexCharts(
        document.getElementById("donut-chart"),
        getChartOptions()
      );
      chart.render();

      const checkboxes = document.querySelectorAll(
        '#devices input[type="checkbox"]'
      );

      function handleCheckboxChange(event) {
        const checkbox = event.target;
        if (checkbox.checked) {
          switch (checkbox.value) {
            case "desktop":
              chart.updateSeries([50.1, 22.5, 4.4, 8.4]);
              break;
            case "tablet":
              chart.updateSeries([60.1, 26.5, 1.4, 3.4]);
              break;
            case "mobile":
              chart.updateSeries([45.1, 27.5, 8.4, 2.4]);
              break;
            default:
              chart.updateSeries([55.1, 28.5, 1.4, 5.4]);
          }
        } else {
          chart.updateSeries([35.1, 23.5, 2.4, 5.4]);
        }
      }

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", handleCheckboxChange);
      });

      return () => {
        checkboxes.forEach((checkbox) => {
          checkbox.removeEventListener("change", handleCheckboxChange);
        });
      };
    }
  }, []);

  return (
    <div className="shadow-sm sjbg_none">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex align-items-center " />
        </div>

        {/* Donut Chart */}
        <div id="donut-chart" className="py-3" />

        <div className=" pt-3 mt-3">
          <div className="d-flex justify-content-between align-items-center">
            {/* Add any other UI elements here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
