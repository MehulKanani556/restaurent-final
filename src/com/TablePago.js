import React, { useEffect, useState } from "react";
import Header from "./Header";
import box from "../Image/Ellipse 20.png";
import box4 from "../Image/box5.png";
import { FaCircleCheck, FaMinus, FaPlus } from "react-icons/fa6";
import { Accordion, Button, Modal } from "react-bootstrap";
import check from "../Image/Checkbox.png";
import check5 from "../Image/Checkbox6.png";
import Sidenav from "./Sidenav";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import img2 from "../Image/crispy-fry-chicken.png";
import img3 from "../Image/Strawberry-gelatin.png";
import pic2 from "../img/Image(1).jpg";
import axios from "axios";

const TablePago = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const API = process.env.REACT_APP_IMAGE_URL;
  const [ cartItems, setCartItems ] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const [ orderDetail, setOrderDetail ] = useState(
    JSON.parse(localStorage.getItem("orderData"))
  );
  const [ payment, setPayment ] = useState(
    JSON.parse(localStorage.getItem("payment"))
  );
  const token = localStorage.getItem("token");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  const navigate = useNavigate();
  const [ tId, setTId ] = useState(id);

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

  useEffect(
    () => {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    },
    [ cartItems ]
  );
  const [ showAllItems, setShowAllItems ] = useState(false);
  const toggleShowAllItems = () => {
    setShowAllItems(!showAllItems);
  };
// cart
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

  const [ show, setShow ] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // create family success
  const [ showCreSuc, setShowCreSuc ] = useState(false);
  const handleCloseCreSuc = () => setShowCreSuc(false);
  const handleShowCreSuc = () => setShowCreSuc(true);
  const [ showLoader, setShowLoader ] = useState(false);
  const [ showSuccess, setShowSuccess ] = useState(false);
  const [ deletedItemIndex, setDeletedItemIndex ] = useState(null);

  const totalCost = getTotalCost();
  const discount = 1.0;
  const propina = 5.0;
  const finalTotal = totalCost - discount;

  useEffect(
    () => {
      if (showCreSuc) {
        setShowLoader(true);
        const timer = setTimeout(() => {
          setShowLoader(false);
          setShowSuccess(true);
        }, 2000);

        return () => clearTimeout(timer);
      }
    },
    [ showCreSuc ]
  );

  const initialCustomerData = {
    amount: "",
    turn: ""
  };
  const handleCheckboxChange = (value) => {
    if (selectedCheckboxes.includes(value)) {
      setSelectedCheckboxes((prev) => prev.filter((item) => item !== value));
      setCustomerData(initialCustomerData);
    } else {
      setSelectedCheckboxes((prev) => [ ...prev, value ]);
    }
  };
// value get from form
const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
const [customerData, setCustomerData] = useState({});

const handleChange = (event) => {
  let { name, value } = event.target;
  value = value.replace(/[^0-9]/g, '');
  setCustomerData((prevState) => ({
    ...prevState,
    [name]: value
  }));
};
console.log(customerData,selectedCheckboxes);



