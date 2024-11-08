import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import box from "../Image/Ellipse 20.png";
import box4 from "../Image/box5.png";
import { FaCircleCheck, FaMinus, FaPlus } from "react-icons/fa6";
import { Accordion, Button, Modal, Spinner } from "react-bootstrap";
import check from "../Image/Checkbox.png";
import check5 from "../Image/Checkbox6.png";
import Sidenav from "./Sidenav";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import Recipt from "./Recipt";
import { MdOutlineAccessTimeFilled, MdRoomService } from "react-icons/md";
import axios from "axios";
import { FaCalendarAlt } from "react-icons/fa";
//import { enqueueSnackbar  } from "notistack";

const DeliveryPago = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name");
  const API = process.env.REACT_APP_IMAGE_URL;
  const userId = localStorage.getItem("userId");
  const admin_id = localStorage.getItem("admin_id");
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const [payment, setPayment] = useState(
    JSON.parse(localStorage.getItem("payment"))
  );
  const [orderType, setOrderType] = useState(
    JSON.parse(localStorage.getItem("currentOrder")) || []
  );
  const [orderTypeError, setOrderTypeError] = useState("")

  const [tableId] = useState(
    JSON.parse(localStorage.getItem("tableId")) || null
  );

  const [tipAmount, setTipAmount] = useState(0);
  const [show11, setShow11] = useState(false);
  const handleClose11 = () => {
    setShow11(false);

    navigate("/home/usa");
  }
  const handleShow11 = () => setShow11(true);

  const [price, setPrice] = useState("");

  const validateNumericInput = (value, allowDecimal = true) => {
    const regex = allowDecimal ? /^\d*\.?\d{0,2}$/ : /^\d*$/;
    return regex.test(value) ? value : "";
  };
  const [tipError, setTipError] = useState('')

  const handleprice = (event) => {
    let value = event.target.value.replace("$", "");
    value = validateNumericInput(value);
    const numericValue = parseFloat(value) || 0;

    // Assuming a maximum tip of 100% of the total cost
    const maxTip = getTotalCost();
    if (numericValue > maxTip) {
      value = maxTip.toFixed(2);
    }
    if (value) {
      setTipError('');
      setPrice(value);
      setTipAmount(parseFloat(value));
    }
  };

  const [showAllItems, setShowAllItems] = useState(false);
  const toggleShowAllItems = () => {
    setShowAllItems(!showAllItems);
  };

  const [countsoup, setCountsoup] = useState(1);
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCreSuc, setShowCreSuc] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("1");
  const [activeAccordionItem, setActiveAccordionItem] = useState("0");
  const [formErrors, setFormErrors] = useState({});
  const [show, setShow] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleClose = () => {
    setShow(false);
    setPrice('');
    setTipError('');
  }
  const handleShow = () => setShow(true);
  const [lastOrder, setLastOrder] = useState('');           // change

  const [showCreSubSuc, setShowCreSubSuc] = useState(false);
  const handleCloseCreSubSuc = () => setShowCreSubSuc(false);
  const handleShowCreSubSuc = () => {
    setShowCreSubSuc(true);
    setTipAmount(parseFloat(price) || 0);
    setTimeout(() => {
      handleCloseCreSubSuc();
    }, 2000);
  };

  const [isEditing, setIsEditing] = useState(
    Array(cartItems.length).fill(false)
  );
  const noteInputRefs = useRef({}); // {{ edit_1 }}

  // Modified note handling functions
  const handleNoteChange = (index, newNote) => { // {{ edit_2 }}
    // Update the input value directly using ref
    if (noteInputRefs.current[index]) {
      noteInputRefs.current[index].value = newNote;
    }

    // Debounce the state update to reduce re-renders
    const timeoutId = setTimeout(() => {
      setCartItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[index] = { ...updatedItems[index], note: newNote };
        return updatedItems;
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleAddNoteClick = (index) => { // {{ edit_3 }}
    const updatedCartItems = cartItems.map((item, i) =>
      i === index
        ? { ...item, isEditing: true, note: item.note || "Nota: " }
        : item
    );
    setCartItems(updatedCartItems);

    // Focus the input after state update
    setTimeout(() => {
      if (noteInputRefs.current[index]) {
        noteInputRefs.current[index].focus();
      }
    }, 0);
  };

  const handleFinishEditing = (index) => { // {{ edit_4 }}
    // Get final value from ref
    const finalNote = noteInputRefs.current[index]?.value || "";

    setCartItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        isEditing: false,
        note: finalNote
      };
      return updatedItems;
    });
  };

  // Modified render section for the note input
  const renderNoteInput = (item, index) => { // {{ edit_5 }}
    if (item.isEditing) {
      return (
        <div>
          <input
            className="j-note-input"
            type="text"
            defaultValue={item.note}
            ref={el => noteInputRefs.current[index] = el}
            onChange={e => handleNoteChange(index, e.target.value)}
            onBlur={() => handleFinishEditing(index)}
            onKeyDown={e => {
              if (e.key === "Enter") handleFinishEditing(index);
            }}
          />
        </div>
      );
    }

    return (
      <div>
        {item.note ? (
          <p
            className="j-nota-blue"
            style={{ cursor: "pointer" }}
            onClick={() => handleAddNoteClick(index)}
          >
            {item.note}
          </p>
        ) : (
          <button
            className="j-note-final-button"
            onClick={() =>
              handleAddNoteClick(index)}
          >
            + Agregar nota
          </button>
        )}
      </div>
    );
  };

  useEffect(() => {
    // Load cart items from localStorage
    const storedCartItems = localStorage.getItem("cartItems");
    const storedCountsoup = localStorage.getItem("countsoup");
    const last = localStorage.getItem("lastOrder");               //change
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
      setLastOrder(last);                          //change
    }
    if (storedCountsoup) {
      setCountsoup(JSON.parse(storedCountsoup));
    }
  }, []); // Empty dependency array to run once on component mount

  useEffect(
    () => {
      // Save cart items to localStorage whenever cartItems or countsoup change
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("countsoup", JSON.stringify(countsoup));
    },
    [cartItems, countsoup]
  );

  const handleAccordionClick = (value) => {
    setSelectedRadio(value);
  };

  const initialCustomerData = {
    cashAmount: "",      // Amount for cash payment
    debitAmount: "",     // Amount for debit payment
    creditAmount: "",    // Amount for credit payment
    transferAmount: "",  // Amount for transfer payment
    turn: ""
  };

  const getTotalCost = () => {
    return (
      cartItems.reduce(
        (total, item, index) => total + parseInt(item.price) * item.count,
        0
      )
    );
  };
  const totalCost = getTotalCost();
  const discount = 1.0;
  const finalTotal = totalCost - discount;
  const taxAmount = finalTotal * 0.19;


  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [customerData, setCustomerData] = useState(initialCustomerData);
  console.log(selectedCheckboxes);

  const handleCheckboxChange = (value) => {
    // console.log(value);
    if (selectedCheckboxes.includes(value)) {

      if (customerData?.[value + "Amount"]) {
        setCustomerData((prevData) => ({
          ...prevData,
          turn: customerData?.[value + "Amount"] ? parseFloat(customerData?.turn || 0) + parseFloat(-customerData?.[value + "Amount"]) : 0
        }));
      }
      setSelectedCheckboxes((prev) => prev.filter((item) => item !== value));

      setCustomerData((prevData) => ({
        ...prevData,
        [value + "Amount"]: ""
      }));
    } else {
      setSelectedCheckboxes((prev) => [...prev, value]);
      setCustomerData({
        ...customerData,
        [value + "Amount"]: customerData?.turn && customerData.turn < 0 ?
          (Math.abs(customerData.turn.toFixed(2))).toString() : '',
        turn: customerData?.turn && customerData.turn > 0 ? customerData.turn : 0
      });
    }
    // Clear the payment type error when a type is selected
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      paymentType: undefined
    }));
  };



  const handleChange = (event) => {
    let { name, value } = event.target;
    value = value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
    console.log(name);
    const otherbox = selectedCheckboxes.filter(item => !name.includes(item))
    console.log(otherbox);
    setCustomerData((prevState) => {
      const currentValue = parseFloat(value) || 0;
      const totalDue = finalTotal + taxAmount + tipAmount;
      const otherAmount = Math.max(totalDue - currentValue, 0);

      // console.log(otherAmount);

      const updatedState = {
        ...prevState,
        [name]: value,
      };

      // console.log(updatedState);


      if (otherbox.length > 0) {
        const otherPaymentType = otherbox[0] + 'Amount';
        updatedState[otherPaymentType] = otherAmount.toFixed(2);
      }
      // console.log(updatedState);

      // New calculation for turn
      const totalAmount = parseFloat(updatedState.cashAmount || 0) + parseFloat(updatedState.debitAmount || 0) + parseFloat(updatedState.creditAmount || 0) + parseFloat(updatedState.transferAmount || 0);
      updatedState.turn = totalAmount - (finalTotal + taxAmount + tipAmount); // Update turn based on total amounts
      return updatedState;

    });
    // console.log("Payment", customerData);
    setFormErrors((prevState) => ({
      ...prevState,
      amount: undefined
    }));
  };


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
    [showCreSuc]
  );

  useEffect(
    () => {
      let successTimer;
      if (showSuccess) {
        successTimer = setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      }

      return () => clearTimeout(successTimer);
    },
    [showSuccess]
  );

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handleCloseCreSuc = () => {
    setShowCreSuc(false);
  };

  const handleAccordionSelect = (eventKey) => {
    setActiveAccordionItem(eventKey);
    setSelectedRadio("0");
  };
  useEffect(
    () => {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    },
    [cartItems]
  );
  // cart
  // const handleFinishEditing = (index) => {
  //   const updatedCartItems = cartItems.map(
  //     (item, i) => (i === index ? { ...item, isEditing: false } : item)
  //   );
  //   setCartItems(updatedCartItems);
  // };




  // ==== Get BOX Data =====

  const [boxId, setBoxId] = useState('')

  const fetchBoxData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get-boxs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setBoxId(data.find((v) => v.user_id == userId));
    } catch (error) {
      console.error(
        "Error fetching box:",
        error.response ? error.response.data : error.message
      );
    }
  }

  // data
  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("currentOrder")) || {};
    setOrderType(storedOrder);
    fetchBoxData();
  }, []);


  const handleOrderTypeChange = (e) => {

    if (e.target.value == 0) {
      setOrderTypeError("Por favor seleccione un tipo de pedido");
    } else {
      setOrderTypeError("");
    }
    const newOrderType = e.target.value;
    const updatedOrder = { ...orderType, orderType: newOrderType };
    setOrderType(updatedOrder);
    localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
  };
  const paymentData = {
    ...payment,
    amount: customerData.amount,
    type: selectedCheckboxes[0],
    order_master_id: orderType.orderId,
    return: customerData.turn
  };

  const validateForm = () => {
    let errors = {};

    // Validate payment type selection
    if (selectedCheckboxes.length === 0) {
      errors.paymentType = "Por favor seleccione un tipo de pago";
    }

    const totalWithTax = finalTotal + taxAmount + tipAmount;

    const totalPaymentAmount = parseFloat(customerData.cashAmount || 0) + parseFloat(customerData.debitAmount || 0) + parseFloat(customerData.creditAmount || 0) + parseFloat(customerData.transferAmount || 0);
    console.log(totalPaymentAmount < totalWithTax, totalPaymentAmount <= 0)
    // Validate payment amount
    if (!totalPaymentAmount || totalPaymentAmount <= 0) {
      errors.amount = "Por favor, introduzca un importe de pago válido";
      // } else if (parseFloat(customerData.amount) < totalWithTax.toFixed(2)) {

    } else if (totalPaymentAmount < totalWithTax.toFixed(2)) {
      errors.amount = "El monto del pago debe cubrir el costo total";
    }
    return errors;
  };


  // submit
  const handleSubmit = async () => {

    if (!orderType || orderType?.orderType == 0) {
      // console.log("Dgd");
      // setOrderTypeError("Por favor seleccione tipo de pedido");
      setOrderTypeError("Por favor seleccione un tipo de pedido");
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      // Display errors to user
      setFormErrors(errors);
      return;
    }
    const totalPaymentAmount = parseFloat(customerData.cashAmount || 0) + parseFloat(customerData.debitAmount || 0) + parseFloat(customerData.creditAmount || 0) + parseFloat(customerData.transferAmount || 0);

    let url;
    let orderData;

    if (orderType.order == "old") {

      console.log("oldold");

      url = `/order/orderUpdateItem/${orderType.orderId}`

      const orderDetails = cartItems.map((item) => ({
        item_id: item.id,
        quantity: item.count,
        notes: item.note ? item.note.replace(/^Nota:\s*/i, "").trim() : "",
        order_master_id: orderType.orderId,
        id: item.OdId
      }));

      orderData = {
        tip: tipAmount ? tipAmount : 0,
        payment_type: selectedCheckboxes[0],
        order_id: orderType.orderId,
        admin_id: 154,
        transaction_code: 1,
        order_details: orderDetails,
        box_id: boxId?.id != 'undefined' ? boxId?.id : '',
        customer_name: payment.firstname || payment.business_name
      }

    } else {

      url = '/order/place_new'

      const orderDetails = cartItems.map((item) => ({
        item_id: item.id,
        quantity: item.count,
        notes: item.note ? item.note.replace(/^Nota:\s*/i, "").trim() : "",
        admin_id: admin_id
      }));

      orderData = {
        order_details: orderDetails,
        order_master: {
          order_type: orderType.orderType,
          payment_type: selectedCheckboxes[0],
          status: "received",
          discount: discount,
          user_id: userId,
          delivery_cost: 0,
          customer_name:
            payment.firstname && payment.firstname.trim() !== ""
              ? payment.firstname
              : payment.business_name || "",
          reason: "",
          person: "",
          tip: tipAmount,
          transaction_code: 1,
          box_id: boxId?.id != 'undefined' ? boxId?.id : '',
        },
        admin_id: admin_id,
      };
    }
    const paymentData = {
      ...payment,
      amount: totalPaymentAmount,
      type: selectedCheckboxes,
      order_master_id: orderType.orderId,
      return: customerData.turn,
      admin_id: admin_id,
    };

    // console.log(paymentData);

    setIsProcessing(true)

    try {
      // console.log(orderData);

      const response = await axios.post(`${apiUrl}${url}`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response.data)
      if (response.data.success || response.data[1] == 200) {
        try {
          const responsePayment = await axios.post(
            `${apiUrl}/payment/insert`,
            paymentData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          setIsProcessing(false)
          console.log(responsePayment);

          if (responsePayment.data.success) {

            if (tableId) {
              try {
                const resStatus = await axios.post(`${apiUrl}/table/updateStatus`, {
                  table_id: tableId,
                  status: "available",
                  admin_id: admin_id
                }, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                })
              } catch (error) {
                console.log("Table Status not Upadte ," + error.message);
              }
            }
            localStorage.removeItem("cartItems");
            localStorage.removeItem("currentOrder");
            localStorage.removeItem("payment");
            handleShow11();

          }
        } catch (error) {
          setIsProcessing(false)
          console.log("Payment not done." + error.message);
        }
      } else {
        console.log(response);
        alert(response.data.message)
      }
    } catch (error) {
      setIsProcessing(false)
      console.error("Error creating order : ", error);
    }
    setIsProcessing(false)
    // localStorage.removeItem("cartItems");
    // localStorage.removeItem("currentOrder");
    // localStorage.removeItem("payment");
    // handleShow11();
  };
  // print recipt
  const handlePrint = () => {
    const printContent = document.getElementById("receipt-content");
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
          navigate("/home/usa");
        }, 500);
      };
    } else {
      console.error("Receipt content not found");
    }
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
            <div className="j-counter-header j_counter_header_last_change" >
              <h2 className="text-white mb-3 sjfs-18">Mostrador</h2>
              <div className="j-menu-bg-color ">
                <div className="j-tracker-mar d-flex justify-content-between ">
                  <div className="line1  flex-grow-1">
                    <Link className="text-decoration-none px-2 sj_text_dark">
                      <FaCircleCheck className="mx-1" />
                      <span>Artículos</span>
                    </Link>
                  </div>
                  <div className="  flex-grow-1 text-center">
                    <Link
                      to={"/home/usa/bhomedelivery/datos"}
                      className="text-decoration-none px-2 sj_text_dark"
                    >
                      <FaCircleCheck className="mx-1" />
                      <span>Datos</span>
                    </Link>
                  </div>
                  <div className="line2  flex-grow-1 text-end">
                    <Link className="text-decoration-none px-2 j-counter-path-color">
                      <FaCircleCheck className="mx-1" />
                      <span>Pago</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className=" mt-2 mx-2 sj_hwidth">
              <div className="bg_gay p-4">
                <div className="j-final-stage">
                  <h5 className="mb-2 sjfs-18">Tipos de pago</h5>
                  <button className="sj_bg_sky j_bg_sky" onClick={handleShow}>
                    <FaPlus className="j-icon-font-1" />
                    Agregar propina
                  </button>
                </div>

                <Modal
                  show={show}
                  onHide={handleClose}
                  backdrop={true}
                  keyboard={false}
                  className="m_modal jay-modal"
                >
                  <Modal.Header
                    closeButton
                    className="m_borbot b_border_bb mx-3 ps-0"
                  >
                    <Modal.Title className="j-tbl-text-10">
                      Agregar propina
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="border-0 pb-0 ">
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
                        value={`$${price}`}
                        onChange={handleprice}
                      />
                      {tipError && (
                        <p className="errormessage text-danger">{tipError}</p>
                      )}
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="border-0 pt-0">
                    <Button
                      className="j-tbl-btn-font-1 b_btn_pop"
                      variant="primary"
                      onClick={() => {
                        if (!price) {
                          setTipError('Ingrese una cantidad')
                          return
                        }
                        handleShowCreSubSuc();
                        handleClose();
                      }}
                    >
                      Aceptar
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={showCreSubSuc}
                  onHide={handleCloseCreSubSuc}
                  backdrop={true}
                  keyboard={false}
                  className="m_modal jay-modal"
                >
                  <Modal.Header closeButton className="border-0" />
                  <Modal.Body>
                    <div className="text-center">
                      <img src={require("../Image/check-circle.png")} alt="" />
                      <p className="mb-0 mt-2 h6">Propina agregada</p>
                      <p className="opacity-75">
                        Su propina ha sido agregada exitosamente
                      </p>
                    </div>
                  </Modal.Body>
                </Modal>

                <p className="j-final-p sjfs-14 pb-3">
                  Puedes seleccionar uno o mas
                </p>

                {formErrors.paymentType && (
                  <p className="errormessage text-danger">
                    {formErrors.paymentType}
                  </p>
                )}
                <Accordion className="sj_accordion" alwaysOpen>
                  <Accordion.Item eventKey="0" className="mb-2">
                    <Accordion.Header>
                      <div
                        onClick={() => handleCheckboxChange("cash")}
                        className={`sj_bg_dark px-4 py-2 sj_w-75 ${selectedCheckboxes.includes(
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
                                id="cashAmount" // change
                                name="cashAmount" // change
                                value={`$${customerData.cashAmount || ""}`} // change
                                onChange={handleChange}
                                className="input_bg_dark w-full px-4 py-2 text-white sj_width_mobil"
                              />
                              {formErrors.amount && (
                                <p className="errormessage text-danger">
                                  {formErrors.amount}
                                </p>
                              )}
                            </div>
                            <div className="flex-grow-1">
                              <label className="mb-2">Vuelto</label>
                              <br />
                              <input
                                type="email"
                                id="email"
                                name="turn"
                                value={`$${customerData.turn ? customerData.turn.toFixed(2) : ""}`}
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
                        className={`sj_bg_dark px-4 py-2 sj_w-75 ${selectedCheckboxes.includes("debit") ? "active" : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="receiptType"
                          value="debit"
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
                              id="debitAmount" // Ensure this ID is unique
                              name="debitAmount" // Ensure this name matches the state
                              value={`$${customerData.debitAmount || ""}`} // Ensure correct binding
                              onChange={handleChange}
                              className="sj_bg_dark sj_width_input px-4 py-2 text-white"
                            />
                            {formErrors.amount && (
                              <p className="errormessage text-danger">
                                {formErrors.amount}
                              </p>
                            )}
                          </form>
                        </div>
                      </Accordion.Body>
                    )}
                  </Accordion.Item>
                  <Accordion.Item eventKey="2" className="mb-2">
                    <Accordion.Header>
                      <div
                        onClick={() => handleCheckboxChange("credit")}
                        className={`sj_bg_dark px-4 py-2 sj_w-75 ${selectedCheckboxes.includes(
                          "credit"
                        )
                          ? "active"
                          : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="receiptType"
                          value="credit"
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
                                id="creditAmount"
                                name="creditAmount"
                                value={`$${customerData.creditAmount || ""}`}
                                onChange={handleChange}
                                className="input_bg_dark w-full px-4 py-2 text-white sj_width_mobil"
                              />
                              {formErrors.amount && (
                                <p className="errormessage text-danger">
                                  {formErrors.amount}
                                </p>
                              )}
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
                        className={`sj_bg_dark px-4 py-2 sj_w-75 ${selectedCheckboxes.includes(
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
                              id="transferAmount"
                              name="transferAmount"
                              value={`$${customerData.transferAmount || ""}`}
                              onChange={handleChange}
                              className="sj_bg_dark sj_width_input px-4 py-2 text-white"
                            />
                            {formErrors.amount && (
                              <p className="errormessage text-danger">
                                {formErrors.amount}
                              </p>
                            )}
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
            className="j-counter-price bg_gay bg_margin position-sticky"
            style={{ top: "77px" }}
          >
            <div className="j_position_fixed j_b_hd_width ak-position">
              <div className="b-summary-center mb-4 align-items-center text-white d-flex justify-content-between">
                {/* <div className="j_position_fixed j_b_hd_width"> */}
                <h2 className="text-white j-kds-body-text-1000 mb-0">Resumen</h2>
                {/* <FaXmark className="b-icon" /> */}
              </div>
              <div className="b-date-time d-flex flex-wrap column-gap-3 align-items-center justify-content-end text-white">
                <div>
                  <FaCalendarAlt className="mb-1" />
                  <p className="mb-0 ms-2 d-inline-block">{new Date().toLocaleDateString('en-GB')}</p>
                </div>
                <div>
                  <MdOutlineAccessTimeFilled className="mb-1" />
                  <p className="mb-0 ms-2 d-inline-block">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <h3 className="text-white j-kds-body-text-1000 ak-w-100">Datos</h3>
              {/* <h2 className="text-white j-kds-body-text-1000">Resumen</h2> */}
              <div className="j-counter-price-data mt-3 ak-w-100">
                <form className="d-flex flex-wrap w-100">
                  <div className="j-orders-type ak-w-50">
                    <label className="j-label-name  text-white mb-2 j-tbl-font-6 ">
                      Tipo pedido
                    </label>
                    <select
                      className="form-select j-input-name-2 j-input-name-23 ak-input"
                      onChange={handleOrderTypeChange}
                      value={orderType.orderType}
                    // value={orType.orderType}
                    >
                      <option value="0">Seleccionar</option>
                      <option value="delivery">Entrega</option>
                      <option value="local">Local</option>
                      <option value="withdraw">Retirar</option>
                    </select>
                    {orderTypeError && (
                      <div className="text-danger errormessage">{orderTypeError}</div>
                    )}
                  </div>
                  <div className="align-content-end mt-2 ak-w-50">
                    {/* {console.log(orderType)} */}

                    {(orderType && orderType.orderType != 0) && <div
                      className={`bj-delivery-text-2  b_btn1 m-1 p-2 ${orderType.orderType?.toLowerCase() === 'local'
                        ? 'b_indigo'
                        : orderType.orderType?.toLowerCase() === 'delivery'
                          ? 'b_blue'
                          : orderType.orderType?.toLowerCase().includes("with")
                            ? 'b_purple'
                            : 'b_ora text-danger'
                        }`}
                    >
                      {orderType.orderType?.toLowerCase() === 'local'
                        ? 'Local'
                        : orderType.orderType?.toLowerCase().includes("with")
                          ? 'Retirar'
                          : orderType.orderType?.toLowerCase() === 'delivery'
                            ? 'Entrega'
                            : orderType.orderType}
                    </div>}

                  </div>
                </form>
                {/* <h3 className="text-white j-kds-body-text-1000 w-100">Datos</h3> */}
                {/* <div className="b-date-time b_date_time2 d-flex flex-wrap column-gap-3 me-2 justify-content-end text-white">
                  <div>
                    <FaCalendarAlt className="mb-2" />
                    <p className="mb-0 ms-2 d-inline-block">{new Date().toLocaleDateString('en-GB')}</p>
                  </div>
                  <div>
                    <MdOutlineAccessTimeFilled className="mb-2" />
                    <p className="mb-0 ms-2 d-inline-block">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div> */}
                {/* <div className="j_td_center">
                  <div className="j-busy-table j_busy_table_last d-flex align-items-center">
                    <div className=''>
                      <div style={{ fontWeight: "600", borderRadius: "10px" }} className={`bj-delivery-text-2  b_btn1 mb-3  p-0 text-nowrap d-flex  align-items-center justify-content-center 
                      ${orderType?.orderType.toLowerCase() === 'local' ? 'b_indigo' : orderType?.orderType?.toLowerCase() === 'order now' ? 'b_ora ' : orderType?.orderType?.toLowerCase() === 'delivery' ? 'b_blue' : orderType?.orderType?.toLowerCase() === 'uber' ? 'b_ora text-danger' : orderType?.orderType?.toLowerCase().includes("with") ? 'b_purple' : 'b_ora text-danger'}`}>
                        {orderType?.orderType?.toLowerCase() === 'local' ? 'Local' : orderType?.orderType?.toLowerCase().includes("with") ? 'Retiro ' : orderType?.orderType?.toLowerCase() === 'delivery' ? 'Entrega' : orderType?.orderType?.toLowerCase() === 'uber' ? 'Uber' : orderType?.orderType}
                      </div>
                    </div> */}
                {/* <div className="j-b-table" /> */}
                {/* <p className="j-table-color j-tbl-font-6">Ocupado</p> */}
                {/* </div> */}

                {/* <div className="b-date-time b_date_time2 d-flex align-items-center justify-content-end text-white">
                    <FaCalendarAlt />
                    <p className="mb-0 ms-2 me-3">{new Date().toLocaleDateString('en-GB')}</p>
                    <MdOutlineAccessTimeFilled />
                    <p className="mb-0 ms-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div> */}

                {/* <div className="b-date-time b_date_time2  d-flex align-items-center">
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
                      {elapsedTime}
                    </p>
                  </div> */}
                {/* </div> */}

                {/* <div className="j-orders-inputs j_td_inputs ak-w-100">
                  <div className="j-orders-code ak-w-100">
                    <label className="j-label-name text-white mb-2 j-tbl-btn-font-1">
                      Quién registra
                    </label>
                    <div>
                      <input
                        className="j-input-name j_input_name520 ak-w-100"
                        type="text"
                        // placeholder={orderType?.name}
                        disabled
                        value={userName}
                      />
                    </div>
                  </div> */}
                {/* <div className="j-orders-code">
                        <label className="j-label-name j-tbl-btn-font-1 text-white mb-2">
                          Personas
                        </label>
                         <div>
                           <input
                              className="j-input-name630"
                                type="text"
                                   placeholder="5"
                                     value={tableData[0]?.person} />
                         </div>
                         </div> */}
                {/* </div> */}

                {/* <div className="j-orders-inputs j_inputs_block">
                  <div className="j-orders-code">
                    <label className="j-label-name text-white mb-2 j-tbl-font-6 ">
                      Código pedido
                    </label>
                    <input
                      className="j-input-name j_input_name2"
                      type="text"
                      placeholder="01234"
                      value={orderType.orderId}
                    />
                  </div>
                  <div className="j-orders-type me-2">
                    <label className="j-label-name  text-white mb-2 j-tbl-font-6 ">
                      Tipo pedido
                    </label>
                    <select
                      className="form-select j-input-name-2 j-input-name-23"
                      onChange={handleOrderTypeChange}
                      value={orderType.orderType}
                    >
                      <option value="0">Seleccionar</option>
                      <option value="delivery">Entrega</option>
                      <option value="local">Local</option>
                      <option value="withdraw">Retirar</option>
                    </select>
                  </div>
                </div> */}

                {cartItems.length === 0 ? (
                  <div>
                    <div className="b-product-order text-center">
                      <MdRoomService className="i-product-order" />
                      <h6 className="h6-product-order text-white j-tbl-pop-1">
                        Mesa disponible
                      </h6>
                      <p className="p-product-order j-tbl-btn-font-1 ">
                        Agregar producto para empezar<br />
                        con el pedido de la mesa
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="ak-w-100">
                    <div className="j-counter-order ak-w-100">
                      <h3 className="text-white j-tbl-font-5 ak-w-100">Pedido </h3>
                      <div
                        className={`j-counter-order-data ${cartItems.length ===
                          0
                          ? "empty"
                          : "filled"}`}
                      >
                        {cartItems
                          .slice(0, showAllItems ? cartItems.length : 3)
                          .map((item, index) => (
                            <div
                              className="j-counter-order-border-fast"
                              key={item.id}
                            >
                              <div className="j-counter-order-img j_payment_final">
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
                                  <div className="j-counter-mix j-counter-mix-remove">
                                    <h3 className="mx-auto ps-2">{item.count}</h3>
                                  </div>
                                  <h4 className="text-white fw-semibold j_item_price d-flex">
                                    ${parseInt(item.price) * item.count}
                                  </h4>
                                </div>
                              </div>
                              <div
                                key={index}
                                className="text-white j-order-count-why"
                              >
                                {renderNoteInput(item, index)}
                              </div>
                            </div>
                          ))}
                        {cartItems.length > 3 && (
                          <Link
                            onClick={toggleShowAllItems}
                            className="sjfs-14"
                          >
                            {showAllItems ? "Ver menos" : "Ver más"}
                          </Link>
                        )}
                      </div>
                      <div className="j-counter-total ak-counter-total">
                        <h5 className="text-white j-tbl-text-15">
                          Costo total
                        </h5>
                        <div className="j-total-discount d-flex justify-content-between">
                          <p className="j-counter-text-2">Artículos</p>
                          <span className="text-white">
                            ${totalCost.toFixed(2)}
                          </span>
                        </div>
                        {tipAmount > 0 && (
                          <div className="j-total-discount d-flex justify-content-between">
                            <p className="j-counter-text-2">Propina</p>
                            <span className="text-white">
                              ${tipAmount.toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="j-total-discount d-flex justify-content-between">
                          <p className="j-counter-text-2">Descuentos</p>
                          <span className="text-white">
                            ${discount.toFixed(2)}
                          </span>
                        </div>

                        <div className="j-border-bottom-counter">
                          <div className="j-total-discount d-flex justify-content-between">
                            <p className="j-counter-text-2">IVA 19.00%</p>
                            <span className="text-white">${taxAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="j-total-discount my-2 d-flex justify-content-between">
                          <p className="text-white bj-delivery-text-153">
                            Total
                          </p>
                          <span className="text-white bj-delivery-text-153">
                            ${(finalTotal + taxAmount + tipAmount).toFixed(2)}
                          </span>
                        </div>
                        <div className="btn w-100 j-btn-primary text-white">
                          <div
                            className="text-white text-decoration-none btn-primary m-articles-text-2"
                            onClick={handleSubmit}
                          >
                            Cobrar
                          </div>
                        </div>
                        <Modal
                          show={show11}
                          onHide={handleClose11}
                          backdrop="static"
                          keyboard={false}
                          className="m_modal j_topmodal"
                        >
                          <Modal.Header
                            closeButton
                            className="j-caja-border-bottom p-0 m-3 mb-0 pb-3"
                          >
                            <Modal.Title
                              className="modal-title j-caja-pop-up-text-1"
                              id="staticBackdropLabel"
                            >
                              Comprobante de venta
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Recipt
                              payment={paymentData}
                              item={cartItems}
                              discount={discount}
                              paymentAmt={customerData}
                              paymentType={selectedCheckboxes}
                            />
                            {console.log("sas", customerData)}
                          </Modal.Body>
                          <Modal.Footer className="sjmodenone">
                            <Button
                              className="btn sjbtnskylight border-0 text-white j-caja-text-1"
                              onClick={() => {
                                handleClose11();
                                handlePrint();
                              }}
                            >
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
                        <Modal
                          show={showLoader}
                          backdrop={true}
                          keyboard={false}
                          className="m_modal jay-modal"
                        >
                          <Modal.Header
                            closeButton={false}
                            className="border-0"
                          />
                          <Modal.Body>
                            <div className="text-center">
                              <div className="j-loader" aria-label="loading" />
                              <p className="opacity-75 mt-3">Procesando pago</p>
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


                        <Modal
                          show={showSuccess}
                          onHide={handleCloseSuccess}
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
                              <p className="opacity-75 mt-3">
                                Venta realizada exitosamente
                              </p>
                            </div>
                          </Modal.Body>
                        </Modal>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPago;
