import React, { useEffect, useState } from "react";
import Sidenav from "./Sidenav";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { Button, Modal, Spinner, Tab, Tabs } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { RiCloseLargeFill } from "react-icons/ri";
import * as XLSX from "xlsx-js-style";
import { BsCheckLg } from "react-icons/bs";

const TableInformation = () => {
  const location = useLocation();
  // const tId = location.state?.selectedTable;
  const apiUrl = process.env.REACT_APP_API_URL;
  const API = process.env.REACT_APP_IMAGE_URL;
  const [token] = useState(localStorage.getItem("token"));
  const [role] = useState(localStorage.getItem("role"));
  const admin_id = localStorage.getItem("admin_id")

  const [tId, setTId] = useState(location.state?.selectedTable);
  console.log(tId);


  const [userData, setUserData] = useState({});
  const [userTableData, setUserTableData] = useState({});
  const [selectedDesdeMonth, setSelectedDesdeMonth] = useState(1);
  const [selectedHastaMonth, setSelectedHastaMonth] = useState(
    new Date().getMonth() + 1
  );
  const [datatab, setDatatab] = useState([]);
  const [error, setError] = useState("");

  const [mapVal, setMapVal] = useState([[]]);
  const [categories, setCategories] = useState([]);
  const [showModal12, setShowModal12] = useState(false);

  const handleClose12 = () => setShowModal12(false);

  const handleShow12 = () => {
    setShowModal12(true);
    setTimeout(() => {
      setShowModal12(false);
      handleClose15();
    }, 2000);
  };

  const [tableData, setTableData] = useState()

  const [show15, setShow15] = useState(false);

  const handleClose15 = () => setShow15(false);
  const handleShow15 = () => setShow15(true);


  const [errorReport, setErrorReport] = useState("");
  const [selectedDesdeMonthReport, setSelectedDesdeMonthReport] = useState(1);
  const [selectedHastaMonthReport, setSelectedHastaMonthReport] = useState(
    new Date().getMonth() + 1
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!(role == "admin" || role == "cashier" || role == "waitress")) {
      navigate('/dashboard')
    }
  }, [role])

  useEffect(
    () => {
      if (selectedDesdeMonthReport > selectedHastaMonthReport) {
        setErrorReport("Hasta el mes debe ser mayor o igual que Desde el mes.");
        setData([]);
      } else {
        setErrorReport("");
      }
    },
    [selectedDesdeMonthReport, selectedHastaMonthReport]
  );


  const gettableData = async () => {
    if (tId) {
      try {
        const response = await axios.get(
          `${apiUrl}/single-table/${tId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.tables) {
          setTableData(response.data.tables);
        } else {
          console.error("No tables found in response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      console.error("tId is not set");
    }
  };

  // Ensure useEffect is correctly set to call gettableData when tId changes
  useEffect(() => {
    if (tId) {
      gettableData(tId);
    }
  }, [tId]);
  // console.log(tableData);


  const [data, setData] = useState([
    {
      pedido: "01234",
      fecha: "24/05/2023",
      hora: "11:00 AM",
      cliente: "Damian Gonzales",
      estado: "Recibido"
    },


  ]);

  const [activeTab, setActiveTab] = useState("home");

  document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll("#pills-tab button");

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove 'bg-primary', 'text-light', 'bg-light', 'text-dark' from all tabs
        tabs.forEach((button) => {
          button.classList.remove("bg-primary", "text-light");
          button.classList.add("bg-light", "text-dark");
        });

        // Add 'bg-primary' and 'text-light' to the clicked tab
        tab.classList.remove("bg-light", "text-dark");
        tab.classList.add("bg-primary", "text-light");
      });
    });
  });

  useEffect(
    () => {
      if (mapVal.length > 0) {
        const newCategories = mapVal.map((val, index) => `S ${index + 1}`);
        setCategories(newCategories);
      }
    },
    [mapVal]
  );

  const [chartState, setChartState] = useState({
    series: [
      {
        name: "Estadisticas",
        data: mapVal
      }
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
          tools: {
            download: false,
            resetZoom: false
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "category",
        categories: categories,
        labels: {
          style: {
            colors: "#d0d5db",
            fontSize: "14px"
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
        borderColor: "#dee2e62a",
        opacity: 0.1,
        yaxis: {
          lines: {
            show: true,
            interval: 1
          }
        },
        row: {
          colors: ["transparent", "transparent"], // Optional: set background colors for rows
          opacity: 0.5
        }
      },
      yaxis: {
        show: false,
        tickAmount: 5 // This will add 4 horizontal lines
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: ["0,0,0"]
        }
      },
      colors: ["#008FFB"]
    }
  });


  useEffect(() => {
    const style = document.createElement("style");
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

  const [analysis, setAnalysis] = useState("");
  const [isProgressing, setIsProgressing] = useState(null);

  useEffect(
    () => {
      setChartState((prevState) => ({
        ...prevState,
        series: [{ data: mapVal }],
        options: {
          ...prevState.options,
          xaxis: { ...prevState.options.xaxis, categories: categories }
        }
      }));
      generateAnalysis(mapVal);
    },
    [mapVal, categories]
  );

  const generateAnalysis = (data) => {
    const initial = data[0];
    const final = data[data.length - 1];
    const percentageChange = (final - initial) / initial * 100;

    setIsProgressing(percentageChange >= 0);
    const analysisText = ` ${Math.abs(percentageChange).toFixed(2)}% `;

    setAnalysis(analysisText);
  };

  //   *******************************************API****************************************
  useEffect(() => {
    if (selectedDesdeMonth > selectedHastaMonth) {
      setError("Hasta month must be greater than or equal to Desde month.");
      setDatatab([]);
    }
  }, [selectedDesdeMonth, selectedHastaMonth]);


  const fetchData = async (tableId) => {
    try {
      const response = await axios.post(
        `${apiUrl}/table/getStats/${tableId}?from_month=${selectedDesdeMonth}&to_month=${selectedHastaMonth}`,
        { admin_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDatatab(response.data);
      const newMapValue = {};

      response.data.forEach((order) => {
        newMapValue[order.id] = order.order_total;
      });
      const orderTotals = response.data.map((order) => order.order_total);

      setMapVal(orderTotals);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [tableid, setTableid] = useState('')

  useEffect(
    () => {
      if (tableData) {
        const userIds = tableData.user_id;
        const tableId = tableData.id;
        setTableid(tableId)
        fetchUserData(userIds);
        fetchtTableData(tableId);
        fetchData(tableId)
      }
    },
    [tableData, selectedDesdeMonth, selectedHastaMonth]
  );
  const fetchUserData = async (userIds) => {
    try {
      const response = await axios.get(`${apiUrl}/get-user/${userIds}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };
  const fetchtTableData = async (tableId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/sector/by-table/${tableId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUserTableData(response.data.sector);
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // Handle midnight (0) as 12 AM

    return `${hours}:${minutes} ${period}`;
  };


  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];



  const generateExcelReport = async () => {
    setIsProcessing(true);
    if (selectedDesdeMonthReport > selectedHastaMonthReport) {
      setErrorReport("Hasta month must be greater than or equal to Desde month.");
      setData([]);
      return;
    }
    try {

      // =======infomation=======
      const infomation = {
        Creador_mesa: userData[0]?.name,
        Fecha_creación: new Date(tableData?.created_at).toLocaleDateString('en-GB'),
        Sector: tableData?.id,
        Número_mesa: tableData?.sector_id
      };

      const formattedData = Object.entries(
        infomation
      ).map(([key, value]) => ({
        Campo: key == "Creador_mesa" ? "Creador mesa" :
          key == "Fecha_creación" ? "Fecha creación" :
            key == "Número_mesa" ? "Número mesa" : key,
        Valor: value
      }));


      // Create a worksheet
      const wsi = XLSX.utils.json_to_sheet(formattedData, { origin: "A2" });

      // Add a heading "Información"
      // Merge cells for the heading
      XLSX.utils.sheet_add_aoa(wsi, [["Información"]], { origin: "A1" });
      wsi["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

      // Apply styles to the heading
      wsi["A1"].s = {
        font: { name: "Aptos Narrow", bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" }
      };

      // Set row height for the heading
      if (!wsi["!rows"]) wsi["!rows"] = [];
      wsi["!rows"][0] = { hpt: 30 };

      // Auto-size columns
      const colWidthsa = [{ wch: 20 }, { wch: 30 }]; // Set widths for "Campo" and "Valor"
      wsi["!cols"] = colWidthsa;

      // Set row height for header
      wsi["!rows"] = [{ hpt: 25 }]; // Set height of first row to 25


      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsi, "Información");

      //  // =============== Historial =============

      const response = await axios.post(
        `${apiUrl}/table/getStats/${tableid}?from_month=${selectedDesdeMonthReport}&to_month=${selectedHastaMonthReport}`, { admin_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const historia = response.data.map((table) => {
        return {
          Pedido: table.id,
          Fecha: formatDate(table.created_at),
          Hora: formatTime(table.created_at),
          Cliente: table.customer_name,
          Estado: table.status.toLowerCase() === "received" ? "Recibido" :
            table.status.toLowerCase() === "prepared" ? "Preparado" :
              table.status.toLowerCase() === "delivered" ? "Entregado" :
                table.status.toLowerCase() === "finalized" ? "Finalizado" :
                  table.status.toLowerCase() === "withdraw" ? "Retirar" :
                    table.status.toLowerCase() === "local" ? "Local" :
                      table.status.toLowerCase() === "cancelled" ? "Cancelado" :
                        table.status
        };
      });

      const ws = XLSX.utils.json_to_sheet(historia.length > 0 ? historia : [{ Pedido: "", Fecha: "", Hora: "", Cliente: "", Estado: "" }], { origin: "A2" });

      // Add a heading "Reporte de Entrega"
      XLSX.utils.sheet_add_aoa(ws, [["Historial"]], { origin: "A1" });
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }]; // Merge cells for the heading

      // Add column names only if there is data
      if (historia.length > 0) {
        const columnNames = ["Pedido", "Fecha", " Hora", "Cliente", "Estado"];
        XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" })
      } else {
        // Add column names even if there's no data
        const columnNames = ["Pedido", "Fecha", "Hora", "Cliente", "Estado"];
        XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" });
      }

      // Apply styles to the heading
      ws["A1"].s = {
        font: { name: "Aptos Narrow", bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" }
      };

      // Set row height for the heading
      if (!ws["!rows"]) ws["!rows"] = [];
      ws["!rows"][0] = { hpt: 30 };
      ws["!rows"][1] = { hpt: 25 }; // Set height for column names

      // Auto-size columns
      const colWidths = [{ wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
      ws["!cols"] = colWidths;

      // Add sorting functionality
      if (historia.length > 0) {
        ws['!autofilter'] = { ref: `A2:E${historia.length}` }; // Enable autofilter for the range
      }
      // Create a workbook
      XLSX.utils.book_append_sheet(wb, ws, "Historial");

      const desdeMonthName = monthNames[selectedDesdeMonthReport - 1];
      const hastaMonthName = monthNames[selectedHastaMonthReport - 1];
      XLSX.writeFile(
        wb,
        `Reporte de mesa ${tId} -  ${desdeMonthName}-${hastaMonthName}.xlsx`
      );

      setIsProcessing(false);

      handleShow12();

    } catch (error) {
      console.error("Error generating report:", error);
      setErrorReport(
        "No se pudo generar el informe. Por favor inténtalo de nuevo."
      );
    }
  };
  const [showEdittable, setShowEdittable] = useState(false);

  const handleCloseEdittable = () => setShowEdittable(false);
  const handleShowEdittable = () => {setShowEdittable(true);
    setTableName(tableData.name || '')
  }

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [showEditFamDel, setShowEditFamDel] = useState(false);
  const handleCloseEditFamDel = () => setShowEditFamDel(false);

  const handleShowEditFamDel = () => {
    setShowEditFamDel(true);
    setTimeout(() => {
      setShowEditFamDel(false);
      navigate("/table")
    }, 2000);
  };

  // edit table Success
  const [showEditFamSuc, setShowEditFamSuc] = useState(false);
  const handleCloseEditFamSuc = () => setShowEditFamSuc(false);
  const handleShowEditFamSuc = () => {
    setShowEditFamSuc(true);
    setTimeout(() => {
      setShowEditFamSuc(false);
    }, 2000);
  };

  let [tableName, setTableName] = useState(null);
  let [editErrorName, setEditErrorsName] = useState('');
  //edit table
  const handleEditChange = (e) => {
    const name = e.target.value;
    tableName = (name);
    if (name) {
      setEditErrorsName('');
    }
  };

  const handleEditSubmit = async () => {

    if (!tableName) {
      setEditErrorsName("Debe ingresar un nombre de mesa.");
      return
    }

    handleCloseEdittable();
    setIsProcessing(true)
    try {
      const response = await axios.post(
        `${apiUrl}/table/updateTableName`,
        {
          table_id: tId,
          name: tableName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }

      );
      if (response.status == 200) {
        setTableName(null)
        setIsProcessing(false);
        handleShowEditFamSuc();
        gettableData();
        // getSector();
        // getSectorTable(); 
      }
    } catch (error) {
      console.error("Error updating sector:", error);
      alert("Failed to update sector. Please try again.");
    }
  }

  const handleDeleteClick = () => {
    console.log(tId);
    setShowDeleteConfirm(true); // Show confirmation modal
    handleCloseEdittable();
  }

  const handleDeleteConfirmation = async () => {

    if (tId) {
      setIsProcessing(true)
      try {
        const response = await axios.delete(
          // `${apiUrl}/order/deleteSingle/${itemToDelete}`,
          `${apiUrl}/table/delete/${tId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status == 200) {
          setIsProcessing(false);
          setShowDeleteConfirm(false);
          handleShowEditFamDel();
        }


        // getSector();
        // getSectorTable();
        // handleShowEditFamDel();
        // setShowDeleteConfirm(false);
      } catch (error) {
        console.error(
          "Error Delete OrderData:",
          error.response ? error.response.data : error.message
        );
      }
      setIsProcessing(false);
    }

  }


  // console.log(tableData);

  return (
    <div>
      <Header />
      <div className="d-flex">
        <Sidenav />
        {/* {console.log(tableData)} */}
        <div className=" flex-grow-1 sidebar" style={{ width: "50%" }}>
          {tableData ? (

            <div>

              <div className="m_bgblack text-white m_borbot  b_border_bb j-tbl-font-1">
                <div className="j-table-datos-btn">
                  <Link to={"/table"}>
                    <Button
                      variant="outline-primary"
                      className="j-tbl-btn-font-1 b_border_out "
                    >
                      <HiOutlineArrowLeft className="j-table-datos-icon " />{" "}
                      <span className="b_ttt">Regresar</span>
                    </Button>
                  </Link>
                </div>
                <div className="j-table-information-head-buttons">
                  <h5 className="j-table-information-1 j-table-text-23 ">
                  Datos mesa <span>- {tableData?.name} ( {tableData?.id} )</span>
                  </h5>

                  <div className="j-table-information-btn-1">
                    <Button
                      data-bs-theme="dark"
                      className="j-canvas-btn2 j-tbl-font-3 b_back_neww text-center "
                      style={{ borderRadius: "8px" }}
                      onClick={handleShow15}
                      variant="primary"
                    >
                      <div className="d-flex align-items-center">
                        <svg
                          className="j-canvas-btn-i"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span className=""> Generar reporte</span>
                      </div>
                    </Button>


                    <Button
                      data-bs-theme="dark"
                      className="j-canvas-btn2 j-tbl-font-3 b_border_out"
                      style={{ borderRadius: "8px" }}
                      variant="outline-primary"
                      onClick={() => handleShowEdittable(true)}
                    >
                      <div className="d-flex align-items-center">
                        <svg
                          className="j-canvas-btn-i j-table-datos-icon"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942 3.115l.536-2.839c.097-.512.335-.983.684l2.914-3.086Z"
                            clip-rule="evenodd"
                          />
                          <path
                            fill-rule="evenodd"
                            d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654l-.546 2.852.852.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588-.622l2.682-.567a.492.492 0 0 0 .255-145.778-5.06Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span className="b_ttt">Editar</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                id="fill-tab-example"
                className="mb-3  m_tabs m_bgblack px-2 border-0 p-4"
                fill
              >
                <Tab
                  eventKey="home"
                  title="Información"
                  className=" text-white m_bgblack mt-2 rounded"
                >
                  <div className="j-table-information-body">
                    <form className="j_ti_form">
                      <div className="row">
                        <div className="col-6 mb-3 ">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label text-white j-tbl-font-11"
                          >
                            Creador mesa
                          </label>
                          <input
                            type="text"
                            className="form-control j-tbl-information-input"
                            id="exampleFormControlInput1"
                            placeholder="-"
                            value={userData[0]?.name}
                            readOnly
                          />
                          {console.log(userData)}
                        </div>
                        <div className="col-6 mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label text-white j-tbl-font-11"
                          >
                            Fecha creación
                          </label>
                          <input
                            type="text"
                            className="form-control j-tbl-information-input"
                            id="exampleFormControlInput1"
                            placeholder="-"
                            value={new Date(tableData?.created_at).toLocaleDateString('en-GB')}
                            readOnly
                          />
                        </div>
                        <div className="col-6 ">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label text-white j-tbl-font-11"
                          >
                            Sector
                          </label>
                          <input
                            type="text"
                            className="form-control j-tbl-information-input"
                            id="exampleFormControlInput1"
                            placeholder="-"
                            // value={tableData?.sector_id}
                            value={userTableData?.name}
                            readOnly
                          />
                        </div>
                        <div className="col-6">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label text-white j-tbl-font-11"
                          >
                            Número mesa
                          </label>
                          <input
                            type="text"
                            className="form-control j-tbl-information-input"
                            id="exampleFormControlInput1"
                            placeholder="-"
                            value={tableData?.id}
                            readOnly
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </Tab>
                <Tab
                  eventKey="profile"
                  title="Historial"
                  style={{ backgroundColor: "#1F2A37" }}
                  className="py-2 mt-2"
                >
                  <div className="j-table-information-body">
                    <form>
                      <div className="j_ti_center">
                        <div className="j_ti_margin">
                          <label
                            htmlFor="vendidosInput"
                            className="form-label text-white j-tbl-font-11"
                          >
                            Vendidos
                          </label>
                          <input
                            type="number"
                            className="form-control j-input-width j-tbl-information-input"
                            id="vendidosInput"
                            placeholder="60"
                            value={datatab?.length}
                            readOnly
                          />
                        </div>
                        <div className="d-flex justify-content-between gap-3">
                          <div className="mb-3">
                            <label
                              htmlFor="desdeSelect"
                              className="form-label text-white j-tbl-font-11"
                            >
                              Desde
                            </label>
                            <select
                              className="form-select  b_select border-0 py-2  "
                              style={{ borderRadius: "8px" }}
                              aria-label="Default select example"
                              onChange={(e) =>
                                setSelectedDesdeMonth(Number(e.target.value))
                              }
                              value={selectedDesdeMonth}
                            >
                              <option selected value="1">
                                Enero
                              </option>
                              <option value="2">Febrero</option>
                              <option value="3">Marzo</option>
                              <option value="4">Abril</option>
                              <option value="5">Mayo</option>
                              <option value="6">Junio</option>
                              <option value="7">Julio</option>
                              <option value="8">Agosto</option>
                              <option value="9">Septiembre</option>
                              <option value="10">Octubre </option>
                              <option value="11">Noviembre</option>
                              <option value="12">Diciembre</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label
                              htmlFor="hastaSelect"
                              className="form-label text-white j-tbl-font-11"
                            >
                              Hasta
                            </label>
                            <select
                              className="form-select  b_select border-0 py-2  "
                              style={{ borderRadius: "8px" }}
                              aria-label="Default select example"
                              onChange={(e) =>
                                setSelectedHastaMonth(Number(e.target.value))
                              }
                              value={selectedHastaMonth}
                            >
                              <option value="1">Enero</option>
                              <option value="2">Febrero</option>
                              <option selected value="3">
                                Marzo
                              </option>
                              <option value="4">Abril</option>
                              <option value="5">Mayo</option>
                              <option value="6">Junio</option>
                              <option value="7">Julio</option>
                              <option value="8">Agosto</option>
                              <option value="9">Septiembre</option>
                              <option value="10">Octubre </option>
                              <option value="11">Noviembre</option>
                              <option value="12">Diciembre</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      {error && <div className="alert alert-danger d-flex justify-content-between pointer">{error} <div className="text-black d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={(e) => { setError(''); setSelectedDesdeMonth(1) }}><RiCloseLargeFill />  </div></div>}

                    </form>

                    <div className="b_table1">
                      <table className="b_table ">
                        <thead>
                          <tr className="b_thcolor">
                            <th>Pedido</th>
                            <th>Fecha </th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Estado</th>
                            <th>Ver</th>
                          </tr>
                        </thead>

                        <tbody className="text-white b_btnn ">
                          {datatab.length > 0 ? (

                            datatab.map((order) => (
                              console.log(order.status),

                              <tr key={order.id} className="b_row">
                                <Link to={`/home_Pedidos/paymet/${order.id}`}>
                                  <div
                                    className="b_idbtn j-tbl-font-3 "
                                    style={{ borderRadius: "10px", fontSize: "12px" }}
                                  >
                                    {order.id}
                                  </div>
                                </Link>
                                <td className="j-tbl-text-8"> {formatDate(order.created_at)}</td>
                                <td className="text-nowrap j-tbl-text-8">
                                  {formatTime(order.created_at)}
                                </td>
                                <td className="text-nowrap j-tbl-text-8">
                                  {order.customer_name}
                                </td>
                                {/* <td
                                  style={{ fontSize: "12px" }}
                                  className={`b_btn1 mb-3 ms-3 text-nowrap d-flex j-tbl-font-3  align-items-center justify-content-center ${order.estado ==
                                    "received"
                                    ? "b_bl"
                                    : order.status === "prepared"
                                      ? "b_or"
                                      : order.status === "delivered"
                                        ? "b_er"
                                        : order.status === "finalized"
                                          ? "b_gr"
                                          : "text-danger"}`}
                                >
                                  {order.status}
                                </td> */}
                                <td className={`bj-delivery-text-2  b_btn1 mb-3 ms-3  p-0 text-nowrap d-flex  align-items-center justify-content-center 
                                                        ${order.status.toLowerCase() === 'received' ? 'b_indigo' : order.status.toLowerCase() === 'prepared' ? 'b_ora' : order.status.toLowerCase() === 'delivered' ? 'b_blue' : order.status.toLowerCase() === 'finalized' ? 'b_green' : order.status.toLowerCase() === 'withdraw' ? 'b_indigo' : order.status.toLowerCase() === 'local' ? 'b_purple' : 'b_ora text-danger'}`}>
                                  {order.status.toLowerCase() === 'received' ? 'Recibido' : order.status.toLowerCase() === 'prepared' ? 'Preparado ' : order.status.toLowerCase() === 'delivered' ? 'Entregado' : order.status.toLowerCase() === 'finalized' ? 'Finalizado' : order.status.toLowerCase() === 'withdraw' ? 'Retirar' : order.status.toLowerCase() === 'local' ? 'Local' : order.status.toLowerCase() === 'cancelled' ? 'cancelado' : ' '}
                                </td>
                                <td>
                                  <Link to={`/home_Pedidos/paymet/${order.id}`}>
                                    <td
                                      style={{ fontSize: "12px" }}
                                      className="b_idbtn j-btn-primary text-nowrap j-tbl-font-3 "
                                    >
                                      Ver detalles
                                    </td>
                                  </Link>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center"> {/* Added colSpan to span all columns */}
                                <div className="text-center">No hay datos para mostrar</div>
                              </td>
                            </tr>
                          )}
                        </tbody>

                      </table>
                    </div>
                  </div>
                </Tab>

                <Tab
                  eventKey="longer-tab"
                  title="Estadísticas"
                  className=" text-white m_bgblack rounded mx-3"
                >
                  <div className="j-table-statistics-body">
                    <div className="row">
                      <div className="col-6">
                        <div className="j-statistics-form">
                          <div className="j_ti_d_flex gap-3">
                            <div className="mb-3 j-input-width2">
                              <label
                                htmlFor="desdeSelect"
                                className="form-label text-white j-tbl-font-11"
                              >
                                Desde
                              </label>
                              <select
                                className="form-select  b_select border-0 py-2  "
                                style={{ borderRadius: "8px" }}
                                aria-label="Default select example"
                                onChange={(e) =>
                                  setSelectedDesdeMonth(Number(e.target.value))
                                }
                                value={selectedDesdeMonth}
                              >
                                <option selected value="1">
                                  Enero
                                </option>
                                <option value="2">Febrero</option>
                                <option value="3">Marzo</option>
                                <option value="4">Abril</option>
                                <option value="5">Mayo</option>
                                <option value="6">Junio</option>
                                <option value="7">Julio</option>
                                <option value="8">Agosto</option>
                                <option value="9">Septiembre</option>
                                <option value="10">Octubre </option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                              </select>
                            </div>
                            <div className="mb-3  j-input-width2">
                              <label
                                htmlFor="hastaSelect"
                                className="form-label text-white j-tbl-font-11"
                              >
                                Hasta
                              </label>
                              <select
                                className="form-select  b_select border-0 py-2  "
                                style={{ borderRadius: "8px" }}
                                aria-label="Default select example"
                                onChange={(e) =>
                                  setSelectedHastaMonth(Number(e.target.value))
                                }
                                value={selectedHastaMonth}
                              >
                                <option value="1">Enero</option>
                                <option value="2">Febrero</option>
                                <option selected value="3">
                                  Marzo
                                </option>
                                <option value="4">Abril</option>
                                <option value="5">Mayo</option>
                                <option value="6">Junio</option>
                                <option value="7">Julio</option>
                                <option value="8">Agosto</option>
                                <option value="9">Septiembre</option>
                                <option value="10">Octubre </option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                              </select>
                            </div>
                          </div>
                          {error && <div className="alert alert-danger d-flex justify-content-between pointer">{error} <div className="text-black d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={(e) => { setError(''); setSelectedDesdeMonth(1) }}><RiCloseLargeFill />  </div></div>}

                        </div>
                      </div>
                      <div className="col-6">
                        <div className="j-statistics-form">
                          <div
                            style={{ position: "relative" }}
                            className="py-3 j-table-chart"
                          >
                            <div id="chart" className="m_chart">
                              <ReactApexChart
                                options={chartState.options}
                                series={chartState.series}
                                type="area"
                                height={350}
                              />
                            </div>
                            <div
                              id="analysis"
                              style={{
                                position: "absolute",
                                top: "5px",
                                right: "20px",
                                fontSize: "16px",
                                color: isProgressing ? "green" : "red",
                                fontWeight: 700
                              }}
                            >
                              {analysis}{" "}
                              {isProgressing ? <FaArrowUp /> : <FaArrowDown />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          ) : (

            <div>No Table Data Found</div>

          )}


          {/* generat report  */}
          <Modal
            show={show15}
            onHide={handleClose15}
            backdrop={true}
            keyboard={false}
            className="m_modal jay-modal"
          >
            <Modal.Header
              closeButton
              className="j-caja-border-bottom p-0 m-3 mb-0 pb-3"
            >
              <Modal.Title className="modal-title j-caja-pop-up-text-1">
                Generar reporte cajas
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-6">
                  <label className="mb-1 j-caja-text-1">
                    Desde
                  </label>

                  <select
                    className="form-select  b_select border-0 py-2  "
                    style={{ borderRadius: "8px" }}
                    aria-label="Default select example"
                    value={selectedDesdeMonthReport}
                    onChange={(e) =>
                      setSelectedDesdeMonthReport(e.target.value)}
                  >
                    <option selected value="1">
                      Enero
                    </option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre </option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="mb-1 j-caja-text-1">
                    Hasta
                  </label>
                  <select
                    className="form-select  b_select border-0 py-2  "
                    style={{ borderRadius: "8px" }}
                    aria-label="Default select example"
                    value={selectedHastaMonthReport}
                    onChange={(e) =>
                      setSelectedHastaMonthReport(e.target.value)}
                  >
                    <option selected value="1">
                      Enero
                    </option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre </option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                </div>
                <div className="d-flex w-auto justify-content-end gap-5">
                  {errorReport && (
                    <div className="alert alert-danger d-flex justify-content-between pointer">
                      {errorReport}{" "}
                      <div
                        className="text-black d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          setErrorReport("");
                          setSelectedDesdeMonthReport(1);
                        }}
                      >
                        <RiCloseLargeFill />{" "}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="sjmodenone">
              <Button
                variant="secondary"
                className="btn sjredbtn b_btn_close j-caja-text-1"
                onClick={handleClose15}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="btn j-btn-primary text-white j-caja-text-1"
                onClick={() => {
                  // handleShow12();
                  // 
                  generateExcelReport();

                }}
              >
                Generar reporte
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showModal12}
            onHide={handleClose12}
            backdrop={true}
            keyboard={false}
            className="m_modal"
          >
            <Modal.Header closeButton className="border-0" />
            <Modal.Body>
              <div className="text-center">
                <img src={require("../Image/check-circle.png")} alt="" />
                <p className="mb-0 mt-2 h6 j-tbl-pop-1">mesa</p>
                <p className="opacity-75 j-tbl-pop-2">
                  Informe de tabla creado con éxito
                </p>
              </div>
            </Modal.Body>
          </Modal>
          {/* {/ Edit Tables/} */}
          <Modal
            show={showEdittable}
            onHide={handleCloseEdittable}
            backdrop={true}
            keyboard={false}
            className="m_modal jay-modal"
          >
            <Modal.Header
              closeButton
              className="j-caja-border-bottom p-0 m-3 mb-0 pb-3"
            >
              <Modal.Title className="j-tbl-text-12">Editar mesa</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border-0">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label j-tbl-btn-font-1"
                >
                  Nombre
                </label>
                <input
                  type="text"

                  className="form-control j-table_input"
                  id="exampleFormControlInput1"
                  placeholder={"-"}
                  defaultValue={tableName}
                  name="name"
                  onChange={handleEditChange}
                />
                {editErrorName && (
                  <div className="text-danger errormessage">
                    {editErrorName}
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button
                className="j-tbl-btn-font-1 b_btn_close  "
                variant="danger"
                onClick={() => {
                  handleDeleteClick();
                }}
              >
                Eliminar
              </Button>
              <Button
                className="j-tbl-btn-font-1 b_btn_pop"
                variant="primary"
                onClick={handleEditSubmit}
              >
                Guardar cambios
              </Button>
            </Modal.Footer>
          </Modal>

          {/* delete confirm */}
          <Modal
            show={showDeleteConfirm}
            onHide={() => setShowDeleteConfirm(false)}
            backdrop={true}
            keyboard={false}
            className="m_modal jay-modal"
          >
            <Modal.Header closeButton className="border-0" onClick={() => setShowDeleteConfirm(false)} />
            <Modal.Body className="border-0">
              <div className="text-center">
                <img
                  src={require("../Image/trash-outline-secondary.png")}
                  alt=" "
                />
                <p className="mb-0 mt-3 h6">
                  {" "}
                  ¿Está seguro de que desea eliminar esta mesa?
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0 ">
              <Button
                className="j-tbl-btn-font-1 b_btn_close"
                variant="danger"
                onClick={handleDeleteConfirmation} // Confirm deletion
              >
                Sí, seguro
              </Button>
              <Button
                className="j-tbl-btn-font-1"
                variant="secondary"
                onClick={() => { setShowDeleteConfirm(false) }} // Cancel deletion
              >
                No, cancelar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* {/ edit Table eliminate /} */}
          <Modal
            show={showEditFamDel}
            onHide={handleCloseEditFamDel}
            backdrop={true}
            keyboard={false}
            className="m_modal jay-modal"
          >
            <Modal.Header closeButton className="border-0" />
            <Modal.Body>
              <div className="j-modal-trash text-center">
                <img src={require("../Image/trash-outline.png")} alt="" />
                <p className="mb-0 mt-3 h6 j-tbl-pop-1">Mesa eliminado</p>
                <p className="opacity-75 j-tbl-pop-2">
                  El Mesa ha sido eliminado correctamente
                </p>
              </div>
            </Modal.Body>
          </Modal>

          {/* {/ edit family success /}  */}
          <Modal
            show={showEditFamSuc}
            onHide={handleCloseEditFamSuc}
            backdrop={true}
            keyboard={false}
            className="m_modal jay-modal"
          >
            <Modal.Header closeButton className="border-0" onClick={() => { setShowEditFamSuc(false) }} />
            <Modal.Body>
              <div className="text-center">
                <img src={require("../Image/check-circle.png")} alt="" />
                <p className="mb-0 mt-2 h6 j-tbl-pop-1">Cambios Mesa</p>
                <p className="opacity-75 j-tbl-pop-2">
                  Se ha modificado exitosamente
                </p>
              </div>
            </Modal.Body>
          </Modal>

          {/* processing */}
          <Modal
            show={isProcessing}
            keyboard={false}
            backdrop={true}
            className="m_modal  m_user "
          >
            <Modal.Body className="text-center">
              <Spinner animation="border" role="status" style={{ height: '85px', width: '85px', borderWidth: '6px' }} />
              <p className="mt-2">Procesando solicitud...</p>
            </Modal.Body>
          </Modal>

        </div>
      </div>
    </div>
  );
};

export default TableInformation;
