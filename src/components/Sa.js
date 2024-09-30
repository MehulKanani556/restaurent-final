import React, { useEffect } from "react";
import ApexCharts from "apexcharts"; // Make sure to install ApexCharts

export default function Sa({ data }) {
  const getChartOptions = () => {    
    return {
      series: [
        data.received || 0,
        data.prepared || 0,
        data.finalized || 0,
        data.delivered || 0
      ],
      colors: ["#6875F5", "#FF8A4C", "#147BDE", "#16bdca"],
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                offsetY: 10,
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                color: "#9CA3AF",
                offsetY: 20,
                formatter: function () {
                  return "Ordenes"; // Second label with "Orders"
                },
              },
              total: {
                showAlways: true,
                show: true,
                label: `${data.received + data.prepared + data.delivered + data.finalized}`, // Sum of all data
                fontWeight: "bold",
                fontSize: 25,
                color: "white",
                fontFamily: "Inter, sans-serif",
                formatter: function () {
                  return "Ordenes"; // This is not necessary; keeping it for completeness
                },
              },
            },
            size: "80%",
          },
        },
      },
      grid: {
        show: false, // Hide grid lines
        padding: {
          top: -2,
        },
      },
      labels: [], // Remove labels from the chart itself
      dataLabels: {
        enabled: false, // Disable data labels
      },
      legend: {
        show: false, // Hide legend
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return Number(value).toFixed(1);
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return Number(value).toFixed(1);
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };
  };

  useEffect(() => {
    if (
      document.getElementById("donut-chart1") &&
      typeof ApexCharts !== "undefined"
    ) {
      const chart = new ApexCharts(
        document.getElementById("donut-chart1"),
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
        <div id="donut-chart1" className="py-3" />

        <div className="pt-3 mt-3">
          <div className="d-flex justify-content-between align-items-center">
            {/* Add any other UI elements here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
