import React, { useEffect, useState } from "react";
import Header from "./Header";
import box from "../Image/Ellipse 20.png";
import box4 from "../Image/box5.png";
import { FaCircleCheck } from "react-icons/fa6";
import { Accordion, Button, Modal } from "react-bootstrap";
import Sidenav from "./Sidenav";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineArrowSmLeft } from "react-icons/hi";
import img2 from "../Image/crispy-fry-chicken.png";
import img3 from "../Image/Strawberry-gelatin.png";
import pic2 from "../img/Image(1).jpg";

const TableDatos = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const API = process.env.REACT_APP_IMAGE_URL;
  const [ cartItems, setCartItems ] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [ tId, setTId ] = useState(id);
  const [ orderDetail, setOrderDetail ] = useState(
    JSON.parse(localStorage.getItem("orderData"))
  );

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
  const [ countsoup, setCountsoup ] = useState(
    orderitem.map((item) => parseInt(item.quantity))
  );

  const [ itemToDelete, setItemToDelete ] = useState(null);
  const [ showAllItems, setShowAllItems ] = useState(false);
  const toggleShowAllItems = () => {
    setShowAllItems(!showAllItems);
  };
  useEffect(
    () => {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    },
    [ cartItems ]
  );

  const addItemToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      // Item already exists in cart, increment its count
      const updatedCartItems = cartItems.map(
        (cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, count: cartItem.count + 1 }
            : cartItem
      );
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCountsoup(updatedCartItems.map((item) => item.count));
    } else {
      // Item doesn't exist in cart, add it with count 1
      const newItem = { ...item, count: 1 };
      setCartItems([ ...cartItems, newItem ]);
      setCountsoup([ ...countsoup, 1 ]);
      localStorage.setItem(
        "cartItems",
        JSON.stringify([ ...cartItems, newItem ])
      );
    }
  };
  const removeItemFromCart = (itemId) => {
    const updatedCartItems = cartItems
      .map((item) => {
        if (item.id === itemId) {
          return { ...item, count: Math.max(0, item.count - 1) };
        }
        return item;
      })
      .filter((item) => item.count > 0);

    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    // Update countsoup accordingly
    const updatedCountsoup = updatedCartItems.map((item) => item.count);
    setCountsoup(updatedCountsoup);
  };
  const removeAllItemFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const getTotalCost = () => {
    return cartItems.reduce(
      (total, item, index) => total + parseInt(item.price) * item.count,
      0
    );
  };
  //   add note
  const [ isEditing, setIsEditing ] = useState([]);

  const handleNoteChange = (index, newNote) => {
    const updatedCartItems = cartItems.map(
      (item, i) => (i === index ? { ...item, note: newNote } : item)
    );
    setCartItems(updatedCartItems);
  };
  const handleFinishEditing = (index) => {
    const updatedCartItems = cartItems.map(
      (item, i) => (i === index ? { ...item, isEditing: false } : item)
    );
    setCartItems(updatedCartItems);
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Enter") {
      const updatedIsEditing = [ ...isEditing ];
      updatedIsEditing[index] = false;
      setIsEditing(updatedIsEditing);
    }
  };
  const handleAddNoteClick = (index) => {
    const updatedCartItems = cartItems.map(
      (item, i) =>
        i === index
          ? { ...item, isEditing: true, note: item.note || "Nota: " }
          : item
    );
    setCartItems(updatedCartItems);
  };

  const [ showCreSuc, setShowCreSuc ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const handleCloseCreSuc = () => setShowCreSuc(false);
  const handleShowCreSuc = () => setShowCreSuc(true);

  const [ deletedItemIndex, setDeletedItemIndex ] = useState(null);

  const totalCost = getTotalCost();
  const discount = 1.0;

  const finalTotal = totalCost - discount;

  const [ customerData, setCustomerData ] = useState({
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

  const [ showEditFam, setShowEditFam ] = useState(false);
  const handleShowEditFam = () => setShowEditFam(true);

  const [ selectedRadio, setSelectedRadio ] = useState("1");
  const [ activeAccordionItem, setActiveAccordionItem ] = useState("0");
  const handleAccordionClick = (value) => {
    setSelectedRadio(value);
  };

  const [ rut1, setRut1 ] = useState("");
  const [ rut2, setRut2 ] = useState("");
  const [ rut3, setRut3 ] = useState("");

  const handleRutChange = (e, setRut) => {
    let value = e.target.value.replace(/-/g, ""); // Remove any existing hyphen
    if (value.length > 6) {
      value = value.slice(0, 6) + "-" + value.slice(6);
    }
    setRut(value);
  };

  const [ formData, setFormData ] = useState({
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
  const handleSubmit = () => {
    const collectedData = collectAccordionData();
    console.log(collectedData);
    localStorage.setItem("payment", JSON.stringify(collectedData));
    navigate(`/table/pago?id=${tId}`);
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
              <Link to={`/table1?id=${tId}`}>
                <div className="j-table-datos-btn">
                  <button className="bj-btn-outline-primary j-tbl-btn-font-1 btn">
                    <HiOutlineArrowLeft className="j-table-datos-icon" />Regresar
                  </button>
                </div>
              </Link>
              <h2 className="text-white j-table-font-1 mb-0">Mesa 2</h2>
              <div className="j-menu-bg-color">
                <div className="j-table-cart-2 d-flex justify-content-between ">
                  <div className="line1  flex-grow-1">
                    <Link
                      to={`/table1?id=${tId}`}
                      className="text-decoration-none px-2 sj_text_medium"
                    >
                      <FaCircleCheck className="mx-1" />
                      <span>Productos</span>
                    </Link>
                  </div>
                  <div className="  flex-grow-1 text-center">
                    <Link className="text-decoration-none px-2 sj_text_blue">
                      <FaCircleCheck className="mx-1" />
                      <span>Datos</span>
                    </Link>
                  </div>
                  <div className="line2  flex-grow-1 text-end">
                    <Link
                      to={`/table/pago?id=${tId}`}
                      className="text-decoration-none px-2 sj_text_medium"
                    >
                      <FaCircleCheck className="mx-1" />
                      <span>Pago</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className=" mt-4 mx-4 sj_hwidth">
              <div className="bg_gay p-4">
                <p className="mb-2">Datos cliente</p>
                <p>Tipos de comprobantes</p>
                <hr className="sj_bottom" />
                <Accordion className="sj_accordion" defaultActiveKey={[ "0" ]}>
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
                            </div>
                            <div className="col-6 mb-2">
                              <label className="mb-2">Sa, Ltda, Spa </label>
                              <select
                                className="sj_bg_dark sj_width_input ps-2 pe-4 py-2 text-white form-select"
                                name="ltda"
                                value={formData.ltda}
                                onChange={handleInputChange}
                              >
                                <option value="0">Seleccionar opción</option>
                                <option value="sa">Sa</option>
                                <option value="ltda">Ltda</option>
                                <option value="spa">Spa</option>
                              </select>
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
                </Accordion>
              </div>
            </div>
          </div>
          <div
            className="j-counter-price position-sticky"
            style={{ top: "77px" }}
          >
            <div className="j_position_fixed">
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
                      className="j-canvas-svg-i"
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
                      30 min 20 sg
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
                          // value={orderDetail?.order_master.customer_name}
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
                          // value={orderDetail?.order_master.person}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="j-counter-order">
                    <h3 className="text-white j-tbl-pop-1">Pedido </h3>

                    <div className="j-counter-order-data j_counter_order_width j_counter_order_width j_counter_order_width_extra">
                      {cartItems
                        .slice(0, showAllItems ? cartItems.length : 3)
                        .map((item, index) => (
                          <div
                            className="j-counter-order-border-fast"
                            key={index}
                          >
                            <div className="j-counter-order-img j_counter_order_img_last">
                              <div className="j_d_flex_aic">
                                <img
                                  src={`${API}/images/${item.image}`}
                                  alt=""
                                />
                                <h5 className="text-white j-tbl-font-5">
                                  {item.name}
                                </h5>
                              </div>
                              <div className="d-flex align-items-center">
                                <div className="j-counter-mix">
                                  <button
                                    className="j-minus-count"
                                    onClick={() => removeItemFromCart(item.id)}
                                  >
                                    <FaMinus />
                                  </button>
                                  <h3> {item.count}</h3>
                                  <button
                                    className="j-plus-count"
                                    onClick={() => addItemToCart(item)}
                                  >
                                    <FaPlus />
                                  </button>
                                </div>
                                <h4 className="text-white fw-semibold">
                                  ${parseInt(item.price) * item.count}
                                </h4>
                                <button
                                  className="j-delete-btn me-2"
                                  onClick={() => removeAllItemFromCart(item.id)}
                                >
                                  <RiDeleteBin6Fill />
                                </button>
                              </div>
                            </div>
                            <div
                              key={index}
                              className="text-white j-order-count-why"
                            >
                              {item.isEditing ? (
                                <div>
                                  <input
                                    className="j-note-input"
                                    type="text"
                                    value={item.note}
                                    onChange={(e) =>
                                      handleNoteChange(index, e.target.value)}
                                    onBlur={() => handleFinishEditing(index)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleFinishEditing(index);
                                    }}
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <div>
                                  {item.note ? (
                                    <p className="j-nota-blue">{item.note}</p>
                                  ) : (
                                    <button
                                      className="j-note-final-button"
                                      onClick={() => handleAddNoteClick(index)}
                                    >
                                      + Agregar nota
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      {cartItems.length > 3 && (
                        <Link onClick={toggleShowAllItems} className="sjfs-14">
                          {showAllItems ? "Ver menos" : "Ver más"}
                        </Link>
                      )}
                    </div>
                    <div className="j-counter-total">
                      <h5 className="text-white j-tbl-text-15">Costo total</h5>
                      <div className="j-total-discount d-flex justify-content-between">
                        <p className="j-counter-text-2">Artículos</p>
                        <span className="text-white">
                          ${totalCost.toFixed(2)}
                        </span>
                      </div>
                      <div className="j-border-bottom-counter">
                        <div className="j-total-discount d-flex justify-content-between">
                          <p className="j-counter-text-2">Descuentos</p>
                          <span className="text-white">
                            ${discount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="j-total-discount my-2 d-flex justify-content-between">
                        <p className="text-white bj-delivery-text-153 ">
                          Total
                        </p>
                        <span className="text-white bj-delivery-text-153 ">
                          ${finalTotal.toFixed(2)}
                        </span>
                      </div>
                      <div
                        // to={`/table/pago?id=${tId}`}
                        onClick={handleSubmit}
                        className="btn w-100 j-btn-primary text-white j-tbl-btn-font-1"
                      >
                        Cobrar
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableDatos;