const handleSubmit = async () =>{

  try {
   
      const responsedata = await axios.post(
        `${apiUrl}/order/place_new`,
        orderDetail,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const paymentData = {
        ...payment, 
        amount: customerData.amount,
        type: selectedCheckboxes[0],
        order_master_id:responsedata.data.details.order_master.id,
        return:customerData.turn

       
      };
  
      console.log("Order created successfully:", responsedata.data);
      const response = await axios.post(
        `${apiUrl}/payment/insert`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log("payemnt suc", response.data)

    // Call the table/updateStatus API
      await axios.post(
        `${apiUrl}/table/updateStatus`,
        {
          table_id: parseInt(tId),
          status: "busy" // Set the status you need
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    console.log("Table status updated successfully");

    // Clear cart items from local storage
      localStorage.removeItem("cartItems");
      localStorage.removeItem('orderData');
      localStorage.removeItem('payment');

    // Clear cart items from state
    setCartItems([]);
    setCountsoup([]);

    navigate("/table");

    // Handle successful order creation (e.g., show success message, redirect, etc.)
  } catch (err) {
    console.error("Error creating order:", err);
  }
}
  return (
    <div className="s_bg_dark">
      <Header />
      <div className="j-flex">
        <div>
          <Sidenav />
        </div>
        <div className="flex-grow-1 sidebar j-position-sticky text-white">
          <div className="j-counter-header">
            <Link to={`/table1?id=${tId}`}>
              <div className="j-table-datos-btn">
                <button className="bj-btn-outline-primary btn j-tbl-btn-font-1 ">
                  <HiOutlineArrowLeft className="j-table-datos-icon" />Regresar
                </button>
              </div>
            </Link>
            <h2 className="text-white j-table-font-1 mb-0">Mesa 2</h2>
            <div className="j-menu-bg-color">
              <div className="j-table-cart-2 d-flex justify-content-between ">
                <div className="line1  flex-grow-1">
                  <Link className="text-decoration-none px-2 sj_text_medium">
                    <FaCircleCheck className="mx-1" />
                    <span>Productos</span>
                  </Link>
                </div>
                <div className="  flex-grow-1 text-center">
                  <Link
                    to={`/table/datos?id=${tId}`}
                    className="text-decoration-none px-2  sj_text_medium"
                  >
                    <FaCircleCheck className="mx-1" />
                    <span>Datos</span>
                  </Link>
                </div>
                <div className="line2  flex-grow-1 text-end">
                  <Link className="text-decoration-none px-2 sj_text_blue">
                    <FaCircleCheck className="mx-1" />
                    <span>Pago</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className=" mt-4 mx-4 sj_hwidth">
            <div className="bg_gay p-4">
              <div className="j-final-stage mb-2">
                <h5>Tipos de pago</h5>
                <div className="d-flex align-items-center">
                  <button
                    data-bs-theme="dark"
                    className="j_drop btn j-btn-primary j-tbl-font-3"
                    onClick={handleShow}
                  >
                    <FaPlus className="j-icon-font-1" />
                    Agregar propina
                  </button>
                </div>

                <Modal
                  show={show}
                  onHide={handleClose}
                  backdrop={true}
                  keyboard={false}
                  className="m_modal"
                >
                  <Modal.Header closeButton className="m_borbot">
                    <Modal.Title className="j-tbl-text-10">
                      Agregar propina
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="border-0">
                    <div className="mb-3">
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="form-label j-tbl-font-11"
                      >
                        Cantidad
                      </label>
                      <input
                        type="text"
                        className="form-control j-table_input"
                        id="exampleFormControlInput1"
                        placeholder="$20"
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="border-0">
                    <Button
                      className="j-tbl-btn-font-1"
                      variant="primary"
                      onClick={() => {
                        handleShowCreSuc();
                        handleClose();
                      }}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

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
                      <img src={require("../Image/check-circle.png")} alt="" />
                      <p className="mb-0 mt-2 h6 j-tbl-pop-1">
                        Propina agregada
                      </p>
                      <p className="opacity-75 j-tbl-pop-2">
                        Su propina ha sido agregada exitosamente
                      </p>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>

              <p className="j-final-p">Puedes seleccionar uno o mas</p>
              <hr className="sj_bottom" />

              <Accordion className="sj_accordion" alwaysOpen>
                <Accordion.Item eventKey="0" className="mb-2">
                  <Accordion.Header>
                    <div
                      onClick={() => handleCheckboxChange("cash")}
                      className={`sj_bg_dark j_td_mp sj_w-75 ${selectedCheckboxes.includes(
                        "cash"
                      )
                        ? "active"
                        : ""}`}
                    >
                      <input
                        type="checkbox"
                        name="receiptType"
                        value="cash"
                        checked={selectedCheckboxes.includes("cash")}
                        onChange={() => handleCheckboxChange("cash")}
                        className="me-2 j-change-checkbox"
                      />
                      <p className="d-inline px-3">Efectivo</p>
                    </div>
                  </Accordion.Header>
                  {selectedCheckboxes.includes("cash") && (
                    <Accordion.Body>
                      <div className="sj_gay_border px-3 py-4 mt-2">
                        <form className="j_payment_flex">
                          <div className="flex-grow-1 j_paymemnt_margin">
                            <label className="mb-2">Cantidad</label>
                            <br />
                            <input
                              type="text"
                              id="name"
                              name="amount"
                              value={`$${customerData.amount || ""}`}
                              onChange={handleChange}
                              className="input_bg_dark w-full px-4 py-2 text-white sj_width_mobil"
                            />
                          </div>
                          <div className="flex-grow-1">
                            <label className="mb-2">Vuelto</label>
                            <br />
                            <input
                              type="email"
                              id="email"
                              name="turn"
                              value={`$${customerData.turn || ""}`}
                              onChange={handleChange}
                              className="input_bg_dark px-4 py-2 text-white sj_width_mobil"
                            />
                          </div>
                        </form>
                      </div>
                    </Accordion.Body>
                  )}
                </Accordion.Item>
                <Accordion.Item eventKey="1" className="mb-2">
                  <Accordion.Header>
                    <div
                      onClick={() => handleCheckboxChange("debit")}
                      className={`sj_bg_dark j_td_mp sj_w-75 ${selectedCheckboxes.includes(
                        "debit"
                      )
                        ? "active"
                        : ""}`}
                    >
                      <input
                        type="checkbox"
                        name="receiptType"
                        value="2"
                        checked={selectedCheckboxes.includes("debit")}
                        onChange={() => handleCheckboxChange("debit")}
                        className="me-2 j-change-checkbox"
                      />
                      <p className="d-inline px-3">Tarjeta de debito</p>
                    </div>
                  </Accordion.Header>
                  {selectedCheckboxes.includes("debit") && (
                    <Accordion.Body>
                      <div className="sj_gay_border px-3 py-4 mt-2">
                        <form>
                          <label className="mb-2 sjfs-16">Cantidad</label>
                          <br />
                          <input
                            type="text"
                            id="name"
                            name="amount"
                            value={`$${customerData.amount || ""}`}
                            onChange={handleChange}
                            className="sj_bg_dark sj_width_input px-4 py-2 text-white"
                          />
                        </form>
                      </div>
                    </Accordion.Body>
                  )}
                </Accordion.Item>
                <Accordion.Item eventKey="2" className="mb-2">
                  <Accordion.Header>
                    <div
                      onClick={() => handleCheckboxChange("credit")}
                      className={`sj_bg_dark j_td_mp sj_w-75 ${selectedCheckboxes.includes(
                        "credit"
                      )
                        ? "active"
                        : ""}`}
                    >
                      <input
                        type="checkbox"
                        name="receiptType"
                        value="3"
                        checked={selectedCheckboxes.includes("credit")}
                        onChange={() => handleCheckboxChange("credit")}
                        className="me-2 j-change-checkbox"
                      />
                      <p className="d-inline px-3">Tarjeta de credito</p>
                    </div>
                  </Accordion.Header>
                  {selectedCheckboxes.includes("credit") && (
                    <Accordion.Body>
                      <div className="sj_gay_border px-3 py-4 mt-2">
                        <form className="j_payment_flex">
                          <div className=" flex-grow-1 j_paymemnt_margin">
                            <label className="mb-2">Cantidad</label>
                            <br />
                            <input
                              type="text"
                              id="name"
                              name="amount"
                              value={`$${customerData.amount || ""}`}
                              onChange={handleChange}
                              className="input_bg_dark w-full px-4 py-2 text-white sj_width_mobil"
                            />
                          </div>
                       
                        </form>
                      </div>
                    </Accordion.Body>
                  )}
                </Accordion.Item>
                <Accordion.Item eventKey="3" className="mb-2">
                  <Accordion.Header>
                    <div
                      onClick={() => handleCheckboxChange("transfer")}
                      className={`sj_bg_dark j_td_mp sj_w-75 ${selectedCheckboxes.includes(
                        "transfer"
                      )
                        ? "active"
                        : ""}`}
                    >
                      <input
                        type="checkbox"
                        name="receiptType"
                        value="4"
                        checked={selectedCheckboxes.includes("transfer")}
                        onChange={() => handleCheckboxChange("transfer")}
                        className="me-2 j-change-checkbox"
                      />
                      <p className="d-inline px-3">Transferencia</p>
                    </div>
                  </Accordion.Header>
                  {selectedCheckboxes.includes("transfer") && (
                    <Accordion.Body>
                      <div className="sj_gay_border px-3 py-4 mt-2">
                        <form>
                          <label className="mb-2 sjfs-16">Cantidad</label>
                          <br />
                          <input
                            type="text"
                            id="name"
                            name="amount"
                            value={`$${customerData.amount || ""}`}
                            onChange={handleChange}
                            className="sj_bg_dark sj_width_input px-4 py-2 text-white"
                          />
                        </form>
                      </div>
                    </Accordion.Body>
                  )}
                </Accordion.Item>
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
                        value={orderDetail?.order_master.customer_name}
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
                        value={orderDetail?.order_master.person}
                      />
                    </div>
                  </div>
                </div>
                <div className="j-counter-order">
                  <h3 className="text-white j-tbl-pop-1">Pedido </h3>

                  <div className="j-counter-order-data j_counter_order_width j_counter_order_width_extra">
                  {cartItems
                        .slice(0, showAllItems ? cartItems.length : 3)
                        .map((item, index) => (
                      <div className="j-counter-order-border-fast" key={item.id}>
                        <div className="j-counter-order-img j_counter_order_img_last">
                          <div className="j_d_flex_aic">
                            <img  src={`${API}/images/${item.image}`} alt="" />
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
                      <p className="text-white bj-delivery-text-153 ">Total</p>
                      <span className="text-white bj-delivery-text-153 ">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                    <div
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
  );
};

export default TablePago;
