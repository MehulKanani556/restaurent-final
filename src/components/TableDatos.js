import React, { useEffect, useState } from "react";
import Header from "./Header";
import box from "../Image/Ellipse 20.png";
import box4 from "../Image/box5.png";
import { FaCircleCheck } from "react-icons/fa6";
import { Accordion, Button, Modal, Spinner } from "react-bootstrap";
import Sidenav from "./Sidenav";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineArrowSmLeft } from "react-icons/hi";
import img2 from "../Image/crispy-fry-chicken.png";
import img3 from "../Image/Strawberry-gelatin.png";
import pic2 from "../img/Image(1).jpg";
import axios from "axios";

const TableDatos = () => {
  const API = process.env.REACT_APP_IMAGE_URL;
  const apiUrl = process.env.REACT_APP_API_URL;
  const [token] = useState(sessionStorage.getItem("token"));
  const [role] = useState(sessionStorage.getItem("role"));
  const admin_id = sessionStorage.getItem("admin_id");
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [obj1, setObj1] = useState([]);

  const [tId, setTId] = useState(id);
  const [tableData, setTableData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const orderitem = [
    {
      image: img2,
      name: "Pollo frito crujiente",
      quantity: "3",
      price: "10.00",
      code: "01234",
      note: ""
    },
    {
      image: pic2,
      name: "Guitig",
      quantity: "3",
      price: "1.00",
      code: "01234",
      note: ""
    },
    {
      image: img3,
      name: "Gelatina fresa",
      quantity: "3",
      price: "1.00",
      code: "01234",
      note: ""
    }
  ];
  const [cartItems, setCartItems] = useState(orderitem);
  const [countsoup, setCountsoup] = useState(
    orderitem.map((item) => parseInt(item.quantity))
  );

  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAllItems, setShowAllItems] = useState(false);
  const toggleShowAllItems = () => {
    setShowAllItems(!showAllItems);
  };

  const increment = async (proid, item_id, quantity, tableId) => {
    // setCountsoup((prevCounts) =>
    //   prevCounts.map((count, i) => (i === index ? count + 1 : count))
    // );
    try {
      const response = await axios.post(
        `${apiUrl}/order/updateItem/${proid}`,
        {
          order_id: tableData[0].id,
          order_details: [
            {
              item_id: item_id,
              quantity: quantity + 1
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Note added successfully:", response.data);
      getTableData(tableId);
    } catch (error) {
      console.error(
        "Error adding note:",
        error.response ? error.response.data : error.message
      );
    }

  };

  // const decrement = (index) => {
  //   setCountsoup((prevCounts) =>
  //     prevCounts.map(
  //       (count, i) => (i === index ? (count > 1 ? count - 1 : 1) : count)
  //     )
  //   );
  // };

  const decrement = async (proid, item_id, quantity, tableId) => {
    try {
      const response = await axios.post(
        `${apiUrl}/order/updateItem/${proid}`,
        {
          order_id: tableData[0].id,
          order_details: [
            {
              item_id: item_id,
              quantity: quantity - 1
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Note added successfully:", response.data);
      getTableData(tableId);
    } catch (error) {
      console.error(
        "Error adding note:",
        error.response ? error.response.data : error.message
      );
    }
  };
  /* get table data */

  const getTableData = async (id) => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${apiUrl}/table/getStats/${id}`, {admin_id: admin_id}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        const lastRecordArray = [response.data[response.data.length - 1]];
        setTableData(lastRecordArray);
        // console.log("Last Record Array:", lastRecordArray);
      } else {
        console.error("Response data is not a non-empty array:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching sectors:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(
    () => {


      if (!(role == "admin" || role == "cashier" || role == "waitress")) {
        navigate('/dashboard')
      } else {
        setIsProcessing(true);
        if (id) {
          getTableData(id)
          fetchAllItems();
        };
        setIsProcessing(false);
      }

    },
    [id, role]
  );
  const handleDeleteItem = (index) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);
    const updatedCountsoup = countsoup.filter((_, i) => i !== index);
    setCountsoup(updatedCountsoup);
  };

  const getTotalCost = () => {
    return cartItems.reduce(
      (total, item, index) => total + parseInt(item.price) * countsoup[index],
      0
    );
  };



  const [isEditing, setIsEditing] = useState(
    Array(cartItems.length).fill(false)
  );




  const [showCreSuc, setShowCreSuc] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleCloseCreSuc = () => setShowCreSuc(false);
  const handleShowCreSuc = () => setShowCreSuc(true);

  const [deletedItemIndex, setDeletedItemIndex] = useState(null);

  const addItemToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const removeItemFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  const totalCost = getTotalCost();
  const discount = 1.0;

  const finalTotal = totalCost - discount;

  const [customerData, setCustomerData] = useState({
    id: "02134656",
    name: "Damian Gonzales",
    email: "ejemplo@gmail.com"
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomerData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const [showEditFam, setShowEditFam] = useState(false);
  const handleShowEditFam = () => setShowEditFam(true);

  const [selectedRadio, setSelectedRadio] = useState("1");
  const [activeAccordionItem, setActiveAccordionItem] = useState("0");
  const handleAccordionClick = (value) => {
    setSelectedRadio(value);
  };

  const [rut1, setRut1] = useState("");
  const [rut2, setRut2] = useState("");
  const [rut3, setRut3] = useState("");

  const handleRutChange = (e, setRut) => {
    let value = e.target.value.replace(/-/g, ""); // Remove any existing hyphen
    if (value.length > 6) {
      value = value.slice(0, 6) + "-" + value.slice(6);
    }
    setRut(value);
  };
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    tour: "",
    address: "",
    email: "",
    number: "",
    bname: "",
    tipoEmpresa: "0"
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const collectAccordionData = () => {
    const commonData = {
      receiptType: selectedRadio,
      rut: selectedRadio === "1" ? rut1 : selectedRadio === "2" ? rut2 : rut3,
      firstname: formData.fname,
      lastname: formData.lname,
      tour: formData.tour,
      address: formData.address,
      email: formData.email,
      phone: formData.number
    };

    let specificData = {};

    if (selectedRadio === "3") {
      specificData = {
        business_name: formData.bname,
        ltda: formData.ltda
      };
    }

    return { ...commonData, ...specificData };
  };
  const validateForm = (data) => {
    const errors = {};

    // RUT validation
    if (!data.rut || data.rut.length < 7) {
      errors.rut = "El RUT debe tener al menos 7 caracteres";
    }

    // Name validation
    // if (data.receiptType != "4") {
    if (data.receiptType != "3") {
      if (!data.firstname || data.firstname.trim() === "") {
        errors.fname = "Se requiere el primer nombre";
      }
    }

    // Business name validation for receipt type 4
    // if (data.receiptType === "4") {
    if (data.receiptType === "3") {
      if (!data.business_name || data.business_name.trim() === "") {
        errors.business_name = "Se requiere el nombre de la empresa";
      }
      if (!data.ltda || data.ltda === "0") {
        errors.ltda = "Seleccione una opción";
      }
    }

    // Last name validation
    if (!data.lastname || data.lastname.trim() === "") {
      errors.lname = "El apellido es obligatorio";
    }

    // Tour validation
    if (!data.tour || data.tour.trim() === "") {
      errors.tour = "Se requiere tour";
    }

    // Address validation
    if (!data.address || data.address.trim() === "") {
      errors.address = "La dirección es necesaria";
    }


    return errors;
  };
  const handleSubmit = () => {
    const collectedData = collectAccordionData();
    const validationErrors = validateForm(collectedData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // No errors, proceed with form submission
      localStorage.setItem("tablePayment", JSON.stringify(collectedData));
      navigate(`/table/pago?id=${tId}`);

    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.text-danger');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

  };

  // timer
  const [elapsedTime, setElapsedTime] = useState("");
  const calculateElapsedTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diff = now - created;

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes} min ${seconds} seg`;
  };
  useEffect(
    () => {
      if (tableData.length > 0 && tableData[0].created_at) {
        const timer = setInterval(() => {
          setElapsedTime(calculateElapsedTime(tableData[0].created_at));
        }, 1000);

        return () => clearInterval(timer);
      }
    },
    [tableData]
  );
  // get product
  const fetchAllItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/item/getAll`,{headers: {
        Authorization: `Bearer ${token}`
      }});
      setObj1(response.data.items);
    } catch (error) {
      console.error(
        "Error fetching items:",
        error.response ? error.response.data : error.message
      );
    }
  };
  /* get name and image */
  const getItemInfo = (itemId) => {
    const item = obj1.find((item) => item.id === itemId);
    if (item) {
      return { name: item.name, image: item.image };
    } else {
      // If the item is not found in obj1, check tableData
      const tableItem = tableData[0]?.items.find(item => item.item_id === itemId);
      if (tableItem) {
        return { name: `Item ${itemId}`, image: "" }; // You might want to store and use the actual name and image
      }
      return { name: "Unknown Item", image: "" };
    }
  };

  const handleDeleteClick = async (itemToDelete) => {
    setIsProcessing(true);
    if (itemToDelete) {
      try {
        const response = await axios.delete(
          `${apiUrl}/order/deleteSingle/${itemToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log("Product deleted successfully:", response.data);
        getTableData(tId);
      } catch (error) {
        console.error(
          "Error Delete OrderData:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };
  //   add note
  const [addNotes, setAddNotes] = useState(
    Array(tableData.flatMap((t) => t.items).length).fill(false)
  );

  const addNoteToDatabase = async (itemId, note) => {
    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${apiUrl}/order/addNote/${itemId}`,
        {
          notes: note
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        return true;
      } else {
        console.error("Failed to add note:", response.data.message);
        return false;
      }
    } catch (error) {
      console.error(
        "Error adding note:",
        error.response ? error.response.data : error.message
      );
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitNote = async (e, index, oId) => {
    e.preventDefault();
    const finalNote = e.target.elements[0].value.trim();
    if (finalNote) {
      const flatIndex = tableData
        .flatMap((t) => t.items)
        .findIndex((_, i) => i === index);
      const tableIndex = tableData.findIndex((t) =>
        t.items.includes(tableData.flatMap((t) => t.items)[flatIndex])
      );
      const itemIndex = tableData[tableIndex].items.findIndex(
        (item) => item === tableData.flatMap((t) => t.items)[flatIndex]
      );

      const tableId = tableData[tableIndex].id;
      const itemId = tableData[tableIndex].items[itemIndex].item_id;

      const success = await addNoteToDatabase(oId, finalNote);

      if (success) {
        handleNoteChange(index, finalNote);
      } else {
        // Handle error - maybe show an error message to the user
        console.error("Failed to add note to database");
      }
    }

    const updatedAddNotes = [...addNotes];
    updatedAddNotes[index] = false;
    setAddNotes(updatedAddNotes);
  };

  const handleNoteChange = (index, note) => {
    const updatedTableData = [...tableData];
    const flatIndex = tableData
      .flatMap((t) => t.items)
      .findIndex((_, i) => i === index);
    const tableIndex = tableData.findIndex((t) =>
      t.items.includes(tableData.flatMap((t) => t.items)[flatIndex])
    );
    const itemIndex = tableData[tableIndex].items.findIndex(
      (item) => item === tableData.flatMap((t) => t.items)[flatIndex]
    );
    updatedTableData[tableIndex].items[itemIndex].notes = note;
    setTableData(updatedTableData);
  };

  const handleAddNoteClick = (index) => {
    const updatedAddNotes = [...addNotes];
    updatedAddNotes[index] = true;
    setAddNotes(updatedAddNotes);
  };
  return (
    <div>
      <Header />
      <div className="s_bg_dark">
        <div className="j-flex">
          <div>
            <Sidenav />
          </div>
          <div className="flex-grow-1 sidebar j-position-sticky text-white">
            <div className="j-counter-header">
              <Link to={`/table`}>
                <div className="j-table-datos-btn">
                  <button className="bj-btn-outline-primary j-tbl-btn-font-1 btn">
                    <HiOutlineArrowLeft className="j-table-datos-icon" />Regresar
                  </button>
                </div>
              </Link>
              <h2 className="text-white j-table-font-1 mb-0">Mesa {tId}</h2>
              <div className="j-menu-bg-color">
                <div className="j-table-cart-2 d-flex justify-content-between ">
                  <div className="line1  flex-grow-1">
                    <div className="text-decoration-none px-2 sj_text_medium" style={{ cursor: 'pointer' }}>
                      <FaCircleCheck className="mx-1" />
                      <span>Productos</span>
                    </div>
                  </div>
                  <div className="flex-grow-1 text-center">
                    <Link className="text-decoration-none px-2 sj_text_blue">
                      <FaCircleCheck className="mx-1" />
                      <span>Datos</span>
                    </Link>
                  </div>
                  <div className="line2  flex-grow-1 text-end">
                    <div onClick={handleSubmit} style={{ cursor: 'pointer' }}
                      className="text-decoration-none px-2 sj_text_medium"
                    >
                      <FaCircleCheck className="mx-1" />
                      <span>Pago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" mt-4 mx-4 sj_hwidth">
              <div className="bg_gay p-4">
                <p className="mb-2">Datos cliente</p>
                <p>Tipos de comprobantes</p>
                <hr className="sj_bottom" />
                <Accordion className="sj_accordion" defaultActiveKey={["0"]}>
                  <Accordion.Item eventKey="0" className="mb-3">
                    <Accordion.Header>
                      {" "}
                      <div
                        onClick={() => handleAccordionClick("1")}
                        className={`sj_bg_dark j_td_mp sj_w-75 ${activeAccordionItem ===
                          "1"
                          ? "active"
                          : ""}`}
                      >
                        <input
                          type="radio"
                          name="receiptType"
                          value="1"
                          checked={selectedRadio === "1"}
                          onChange={() => setSelectedRadio("1")}
                          className="me-2 j-radio-checkbox"
                        />
                        <p className="d-inline px-3">Boleta nominativa:</p>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="sj_gay_border px-3 py-4 mt-2 j_tb_size ">
                        <form>
                          <div className="row j_col_width">
                            <div className="col-12 mb-2">
                              <label className="mb-2">Rut </label>
                              <input
                                type="text"
                                name="rut"
                                value={rut1}
                                onChange={(e) => handleRutChange(e, setRut1)}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.rut && <div className="text-danger errormessage">{errors.rut}</div>}

                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Nombre </label>
                              <input
                                type="text"
                                id="fname"
                                name="fname"
                                value={formData.fname}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.fname && <div className="text-danger errormessage">{errors.fname}</div>}

                            </div>
                            <div className="col-6">
                              <label className="mb-2">Apellido Paterno </label>
                              <input
                                type="text"
                                id="id"
                                name="lname"
                                value={formData.lname}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.lname && <div className="text-danger errormessage">{errors.lname}</div>}

                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Giro </label>
                              <input
                                type="text"
                                id="id"
                                name="tour"
                                value={formData.tour}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.tour && <div className="text-danger errormessage">{errors.tour}</div>}

                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Dirección </label>
                              <input
                                type="text"
                                id="id"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.address && <div className="text-danger errormessage">{errors.address}</div>}

                            </div>
                            <div className="col-6 ">
                              <label className="mb-2">E-mail (opcional) </label>
                              <input
                                type="text"
                                id="id" name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                            </div>
                            <div className="col-6 ">
                              <label className="mb-2">
                                Teléfono móvil (opcional){" "}
                              </label>
                              <input
                                type="text"
                                id="id"
                                name="number"
                                value={formData.number}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1" className="mb-3">
                    <Accordion.Header>
                      {" "}

                      <div
                        onClick={() => handleAccordionClick("2")}
                        className={`sj_bg_dark j_td_mp sj_w-75 ${activeAccordionItem ===
                          "2"
                          ? "active"
                          : ""}`}
                      >
                        <input
                          type="radio"
                          name="receiptType"
                          value="1"
                          checked={selectedRadio === "2"}
                          onChange={() => setSelectedRadio("2")}
                          className="me-2 j-radio-checkbox"
                        />
                        <p className="d-inline px-3">Boleta electrónica:</p>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="sj_gay_border px-3 py-4 mt-2 j_tb_size ">
                        <form>
                          <div className="row j_col_width">
                            <div className="col-12 mb-2">
                              <label className="mb-2">Rut </label>
                              <input
                                type="text"
                                name="rut"
                                value={rut2}
                                onChange={(e) => handleRutChange(e, setRut2)}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.rut && <div className="text-danger errormessage">{errors.rut}</div>}

                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Nombre </label>
                              <input
                                type="text"
                                id="id"
                                name="fname"
                                value={formData.fname}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.fname && <div className="text-danger errormessage">{errors.fname}</div>}

                            </div>
                            <div className="col-6">
                              <label className="mb-2">Apellido Paterno </label>
                              <input
                                type="text"
                                id="id"
                                name="lname"
                                value={formData.lname}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.lname && <div className="text-danger errormessage">{errors.lname}</div>}

                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Giro </label>
                              <input
                                type="text"
                                id="id"
                                name="tour"
                                value={formData.tour}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.tour && <div className="text-danger errormessage">{errors.tour}</div>}

                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Dirección </label>
                              <input
                                type="text"
                                id="id"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.address && <div className="text-danger errormessage">{errors.address}</div>}

                            </div>
                            <div className="col-6 ">
                              <label className="mb-2">E-mail (opcional) </label>
                              <input
                                type="text"
                                id="id"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                            </div>
                            <div className="col-6 ">
                              <label className="mb-2">
                                Teléfono móvil (opcional){" "}
                              </label>
                              <input
                                type="text"
                                id="id"
                                name="number"
                                value={formData.number}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2" className="mb-3">
                    <Accordion.Header>
                      {" "}
                      {/* <div className="sj_bg_dark px-4 py-2 mt-3 sj_w-75">
                                                <img src={box4} alt="#" />
                                                <p className="d-inline px-3">
                                                    Boleta personal
                                                </p>
                                            </div> */}
                      <div
                        onClick={() => handleAccordionClick("3")}
                        className={`sj_bg_dark j_td_mp sj_w-75 ${activeAccordionItem ===
                          "2"
                          ? "active"
                          : ""}`}
                      >
                        <input
                          type="radio"
                          name="receiptType"
                          value="1"
                          checked={selectedRadio === "3"}
                          onChange={() => setSelectedRadio("3")}
                          className="me-2 j-radio-checkbox"
                        />
                        <p className="d-inline px-3">Factura:</p>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="sj_gay_border px-3 py-4 mt-2 j_tb_size ">
                        <form>
                          <div className="row j_col_width">
                            <div className="col-6 mb-2">
                              <label className="mb-2">Rut </label>
                              <input
                                type="text"
                                name="rut"
                                value={rut3}
                                onChange={(e) => handleRutChange(e, setRut3)}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.rut && <div className="text-danger errormessage">{errors.rut}</div>}

                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Razón Social </label>
                              <input
                                type="text"
                                id="id"
                                name="bname"
                                value={formData.bname}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.business_name && <div className="text-danger errormessage">{errors.business_name}</div>}

                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Sa, Ltda, Spa </label>
                              <select
                                name="ltda"
                                value={formData.ltda}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white form-select">
                                <option value="0">Seleccionar opción</option>
                                <option value="sa">Sa</option>
                                <option value="ltda">Ltda</option>
                                <option value="spa">Spa</option>
                              </select>
                              {errors.ltda && <div className="text-danger errormessage">{errors.ltda}</div>}

                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Apellido Paterno</label>
                              <input
                                type="text"
                                id="id"
                                name="lname"
                                value={formData.lname}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.lname && <div className="text-danger errormessage">{errors.lname}</div>}

                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Giro </label>
                              <input
                                type="text"
                                id="id"
                                name="tour"
                                value={formData.tour}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.tour && <div className="text-danger errormessage">{errors.tour}</div>}

                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Dirección </label>
                              <input
                                type="text"
                                id="id"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                              {errors.address && <div className="text-danger errormessage">{errors.address}</div>}

                            </div>
                            <div className="col-6 ">
                              <label className="mb-2">E-mail (opcional) </label>
                              <input
                                type="text"
                                id="id"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                            </div>
                            <div className="col-6 ">
                              <label className="mb-2">
                                Teléfono móvil (opcional){" "}
                              </label>
                              <input
                                type="text"
                                id="id"
                                name="number"
                                value={formData.number}
                                onChange={handleInputChange}
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white"
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  {/* <Accordion.Item eventKey="3" >
                                        <Accordion.Header>
                                            <div onClick={() => handleAccordionClick("4")}
                                                className={`sj_bg_dark j_td_mp sj_w-75 ${activeAccordionItem === "2" ? "active" : ""
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="receiptType"
                                                    value="1"
                                                    checked={selectedRadio === "4"}
                                                    onChange={() => setSelectedRadio("4")}
                                                    className="me-2 j-radio-checkbox"
                                                />
                                                <p className="d-inline px-3">Factura (Rut) (Iva 19%)</p>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="sj_gay_border px-3 py-4 mt-2">
                                                <form>
                                                    <label htmlFor="id">DNI </label>
                                                    <br />
                                                    <input
                                                        type="text"
                                                        id="id"
                                                        name="id"
                                                        onChange={handleChange}
                                                        value={customerData.id}
                                                        className="sj_bg_dark sj_width_input  px-4 py-2 text-white "
                                                    />
                                                    <br />
                                                    <label htmlFor="name" className="pt-3">
                                                        Nombre
                                                    </label>
                                                    <br />
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={customerData.name}
                                                        onChange={handleChange}
                                                        className="sj_bg_dark sj_width_input  px-4 py-2 text-white "
                                                    />
                                                    <br />
                                                    <label htmlFor="email" className="pt-3">
                                                        Correo electrónico{" "}
                                                    </label>
                                                    <br />
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={customerData.email}
                                                        onChange={handleChange}
                                                        className="sj_bg_dark sj_width_input  px-4 py-2 text-white "
                                                    />
                                                </form>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item> */}
                </Accordion>
              </div>
            </div>
          </div>
          <div
            className="j-counter-price position-sticky"
            style={{ top: "77px" }}
          >
            <div className="j_position_fixed j_b_hd_width">
              <h2 className="text-white j-tbl-text-13">Resumen</h2>
              <div className="j-counter-price-data">
                <h3 className="text-white mt-3 j-tbl-text-13">Datos</h3>
                <div className="j_td_center my-3">
                  <div className="j-busy-table j_busy_table_last d-flex align-items-center">
                    <div className="j-b-table" />
                    <p className="j-table-color j-tbl-font-6">Ocupado</p>
                  </div>

                  <div className="b-date-time b_date_time2  d-flex align-items-center">
                    <svg
                      class="j-canvas-svg-i"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                        clip-rule="evenodd"
                      />
                    </svg>

                    <p className="mb-0 ms-2 me-3 text-white j-tbl-font-6">
                      {elapsedTime}
                    </p>
                  </div>
                </div>

                <div className="j-counter-price-data">
                  <div className="j-orders-inputs j_td_inputs">
                    <div className="j-orders-code">
                      <label className="j-label-name text-white mb-2 j-tbl-btn-font-1">
                        Quién registra
                      </label>
                      <div>
                        <input
                          className="j-input-name j_input_name520"
                          type="text"
                          placeholder="Lucia Lopez"
                          value={tableData[0]?.customer_name}

                        />
                      </div>
                    </div>
                    <div className="j-orders-code">
                      <label className="j-label-name j-tbl-btn-font-1 text-white mb-2">
                        Personas
                      </label>
                      <div>
                        <input
                          className="j-input-name630"
                          type="text"
                          placeholder="5"
                          value={tableData[0]?.person}

                        />
                      </div>
                    </div>
                  </div>
                  <div className="j-counter-order">
                    <h3 className="text-white j-tbl-pop-1">Pedido </h3>

                    <div className="j-counter-order-data j_counter_order_width j_counter_order_width_extra">
                      {(tableData && tableData.length > 0
                        ? tableData[0].items
                        : cartItems)
                        .slice(
                          0,
                          showAllItems
                            ? tableData && tableData.length > 0
                              ? tableData[0].items.length
                              : cartItems.length
                            : 3
                        )
                        .map((item, index) => {
                          const itemInfo = getItemInfo(
                            item.item_id || item.id
                          );
                          return (
                            <div
                              className="j-counter-order-border-fast"
                              key={item.id}
                            >
                              <div className="j-counter-order-img j_counter_order_img_last">
                                <div className="j_d_flex_aic">
                                  <img
                                    src={`${API}/images/${itemInfo.image}`}
                                    alt=""
                                  />
                                  <h5 className="text-white j-tbl-font-5">
                                    {itemInfo.name}
                                  </h5>
                                </div>
                                <div className="d-flex align-items-center">
                                  <div className="j-counter-mix">
                                    <button
                                      className="j-minus-count"
                                      onClick={() => decrement(item.id, item.item_id, item.quantity, tId)}
                                    >
                                      <FaMinus />
                                    </button>
                                    <h3> {item.quantity}</h3>
                                    <button
                                      className="j-plus-count"
                                      onClick={() => increment(item.id,
                                        item.item_id,
                                        item.quantity,
                                        tId)}
                                    >
                                      <FaPlus />
                                    </button>
                                  </div>
                                  <h4 className="text-white fw-semibold">
                                    ${parseInt(item.amount)}
                                  </h4>
                                  <button
                                    className="j-delete-btn me-2"
                                    onClick={() => handleDeleteClick(item.id)}
                                  >
                                    <RiDeleteBin6Fill />
                                  </button>
                                </div>
                              </div>
                              <div className="text-white j-order-count-why">
                                {item.notes ? (
                                  <span className="j-nota-blue">
                                    Nota: {item.notes}
                                  </span>
                                ) : (
                                  <div>
                                    {addNotes[index] ? (
                                      <form
                                        onSubmit={(e) =>
                                          handleSubmitNote(e, index, item.id)}
                                      >
                                        <span className="j-nota-blue">
                                          Nota:{" "}
                                        </span>
                                        <input
                                          className="j-note-input"
                                          type="text"
                                          defaultValue={item.notes || ""}
                                          autoFocus
                                        />
                                      </form>
                                    ) : (
                                      <button
                                        type="button"
                                        className="j-note-final-button"
                                        onClick={() =>
                                          handleAddNoteClick(index)}
                                      >
                                        + Agregar nota
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      {tableData[0]?.items.length > 3 && (
                        <Link
                          onClick={toggleShowAllItems}
                          className="sjfs-14"
                        >
                          {showAllItems ? "Ver menos" : "Ver más"}
                        </Link>
                      )}
                    </div>
                    <div className="j-counter-total">
                      <h5 className="text-white j-tbl-text-15">Costo total</h5>
                      <div className="j-total-discount d-flex justify-content-between">
                        <p className="j-counter-text-2">Artículos</p>
                        <span className="text-white">
                          {tableData.map((item) => (
                            <span key={item.id}>
                              ${parseFloat(item.order_total).toFixed(2)}
                            </span>
                          ))}
                        </span>
                      </div>
                      <div className="j-border-bottom-counter">
                        <div className="j-total-discount d-flex justify-content-between">
                          <p className="j-counter-text-2">Descuentos</p>
                          <span className="text-white">
                            {tableData.map((item) => (
                              <span key={item.id}>
                                ${parseFloat(item.discount).toFixed(2)}
                              </span>
                            ))}
                          </span>
                        </div>
                      </div>
                      <div className="j-total-discount my-2 d-flex justify-content-between">
                        <p className="text-white bj-delivery-text-153 ">
                          Total
                        </p>
                        <span className="text-white bj-delivery-text-153 ">
                          {tableData.map((item) => (
                            <span key={item.id}>
                              ${" "}
                              {parseFloat(
                                item.order_total - item.discount
                              ).toFixed(2)}
                            </span>
                          ))}
                        </span>
                      </div>
                      <div
                        onClick={handleSubmit}

                        className="btn w-100 j-btn-primary text-white j-tbl-btn-font-1"
                      >
                         Continuar
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default TableDatos;
