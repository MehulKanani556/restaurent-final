import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Sidenav from "./Sidenav";
import { Button, Tabs, Tab, Modal, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { HiClipboardList } from "react-icons/hi";
import {
  RiCloseLargeFill,
  RiDeleteBin6Fill,
  RiEditBoxFill
} from "react-icons/ri";
import img1 from "../Image/Image4.jpg";
import ApexChart from "./ApexChart ";
import axios from "axios";
import Loader from "./Loader";
import { CgLayoutGrid } from "react-icons/cg";
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";
import useAudioManager from "./audioManager";
//import { enqueueSnackbar  } from "notistack";

export default function SingleArticleProduct() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const API = process.env.REACT_APP_IMAGE_URL;
  const [token] = useState(localStorage.getItem("token"));
  const [role ]= useState(localStorage.getItem("role"));
  const [admin_id] = useState(localStorage.getItem("admin_id"));

  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [show, setShow] = useState(false);
  const [formDetails, setFormDetails] = useState([]);
  const [parentCheck, setParentCheck] = useState([]);
  const [childCheck, setChildCheck] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [productionSel, setProductionSel] = useState([]);
  const [selectedDesdeMonth, setSelectedDesdeMonth] = useState(1);
  const [selectedHastaMonth, setSelectedHastaMonth] = useState(
    new Date().getMonth() + 1
  );
  const [payments, setPayments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [datatab, setDatatab] = useState([]);
  const [cost, setCost] = useState(null);
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");
  const [mapVal, setMapVal] = useState([[]]);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);
  const [errorMessages, setErrorMessages] = useState({});
  const { playNotificationSound } = useAudioManager();

  const location = useLocation(); // Get the current location
  const previousPath = location.state?.from || "/articles"; // Default to /articles if no previous path
console.log("previous Path: " , location);


  const handleClose = () => {
    setShow(false);
    setErrorMessages({});
  };
  const handleShow = () => {
    setShow(true);
    getSubFamilies(formDetails.family_id); // Pass the current family ID to getSubFamilies
  };
  // edit family Success
  const [showEditFamSuc, setShowEditFamSuc] = useState(false);
  const handleCloseEditFamSuc = () => setShowEditFamSuc(false);
  const handleShowEditFamSuc = () => {
    setShowEditFamSuc(true);
    setTimeout(() => {
      setShowEditFamSuc(false);
    }, 2000);
  };

  // edit family Eliminat
  const [showEditFamDel, setShowEditFamDel] = useState(false);
  const handleCloseEditFamDel = () => setShowEditFamDel(false);
  const handleShowEditFamDel = () => {
    setShowEditFamDel(true);
    setTimeout(() => {
      setShowEditFamDel(false);
    }, 2000);
  };

  // api

  useEffect(
    () => {
      if (selectedDesdeMonth > selectedHastaMonth) {
        setError("Hasta el mes debe ser mayor o igual que Desde el mes.");
        setDatatab([]);
      }
    },
    [selectedDesdeMonth, selectedHastaMonth]
  );

  useEffect(
    () => {
      if (!(role == "admin" || role == "cashier")) {
        navigate('/dashboard')
      } else {
        setIsProcessing(true);
        if (token) {
          fetchData();
          fetchInitialData();
          getAllPayments();
          setIsProcessing(false);
        }
      }
    },
    [token, selectedDesdeMonth, selectedHastaMonth,role]
  );
  useEffect(
    () => {
      if (mapVal.length > 0) {
        const newCategories = mapVal.map((val, index) => `S ${index + 1}`);
        setCategories(newCategories);
      }
    },
    [mapVal]
  );
  const fetchData = async () => {
    try {
      // await delay(1000);
      const response = await axios.get(
        `${apiUrl}/item/getSaleReport/${id}?from_month=${selectedDesdeMonth}&to_month=${selectedHastaMonth}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setDatatab(response.data);
      setCost(response.data.length);
      // setCost(response.data[0].order_total || 0);
      // setCost(response.data.reduce((acc, curr) => acc + curr.order_total, 0));

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
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Usage
  const debouncedFetchData = debounce(fetchData, 300);
  const fetchInitialData = async () => {
    try {
      const [
        singleItemResponse,
        familyData,
        subFamilyData,
        productionData,
        userData
      ] = await Promise.all([
        axios.get(`${apiUrl}/item/getSingle/${id}`,{
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${apiUrl}/family/getFamily`,{
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${apiUrl}/subfamily/getSubFamily`,{
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.post(`${apiUrl}/production-centers`,{admin_id:admin_id}, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${apiUrl}/get-users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const singleItem = singleItemResponse.data.item[0];
      console.log(singleItem)
      setFormDetails({
        ...singleItem,
        existingImage: singleItem.image
          ? `${API}/images/${singleItem.image}`
          : null
      });
      setParentCheck(familyData.data);
      setChildCheck(subFamilyData.data);
      setProductionSel(productionData.data.data);
      setUser(userData.data);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const getFamilyName = (id) => {
    const family = parentCheck.find((f) => f.id === id);
    return family ? family.name : "Unknown";
  };

  const getSubFamilyName = (id) => {
    const family = childCheck.find((f) => f.id === id);
    return family ? family.name : "Unknown";
  };

  const getProductionName = (id) => {
    const prod = productionSel.find((p) => p.id === id);
    return prod ? prod.name : "Unknown";
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "cost_price" || name === "sale_price") {
      updatedValue = value.replace("$", "");
    }

    // Check if the field is description and the value is empty
    if (name === "description" && value.trim() === "") {
      updatedValue = "";
    }

    setFormDetails({ ...formDetails, [name]: updatedValue });

    // Clear the error for this field
    setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const formData = new FormData();
  for (const key in formDetails) {
    if (key === "image" && typeof formDetails[key] !== "string") {
      formData.append("image", formDetails[key]);
    } else {
      formData.append(key, formDetails[key]);
    }
  }

  if (formDetails.image && typeof formDetails.image !== "string") {
    formData.append("image", formDetails.image);
  }

  const formatPrice = (price) => {
    if (price && !isNaN(price)) {
      const formattedPrice = Number(price).toFixed(2);
      return "$" + formattedPrice.replace(/\.00$/, "");
    }
    return "";
  };
  const validate = () => {
    let errors = {};

    if (!formDetails.name.trim()) {
      errors.name = "El nombre es obligatorio";
    }

    if (!formDetails.code.trim()) {
      errors.code = "El código es obligatorio";
    }

    if (!formDetails.production_center_id) {
      errors.production_center_id = "El centro de producción es obligatorio";
    }

    if (!formDetails.cost_price.trim() || isNaN(parseFloat(formDetails.cost_price)) || parseFloat(formDetails.cost_price) <= 0) {
      errors.cost_price = "El precio de costo debe ser un número válido";
    }

    if (!formDetails.sale_price.trim() || isNaN(parseFloat(formDetails.sale_price)) || parseFloat(formDetails.sale_price) <= 0) {
      errors.sale_price = "El precio de venta debe ser un número válido";
    } else {
      const costPrice = parseFloat(formDetails.cost_price);
      const salePrice = parseFloat(formDetails.sale_price);
      if (salePrice < costPrice) {
        errors.sale_price =
          "El precio de venta no puede ser menor que el precio de costo";
      }
    }

    if (!formDetails.family_id) {
      errors.family_id = "La familia es obligatoria";
    }

    if (!formDetails.sub_family_id) {
      errors.sub_family_id = "La subfamilia es obligatoria";
    }

    // if(!formDetails.existingImage)
    //   {
    //     if (!formDetails.image) {
    //       errors.image = "Se requiere una imagen";
    //     } else if (formDetails.image && formDetails.image.size > 2 *  1024  *1024) {
    //       errors.image = "El tamaño de la imagen debe ser inferior a 2 MB.";
    //     } else if (formDetails.image) {
    //       const allowedTypes = ['image/jpeg', 'image/svg+xml', 'image/png', 'image/gif'];
    //       console.log(allowedTypes.includes(formDetails.image.type))
    //       if (!allowedTypes.includes(formDetails.image.type)) {
    //         errors.image = "El tipo de archivo no es válido. Solo se permiten archivos jpg, svg, png y gif.";
    //       }
    //     }
    //   }

    return errors;
  };
  const handleUpdate = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    const formData = new FormData();
    for (const key in formDetails) {
      if (key === "image") {
        if (formDetails[key] instanceof File) {
          formData.append("image", formDetails[key]);
        } else if (!formDetails[key] && !formDetails.existingImage) {
          formData.append("image", ""); // Send empty string if image is deleted
        }
        // If existingImage is present and image is not changed, don't append anything
      } else {
        // formData.append(key, formDetails[key]);
        // Send null for empty description, otherwise send the value (or empty string if undefined)
        // formData.append(key, formDetails[key] === null ? null : formDetails[key] || "");
        formData.append(
          key,
          formDetails[key] === "NULL" ? "NULL" : formDetails[key] || ""
        );
      }
    }
    handleClose();

    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/item/update/${formDetails.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
          maxBodyLength: Infinity
        }
      );
      console.log("Product updated successfully");
      handleClose();
      //enqueueSnackbar (response.data?.notification, { variant: 'success' })
      // playNotificationSound();;
      handleShowEditFamSuc();
      fetchInitialData(); // Consider passing the new ID if it has changed
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      // Display error to user
      setErrorMessages({
        ...errorMessages,
        apiError: "Failed to update product. Please try again."
      });
      //enqueueSnackbar (error?.response?.data?.alert , { variant: 'error' })
      // playNotificationSound();;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (itemId) => {
    setIsProcessing(true);
    try {
      const response = await axios.delete(`${apiUrl}/item/delete/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        maxBodyLength: Infinity
      });
      console.log(response.data.message);
      handleShowEditFamDel();
      //enqueueSnackbar (response.data?.notification, { variant: 'success' })
      // playNotificationSound();; 
      setIsProcessing(false);

      navigate("/articles");
    } catch (error) {
      console.error("Failed to delete item:", error);
      //enqueueSnackbar (error?.response?.data?.alert , { variant: 'error' })
      // playNotificationSound();;
    } finally {
      setIsProcessing(false);
    }
  };

  const [families, setFamilies] = useState([]);
  const [subFamilies, setSubFamilies] = useState([]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: apiUrl + "/family/getFamily",
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axios
      .request(config)
      .then((response) => {
        setFamilies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getSubFamilies = (familyId) => {
    if (!familyId) return;

    let data = JSON.stringify({
      families: [familyId],
      admin_id: admin_id
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: apiUrl + "/subfamily/getMultipleSubFamily",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      data: data
    };

    axios
      .request(config)
      .then((response) => {
        setSubFamilies(response.data.data[0].sub_family);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // tab 2
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

  const handleImageDelete = () => {
    setFormDetails({
      ...formDetails,
      image: null,
      existingImage: null
    });
  };
  const handelchangeImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormDetails({
        ...formDetails,
        image: file,
        existingImage: null
      });
    }
  };

  const generateMonthLabels = () => {
    const monthLabels = [];
    for (let month = selectedDesdeMonth; month <= selectedHastaMonth; month++) {
      monthLabels.push(`S${month - selectedDesdeMonth + 1}`); // Generate labels S1, S2, S3, etc.
    }
    return monthLabels;
  };

  // Update the chart data whenever selected months change
  const chartData = {
    labels: generateMonthLabels(), // Use the generated month labels
    series: [
      {
        name: "Sales",
        data: mapVal.slice(selectedDesdeMonth - 1, selectedHastaMonth) // Adjust data based on selected months
      }
    ]
  };

  // delete message Confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const handleShowDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
    handleClose();
  };
  // generate report
  const [data, setData] = useState([]);

  const [showModal12, setShowModal12] = useState(false);

  const handleClose12 = () => setShowModal12(false);
  const handleShow12 = () => {
    setShowModal12(true);
    handleClose15();

    setTimeout(() => {
      setShowModal12(false);
    }, 2000);
  };

  const [show15, setShow15] = useState(false);

  const handleClose15 = () => setShow15(false);
  const handleShow15 = () => setShow15(true);

  const [errorReport, setErrorReport] = useState("");
  const [selectedDesdeMonthReport, setSelectedDesdeMonthReport] = useState(1);
  const [selectedHastaMonthReport, setSelectedHastaMonthReport] = useState(
    new Date().getMonth() + 1
  );

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
    setIsProcessing(true);
    try {
      // Get family, subfamily, and production center names
      const familyName = getFamilyName(formDetails.family_id);
      const subFamilyName = getSubFamilyName(formDetails.sub_family_id);
      const productionCenterName = getProductionName(
        formDetails.production_center_id
      );

      // Create a single record object with product information
      const singleRecord = {
        Nombre: formDetails.name,
        Código: formDetails.code,
        "Precio Costo": formDetails.cost_price,
        "Precio Venta": formDetails.sale_price,
        Descripción: formDetails.description,
        Familia: familyName,
        Subfamilia: subFamilyName,
        "Centro de Producción": productionCenterName
      };
      const response = await axios.get(
        `${apiUrl}/item/getSaleReport/${id}?from_month=${selectedDesdeMonthReport}&to_month=${selectedHastaMonthReport}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setIsProcessing(false);
      const data = response.data;
      // Convert the single record to an array for vertical display
      const formattedData = Object.entries(
        singleRecord
      ).map(([key, value]) => ({
        Campo: key,
        Valor: value
      }));

      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData, { origin: "A2" });

      // Add a heading "Información"
      // Merge cells for the heading
      XLSX.utils.sheet_add_aoa(ws, [["Información"]], { origin: "A1" });
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

      // Apply styles to the heading
      ws["A1"].s = {
        font: { name: "Aptos Narrow", bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" }
      };
      // Set row height for the heading
      if (!ws["!rows"]) ws["!rows"] = [];
      ws["!rows"][0] = { hpt: 30 };

      // Auto-size columns
      const colWidths = [{ wch: 20 }, { wch: 30 }]; // Set widths for "Campo" and "Valor"
      ws["!cols"] = colWidths;

      // Set row height for header
      ws["!rows"] = [{ hpt: 25 }]; // Set height of first row to 25


      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Información");

      // new sheet

      // Fetch sales report data for the new sheet
      const salesResponse = await axios.get(
        `${apiUrl}/item/getSaleReport/${id}?from_month=${selectedDesdeMonthReport}&to_month=${selectedHastaMonthReport}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const salesData = salesResponse.data;

      // Map sales data to include only specific fields
      const filteredSalesData = salesData.map((order) => {
        const date = new Date(order.created_at);
        const formattedDate = date.toLocaleDateString(); // Format date
        const formattedTime = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }); // Format time

        // Check payment status
        const payment = payments.find((p) => p.order_master_id === order.id);
        const paymentStatus =
          payment && payment.amount !== null ? "Pagado" : "No pagado";

        return {
          Padido: order.id,
          Fecha: formattedDate, // Only date
          Hora: formattedTime, // Add time
          Cliente: order.customer_name,
          Estado: paymentStatus // Show payment status
          // "Total": order.order_total // Include any other fields you need
        };
      });

      // Create a worksheet for sales data
      const salesWs = XLSX.utils.json_to_sheet([]);

      // Add a heading "Historial"
      salesWs["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }]; // Merge cells for the heading
      salesWs["A1"] = { v: "Historial", t: "s" }; // Set the heading
      salesWs["A1"].s = {
        font: {
          bold: true,
          sz: 16
        },

        alignment: {
          horizontal: "center",
          vertical: "center"
        }
      }; // Style the heading
      salesWs["A1"].result = "Historial"; // Ensure the value is set correctly

      // Set the row height for the heading
      salesWs["!rows"] = [{ hpt: 25 }]; // Set height of the first row to 25
      // Auto-size columns
      // Auto-size columns for sales worksheet
      const salesColWidth = [
        { wch: 20 },
        { wch: 30 },
        { wch: 20 },
        { wch: 30 },
        { wch: 20 }
      ]; // Set widths for "Padido", "Fecha", "Hora", "Cliente", "Estado"
      salesWs["!cols"] = salesColWidth;

      // Add column names
      const columnNames = ["Padido", "Fecha", "Hora", "Cliente", "Estado"];
      XLSX.utils.sheet_add_aoa(salesWs, [columnNames], { origin: "A2" }); // Add column names starting from row 2

      // Add the filtered sales data starting from row 3
      XLSX.utils.sheet_add_json(salesWs, filteredSalesData, {
        header: columnNames,
        skipHeader: true,
        origin: "A3"
      });

      XLSX.utils.book_append_sheet(wb, salesWs, "Historial"); // Append new sheet

      // Generate Excel file
      // XLSX.writeFile(wb, `Reporte de Articulo ${formDetails.name}_${selectedDesdeMonthReport}-${selectedHastaMonthReport}.xlsx`);
      const desdeMonthName = monthNames[selectedDesdeMonthReport - 1];
      const hastaMonthName = monthNames[selectedHastaMonthReport - 1];
      XLSX.writeFile(
        wb,
        `Reporte de Articulo ${formDetails.name} ${desdeMonthName}-${hastaMonthName}.xlsx`
      );

      handleShow12();
    } catch (error) {
      console.error("Error generating report:", error);
      setErrorReport(
        "No se pudo generar el informe. Por favor inténtalo de nuevo."
      );
    }
  };

  // get all payment
  const getAllPayments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-payments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPayments(response.data.result);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };
  return (
    <div>
      <div className="m_bg_black">
        <Header />
        <div className="d-flex">
          <Sidenav />
          <div className="flex-grow-1 sidebar" style={{ width: "50%" }}>
            <div>
              <div className="pb-3  m_bgblack text-white m_borbot m_padding  ">
                <Link to={previousPath}>
                  <div className="btn bj-btn-outline-primary m14">
                    <FaArrowLeft className="" /> Regresar
                  </div>
                </Link>
                <div>
                  <div className="d-flex justify-content-between mt-3 align-items-center text-nowrap flex-wrap">
                    <div>
                      <p className=" m-0 m18">
                        {" "}
                        {formDetails.name} {formDetails.code}
                      </p>
                    </div>
                    <div className="d-flex gap-3 ">
                      <div className="d-flex align-items-center">
                        <button
                          className="btn j-btn-primary text-white"
                          onClick={handleShow15}
                        >
                          <HiClipboardList className="fs-5" />{" "}
                          <span className="ms-1 m12">Generar reporte</span>{" "}
                        </button>
                      </div>
                      {activeTab === "home" && (
                        <div>
                          <button
                            className="btn bj-btn-outline-primary"
                            onClick={handleShow}
                          >
                            <RiEditBoxFill className="fs-5" />
                            <span className="ms-1 m12">Editar</span>
                          </button>
                        </div>
                      )}
                      {/* edit product */}
                      <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal j_mftopmodal"
                      >
                        <Modal.Header
                          closeButton
                          className="m_borbot m-3 p-0 pb-3"
                        >
                          <Modal.Title>Edición artículo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <form>
                            <div className="row">
                              <div className="col-6">
                                <div className="mb-3">
                                  <label htmlFor="name" className="form-label">
                                    Nombre
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control m_input"
                                    id="name"
                                    name="name" // Make sure name attribute matches the state property
                                    placeholder="-"
                                    value={formDetails.name || ""} // Bind value to formDetails state
                                    onChange={handleChange}
                                  />
                                  {errorMessages.name && (
                                    <div className="text-danger errormessage">
                                      {errorMessages.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-3">
                                  <label htmlFor="code" className="form-label">
                                    Código
                                  </label>

                                  <input
                                    type="text"
                                    className="form-control m_input"
                                    id="code"
                                    placeholder="01234"
                                    name="code"
                                    value={formDetails.code || ""}
                                    onChange={handleChange}
                                    disabled
                                  />
                                  {errorMessages.code && (
                                    <div className="text-danger errormessage">
                                      {errorMessages.code}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleFormControlInput3"
                                  className="form-label"
                                >
                                  Centro de producción
                                </label>
                                <select
                                  className="form-select m_input"
                                  aria-label="Default select example"
                                  name="production_center_id"
                                  value={formDetails.production_center_id || ""}
                                  onChange={handleChange}
                                >
                                  <option selected>Seleccionar</option>
                                  {productionSel.map((ele) => (
                                    <option key={ele.id} value={ele.id}>
                                      {ele.name}
                                    </option>
                                  ))}
                                </select>
                                {errorMessages.production_center_id && (
                                  <div className="text-danger errormessage">
                                    {errorMessages.production_center_id}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="cPrice"
                                    className="form-label"
                                  >
                                    Precio costo
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control m_input"
                                    id="cPrice"
                                    placeholder="Babidas"
                                    name="cost_price"
                                    // value={formatPrice(formDetails.cost_price)}
                                    // onChange={handleChange}
                                    value={`$${formDetails.cost_price}`} // Add $ sign before formatted value
                                    onChange={(e) => {
                                      const { name, value } = e.target;
                                      handleChange({ target: { name, value: value.replace(/[^0-9.]/g, '') } }); // Update state with raw value
                                    }}
                                  />
                                  {errorMessages.cost_price && (
                                    <div className="text-danger errormessage">
                                      {errorMessages.cost_price}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="sPrice"
                                    className="form-label"
                                  >
                                    Precio venta
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control m_input"
                                    id="sPrice"
                                    placeholder="Babidas"
                                    name="sale_price"
                                    // value={formatPrice(formDetails.sale_price)}
                                    // onChange={handleChange}
                                    value={`$${formDetails.sale_price}`} // Add $ sign before formatted value
                                    onChange={(e) => {
                                      const { name, value } = e.target;
                                      handleChange({ target: { name, value: value.replace(/[^0-9.]/g, '') } }); // Update state with raw value
                                    }}
                                  />
                                  {errorMessages.sale_price && (
                                    <div className="text-danger errormessage">
                                      {errorMessages.sale_price}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="family"
                                    className="form-label"
                                  >
                                    Familia
                                  </label>

                                  <select
                                    className="form-select m_input"
                                    aria-label="Default select example"
                                    name="family_id"
                                    id="family"
                                    value={formDetails.family_id}
                                    onChange={(e) => {
                                      const selectedFamilyId = e.target.value;
                                      setFormDetails({
                                        ...formDetails,
                                        family_id: selectedFamilyId
                                      });
                                      getSubFamilies(selectedFamilyId); // Call getSubFamilies with the selected family ID
                                    }}
                                  >
                                    <option value="">Seleccionar</option>
                                    {families.map((family) => (
                                      <option key={family.id} value={family.id}>
                                        {family.name}
                                      </option>
                                    ))}
                                  </select>
                                  {errorMessages.family_id && (
                                    <div className="text-danger errormessage">
                                      {errorMessages.family_id}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="subFamily"
                                    className="form-label"
                                  >
                                    Subfamilia
                                  </label>

                                  <select
                                    className="form-select m_input"
                                    aria-label="Default select example"
                                    name="sub_family_id"
                                    value={formDetails.sub_family_id || ""}
                                    onChange={handleChange}
                                  >
                                    <option value="">Seleccionar</option>
                                    {subFamilies.map((subFamily) => (
                                      <option
                                        key={subFamily.id}
                                        value={subFamily.id}
                                      >
                                        {subFamily.name}
                                      </option>
                                    ))}
                                  </select>
                                  {errorMessages.sub_family_id && (
                                    <div className="text-danger errormessage">
                                      {errorMessages.sub_family_id}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="mb-3">
                                <label
                                  htmlFor="description"
                                  className="form-label"
                                >
                                  Descripción
                                </label>
                                <input
                                  type="text"
                                  className="form-control m_input"
                                  id="description"
                                  placeholder="-"
                                  name="description"
                                  value={formDetails.description}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className=" p-3 ">
                                <h6>Product Images</h6>

                                {(formDetails.image ||
                                  formDetails.existingImage) && (
                                    <div className="rounded position-relative">
                                      <img
                                        src={
                                          formDetails.image instanceof File ? (
                                            URL.createObjectURL(formDetails.image)
                                          ) : (
                                            formDetails.existingImage ||
                                            `${API}/images/${formDetails.image}`
                                          )
                                        }
                                        alt="img"
                                        className="object-fit-contain jm-input rounded"
                                        style={{
                                          width: 150,
                                          padding: "1px 11px"
                                        }}
                                        name="image"
                                      />
                                      <div
                                        className="text-danger position-absolute jm-dustbin-position"
                                        onClick={handleImageDelete}
                                      >
                                        <RiDeleteBin6Fill className="jm-dustbin-size" />
                                      </div>
                                    </div>
                                  )}
                                {!formDetails.image &&
                                  !formDetails.existingImage && (
                                    <div
                                      className="m_file-upload w-100"
                                      onClick={handleDivClick}
                                    >
                                      <input
                                        type="file"
                                        className="form-control m_input d-none"
                                        accept="image/*"
                                        name="image"
                                        onChange={handelchangeImage}
                                        ref={fileInputRef}
                                      />
                                      <p className="m_upload-text fw-light">
                                        Click to upload image
                                      </p>
                                    </div>
                                  )}
                                {errorMessages.image && (
                                  <p className="text-danger errormessage">
                                    {errorMessages.image}
                                  </p>
                                )}
                              </div>
                            </div>
                          </form>
                        </Modal.Body>
                        <Modal.Footer className="border-0">
                          <button
                            className="btn b_btn_close "
                            onClick={handleShowDeleteConfirmation}
                          >
                            Eliminar
                          </button>
                          <button
                            className="btn text-white j-btn-primary"
                            onClick={() => {
                              handleUpdate();
                            }}
                          >
                            Guardar cambios
                          </button>
                        </Modal.Footer>
                      </Modal>
                      {/* delete family confirm */}
                      <Modal
                        show={showDeleteConfirmation}
                        onHide={() => setShowDeleteConfirmation(false)}
                        backdrop={true}
                        keyboard={false}
                        className="m_modal"
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
                              ¿Estás seguro de que deseas eliminar este
                              artículo?
                            </p>
                          </div>
                        </Modal.Body>
                        <Modal.Footer className="border-0">
                          <Button
                            variant="danger "
                            className="j-tbl-btn-font-1 b_btn_close"
                            onClick={() => {
                              handleDelete(id);
                              setShowDeleteConfirmation(false);
                              handleClose();
                            }}
                          >
                            Si, seguro
                          </Button>
                          <Button
                            variant="secondary"
                            className="j-tbl-btn-font-1"
                            onClick={() => setShowDeleteConfirmation(false)}
                          >
                            No, cancelar
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      {/* edit product success */}
                      <Modal
                        show={showEditFamSuc}
                        onHide={handleCloseEditFamSuc}
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
                            <p className="mb-0 mt-2 h6">Editado con éxito</p>
                          </div>
                        </Modal.Body>
                      </Modal>
                      {/* edit product eliminate */}
                      <Modal
                        show={showEditFamDel}
                        onHide={handleCloseEditFamDel}
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
                            <p className="mb-0 mt-2 h6">editar sin éxito</p>
                          </div>
                        </Modal.Body>
                      </Modal>
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
                          </div>
                          <div className="d-flex w-auto justify-content-end gap-5 row m-2">
                            {errorReport && (
                              <div className="alert alert-danger d-flex justify-content-between pointer flex-grow-1 p-2">
                                {errorReport}{" "}
                                <div
                                  className="text-black d-flex align-items-center "
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
                        className="m_modal jay-modal"
                      >
                        <Modal.Header closeButton className="border-0" />
                        <Modal.Body>
                          <div className="text-center">
                            <img
                              src={require("../Image/check-circle.png")}
                              alt=""
                            />

                            <p className="opacity-75 j-tbl-pop-2">
                              generar informe descargar con éxito
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
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  id="fill-tab-example"
                  className="mb-3 m_tabs m_bgblack px-2 border-0 p-3 "
                  fill
                >
                  <Tab
                    eventKey="home"
                    title="Información"
                    className="m_in  text-white m12  pt-4 m_bgblack rounded"
                  >
                    <div>
                      <div>
                        <div className="row">
                          <h6>Información articulo</h6>
                          <div>
                            <img
                              src={`${API}/images/${formDetails.image}`}
                              alt={formDetails.name}
                              className="object-fit-contain"
                              width={250}
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <form action="">
                            <div className="row">
                              <div className="col-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label"
                                  >
                                    Nombre
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control m_input"
                                    id="exampleFormControlInput1"
                                    placeholder="-"
                                    value={formDetails.name}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="exampleFormControlInput2"
                                    className="form-label"
                                  >
                                    Código
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control m_input"
                                    id="exampleFormControlInput2"
                                    placeholder="01234"
                                    value={formDetails.code}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="exampleFormControlInput4"
                                    className="form-label"
                                  >
                                    Familia
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control m_input"
                                    id="exampleFormControlInput4"
                                    placeholder="Babidas"
                                    value={getFamilyName(formDetails.family_id)}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="exampleFormControlInput4"
                                    className="form-label"
                                  >
                                    Subfamilia
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control m_input"
                                    id="exampleFormControlInput4"
                                    placeholder="Babidas"
                                    value={getSubFamilyName(
                                      formDetails.sub_family_id
                                    )}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleFormControlInput4"
                                  className="form-label"
                                >
                                  Centro de producción
                                </label>
                                <input
                                  type="text"
                                  className="form-control m_input"
                                  id="exampleFormControlInput4"
                                  placeholder="Bars"
                                  value={getProductionName(
                                    formDetails.production_center_id
                                  )}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="exampleFormControlInput4"
                                    className="form-label"
                                  >
                                    Precio costo
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control m_input"
                                    id="exampleFormControlInput4"
                                    placeholder="Babidas"
                                    value={"$" + formDetails.cost_price}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-3">
                                  <label
                                    htmlFor="exampleFormControlInput4"
                                    className="form-label"
                                  >
                                    Precio venta
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control m_input"
                                    id="exampleFormControlInput4"
                                    placeholder="Babidas"
                                    value={"$" + formDetails.sale_price}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleFormControlInput8"
                                  className="form-label"
                                >
                                  Descripción
                                </label>
                                <input
                                  type="text"
                                  className="form-control m_input"
                                  id="exampleFormControlInput8"
                                  placeholder="-"
                                  value={formDetails.description}
                                  readOnly
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="profile" title="Historial" >
                    

                    <div className="m-3 text-white m_bgblack p-4 rounded ">
                      <div className="d-flex  justify-content-between row">
                        <div className="mb-3 col-sm-6">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Vendidos
                          </label>
                          <input
                            type="text"
                            className="form-control m_input"
                            id="exampleFormControlInput1"
                            placeholder="-"
                            value={datatab != "" ? cost : ""}
                            readOnly
                          />
                        </div>
                        <div className="d-flex col-sm-6 gap-3">
                          <div className="mb-3 flex-grow-1">
                            <label
                              htmlFor="exampleFormControlInput6"
                              className="form-label"
                            >
                              Desde
                            </label>
                            <select
                              className="form-select m_input text-capitalize"
                              aria-label="Default select example"
                              onChange={(e) =>
                                setSelectedDesdeMonth(Number(e.target.value))}
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
                              <option value="10">Octubre</option>
                              <option value="11">Noviembre</option>
                              <option value="12">Diciembre</option>
                            </select>
                          </div>
                          <div className="mb-3 flex-grow-1">
                            <label
                              htmlFor="exampleFormControlInput6"
                              className="form-label"
                            >
                              Hasta
                            </label>
                            <select
                              className="form-select m_input text-capitalize"
                              aria-label="Default select example"
                              onChange={(e) =>
                                setSelectedHastaMonth(Number(e.target.value))}
                              value={selectedHastaMonth}
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
                              <option value="10">Octubre</option>
                              <option value="11">Noviembre</option>
                              <option value="12">Diciembre</option>
                            </select>
                          </div>
                        </div>
                      </div>
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

                      <div>
                        <div className="m_table1">
                          <table className="m_table w-100 mt-3 m16">
                            <thead>
                              <tr className="m_thcolor rounded-top ">
                                <th>Padido</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                              </tr>
                            </thead>
                            <tbody className="text-white">
                              {/* {datatab.length > 0 ? (
                                  datatab.map((order, index) => (
                                    <tr key={order.id} className="m_borbot p-3">
                                      <td className="m_idbtn m12">
                                        {order.id}
                                      </td>
                                      <td>{formatDate(order.created_at)}</td>
                                      <td>{formatTime(order.created_at)}</td>
                                      <td className="text-nowrap">
                                        {order.customer_name}
                                      </td>
                                      <td className="m_btn1 m12">
                                      {order.status === 'completed' ? 'Completado' : 
                                         order.status === 'pending' ? 'Pendiente' : 
                                         order.status === 'cancelled' ? 'Cancelado' : 
                                         order.status === 'received' ? 'recibió' : 
                                         order.status === 'finalized' ? 'finalizada' : 
                                         order.status === 'prepared' ? 'preparada' : 
                                         order.status}
                                     
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="5"
                                      className="text-center opacity-75 fw-bold "
                                    >
                                      No hay información disponible para este mes
                                    </td>
                                  </tr>
                                )} */}
                              {datatab?.length > 0 ? (
                                datatab?.map((order, index) => {
                                  const payment = payments?.find(
                                    (p) => p.order_master_id === order.id
                                  );
                                  const paymentStatus =
                                    payment && payment.amount !== null
                                      ? "Pagado"
                                      : "No pagado";

                                  return (
                                    <tr key={order.id} className="m_borbot p-3"> 
                                     
                                      <td >
                                      <Link to={`/home_Pedidos/paymet/${order.id}`}>
                                        <div className="m_idbtn m12">{order.id}</div>
                                      </Link>
                                      </td>
                                      <td>{formatDate(order.created_at)}</td>
                                      <td>{formatTime(order.created_at)}</td>
                                      <td className="text-nowrap">
                                        {order.customer_name}
                                      </td>

                                      <td
                                        className={`m_btn1 m12 text-nowrap`}
                                        style={{ width: "90px" }}
                                      >
                                        {paymentStatus}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td
                                    colSpan="6"
                                    className="text-center opacity-75 fw-bold "
                                  >
                                    No hay información disponible para este mes
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                  </Tab>
                  <Tab eventKey="longer-tab" title="Estadísticas">
                    <div className="m-3 text-white m_bgblack p-4 rounded m14">
                      <div className="row mt-5">
                        <div className=" gap-3 col-xl-6 ">
                          <div className="d-flex gap-3 row">
                            <div className="mb-3 col-xs-6 j-input-width2 flex-grow-1">
                              <label
                                htmlFor="desdeSelect"
                                className="form-label text-white j-tbl-font-11"
                              >
                                Desde
                              </label>
                              <select
                                className="form-select j-input-width2 j-tbl-information-input w-100  b_select border-0 py-2  "
                                style={{ borderRadius: "6px" }}
                                aria-label="Default select example"
                                onChange={(e) =>
                                  setSelectedDesdeMonth(Number(e.target.value))}
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
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                              </select>
                            </div>
                            <div className="mb-3 col-xs-6   j-input-width2 flex-grow-1">
                              <label
                                htmlFor="hastaSelect"
                                className="form-label text-white j-tbl-font-11"
                              >
                                Hasta
                              </label>
                              <select
                                className="form-select w-100 j-input-width2 j-tbl-information-input  b_select border-0 py-2  "
                                style={{ borderRadius: "6px" }}
                                aria-label="Default select example"
                                onChange={(e) =>
                                  setSelectedHastaMonth(Number(e.target.value))}
                                value={selectedHastaMonth}
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
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                              </select>
                            </div>
                          </div>
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
                        {mapVal.length > 0 ? (
                          <div className="col-xl-6">
                            {/* <ApexChart mapVal={mapVal} cat={categories} /> */}
                            <ApexChart
                              mapVal={chartData.series[0].data}
                              cat={chartData.labels}
                            />
                          </div>
                        ) : (
                          <div className="col-md-6 text-center opacity-75 fw-bold d-flex align-items-center justify-content-center">
                            No hay información disponible para este mes
                          </div>
                        )}
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
