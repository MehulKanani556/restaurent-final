import React, { useEffect, useState } from "react";
import Header from "./Header";
import home3 from "../Image/home3.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidenav from "./Sidenav";
import fing from "../Image/figura.png";
import { Button, Modal, Spinner, Tabs } from "react-bootstrap";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { Tab } from "bootstrap";
import Loader from "./Loader";
import axios from "axios";
import { RiCloseLargeFill } from "react-icons/ri";
import * as XLSX from "xlsx-js-style";
import CajaRecipe from "./CajaRecipe";
import CajaOrderRecipe from "./CajaOrderRecipe";
//import { enqueueSnackbar  } from "notistack";

const Informacira = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [token] = useState(localStorage.getItem("token"));
  const [role] = useState(localStorage.getItem("role"));
  // console.log(role)
  const location = useLocation();
  const queryString = location.search;
  // Remove the leading "?" from the query string and get the value
  const queryValue = queryString.startsWith("?")
    ? queryString.substring(1)
    : queryString;

  const [bId, setBId] = useState(queryValue);
  const admin_id = localStorage.getItem("admin_id");
  const [activeTab, setActiveTab] = useState("home");
  const [pricesecond, setpricesecond] = useState("");
  const [error, setError] = useState("");
  const [boxName, setBoxName] = useState('');
  const [openPrice, setOpenPrice] = useState("");
  const [errorOpenPrice, setErrorOpenPrice] = useState("");
  const [closePrice, setClosePrice] = useState("");
  const [errorClosePrice, setErrorClosePrice] = useState("");
  const [errorCashPrice, setErrorCashPrice] = useState("");
  const [allOrder, setAllOrder] = useState([]);
  const [allTable, setAllTable] = useState([]);
  const [selectedDesdeMonth, setSelectedDesdeMonth] = useState(1);
  const [selectedHastaMonth, setSelectedHastaMonth] = useState(
    new Date().getMonth() + 1
  );
  const [errorReport, setErrorReport] = useState("");
  const [selectedDesdeMonthReport, setSelectedDesdeMonthReport] = useState(1);
  const [selectedHastaMonthReport, setSelectedHastaMonthReport] = useState(
    new Date().getMonth() + 1
  );


  useEffect(
    () => {
      if (selectedDesdeMonth > selectedHastaMonth) {
        setError("Hasta month must be greater than or equal to Desde month.");
        setData([]);
      }
    },
    [selectedDesdeMonth, selectedHastaMonth]
  );
  useEffect(
    () => {
      if (selectedDesdeMonthReport > selectedHastaMonthReport) {
        setErrorReport("Hasta month must be greater than or equal to Desde month.");
        setData([]);
      }
    },
    [selectedDesdeMonthReport, selectedHastaMonthReport]
  );

  const handleprice = (event) => {
    let value = event.target.value;
    if (value.startsWith("$")) {
      value = value.substring(1);
    }

    setClosePrice(value);
    setErrorClosePrice('')
  };
  const handlepricesecond = (event) => {
    let value = event.target.value;
    if (value.startsWith("$")) {
      value = value.substring(1);
    }
    setpricesecond(value);
  };

  const [showModal12, setShowModal12] = useState(false);

  const handleClose12 = () => setShowModal12(false);
  const handleShow12 = () => {
    setShowModal12(true);
    setTimeout(() => {
      setShowModal12(false);
      handleClose15();
    }, 2000);
  };

  const [show11, setShow11] = useState(false);

  const handleClose11 = () => { setShow11(false); setClosePrice(''); setErrorClosePrice(''); setErrorCashPrice(''); setpricesecond('') };
  const handleShow11 = () => setShow11(true);

  const [show15, setShow15] = useState(false);

  const handleClose15 = () => setShow15(false);
  const handleShow15 = () => setShow15(true);

  const [show16, setShow16] = useState(false);

  const handleClose16 = () => { setShow16(false); setOpenPrice(''); setErrorOpenPrice('') };
  const handleShow16 = () => setShow16(true);

  const [show17, setShow17] = useState(false);
  const [show177, setShow177] = useState(false);

  const handleClose17 = () => setShow17(false);
  const handleShow17 = () => setShow17(true);

  const [show18, setShow18] = useState(false);

  const handleClose18 = () => setShow18(false);
  const handleShow18 = () => {
    setShow18(true);
    setTimeout(() => {
      setShow18(false);
    }, 2000);
  };

  const [show19, setShow19] = useState(false);

  const handleClose19 = () => setShow19(false);
  const handleShow19 = () => setShow19(true);

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

  // create family
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (box) => {
    // console.log(box)
    if (box.close_amount === null) {
      setSelectedBox(box);
      setShow19(true);
      setShow(false)
    } else {
      setSelectedBox(box);
      setShow17(true);
    }
  };
  // create family success
  const [showCreSuc, setShowCreSuc] = useState(false);
  const handleCloseCreSuc = () => setShowCreSuc(false);
  const handleShowCreSuc = () => {
    setShowCreSuc(true);
    setTimeout(() => {
      setShowCreSuc(false);
    }, 2000);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // **************************************API******************************************************
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalOrder, setShowModalOrder] = useState(false);
  const [cashier, setCashier] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedBoxDetails, setSelectedBoxDetails] = useState(null);
  const [editedBoxName, setEditedBoxName] = useState('');
  const [editedCashierId, setEditedCashierId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [showDelModal, setShowDelModal] = useState(false); // State for delete confirmation modal
  const [isProcessing, setIsProcessing] = useState(false);
  const [allpayments, setAllpayments] =useState([]);

  const navigate = useNavigate();
  const handleEdit = (box) => {
    setSelectedBox(box[0]);
    setEditedBoxName(box[0]?.name);
    setEditedCashierId(box[0]?.user_id);
    setShow(true);
  };

  // update box
  const handleSaveChanges = async () => {
    if (!selectedBox) return;
    handleClose();

    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/box/update/${selectedBox.id}`,
        {
          name: editedBoxName,
          user_id: editedCashierId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update was successful
        handleShowCreSuc();
        handleClose();
        // Refresh the box data
        setBoxName(prev => prev.map(box =>
          box.id === selectedBox.id ? { ...box, name: editedBoxName, user_id: editedCashierId } : box
        ));

        fetchAllBox();

        getBox();
        if (response.data && response.data.notification) {
          //enqueueSnackbar (response.data.notification, { variant: 'success' });
          // playNotificationSound();;
        }
        console.log("Update Successfully");
      } else {
        // Handle error
        console.error('Failed to update box');
        //enqueueSnackbar (response.data?.alert, { variant: 'error' })
        // playNotificationSound();;
      }
    } catch (error) {
      console.error('Error updating box:', error);
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;

    }
    setIsProcessing(false);
  };
  // delete box 
  const handleDelete = async () => {
    if (!selectedBox) return;
    setShowDeleteModal(false); // Close the modal
    setIsProcessing(true);
    try {
      const response = await axios.delete(`${apiUrl}/box/delete/${selectedBox.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Deletion was successful
        fetchAllBox(); // Refresh the box data

        setShowDelModal(true);
        setTimeout(() => {
          setShowDelModal(false); // Hide success modal
          navigate('/caja'); // Navigate to caja page
        }, 2000);
        if (response.data && response.data.notification) {
          //enqueueSnackbar (response.data.notification, { variant: 'success' });
          // playNotificationSound();;
        }
        console.log("Box deleted successfully");
        // navigate('/caja');
      } else {
        console.error('Failed to delete box');
        //enqueueSnackbar (response.data?.alert, { variant: 'error' })
        // playNotificationSound();;
      }
    } catch (error) {
      console.error('Error deleting box:', error);
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;
    }
    setIsProcessing(false);
  };

  // const [orders, setOrders] = useState([]);
  const fetchAllOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/order/getAll`,
        { admin_id: admin_id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const filteredOrders = response.data.filter(order => order.box_id == bId);
      setAllOrder(filteredOrders);
      // setOrders(response.data);
    } catch (error) {
      console.error("Error fetching boxes:", error);
    }
    setIsProcessing(false);
  };
  const fetchAllpayment = async() =>{
    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/get-payments`,{admin_id:admin_id},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAllpayments(response.data.result);

    } catch (error) {
      console.error("Error fetching boxes:", error);
    }
    setIsProcessing(false);
  }

  const fetchAllTable = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/sector/getWithTable`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAllTable(response.data.data);

    } catch (error) {
      console.error("Error fetching boxes:", error);
    }
    setIsProcessing(false);
  };
  const fetchAllBox = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(
        `${apiUrl}/get-boxlogs-all/${bId}?from_month=${selectedDesdeMonth}&to_month=${selectedHastaMonth}`,
        {
          // const response = await axios.get(`${API_URL}/getAllboxes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setData(
        response.data.map((box) => ({
          ...box,
          createdAt: new Date(box.created_at).toLocaleString() // Assuming the API returns a 'created_at' field
        }))
        // .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );
      // setNotificationMessage(response.data.notification || response.data.alert);
      // //enqueueSnackbar (response.data.notification, { variant: 'success' });
      // // playNotificationSound();;
      // console.log("sdjjisdbdb", response.data)

    } catch (error) {
      console.error("Error fetching boxes:", error);
      // //enqueueSnackbar (error?.response?.data?.alert || "Error fetching boxes", { variant: 'error' });
    }
    setIsProcessing(false);
  };

  // console.log(data);

  const fetchAllBoxReport = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(
        `${apiUrl}/box/orderReport/${bId}?from_month=${selectedDesdeMonthReport}&to_month=${selectedHastaMonthReport}`,
        {
          // const response = await axios.get(`${API_URL}/getAllboxes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data && response.data.notification) {
        //enqueueSnackbar (response.data.notification, { variant: 'success' });
        // playNotificationSound();;
      }
      // playNotificationSound();;
      // // playNotificationSound();;
    } catch (error) {
      console.error("Error fetching boxes:", error);
      // //enqueueSnackbar (error?.response.data.alert, { variant: 'error' });
      //enqueueSnackbar (error?.response.data.alert, { variant: 'error' })
      // playNotificationSound();;
      // // playNotificationSound();;
    }
    setIsProcessing(false);
  };
  useEffect(
    () => {
      if (!(role == "admin" || role == "cashier")) {
        navigate('/dashboard')
        // alert(role)
      } else {
        if (token) {

          fetchAllBox();
          fetchUser();
          getBox();
          fetchAllBoxReport();
          fetchAllOrder();
          fetchAllTable();
          getUser();
          fetchAllpayment();
        }
      }
    },
    [token, selectedDesdeMonth, selectedHastaMonth, selectedDesdeMonthReport, selectedHastaMonthReport, role]
  );

  // get box
  const getBox = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${apiUrl}/get-boxs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const filteredItem = response.data.filter(item => item.id == bId);
      setBoxName(filteredItem);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching boxes:", error);
    }
    setIsProcessing(false);
  };

  //   get User
  const getUser = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/get-user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserName(response.data);
    } catch (error) {
      console.error("Error fetching boxes:", error);
    }
  };

  // Fetch all users
  const fetchUser = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${apiUrl}/get-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      const cashiers = response.data.filter(user => user.role_id === 2);
      setCashier(cashiers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setIsProcessing(false);
  };

  const handleShowDetails = (box) => {
    setSelectedBox(box);
    // Assuming box.close_amount === null will trigger show19 and not show177
    if (box.close_amount === null) {
      setShow19(true);
    } else {
      setShow17(true);
    }
  };
  // open box
  const handleOpenBox = async () => {
    if (!bId) return; // Ensure a box is selected


    if (data.length > 0) {
      const check = data[data.length - 1].close_amount
      if (!check) {
        setErrorOpenPrice("La caja ya está abierta."); // Set error message
        return; // Exit the function
      }
    }
    handleClose16();
    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/box/statusChange`,
        {
          box_id: bId, // Pass the box ID
          open_amount: openPrice,  // Pass the open amount
          admin_id: admin_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        handleShow18(); // Show success modal
        fetchAllBox(); // Refresh box data
        console.log("open box successfully")
        handleClose16();
        if (response.data && response.data.notification) {
          //enqueueSnackbar (response.data.notification, { variant: 'success' });
          // playNotificationSound();;
        }
        // playNotificationSound();;
      } else {
        console.error('Failed to open box');
        //enqueueSnackbar (response.data?.alert, { variant: 'error' })
        // playNotificationSound();;
      }
    } catch (error) {
      console.error('Error opening box:', error);
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;
    }
    setIsProcessing(false);
  };
  // close box

  const handleCloseBox = async () => {
    if (!bId) return; // Ensure a box is selected
    // console.log("close Price", closePrice)
    // console.log("cashier Price", pricesecond)
    handleClose11();
    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/box/statusChange`, // Replace with the correct endpoint
        {
          box_id: bId, // Pass the box ID
          close_amount: closePrice, // Pass the close amount
          cash_amount: pricesecond,
          admin_id: admin_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        handleShow12(); // Show success modal
        handleClose11();
        fetchAllBox(); // Refresh box data
        console.log("Box closed successfully");
        if (response.data && response.data.notification) {
          //enqueueSnackbar (response.data.notification, { variant: 'success' });
          // playNotificationSound();;
        }
        // playNotificationSound();;

      } else {
        console.error('Failed to close box');
        //enqueueSnackbar (response.data?.alert, { variant: 'error' })
        // playNotificationSound();;
      }
    } catch (error) {
      console.error('Error closing box:', error);
      //enqueueSnackbar (error?.response?.data?.alert, { variant: 'error' })
      // playNotificationSound();;
    }
    setIsProcessing(false);
  };


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
    if (selectedDesdeMonthReport > selectedHastaMonthReport) {
      setErrorReport("Hasta month must be greater than or equal to Desde month.");
      setData([]);
      return;
    }
    setIsProcessing(true);
    try {

      // Fetch box report details from the API
      const responseB = await axios.get(
        `${apiUrl}/get-boxlogs-all/${bId}?from_month=${selectedDesdeMonthReport}&to_month=${selectedHastaMonthReport}`,
        {
          // const response = await axios.get(`${API_URL}/getAllboxes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // console.log(responseB.data);

      const boxData = responseB.data.map((box) => {
        return {
          Horario_de_apertura: new Date(box.created_at).toLocaleString(), // Corrected to format date and time
          Horario_de_cierre: box.close_time || "N/A", // Handle potential null values
          Monto_inicial: "$" + box.open_amount,
          Monto_final: "$" + box.close_amount || "N/A", // Handle potential null values
          Estado: box.close_amount === null ? "Abierta" : "Cerrada"
        };
      })

      // console.log(boxData);

      const ws = XLSX.utils.json_to_sheet(boxData, { origin: "A2" });

      // Add a heading "Reporte de Entrega"
      XLSX.utils.sheet_add_aoa(ws, [["Historial"]], { origin: "A1" });
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }]; // Merge cells for the heading

      // Add column names only if there is data
      if (boxData.length > 0) {
        const columnNames = ["Horario de apertura", "Horario de cierre", " Monto inicial", "Monto final"];
        XLSX.utils.sheet_add_aoa(ws, [columnNames], { origin: "A2" })
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
      const colWidths = [{ wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
      ws["!cols"] = colWidths;

      // Add sorting functionality
      ws['!autofilter'] = { ref: `A2:E${boxData.length}` }; // Enable autofilter for the range

      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Historial");


      // =======infomation=======
      const infomation = {
        Nombre_caja: boxName[0]?.name,
        Fecha_creación: boxName[0]?.created_at ? new Date(boxName[0]?.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
        Cuantas_aperturas: data.filter(item => item.open_amount !== null).length,
        Cuantos_cierres: data.filter(item => item.close_amount !== null).length
      };

      const formattedData = Object.entries(
        infomation
      ).map(([key, value]) => ({
        Campo: key,
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
      XLSX.utils.book_append_sheet(wb, wsi, "Información");

      // =============== Movements =============


      const Movimientos = allOrder.map((user, index) => {

        const matchedSector = allTable.find(sector =>
          sector.tables.some(table => table.id === user.table_id)
        );

        // Get the sector name if a match is found
        const sectorName = matchedSector ? matchedSector.name : "";
        return {
          Pedido: user.id, // Corrected to format date and time
          Sector: sectorName, // Handle potential null values
          Mesa: user.table_id,
          Fecha: new Date(user.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }), // Handle potential null values
          Código_transacción: user.codigo,
          Estado: user.status === "received" ? "Recibido" :
            user.status === "prepared" ? "Preparado" :
              user.status === "delivered" ? "Entregado" :
                user.status === "finalized" ? "Finalizado" :
                  user.status === "withdraw" ? "Retirar" :
                    user.status === "local" ? "Local" :
                      user.status === "cancelled" ? "Cancelada" : "Unknown"
        };
      })

      // console.log(boxData);

      const wsM = XLSX.utils.json_to_sheet(Movimientos, { origin: "A2" });

      // Add a heading "Reporte de Entrega"
      XLSX.utils.sheet_add_aoa(wsM, [["Movimientos"]], { origin: "A1" });
      wsM["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }]; // Merge cells for the heading

      // Add column names only if there is data
      if (Movimientos.length > 0) {
        const columnNames = ["Pedido", "Sector", "Mesa", "Fecha", "Código transacción", "Estado"];
        XLSX.utils.sheet_add_aoa(wsM, [columnNames], { origin: "A2" })
      }

      // Apply styles to the heading
      wsM["A1"].s = {
        font: { name: "Aptos Narrow", bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" }
      };

      // Set row height for the heading
      if (!wsM["!rows"]) wsM["!rows"] = [];
      wsM["!rows"][0] = { hpt: 30 };
      wsM["!rows"][1] = { hpt: 25 }; // Set height for column names

      // Auto-size columns
      const colWidthsM = [{ wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
      wsM["!cols"] = colWidthsM;

      // Add sorting functionality
      wsM['!autofilter'] = { ref: `A2:F${Movimientos.length}` }; // Enable autofilter for the range

      // Create a workbook

      XLSX.utils.book_append_sheet(wb, wsM, "Movimientos");

      const desdeMonthName = monthNames[selectedDesdeMonthReport - 1];
      const hastaMonthName = monthNames[selectedHastaMonthReport - 1];
      XLSX.writeFile(
        wb,
        `Reporte de Caja ${desdeMonthName}-${hastaMonthName}.xlsx`
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
  // print recipe 
  // const handlePrint = () => {
  //   const printElement = document.getElementById('printable');
  //   const printWindow = window.open('', '_blank', 'height=600,width=700');
  //   printWindow.document.write(printElement.outerHTML);
  //   printWindow.focus();
  //   printWindow.print();
  //   printWindow.close();
  // }
  const handlePrint = () => {
    const printContent = document.getElementById("printable");
    if (printContent) {
      // Create a new iframe
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // Write the receipt content into the iframe
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(
        "<html><head><title>Print Receipt</title>"
      );
      iframe.contentWindow.document.write(
        "<style>body { font-family: Arial, sans-serif; }</style>"
      );
      iframe.contentWindow.document.write("</head><body>");
      iframe.contentWindow.document.write(printContent.innerHTML);
      iframe.contentWindow.document.write("</body></html>");
      iframe.contentWindow.document.close();

      // Wait for the iframe to load before printing
      iframe.onload = function () {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          console.error("Printing failed", e);
        }
        // Remove the iframe after printing (or if printing fails)
        setTimeout(() => {
          document.body.removeChild(iframe);

        }, 500);
      };
    } else {
      console.error("Receipt content not found");
    }
  };


  const [results, setResults] = useState([]);
  // recipt sumation


  // const fetchOrderDiscounts = async () => {
  //   const discountPromises = data.map(async (item) => {
  //     if (item.order_master_id) {
  //       const orderIds = item.order_master_id.split(','); // Split by comma
  //       const orderDiscounts = await Promise.all(orderIds.map(async (id) => {
  //         const response = await axios.get(`${apiUrl}/order/getSingle/${id}`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           }
  //         });
  //         return { id, discount: parseFloat(response.data.discount) || 0 }; // Ensure discount is a number
  //       }));
  //       const totalDiscount = orderDiscounts.reduce((sum, order) => sum + order.discount, 0); // Sum all discounts
  //       return { id: item.id, totalDiscount }; // Return id and total discount
  //     }
  //     return { id: item.id, totalDiscount: 0 }; // Return 0 if no order_master_id
  //   });

  //   try {
  //     const results = await Promise.all(discountPromises);
  //     setResults(results); // Set results in state
  //     console.log("Discounts by Data ID:", results); // Log discounts grouped by data.id
  //   } catch (error) {
  //     console.error("Error fetching discounts:", error);
  //   }
  // };



  const fetchOrderDiscounts = async () => {
    const discountPromises = data.map(async (item) => {
      let totalDiscount = 0;
      let totalTax = 0;
      const totalPaymentByType = {}; //

      if (item.order_master_id) { // Check for order_master_id if payment_id is not present
        // const orderIds = item.order_master_id.split(','); // Split by comma

        const orderIds = item.order_master_id.split(','); // Split by comma
        const orderDiscounts = await Promise.all(orderIds.map(async (id) => {
          const response = await axios.post(`${apiUrl}/order/getSingle/${id}`, { admin_id: admin_id }, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          return { id, discount: parseFloat(response.data.discount) || 0 }; // Ensure discount is a number
        }));
        totalDiscount = orderDiscounts.reduce((sum, order) => sum + order.discount, 0); // Sum all discounts
      }
      if (item.payment_id) {
        const paymentIds = item.payment_id.split(','); // Split by comma
        const paymentDetails = await Promise.all(paymentIds.map(async (id) => {
          try {
            const response = await axios.post(`${apiUrl}/getsinglepaymentById/${id}`, { admin_id: admin_id }, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });

            // Check if response data is valid
            if (response.data && response.data.data) {
              const tax = parseFloat(response.data.data.tax) || 0; // Ensure tax is a number
              totalTax += tax; // Sum the tax

              // Store type and amount from the response
              const paymentType = response.data.data.type; // Store the payment type
              const paymentAmount = parseFloat(response.data.data.amount); // Store the payment amount as a number
              // console.log(paymentType, paymentAmount);

              // Create or update the total for the payment type
              if (!totalPaymentByType[paymentType]) {
                totalPaymentByType[paymentType] = 0; // Initialize if it doesn't exist
              }
              totalPaymentByType[paymentType] += paymentAmount; // Accumulate the total
            } else {
              console.error(`Invalid response for payment ID ${id}:`, response.data);
            }
          } catch (error) {
            console.error(`Error fetching payment details for ID ${id}:`, error);
          }
        }));

        // Return the accumulated results for this item
        return { id: item.id, totalDiscount, totalTax, totalPaymentByType };
      }

      return { id: item.id, totalDiscount, totalTax: totalTax }; // Return totalTax even if no payment_id
    });

    try {
      const results = await Promise.all(discountPromises);
      const filteredResults = results.filter(result => result.totalTax > 0 || result.totalDiscount > 0); // Filter out items with no tax and no discount
      setResults(filteredResults); // Set results in state
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  // Call this function where appropriate, e.g., in a useEffect or event handler



  useEffect(() => {
    fetchOrderDiscounts();
  }, [data]);
  const getDiscountForBox = (boxId) => {
    const discountData = results.find(result => result.id === boxId);
    return discountData ? { discount: discountData.totalDiscount, tax: discountData.totalTax, type: discountData.totalPaymentByType } : { discount: 0, tax: 0 }; // Return discount and tax or 0 if not found
  };
  const [showpay ,setShowpay] = useState(false);

  const handleClosepay = () =>{
    setShowpay(true);
    setTimeout(() => {
      setShowpay(false);
    }, 2000);
    
  }

  const handleorderRecipt = (data) => {

    const payament = allpayments.some((v)=>v.order_master_id == data.id)
    // console.log(payament);
    if(payament){
      setShowModalOrder(true)
    }else{
      handleClosepay()
    }
  }

  return (
    <section>
      <div className="s_bg_dark">
        <Header />
        <div className="d-flex flex-column flex-lg-row">
          <div>
            <Sidenav />
          </div>
          <div className="flex-grow-1 sidebar">

            <div>
              <div className="py-3 px-4 sjbg_gay sj_border sjmargin">
                {/* <button className="sj_btn"><img src={icon5} className="px-2" /> </button> */}
                <Link to="/caja" className="sj_A">
                  <button className="bj-btn-outline-primary  j-tbl-btn-font-1 btn">
                    <HiOutlineArrowLeft className="j-table-datos-icon" />Regresar
                  </button>
                </Link>
                <div className="row pt-4 text-white justify-content-between text-white sjd-flex">
                  <div className="col-12 col-md-3 mb-3 mb-md-0 j_caja_p">
                    <p className="mb-0">Información {boxName[0]?.name}</p>
                  </div>
                  <div className="col-12 col-md-9">
                    <div className="d-flex flex-wrap justify-content-md-end gap-2 sjd-flex row-gap-2">

                      {(data.length === 0 || data[data.length - 1]?.close_amount != null) && (
                        <button
                          type="button"
                          onClick={handleShow16}
                          className="sjSky px-2 j-tbl-font-3"
                        >
                          <img src={home3} className="px-2" /> Abrir Caja
                        </button>
                      )}

                      <Modal
                        show={show16}
                        onHide={handleClose16}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal jay-modal"
                      >
                        <Modal.Header
                          closeButton
                          className="j-caja-border-bottom p-0 m-3 mb-0 pb-3"
                        >
                          <Modal.Title className="modal-title j-caja-pop-up-text-1">
                            Abrir caja
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <label
                            htmlFor="sj"
                            className="j-tbl-font-2 mb-1 mt-0"
                          >
                            Monto inicial
                          </label>
                          <input
                            type="text"
                            className="sj_modelinput"
                            placeholder="$ 0.00"
                            value={`$ ${openPrice}`} // Add the dollar sign to the displayed value
                            onChange={(e) => {
                              // Remove the dollar sign and any non-numeric characters before updating the state
                              const value = e.target.value.replace(/[^0-9.]/g, '');
                              setOpenPrice(value);
                              setErrorOpenPrice(""); // Clear error if input is empty

                            }}
                          />
                          {errorOpenPrice && <div className="text-danger errormessage">{errorOpenPrice}</div>}
                        </Modal.Body>
                        <Modal.Footer className="sjmodenone">
                          <Button
                            variant="primary"
                            className="btn j-btn-primary text-white j-caja-text-1"
                            onClick={() => {
                              if (!openPrice || isNaN(openPrice) || parseFloat(openPrice) <= 0) {
                                setErrorOpenPrice("Monto inicial debe ser un número positivo."); // Set error if validation fails
                              } else {
                                handleOpenBox(); // Call the new function here
                              }
                            }}
                          >
                            Abrir caja
                          </Button>
                        </Modal.Footer>
                      </Modal>

                      <Modal
                        show={show18}
                        onHide={handleClose18}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal jay-modal"
                      >
                        <Modal.Header closeButton className="border-0" />
                        <Modal.Body>
                          <div className="text-center">
                            <img
                              src={require("../Image/check-circle.png")}
                              alt=""
                            />
                            <p className="mb-0 mt-2 h6 j-tbl-pop-1">
                              Caja abierta
                            </p>
                            <p className="opacity-75 j-tbl-pop-2">
                              exitosamente
                            </p>
                          </div>
                        </Modal.Body>
                      </Modal>
                      <Modal
                        show={showpay}
                        onHide={handleClosepay}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal jay-modal"
                      >
                        <Modal.Header closeButton className="border-0" onClick={() => { setShowpay(false) }} />
                        <Modal.Body>
                          <div className="text-center">
                            {/* <img
                              src={require("../Image/check-circle.png")}
                              alt=""
                            /> */}
                            <p className="mb-0 mt-2 h6 j-tbl-pop-1">

                            </p>
                            <p className="opacity-75 j-tbl-pop-2">
                              Panding de pago para este pedid
                            </p>
                          </div>
                        </Modal.Body>
                      </Modal>
                      <button
                        className="j-canvas-btn2 btn j-tbl-font-3  bj-btn-outline-primary"
                        onClick={handleShow15}
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
                              fillRule="evenodd"
                              d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Generar Reporte
                        </div>
                      </button>
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

                      <button
                        data-bs-theme="dark"
                        className="j-canvas-btn2 j-tbl-font-3  btn bj-btn-outline-primary"
                        onClick={() => handleEdit(boxName)}
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
                              fillRule="evenodd"
                              d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                              clipRule="evenodd"
                            />
                            <path
                              fillRule="evenodd"
                              d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546 .578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Editar
                        </div>
                      </button>


                      {/* edit */}
                      <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal"
                      >
                        <Modal.Header
                          closeButton
                          className="m_borbot j-caja-border-bottom p-0 m-3 mb-0 pb-3"
                        >
                          <Modal.Title className="j-tbl-text-10">
                            Editar caja
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="border-0">
                          <div className="mb-3">
                            <label
                              htmlFor="boxName"
                              className="form-label j-tbl-font-11"
                            >
                              Nombre caja
                            </label>
                            <input
                              type="text"
                              className="form-control j-table_input"
                              placeholder="Caja#"
                              id="boxName"
                              value={editedBoxName}
                              onChange={(e) => setEditedBoxName(e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label
                              htmlFor="cashierSelect"
                              className="form-label j-tbl-font-11"
                            >
                              Cajero asignado
                            </label>
                            <select
                              className="form-select b_select border-0 py-2"
                              style={{ borderRadius: "6px" }}
                              aria-label="Selecciona un título"
                              id="cashierSelect"
                              value={editedCashierId}
                              onChange={(e) => setEditedCashierId(e.target.value)}
                            >
                              <option value="0">Cajero asignado</option>
                              {cashier.map(user => (
                                <option key={user.id} value={user.id}>
                                  {user.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Modal.Body>
                        <Modal.Footer className="sjmodenone justify-content-between pt-0">
                          <div>
                            <Button
                              variant="primary"
                              className="btn j-btn-primary text-white j-caja-text-1 me-2"
                              onClick={handleSaveChanges}
                            >
                              Guardar combios
                            </Button>
                            <Button
                              className="btn j-btn-White text-white j-caja-text-1"
                              onClick={() => {
                                handleClose();
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>

                          <Button
                            variant="secondary"
                            className="btn sjredbtn b_btn_close j-caja-text-1"
                            onClick={() => { setShowDeleteModal(true); handleClose() }} // Show delete confirmation modal
                          >
                            Eliminar
                          </Button>
                        </Modal.Footer>
                      </Modal>

                      {/* Delete Confirmation Modal */}
                      <Modal
                        show={showDeleteModal}
                        onHide={() => setShowDeleteModal(false)}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal jay-modal"
                      >
                        <Modal.Header closeButton className="border-0" />


                        <Modal.Body>
                          <div className="text-center">
                            <img
                              src={require("../Image/trash-outline-secondary.png")}
                              alt=" "
                            />
                            <p className="mb-0 mt-2 h6">
                              {" "}
                              ¿Estás seguro de que deseas eliminar esta caja?
                            </p>
                          </div>
                        </Modal.Body>
                        <Modal.Footer className="border-0">
                          <Button variant="danger" className="j-tbl-btn-font-1 b_btn_close" onClick={handleDelete}>
                            Sí, Eliminar
                          </Button>
                          <Button variant="secondary" className="j-tbl-btn-font-1 " onClick={() => setShowDeleteModal(false)}>
                            Cancelar
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      {/* delete message */}
                      <Modal
                        show={showDelModal}
                        onHide={() => setShowDelModal(false)}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal"
                      >
                        <Modal.Header closeButton className="border-0" />
                        <Modal.Body>
                          <div className="text-center">
                            <img
                              src={require("../Image/trash-check 1.png")}
                              alt=""
                            />
                            <p className="mb-0 mt-2 h6 j-tbl-pop-1">Caja</p>
                            <p className="opacity-75 j-tbl-pop-2">
                              Eliminar caja exitosamente
                            </p>
                          </div>
                        </Modal.Body>
                      </Modal>
                      {/* edit success */}
                      <Modal
                        show={showCreSuc}
                        onHide={handleCloseCreSuc}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal"
                      >
                        <Modal.Header closeButton className="border-0" />
                        <Modal.Body>
                          <div className="text-center">
                            <img
                              src={require("../Image/check-circle.png")}
                              alt=""
                            />
                            <p className="mb-0 mt-2 h6 j-tbl-pop-1">Caja</p>
                            <p className="opacity-75 j-tbl-pop-2">
                              Los cambios han sido guardados exitosamente
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
                          <p></p>
                          <Spinner animation="border" role="status" style={{ height: '85px', width: '85px', borderWidth: '6px' }} />
                          <p className="mt-2">Procesando solicitud...</p>
                        </Modal.Body>
                      </Modal>

                      {data.length > 0 && data[data.length - 1]?.close_amount == null && (
                        <button
                          className="sjredbtn px-2 j-tbl-font-3"
                          onClick={handleShow11}
                        >
                          Cerrar caja
                        </button>
                      )}

                      <Modal
                        show={show11}
                        onHide={handleClose11}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal jay-modal"
                      >
                        <Modal.Header className="j-caja-border-bottom p-0 m-3 mb-0 pb-3">
                          <Modal.Title className="modal-title j-caja-pop-up-text-1">
                            Cerrar Caja
                          </Modal.Title>
                          <Button
                            variant="secondary"
                            className="btn-close text-white"
                            onClick={handleClose11}
                          />
                        </Modal.Header>
                        <Modal.Body>
                          <p className="j-caja-text-1">
                            Completa el "Registro de efectivo" para comparar y
                            detectar cualquier irregularidad en el cierre de
                            caja{" "}
                          </p>
                          <div className="mb-3">

                            <label htmlFor="final" className="j-caja-text-1 mb-2">
                              Monto final
                            </label>
                            <input
                              type="text"
                              id="final"
                              className="sj_modelinput j-tbl-information-input py-2 px-3 opacity-75"
                              value={`$${closePrice}`}
                              onChange={handleprice}
                            />
                            {errorClosePrice && <div className="text-danger errormessage">{errorClosePrice}</div>}
                          </div>

                          <br />
                          <label htmlFor="final" className="j-caja-text-1 mb-2">
                            Monto efectivo
                          </label>
                          <input
                            type="text"
                            id="final"
                            className="sj_modelinput j-tbl-information-input py-2 px-3 opacity-75"
                            value={`$${pricesecond}`}
                            onChange={handlepricesecond}
                          />
                          {errorCashPrice && <div className="text-danger errormessage">{errorCashPrice}</div>}

                        </Modal.Body>
                        <Modal.Footer className="sjmodenone">
                          <Button
                            variant="secondary"
                            className="btn bg-transparent  j-caja-text-1"
                            onClick={handleClose11}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="primary"
                            className="btn j-btn-primary text-white j-caja-text-1"
                            onClick={() => {
                              // Check if closePrice is greater than openPrice
                              if (parseFloat(closePrice) < parseInt(data[data.length - 1]?.open_amount, 10)) {
                                setErrorClosePrice("El monto final debe ser mayor que el monto inicial."); // New error message
                              } else if (!closePrice || isNaN(closePrice) || parseFloat(closePrice) <= 0) {
                                setErrorClosePrice("Monto inicial debe ser un número positivo."); // Set error if validation fails
                              } else if (!pricesecond || isNaN(pricesecond) || parseFloat(pricesecond) <= 0) {
                                setErrorCashPrice("Monto efectivo debe ser un número positivo."); // Set error if validation fails
                              } else if (parseFloat(pricesecond) > parseFloat(closePrice)) {
                                setErrorCashPrice("Monto efectivo no puede ser mayor que el monto final."); // Set error if validation fails
                              } else {
                                handleCloseBox(); // Call the new function here
                              }
                            }}
                          >
                            Confirmar
                          </Button>
                        </Modal.Footer>
                      </Modal>

                      <Modal
                        show={showModal12}
                        onHide={handleClose12}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal jay-modal"
                      >
                        <Modal.Header closeButton className="border-0" />
                        <Modal.Body>
                          <div className="text-center">
                            <img
                              src={require("../Image/check-circle.png")}
                              alt=""
                            />
                            <p className="mb-0 mt-2 h6 j-tbl-pop-1">Caja</p>
                            <p className="opacity-75 j-tbl-pop-2">
                              Cierre de caja exitosamente
                            </p>
                          </div>
                        </Modal.Body>
                      </Modal>

                    </div>
                  </div>


                  {isModalOpen && (
                    <div className="modal text-white">
                      <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <p>Modal Content Goes Here</p>
                      </div>
                    </div>
                  )}
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
                  title="Historial"
                  className=" text-white m_bgblack  rounded"
                >
                  <div className="d-flex justify-content-between px-4  py-3 text-white sjd-flex">
                    <div>
                      <p className="mb-1 j-caja-text-1">
                        Cantidad de pedidos
                      </p>
                      <input
                        type="text"
                        value={data?.length}
                        className="sjinput sj_full"
                        disabled
                      />
                    </div>
                    <div className="d-flex justify-content-end gap-4">
                      <div>
                        <label className="mb-1 j-caja-text-1">Desde</label>

                        <select
                          className="form-select  b_select border-0 py-2  "
                          style={{ borderRadius: "8px" }}
                          aria-label="Default select example"
                          value={selectedDesdeMonth}
                          onChange={(e) =>
                            setSelectedDesdeMonth(e.target.value)}
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
                      <div>
                        <label className="mb-1 j-caja-text-1">Hasta</label>
                        <select
                          className="form-select  b_select border-0 py-2  "
                          style={{ borderRadius: "8px" }}
                          aria-label="Default select example"
                          value={selectedHastaMonth}
                          onChange={(e) =>
                            setSelectedHastaMonth(e.target.value)}
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
                    </div>
                  </div>
                  <div className="d-flex w-auto justify-content-end gap-5">
                    {error && (
                      <div className="alert alert-danger d-flex justify-content-between pointer">
                        {error}{" "}
                        <div
                          className="text-black d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            setError("");
                            setSelectedDesdeMonth(1);
                          }}
                        >
                          <RiCloseLargeFill />{" "}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-white py-3" style={{ height: data.length === 0 ? "calc(-370px + 100vh)" : "auto" }}>
                    <table className="sj_table b_table1">
                      <thead>
                        <tr className="sjtable_dark flex-nowrap">
                          <th className="p-3">Horario de apertura</th>
                          <th>Horario de cierre</th>
                          <th>Monto inicial</th>
                          <th>Monto final</th>
                          <th>Estado</th>
                          <th>Acción</th>
                          <th>Imprimir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length > 0 ? (
                          data.map((box, index) => (
                            <tr
                              key={box.id}
                              className="sjbordergray j-caja-text-2"
                            >
                              <td className="p-3">{box.createdAt}</td>

                              <td>{box.close_time}</td>
                              <td>{box.open_amount}</td>

                              <td>{box.close_amount || "N/A"}</td>
                              <td>
                                <button
                                  className={`j-tbl-font-3 ${box.close_amount ===
                                    null
                                    ? "sj_lightsky"
                                    : "j-bgcolor-caja"}`}
                                  onClick={() => handleShow(box)}
                                >
                                  {box.close_amount === null ? (
                                    "Abierta"
                                  ) : (
                                    "Cerrada"
                                  )}
                                </button>
                              </td>
                              <td>
                                <button
                                  className="sjSky px-2 j-tbl-font-3"
                                  onClick={() => {
                                    const discount = getDiscountForBox(box.id); // Get the discount for the selected box
                                    setSelectedBoxDetails({ box, discount }); handleShowDetails(box)
                                  }}
                                >
                                  Ver detalles
                                </button>
                              </td>
                              <td>
                                {box.close_amount ? (
                                  <>

                                    <button className="bg-transparent border-0" onClick={() => {
                                      const discount = getDiscountForBox(box.id); // Get the discount for the selected box
                                      setSelectedBoxDetails({ box, discount }); // Pass both box and discount to the modal
                                      setShowModal(true);
                                    }}> {/* Update to show modal */}
                                      <svg
                                        className="sj-button-xise"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>

                                  </>

                                ) : (
                                  <svg
                                    className="sjtablewhite"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">No hay datos disponibles</td>
                          </tr>
                        )}
                      </tbody>

                      <Modal
                        show={show19}
                        onHide={handleClose19}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal s_model_newww"
                      >
                        <Modal.Header
                          closeButton
                          className="j-caja-border-bottom p-0 m-3 mb-0 pb-3"
                        >
                          <Modal.Title className="modal-title j-caja-pop-up-text-1 ">
                            Detalles cajac
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div>
                            <div className="d-flex align-items-center mb-2 ">
                              <div className="j-caja-information" />
                              <p className="d-inline ps-2 sjtext mb-0">
                                Caja abierta
                              </p>
                            </div>
                            <div className="row pt-3">
                              <div className="col-12 col-md-6 mb-3 ps-0">
                                <label
                                  htmlFor="quien-abrio"
                                  className="sjtext"
                                >
                                  Quién abrió caja
                                </label>
                                <input
                                  type="text"
                                  id="quien-abrio"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={users.find(user => user.id === selectedBox?.open_by)?.name || ""}

                                />
                              </div>
                              <div className="col-12 col-md-6 mb-3 pe-0">
                                <label
                                  htmlFor="quien-cerro"
                                  className="sjtext"
                                >
                                  Quién cerró caja
                                </label>
                                <input
                                  type="text"
                                  id="quien-cerro"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={users.find(user => user.id === selectedBox?.close_by)?.name || ""}
                                />
                              </div>
                            </div>
                            <div className="row pt-2">
                              <div className="col-12 col-md-6 mb-3 ps-0">
                                <label
                                  htmlFor="fecha-apertura"
                                  className="sjtext"
                                >
                                  Fecha apertura
                                </label>
                                <input
                                  type="text"
                                  id="fecha-apertura"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={new Date(selectedBox?.open_time).toLocaleDateString()}
                                />
                              </div>
                              <div className="col-12 col-md-6 mb-3 pe-0">
                                <label
                                  htmlFor="hora-apertura"
                                  className="sjtext"
                                >
                                  Hora apertura
                                </label>
                                <input
                                  type="text"
                                  id="hora-apertura"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={new Date(selectedBox?.open_time).toLocaleTimeString() || ""}
                                />
                              </div>
                            </div>
                            <div className="row pt-3">
                              <div className="col-12 col-md-6 mb-3 ps-0">
                                <label
                                  htmlFor="fecha-cierre"
                                  className="sjtext"
                                >
                                  Fecha cierre
                                </label>
                                <input
                                  type="text"
                                  id="fecha-cierre"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={selectedBox?.close_time ? new Date(selectedBox.close_time).toLocaleDateString() : ""}
                                />

                              </div>
                              <div className="col-12 col-md-6 mb-3 pe-0">
                                <label
                                  htmlFor="hora-cierre"
                                  className="sjtext"
                                >
                                  Hora cierre
                                </label>
                                <input
                                  type="text"
                                  id="hora-cierre"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={selectedBox?.close_time ? new Date(selectedBox.close_time).toLocaleTimeString() : ""}
                                />
                              </div>
                            </div>
                            <div className="row pt-3">
                              <div className="col-12 col-md-6 mb-3 ps-0">
                                <label
                                  htmlFor="monto inicial"
                                  className="sjtext"
                                >
                                  Monto inicial
                                </label>
                                <input
                                  type="text"
                                  id="monto inicial"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="$"
                                  value={`$${selectedBox?.open_amount || ""}`}
                                />
                              </div>
                              <div className="col-12 col-md-6 mb-3 pe-0">
                                <label
                                  htmlFor="monto final"
                                  className="sjtext"
                                >
                                  Monto final
                                </label>
                                <input
                                  type="text"
                                  id="monto final"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="$"
                                  value={`$${selectedBox?.close_amount || "0.00"}`}
                                />
                              </div>
                            </div>
                            <div className="row pt-3">
                              <div className="col-12 col-md-6 mb-3 ps-0">
                                <label htmlFor="ingreso" className="sjtext">
                                  Ingreso
                                </label>
                                <input
                                  type="text"
                                  id="ingreso"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="$"
                                  value={`$${(selectedBox?.close_amount && selectedBox?.open_amount) ? (selectedBox.close_amount - selectedBox.open_amount).toFixed(2) : "0.00"}`}

                                />
                              </div>
                              <div className="col-12 col-md-6 mb-3 pe-0">
                                <label htmlFor="efectivo" className="sjtext">
                                  Registro efectivo
                                </label>
                                <input
                                  type="text"
                                  id="efectivo"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"

                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 px-0">
                                <label htmlFor=" sjtext">
                                  Irregularidades
                                </label>
                                <input
                                  type="text"
                                  className="sj_modelinput mt-2"
                                  placeholder="-"
                                />
                              </div>
                            </div>
                          </div>
                        </Modal.Body>
                      </Modal>

                      <Modal
                        show={show17}
                        onHide={handleClose17}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal s_model_newww"
                      >
                        <Modal.Header
                          closeButton
                          className="j-caja-border-bottom p-0 m-3 mb-0 pb-3"
                        >
                          <Modal.Title className="modal-title j-caja-pop-up-text-1">
                            Detalles cajao

                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div>
                            <div className="mb-2">
                              <img src={fing} alt="" />
                              <p className="d-inline ps-2 sjtext">
                                Caja cerrada
                              </p>
                            </div>
                            <div className="row pt-3">
                              <div className="col-12 col-md-6 mb-3 ps-0">
                                <label
                                  htmlFor="quien-abrio"
                                  className="sjtext"
                                >
                                  Quién abrió caja
                                </label>
                                <input
                                  type="text"
                                  id="quien-abrio"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={users.find(user => user.id === selectedBox?.open_by)?.name || ""}
                                />
                              </div>
                              <div className="col-12 col-md-6 mb-3 pe-0">
                                <label
                                  htmlFor="quien-cerro"
                                  className="sjtext"
                                >
                                  Quién cerró caja
                                </label>
                                <input
                                  type="text"
                                  id="quien-cerro"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={users.find(user => user.id === selectedBox?.close_by)?.name || ""}
                                />
                              </div>
                            </div>
                            <div className="row pt-2">
                              <div className="col-12 col-md-6 mb-3 ps-0">
                                <label
                                  htmlFor="fecha-apertura"
                                  className="sjtext"
                                >
                                  Fecha apertura
                                </label>
                                <input
                                  type="text"
                                  id="fecha-apertura"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={new Date(selectedBox?.open_time).toLocaleDateString() || ""}
                                />
                              </div>
                              <div className="col-12 col-md-6 mb-3 pe-0">
                                <label
                                  htmlFor="hora-apertura"
                                  className="sjtext"
                                >
                                  Hora apertura
                                </label>
                                <input
                                  type="text"
                                  id="hora-apertura"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={new Date(selectedBox?.open_time).toLocaleTimeString() || ""}
                                />
                              </div>
                            </div>
                            <div className="row pt-3">
                              <div className="col-12 col-md-6 mb-3 ps-0">
                                <label
                                  htmlFor="fecha-cierre"
                                  className="sjtext"
                                >
                                  Fecha cierre
                                </label>
                                <input
                                  type="text"
                                  id="fecha-cierre"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={selectedBox?.close_time ? new Date(selectedBox.close_time).toLocaleDateString() : ""}
                                />
                              </div>
                              <div className="col-12 col-md-6 mb-3 pe-0">
                                <label
                                  htmlFor="hora-cierre"
                                  className="sjtext"
                                >
                                  Hora cierre
                                </label>
                                <input
                                  type="text"
                                  id="hora-cierre"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="-"
                                  value={selectedBox?.close_time ? new Date(selectedBox.close_time).toLocaleTimeString() : ""}
                                />

                              </div>
                            </div>
                            <div className="row pt-3">
                              <div className="col-12 col-md-6 mb-3 ps-0">
                                <label
                                  htmlFor="monto inicial"
                                  className="sjtext"
                                >
                                  Monto inicial
                                </label>
                                <input
                                  type="text"
                                  id="monto inicial"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="$"
                                  value={`$${selectedBox?.open_amount || ""}`}
                                />
                              </div>
                              <div className="col-12 col-md-6 mb-3 pe-0">
                                <label
                                  htmlFor="monto final"
                                  className="sjtext"
                                >
                                  Monto final
                                </label>
                                <input
                                  type="text"
                                  id="monto final"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="$"
                                  value={`$${selectedBox?.close_amount || "0.00"}`}
                                />
                              </div>
                            </div>
                            <div className="row pt-3">
                              <div className="col-12 col-md-6 mb-3 ps-0">
                                <label htmlFor="ingreso" className="sjtext">
                                  Ingreso
                                </label>
                                <input
                                  type="text"
                                  id="ingreso"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="$"
                                  value={`$${(selectedBox?.close_amount && selectedBox?.open_amount) ? (selectedBox.close_amount - selectedBox.open_amount).toFixed(2) : "0.00"}`}
                                />

                              </div>
                              <div className="col-12 col-md-6 mb-3 pe-0">
                                <label htmlFor="efectivo" className="sjtext">
                                  Registro efectivo
                                </label>
                                <input
                                  type="text"
                                  id="efectivo"
                                  className="sj_modelinput mt-2 w-100"
                                  placeholder="$"
                                  value={`$${(parseFloat(selectedBox?.close_amount || 0) + parseFloat(selectedBox?.open_amount || 0)).toFixed(2)}`}
                                />

                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 ps-0 pe-0">
                                <label htmlFor=" sjtext">
                                  Irregularidades
                                </label>
                                <input
                                  type="text"
                                  className="sj_modelinput mt-2"
                                  placeholder="$-50"
                                />
                              </div>
                            </div>
                          </div>
                        </Modal.Body>
                        <Modal.Footer className="sjmodenone">
                          <button
                            type="button"
                            className="btn sjbtnskylight"
                            onClick={() => { setShowModal(true); handleClose17() }}
                          // onClick={handleClose17}
                          >
                            Imprimir reporte
                          </button>
                        </Modal.Footer>
                      </Modal>

                      {/* recipe */}
                      <Modal show={showModal} onHide={() => setShowModal(false)} className="m_modal s_model_newww"> {/* Add modal component */}
                        <Modal.Header closeButton className="border-0" />


                        <Modal.Body>
                          {/* Add content for the modal here */}
                          {/* <p>Details about the print will go here.</p> */}
                          <CajaRecipe box={boxName[0]} user={users} boxDetails={selectedBoxDetails} />
                        </Modal.Body>
                        <Modal.Footer className="border-0">

                          <Button variant="primary" className=" btn sjbtnskylight border-0 text-white j-caja-text-1" onClick={() => { handlePrint(); setShowModal(false); }}>
                            <svg
                              className="me-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="17"
                              height="17"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z"
                                clip-rule="evenodd"
                              />
                            </svg>
                            Imprimir
                          </Button>
                        </Modal.Footer>
                      </Modal>

                    </table>
                  </div>
                </Tab>
                <Tab
                  eventKey="profile"
                  title="Información"
                  style={{ backgroundColor: "#1F2A37" }}
                  className="py-2"
                >
                  {/* <div className="text-white px-3 py-3">
                    <div>
                      <label htmlFor="caja" className="w-50 mx-2">
                        Nombre caja
                      </label>
                      <label htmlFor="caja" className="ms-2">
                        Fecha creación
                      </label>
                    </div>
                    <br />
                    <div>
                      <input
                        type="text"
                        className="w-50 ms-2 me-3 sjw-50"
                        value={boxName[0]?.name}
                        disabled
                      />
                      <input
                        type="text"
                        className="sjw-full"
                        value={boxName[0]?.created_at ? new Date(boxName[0]?.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="text-white px-3 py-2">
                    <div>
                      <label htmlFor="caja" className="w-50 mx-2">
                        Cuantas aperturas
                      </label>
                      <label htmlFor="caja" className="ms-2">
                        Cuantos cierres
                      </label>
                    </div>
                    <br />
                    <div>
                      <input
                        type="text"
                        className="w-50 ms-2 me-3 sjw-50"
                        value={data.filter(item => item.open_amount !== null).length}
                        disabled
                      />
                      <input
                        type="text"
                        className="sjw-full"
                        width={48}
                        value={data.filter(item => item.close_amount !== null).length}
                        disabled
                      />
                    </div>
                  </div> */}
                    <div className="j-table-information-body">
                    <form className="j_ti_form">
                      <div className="row">
                        <div className="col-6 mb-3 ">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label text-white j-tbl-font-11"
                          >
                            Nombre caja
                          </label>
                          <input
                            type="text"
                            className="form-control j-tbl-information-input"
                            id="exampleFormControlInput1"
                            placeholder="Damian Lopez"
                            value={boxName[0]?.name}
                            readOnly
                          />
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
                            placeholder="20/03/2024"
                            value={boxName[0]?.created_at ? new Date(boxName[0]?.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                            readOnly
                          />
                        </div>
                        <div className="col-6 ">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label text-white j-tbl-font-11"
                          >
                           Cuantas aperturas
                          </label>
                          <input
                            type="text"
                            className="form-control j-tbl-information-input"
                            id="exampleFormControlInput1"
                            placeholder="4"
                            value={data.filter(item => item.open_amount !== null).length}
                            readOnly
                          />
                        </div>
                        <div className="col-6">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label text-white j-tbl-font-11"
                          >
                            Cuantos cierres
                          </label>
                          <input
                            type="text"
                            className="form-control j-tbl-information-input"
                            id="exampleFormControlInput1"
                            placeholder="1"
                            value={data.filter(item => item.close_amount !== null).length}
                            readOnly
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </Tab>
                

                <Tab
                  eventKey="longer-tab"
                  title="Movimientos"
                  className=" text-white m_bgblack rounded mx-3"
                >
                  <div className="text-white sj_overflow mt-4 py-3">
                    <table className="sj_table b_table1">
                      <thead>
                        <tr className="sjtable_dark">
                          <th className="p-3">Pedido</th>
                          <th>Sector</th>
                          <th>Mesa</th>
                          <th>Fecha</th>
                          <th>Código transacción</th>
                          <th>Estado</th>
                          <th>Ver</th>
                          <th>Imprimir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allOrder.length > 0 ? (
                          allOrder.map((user, index) => {
                            const matchedSector = allTable.find(sector =>
                              sector.tables.some(table => table.id === user.table_id)
                            );

                            // Get the sector name if a match is found
                            const sectorName = matchedSector ? matchedSector.name : "";

                            return (
                              <tr key={index} className="sjbordergray">
                                <td className="p-2 ">
                                  <Link to={`/home_Pedidos/paymet/${user.id}`}>
                                    <button className="sjtablegeern j-tbl-font-3 ">
                                      {user.id}
                                    </button>
                                  </Link>
                                </td>
                                <td className="j-caja-text-2 ">{sectorName}</td>
                                <td className="j-caja-text-2 ">{user.table_id}</td>
                                <td className="j-caja-text-2 ">{new Date(user.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                <td className="j-caja-text-2 ">{user.transaction_code}</td>
                                <td>

                                  <button
                                    className={`j-btn-caja-final j-tbl-font-3  ${user.status ===
                                      "received"
                                      ? "b_indigo"
                                      : user.status === "prepared"
                                        ? "b_ora "
                                        : user.status === "delivered"
                                          ? "b_blue"
                                          : user.status === "finalized"
                                            ? "b_green"
                                            : user.status === "withdraw"
                                              ? "b_indigo"
                                              : user.status === "local"
                                                ? "b_purple"
                                                : "text-danger"}`}
                                  >

                                    {user.status === "received" ? "Recibido" :
                                      user.status === "prepared" ? "Preparado" :
                                        user.status === "delivered" ? "Entregado" :
                                          user.status === "finalized" ? "Finalizado" :
                                            user.status === "withdraw" ? "Retirar" :
                                              user.status === "local" ? "Local" :
                                                user.status === "cancelled" ? "Cancelada" : "Unknown"}
                                  </button>
                                </td>
                                <td>
                                  <Link to={`/home_Pedidos/paymet/${user.id}}`}>
                                    <button className="sjSky px-2 j-tbl-font-3">
                                      Ver detalles
                                    </button>
                                  </Link>
                                </td>

                                <td>
                                  {user.status === "delivered" ? (
                                    <>

                                      <button className="bg-transparent border-0" onClick={() => {setSelectedOrder(user);handleorderRecipt(user) }}> {/* Update to show modal */}
                                        <svg
                                          className="sj-button-xise"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </button>

                                    </>

                                  ) : (
                                    <svg
                                      className="sjtablewhite"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr >
                            <td colSpan="8" className="text-center p-5">No se encontraron datos</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {/* order recipe */}
                    <Modal show={showModalOrder} onHide={() => setShowModalOrder(false)} className="m_modal s_model_newww"> {/* Add modal component */}
                      <Modal.Header closeButton className="border-0" />


                      <Modal.Body>

                        <CajaOrderRecipe data={selectedOrder} />
                      </Modal.Body>
                      <Modal.Footer className="border-0">

                        <Button variant="primary" className=" btn sjbtnskylight border-0 text-white j-caja-text-1" onClick={() => { handlePrint(); setShowModalOrder(false); }}>
                          <svg
                            className="me-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          Imprimir
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    {/* Proccesing */}
                    <Modal
                      show={isProcessing}
                      keyboard={false}
                      backdrop={true}
                      className="m_modal  m_user "
                    >
                      <Modal.Body className="text-center">
                        <p></p>
                        <Spinner animation="border" role="status" style={{ height: '85px', width: '85px', borderWidth: '6px' }} />
                        <p className="mt-2">Procesando solicitud...</p>
                      </Modal.Body>
                    </Modal>
                  </div>
                </Tab>
              </Tabs>
            </div>



          </div>
        </div>
      </div>
    </section>
  );
};
export default Informacira;
